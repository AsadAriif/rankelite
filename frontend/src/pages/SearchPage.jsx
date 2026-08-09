import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { itemService, categoryService } from '../services/api';
import ItemCard from '../components/ItemCard';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Search, Filter, ArrowUpDown, Layers, MapPin, X, Sparkles } from 'lucide-react';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('cat') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rank_asc');
  
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAll();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await itemService.getAll({
          search: query || undefined,
          category_id: categoryId || undefined,
          country: country || undefined,
          sort,
          limit: 100
        });
        if (res.success) setItems(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, categoryId, country, sort]);

  const handleClearFilters = () => {
    setQuery('');
    setCategoryId('');
    setCountry('');
    setSort('rank_asc');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 bg-[#FAFAFC]">
      
      {/* Header Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#8C6207] text-xs font-black uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-[#0284C7]" />
            <span>GLOBAL VERIFIED DIRECTORY</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-black text-[#0A0A12]">
            Global <span className="gold-gradient-text">Search & Filter</span> Matrix
          </h1>
          <p className="text-gray-600 text-sm font-normal mt-1">
            Search live across 800+ ranked items across 8 global sectors with official website links and telemetry.
          </p>
        </div>

        <span className="text-xs text-[#8C6207] font-bold px-4 py-2 rounded-xl bg-white border border-[#D4AF37]/50 shadow-sm shrink-0">
          {items.length} Active Verified Records Loaded
        </span>
      </div>

      {/* Multi-Filter Panel */}
      <div className="bg-white p-6 rounded-3xl border-2 border-[#D4AF37]/45 shadow-luxury-card space-y-4 mb-10">
        
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#B58A14] absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Real Madrid, Elon Musk, Bugatti Tourbillon, iPhone 15, Harvard, Microsoft, Burj Al Arab..."
            className="w-full pl-12 pr-10 py-3.5 bg-[#F8F9FD] border border-gray-200 rounded-2xl text-[#0A0A12] placeholder-gray-500 font-medium focus:outline-none focus:border-[#B58A14] text-sm"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-bold mb-1.5 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-[#B58A14]" />
              <span>Filter by Category</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F9FD] border border-gray-200 rounded-xl text-xs text-[#0A0A12] font-semibold focus:outline-none focus:border-[#B58A14]"
            >
              <option value="">All 8 Categories (800 Items)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (100 Ranks)
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-bold mb-1.5 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#B58A14]" />
              <span>Filter by Country</span>
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Spain, United States, France, Italy, UK..."
              className="w-full px-3.5 py-2.5 bg-[#F8F9FD] border border-gray-200 rounded-xl text-xs text-[#0A0A12] placeholder-gray-500 focus:outline-none focus:border-[#B58A14]"
            />
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-gray-600 font-bold mb-1.5 flex items-center space-x-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#B58A14]" />
              <span>Sort Order</span>
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F9FD] border border-gray-200 rounded-xl text-xs text-[#0A0A12] font-semibold focus:outline-none focus:border-[#B58A14]"
            >
              <option value="rank_asc">Official Rank #1 → #100</option>
              <option value="rank_desc">Rank #100 → #1</option>
              <option value="views_desc">Most Viewed Profiles</option>
              <option value="title_asc">Alphabetical A-Z</option>
              <option value="title_desc">Alphabetical Z-A</option>
            </select>
          </div>

        </div>

        {/* Clear Filter CTA */}
        {(query || categoryId || country || sort !== 'rank_asc') && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#8C6207] hover:underline flex items-center space-x-1 font-bold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All Active Search Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Results Grid */}
      {loading ? (
        <GridSkeleton count={9} />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <Search className="w-12 h-12 text-[#B58A14] mx-auto mb-4 opacity-50" />
          <h3 className="font-serif-luxury text-2xl font-bold text-[#0A0A12] mb-2">No Verified Standings Found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            We could not find any rankings matching "{query}". Try clearing filters or exploring another sector.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FFF4A3] via-[#FFD700] to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider shadow-sm border border-[#B58A14]"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default SearchPage;
