import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Zap, Dna, CheckCircle2, Activity, FlaskConical } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero flex-col flex-center text-center mt-12 mb-12 gap-6 p-4">
        <div className="badge badge-primary mb-2" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Platform Release v1.0</div>
        <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, maxWidth: '900px', margin: '0 auto' }}>
          A Multi-Model Computational Platform for <span className="text-gradient">Selective RecA Inhibitor Discovery</span>
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '750px', margin: '0 auto' }}>
          HELIX accelerates the discovery of antibiotic adjuvants by combining multi-objective ML potency prediction, structure-based docking, and generative design to selectively target bacterial RecA without inhibiting human RAD51.
        </p>
        
        <div className="hero-ctas flex-center gap-4 mt-6">
          <Link to="/database" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
            Explore Compound Database <Search size={20} />
          </Link>
          <Link to="/evaluate" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
            Evaluate a Ligand <FlaskConical size={20} />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mb-12 mt-12">
        <div className="grid grid-cols-4 gap-4">
          <div className="card text-center" style={{ padding: '2rem 1.5rem' }}>
            <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>200K+</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Compounds Screened</div>
          </div>
          <div className="card text-center" style={{ padding: '2rem 1.5rem' }}>
            <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>&gt;1,000</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Predicted Candidates</div>
          </div>
          <div className="card text-center" style={{ padding: '2rem 1.5rem' }}>
            <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>~60</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>High-Priority Leads</div>
          </div>
          <div className="card text-center" style={{ padding: '2rem 1.5rem' }}>
            <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>1487×</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Best Selectivity (vs RAD51)</div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="container mb-12 mt-12">
        <h2 className="text-center mb-8" style={{ fontSize: '2rem' }}>Discovery Pipeline</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="card glass-panel flex-col gap-3" style={{ padding: '2rem' }}>
            <div className="icon-wrapper mb-2" style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--color-primary)' }}>
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>1. Virtual Screening</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>Structure-based docking of over 200,000 diverse library compounds.</p>
          </div>
          <div className="card glass-panel flex-col gap-3" style={{ padding: '2rem' }}>
            <div className="icon-wrapper mb-2" style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-accent)' }}>
              <Zap size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>2. Potency Prediction</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>Multi-objective ML regressor to predict RecA and RAD51 binding affinities.</p>
          </div>
          <div className="card glass-panel flex-col gap-3" style={{ padding: '2rem' }}>
            <div className="icon-wrapper mb-2" style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '12px', color: 'var(--color-secondary)' }}>
              <Dna size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>3. Generative Design</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>LCG-VAE targeted generation for localized chemical optimization.</p>
          </div>
          <div className="card glass-panel flex-col gap-3" style={{ padding: '2rem' }}>
            <div className="icon-wrapper mb-2" style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: 'var(--color-warning)' }}>
              <CheckCircle2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>4. Translational Filter</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>ADMET filtering, synthesis feasibility, and lead-candidate selection.</p>
          </div>
        </div>
      </section>
      
      {/* Informational Section */}
      <section className="container mb-12 mt-12 pb-12">
         <div className="card" style={{ padding: '4rem 3rem' }}>
            <div className="grid grid-cols-2 gap-8" style={{ alignItems: 'center' }}>
               <div>
                 <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Why Target RecA?</h2>
                 <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                   RecA is a critical bacterial protein involved in homologous recombination and the SOS response, making it a prime target for antibiotic adjuvants. 
                   Inhibiting RecA sensitizes bacteria to existing antibiotics and reduces the development of resistance.
                 </p>
                 <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                   However, cross-reactivity with the human ortholog, RAD51, leads to severe toxicity. 
                   <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}> HELIX explicitly models for high selectivity</span>, targeting unique 
                   pockets in RecA to dramatically reduce RAD51 affinity.
                 </p>
                 <Link to="/methodology" className="btn btn-secondary">
                   Read full methodology <ArrowRight size={18} />
                 </Link>
               </div>
               <div className="flex-center" style={{ background: 'var(--color-bg)', padding: '4rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', height: '100%' }}>
                 <div className="text-center flex-col flex-center gap-4">
                    <Activity size={80} style={{ color: 'var(--color-primary)', filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))' }} />
                    <p className="mono" style={{ fontSize: '1rem', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>HELIX Predictor Module</p>
                    <div className="badge badge-neutral mt-2">v1.0.4 Online</div>
                 </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
