import React from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

const CategoryCard = ({ category }) => {
  const IconComponent = LucideIcons[category.icon] || LucideIcons.Layers;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative glass-card p-6 rounded-2xl border border-[#D4AF37]/20 flex flex-col justify-between overflow-hidden"
    >
      {/* Background Banner Blur */}
      {category.banner_url && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 pointer-events-none"
          style={{ backgroundImage: `url(${category.banner_url})` }}
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] p-[1px]">
            <div className="w-full h-full bg-[#121212] rounded-[11px] flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-[#1a1a1a] text-[#D4AF37] border border-[#D4AF37]/30">
            {category.item_count || 5} Ranked Items
          </span>
        </div>

        <h3 className="font-serif-luxury text-xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors relative z-10">
          {category.name}
        </h3>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4 relative z-10 font-light">
          {category.description || 'Explore real-time rankings and dynamic specifications.'}
        </p>
      </div>

      <div className="flex items-center text-xs font-semibold text-[#D4AF37] group-hover:translate-x-1 transition-transform relative z-10">
        <span>Browse Rankings</span>
        <LucideIcons.ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
};

export default CategoryCard;
