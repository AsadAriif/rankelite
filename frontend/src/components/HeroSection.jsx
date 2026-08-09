import React, { useState, useEffect, useRef } from 'react';
import { Crown, Trophy, Split, ShieldCheck, ArrowRight, Search } from 'lucide-react';
import { useReducedMotion, gsap, ScrollTrigger, LUXURY_EASE, LUXURY_EASE_INOUT } from '../utils/useCinematicAnimation';
import MagneticButton from './MagneticButton';
import TextReveal from './TextReveal';

const HeroSection = ({ onOpenSearch }) => {
  const [stats, setStats] = useState({ items: 800, categories: 8, views: 14.8 });
  const heroRef = useRef(null);
  const auraRef = useRef(null);
  const contentRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchBarRef = useRef(null);
  const countersRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const duration = 1200;
    const steps = 24;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        items: Math.floor(800 * progress),
        categories: Math.floor(8 * progress),
        views: Number((14.8 * progress).toFixed(1))
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats({ items: 800, categories: 8, views: 14.8 });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Art-Directed Hero Sequence (Phases 1 -> 6) & Camera Scroll Overlap
  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;

    const aura = auraRef.current;
    const content = contentRef.current;
    const badge = badgeRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const searchBar = searchBarRef.current;
    const counters = countersRef.current;

    // PHASE 1: Quiet start set in CSS opacity

    // PHASE 2 - PHASE 5: Master Entrance Timeline
    const tl = gsap.timeline({ defaults: { ease: LUXURY_EASE } });

    // Phase 2: Ambient background media slowly reveals (scale 1.05 -> 1.0)
    if (aura) {
      tl.fromTo(aura, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 });
    }

    // Phase 3: Badge & Main Headline Masked Reveal
    if (badge) {
      tl.fromTo(badge, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=1.0');
    }

    if (title) {
      tl.fromTo(
        title,
        { y: 35, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
        { y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.1, ease: LUXURY_EASE_INOUT },
        '-=0.5'
      );
    }

    // Phase 4: Supporting subtitle
    if (subtitle) {
      tl.fromTo(subtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.6');
    }

    // Phase 5: Search CTA & Counter Cards
    if (searchBar) {
      tl.fromTo(searchBar, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5');
    }

    if (counters) {
      const cards = counters.children;
      tl.fromTo(cards, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }, '-=0.4');
    }

    // PHASE 6: EVERYTHING SETTLES AND STOPS (No continuous ambient bouncing/floating)

    // Hero Scroll Transition (Continuous Camera Movement into Section 2)
    if (content) {
      gsap.to(content, {
        yPercent: -12,
        opacity: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 20%',
          scrub: 0.4
        }
      });
    }

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <div ref={heroRef} className="relative pt-12 pb-24 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F5F3FF] to-[#FAFAFC]">
      
      {/* Dual Royal Ambient Auroras */}
      <div
        ref={auraRef}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-tr from-[#7C3AED]/15 via-[#059669]/10 to-transparent rounded-full blur-3xl pointer-events-none animate-aurora"
      />
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none"
      />

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* VIP Registry Badge with Subtle Float & Gold Glow */}
        <div ref={badgeRef} className="inline-flex items-center space-x-3 px-6 py-2 rounded-full glass-surface border border-[#7C3AED]/40 mb-8 shadow-luxury-soft animate-float glow-pulse-gold">
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#4C1D95]">
            2026 Complete 100-Tier Benchmark Registry
          </span>
        </div>

        {/* Main Headline (Clipped Mask Reveal) */}
        <div ref={titleRef} className="mb-6 overflow-hidden">
          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0A0A12] leading-[1.12]">
            The 100 Global Ranks of <br />
            <span className="purple-gradient-text">Power, Luxury & Domination</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p ref={subtitleRef} className="max-w-3xl mx-auto text-gray-600 text-base sm:text-xl font-normal mb-12 leading-relaxed">
          Explore complete 100-tier verified records across 8 global sectors. From 100 smartphones and hypercars to European football powerhouses, universities, and official portals.
        </p>

        {/* Instant Search Bar */}
        <div ref={searchBarRef} className="max-w-2xl mx-auto mb-16">
          <div
            onClick={onOpenSearch}
            className="flex items-center p-2.5 rounded-3xl bg-white border-2 border-purple-200 shadow-luxury-card hover:border-[#7C3AED] hover:shadow-purple-glow cursor-pointer transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3.5 px-5 py-2 text-gray-500 flex-1">
              <Search className="w-5 h-5 text-[#7C3AED]" />
              <span className="text-sm text-gray-600 font-medium truncate">
                Search iPhone 15 Pro, Real Madrid, Elon Musk, Bugatti...
              </span>
            </div>

            <MagneticButton>
              <button className="px-8 py-3.5 btn-purple-action rounded-2xl text-xs uppercase tracking-wider flex items-center space-x-2 shadow-purple-glow font-extrabold">
                <span>Search 100</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Live Counters Grid */}
        <div ref={countersRef} className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
          <div className="hud-card p-6 rounded-3xl text-center shadow-luxury-soft hover:scale-[1.02] transition-transform">
            <Trophy className="w-7 h-7 text-[#7C3AED] mx-auto mb-2" />
            <div className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#0A0A12]">{stats.items}+</div>
            <div className="text-[11px] uppercase tracking-widest text-[#4C1D95] font-extrabold mt-1">Verified Standings</div>
          </div>

          <div className="hud-card p-6 rounded-3xl text-center shadow-luxury-soft hover:scale-[1.02] transition-transform">
            <Crown className="w-7 h-7 text-[#059669] mx-auto mb-2" />
            <div className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#0A0A12]">{stats.categories} Sectors</div>
            <div className="text-[11px] uppercase tracking-widest text-[#064E3B] font-extrabold mt-1">Complete 100 Pools</div>
          </div>

          <div className="hud-card p-6 rounded-3xl text-center shadow-luxury-soft hover:scale-[1.02] transition-transform">
            <Split className="w-7 h-7 text-[#7C3AED] mx-auto mb-2" />
            <div className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#0A0A12]">Live Matrix</div>
            <div className="text-[11px] uppercase tracking-widest text-[#4C1D95] font-extrabold mt-1">Side-by-Side Model Diff</div>
          </div>

          <div className="hud-card p-6 rounded-3xl text-center shadow-luxury-soft hover:scale-[1.02] transition-transform">
            <ShieldCheck className="w-7 h-7 text-[#059669] mx-auto mb-2" />
            <div className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#0A0A12]">100% Links</div>
            <div className="text-[11px] uppercase tracking-widest text-[#064E3B] font-extrabold mt-1">Official Certified Portals</div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default HeroSection;
