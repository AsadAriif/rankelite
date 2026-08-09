import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Crown, LayoutDashboard, Layers, Trophy, Users, Settings, LogOut, Plus, Trash2, Edit3, X, Eye } from 'lucide-react';

const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eliterank_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Admin Dashboard Component
const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/analytics').then(res => setAnalytics(res.data.data)).catch(console.error);
  }, []);

  const stats = analytics?.stats || {};
  const topItems = analytics?.topItems || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Executive Dashboard</h1>
          <p className="text-gray-400 text-sm">Real-time management of global categories, items, and users.</p>
        </div>
        <Link to="/items/new" className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl uppercase tracking-wider">
          + Add Rank Item
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-[#121212] rounded-2xl border border-gray-800">
          <span className="text-xs uppercase text-[#D4AF37] font-semibold">Total Users</span>
          <div className="text-3xl font-bold text-white mt-1">{stats.totalUsers || 0}</div>
        </div>
        <div className="p-6 bg-[#121212] rounded-2xl border border-gray-800">
          <span className="text-xs uppercase text-[#D4AF37] font-semibold">Categories</span>
          <div className="text-3xl font-bold text-white mt-1">{stats.totalCategories || 0}</div>
        </div>
        <div className="p-6 bg-[#121212] rounded-2xl border border-gray-800">
          <span className="text-xs uppercase text-[#D4AF37] font-semibold">Ranked Items</span>
          <div className="text-3xl font-bold text-white mt-1">{stats.totalItems || 0}</div>
        </div>
        <div className="p-6 bg-[#121212] rounded-2xl border border-gray-800">
          <span className="text-xs uppercase text-[#D4AF37] font-semibold">Total Views</span>
          <div className="text-3xl font-bold text-white mt-1">{stats.totalViews || 0}</div>
        </div>
      </div>

      <div className="p-6 bg-[#121212] rounded-2xl border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Top 5 Viewed Ranks</h3>
        <div className="space-y-3">
          {topItems.map((item) => (
            <div key={item.id} className="p-3 bg-[#181818] rounded-xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                  <span className="text-xs text-gray-400">{item.category_name} • Rank #{item.rank}</span>
                </div>
              </div>
              <span className="text-xs text-[#FFD700] font-semibold">{item.views_count} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Category Manager Component
const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-white">Categories Schema</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="p-6 bg-[#121212] rounded-2xl border border-gray-800">
            <h3 className="font-bold text-lg text-white mb-1">{c.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{c.description}</p>
            <span className="text-xs text-[#D4AF37] font-semibold">{c.item_count || 0} Ranked Items</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('eliterank_token');
    if (token) {
      api.get('/auth/me').then(res => setUser(res.data.user)).catch(() => localStorage.removeItem('eliterank_token')).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#080808] text-white flex">
        <aside className="w-64 p-6 border-r border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <Crown className="w-6 h-6 text-[#FFD700]" />
              <span className="font-serif text-xl font-bold text-white">ELITERANK</span>
            </div>
            <nav className="space-y-3 font-medium text-sm text-gray-400">
              <Link to="/" className="block p-2 hover:text-white">Dashboard</Link>
              <Link to="/categories" className="block p-2 hover:text-white">Categories</Link>
              <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="block p-2 text-[#FFD700]">→ View Main Site</a>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/categories" element={<CategoryManager />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
