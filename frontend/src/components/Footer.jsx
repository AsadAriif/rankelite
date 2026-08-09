import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Shield, Split, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-purple-200 bg-white text-gray-600 text-sm relative z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group text-decoration-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#4C1D95] to-[#059669] p-[1.5px] flex items-center justify-center shadow-regal-strong">
                <div className="w-full h-full bg-[#0A0A12] rounded-[11px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#A78BFA]" />
                </div>
              </div>
              <span className="font-serif-luxury text-2xl font-black tracking-widest text-[#0A0A12]">
                ELITE<span className="purple-gradient-text">RANK</span>
              </span>
            </Link>
            <p className="text-xs text-gray-600 font-normal max-w-sm leading-relaxed">
              The premier global index ranking the top 100 powerhouses across smartphones, wealth, supercars, universities, football clubs, airlines, tech giants, and luxury resorts.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#059669] font-extrabold">
              <Shield className="w-4 h-4 text-[#059669]" />
              <span>100% Certified Official Portal External Links</span>
            </div>
          </div>

          {/* Quick 100 Sectors Col 1 */}
          <div>
            <h4 className="font-serif-luxury text-xs uppercase tracking-widest text-[#4C1D95] font-black mb-4">
              Top 100 Sectors
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-700">
              <li><Link to="/category/smartphones" className="hover:text-[#7C3AED] transition-colors">📱 100 Smartphones</Link></li>
              <li><Link to="/category/billionaires" className="hover:text-[#7C3AED] transition-colors">👑 100 World Billionaires</Link></li>
              <li><Link to="/category/supercars" className="hover:text-[#7C3AED] transition-colors">🏎️ 100 Hypercars & Exotics</Link></li>
              <li><Link to="/category/football-clubs" className="hover:text-[#7C3AED] transition-colors">⚽ 100 Football Clubs</Link></li>
            </ul>
          </div>

          {/* Quick 100 Sectors Col 2 */}
          <div>
            <h4 className="font-serif-luxury text-xs uppercase tracking-widest text-[#4C1D95] font-black mb-4">
              Institutions & Luxury
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-700">
              <li><Link to="/category/universities" className="hover:text-[#7C3AED] transition-colors">🎓 100 Universities</Link></li>
              <li><Link to="/category/airlines" className="hover:text-[#7C3AED] transition-colors">✈️ 100 Premier Airlines</Link></li>
              <li><Link to="/category/tech-companies" className="hover:text-[#7C3AED] transition-colors">💻 100 Tech Giants</Link></li>
              <li><Link to="/category/luxury-hotels" className="hover:text-[#7C3AED] transition-colors">🏨 100 Luxury Hotels</Link></li>
            </ul>
          </div>

          {/* Platform Tools */}
          <div>
            <h4 className="font-serif-luxury text-xs uppercase tracking-widest text-[#4C1D95] font-black mb-4">
              Executive Tools
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-gray-700">
              <li><Link to="/compare" className="text-[#059669] hover:underline font-bold flex items-center space-x-1"><Split className="w-3.5 h-3.5" /><span>Live Compare Matrix</span></Link></li>
              <li><Link to="/favorites" className="hover:text-[#7C3AED] transition-colors">VIP Saved Portfolio</Link></li>
              <li><Link to="/search" className="hover:text-[#7C3AED] transition-colors">Global Search Matrix</Link></li>
              <li><Link to="/admin" className="hover:text-[#7C3AED] transition-colors">Executive Admin Portal</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 EliteRank International. All official brand trademarks and telemetry belong to their respective entities.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>All 800 Profiles Live</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
