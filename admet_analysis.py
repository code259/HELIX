from __future__ import annotations

import argparse
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import Crippen, Descriptors, Lipinski, QED, rdMolDescriptors
from rdkit.Chem.FilterCatalog import FilterCatalog, FilterCatalogParams

from validation_shared import (
    SPECIAL_INPUT,
    bool_to_label,
    build_base_row,
    dedupe_preserve_order,
    merge_into_aggregate,
    read_molecule_rows,
    safe_round,
    script_output_path,
    write_csv,
)

STABILITY_ALERT_PATTERNS = [
    ("ester_hydrolysis", Chem.MolFromSmarts("[CX3](=O)[OX2H0][#6]"), 2),
    ("carbonate_hydrolysis", Chem.MolFromSmarts("[OX2H0][CX3](=O)[OX2H0]"), 2),
    ("carbamate_hydrolysis", Chem.MolFromSmarts("[NX3][CX3](=O)[OX2H0][#6]"), 2),
    ("imine_instability", Chem.MolFromSmarts("[CX3]=[NX2]"), 1),
    ("oxime_instability", Chem.MolFromSmarts("[CX3]=N[OX2H0,OX2H1]"), 1),
    ("acetal_ketal", Chem.MolFromSmarts("[CX4]([OX2][#6])([OX2][#6])"), 2),
    ("sulfonate_ester", Chem.MolFromSmarts("S(=O)(=O)[OX2][#6]"), 2),
]

METABOLISM_ALERT_PATTERNS = [
    ("benzylic_oxidation", Chem.MolFromSmarts("[c][CH2][#6,#7,#8,#16]"), 1),
    ("allylic_oxidation", Chem.MolFromSmarts("C=CC[CH3,CH2]"), 1),
    ("tertiary_amine_dealkylation", Chem.MolFromSmarts("[NX3;H0;!$([N+])](~[#6])(~[#6])~[#6]"), 2),
    ("anisole_o_dealkylation", Chem.MolFromSmarts("[c][OX2][CH3,CH2]"), 1),
    ("thioether_oxidation", Chem.MolFromSmarts("[#6]-[SX2]-[#6]"), 1),
    ("aniline_conjugation", Chem.MolFromSmarts("[c][NX3H2,NX3H1]"), 1),
    ("phenol_conjugation", Chem.MolFromSmarts("[c][OX2H]"), 1),
]


def build_catalog(*catalog_names: FilterCatalogParams.FilterCatalogs) -> FilterCatalog:
    params = FilterCatalogParams()
    for catalog_name in catalog_names:
        params.AddCatalog(catalog_name)
    return FilterCatalog(params)


PAINS_CATALOG = build_catalog(FilterCatalogParams.FilterCatalogs.PAINS)
BRENK_CATALOG = build_catalog(FilterCatalogParams.FilterCatalogs.BRENK)


def formal_charge(mol: Chem.Mol) -> int:
    return sum(atom.GetFormalCharge() for atom in mol.GetAtoms())


def aromatic_proportion(mol: Chem.Mol) -> float:
    heavy_atoms = max(mol.GetNumHeavyAtoms(), 1)
    aromatic_atoms = sum(1 for atom in mol.GetAtoms() if atom.GetIsAromatic())
    return aromatic_atoms / heavy_atoms


def esol_log_s(mw: float, logp: float, rotatable_bonds: int, aromatic_prop: float) -> float:
    return 0.16 - (1.5 * logp) - (0.0062 * mw) + (0.066 * rotatable_bonds) + (0.066 * aromatic_prop)


def esol_class(log_s: float) -> str:
    if log_s > 0:
        return "highly_soluble"
    if log_s > -2:
        return "very_soluble"
    if log_s > -4:
        return "soluble"
    if log_s > -6:
        return "moderately_soluble"
    if log_s > -10:
        return "poorly_soluble"
    return "practically_insoluble"


def collect_alerts(mol: Chem.Mol, patterns: list[tuple[str, Chem.Mol | None, int]]) -> tuple[list[str], int]:
    alerts: list[str] = []
    total_weight = 0
    for name, pattern, weight in patterns:
        if pattern is not None and mol.HasSubstructMatch(pattern):
            alerts.append(name)
            total_weight += weight
    return dedupe_preserve_order(alerts), total_weight


def catalog_hits(catalog: FilterCatalog, mol: Chem.Mol) -> list[str]:
    return dedupe_preserve_order(entry.GetDescription() for entry in catalog.GetMatches(mol))


def lipinski_violations(mw: float, logp: float, hba: int, hbd: int) -> list[str]:
    violations: list[str] = []
    if mw > 500:
        violations.append("mw_gt_500")
    if logp > 5:
        violations.append("logp_gt_5")
    if hba > 10:
        violations.append("hba_gt_10")
    if hbd > 5:
        violations.append("hbd_gt_5")
    return violations


def ghose_violations(mw: float, logp: float, atom_count: int, molar_refractivity: float) -> list[str]:
    violations: list[str] = []
    if not 160 <= mw <= 480:
        violations.append("mw_outside_160_480")
    if not -0.4 <= logp <= 5.6:
        violations.append("logp_outside_-0.4_5.6")
    if not 20 <= atom_count <= 70:
        violations.append("atom_count_outside_20_70")
    if not 40 <= molar_refractivity <= 130:
        violations.append("mr_outside_40_130")
    return violations


def veber_violations(rotatable_bonds: int, tpsa: float) -> list[str]:
    violations: list[str] = []
    if rotatable_bonds > 10:
        violations.append("rotatable_bonds_gt_10")
    if tpsa > 140:
        violations.append("tpsa_gt_140")
    return violations


def egan_violations(logp: float, tpsa: float) -> list[str]:
    violations: list[str] = []
    if logp > 5.88:
        violations.append("logp_gt_5.88")
    if tpsa > 131.6:
        violations.append("tpsa_gt_131.6")
    return violations


def muegge_violations(
    mw: float,
    logp: float,
    tpsa: float,
    ring_count: int,
    carbon_count: int,
    hetero_count: int,
    rotatable_bonds: int,
    hba: int,
    hbd: int,
) -> list[str]:
    violations: list[str] = []
    if not 200 <= mw <= 600:
        violations.append("mw_outside_200_600")
    if not -2 <= logp <= 5:
        violations.append("logp_outside_-2_5")
    if tpsa > 150:
        violations.append("tpsa_gt_150")
    if ring_count > 7:
        violations.append("rings_gt_7")
    if carbon_count < 4:
        violations.append("carbon_count_lt_4")
    if hetero_count < 2:
        violations.append("hetero_count_lt_2")
    if rotatable_bonds > 15:
        violations.append("rotatable_bonds_gt_15")
    if hba > 10:
        violations.append("hba_gt_10")
    if hbd > 5:
        violations.append("hbd_gt_5")
    return violations


def lead_likeness_violations(mw: float, logp: float, rotatable_bonds: int) -> list[str]:
    violations: list[str] = []
    if not 250 <= mw <= 350:
        violations.append("mw_outside_250_350")
    if logp > 3.5:
        violations.append("logp_gt_3.5")
    if rotatable_bonds > 7:
        violations.append("rotatable_bonds_gt_7")
    return violations


def bioavailability_score(mol_charge: int, tpsa: float, lipinski_pass: bool, veber_pass: bool) -> float:
    if mol_charge < 0:
        if tpsa <= 75:
            return 0.85
        if tpsa <= 150:
            return 0.56
        return 0.11
    return 0.55 if lipinski_pass and veber_pass else 0.17


def heuristic_gi_absorption(logp: float, tpsa: float, rotatable_bonds: int) -> str:
    if -0.7 <= logp <= 5.0 and 20 <= tpsa <= 130 and rotatable_bonds <= 10:
        return "high"
    return "low"


def heuristic_bbb_permeation(logp: float, tpsa: float, mol_charge: int) -> str:
    if 0 <= logp <= 4.5 and tpsa <= 90 and abs(mol_charge) <= 1:
        return "likely"
    return "unlikely"


def analyze_molecule(record) -> dict[str, object]:
    row = build_base_row(record)
    mol = Chem.MolFromSmiles(record.smiles)
    if mol is None:
        row.update(
            {
                "admet_mode": "rdkit_local",
                "admet_status": "invalid_smiles",
            }
        )
        return row

    mw = Descriptors.MolWt(mol)
    logp = Crippen.MolLogP(mol)
    tpsa = rdMolDescriptors.CalcTPSA(mol)
    hba = Lipinski.NumHAcceptors(mol)
    hbd = Lipinski.NumHDonors(mol)
    rotatable_bonds = rdMolDescriptors.CalcNumRotatableBonds(mol)
    fraction_csp3 = rdMolDescriptors.CalcFractionCSP3(mol)
    molar_refractivity = Crippen.MolMR(mol)
    ring_count = rdMolDescriptors.CalcNumRings(mol)
    heavy_atoms = mol.GetNumHeavyAtoms()
    atom_count = mol.GetNumAtoms()
    aromatic_prop = aromatic_proportion(mol)
    formal = formal_charge(mol)
    carbon_count = sum(1 for atom in mol.GetAtoms() if atom.GetAtomicNum() == 6)
    hetero_count = sum(1 for atom in mol.GetAtoms() if atom.GetAtomicNum() not in (1, 6))

    lipinski = lipinski_violations(mw, logp, hba, hbd)
    ghose = ghose_violations(mw, logp, atom_count, molar_refractivity)
    veber = veber_violations(rotatable_bonds, tpsa)
    egan = egan_violations(logp, tpsa)
    muegge = muegge_violations(mw, logp, tpsa, ring_count, carbon_count, hetero_count, rotatable_bonds, hba, hbd)
    lead_like = lead_likeness_violations(mw, logp, rotatable_bonds)

    stability_alerts, stability_weight = collect_alerts(mol, STABILITY_ALERT_PATTERNS)
    metabolism_alerts, metabolism_weight = collect_alerts(mol, METABOLISM_ALERT_PATTERNS)
    pains_hits = catalog_hits(PAINS_CATALOG, mol)
    brenk_hits = catalog_hits(BRENK_CATALOG, mol)

    log_s = esol_log_s(mw, logp, rotatable_bonds, aromatic_prop)
    lipinski_pass = len(lipinski) <= 1
    veber_pass = len(veber) == 0

    row.update(
        {
            "admet_mode": "rdkit_local",
            "admet_status": "ok",
            "molecular_weight": safe_round(mw),
            "lipophilicity_logp": safe_round(logp),
            "molar_refractivity": safe_round(molar_refractivity),
            "topological_polar_surface_area": safe_round(tpsa),
            "hbond_acceptors": hba,
            "hbond_donors": hbd,
            "rotatable_bonds": rotatable_bonds,
            "heavy_atom_count": heavy_atoms,
            "ring_count": ring_count,
            "fraction_csp3": safe_round(fraction_csp3),
            "qed": safe_round(QED.qed(mol)),
            "formal_charge": formal,
            "esol_log_s": safe_round(log_s),
            "esol_solubility_class": esol_class(log_s),
            "stability_alerts": "|".join(stability_alerts),
            "stability_alert_count": len(stability_alerts),
            "stability_risk": "high" if stability_weight >= 4 else "medium" if stability_weight >= 2 else "low",
            "metabolism_alerts": "|".join(metabolism_alerts),
            "metabolism_alert_count": len(metabolism_alerts),
            "metabolism_risk": "high" if metabolism_weight >= 4 else "medium" if metabolism_weight >= 2 else "low",
            "pains_alerts": "|".join(pains_hits),
            "pains_alert_count": len(pains_hits),
            "brenk_alerts": "|".join(brenk_hits),
            "brenk_alert_count": len(brenk_hits),
            "lipinski_violations": "|".join(lipinski),
            "lipinski_violation_count": len(lipinski),
            "lipinski_pass": bool_to_label(lipinski_pass),
            "ghose_violations": "|".join(ghose),
            "ghose_pass": bool_to_label(len(ghose) == 0),
            "veber_violations": "|".join(veber),
            "veber_pass": bool_to_label(veber_pass),
            "egan_violations": "|".join(egan),
            "egan_pass": bool_to_label(len(egan) == 0),
            "muegge_violations": "|".join(muegge),
            "muegge_pass": bool_to_label(len(muegge) == 0),
            "lead_likeness_violations": "|".join(lead_like),
            "lead_likeness_pass": bool_to_label(len(lead_like) == 0),
            "bioavailability_score": safe_round(bioavailability_score(formal, tpsa, lipinski_pass, veber_pass), digits=2),
            "gi_absorption_heuristic": heuristic_gi_absorption(logp, tpsa, rotatable_bonds),
            "bbb_permeation_heuristic": heuristic_bbb_permeation(logp, tpsa, formal),
            "skin_permeation_log_kp": safe_round(-6.3 + (0.71 * logp) - (0.0061 * mw)),
        }
    )
    return row


def run_analysis(
    input_csv: str | Path,
    output_csv: str | Path | None = None,
    aggregate_output: str | Path | None = None,
    limit: int | None = None,
    skip_aggregate: bool = False,
) -> tuple[list[dict[str, object]], Path, Path | None]:
    records = read_molecule_rows(input_csv, limit=limit)
    rows = [analyze_molecule(record) for record in records]
    output_path = write_csv(script_output_path(input_csv, "admet", explicit_output=output_csv), rows)
    aggregate_path = None
    if not skip_aggregate:
        aggregate_path = merge_into_aggregate(input_csv, rows, explicit_output=aggregate_output)
    return rows, output_path, aggregate_path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run local SwissADME-like ADMET profiling on a CSV of molecules.",
    )
    parser.add_argument(
        "input_csv",
        nargs="?",
        default=str(SPECIAL_INPUT),
        help="Input CSV with at least a SMILES column. Defaults to reca_inference_predictions.csv.",
    )
    parser.add_argument("--output", help="Optional per-script output CSV path.")
    parser.add_argument("--aggregate-output", help="Optional merged aggregate CSV path.")
    parser.add_argument("--limit", type=int, help="Only analyze the first N valid molecules.")
    parser.add_argument(
        "--skip-aggregate",
        action="store_true",
        help="Skip updating the aggregate validation CSV.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    rows, output_path, aggregate_path = run_analysis(
        input_csv=args.input_csv,
        output_csv=args.output,
        aggregate_output=args.aggregate_output,
        limit=args.limit,
        skip_aggregate=args.skip_aggregate,
    )
    print(f"ADMET rows written: {len(rows)}")
    print(f"ADMET output: {output_path}")
    if aggregate_path is not None:
        print(f"Aggregate output: {aggregate_path}")


if __name__ == "__main__":
    main()
