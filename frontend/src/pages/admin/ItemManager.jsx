import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { itemService, categoryService, adminService } from '../../services/api';
import { Trophy, Plus, Trash2, Edit3, Upload, Download, RefreshCw, X, Check, Search, Filter, Globe, ExternalLink, Sparkles, ShieldCheck, Layers, Eye, ArrowRight, Save, LayoutGrid, List } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { formatFieldValue } from '../../utils/formatters';

const ItemManager = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rankJumpInput, setRankJumpInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewMode, setViewMode] = useState('visual'); // 'visual' (public look), 'table'

  // Modals & In-Place Live Editor State
  const [showItemModal, setShowItemModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Single Item Form State
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rank, setRank] = useState(1);
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [customValues, setCustomValues] = useState({});
  const [selectedCategoryFields, setSelectedCategoryFields] = useState([]);

  // Bulk Upload State
  const [bulkCategoryId, setBulkCategoryId] = useState('');
  const [bulkDataText, setBulkDataText] = useState('');
  const [bulkReplaceExisting, setBulkReplaceExisting] = useState(true);

  // Success Notification Banner
  const [successNotice, setSuccessNotice] = useState('');

  const itemRefs = useRef({});

  const fetchData = async () => {
    try {
      const [itemRes, catRes] = await Promise.all([
        itemService.getAll({ limit: 1200 }),
        categoryService.getAll()
      ]);
      if (itemRes.success) setItems(itemRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !selectedCategory) {
          setSelectedCategory(catRes.data[0]);
          setCategoryId(catRes.data[0].id);
          setBulkCategoryId(catRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load items/categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // When selected category changes, load its custom fields schema
  useEffect(() => {
    if (!selectedCategory) return;
    setCategoryId(selectedCategory.id);
    setBulkCategoryId(selectedCategory.id);
    categoryService.getBySlug(selectedCategory.slug).then(res => {
      if (res.success && res.data.custom_fields) {
        setSelectedCategoryFields(res.data.custom_fields);
      } else {
        setSelectedCategoryFields([]);
      }
    });
  }, [selectedCategory]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setRankJumpInput('');
  };

  const handleJumpToRank = (rankNum) => {
    const targetRank = Number(rankNum);
    if (!targetRank) return;
    const targetItem = items.find(i => i.category_id === selectedCategory?.id && Number(i.rank) === targetRank);
    if (targetItem) {
      // Auto open edit for that exact item
      handleOpenEditModal(targetItem);
    } else {
      alert(`Rank #${targetRank} not found in ${selectedCategory?.name}.`);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80');
    const categoryItems = items.filter(i => i.category_id === selectedCategory?.id);
    setRank(categoryItems.length + 1);
    setCountry('Global');
    setWebsite('https://www.google.com');
    setCustomValues({});
    setShowItemModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setCategoryId(item.category_id);
    setTitle(item.title);
    setDescription(item.description || '');
    setImageUrl(item.image_url || '');
    setRank(item.rank);
    setCountry(item.country || '');
    setWebsite(item.custom_values?.website || item.website || '');
    setCustomValues(item.custom_values || {});
    setShowItemModal(true);
  };

  const handleCustomValueChange = (key, val) => {
    setCustomValues(prev => ({ ...prev, [key]: val }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await adminService.uploadImage(formData);
      if (res.success) {
        setImageUrl(res.url);
      }
    } catch (err) {
      alert('Image upload failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId) return alert('Title and Category are required.');
    setActionLoading(true);

    const mergedValues = { ...customValues };
    if (website) mergedValues.website = website;

    const payload = {
      category_id: categoryId,
      title,
      description,
      image_url: imageUrl,
      rank: Number(rank),
      country,
      custom_values: mergedValues,
      status: 'active'
    };

    try {
      if (editingItem) {
        await itemService.update(editingItem.id, payload);
        setSuccessNotice(`✅ Rank #${rank} "${title}" successfully updated!`);
      } else {
        await itemService.create(payload);
        setSuccessNotice(`✅ Rank #${rank} "${title}" successfully created!`);
      }
      setShowItemModal(false);
      setTimeout(() => setSuccessNotice(''), 4000);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save item.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await itemService.delete(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete item.');
      }
    }
  };

  const handleOpenBulkModal = (catId) => {
    if (catId) setBulkCategoryId(catId);
    setBulkDataText('');
    setShowBulkModal(true);
  };

  const handleBulkUploadSubmit = async (e) => {
    e.preventDefault();
    if (!bulkCategoryId || !bulkDataText.trim()) return alert('Category and bulk data are required.');
    setActionLoading(true);

    try {
      const res = await itemService.bulkCreate({
        category_id: bulkCategoryId,
        items: bulkDataText,
        replace_existing: bulkReplaceExisting
      });

      if (res.success) {
        setSuccessNotice(`✅ ${res.count} items uploaded successfully to ${selectedCategory?.name}!`);
        setShowBulkModal(false);
        setTimeout(() => setSuccessNotice(''), 4000);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to bulk upload items.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAutoGenerate100 = async (catId) => {
    const targetId = catId || selectedCategory?.id;
    const catObj = categories.find(c => c.id === Number(targetId));
    const catName = catObj ? catObj.name : 'selected category';

    if (!window.confirm(`Auto-populate 100 benchmark ranked items for "${catName}"? This will populate the category with full telemetry.`)) return;
    setActionLoading(true);

    try {
      const res = await categoryService.generate100(targetId);
      if (res.success) {
        setSuccessNotice(`🎉 100 benchmark items generated for ${catName}!`);
        setShowBulkModal(false);
        setTimeout(() => setSuccessNotice(''), 4000);
        fetchData();
      }
    } catch (err) {
      alert('Failed to generate items.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter items for active category
  const categoryItems = items
    .filter(item => selectedCategory ? item.category_id === selectedCategory.id : true)
    .sort((a, b) => Number(a.rank) - Number(b.rank));

  const filteredItems = categoryItems.filter(item => {
    const q = searchQuery.toLowerCase();
    return !searchQuery ||
      item.title.toLowerCase().includes(q) ||
      (item.country && item.country.toLowerCase().includes(q)) ||
      String(item.rank) === q ||
      JSON.stringify(item.custom_values || {}).toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#D4AF37] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>VISUAL PUBLIC LOOK & IN-PLACE LIVE EDITOR</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-white">
            Category & Item <span className="gold-gradient-text">Live Visual Editor</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Select any of the 8 categories (or custom sectors), view their public look, and click on any item (e.g. Item #58) to modify anything instantly.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => handleOpenBulkModal(selectedCategory?.id)}
            className="px-4 py-2.5 rounded-xl bg-[#2E1065] hover:bg-[#4C1D95] text-purple-200 hover:text-white font-bold text-xs uppercase tracking-wider border border-purple-500/40 shadow-sm flex items-center space-x-1.5 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk 100 Upload</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-gold-strong flex items-center space-x-2 border border-[#B58A14] transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Single Item</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-sm flex items-center space-x-3 shadow-luxury-soft animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{successNotice}</span>
        </div>
      )}

      {/* ================= STEP 1: VISUAL CATEGORY SELECTOR CARDS ================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-300">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>Select Sector Category to Inspect & Edit</span>
          </div>
          <span className="text-[11px] text-[#FFD700] font-mono font-bold">
            {categories.length} Sectors Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory?.id === cat.id;
            const count = items.filter(i => i.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#2E1065] to-[#141026] border-[#D4AF37] shadow-gold-strong scale-102 ring-1 ring-[#D4AF37]'
                    : 'bg-[#101014] border-gray-800 hover:border-[#7C3AED]/60 hover:bg-[#181820]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#D4AF37] text-black' : 'bg-gray-800 text-gray-400'}`}>
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 font-bold">{count}</span>
                </div>

                <div className="space-y-0.5">
                  <h4 className={`font-serif-luxury text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {cat.name}
                  </h4>
                  <span className="text-[9px] text-[#A78BFA] font-mono block truncate">
                    /{cat.slug}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= STEP 2: ACTIVE CATEGORY HEADER & DIRECT RANK JUMP ================= */}
      {selectedCategory && (
        <div className="glass-panel p-6 rounded-3xl border-2 border-[#D4AF37]/50 shadow-luxury-card bg-gradient-to-r from-[#121020] via-[#101018] to-[#0A0A12] space-y-5">
          
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
            <div className="flex items-center space-x-4">
              <img
                src={selectedCategory.banner_url || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80'}
                alt={selectedCategory.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#D4AF37]/50 shrink-0"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-wider">
                    SECTOR #{categories.findIndex(c => c.id === selectedCategory.id) + 1}
                  </span>
                  <span className="text-xs text-gray-400 font-bold font-mono">/{selectedCategory.slug}</span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-black text-white mt-1">
                  100 {selectedCategory.name}
                </h2>
                <p className="text-gray-400 text-xs line-clamp-1 max-w-xl">
                  {selectedCategory.description}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleAutoGenerate100(selectedCategory.id)}
                disabled={actionLoading}
                className="px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-emerald-200 hover:text-white text-xs font-bold flex items-center space-x-1.5 border border-emerald-500/40 shadow-sm transition-all"
                title="Auto 100 Items"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Auto 100 Items</span>
              </button>

              <Link
                to={`/category/${selectedCategory.slug}`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl bg-[#181818] hover:bg-[#222] text-[#D4AF37] text-xs font-bold flex items-center space-x-1.5 border border-gray-700 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>View Public Page ↗</span>
              </Link>
            </div>
          </div>

          {/* Direct Rank Jump Bar & Search */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-2">
            
            {/* Quick Rank Jump Pills (e.g. #1, #10, #25, #50, #58, #75, #100) */}
            <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mr-1">Direct Rank Jump:</span>
              {[1, 10, 25, 50, 58, 75, 100].map((r) => (
                <button
                  key={r}
                  onClick={() => handleJumpToRank(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border ${
                    r === 58
                      ? 'bg-[#D4AF37] text-black border-white shadow-gold-strong scale-105'
                      : 'bg-[#181820] text-gray-300 hover:text-white hover:bg-[#2E1065] border-gray-700'
                  }`}
                  title={`Directly edit item Rank #${r}`}
                >
                  #{r}
                </button>
              ))}
            </div>

            {/* Jump Input & Name Search */}
            <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
              {/* Type any custom rank # to jump */}
              <div className="flex items-center space-x-1 bg-[#181818] px-3 py-1.5 rounded-xl border border-gray-800">
                <span className="text-xs text-[#FFD700] font-bold">#</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Jump Rank (e.g. 58)"
                  value={rankJumpInput}
                  onChange={(e) => setRankJumpInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleJumpToRank(rankJumpInput);
                  }}
                  className="bg-transparent text-white text-xs w-28 focus:outline-none placeholder-gray-500 font-mono"
                />
                <button
                  onClick={() => handleJumpToRank(rankJumpInput)}
                  className="px-2 py-0.5 rounded bg-[#D4AF37] text-black text-[10px] font-bold"
                >
                  Edit
                </button>
              </div>

              {/* Search by text */}
              <div className="flex items-center space-x-2 bg-[#181818] px-3 py-1.5 rounded-xl border border-gray-800 w-56">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item title..."
                  className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-gray-500"
                />
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-[#181818] p-1 rounded-xl border border-gray-800">
                <button
                  onClick={() => setViewMode('visual')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'visual' ? 'bg-[#2E1065] text-purple-200' : 'text-gray-400 hover:text-white'}`}
                  title="Visual Public Look Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#2E1065] text-purple-200' : 'text-gray-400 hover:text-white'}`}
                  title="Compact Table List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================= STEP 3: VISUAL PUBLIC LOOK 100-ITEM GRID WITH INSTANT EDIT ================= */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading verified items...</div>
      ) : filteredItems.length > 0 ? (
        viewMode === 'visual' ? (
          /* Visual Public-Style Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const officialWebsite = item.custom_values?.website || item.website || 'https://www.google.com';
              return (
                <div
                  key={item.id}
                  ref={el => itemRefs.current[item.rank] = el}
                  className={`glass-panel rounded-3xl border overflow-hidden flex flex-col justify-between transition-all group bg-[#101014] shadow-luxury-soft ${
                    item.rank === 58 ? 'border-[#FFD700] ring-2 ring-[#FFD700]/50' : 'border-gray-800 hover:border-[#D4AF37]/80'
                  }`}
                >
                  {/* Visual Header / Cover Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-900">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />

                    {/* Official Rank Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/85 border border-[#D4AF37] text-[#FFD700] text-xs font-black uppercase tracking-wider flex items-center space-x-1 shadow-md">
                      <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
                      <span>RANK #{item.rank}</span>
                    </div>

                    {/* Quick In-Place Live Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="absolute top-3 right-3 px-3.5 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-gold-strong transition-all hover:scale-105"
                      title="Click to edit rank, title, photo, description & specifications"
                    >
                      <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Edit #{item.rank}</span>
                    </button>

                    {/* Country & Status */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-lg bg-black/80 text-[#DDD6FE] font-bold border border-white/15 text-[11px]">
                        {item.country || 'Global'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/40 text-[11px] flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Verified 100</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif-luxury text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-[#FFD700] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                        {item.description || 'Verified standing in the elite benchmark registry.'}
                      </p>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-800 text-[11px]">
                      {Object.entries(item.custom_values || {})
                        .filter(([k]) => k !== 'website')
                        .slice(0, 4)
                        .map(([key, val]) => (
                          <div key={key} className="p-2 rounded-xl bg-[#181818] border border-gray-800">
                            <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-bold truncate">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span className="font-bold text-gray-200 truncate block mt-0.5">
                              {formatFieldValue(val, key)}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
                      <a
                        href={officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 px-3 rounded-xl bg-[#181818] hover:bg-[#222] text-gray-400 hover:text-emerald-400 text-xs font-bold flex items-center space-x-1 border border-gray-800"
                        title="Official Website Link"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Portal</span>
                      </a>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-4 py-2 rounded-xl bg-[#2E1065] hover:bg-[#4C1D95] text-purple-200 hover:text-white font-bold text-xs flex items-center space-x-1 border border-purple-500/40"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modify Details</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.title)}
                          className="p-2 rounded-xl bg-[#181818] hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-gray-800"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Compact Table View */
          <div className="glass-panel rounded-3xl border border-[#D4AF37]/30 overflow-hidden bg-[#101014] shadow-luxury-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#18181C] text-[11px] uppercase tracking-wider text-[#FFD700] border-b border-gray-800">
                  <tr>
                    <th className="p-4 w-20">Rank</th>
                    <th className="p-4">Profile & Entity</th>
                    <th className="p-4">Origin</th>
                    <th className="p-4">Specifications</th>
                    <th className="p-4">Views</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#18181C] transition-colors">
                      <td className="p-4 font-serif-luxury font-black text-sm text-white">
                        <span className="px-2.5 py-1 rounded-lg bg-[#2E1065] text-[#DDD6FE] border border-purple-500/30">
                          #{item.rank}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-white flex items-center space-x-3">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-11 h-11 rounded-xl object-cover border border-gray-700 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-white block truncate">{item.title}</span>
                          <span className="text-[10px] text-gray-400 truncate block">{item.description}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">{item.country || 'Global'}</td>
                      <td className="p-4 text-gray-300 font-mono text-[10px]">
                        {Object.entries(item.custom_values || {})
                          .filter(([k]) => k !== 'website')
                          .slice(0, 2)
                          .map(([k, v]) => (
                            <span key={k} className="mr-2 px-2 py-0.5 rounded bg-[#181818] border border-gray-700/80 inline-block my-0.5">
                              {k.replace(/_/g, ' ')}: <strong className="text-white">{String(v)}</strong>
                            </span>
                          ))}
                      </td>
                      <td className="p-4 text-gray-400">{item.views_count}</td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-extrabold text-xs inline-flex items-center space-x-1 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.title)}
                          className="p-1.5 rounded-lg bg-[#181818] hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-gray-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="p-16 text-center text-gray-400 glass-panel rounded-3xl border border-gray-800 bg-[#101014]">
          <Trophy className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-50" />
          <h3 className="font-serif-luxury text-xl font-bold text-white mb-2">No Items in this Sector</h3>
          <p className="text-xs text-gray-400 mb-6">You can auto-generate 100 benchmark items or upload them via CSV.</p>
          <button
            onClick={() => handleAutoGenerate100(selectedCategory?.id)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs uppercase tracking-wider"
          >
            ⚡ Auto-Generate 100 Ranked Items
          </button>
        </div>
      )}

      {/* ================= IN-PLACE LIVE ITEM EDITOR MODAL ================= */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl glass-panel p-8 rounded-3xl border-2 border-[#D4AF37] shadow-gold-strong my-8 bg-[#0E0E12]">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-black">LIVE IN-PLACE ITEM EDITOR</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  {editingItem ? `Edit Rank #${editingItem.rank} - ${editingItem.title}` : 'Add New Ranked Profile'}
                </h3>
              </div>
              <button onClick={() => setShowItemModal(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Target Sector / Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      const cat = categories.find(c => c.id === Number(e.target.value));
                      if (cat) setSelectedCategory(cat);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Official Rank # (1-100) *</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Item Title / Model *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bugatti Tourbillon, iPhone 15 Pro Max, Emirates"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States, France, Germany"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Official Website Link</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.officialwebsite.com"
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Image URL or Local Upload</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-700 text-xs text-[#FFD700] font-semibold cursor-pointer hover:bg-[#222]">
                    <span>Upload</span>
                    <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Description & Dossier</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Dynamic Category Custom Fields */}
              {selectedCategoryFields.length > 0 && (
                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <h4 className="font-serif-luxury text-sm font-bold text-[#FFD700]">Category Specific Fields</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCategoryFields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1">
                          {field.field_name}
                        </label>
                        <input
                          type="text"
                          value={customValues[field.field_key] || ''}
                          onChange={(e) => handleCustomValueChange(field.field_key, e.target.value)}
                          placeholder={`Enter ${field.field_name}`}
                          className="w-full px-3 py-2 rounded-lg bg-[#141418] border border-gray-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider shadow-gold-strong flex items-center space-x-2 hover:scale-105 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{actionLoading ? 'Saving...' : 'Save & Update Item'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= BULK 100 ITEMS UPLOAD MODAL ================= */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl glass-panel p-8 rounded-3xl border border-[#D4AF37]/50 shadow-gold-strong my-8 bg-[#0E0E12]">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-black">BULK MATRIX UPLOADER</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">Bulk Upload 100 Items</h3>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBulkUploadSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Target Category *</label>
                  <select
                    value={bulkCategoryId}
                    onChange={(e) => setBulkCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleAutoGenerate100(bulkCategoryId)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-emerald-200 hover:text-white text-xs font-bold flex items-center justify-center space-x-2 border border-emerald-500/50 transition-all shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>⚡ Auto-Generate 100 Ranked Items</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Paste CSV or JSON Array of 100 Items
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const catName = categories.find(c => c.id === Number(bulkCategoryId))?.name || 'Item';
                      const sample = `rank,title,country,description,image_url,website\n1,${catName} Supreme,United States,Rank #1 Verified benchmark standard.,https://images.unsplash.com/photo-1544829099-b9a0c07fad1a,https://www.google.com\n2,${catName} Second Edition,Germany,Rank #2 Luxury profile with high-speed performance.,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9,https://www.apple.com`;
                      setBulkDataText(sample);
                    }}
                    className="text-[11px] text-[#FFD700] hover:underline font-bold"
                  >
                    Insert CSV Sample Template
                  </button>
                </div>

                <textarea
                  rows={9}
                  required
                  value={bulkDataText}
                  onChange={(e) => setBulkDataText(e.target.value)}
                  placeholder="Paste CSV format:&#10;rank,title,country,description,image_url,website&#10;1,Model Name,Country,Description text,https://...,https://...&#10;&#10;Or paste JSON Array format:&#10;[{&quot;rank&quot;:1, &quot;title&quot;:&quot;...&quot;, &quot;country&quot;:&quot;...&quot;}]"
                  className="w-full p-4 rounded-2xl bg-[#141418] border border-gray-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#141418] border border-gray-800">
                <input
                  type="checkbox"
                  id="bulkReplaceCheck"
                  checked={bulkReplaceExisting}
                  onChange={(e) => setBulkReplaceExisting(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <label htmlFor="bulkReplaceCheck" className="text-xs text-gray-300 cursor-pointer">
                  Replace all existing items in this category with uploaded items (Recommended for full 100-rank batch setup)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs uppercase tracking-wider shadow-gold-strong hover:scale-105 transition-all flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{actionLoading ? 'Uploading...' : 'Process & Upload Items'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ItemManager;


