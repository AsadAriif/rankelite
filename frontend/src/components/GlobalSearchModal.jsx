import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Trophy, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { itemService, categoryService } from '../services/api';

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setItems([]);
      setCategories([]);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      setCategories([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [itemsRes, catRes] = await Promise.all([
          itemService.getAll({ search: query, limit: 6 }),
          categoryService.getAll()
        ]);
        if (itemsRes.success) setItems(itemsRes.data);
        if (catRes.success) {
          setCategories(catRes.data.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-[#D4AF37]/40 shadow-gold-strong overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Box */}
        <div className="relative p-4 border-b border-gray-800 flex items-center">
          <Search className="w-5 h-5 text-[#FFD700] ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Billionaires, Supercars, Smartphones, Universities..."
            className="w-full px-4 py-2 bg-transparent text-white placeholder-gray-500 font-medium text-lg focus:outline-none"
            autoFocus
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin mr-2" />
          ) : query ? (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-white mr-2">
              <X className="w-5 h-5" />
            </button>
          ) : null}
          <button onClick={onClose} className="p-2 text-xs font-mono bg-[#1a1a1a] text-gray-400 rounded-lg border border-gray-700">
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          
          {/* Categories Results */}
          {categories.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-3 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Categories</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => { navigate(`/category/${cat.slug}`); onClose(); }}
                    className="p-3 rounded-xl bg-[#121212] border border-gray-800 hover:border-[#D4AF37] cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-semibold text-sm text-gray-200">{cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items Results */}
          {items.length > 0 ? (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mb-3 flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Rankings</span>
              </h4>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => { navigate(`/item/${item.slug}`); onClose(); }}
                    className="p-3 rounded-xl bg-[#121212] border border-gray-800 hover:border-[#FFD700] hover:bg-[#1a1a1a] cursor-pointer flex items-center space-x-4 transition-all"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-[#D4AF37]/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#D4AF37] text-black">
                          #{item.rank}
                        </span>
                        <h5 className="font-semibold text-white text-sm truncate">{item.title}</h5>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{item.category_name} • {item.country}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                ))}
              </div>
            </div>
          ) : query && !loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No matching rankings found for "{query}". Try another search keyword.
            </div>
          ) : !query ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              Type keywords to search world billionaires, supercars, universities, and flagships...
            </div>
          ) : null}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#080808] border-t border-gray-800 text-center text-xs text-gray-500 flex items-center justify-between px-6">
          <span>Search powered by EliteRank Index Engine</span>
          <button
            onClick={() => { navigate(`/search?q=${encodeURIComponent(query)}`); onClose(); }}
            className="text-[#FFD700] hover:underline font-semibold"
          >
            View all results →
          </button>
        </div>

      </div>
    </div>
  );
};

export default GlobalSearchModal;
