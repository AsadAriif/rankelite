import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryService, itemService } from '../services/api';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../context/AuthContext';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Crown, Filter, ArrowUpDown, MapPin, Layers, Sparkles, Search, Grid, List, Edit3, ShieldAlert } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useCompare } from '../context/CompareContext';

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const { isAdmin } = useAuth();
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('rank_asc');
  const [filterQuery, setFilterQuery] = useState('');
  const [country, setCountry] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const { openSubpropertyModal } = useCompare();

  useEffect(() => {
    const fetchCategoryAndItems = async () => {
      setLoading(true);
      try {
        const catRes = await categoryService.getBySlug(slug);
        if (catRes.success) {
          setCategory(catRes.data);
          const itemRes = await itemService.getAll({
            category_id: catRes.data.id,
            sort,
            country: country || undefined,
            limit: 100
          });
          if (itemRes.success) {
            setItems(itemRes.data);
          }
        }
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndItems();
  }, [slug, sort, country]);

  const handleItemUpdated = (updatedItem) => {
    setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  if (loading && !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 bg-[#FAFAFC]">
        <GridSkeleton count={6} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center bg-[#FAFAFC]">
        <h2 className="font-serif-luxury text-3xl text-[#0A0A12] mb-4">Category Not Found</h2>
        <p className="text-gray-600 mb-6">The requested category standard does not exist or has been updated.</p>
        <Link to="/" className="px-6 py-2.5 bg-gradient-to-r from-[#FFF4A3] via-[#FFD700] to-[#D4AF37] text-black font-bold rounded-full border border-[#B58A14]">
          Return to Registry
        </Link>
      </div>
    );
  }

  const IconComponent = LucideIcons[category.icon] || LucideIcons.Layers;

  const filteredItems = items.filter(item => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.country && item.country.toLowerCase().includes(q)) ||
      String(item.rank) === q ||
      JSON.stringify(item.custom_values || {}).toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 bg-[#FAFAFC]">
      
      {/* Admin Mode Floating Alert */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-2xl bg-[#2E1065] border border-[#D4AF37] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-gold-strong">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-[#FFD700] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              <strong className="text-[#FFD700]">⚡ Live Admin Mode Active:</strong> You can click the <strong>"Edit"</strong> button on any item card below to modify its Rank, Title, Image, Description, or Specs on the fly!
            </span>
          </div>
          <Link
            to="/admin/items"
            className="px-4 py-1.5 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider shrink-0 hover:bg-[#FFD700]"
          >
            Open Admin Matrix →
          </Link>
        </div>
      )}

      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-12 border-2 border-[#7C3AED]/40 shadow-luxury-card bg-white">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={category.banner_url || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1600&q=80'}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 text-white">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#FFE57F] text-xs font-black uppercase tracking-widest">
                <IconComponent className="w-4 h-4 text-[#A78BFA]" />
                <span>100-TIER COMPLETE REGISTRY</span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-black tracking-wide text-white">
                100 {category.name}
              </h1>
              <p className="text-gray-200 text-sm max-w-2xl font-light leading-relaxed">
                {category.description}
              </p>
            </div>

            <div className="bg-black/80 px-6 py-3 rounded-2xl border border-[#D4AF37]/60 text-center shrink-0">
              <span className="font-serif-luxury text-3xl font-black gold-gradient-text">100</span>
              <span className="block text-[10px] uppercase tracking-widest text-gray-300 font-bold">Verified Ranks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#7C3AED]/25 shadow-luxury-soft flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        
        {/* Search within Category */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Search className="w-4 h-4 text-[#7C3AED]" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={`Filter ${category.name} by name, rank #, or specs...`}
            className="px-4 py-2.5 rounded-xl bg-[#F8F9FD] border border-gray-200 text-xs text-[#0A0A12] placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] w-72 font-medium"
          />
        </div>

        {/* Sort & Country Filter Controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Filter Country..."
            className="px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-gray-200 text-xs text-[#0A0A12] placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] w-36"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[#F8F9FD] border border-gray-200 text-xs text-[#0A0A12] font-semibold focus:outline-none focus:border-[#7C3AED]"
          >
            <option value="rank_asc">Official Rank #1 → #100</option>
            <option value="rank_desc">Rank #100 → #1</option>
            <option value="views_desc">Most Viewed Profiles</option>
            <option value="title_asc">Alphabetical A-Z</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F4F5F8] p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-400 hover:text-black'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-400 hover:text-black'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Items Section */}
      {loading ? (
        <GridSkeleton count={viewMode === 'grid' ? 9 : 6} />
      ) : filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onUpdate={handleItemUpdated} />
            ))}
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-purple-100 shadow-luxury-soft flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#7C3AED] transition-all"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <span className="w-12 h-12 rounded-xl bg-[#F5F3FF] border border-purple-200 text-[#4C1D95] font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    #{item.rank}
                  </span>
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div>
                    <Link to={`/item/${item.slug}`}>
                      <h3 className="font-serif-luxury text-lg font-bold text-[#0A0A12] hover:text-[#7C3AED] transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-xs truncate max-w-lg font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <a
                    href={item.custom_values?.website || item.website || 'https://www.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#ECFDF5] border border-emerald-300 text-[#064E3B] hover:bg-[#059669] hover:text-white font-bold text-xs shadow-sm"
                  >
                    Visit Portal ↗
                  </a>
                  <Link
                    to={`/item/${item.slug}`}
                    className="px-4 py-2 rounded-xl btn-purple-action text-white font-bold text-xs uppercase tracking-wider"
                  >
                    Inspect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <Filter className="w-12 h-12 text-[#7C3AED] mx-auto mb-4 opacity-50" />
          <h3 className="font-serif-luxury text-2xl font-bold text-[#0A0A12] mb-2">No Verified Standings Found</h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
            We could not find any items matching your active filter "{filterQuery}".
          </p>
          <button
            onClick={() => { setFilterQuery(''); setCountry(''); setSort('rank_asc'); }}
            className="px-6 py-2.5 rounded-full btn-purple-action text-white font-bold text-xs uppercase tracking-wider"
          >
            Clear Filters
          </button>
        </div>
      )}


    </div>
  );
};

export default CategoryDetailPage;
