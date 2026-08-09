import React, { useEffect, useState } from 'react';
import { useCompare } from '../context/CompareContext';
import { Link, useNavigate } from 'react-router-dom';
import { Split, Trash2, ArrowLeft, ExternalLink, Award, ShieldCheck, Sparkles, Globe, Plus, Trophy, CheckCircle2, Zap } from 'lucide-react';
import { formatFieldValue } from '../utils/formatters';
import { itemService } from '../services/api';

const ComparePage = () => {
  const { compareItems, removeFromCompare, clearCompare, addToCompare, openSubpropertyModal } = useCompare();
  const [quickAddItems, setQuickAddItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await itemService.getAll({ limit: 100, sort: 'rank_asc' });
        if (res.success) {
          setQuickAddItems(res.data.filter(i => !compareItems.some(c => c.id === i.id)));
        }
      } catch (err) {
        console.error('Failed to load comparison suggestions:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [compareItems]);

  // Aggregate all unique specification keys across selected items
  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap(item => Object.keys(item.custom_values || {}))
    )
  ).filter(k => k !== 'website');

  // Filter available quick add candidates
  const filteredQuickAdd = quickAddItems.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (i.category_name && i.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (i.country && i.country.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategoryFilter === 'all' || i.category_slug === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  // Calculate Champion / Best Model
  const calculateChampion = () => {
    if (compareItems.length === 0) return null;
    // The top ranked model (rank 1 < rank 2) is the primary winner
    const sorted = [...compareItems].sort((a, b) => (a.rank || 999) - (b.rank || 999));
    return sorted[0];
  };

  const champion = calculateChampion();

  return (
    <div className="min-h-screen pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 bg-[#FAFAFC]">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-200">
        <div>
          <div className="flex items-center space-x-3 mb-2 text-[#7C3AED] text-xs font-bold uppercase tracking-widest">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Live Telemetry Comparison</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#0A0A12] flex items-center space-x-3">
            <Split className="w-8 h-8 text-[#059669]" />
            <span>Side-by-Side <span className="purple-gradient-text">Comparison Matrix</span></span>
          </h1>
          <p className="text-gray-600 text-sm font-normal mt-1">
            Compare verified technical specifications, performance metrics, valuations, and official website links side-by-side.
          </p>
        </div>

        {compareItems.length > 0 && (
          <div className="flex items-center space-x-3">
            <button
              onClick={clearCompare}
              className="px-4 py-2.5 rounded-xl bg-[#F5F3FF] border border-purple-200 text-purple-900 hover:text-red-600 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All ({compareItems.length})</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:text-black text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Exploring</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {compareItems.length === 0 ? (
        <div className="hud-card p-16 rounded-3xl border border-[#7C3AED]/35 text-center my-12 shadow-luxury-soft">
          <div className="w-20 h-20 rounded-full bg-[#F5F3FF] border border-[#7C3AED]/40 flex items-center justify-center mx-auto mb-6">
            <Split className="w-10 h-10 text-[#7C3AED]" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-black text-[#0A0A12] mb-2">
            No Items in Comparison Matrix
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-8 font-normal leading-relaxed">
            Click the <strong className="text-[#059669]">"Compare"</strong> button on any smartphone, supercar, billionaire, or university to benchmark their verified specifications side-by-side.
          </p>

          <Link
            to="/category/smartphones"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl btn-purple-action text-xs uppercase tracking-wider"
          >
            <span>Explore Flagship Smartphones</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Quick Manual Add Different Model Picker */}
          <div className="hud-card p-6 rounded-3xl border border-[#7C3AED]/30 shadow-luxury-soft bg-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#7C3AED]">
                <Plus className="w-4 h-4 text-[#059669]" />
                <span>Add Different Model To Comparison (2 to 4 Items)</span>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search model name (e.g. Galaxy S24, Pixel 8, Bugatti...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-[#F5F3FF] border border-purple-200 text-xs font-medium text-gray-800 placeholder-gray-500 w-full md:w-64 focus:outline-none focus:border-[#7C3AED]"
                />
                
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F5F3FF] border border-purple-200 text-xs font-bold text-gray-800 focus:outline-none"
                >
                  <option value="all">All Sectors</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="supercars">Supercars</option>
                  <option value="billionaires">Billionaires</option>
                  <option value="football-clubs">Football Clubs</option>
                  <option value="universities">Universities</option>
                  <option value="airlines">Airlines</option>
                  <option value="tech-companies">Tech Giants</option>
                  <option value="luxury-hotels">Luxury Hotels</option>
                </select>
              </div>
            </div>

            {/* Quick Picker Pills */}
            <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 no-scrollbar">
              {filteredQuickAdd.slice(0, 10).map(cand => (
                <button
                  key={cand.id}
                  onClick={() => addToCompare(cand)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-purple-200 hover:border-[#7C3AED] text-xs font-bold text-gray-800 flex items-center space-x-2 shrink-0 transition-all shadow-sm"
                >
                  <span className="text-[10px] text-[#7C3AED] font-black">#{cand.rank}</span>
                  <span className="truncate max-w-[140px]">{cand.title}</span>
                  <Plus className="w-3.5 h-3.5 text-[#059669]" />
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="hud-card rounded-3xl border border-[#7C3AED]/35 overflow-hidden shadow-luxury-card bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                
                {/* Product Headers Row */}
                <thead>
                  <tr className="border-b border-gray-200 bg-[#F5F3FF]">
                    <th className="p-6 w-56 text-xs uppercase tracking-widest text-[#7C3AED] font-black">
                      Benchmarked Telemetry
                    </th>
                    {compareItems.map(item => {
                      const isTopRank = item.id === champion?.id;
                      return (
                        <th key={item.id} className="p-6 min-w-[270px] border-l border-gray-200 relative">
                          {isTopRank && (
                            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full winner-badge text-[9px] font-black uppercase tracking-wider flex items-center space-x-1">
                              <Trophy className="w-3 h-3 text-amber-300" />
                              <span>Rank #1 Lead</span>
                            </div>
                          )}

                          <button
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute top-3 left-3 p-1.5 rounded-full bg-white text-gray-400 hover:text-red-500 border border-gray-200 shadow-sm"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="mt-6 mb-4 text-center">
                            <div className="w-full h-44 rounded-2xl overflow-hidden mb-3 bg-gray-100 border border-purple-200 shadow-sm">
                              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            
                            <span className="px-3 py-0.5 rounded-full bg-[#ECFDF5] border border-emerald-300 text-[#064E3B] text-[10px] font-black uppercase tracking-wider">
                              Rank #{item.rank} {item.category_name}
                            </span>

                            <h3 className="font-serif text-lg font-black text-[#0A0A12] mt-2 mb-1 line-clamp-1">
                              {item.title}
                            </h3>
                            <span className="text-xs text-gray-500 font-bold">{item.country || 'Global'}</span>
                          </div>

                          {/* Official Website CTA */}
                          {item.custom_values?.website && (
                            <a
                              href={item.custom_values.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 rounded-xl btn-purple-action text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-sm"
                            >
                              <Globe className="w-3.5 h-3.5 text-white" />
                              <span>Official Website</span>
                              <ExternalLink className="w-3 h-3 text-white" />
                            </a>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Specification Rows */}
                <tbody className="divide-y divide-gray-200 text-xs">
                  {/* Category Row */}
                  <tr className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="p-4 font-bold text-gray-600 bg-[#F9FAFB]">Category</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-4 font-bold text-[#0A0A12] border-l border-gray-200">
                        {item.category_name}
                      </td>
                    ))}
                  </tr>

                  {/* Country Origin */}
                  <tr className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="p-4 font-bold text-gray-600 bg-[#F9FAFB]">Origin / Country</td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-4 font-bold text-gray-800 border-l border-gray-200">
                        {item.country || 'Global'}
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Custom Fields */}
                  {allSpecKeys.map(specKey => (
                    <tr key={specKey} className="hover:bg-[#FAF5FF] transition-colors">
                      <td className="p-4 font-bold text-gray-600 uppercase tracking-wider bg-[#F9FAFB]">
                        {specKey.replace(/_/g, ' ')}
                      </td>
                      {compareItems.map(item => {
                        const val = item.custom_values?.[specKey];
                        const isChampionItem = item.id === champion?.id;
                        return (
                          <td
                            key={item.id}
                            onClick={() => openSubpropertyModal(item, specKey, formatFieldValue(val, specKey))}
                            className="p-4 border-l border-gray-200 hover:bg-[#F5F3FF] cursor-pointer transition-colors"
                            title="Click to view verified portal"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-black text-[#0A0A12]">
                                {formatFieldValue(val, specKey)}
                              </span>
                              {isChampionItem && (
                                <span className="text-[10px] text-emerald-700 font-extrabold flex items-center space-x-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= 🏆 FINAL WINNER & EXECUTIVE VERDICT BANNER ================= */}
          {champion && (
            <div className="hud-card p-8 rounded-3xl border-2 border-[#059669] bg-gradient-to-r from-[#ECFDF5] via-white to-[#F5F3FF] shadow-regal-strong">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                <div className="flex items-start space-x-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#059669] via-[#10B981] to-[#7C3AED] p-0.5 flex items-center justify-center shrink-0 shadow-emerald-glow">
                    <div className="w-full h-full bg-[#064E3B] rounded-[14px] flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-amber-300 animate-bounce" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-3 py-0.5 rounded-full winner-badge text-[10px] font-black uppercase tracking-wider">
                        🏆 COMPARISON CHAMPION VERDICT
                      </span>
                      <span className="text-xs text-gray-500 font-bold">Official Rank #{champion.rank} Leader</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0A0A12]">
                      Overall Best Choice: <span className="emerald-gradient-text">{champion.title}</span>
                    </h2>

                    <p className="text-gray-600 text-xs sm:text-sm font-normal max-w-2xl mt-1 leading-relaxed">
                      Based on audited benchmark telemetry, technical horsepower, and global ranking position, 
                      <strong className="text-[#064E3B]"> {champion.title}</strong> takes the #1 victory in this head-to-head comparison.
                    </p>
                  </div>
                </div>

                {/* Champion Quick CTA Button */}
                {champion.custom_values?.website && (
                  <div className="flex items-center space-x-3 w-full lg:w-auto">
                    <a
                      href={champion.custom_values.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full lg:w-auto px-8 py-4 rounded-2xl btn-emerald-action text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-emerald-glow"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Champion Portal</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ComparePage;
