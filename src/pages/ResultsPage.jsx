import React from 'react';
import { Target, Activity, Award, Star, FlaskConical, TrendingUp, Zap, ZapOff } from 'lucide-react';

export default function ResultsPage() {
  return (
    <div className="container mt-8 animate-fade-in pb-16">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mb-4">
            <Award size={32} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Discovery Results</h1>
          <p className="text-gray-600 text-lg">
            Final highlights and statistical milestones from the HELIX generative pipeline.
          </p>
        </div>

        {/* Featured Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <FlaskConical size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">61</h3>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Elite Candidates</p>
            <p className="text-xs text-gray-400 mt-2">Identified from 250k+ raw generations with high selectivity scores.</p>
          </div>

          <div className="glass-panel p-6 flex flex-col items-center text-center border-t-4 border-emerald-500">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">10<span className="text-lg text-gray-500">x</span></h3>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Selectivity Gain</p>
            <p className="text-xs text-gray-400 mt-2">Average predicted affinity improvement over existing Rad51 analogs.</p>
          </div>

          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Activity size={24} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">~0.70</h3>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tanimoto Diversity</p>
            <p className="text-xs text-gray-400 mt-2">Maximum similarity to known drugs, ensuring core novelty.</p>
          </div>
        </div>

        {/* Deep Dive Section */}
        <div className="glass-panel p-8 lg:p-10 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Star className="text-amber-500" size={24} fill="currentColor" />
            Top Performer Highlights
          </h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded uppercase">Rank 1</span>
                  <span className="font-mono font-bold text-gray-900">CID11842052</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Demonstrated exceptional predicted binding in the Walker A motif, maintaining an ideal 2.8Å distance to crucial residues while satisfying Lipinski rules.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                    <Zap size={16} /> pIC50: 5.96
                  </div>
                  <div className="flex items-center gap-1.5 text-sm md:font-medium text-blue-600">
                    <Target size={16} /> Selectivity: High
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded uppercase">Rank 2</span>
                  <span className="font-mono font-bold text-gray-900">CID9551791</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  A structurally distinct scaffold showing promising dual-activity potential with remarkably low generative uncertainty.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                    <Zap size={16} /> pIC50: 5.94
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                    <ZapOff size={16} /> Uncertainty: 0.246
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-8 lg:p-12 text-white shadow-xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Accelerating Antibiotic Discovery</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            By shifting from random high-throughput physical screening to targeted, AI-driven generative design, HELIX minimizes the time and cost required to identify novel adjuvants. The 61 compounds detailed in our database represent the frontier of selective RecA inhibition.
          </p>
        </div>

      </div>
    </div>
  );
}
