import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { Users, Layers, Trophy, Eye, Plus, Settings, ShieldAlert, TrendingUp, Sparkles, Upload, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminService.getAnalytics();
        if (res.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-400 text-center">Loading Executive Intelligence...</div>;
  }

  const { stats, topItems } = analytics || { stats: {}, topItems: [] };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#D4AF37] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>EXECUTIVE COMMAND SYSTEM</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-white">
            Admin <span className="gold-gradient-text">Master Console</span>
          </h1>
          <p className="text-gray-400 text-sm font-light">
            Real-time management of 100-rank sectors, custom schemas, bulk batch uploaders, and database backups.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/categories"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-gold-strong flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Category & 100 Items</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#101014] shadow-luxury-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Active Sectors</span>
            <Layers className="w-5 h-5 text-[#FFD700]" />
          </div>
          <div className="font-serif-luxury text-3xl font-bold text-white">
            {stats.totalCategories || 0}
          </div>
          <span className="text-[10px] text-gray-400">Unlimited custom schemas</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#101014] shadow-luxury-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Ranked Entities</span>
            <Trophy className="w-5 h-5 text-[#FFD700]" />
          </div>
          <div className="font-serif-luxury text-3xl font-bold text-white">
            {stats.totalItems || 0}
          </div>
          <span className="text-[10px] text-emerald-400">100 verified ranks per sector</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#101014] shadow-luxury-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Total Views</span>
            <Eye className="w-5 h-5 text-[#FFD700]" />
          </div>
          <div className="font-serif-luxury text-3xl font-bold text-white">
            {stats.totalViews || 0}
          </div>
          <span className="text-[10px] text-gray-400">Global audience telemetry</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#101014] shadow-luxury-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Verified Users</span>
            <Users className="w-5 h-5 text-[#FFD700]" />
          </div>
          <div className="font-serif-luxury text-3xl font-bold text-white">
            {stats.totalUsers || 0}
          </div>
          <span className="text-[10px] text-purple-400">VIP Members & Admins</span>
        </div>

      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link to="/admin/categories" className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-[#D4AF37] transition-all group bg-[#101014]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 rounded-2xl bg-[#D4AF37]/10 text-[#FFD700] group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors">Category & 100-Item Batch Wizard</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Create new sectors, customize dynamic specifications, auto-generate 100 benchmark items, or paste CSV datasets.
          </p>
        </Link>

        <Link to="/admin/items" className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-[#D4AF37] transition-all group bg-[#101014]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 rounded-2xl bg-[#2E1065] text-[#DDD6FE] group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors">Item Rankings Manager</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Filter by sector, search profiles, edit official ranks, update photos and links, or upload 100 items at once.
          </p>
        </Link>

        <Link to="/admin/settings" className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-[#D4AF37] transition-all group bg-[#101014]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-3 rounded-2xl bg-[#064E3B] text-emerald-200 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors">Branding & Database Backup</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Configure site headlines, live marquee ticker, executive contact, and execute 1-click full database exports & restores.
          </p>
        </Link>

      </div>

      {/* Top Viewed Ranks List */}
      <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#101014]">
        <h3 className="font-serif-luxury text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[#FFD700]" />
          <span>Top 5 Most Viewed Items</span>
        </h3>
        
        <div className="space-y-3">
          {topItems.map((item) => (
            <div key={item.id} className="p-3.5 rounded-2xl bg-[#141418] border border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={item.image_url} alt={item.title} className="w-11 h-11 rounded-xl object-cover border border-gray-700" />
                <div>
                  <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                  <span className="text-xs text-gray-400">{item.category_name} • Rank #{item.rank}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#FFD700] font-semibold">
                <Eye className="w-3.5 h-3.5" />
                <span>{item.views_count} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;

