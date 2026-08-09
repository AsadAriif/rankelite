import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Award, ArrowUpRight, Split, Check, ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import { formatFieldValue } from '../utils/formatters';
import { favoriteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';

const ItemCard = ({ item }) => {
  const { user } = useAuth();
  const { isInCompare, toggleCompare, openSubpropertyModal } = useCompare();
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);
  const [favLoading, setFavLoading] = useState(false);

  const compared = isInCompare(item.id);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to add items to your VIP Favorites portfolio.');
      return;
    }
    setFavLoading(true);
    try {
      const res = await favoriteService.toggleFavorite(item.id);
      if (res.success) {
        setIsFavorite(res.isFavorite);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(item);
  };

  const handleSubpropertyClick = (e, key, val) => {
    e.preventDefault();
    e.stopPropagation();
    openSubpropertyModal(item, key, val);
  };

  // Rank Badge Styles in Purple & Emerald
  const getRankBadgeStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-[#A78BFA] via-[#7C3AED] to-[#059669] text-white font-black shadow-regal-strong border-white';
    if (rank === 2) return 'bg-gradient-to-r from-slate-200 via-gray-300 to-slate-400 text-black font-black border-white shadow-md';
    if (rank === 3) return 'bg-gradient-to-r from-emerald-500 to-emerald-800 text-white font-black border-emerald-300 shadow-md';
    return 'bg-[#F5F3FF] text-[#4C1D95] border-[#7C3AED]/40 font-extrabold';
  };

  const officialWebsite = item.custom_values?.website || item.website || 'https://www.google.com';

  return (
    <div className="hud-card rounded-3xl border border-[#7C3AED]/30 overflow-hidden flex flex-col justify-between hover:border-[#059669] transition-all duration-300 shadow-luxury-card hover:-translate-y-1 bg-white group">
      
      {/* Visual Header / Cover Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

        {/* Official Rank Badge */}
        <div className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider ${getRankBadgeStyle(item.rank)} flex items-center space-x-1.5 shadow-md border`}>
          <Award className="w-3.5 h-3.5" />
          <span>RANK #{item.rank}</span>
        </div>

        {/* Action Badges on Cover */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {/* Compare Toggle */}
          <button
            onClick={handleCompareClick}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              compared
                ? 'bg-[#059669] text-white ring-2 ring-white'
                : 'bg-white/85 text-gray-800 hover:text-[#7C3AED]'
            }`}
            title="Side-by-Side Model Comparison"
          >
            {compared ? <Check className="w-4 h-4" /> : <Split className="w-4 h-4" />}
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className="p-2.5 rounded-full bg-white/85 text-gray-800 hover:text-red-500 backdrop-blur-md transition-all shadow-md"
            title="Save to VIP Portfolio"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Location & Verified Badge */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-black/75 text-[#DDD6FE] font-bold border border-white/20 flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-[#A78BFA]" />
            <span>{item.country || 'Global'}</span>
          </span>

          <div
            onClick={(e) => handleSubpropertyClick(e, 'Verification Status', '100% Certified Official Record')}
            className="cursor-pointer text-xs text-emerald-300 bg-black/75 px-2.5 py-1 rounded-xl border border-emerald-500/50 flex items-center space-x-1 font-bold hover:bg-emerald-950/80 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified 2026</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link to={`/item/${item.slug || item.id}`} className="block group-hover:text-[#7C3AED] transition-colors">
            <h3 className="font-serif-luxury text-xl font-bold text-[#0A0A12] mb-1 line-clamp-1 group-hover:translate-x-0.5 transition-transform">
              {item.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 font-normal leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Subproperties Matrix Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-purple-100 text-xs">
          {Object.entries(item.custom_values || {})
            .filter(([k]) => k !== 'website')
            .slice(0, 4)
            .map(([key, val]) => (
              <div
                key={key}
                onClick={(e) => handleSubpropertyClick(e, key, formatFieldValue(val, key))}
                className="bg-[#F5F3FF] hover:bg-[#EDE9FE] p-2.5 rounded-xl border border-purple-200 hover:border-[#7C3AED] cursor-pointer transition-colors duration-200 group/pill"
                title="Click to view verified official link"
              >
                <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-bold truncate">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="font-bold text-[#0A0A12] group-hover/pill:text-[#7C3AED] truncate block mt-0.5">
                  {formatFieldValue(val, key)}
                </span>
              </div>
            ))}
        </div>

        {/* Bottom CTA Action Area */}
        <div className="pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
          <a
            href={officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#ECFDF5] border border-emerald-300 text-[#064E3B] hover:bg-[#059669] hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Main Website</span>
            <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <Link
            to={`/item/${item.slug || item.id}`}
            className="p-2.5 px-3.5 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#7C3AED] font-bold text-xs flex items-center space-x-1 border border-purple-200 transition-colors"
          >
            <span>Inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ItemCard;
