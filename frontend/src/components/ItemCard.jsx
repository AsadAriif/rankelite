import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Award, ArrowUpRight, Split, Check, ExternalLink, Globe, ShieldCheck, Edit3, X, Save } from 'lucide-react';
import { formatFieldValue } from '../utils/formatters';
import { favoriteService, itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';

const ItemCard = ({ item: initialItem, onUpdate }) => {
  const { user, isAdmin } = useAuth();
  const { isInCompare, toggleCompare, openSubpropertyModal } = useCompare();
  const [item, setItem] = useState(initialItem);
  const [isFavorite, setIsFavorite] = useState(initialItem.isFavorite || false);
  const [favLoading, setFavLoading] = useState(false);

  // Admin Quick Edit In-Place State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editRank, setEditRank] = useState(item.rank);
  const [editCountry, setEditCountry] = useState(item.country || '');
  const [editImage, setEditImage] = useState(item.image_url || '');
  const [editDescription, setEditDescription] = useState(item.description || '');
  const [editWebsite, setEditWebsite] = useState(item.custom_values?.website || item.website || '');
  const [editCustomValues, setEditCustomValues] = useState(item.custom_values || {});
  const [saving, setSaving] = useState(false);

  const compared = isInCompare(item.id);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to add items to your VIP Favorites portfolio.');
      return;
    }
    setFavLoading(true);
    try {
      const res = await favoriteService.toggleFavorite(item.id);
      if (res.success) {
        setIsFavorite(res.isFavorite);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(item);
  };

  const handleSubpropertyClick = (e, key, val) => {
    e.preventDefault();
    e.stopPropagation();
    openSubpropertyModal(item, key, val);
  };

  const handleOpenEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(item.title);
    setEditRank(item.rank);
    setEditCountry(item.country || '');
    setEditImage(item.image_url || '');
    setEditDescription(item.description || '');
    setEditWebsite(item.custom_values?.website || item.website || '');
    setEditCustomValues(item.custom_values || {});
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const mergedValues = { ...editCustomValues };
      if (editWebsite) mergedValues.website = editWebsite;

      const payload = {
        category_id: item.category_id,
        title: editTitle,
        rank: Number(editRank),
        country: editCountry,
        image_url: editImage,
        description: editDescription,
        custom_values: mergedValues,
        status: 'active'
      };

      const res = await itemService.update(item.id, payload);
      if (res.success) {
        const updatedItem = res.data;
        setItem(updatedItem);
        setShowEditModal(false);
        if (onUpdate) onUpdate(updatedItem);
        alert(`✅ Rank #${updatedItem.rank} "${updatedItem.title}" updated successfully!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update item.');
    } finally {
      setSaving(false);
    }
  };

  // Rank Badge Styles in Purple, Gold & Emerald with animations
  const getRankBadgeStyle = (rank) => {
    if (rank === 1) return 'gold-shimmer-badge text-white font-black shadow-[0_0_15px_rgba(212,175,55,0.7)] border-white';
    if (rank === 2) return 'bg-gradient-to-r from-slate-200 via-gray-300 to-slate-400 text-black font-black border-white shadow-[0_0_10px_rgba(200,200,200,0.5)]';
    if (rank === 3) return 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-800 text-white font-black border-emerald-300 shadow-[0_0_10px_rgba(5,150,105,0.5)]';
    return 'bg-[#F5F3FF] text-[#4C1D95] border-[#7C3AED]/40 font-extrabold';
  };

  const officialWebsite = item.custom_values?.website || item.website || 'https://www.google.com';

  return (
    <div className={`hud-card rounded-3xl border overflow-hidden flex flex-col justify-between hover:border-[#7C3AED] transition-all duration-300 shadow-luxury-card hover:-translate-y-2 bg-white group relative ${
      item.rank === 1 ? 'rank-1-halo border-[#D4AF37]/80' : 'border-[#7C3AED]/30'
    }`}>
      
      {/* Visual Header / Cover Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

        {/* Official Rank Badge with special Icon */}
        <div className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider ${getRankBadgeStyle(item.rank)} flex items-center space-x-1.5 shadow-md border`}>
          {item.rank === 1 ? <Crown className="w-3.5 h-3.5 text-yellow-300 animate-pulse" /> : <Award className="w-3.5 h-3.5" />}
          <span>RANK #{item.rank}</span>
        </div>


        {/* Action Badges on Cover */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {/* Admin Live In-Place Edit Trigger */}
          {isAdmin && (
            <button
              onClick={handleOpenEdit}
              className="px-3 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center space-x-1 shadow-gold-strong border border-white transition-all hover:scale-105"
              title="Admin Quick Edit (Modify in Real-Time)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          {/* Compare Toggle */}
          <button
            onClick={handleCompareClick}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              compared
                ? 'bg-[#059669] text-white ring-2 ring-white'
                : 'bg-white/85 text-gray-800 hover:text-[#7C3AED]'
            }`}
            title="Side-by-Side Model Comparison"
          >
            {compared ? <Check className="w-4 h-4" /> : <Split className="w-4 h-4" />}
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className="p-2.5 rounded-full bg-white/85 text-gray-800 hover:text-red-500 backdrop-blur-md transition-all shadow-md"
            title="Save to VIP Portfolio"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Location & Verified Badge */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-black/75 text-[#DDD6FE] font-bold border border-white/20 flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-[#A78BFA]" />
            <span>{item.country || 'Global'}</span>
          </span>

          <div
            onClick={(e) => handleSubpropertyClick(e, 'Verification Status', '100% Certified Official Record')}
            className="cursor-pointer text-xs text-emerald-300 bg-black/75 px-2.5 py-1 rounded-xl border border-emerald-500/50 flex items-center space-x-1 font-bold hover:bg-emerald-950/80 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified 2026</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link to={`/item/${item.slug || item.id}`} className="block group-hover:text-[#7C3AED] transition-colors">
            <h3 className="font-serif-luxury text-xl font-bold text-[#0A0A12] mb-1 line-clamp-1 group-hover:translate-x-0.5 transition-transform">
              {item.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 font-normal leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Subproperties Matrix Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-purple-100 text-xs">
          {Object.entries(item.custom_values || {})
            .filter(([k]) => k !== 'website')
            .slice(0, 4)
            .map(([key, val]) => (
              <div
                key={key}
                onClick={(e) => handleSubpropertyClick(e, key, formatFieldValue(val, key))}
                className="bg-[#F5F3FF] hover:bg-[#EDE9FE] p-2.5 rounded-xl border border-purple-200 hover:border-[#7C3AED] cursor-pointer transition-colors duration-200 group/pill"
                title="Click to view verified official link"
              >
                <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-bold truncate">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="font-bold text-[#0A0A12] group-hover/pill:text-[#7C3AED] truncate block mt-0.5">
                  {formatFieldValue(val, key)}
                </span>
              </div>
            ))}
        </div>

        {/* Bottom CTA Action Area */}
        <div className="pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
          <a
            href={officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#ECFDF5] border border-emerald-300 text-[#064E3B] hover:bg-[#059669] hover:text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Main Website</span>
            <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <Link
            to={`/item/${item.slug || item.id}`}
            className="p-2.5 px-3.5 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#7C3AED] font-bold text-xs flex items-center space-x-1 border border-purple-200 transition-colors"
          >
            <span>Inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </div>

      {/* ================= IN-PLACE LIVE ADMIN EDIT MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-[#D4AF37] shadow-gold-strong my-8 bg-[#0E0E12] text-left">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-black">ADMIN IN-PLACE LIVE EDITOR</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Edit Rank #{item.rank} - {item.title}
                </h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Rank # (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={editRank}
                    onChange={(e) => setEditRank(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white font-bold text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Item Title / Model</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Official Website Link</label>
                <input
                  type="url"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Dynamic Custom Specs */}
              {Object.keys(editCustomValues).length > 0 && (
                <div className="pt-2 border-t border-gray-800">
                  <span className="text-[10px] uppercase tracking-wider text-[#FFD700] font-bold block mb-2">Specifications</span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(editCustomValues).filter(([k]) => k !== 'website').map(([k, v]) => (
                      <div key={k}>
                        <label className="block text-[10px] text-gray-400 uppercase truncate mb-0.5">{k.replace(/_/g, ' ')}</label>
                        <input
                          type="text"
                          value={v}
                          onChange={(e) => setEditCustomValues({ ...editCustomValues, [k]: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#141418] border border-gray-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs uppercase tracking-wider shadow-gold-strong flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save & Update Item'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ItemCard;

