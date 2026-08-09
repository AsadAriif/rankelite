import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
    <div className="w-full h-48 rounded-xl skeleton-box" />
    <div className="w-2/3 h-6 rounded skeleton-box" />
    <div className="w-full h-4 rounded skeleton-box" />
    <div className="w-1/2 h-4 rounded skeleton-box" />
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <CardSkeleton key={idx} />
    ))}
  </div>
);

export default CardSkeleton;
