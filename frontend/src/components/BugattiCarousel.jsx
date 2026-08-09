import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Split, Heart, Globe, ArrowUpRight, ShieldCheck, Sparkles, Check, ExternalLink } from 'lucide-react';
import { formatFieldValue } from '../utils/formatters';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { favoriteService } from '../services/api';

const BugattiCarousel = ({ items = [], title = "Exclusive Showcase", subtitle = "3-Card Luxury Timeline" }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { isInCompare, toggleCompare, openSubpropertyModal } = useCompare();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState({});

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    // Calculate active center index
    const cardWidth = scrollRef.current.querySelector('.bugatti-card')?.offsetWidth || 380;
    const index = Math.round(scrollLeft / (cardWidth + 24));
    setActiveIndex(Math.min(Math.max(0, index), items.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [items]);

  if (!items || items.length === 0) return null;

  const scrollByCard = (direction) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('.bugatti-card')?.offsetWidth || 380;
    const offset = direction === 'next' ? (cardWidth + 24) * 2 : -(cardWidth + 24) * 2;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleFavoriteToggle = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to add items to your VIP Favorites portfolio.');
      return;
    }
    try {
      const res = await favoriteService.toggleFavorite(itemId);
      if (res.success) {
        setFavorites(prev => ({ ...prev, [itemId]: res.isFavorite }));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const progressPercent = items.length > 1 ? ((activeIndex + 1) / items.length) * 100 : 100;

  return (
    <div className="bugatti-showcase-section relative py-8 select-none">
      
      {/* Top Header & Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 px-2">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.25em] text-[#059669] mb-1.5">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            <span>BUGATTI-INSPIRED 3-ITEM HORIZONTAL SHOWCASE</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-black text-[#0A0A12]">
            {title}
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Scroll horizontally to navigate all 100 verified entities (3 on screen)
          </p>
        </div>

        {/* Navigation Arrows & Progress Counter */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-right hidden sm:block">
            <span className="font-mono text-xs font-black text-[#7C3AED]">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-gray-400 text-xs"> / {String(items.length).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollByCard('prev')}
              disabled={!canScrollLeft}
              className={`p-3.5 rounded-2xl border transition-all duration-300 shadow-sm flex items-center justify-center ${
                canScrollLeft 
                  ? 'bg-white hover:bg-[#F5F3FF] text-[#4C1D95] border-purple-300 hover:scale-105 shadow-md cursor-pointer' 
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
              }`}
              title="Previous Items"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => scrollByCard('next')}
              disabled={!canScrollRight}
              className={`p-3.5 rounded-2xl border transition-all duration-300 shadow-sm flex items-center justify-center ${
                canScrollRight 
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#059669] text-white border-white hover:scale-105 shadow-md cursor-pointer' 
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
              }`}
              title="Next Items"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3-Card Smooth Scroll Track Container */}
      <div
        ref={scrollRef}
        className="bugatti-scroll-track flex space-x-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 px-2 no-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {items.map((item, idx) => {
          const isComp = isInCompare(item.id);
          const isFav = favorites[item.id] !== undefined ? favorites[item.id] : item.isFavorite;
          const officialWebsite = item.custom_values?.website || item.website || 'https://www.google.com';
          const isCenter = idx === activeIndex;

          const rankBadgeStyle = item.rank === 1 
            ? 'bg-gradient-to-r from-[#A78BFA] via-[#7C3AED] to-[#059669] text-white font-black shadow-regal-strong border-white' 
            : item.rank === 2 
            ? 'bg-gradient-to-r from-slate-200 via-gray-300 to-slate-400 text-black font-black border-white shadow-md' 
            : item.rank === 3 
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-800 text-white font-black border-emerald-300 shadow-md' 
            : 'bg-[#F5F3FF] text-[#4C1D95] border-[#7C3AED]/40 font-extrabold';

          return (
            <div
              key={item.id}
              className={`bugatti-card snap-start flex-none w-[88vw] sm:w-[46vw] lg:w-[calc((100%-48px)/3)] rounded-3xl border-2 transition-all duration-500 overflow-hidden flex flex-col justify-between group bg-white ${
                isCenter 
                  ? 'border-[#7C3AED] shadow-regal-strong scale-[1.01] ring-2 ring-[#7C3AED]/20' 
                  : 'border-purple-200/80 hover:border-[#059669] shadow-luxury-card hover:-translate-y-1'
              }`}
            >
              {/* Top Hero Image with Aspect Ratio & Overlays */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

                {/* Top Floating Badges */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider ${rankBadgeStyle} flex items-center space-x-1.5 shadow-md border`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>RANK #{item.rank}</span>
                  </div>
                </div>

                {/* Compare & Favorite Buttons */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCompare(item);
                    }}
                    className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                      isComp 
                        ? 'bg-[#059669] text-white ring-2 ring-white scale-105' 
                        : 'bg-white/85 text-gray-800 hover:text-[#7C3AED] hover:bg-white'
                    }`}
                    title="Compare side-by-side"
                  >
                    <Split className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleFavoriteToggle(e, item.id)}
                    className="p-2.5 rounded-full bg-white/85 text-gray-800 hover:text-red-500 hover:bg-white backdrop-blur-md transition-all shadow-md"
                    title="Save to VIP Portfolio"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Bottom Image Details */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="px-2.5 py-1 rounded-xl bg-black/75 text-[#DDD6FE] font-bold border border-white/20">
                    {item.country || 'Global Standard'}
                  </span>
                  <span className="text-[11px] text-emerald-300 bg-black/75 px-2.5 py-1 rounded-xl border border-emerald-500/40 flex items-center space-x-1 font-bold">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>100% Verified</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link to={`/item/${item.slug || item.id}`}>
                    <h3 className="font-serif-luxury text-xl font-bold text-[#0A0A12] hover:text-[#7C3AED] transition-colors mb-1.5 line-clamp-1">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-xs line-clamp-2 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subproperties Matrix Grid (Real Values Clickable to Portal) */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-purple-100 text-xs">
                  {Object.entries(item.custom_values || {})
                    .filter(([k]) => k !== 'website')
                    .slice(0, 4)
                    .map(([key, val]) => (
                      <div
                        key={key}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openSubpropertyModal(item, key, formatFieldValue(val, key));
                        }}
                        className="bg-[#F5F3FF] hover:bg-[#EDE9FE] p-2.5 rounded-xl border border-purple-200 hover:border-[#7C3AED] cursor-pointer transition-all duration-200 group/pill"
                        title="Click to view verified official portal"
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
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#ECFDF5] border border-emerald-300 text-[#064E3B] hover:bg-[#059669] hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">Main Website</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>

                  <Link
                    to={`/item/${item.slug || item.id}`}
                    className="py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center space-x-1 transition-colors border border-purple-200 shadow-sm shrink-0"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bugatti Luxury Progress Track */}
      <div className="mt-4 px-2">
        <div className="w-full h-1.5 bg-purple-100 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#7C3AED] via-[#059669] to-[#D4AF37] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
};

export default BugattiCarousel;
