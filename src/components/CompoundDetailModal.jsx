import React, { useState } from 'react';
import { X, Copy, CheckCircle2, ChevronDown, ChevronUp, Beaker, Activity, FileJson, AlertTriangle } from 'lucide-react';
import MoleculeRender from './MoleculeRender';

export default function CompoundDetailModal({ compound, onClose }) {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  if (!compound) return null;

  const handleCopySmiles = () => {
    navigator.clipboard.writeText(compound.smiles);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Beaker size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-mono">{compound.ligand_id}</h2>
              <p className="text-sm text-gray-500">Virtual Screening Candidate</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Col: Structure */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-center min-h-[300px] mix-blend-multiply">
                <MoleculeRender smiles={compound.smiles} id={`mol-detail-${compound.ligand_id}`} width={300} height={250} />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SMILES Notation</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <code className="text-sm text-gray-700 flex-1 overflow-hidden text-ellipsis whitespace-nowrap" title={compound.smiles}>
                    {compound.smiles}
                  </code>
                  <button 
                    onClick={handleCopySmiles}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex-shrink-0"
                    title="Copy SMILES"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Metrics */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Prediction Metrics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="text-sm text-blue-600 font-medium mb-1 flex items-center gap-1">
                    <Activity size={14} /> pIC50 Score
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {compound.pIC50?.toFixed(2)}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${compound.uncertainty < 0.2 ? 'bg-emerald-50/50 border-emerald-100' : compound.uncertainty < 0.4 ? 'bg-amber-50/50 border-amber-100' : 'bg-rose-50/50 border-rose-100'}`}>
                  <div className={`text-sm font-medium mb-1 flex items-center gap-1 ${compound.uncertainty < 0.2 ? 'text-emerald-700' : compound.uncertainty < 0.4 ? 'text-amber-700' : 'text-rose-700'}`}>
                    <AlertTriangle size={14} /> Uncertainty
                  </div>
                  <div className="text-3xl font-bold text-gray-900 font-mono">
                    {compound.uncertainty?.toFixed(3)}
                  </div>
                </div>

                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                  <div className="text-sm text-gray-600 font-medium mb-1">Walker A Distance</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">
                    {compound.Dist_to_Walker_A?.toFixed(1) || '?'} <span className="text-sm text-gray-500 font-normal">Å</span>
                  </div>
                </div>

                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                  <div className="text-sm text-gray-600 font-medium mb-1">H-Bond Count</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono">
                    {compound.HBond_Counts !== undefined ? compound.HBond_Counts : '?'}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Model Components</h3>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded border border-gray-200 text-xs font-medium text-gray-600 bg-white">
                    Base Pred: {compound.base_pred?.toFixed(2)}
                  </span>
                  <span className="px-2.5 py-1 rounded border border-gray-200 text-xs font-medium text-gray-600 bg-white">
                    Delta: <span className={compound.delta > 0 ? "text-green-600" : "text-red-500"}>{compound.delta > 0 ? '+' : ''}{compound.delta?.toFixed(3)}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded border border-gray-200 text-xs font-medium text-gray-600 bg-white">
                    Raw pIC50: {compound.raw_pIC50?.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={() => setShowRaw(!showRaw)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FileJson size={16} /> 
              {showRaw ? 'Hide Raw JSON Data' : 'View Raw JSON Data'}
              {showRaw ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showRaw && (
              <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-gray-300 font-mono leading-relaxed">
                  {JSON.stringify(compound, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
