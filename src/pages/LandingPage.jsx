import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Zap, Dna, CheckCircle2, Activity, FlaskConical } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero flex-col flex-center text-center mt-12 mb-12 gap-6 p-4">
        <div className="badge badge-primary mb-2" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Platform Release v1.0</div>
        <h1 className="hero-title">
          A Multi-Model Computational Platform for <span className="text-gradient">Selective RecA Inhibitor Discovery</span>
        </h1>
        <p className="hero-subtitle">
          HELIX accelerates the discovery of antibiotic adjuvants by combining multi-objective ML potency prediction, structure-based docking, and generative design to selectively target bacterial RecA without inhibiting human RAD51.
        </p>

        <div className="hero-ctas flex-center gap-4 mt-6">
          <Link to="/database" className="btn btn-primary btn-hero">
            Explore Compound Database <Search size={20} />
          </Link>
          <Link to="/evaluate" className="btn btn-secondary btn-hero">
            Evaluate a Ligand <FlaskConical size={20} />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mb-12 mt-12">
        <div className="grid grid-cols-4 gap-4 stats-grid">
          <div className="card text-center stat-card">
            <div className="text-gradient stat-value">200K+</div>
            <div className="stat-label">Compounds Screened</div>
          </div>
          <div className="card text-center stat-card">
            <div className="text-gradient stat-value">&gt;1,000</div>
            <div className="stat-label">Predicted Candidates</div>
          </div>
          <div className="card text-center stat-card">
            <div className="text-gradient stat-value">~60</div>
            <div className="stat-label">High-Priority Leads</div>
          </div>
          <div className="card text-center stat-card">
            <div className="text-gradient stat-value">1487×</div>
            <div className="stat-label">Best Selectivity (vs RAD51)</div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="container mb-12 mt-12">
        <h2 className="text-center mb-8" style={{ fontSize: '2rem' }}>Discovery Pipeline</h2>
        <div className="grid grid-cols-4 gap-6 pipeline-grid">
          <div className="card glass-panel flex-col gap-3 pipeline-card">
            <div className="icon-wrapper bg-blue-soft text-blue">
              <Search size={28} />
            </div>
            <h3 className="pipeline-step">1. Virtual Screening</h3>
            <p className="pipeline-desc">Structure-based docking of over 200,000 diverse library compounds.</p>
          </div>
          <div className="card glass-panel flex-col gap-3 pipeline-card">
            <div className="icon-wrapper bg-emerald-soft text-emerald">
              <Zap size={28} />
            </div>
            <h3 className="pipeline-step">2. Potency Prediction</h3>
            <p className="pipeline-desc">Multi-objective ML regressor to predict RecA and RAD51 binding affinities.</p>
          </div>
          <div className="card glass-panel flex-col gap-3 pipeline-card">
            <div className="icon-wrapper bg-sky-soft text-sky">
              <Dna size={28} />
            </div>
            <h3 className="pipeline-step">3. Generative Design</h3>
            <p className="pipeline-desc">LCG-VAE targeted generation for localized chemical optimization.</p>
          </div>
          <div className="card glass-panel flex-col gap-3 pipeline-card">
            <div className="icon-wrapper bg-amber-soft text-amber">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="pipeline-step">4. Translational Filter</h3>
            <p className="pipeline-desc">ADMET filtering, synthesis feasibility, and lead-candidate selection.</p>
          </div>
        </div>
      </section>

      {/* Informational Section */}
      <section className="container mb-12 mt-12 pb-12">
        <div className="card landing-info-card">
          <div className="grid grid-cols-2 gap-8 info-grid">
            <div>
              <h2 className="info-title">Why Target RecA?</h2>
              <p className="info-text">
                RecA is a critical bacterial protein involved in homologous recombination and the SOS response, making it a prime target for antibiotic adjuvants.
                Inhibiting RecA sensitizes bacteria to existing antibiotics and reduces the development of resistance.
              </p>
              <p className="info-text">
                However, cross-reactivity with the human ortholog, RAD51, leads to severe toxicity.
                <span className="info-highlight"> HELIX explicitly models for high selectivity</span>, targeting unique
                pockets in RecA to dramatically reduce RAD51 affinity.
              </p>
              <Link to="/methodology" className="btn btn-secondary">
                Read full methodology <ArrowRight size={18} />
              </Link>
            </div>
            <div className="flex-center info-visual">
              <div className="text-center flex-col flex-center gap-4">
                <Activity size={80} className="visual-icon" />
                <p className="mono visual-label">HELIX Predictor Module</p>
                <div className="badge badge-neutral mt-2">v1.0.4 Online</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
