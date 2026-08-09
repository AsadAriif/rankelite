import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ItemCard from '../components/ItemCard';
import HeritageTimeline from '../components/HeritageTimeline';
import MagneticButton from '../components/MagneticButton';
import TextReveal from '../components/TextReveal';
import { GridSkeleton } from '../components/SkeletonLoader';
import { categoryService, itemService } from '../services/api';
import { Crown, Sparkles, TrendingUp, ArrowRight, ShieldCheck, Split, Globe, CheckCircle2, ChevronRight, Star, Grid } from 'lucide-react';

const HomePage = ({ onOpenSearch }) => {

  const [categories, setCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          categoryService.getAll(),
          itemService.getAll({ limit: 100, sort: 'rank_asc' })
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (itemRes.success) setFeaturedItems(itemRes.data);
      } catch (err) {
        console.error('Error loading homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryFilterChange = async (catId) => {
    setActiveCategoryFilter(catId);
    setLoading(true);
    try {
      const res = await itemService.getAll({
        category_id: catId === 'all' ? undefined : catId,
        limit: 100,
        sort: 'rank_asc'
      });
      if (res.success) setFeaturedItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-[#FAFAFC]">
      
      {/* Continuous Live Rankings Marquee Ticker */}
      <div className="relative z-20 bg-white border-b border-purple-200 py-2.5 text-xs overflow-hidden shadow-sm">
        <div className="animate-marquee whitespace-nowrap flex items-center space-x-12">
          <div className="flex items-center space-x-8 text-gray-700">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
              <strong className="text-[#4C1D95] font-serif-luxury font-black">100 RANK VERIFIED INDEX:</strong>
            </span>
            <span>📱 #1 Mobile: <strong className="text-[#0A0A12] font-black">iPhone 15 Pro Max (3nm A17 Pro)</strong></span>
            <span>👑 #1 Billionaire: <strong className="text-[#0A0A12] font-black">Elon Musk ($242.0B)</strong></span>
            <span>🏎️ #1 Hypercar: <strong className="text-[#0A0A12] font-black">Bugatti Tourbillon (1,800 HP V16)</strong></span>
            <span>⚽ #1 Football: <strong className="text-[#0A0A12] font-black">Real Madrid CF (15 UCL Titles)</strong></span>
            <span>🎓 #1 University: <strong className="text-[#0A0A12] font-black">Harvard University (1636)</strong></span>
            <span>✈️ #1 Airline: <strong className="text-[#0A0A12] font-black">Singapore Airlines (First Class Suites)</strong></span>
            <span>💻 #1 Tech: <strong className="text-[#0A0A12] font-black">Microsoft ($3.2 Trillion)</strong></span>
            <span>🏨 #1 Hotel: <strong className="text-[#0A0A12] font-black">Burj Al Arab Jumeirah ($24,000/nt)</strong></span>
          </div>
          <div className="flex items-center space-x-8 text-gray-700">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
              <strong className="text-[#4C1D95] font-serif-luxury font-black">100 RANK VERIFIED INDEX:</strong>
            </span>
            <span>📱 #1 Mobile: <strong className="text-[#0A0A12] font-black">iPhone 15 Pro Max (3nm A17 Pro)</strong></span>
            <span>👑 #1 Billionaire: <strong className="text-[#0A0A12] font-black">Elon Musk ($242.0B)</strong></span>
            <span>🏎️ #1 Hypercar: <strong className="text-[#0A0A12] font-black">Bugatti Tourbillon (1,800 HP V16)</strong></span>
            <span>⚽ #1 Football: <strong className="text-[#0A0A12] font-black">Real Madrid CF (15 UCL Titles)</strong></span>
            <span>🎓 #1 University: <strong className="text-[#0A0A12] font-black">Harvard University (1636)</strong></span>
            <span>✈️ #1 Airline: <strong className="text-[#0A0A12] font-black">Singapore Airlines (First Class Suites)</strong></span>
            <span>💻 #1 Tech: <strong className="text-[#0A0A12] font-black">Microsoft ($3.2 Trillion)</strong></span>
            <span>🏨 #1 Hotel: <strong className="text-[#0A0A12] font-black">Burj Al Arab Jumeirah ($24,000/nt)</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Showcase (6-Phase Reveal Sequence & Camera Departure Overlap) */}
      <HeroSection onOpenSearch={onOpenSearch} />

      {/* ENTRANCE TYPE C: Overlapping Pinned Heritage Timeline Documentary */}
      <HeritageTimeline />

      {/* ENTRANCE TYPE B: High-Elevation Category Registries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-purple-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.25em] text-[#059669] mb-1">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>THE 8 COMPLETE REGISTRIES</span>
            </div>
            <TextReveal type="mask" className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#0A0A12]">
              Explore 100 Categories in <span className="purple-gradient-text">High-Eminence Detail</span>
            </TextReveal>
          </div>
          <span className="text-xs text-gray-500 font-mono font-bold mt-2 sm:mt-0">
            800 Verified Profiles Active
          </span>
        </div>

        {/* Category Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="category-hero-block rounded-3xl p-6 flex flex-col justify-between group text-decoration-none shadow-regal-strong"
            >
              {/* Image Container with Restrained Scale */}
              <div className="relative h-48 rounded-2xl overflow-hidden mb-5 bg-gray-100 border border-purple-200 shadow-sm">
                <img
                  src={cat.banner_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E1065]/80 via-transparent to-black/20" />
                
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#4C1D95] text-[11px] font-black uppercase tracking-wider border border-purple-300 shadow-sm">
                  100 Verified
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Certified #1-#100</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-700/80 text-[10px] font-bold">LIVE</span>
                </div>
              </div>

              {/* Category Info */}
              <div className="space-y-2 flex-1">
                <h3 className="font-serif-luxury text-xl font-black text-[#0A0A12] group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-gray-600 text-xs font-normal line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Enter Button */}
              <div className="pt-4 mt-4 border-t border-purple-100 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#7C3AED] group-hover:text-[#059669] flex items-center space-x-1 transition-colors">
                  <span>Enter 100 Ranks</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="w-8 h-8 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center font-bold text-xs border border-purple-200">
                  {idx + 1}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ENTRANCE TYPE A: Comparison Matrix Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="hud-card rounded-3xl p-8 sm:p-10 border-2 border-[#7C3AED]/40 bg-gradient-to-r from-[#F5F3FF] via-white to-[#ECFDF5] shadow-regal-strong">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-purple-300 text-[#7C3AED] text-xs font-black uppercase tracking-wider">
                <Split className="w-3.5 h-3.5 text-[#059669]" />
                <span>Side-by-Side Model Comparison</span>
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-black text-[#0A0A12]">
                Benchmarking <span className="purple-gradient-text">Flagships & Hypercars</span> in Real-Time
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm font-normal max-w-xl leading-relaxed">
                Add models like iPhone 15 Pro Max vs Galaxy S24 Ultra or Bugatti Tourbillon vs Koenigsegg Jesko. Compare performance, camera optics, top speed, and see the automated Champion Verdict.
              </p>
            </div>

            <MagneticButton strength={0.25}>
              <Link
                to="/compare"
                className="px-8 py-4 rounded-2xl btn-purple-action btn-micro-engineered text-xs uppercase tracking-wider flex items-center space-x-2 shrink-0 shadow-purple-glow"
              >
                <Split className="w-4 h-4" />
                <span>Launch Comparison Matrix</span>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Verified Standings Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#059669]">
              REAL-TIME RANKINGS REGISTRY
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-black text-[#0A0A12]">
              Verified Top <span className="purple-gradient-text">100 Profiles</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => handleCategoryFilterChange('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                activeCategoryFilter === 'all'
                  ? 'btn-purple-action'
                  : 'bg-white text-gray-700 border border-purple-200 hover:border-[#7C3AED]'
              }`}
            >
              All Sectors (800)
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryFilterChange(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  activeCategoryFilter === c.id
                    ? 'btn-emerald-action'
                    : 'bg-white text-gray-700 border border-purple-200 hover:border-[#059669]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default HomePage;
