import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService, itemService } from '../../services/api';
import { Layers, Plus, Trash2, Edit3, Sparkles, Check, X, Upload, Download, Globe, ShieldCheck, RefreshCw, FileText } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State for Create / Edit
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [bannerUrl, setBannerUrl] = useState('');
  const [autoGenerate100, setAutoGenerate100] = useState(true);
  
  // Dynamic Custom Fields Builder State
  const [customFields, setCustomFields] = useState([
    { field_name: 'Top Speed', field_key: 'top_speed', field_type: 'text', is_required: false },
    { field_name: 'Engine Power', field_key: 'horsepower', field_type: 'text', is_required: false },
    { field_name: 'Valuation', field_key: 'valuation', field_type: 'currency', is_required: false }
  ]);

  // Bulk Upload State
  const [bulkDataText, setBulkDataText] = useState('');
  const [bulkReplaceExisting, setBulkReplaceExisting] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddField = () => {
    setCustomFields([
      ...customFields,
      { field_name: '', field_key: '', field_type: 'text', is_required: false }
    ]);
  };

  const handleRemoveField = (idx) => {
    setCustomFields(customFields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx, field, value) => {
    const updated = [...customFields];
    updated[idx][field] = value;
    if (field === 'field_name') {
      updated[idx].field_key = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)+/g, '');
    }
    setCustomFields(updated);
  };

  const handleOpenCreate = () => {
    setName('');
    setSlug('');
    setDescription('');
    setIcon('Layers');
    setBannerUrl('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80');
    setAutoGenerate100(true);
    setCustomFields([
      { field_name: 'Top Metric', field_key: 'top_metric', field_type: 'text', is_required: false },
      { field_name: 'Official Website', field_key: 'website', field_type: 'url', is_required: false }
    ]);
    setShowCreateModal(true);
  };

  const handleOpenEdit = async (cat) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Layers');
    setBannerUrl(cat.banner_url || '');
    
    try {
      const res = await categoryService.getBySlug(cat.slug);
      if (res.success && res.data.custom_fields) {
        setCustomFields(res.data.custom_fields);
      } else {
        setCustomFields([]);
      }
    } catch (e) {
      setCustomFields([]);
    }
    setShowEditModal(true);
  };

  const handleOpenUpload = (cat) => {
    setSelectedCategory(cat);
    setBulkDataText('');
    setShowUploadModal(true);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) return alert('Category Name is required.');

    const validFields = customFields.filter(f => f.field_name.trim() !== '');
    setActionLoading(true);

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description,
        icon,
        banner_url: bannerUrl,
        custom_fields: validFields
      };

      const res = await categoryService.create(payload);
      if (res.success) {
        const createdCat = res.data;
        // If auto-generate 100 was selected, generate 100 items immediately
        if (autoGenerate100 && createdCat.id) {
          await categoryService.generate100(createdCat.id);
          alert(`✅ Category "${name}" created and 100 verified ranked items were automatically generated!`);
        } else {
          alert(`✅ Category "${name}" created successfully!`);
        }
        setShowCreateModal(false);
        fetchCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setActionLoading(true);

    try {
      const validFields = customFields.filter(f => f.field_name.trim() !== '');
      const payload = {
        name,
        slug,
        description,
        icon,
        banner_url: bannerUrl,
        custom_fields: validFields
      };

      const res = await categoryService.update(selectedCategory.id, payload);
      if (res.success) {
        alert('✅ Category and schema updated successfully!');
        setShowEditModal(false);
        fetchCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerate100Items = async (cat) => {
    if (!window.confirm(`Generate 100 ranked benchmark items for "${cat.name}"? This will populate the category with full telemetry.`)) return;
    setActionLoading(true);
    try {
      const res = await categoryService.generate100(cat.id);
      if (res.success) {
        alert(`🎉 100 items successfully generated for ${cat.name}!`);
        fetchCategories();
      }
    } catch (err) {
      alert('Failed to generate 100 items.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !bulkDataText.trim()) return alert('Please enter or paste item rows.');
    setActionLoading(true);

    try {
      const res = await itemService.bulkCreate({
        category_id: selectedCategory.id,
        items: bulkDataText,
        replace_existing: bulkReplaceExisting
      });

      if (res.success) {
        alert(`✅ ${res.count} items uploaded successfully to ${selectedCategory.name}!`);
        setShowUploadModal(false);
        fetchCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload items.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCategory = async (cat) => {
    try {
      const res = await categoryService.exportCategory(cat.id);
      if (res.success) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${cat.slug}_100_items.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      alert('Failed to export category data.');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}" and all its ranked items? This action cannot be undone.`)) {
      try {
        await categoryService.delete(id);
        fetchCategories();
      } catch (err) {
        alert('Failed to delete category.');
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#D4AF37] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span>EXECUTIVE REGISTRY ENGINE</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-white">
            Category & <span className="gold-gradient-text">100-Item Batch Manager</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Create new sectors, upload 100 items in batch, auto-populate benchmark rankings, and customize dynamic schemas.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-gold-strong flex items-center space-x-2 shrink-0 border border-[#B58A14] transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Category & 100 Items</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading verified categories from database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/35 flex flex-col justify-between hover:border-[#FFD700] transition-all group shadow-luxury-soft bg-[#101014]"
            >
              <div>
                {/* Banner & Badge */}
                <div className="relative h-32 rounded-2xl overflow-hidden mb-4 border border-gray-800">
                  <img
                    src={cat.banner_url || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#FFD700] text-[10px] font-black uppercase tracking-wider border border-[#D4AF37]/40">
                    ID #{cat.id} • {cat.item_count || 0} ITEMS
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="font-mono text-xs text-[#D4AF37] font-bold">
                    /{cat.slug}
                  </span>
                </div>
                <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {cat.description || 'Verified 100-rank category pool.'}
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="space-y-2 pt-4 border-t border-gray-800/80">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleGenerate100Items(cat)}
                    disabled={actionLoading}
                    className="py-2 px-2.5 rounded-xl bg-[#064E3B] hover:bg-[#059669] text-emerald-200 hover:text-white text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors border border-emerald-500/40 shadow-sm"
                    title="Auto-generate 100 benchmark ranked items for this category"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto 100 Items</span>
                  </button>

                  <button
                    onClick={() => handleOpenUpload(cat)}
                    className="py-2 px-2.5 rounded-xl bg-[#2E1065] hover:bg-[#4C1D95] text-purple-200 hover:text-white text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors border border-purple-500/40 shadow-sm"
                    title="Bulk upload CSV or JSON items"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Items</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="flex-1 py-1.5 rounded-lg bg-[#181818] hover:bg-[#222] text-gray-300 hover:text-white text-center font-medium border border-gray-800 flex items-center justify-center space-x-1"
                  >
                    <Edit3 className="w-3 h-3 text-[#D4AF37]" />
                    <span>Edit Schema</span>
                  </button>

                  <button
                    onClick={() => handleExportCategory(cat)}
                    className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-gray-400 hover:text-[#FFD700] border border-gray-800"
                    title="Export JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to={`/category/${cat.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-[#181818] hover:bg-[#222] text-gray-400 hover:text-emerald-400 border border-gray-800"
                    title="View Live in Public Platform"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-2 rounded-lg bg-[#181818] hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-gray-800"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ================= CREATE CATEGORY & 100 ITEMS MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-[#D4AF37]/50 shadow-gold-strong my-8 bg-[#0E0E12]">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-black">ADMIN REGISTRY WIZARD</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">Create New Category & 100 Items</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }}
                    placeholder="e.g. Luxury Yachts, Private Jets, Watchmakers"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Slug / URL Path
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="luxury-yachts"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Official benchmark description of what is ranked in this sector..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Dynamic Field Schema Builder */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-serif-luxury text-base font-bold text-white">Dynamic Specification Schema</h4>
                    <p className="text-xs text-gray-400">Custom fields specific to this category (e.g. Horsepower, Max Range, Net Worth, Camera Optics)</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#FFD700] text-xs font-semibold hover:bg-[#D4AF37]/20 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Field</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {customFields.map((field, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#141418] border border-gray-800 flex items-center space-x-3 text-xs">
                      <input
                        type="text"
                        placeholder="Field Label (e.g. Horsepower)"
                        value={field.field_name}
                        onChange={(e) => handleFieldChange(idx, 'field_name', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#1D1D22] border border-gray-700 text-white focus:outline-none"
                      />
                      <select
                        value={field.field_type}
                        onChange={(e) => handleFieldChange(idx, 'field_type', e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-[#1D1D22] border border-gray-700 text-white focus:outline-none"
                      >
                        <option value="text">Text</option>
                        <option value="currency">Currency ($)</option>
                        <option value="number">Number</option>
                        <option value="url">Official Link</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click 100 Items Pre-population Option */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#064E3B]/40 to-[#2E1065]/40 border border-emerald-500/40 flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="auto100Check"
                  checked={autoGenerate100}
                  onChange={(e) => setAutoGenerate100(e.target.checked)}
                  className="w-5 h-5 accent-[#059669] rounded cursor-pointer"
                />
                <label htmlFor="auto100Check" className="text-xs text-gray-200 cursor-pointer">
                  <strong className="text-emerald-300 block">✨ Auto-Generate 100 Ranked Benchmark Items</strong>
                  <span>Instantly create and seed 100 verified entities with custom fields, telemetry, and links so the category is immediately 100% full.</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider shadow-gold-strong hover:scale-105 transition-all"
                >
                  {actionLoading ? 'Creating Category...' : 'Create Category & Ranks'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= EDIT CATEGORY MODAL ================= */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-[#D4AF37]/50 shadow-gold-strong my-8 bg-[#0E0E12]">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-black">EDIT CATEGORY SCHEMA</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">Edit {selectedCategory.name}</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Banner URL</label>
                <input
                  type="text"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#181818] border border-gray-800 text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Dynamic Field Schema */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif-luxury text-base font-bold text-white">Custom Specification Schema</h4>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#FFD700] text-xs font-semibold hover:bg-[#D4AF37]/20 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Field</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {customFields.map((field, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#141418] border border-gray-800 flex items-center space-x-3 text-xs">
                      <input
                        type="text"
                        placeholder="Field Name"
                        value={field.field_name}
                        onChange={(e) => handleFieldChange(idx, 'field_name', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#1D1D22] border border-gray-700 text-white focus:outline-none"
                      />
                      <select
                        value={field.field_type}
                        onChange={(e) => handleFieldChange(idx, 'field_type', e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-[#1D1D22] border border-gray-700 text-white focus:outline-none"
                      >
                        <option value="text">Text</option>
                        <option value="currency">Currency ($)</option>
                        <option value="number">Number</option>
                        <option value="url">Official Link</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs uppercase tracking-wider shadow-gold-strong"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= BULK 100 ITEMS UPLOAD MODAL ================= */}
      {showUploadModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl glass-panel p-8 rounded-3xl border border-[#D4AF37]/50 shadow-gold-strong my-8 bg-[#0E0E12]">
            
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FFD700] font-black">BULK UPLOAD MATRIX</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">Upload Items to {selectedCategory.name}</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBulkUploadSubmit} className="space-y-5">
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Paste CSV or JSON Array of Items
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleCsv = `rank,title,country,description,image_url,website\n1,${selectedCategory.name} Prime Flagship,United States,Verified leader in the global benchmark.,https://images.unsplash.com/photo-1544829099-b9a0c07fad1a,https://www.apple.com\n2,${selectedCategory.name} Second Elite,Germany,Certified #2 rank with high-speed performance.,https://images.unsplash.com/photo-1511707171634-5f897ff02aa9,https://www.google.com`;
                      setBulkDataText(sampleCsv);
                    }}
                    className="text-[11px] text-[#FFD700] hover:underline font-bold"
                  >
                    Insert CSV Sample Format
                  </button>
                </div>

                <textarea
                  rows={9}
                  required
                  value={bulkDataText}
                  onChange={(e) => setBulkDataText(e.target.value)}
                  placeholder="Paste CSV format:&#10;rank,title,country,description,image_url,website&#10;1,Item Name,United States,Description text,https://...,https://...&#10;&#10;Or paste JSON Array format:&#10;[{&quot;rank&quot;:1, &quot;title&quot;:&quot;...&quot;, &quot;country&quot;:&quot;...&quot;}]"
                  className="w-full p-4 rounded-2xl bg-[#141418] border border-gray-800 text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-[#141418] border border-gray-800">
                <input
                  type="checkbox"
                  id="replaceCheck"
                  checked={bulkReplaceExisting}
                  onChange={(e) => setBulkReplaceExisting(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <label htmlFor="replaceCheck" className="text-xs text-gray-300 cursor-pointer">
                  Replace all existing items in this category with uploaded items (Recommended for full 100-rank reset)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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

export default CategoryManager;

