import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion, gsap, ScrollTrigger, LUXURY_EASE } from '../utils/useCinematicAnimation';
import { Trophy, Sparkles, ChevronLeft, ChevronRight, Play, Pause, ShieldCheck, ArrowRight, Clock, Award } from 'lucide-react';

const HERITAGE_DATA = [
  {
    year: '1920',
    eraNumber: '01',
    title: 'The Epoch of Grand Prix Precision',
    category: 'Hypercars & Motorsports',
    subtitle: 'Bugatti Type 35 dominates 1,000+ victories worldwide',
    description: 'Ettore Bugatti forged lightweight aluminum alloy wheels, iconic horseshoe radiators, and unprecedented power-to-weight ratios, laying down the immortal benchmark for luxury engineering.',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#A78BFA',
    stats: [
      { label: 'Victories', value: '1,000+' },
      { label: 'Dry Weight', value: '750 kg' },
      { label: 'Top Speed', value: '145 MPH' }
    ]
  },
  {
    year: '1954',
    eraNumber: '02',
    title: 'Golden Age of European Eminence',
    category: 'European Heritage',
    subtitle: 'Reinventing architectural & automotive luxury',
    description: 'Post-war craftsmanship birthed timeless silhouettes. Hand-stitched full-grain leather, mid-engine V12 configurations, and iconic Riviera destinations defined global prestige.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#34D399',
    stats: [
      { label: 'Craftsmanship', value: '100% Bespoke' },
      { label: 'Engine Config', value: 'V12 Natural' },
      { label: 'Exclusivity', value: 'Limited Batch' }
    ]
  },
  {
    year: '1998',
    eraNumber: '03',
    title: 'The Quad-Turbo 1,000 HP Revolution',
    category: 'Modern Engineering',
    subtitle: 'Breaking the impossible 400 km/h hypercar barrier',
    description: 'The Veyron W16 Quad-Turbo redefined physical limits. 10 radiators, carbon-monocoque chassis, and active aero drag reduction systems shattered expectations of production vehicles.',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#F59E0B',
    stats: [
      { label: 'Horsepower', value: '1,001 HP' },
      { label: 'Top Speed', value: '253.8 MPH' },
      { label: 'Engine', value: '8.0L W16 Quad' }
    ]
  },
  {
    year: '2026',
    eraNumber: '04',
    title: 'The Certified 100-Tier Global Registry',
    category: 'Next-Gen Verification',
    subtitle: 'Automated side-by-side matrix & live verification telemetry',
    description: 'The Elite Rank 100 Registry unifies hypercars, smartphones, football clubs, universities, airlines, and tech titans into one verified benchmark index with live telemetry.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#38BDF8',
    stats: [
      { label: 'Ranks Tracked', value: '800 Verified' },
      { label: 'Sectors', value: '8 Global Pools' },
      { label: 'Telemetry', value: 'Real-Time' }
    ]
  }
];

const HeritageTimeline = () => {
  const sectionRef = useRef(null);
  const cardContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const reducedMotion = useReducedMotion();
  const totalItems = HERITAGE_DATA.length;

  // Auto-play timer for smooth presentation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, totalItems]);

  // Entrance reveal on scroll into view without locking the screen
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const section = sectionRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.heritage-reveal-item'),
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: LUXURY_EASE,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleEraSelect = (idx) => {
    setActiveIndex(idx);
  };

  const currentEra = HERITAGE_DATA[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-[#0D0B18] via-[#110E24] to-[#0A0A12] text-white overflow-hidden select-none border-t border-b border-[#7C3AED]/30"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] bg-[#7C3AED]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[550px] h-[550px] bg-[#059669]/18 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#4C1D95]/12 rounded-full blur-[160px] pointer-events-none" />

      {/* Viewport Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Badge & Section Info */}
        <div className="heritage-reveal-item flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/15">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.3em] text-[#34D399] mb-2">
              <Sparkles className="w-4 h-4 text-[#A78BFA]" />
              <span>THE HERITAGE & EVOLUTION TIMELINE</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-black text-white leading-tight">
              A Century of <span className="bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#34D399] bg-clip-text text-transparent">Power & Mastery</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-2xl font-light">
              Journey through the monumental milestones of engineering eminence — from early Grand Prix dominators to the modern 100-rank verified telemetry index.
            </p>
          </div>

          {/* Controls: Era Indicator & Navigation Arrows */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Auto Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 border transition-all ${
                isPlaying
                  ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
              title={isPlaying ? 'Pause Auto Presentation' : 'Play Auto Presentation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Auto Active' : 'Auto Play'}</span>
            </button>

            {/* Era Counter Badge */}
            <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-mono text-gray-300">
              <span className="text-[#A78BFA] font-black">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-gray-500"> / {String(totalItems).padStart(2, '0')}</span>
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-[#7C3AED] text-white border border-white/15 hover:border-[#A78BFA] transition-all hover:scale-105 active:scale-95 shadow-md"
                title="Previous Era"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#059669] text-white border border-white/20 hover:scale-105 active:scale-95 transition-all shadow-md"
                title="Next Era"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Documentary Grid */}
        <div ref={cardContainerRef} className="heritage-reveal-item grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Vertical Stepper & Timeline Progress List (Desktop + Mobile responsive) */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
            {HERITAGE_DATA.map((item, idx) => {
              const isActive = activeIndex === idx;
              const isPast = activeIndex > idx;
              return (
                <button
                  key={item.year}
                  onClick={() => handleEraSelect(idx)}
                  className={`group relative text-left p-4 rounded-2xl border transition-all duration-300 flex-shrink-0 w-64 lg:w-full flex items-center space-x-4 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7C3AED]/25 via-[#4C1D95]/30 to-[#059669]/15 border-[#A78BFA] shadow-[0_0_25px_rgba(124,58,237,0.35)] scale-[1.02]'
                      : isPast
                      ? 'bg-white/5 border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/25 opacity-50 hover:opacity-85'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  <div
                    className={`w-1 h-10 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-gradient-to-b from-[#A78BFA] to-[#34D399] shadow-[0_0_10px_#A78BFA]' : 'bg-transparent'
                    }`}
                  />

                  {/* Era Number Icon with Radar Beacon on Active */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-300 border relative ${
                      isActive
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#059669] text-white border-white shadow-[0_0_15px_rgba(124,58,237,0.8)] scale-110'
                        : isPast
                        ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]/40'
                        : 'bg-white/10 text-gray-400 border-white/15'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#34D399] radar-beacon" />
                    )}
                    {item.eraNumber}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`font-serif-luxury text-lg font-black transition-colors ${isActive ? 'text-[#34D399]' : 'text-white'}`}>
                        {item.year}
                      </span>

                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-[#7C3AED]/40 border border-[#A78BFA]/60 text-[9px] font-black uppercase tracking-wider text-[#DDD6FE]">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium truncate mt-0.5">
                      {item.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Camera Visual Canvas (High-Res Media Showcase) */}
          <div className="lg:col-span-4 relative min-h-[340px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-black/60 group">
            {HERITAGE_DATA.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={item.year}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    isActive
                      ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                      : 'opacity-0 scale-105 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                  {/* Floating Era Year Badge */}
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-[#34D399] text-xs font-black uppercase tracking-widest flex items-center space-x-2 shadow-lg">
                    <Trophy className="w-3.5 h-3.5 text-[#A78BFA]" />
                    <span>ERA {item.year}</span>
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#A78BFA] font-bold block mb-1">
                      {item.category}
                    </span>
                    <h4 className="font-serif-luxury text-lg font-black text-white truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Editorial Storytelling & Telemetry Stats */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-md shadow-2xl relative overflow-hidden">
            
            {/* Top Tag & Title */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg bg-[#7C3AED]/25 border border-[#7C3AED]/60 text-[#A78BFA] text-[11px] font-black uppercase tracking-widest inline-block">
                  {currentEra.category}
                </span>
                <span className="text-xs font-mono text-gray-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Era {currentEra.year}</span>
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
                {currentEra.title}
              </h3>

              <p className="text-[#34D399] text-xs font-bold uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#34D399] shrink-0" />
                <span>{currentEra.subtitle}</span>
              </p>

              <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
                {currentEra.description}
              </p>
            </div>

            {/* Telemetry Stats Grid */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Audited Technical Metrics</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {currentEra.stats.map((st, i) => (
                  <div
                    key={i}
                    className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 text-center transition-colors"
                  >
                    <div className="font-serif-luxury text-sm sm:text-base font-black text-white truncate">
                      {st.value}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-400 font-medium truncate mt-0.5">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Global Progress Track Line at Bottom */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-gray-300">
              Verified 100-Year Continuum
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {HERITAGE_DATA.map((_, i) => (
              <button
                key={i}
                onClick={() => handleEraSelect(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? 'w-8 bg-gradient-to-r from-[#A78BFA] to-[#34D399]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Jump to Era ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeritageTimeline;

