import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Search, Heart, Shield, LogOut, User, Menu, X, ChevronDown, Split, Sparkles, Sliders, Database, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useReducedMotion, gsap } from '../utils/useCinematicAnimation';
import ScrollProgress from './ScrollProgress';

const Navbar = ({ onOpenSearch }) => {
  const { user, logout, isAdmin, loginAsAdmin } = useAuth();
  const { compareItems } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header Page Load Entrance Animation
  useEffect(() => {
    if (reducedMotion || !navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, [reducedMotion]);

  // Mobile Menu Staggered Transition
  useEffect(() => {
    if (reducedMotion || !mobileMenuOpen || !mobileMenuRef.current) return;
    const items = mobileMenuRef.current.querySelectorAll('.mobile-menu-item');
    gsap.fromTo(
      items,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out' }
    );
  }, [mobileMenuOpen, reducedMotion]);

  return (
    <>
      <ScrollProgress />
      <nav
        ref={navRef}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-2xl border-b border-[#7C3AED]/35 shadow-luxury-soft py-0'
            : 'bg-white/90 backdrop-blur-xl border-b border-[#7C3AED]/20 py-1'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Live Radar Beacon */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3 group text-decoration-none">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#4C1D95] to-[#059669] p-[1.5px] flex items-center justify-center shadow-regal-strong group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-[#0A0A12] rounded-[14px] flex items-center justify-center">
                    <Crown className="w-6 h-6 text-[#A78BFA] group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <div>
                  <span className="font-serif-luxury text-2xl sm:text-3xl font-black tracking-widest text-[#0A0A12]">
                    ELITE<span className="purple-gradient-text">RANK</span>
                  </span>
                  <span className="block text-[8.5px] uppercase tracking-[0.35em] text-[#059669] font-extrabold">
                    THE 100 EXCELLENCE INDEX
                  </span>
                </div>
              </Link>

              {/* Pulsing Live Radar Indicator */}
              <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#059669] radar-beacon shrink-0" />
                <span>800 Live Standings</span>
              </div>
            </div>


          {/* Search Bar Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center justify-between w-80 px-4 py-2.5 rounded-full bg-[#F5F3FF] border border-[#7C3AED]/35 text-gray-700 hover:border-[#059669] hover:bg-white hover:shadow-purple-glow transition-all duration-300"
          >
            <div className="flex items-center space-x-2.5 text-sm">
              <Search className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-xs text-gray-700 font-medium truncate">Search 100 Mobiles, Clubs, Titans...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-white text-purple-700 rounded-md border border-purple-200">⌘K</kbd>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 text-sm font-bold text-[#0A0A12]">
            <Link to="/" className="text-gray-800 hover:text-[#7C3AED] transition-colors">
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center space-x-1.5 text-gray-800 group-hover:text-[#7C3AED] transition-colors">
                <span>100 Categories</span>
                <ChevronDown className="w-4 h-4 text-[#7C3AED] group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl p-2.5 hidden group-hover:block shadow-2xl border border-[#7C3AED]/35 animate-in fade-in zoom-in-95">
                <Link to="/category/smartphones" className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#F5F3FF] hover:text-[#7C3AED] rounded-xl transition-colors">📱 100 Smartphones</Link>
                <Link to="/category/billionaires" className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#F5F3FF] hover:text-[#7C3AED] rounded-xl transition-colors">👑 100 Billionaires</Link>
                <Link to="/category/supercars" className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#F5F3FF] hover:text-[#7C3AED] rounded-xl transition-colors">🏎️ 100 Hypercars</Link>
                <Link to="/category/football-clubs" className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#ECFDF5] hover:text-[#059669] rounded-xl transition-colors">⚽ 100 Football Clubs</Link>
                <Link to="/category/universities" className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#F5F3FF] hover:text-[#7C3AED] rounded-xl transition-colors">🎓 100 Universities</Link>
                <Link to="/category/airlines" className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#ECFDF5] hover:text-[#059669] rounded-xl transition-colors">✈️ 100 Premier Airlines</Link>
                <Link to="/category/tech-companies" className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#F5F3FF] hover:text-[#7C3AED] rounded-xl transition-colors">💻 100 Tech Giants</Link>
                <Link to="/category/luxury-hotels" className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#ECFDF5] hover:text-[#059669] rounded-xl transition-colors">🏨 100 5-Star Luxury Resorts</Link>
              </div>
            </div>

            {/* Compare Matrix Link */}
            <Link to="/compare" className="flex items-center space-x-1.5 text-[#059669] hover:text-[#064E3B] transition-colors relative">
              <Split className="w-4 h-4 text-[#059669]" />
              <span>Compare</span>
              {compareItems.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-[#059669] text-white">
                  {compareItems.length}
                </span>
              )}
            </Link>

            <Link to="/favorites" className="flex items-center space-x-1.5 text-gray-800 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Saved VIP</span>
            </Link>

            {/* Admin Panel Direct Link */}
            <Link
              to="/admin"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#2E1065] text-purple-200 hover:text-white border border-purple-500/40 text-xs font-extrabold tracking-wide hover:shadow-purple-glow transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Admin Panel</span>
            </Link>
          </div>

          {/* Action Right Area */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/compare" className="px-5 py-2.5 rounded-full btn-emerald-action text-xs uppercase tracking-wider flex items-center space-x-2">
              <Split className="w-4 h-4" />
              <span>Live Matrix ({compareItems.length})</span>
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/admin" className="flex items-center space-x-2 bg-[#F5F3FF] p-1.5 pr-4 rounded-full border border-[#7C3AED]/30">
                  <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs font-bold text-gray-800">{user.name}</span>
                </Link>
                <button onClick={logout} title="Sign Out" className="p-2 rounded-full text-gray-500 hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (loginAsAdmin) loginAsAdmin();
                    else window.location.href = '/admin';
                  }}
                  className="px-3.5 py-2 rounded-full bg-[#181818] text-[#FFD700] text-xs font-extrabold border border-[#D4AF37]/50 hover:bg-black transition-all"
                  title="Quick VIP Admin Dashboard Access"
                >
                  ⚡ Admin Mode
                </button>
                <Link to="/login" className="px-5 py-2.5 rounded-full btn-purple-action text-xs uppercase tracking-wider">
                  VIP Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link to="/admin" className="p-2 rounded-xl bg-[#2E1065] text-purple-200 border border-purple-500/40 text-xs font-bold">
              <Shield className="w-4 h-4" />
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2.5 rounded-xl bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/30">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden bg-white border-b border-[#7C3AED]/30 px-6 py-6 space-y-4 shadow-2xl">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-sm font-bold text-gray-800">Home</Link>
          
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block p-3 rounded-xl bg-[#2E1065] text-purple-200 font-extrabold text-xs">
            🛡️ Admin Panel & 100-Item Batch Manager
          </Link>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="mobile-menu-item text-[10px] uppercase tracking-widest text-[#7C3AED] font-black block">Explore 100 Sectors</span>
            <Link to="/category/smartphones" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-xs font-bold text-gray-700 py-1">📱 100 Smartphones</Link>
            <Link to="/category/billionaires" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-xs font-bold text-gray-700 py-1">👑 100 Billionaires</Link>
            <Link to="/category/supercars" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-xs font-bold text-gray-700 py-1">🏎️ 100 Hypercars</Link>
            <Link to="/category/football-clubs" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-xs font-bold text-gray-700 py-1">⚽ 100 Football Clubs</Link>
            <Link to="/category/universities" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-xs font-bold text-gray-700 py-1">🎓 100 Universities</Link>
            <Link to="/category/airlines" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-xs font-bold text-gray-700 py-1">✈️ 100 Premier Airlines</Link>
            <Link to="/category/tech-companies" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-xs font-bold text-gray-700 py-1">💻 100 Tech Giants</Link>
            <Link to="/category/luxury-hotels" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item block text-xs font-bold text-gray-700 py-1">🏨 100 5-Star Luxury Resorts</Link>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <Link to="/compare" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item text-xs font-bold text-[#059669] flex items-center space-x-1">
              <Split className="w-4 h-4" />
              <span>Compare Matrix ({compareItems.length})</span>
            </Link>
            <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item text-xs font-bold text-red-500 flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>Saved VIP</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  </>
  );
};

export default Navbar;



