import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion, gsap, ScrollTrigger, LUXURY_EASE } from '../utils/useCinematicAnimation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PANELS = [
  {
    tag: 'SECTOR 01 • HYPERCARS',
    title: 'Bugatti Tourbillon',
    specs: '1,800 HP • 8.3L V16 • Cosworth Hybrid',
    desc: 'Crafted with 3D-printed titanium suspension arms and a sapphire glass instrument cluster.',
    img: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
    link: '/category/supercars'
  },
  {
    tag: 'SECTOR 02 • SMARTPHONES',
    title: 'iPhone 15 Pro Max',
    specs: '3nm A17 Pro • Grade 5 Titanium • 5x Optical',
    desc: 'Aerospace-grade titanium enclosure with hardware-accelerated ray tracing and spatial video.',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    link: '/category/smartphones'
  },
  {
    tag: 'SECTOR 03 • FOOTBALL',
    title: 'Real Madrid CF',
    specs: '15 European Cups • Santiago Bernabéu',
    desc: 'The undisputed royalty of global football with 15 UCL crowns and state-of-the-art retractable stadium pitch.',
    img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    link: '/category/football-clubs'
  },
  {
    tag: 'SECTOR 04 • BILLIONAIRES',
    title: 'Elon Musk ($242B)',
    specs: 'Tesla • SpaceX • Neuralink • xAI',
    desc: 'Pioneering reusable orbital rockets, autonomous mobility, and artificial superintelligence.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
    link: '/category/billionaires'
  }
];

const HorizontalStory = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !trackRef.current || window.innerWidth <= 768) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const calculateScroll = () => {
        return track.scrollWidth - window.innerWidth + 80;
      };

      const tween = gsap.to(track, {
        x: () => -calculateScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: () => `+=${Math.max(1400, calculateScroll())}`,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(Math.round(self.progress * 100));
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          }
        }
      });

      // Recalculate dimensions cleanly after layout settles
      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);
      window.addEventListener('load', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('load', handleResize);
      };
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-b from-[#FAFAFC] via-[#F5F3FF] to-white py-16 overflow-hidden border-t border-b border-purple-200">
      
      {/* Dynamic Top Scroll Progress Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-purple-100 overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#059669] origin-left scale-x-0 transition-transform duration-75"
        />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-[0.25em] text-[#7C3AED] mb-1">
              <Sparkles className="w-4 h-4 text-[#059669]" />
              <span>CINEMATIC HORIZONTAL GALLERY</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#0A0A12]">
              Horizontal Showcase of <span className="purple-gradient-text">World Champions</span>
            </h2>
          </div>

          <div className="text-xs font-mono font-bold text-gray-500 hidden sm:flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
            <span className="text-[#7C3AED]">{scrollProgress}%</span>
            <span>•</span>
            <span>Scroll to navigate horizontally</span>
            <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
          </div>
        </div>
      </div>

      {/* Track Viewport */}
      <div className="w-full overflow-x-auto sm:overflow-hidden no-scrollbar">
        <div ref={trackRef} className="flex space-x-8 px-4 sm:px-8 w-max will-change-transform">
          {PANELS.map((panel, idx) => (
            <div
              key={idx}
              className="w-[85vw] sm:w-[480px] lg:w-[560px] shrink-0 bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-luxury-card flex flex-col justify-between group hover:border-[#7C3AED] transition-colors"
            >
              {/* Top Media Container */}
              <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden mb-6 bg-black border border-purple-100">
                <img
                  src={panel.img}
                  alt={panel.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#4C1D95] text-[10px] font-black uppercase tracking-wider border border-purple-300 shadow-sm">
                  {panel.tag}
                </div>
              </div>

              {/* Bottom Information */}
              <div>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-black text-[#0A0A12] mb-2 group-hover:text-[#7C3AED] transition-colors">
                  {panel.title}
                </h3>
                <p className="text-[#059669] text-xs font-extrabold uppercase tracking-wider mb-3">
                  {panel.specs}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-normal leading-relaxed mb-6">
                  {panel.desc}
                </p>

                <Link
                  to={panel.link}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl btn-purple-action btn-micro-engineered text-xs uppercase tracking-wider"
                >
                  <span>Explore Sector</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default HorizontalStory;
