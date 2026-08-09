import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { itemService, favoriteService } from '../services/api';
import { formatFieldValue } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { Award, Eye, Heart, MapPin, Share2, ShieldCheck, ArrowLeft, ExternalLink, Globe, Split, Check, Sparkles } from 'lucide-react';
import ItemCard from '../components/ItemCard';

const ItemDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { isInCompare, toggleCompare, openSubpropertyModal } = useCompare();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await itemService.getBySlug(slug);
        if (res.success) {
          setItem(res.data);
          const relRes = await itemService.getAll({ category_id: res.data.category_id, limit: 3 });
          if (relRes.success) {
            setRelatedItems(relRes.data.filter(i => i.id !== res.data.id));
          }
        }
      } catch (err) {
        console.error('Failed to load item:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [slug]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert('Please log in to save to your VIP Favorites list.');
      return;
    }
    setFavLoading(true);
    try {
      const res = await favoriteService.toggleFavorite(item.id);
      if (res.success) {
        setIsFavorite(res.isFavorite);
      }
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 bg-[#FAFAFC]">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-gray-200 rounded-3xl" />
          <div className="h-12 bg-gray-200 w-1/3 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center bg-[#FAFAFC]">
        <h2 className="font-serif-luxury text-3xl text-[#0A0A12] mb-4">Profile Dossier Not Found</h2>
        <Link to="/" className="px-6 py-2.5 bg-gradient-to-r from-[#FFF4A3] via-[#FFD700] to-[#D4AF37] text-black font-bold rounded-full border border-[#B58A14]">
          Return to Registry
        </Link>
      </div>
    );
  }

  const compared = isInCompare(item.id);
  const officialWebsite = item.custom_values?.website || item.website || 'https://www.google.com';

  return (
    <div className="min-h-screen pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 bg-[#FAFAFC]">
      
      {/* Back Link */}
      <Link
        to={`/category/${item.category_slug || ''}`}
        className="inline-flex items-center space-x-2 text-xs font-bold text-[#8C6207] hover:underline uppercase tracking-wider mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to {item.category_name || 'Category'} Standings</span>
      </Link>

      {/* Main Showcase Hero */}
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37]/45 p-6 sm:p-10 shadow-luxury-card mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* High-Res Photo Container */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-gray-100 border border-[#D4AF37]/50 shadow-md relative group">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFF4A3] via-[#FFD700] to-[#D4AF37] text-black font-black text-xs uppercase shadow-md border border-[#B58A14]">
              RANK #{item.rank}
            </div>
          </div>

          {/* Details & Telemetry Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#FFF8C4] border border-[#D4AF37] text-[#8C6207] text-xs font-black uppercase tracking-wider">
                {item.category_name || 'OFFICIAL INDEX'}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#B58A14]" />
                <span>{item.country || 'Global'}</span>
              </span>
              <span className="text-xs text-gray-500 flex items-center space-x-1 pl-1">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span>{item.views_count?.toLocaleString()} Views</span>
              </span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-black text-[#0A0A12] leading-tight">
              {item.title}
            </h1>

            <p className="text-gray-600 text-base leading-relaxed font-normal">
              {item.description}
            </p>

            {/* Official Website Featured Box */}
            <div className="p-5 rounded-2xl bg-[#FFFDF0] border border-[#D4AF37] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-widest text-[#8C6207] font-black flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AUTHENTICATED PORTAL</span>
                </span>
                <span className="text-xs font-mono text-gray-800 truncate block max-w-xs font-bold">
                  {officialWebsite}
                </span>
              </div>

              <a
                href={officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFF4A3] via-[#FFD700] to-[#D4AF37] text-black font-black text-xs uppercase tracking-wider shadow-gold-strong hover:scale-105 transition-all flex items-center space-x-2 shrink-0 border border-[#B58A14]"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => toggleCompare(item)}
                className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm ${
                  compared
                    ? 'bg-[#0284C7] text-white ring-2 ring-[#0284C7]'
                    : 'bg-white border border-[#0284C7]/50 text-[#0284C7] hover:bg-[#F0F9FF]'
                }`}
              >
                {compared ? <Check className="w-4 h-4 stroke-[3]" /> : <Split className="w-4 h-4" />}
                <span>{compared ? 'In Comparison Tray' : 'Add to Compare'}</span>
              </button>

              <button
                onClick={handleFavoriteToggle}
                disabled={favLoading}
                className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-white border border-gray-300 text-gray-700 hover:text-black'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
                <span>{isFavorite ? 'Saved in VIP' : 'Save Favorite'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-xl bg-white border border-gray-300 text-gray-700 hover:text-black transition-colors shadow-sm"
                title="Share link"
              >
                {shareCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Verified Specification Matrix Inspector */}
      <div className="bg-white rounded-3xl border border-[#D4AF37]/35 p-8 sm:p-10 shadow-luxury-card mb-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C6207] font-black mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>OFFICIAL TELEMETRY MATRIX</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-black text-[#0A0A12]">
              Verified Custom Value Badges
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-mono hidden sm:inline">
            Click any specification badge to inspect verified portal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {item.custom_values && Object.keys(item.custom_values).length > 0 ? (
            Object.entries(item.custom_values)
              .filter(([k]) => k !== 'website')
              .map(([key, val]) => {
                const label = key.replace(/_/g, ' ');
                const formatted = formatFieldValue(val, key);
                return (
                  <div
                    key={key}
                    onClick={() => openSubpropertyModal(item, label, formatted)}
                    className="p-5 rounded-2xl bg-[#F8F9FD] border border-gray-200 hover:border-[#D4AF37] hover:bg-[#FFFDF0] cursor-pointer transition-all group shadow-sm"
                    title="Click to view verified portal"
                  >
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1 group-hover:text-[#8C6207]">
                      {label}
                    </span>
                    <span className="font-mono text-lg font-black text-[#0A0A12] block">
                      {formatted}
                    </span>
                  </div>
                );
              })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500 text-sm">
              Standard telemetry audited.
            </div>
          )}
        </div>
      </div>

      {/* Related Profiles in Same Category */}
      {relatedItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif-luxury text-2xl font-black text-[#0A0A12]">
              Related {item.category_name} Standings
            </h3>
            <Link
              to={`/category/${item.category_slug}`}
              className="text-xs text-[#8C6207] font-bold hover:underline"
            >
              View Full 100 Ranks →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedItems.map(rel => (
              <ItemCard key={rel.id} item={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ItemDetailPage;
