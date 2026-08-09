import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { Settings, Save, Check, Download, Upload, Database, Sparkles, RefreshCw, ShieldCheck, FileText } from 'lucide-react';

const SettingsManager = () => {
  const [settings, setSettings] = useState({
    site_name: 'EliteRank',
    site_tagline: 'The Definitive Global Luxury & Excellence Rankings',
    hero_title: 'Curated Global Power, Wealth & Excellence',
    hero_subtitle: 'Explore real-time data-driven rankings of world leaders, hypercars, tech innovations, premier institutions, and iconic brands.',
    contact_email: 'concierge@eliterank.com',
    ticker_text: 'ELITE 100 REAL-TIME TELEMETRY • VERIFIED RATINGS ACROSS 8 GLOBAL VERTICALS • AUTONOMOUS BENCHMARK ENGINE'
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminService.getSettings();
        if (res.success && Object.keys(res.data).length > 0) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await adminService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to update settings.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportDatabase = async () => {
    try {
      const res = await adminService.exportDb();
      if (res.success) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `eliterank_complete_database_backup_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        alert('🎉 Full database exported successfully!');
      }
    } catch (err) {
      alert('Failed to export database backup.');
    }
  };

  const handleImportDatabase = async (e) => {
    e.preventDefault();
    if (!importJsonText.trim()) return alert('Please paste JSON data to import.');
    setActionLoading(true);

    try {
      const parsed = JSON.parse(importJsonText);
      const res = await adminService.importDb(parsed);
      if (res.success) {
        alert(`✅ Database successfully restored! (${res.message})`);
        setShowImportModal(false);
        setImportJsonText('');
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid JSON format or import error.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#D4AF37] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>GLOBAL SYSTEM CONFIGURATION</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-white">
            Branding, Settings & <span className="gold-gradient-text">Database Backup</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Customize global headlines, live marquee ticker, concierge endpoints, and execute 1-click full database backups.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleExportDatabase}
            className="px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222] text-[#FFD700] border border-[#D4AF37]/50 text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
            title="Download full JSON snapshot of all categories, items, and settings"
          >
            <Download className="w-4 h-4" />
            <span>Export Database</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2E1065] hover:bg-[#4C1D95] text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Restore / Import DB</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-sm flex items-center space-x-2 shadow-luxury-soft">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">Website branding and live settings updated successfully across the entire platform!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-[#D4AF37]/35 space-y-6 bg-[#101014] shadow-luxury-card">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
              Platform Brand Name
            </label>
            <input
              type="text"
              name="site_name"
              value={settings.site_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37] font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
              Platform Tagline
            </label>
            <input
              type="text"
              name="site_tagline"
              value={settings.site_tagline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Hero Headline Title (Homepage)
          </label>
          <input
            type="text"
            name="hero_title"
            value={settings.hero_title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37] font-serif-luxury font-bold"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Hero Subtitle Text
          </label>
          <textarea
            name="hero_subtitle"
            value={settings.hero_subtitle}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Global Live Marquee Ticker Text
          </label>
          <input
            type="text"
            name="ticker_text"
            value={settings.ticker_text || ''}
            onChange={handleChange}
            placeholder="ELITE 100 REAL-TIME TELEMETRY • VERIFIED RATINGS ACROSS GLOBAL SECTORS..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-[#FFD700] text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Executive Concierge Email
          </label>
          <input
            type="email"
            name="contact_email"
            value={settings.contact_email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>All modifications are mirrored to persistent disk storage & PostgreSQL.</span>
          </div>

          <button
            type="submit"
            disabled={actionLoading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider shadow-gold-strong hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{actionLoading ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

      {/* ================= IMPORT / RESTORE DATABASE MODAL ================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl glass-panel p-8 rounded-3xl border border-[#D4AF37]/50 shadow-gold-strong my-8 bg-[#0E0E12]">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-black">SYSTEM DISASTER RECOVERY</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">Restore Complete Database</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-white p-2">
                ✕
              </button>
            </div>

            <form onSubmit={handleImportDatabase} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Paste Full Database JSON Snapshot
                </label>
                <textarea
                  rows={10}
                  required
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='{"categories": [...], "items": [...], "settings": {...}}'
                  className="w-full p-4 rounded-2xl bg-[#141418] border border-gray-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                ⚠️ Warning: Restoring will overwrite existing categories and items with the backup payload.
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-2"
                >
                  <Database className="w-4 h-4" />
                  <span>{actionLoading ? 'Restoring...' : 'Execute Database Restore'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsManager;

