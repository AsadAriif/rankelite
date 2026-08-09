import React, { useEffect, useState } from 'react';
import { favoriteService } from '../services/api';
import ItemCard from '../components/ItemCard';
import { GridSkeleton } from '../components/SkeletonLoader';
import { Heart, Sparkles } from 'lucide-react';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const res = await favoriteService.getFavorites();
        if (res.success) {
          setFavorites(res.data);
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, []);

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] p-0.5 flex items-center justify-center shadow-gold-strong">
          <div className="w-full h-full bg-[#080808] rounded-[14px] flex items-center justify-center">
            <Heart className="w-6 h-6 text-[#FFD700] fill-[#FFD700]" />
          </div>
        </div>
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
            VIP Saved <span className="gold-gradient-text">Favorites</span>
          </h1>
          <p className="text-gray-400 text-sm font-light">
            Your personal curated portfolio of saved power rankings and hypercars.
          </p>
        </div>
      </div>

      {loading ? (
        <GridSkeleton count={3} />
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((item) => (
            <ItemCard key={item.id} item={{ ...item, isFavorite: true }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass-panel rounded-3xl border border-gray-800">
          <Heart className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 opacity-50" />
          <h3 className="font-serif-luxury text-xl font-bold text-white mb-2">No Saved Rankings Yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Click the heart icon on any rank profile to bookmark it in your VIP portfolio.
          </p>
        </div>
      )}

    </div>
  );
};

export default FavoritesPage;
