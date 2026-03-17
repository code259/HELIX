import csv
import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

# Constants
SPECIAL_INPUT = Path("/Users/nikhilmaturi/reca/HELIX/public/data/reca_inference_predictions copy.csv")
DEFAULT_AGGREGATE = Path("/Users/nikhilmaturi/reca/HELIX/public/data/reca_inference_validation_aggregate copy.csv")

class MoleculeRecord:
    def __init__(self, data: Dict[str, Any]):
        self.ligand_id = data.get("ligand_id")
        self.smiles = data.get("smiles")
        self.data = data

def read_molecule_rows(input_path: Union[str, Path], limit: Optional[int] = None) -> List[MoleculeRecord]:
    records = []
    with open(input_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            if limit is not None and i >= limit:
                break
            records.append(MoleculeRecord(row))
    return records

def build_base_row(record: MoleculeRecord) -> Dict[str, Any]:
    # Return basic info from the original record to preserve it
    return {
        "ligand_id": record.ligand_id,
        "smiles": record.smiles,
    }

def bool_to_label(value: bool) -> str:
    return "yes" if value else "no"

def safe_round(value: Any, digits: int = 3) -> Any:
    try:
        return round(float(value), digits)
    except (TypeError, ValueError):
        return value

def dedupe_preserve_order(items: List[Any]) -> List[Any]:
    seen = set()
    return [x for x in items if not (x in seen or seen.add(x))]

def script_output_path(input_path: Union[str, Path], suffix: str, explicit_output: Optional[Union[str, Path]] = None) -> Path:
    if explicit_output:
        return Path(explicit_output)
    input_path = Path(input_path)
    return input_path.parent / f"{input_path.stem}_{suffix}.csv"

def write_csv(output_path: Path, rows: List[Dict[str, Any]]) -> Path:
    if not rows:
        return output_path
    
    fieldnames = rows[0].keys()
    with open(output_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    return output_path

def merge_into_aggregate(
    input_csv: Union[str, Path], 
    new_rows: List[Dict[str, Any]], 
    explicit_output: Optional[Union[str, Path]] = None
) -> Path:
    output_path = Path(explicit_output) if explicit_output else DEFAULT_AGGREGATE
    
    # Load existing if it exists
    existing_data = {}
    if output_path.exists():
        with open(output_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                existing_data[row["smiles"]] = row
                
    # Merge new data
    for row in new_rows:
        smiles = row["smiles"]
        if smiles in existing_data:
            existing_data[smiles].update(row)
        else:
            existing_data[smiles] = row
            
    # Write back
    write_csv(output_path, list(existing_data.values()))
    return output_path
