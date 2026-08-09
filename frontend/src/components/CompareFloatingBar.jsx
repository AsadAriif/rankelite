import React from 'react';
import { useCompare } from '../context/CompareContext';
import { useNavigate } from 'react-router-dom';
import { Split, X, Trash2, ArrowRight } from 'lucide-react';

const CompareFloatingBar = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (!compareItems || compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl bg-white/95 backdrop-blur-xl rounded-full p-2.5 sm:p-3 border-2 border-[#7C3AED] shadow-regal-strong flex items-center justify-between gap-4 animate-in slide-in-from-bottom-8 duration-300">
      
      {/* Left Item Avatars List */}
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar pl-2">
        <div className="flex items-center space-x-1.5 text-[#4C1D95] text-xs font-black uppercase tracking-wider shrink-0 pr-2 border-r border-purple-200">
          <Split className="w-4 h-4 text-[#059669]" />
          <span className="hidden sm:inline">Compare:</span>
          <span className="px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] border border-purple-300 font-mono font-bold">
            {compareItems.length}/4
          </span>
        </div>

        {compareItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-2 bg-[#F5F3FF] pl-1.5 pr-2.5 py-1 rounded-full border border-purple-200 shrink-0 group hover:border-[#059669] transition-colors"
          >
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80'}
              alt={item.title}
              className="w-7 h-7 rounded-full object-cover border border-[#7C3AED]"
            />
            <span className="text-xs font-bold text-gray-800 max-w-[110px] truncate">
              {item.title}
            </span>
            <button
              onClick={() => removeFromCompare(item.id)}
              className="p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              title="Remove from comparison"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Right Action CTAs */}
      <div className="flex items-center space-x-2 shrink-0 pr-1">
        <button
          onClick={clearCompare}
          className="p-2.5 rounded-full bg-purple-50 text-gray-500 hover:text-red-500 transition-colors border border-purple-200"
          title="Clear all compared items"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/compare')}
          className="px-5 py-2.5 rounded-full btn-emerald-action text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-sm"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

export default CompareFloatingBar;
