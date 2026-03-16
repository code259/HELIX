import React from 'react';
import { BookOpen, Target, Cpu, Activity, Hexagon, Beaker, ShieldAlert, ArrowRight } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="container mt-8 animate-fade-in pb-16">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Scientific Methodology</h1>
          <p className="text-gray-600 text-lg">
            A comprehensive overview of the computational pipeline developed to identify and generate selective RecA inhibitors.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Section 1 */}
          <section className="glass-panel p-8 lg:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">The RecA Target Problem</h2>
                <p className="text-gray-700 leading-relaxed">
                  RecA is a highly conserved bacterial protein essential for DNA repair and homologous recombination. It plays a critical role in the SOS response, which allows bacteria to survive exposure to DNA-damaging agents, including many antibiotic classes. By inhibiting RecA, we can potentially suppress the development of antibiotic resistance and potentiate the efficacy of existing therapeutics.
                </p>
              </div>
            </div>
            <div className="pl-0 lg:pl-[68px]">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2">
                  <ShieldAlert size={18} /> The Selectivity Challenge
                </div>
                <p className="text-sm text-amber-700 leading-relaxed">
                  While RecA is an attractive target, designing inhibitors is challenging due to the structural homology between the bacterial RecA Walker A motif (ATP-binding site) and human Rad51. A clinically viable RecA inhibitor must achieve high binding affinity for RecA while strictly avoiding Rad51 to prevent off-target toxicity in human cells.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="glass-panel p-8 lg:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                <Cpu size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Machine Learning Pipeline</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  HELIX addresses the selectivity challenge through a multi-stage, structure-aware computational pipeline that combines predictive modeling and generative AI.
                </p>
              </div>
            </div>
            
            <div className="pl-0 lg:pl-[68px] grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span> 
                  Predictive Modeling
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We compiled a dataset of existing RecA inhibitors and their corresponding pIC50 values. Using RDKit, we extracted critical 2D and 3D molecular descriptors, including specific structural distance metrics relative to the Walker A binding pocket. These features trained an ExtraTreesRegressor capable of accurately predicting binding affinity for novel structures.
                </p>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span> 
                  Generative Design
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  A Latent Constrained Generative Variational Autoencoder (LCG-VAE) was employed to design novel chemical matter. By mapping the chemical space of known inhibitors into a continuous latent representation, the model hallucinates structurally diverse therapeutic candidates optimized for RecA binding features.
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm md:col-span-2">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">3</span> 
                  High-Throughput Validation
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Over 250,000 generated molecules were computationally screened through the predictive model. Candidates were filtered based on strict thresholds for predicted pIC50, Lipinski's Rule of Five compliance, topological polar surface area (TPSA), and synthesizability, yielding a refined database of highly promising leads.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="glass-panel p-8 lg:p-10 border-t-4 border-blue-500">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                <Hexagon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Architecture</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our robust technology stack orchestrates everything from raw data processing to web visualization:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-blue-500" /> <strong>Cheminformatics:</strong> RDKit (Python) for feature extraction and structural analysis.</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-blue-500" /> <strong>Machine Learning:</strong> Scikit-Learn for traditional predictive models; PyTorch for the VAE backbone.</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-blue-500" /> <strong>Interactive UI:</strong> React, Vite, and Tailwind CSS for lightning-fast database exploration.</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-blue-500" /> <strong>Structure Rendering:</strong> SmilesDrawer for client-side, zero-latency 2D molecule visualization.</li>
                </ul>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
