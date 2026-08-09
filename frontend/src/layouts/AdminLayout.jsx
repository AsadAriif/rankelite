import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, LayoutDashboard, Layers, Trophy, Users, Settings, ExternalLink, LogOut, Shield } from 'lucide-react';

const AdminLayout = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#080808] flex items-center justify-center text-gray-400">Verifying Admin Privileges...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Category Schema', path: '/admin/categories', icon: Layers },
    { label: 'Item Rankings', path: '/admin/items', icon: Trophy },
    { label: 'Users & Roles', path: '/admin/users', icon: Users },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-[#D4AF37]/20 flex flex-col justify-between p-6">
        <div>
          
          {/* Admin Header Logo */}
          <Link to="/" className="flex items-center space-x-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] p-0.5 shadow-gold-strong flex items-center justify-center">
              <div className="w-full h-full bg-[#080808] rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#FFD700]" />
              </div>
            </div>
            <div>
              <span className="font-serif-luxury text-lg font-bold gold-gradient-text">ELITERANK</span>
              <span className="block text-[9px] uppercase tracking-widest text-gray-400">ADMIN CONSOLE</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold shadow-gold-glow'
                      : 'text-gray-400 hover:text-white hover:bg-[#121212]'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#D4AF37]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-gray-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-gray-400 hover:text-[#FFD700] px-2 py-1.5"
          >
            <span>View Public Platform</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
