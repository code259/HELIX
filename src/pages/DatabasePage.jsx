import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Search, Filter, ChevronLeft, ChevronRight, Activity, Hexagon, Database, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import MoleculeRender from '../components/MoleculeRender';
import CompoundDetailModal from '../components/CompoundDetailModal';

export default function DatabasePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompound, setSelectedCompound] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Filters
  const [minPIC50, setMinPIC50] = useState('5.0');
  const [maxUncertainty, setMaxUncertainty] = useState('0.5');
  
  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: 'pIC50', direction: 'desc' });

  useEffect(() => {
    Papa.parse('./data/reca_inference_predictions copy.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      preview: 5000, // Load top 5000 hits
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setLoading(false);
      }
    });
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-blue-500" /> : <ArrowDown size={14} className="text-blue-500" />;
  };

  const filteredAndSortedData = useMemo(() => {
    // Filter
    let filtered = data.filter(row => {
      // Search
      const matchesSearch = 
        (row.ligand_id && row.ligand_id.toString().toLowerCase().includes(searchTerm.toLowerCase())) || 
        (row.smiles && row.smiles.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filters
      const matchesMinPIC50 = minPIC50 === '' || (row.pIC50 && row.pIC50 >= parseFloat(minPIC50));
      const matchesMaxUncertainty = maxUncertainty === '' || (row.uncertainty && row.uncertainty <= parseFloat(maxUncertainty));

      return matchesSearch && matchesMinPIC50 && matchesMaxUncertainty;
    });

    // Sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, minPIC50, maxUncertainty, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const currentData = filteredAndSortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, minPIC50, maxUncertainty, sortConfig]);

  return (
    <div className="container mt-8 animate-fade-in pb-16">
      {selectedCompound && (
        <CompoundDetailModal 
          compound={selectedCompound} 
          onClose={() => setSelectedCompound(null)} 
        />
      )}

      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="text-blue-600" size={32} />
            Compound Database
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Explore the top 5,000 generated candidate molecules, scored by the RecA prediction model.
            Filter by predicted pIC50, generative uncertainty, and structural parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={18} className="text-blue-600" />
              Filter Compounds
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search ID or SMILES</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    className="input-field pl-10 w-full"
                    placeholder="e.g. CID118420"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Min Predicted pIC50</span>
                  <span className="text-blue-600 font-mono text-xs font-semibold">{minPIC50}</span>
                </label>
                <input
                  type="range"
                  min="4.0"
                  max="8.0"
                  step="0.1"
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={minPIC50}
                  onChange={(e) => setMinPIC50(e.target.value)}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4.0</span>
                  <span>8.0+</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Max Uncertainty</span>
                  <span className="text-blue-600 font-mono text-xs font-semibold">{maxUncertainty}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={maxUncertainty}
                  onChange={(e) => setMaxUncertainty(e.target.value)}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.1 (High Conf)</span>
                  <span>1.0 (Low Conf)</span>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-600 flex justify-between mb-2">
                <span>Total Matches:</span>
                <span className="font-semibold text-gray-900">{filteredAndSortedData.length}</span>
              </div>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>Displaying:</span>
                <span className="font-semibold text-gray-900">
                  {filteredAndSortedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} - {Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-3">
          <div className="glass-panel overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center text-gray-500">
                <Activity className="animate-spin text-blue-600 mb-4" size={32} />
                <p>Loading compound database...</p>
              </div>
            ) : filteredAndSortedData.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-gray-500 border-dashed border-2 m-4 rounded-xl border-gray-200">
                <Hexagon className="text-gray-300 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-900">No compounds found</p>
                <p className="mt-1 text-sm text-gray-500">Adjust your filters to see more results.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setMinPIC50('4.0'); setMaxUncertainty('0.8'); }}
                  className="mt-6 btn-secondary text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 font-semibold text-sm text-gray-700">Structure</th>
                      <th 
                        className="p-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('ligand_id')}
                      >
                        <div className="flex items-center gap-1">ID {getSortIcon('ligand_id')}</div>
                      </th>
                      <th 
                        className="p-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('pIC50')}
                      >
                        <div className="flex items-center gap-1">Predicted pIC50 {getSortIcon('pIC50')}</div>
                      </th>
                      <th 
                        className="p-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('uncertainty')}
                      >
                        <div className="flex items-center gap-1">Uncertainty {getSortIcon('uncertainty')}</div>
                      </th>
                      <th 
                        className="p-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors hidden md:table-cell"
                        onClick={() => handleSort('Dist_to_Walker_A')}
                      >
                        <div className="flex items-center gap-1">Walker A Dist (Å) {getSortIcon('Dist_to_Walker_A')}</div>
                      </th>
                      <th 
                        className="p-4 font-semibold text-sm text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell"
                        onClick={() => handleSort('HBond_Counts')}
                      >
                        <div className="flex items-center gap-1">H-Bonds {getSortIcon('HBond_Counts')}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentData.map((row, idx) => (
                      <tr 
                        key={row.ligand_id || idx} 
                        className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                        onClick={() => setSelectedCompound(row)}
                      >
                        <td className="p-4 w-40">
                          <div className="bg-white border text-center border-gray-100 rounded-lg p-2 mix-blend-multiply group-hover:border-blue-200 transition-colors">
                            <MoleculeRender smiles={row.smiles} id={`mol-${row.ligand_id || idx}`} width={140} height={100} />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-sm text-blue-700 font-semibold">{row.ligand_id}</div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]" title={row.smiles}>
                            {row.smiles?.substring(0, 20)}...
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-medium text-gray-900">{row.pIC50?.toFixed(2)}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                              HIGH
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${row.uncertainty < 0.2 ? 'bg-emerald-500' : row.uncertainty < 0.4 ? 'bg-amber-400' : 'bg-rose-400'}`}
                                style={{ width: `${Math.min(100, row.uncertainty * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono text-gray-600">{row.uncertainty?.toFixed(3)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-700 font-mono hidden md:table-cell">
                          {row.Dist_to_Walker_A?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="p-4 text-sm text-gray-700 hidden lg:table-cell">
                          <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 w-6 h-6 rounded-full font-mono text-xs">
                            {row.HBond_Counts !== undefined ? row.HBond_Counts : '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination Controls */}
            {!loading && filteredAndSortedData.length > 0 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/80">
                <p className="text-sm text-gray-600">
                  Page <span className="font-medium text-gray-900">{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
