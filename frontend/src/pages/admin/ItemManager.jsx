import React, { useEffect, useState } from 'react';
import { itemService, categoryService, adminService } from '../../services/api';
import { Trophy, Plus, Trash2, Edit3, Upload, Download, RefreshCw, X, Check, Search, Filter, Globe, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

const ItemManager = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
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

  const fetchData = async () => {
    try {
      const [itemRes, catRes] = await Promise.all([
        itemService.getAll({ limit: 800 }),
        categoryService.getAll()
      ]);
      if (itemRes.success) setItems(itemRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !categoryId) {
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

  // When category changes in form, fetch custom fields
  useEffect(() => {
    if (!categoryId) return;
    const catObj = categories.find(c => c.id === Number(categoryId));
    if (catObj) {
      categoryService.getBySlug(catObj.slug).then(res => {
        if (res.success && res.data.custom_fields) {
          setSelectedCategoryFields(res.data.custom_fields);
        } else {
          setSelectedCategoryFields([]);
        }
      });
    }
  }, [categoryId, categories]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80');
    setRank(items.length + 1);
    setCountry('');
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
        alert('✅ Rank Item updated successfully!');
      } else {
        await itemService.create(payload);
        alert('✅ Rank Item created successfully!');
      }
      setShowItemModal(false);
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
        alert(`✅ ${res.count} items uploaded successfully!`);
        setShowBulkModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to bulk upload items.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAutoGenerate100 = async (catId) => {
    const targetId = catId || bulkCategoryId;
    const catObj = categories.find(c => c.id === Number(targetId));
    const catName = catObj ? catObj.name : 'selected category';

    if (!window.confirm(`Auto-populate 100 benchmark ranked items for "${catName}"? This will populate the category with full telemetry.`)) return;
    setActionLoading(true);

    try {
      const res = await categoryService.generate100(targetId);
      if (res.success) {
        alert(`🎉 100 items successfully generated for ${catName}!`);
        setShowBulkModal(false);
        fetchData();
      }
    } catch (err) {
      alert('Failed to generate items.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchCategory = selectedCategoryFilter === 'all' || item.category_id === Number(selectedCategoryFilter);
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery ||
      item.title.toLowerCase().includes(q) ||
      (item.country && item.country.toLowerCase().includes(q)) ||
      (item.category_name && item.category_name.toLowerCase().includes(q)) ||
      JSON.stringify(item.custom_values || {}).toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#D4AF37] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>GLOBAL RANKING TELEMETRY</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-white">
            100-Tier Item <span className="gold-gradient-text">Rankings Manager</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Add individual profiles, bulk upload 100 items via CSV/JSON, or 1-click auto-populate full benchmark registries.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => handleOpenBulkModal(selectedCategoryFilter !== 'all' ? selectedCategoryFilter : '')}
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

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#101014]">
        {/* Search */}
        <div className="flex items-center space-x-2.5 w-full md:w-80 bg-[#181818] px-3.5 py-2 rounded-xl border border-gray-800">
          <Search className="w-4 h-4 text-[#D4AF37]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, country, specs..."
            className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-gray-500 font-medium"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:inline">Sector:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Sectors ({items.length} Total Items)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({items.filter(i => i.category_id === c.id).length} items)
              </option>
            ))}
          </select>

          {selectedCategoryFilter !== 'all' && (
            <button
              onClick={() => handleAutoGenerate100(selectedCategoryFilter)}
              className="px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-emerald-200 hover:text-white text-xs font-bold flex items-center space-x-1.5 border border-emerald-500/40"
              title="Populate 100 benchmark items for this category"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Auto 100</span>
            </button>
          )}
        </div>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading verified items...</div>
      ) : (
        <div className="glass-panel rounded-3xl border border-[#D4AF37]/30 overflow-hidden bg-[#101014] shadow-luxury-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#18181C] text-[11px] uppercase tracking-wider text-[#FFD700] border-b border-gray-800">
                <tr>
                  <th className="p-4 w-20">Rank</th>
                  <th className="p-4">Profile & Entity</th>
                  <th className="p-4">Sector / Category</th>
                  <th className="p-4">Origin</th>
                  <th className="p-4">Key Specifications</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredItems.slice(0, 100).map((item) => {
                  const officialWebsite = item.custom_values?.website || item.website || 'https://www.google.com';
                  return (
                    <tr key={item.id} className="hover:bg-[#18181C] transition-colors group">
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
                          loading="lazy"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-white block truncate">{item.title}</span>
                          <span className="text-[10px] text-gray-400 truncate block">{item.description}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        <span className="px-2 py-0.5 rounded-full bg-[#181818] border border-gray-700 text-[10px] font-bold">
                          {item.category_name}
                        </span>
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
                        <a
                          href={officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-gray-400 hover:text-emerald-400 inline-block"
                          title="Official Website"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-gray-400 hover:text-[#FFD700]"
                          title="Edit Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.title)}
                          className="p-2 rounded-lg bg-[#181818] hover:bg-red-950/60 text-gray-400 hover:text-red-400"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No items match your active search or sector filter.
            </div>
          )}
        </div>
      )}

      {/* ================= EDIT / CREATE SINGLE ITEM MODAL ================= */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-[#D4AF37]/50 shadow-gold-strong my-8 bg-[#0E0E12]">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-black">ENTITY PROFILE EDITOR</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  {editingItem ? `Edit Rank #${editingItem.rank} - ${editingItem.title}` : 'Add New Ranked Entity'}
                </h3>
              </div>
              <button onClick={() => setShowItemModal(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Sector / Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
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
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Item Title / Entity Name *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bugatti Tourbillon, iPhone 15 Pro Max, Elon Musk"
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
                  <h4 className="font-serif-luxury text-sm font-bold text-[#FFD700]">Category Specification Fields</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCategoryFields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-[11px] uppercase tracking-wider text-gray-400 mb-1">
                          {field.field_name}
                        </label>
                        <input
                          type={field.field_type === 'number' || field.field_type === 'currency' ? 'text' : 'text'}
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
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs uppercase tracking-wider shadow-gold-strong"
                >
                  {actionLoading ? 'Saving...' : 'Save Rank Item'}
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

