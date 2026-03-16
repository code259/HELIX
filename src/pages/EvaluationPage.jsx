import React, { useState } from 'react';
import { Upload, Beaker, AlertCircle, Activity, Info, FileCode2, ArrowRight } from 'lucide-react';
import MoleculeRender from '../components/MoleculeRender';

export default function EvaluationPage() {
  const [inputType, setInputType] = useState('text'); // 'text' or 'file'
  const [smilesInput, setSmilesInput] = useState('');
  const [file, setFile] = useState(null);
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [error, setError] = useState('');

  const handleEvaluate = (e) => {
    e.preventDefault();
    setError('');
    
    if (inputType === 'text' && !smilesInput.trim()) {
      setError('Please enter a valid SMILES string.');
      return;
    }
    if (inputType === 'file' && !file) {
      setError('Please upload a .csv or .smi file.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult(null);

    // Simulate network request / model prediction time
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationResult({
        smiles: inputType === 'text' ? smilesInput : 'C1=CC=C(C=C1)C2=CC=CC=C2', // Mock for file
        pIC50: (Math.random() * 2 + 5).toFixed(2),
        uncertainty: (Math.random() * 0.5).toFixed(3),
        status: 'Server Integration Pending'
      });
    }, 2500);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePresetSelect = (smiles) => {
    setInputType('text');
    setSmilesInput(smiles);
  };

  return (
    <div className="container mt-8 animate-fade-in pb-16">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
            <Activity size={32} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Evaluate Ligand</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Utilize the HELIX RecA predictive model to estimate binding affinity and evaluate the generative viability of novel compounds.
          </p>
        </div>

        {/* Notice about browser limitations */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4 mb-8">
          <div className="text-amber-500 mt-0.5">
            <Info size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-800 mb-1">Architecture Limitation Notice</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              The full predictive pipeline utilizes a scikit-learn ExtraTreesRegressor model (`reca_regressor_bio_enhanced_v2 copy.pkl`), which requires a Python backend to execute. For this static web demonstration, evaluation results will be simulated. Full functionality requires deploying the backend API.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Form Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 lg:p-8">
              
              {/* Input Mode Switcher */}
              <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${inputType === 'text' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setInputType('text')}
                >
                  SMILES Input
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${inputType === 'file' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setInputType('file')}
                >
                  File Upload
                </button>
              </div>

              <form onSubmit={handleEvaluate}>
                {inputType === 'text' ? (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Compound SMILES String</label>
                      <textarea
                        className="input-field min-h-[120px] font-mono text-sm leading-relaxed"
                        placeholder="e.g. C1=CC=C(C=C1)C2=CC=CC=C2"
                        value={smilesInput}
                        onChange={(e) => setSmilesInput(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Try an example</span>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          type="button"
                          onClick={() => handlePresetSelect('C/C(=N/O)/C1=CC=C(C=C1)N2C(=O)C3C4C=CC(C3C2=O)C5C4C6C5C(=O)N(C6=O)C7=CC=C(C=C7)/C(=N/O)/C')}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded text-xs font-medium text-gray-600 hover:text-blue-700 transition-colors"
                        >
                          CID11842052
                        </button>
                        <button 
                          type="button"
                          onClick={() => handlePresetSelect('C1[C@@H]2CN(C[C@@H]1C3=CC=CC(=O)N3C2)C(=O)C4=CC=C(C=C4)C5=NN=C(C6=CC=CC=C65)NC7=CC(=CC=C7)Cl')}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded text-xs font-medium text-gray-600 hover:text-blue-700 transition-colors"
                        >
                          CID9551791
                        </button>
                        <button 
                          type="button"
                          onClick={() => handlePresetSelect('CC1=C(C(CCC1)(C)C)/C=C/C(=C/C=C/C(=C/C=C/C=C(/C=C/C=C(/C=C/C2=C(CCCC2(C)C)C)\\C)\\C)/C)/C')}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded text-xs font-medium text-gray-600 hover:text-blue-700 transition-colors"
                        >
                          Polyene Analogue
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Batch File (.csv, .smi)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 hover:border-blue-300 transition-colors text-center">
                      <input 
                        type="file" 
                        id="compound-upload" 
                        className="hidden" 
                        accept=".csv,.smi,.txt"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="compound-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                          <Upload size={24} />
                        </div>
                        <span className="text-sm font-medium text-blue-600">Click to browse</span>
                        <span className="text-xs text-gray-500 mt-1">or drag and drop your file here</span>
                        {file && (
                          <div className="mt-4 px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 flex items-center gap-2">
                            <FileCode2 size={16} className="text-gray-400" />
                            {file.name}
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="mt-8">
                  <button 
                    type="submit" 
                    disabled={isEvaluating}
                    className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <Activity className="animate-spin" size={20} />
                        Running Inference...
                      </>
                    ) : (
                      <>
                        <Beaker size={20} />
                        Run Evaluation Pipeline
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5">
            {isEvaluating ? (
              <div className="glass-panel p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                  <Hexagon size={48} className="text-blue-600 relative z-10 animate-spin-slow" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">Processing Input...</h3>
                <p className="mt-2 text-sm text-gray-500">Generating structural descriptors and executing model inference block.</p>
                
                <div className="w-full max-w-xs bg-gray-100 h-1.5 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-blue-600 animate-progress-bar rounded-full"></div>
                </div>
              </div>
            ) : evaluationResult ? (
              <div className="glass-panel p-6 lg:p-8 h-full min-h-[400px] animate-slide-up flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-gray-900">Evaluation Report</h3>
                </div>

                <div className="bg-white border text-center border-gray-100 rounded-xl p-4 mix-blend-multiply mb-6 flex-shrink-0 flex items-center justify-center shadow-sm">
                  <MoleculeRender smiles={evaluationResult.smiles} id="eval-result-mol" width={220} height={160} />
                </div>

                <div className="space-y-4 flex-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Predicted pIC50</p>
                      <p className="text-2xl font-bold text-blue-700 font-mono">{evaluationResult.pIC50}</p>
                    </div>
                    <Activity size={28} className="text-blue-200" />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Model Uncertainty</p>
                      <p className="text-xl font-bold text-gray-800 font-mono">{evaluationResult.uncertainty}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${evaluationResult.uncertainty < 0.2 ? 'bg-emerald-500' : evaluationResult.uncertainty < 0.4 ? 'bg-amber-400' : 'bg-rose-500'}`}></div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                     <AlertCircle size={14} className="shrink-0 mt-0.5 text-gray-400" />
                     <p>Note: This is a static demonstration result. {evaluationResult.status}</p>
                  </div>
                </div>

              </div>
            ) : (
               <div className="glass-panel p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-60">
                 <ArrowRight size={48} className="text-gray-300 mb-4 hidden lg:block" />
                 <div className="w-16 h-16 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-4 text-gray-400 lg:hidden">
                   <Activity size={24} />
                 </div>
                 <h3 className="text-lg font-medium text-gray-700">Awaiting Input</h3>
                 <p className="mt-2 text-sm text-gray-500">Submit a compound SMILES or bulk CSV file to generate predictive binding metrics.</p>
               </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
