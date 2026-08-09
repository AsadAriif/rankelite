export const formatCurrency = (val) => {
  if (val === null || val === undefined || val === '') return '—';
  if (typeof val === 'number') {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)} Billion`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)} Million`;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }
  return String(val);
};

export const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return '—';
  if (typeof val === 'number') {
    return new Intl.NumberFormat('en-US').format(val);
  }
  return String(val);
};

export const formatFieldValue = (val, keyOrType = '') => {
  if (val === null || val === undefined || val === '') return '—';
  
  if (typeof val === 'string') {
    return val;
  }
  
  if (typeof val === 'number') {
    const key = String(keyOrType).toLowerCase();
    if (key.includes('worth') || key.includes('price') || key.includes('cap') || key.includes('val') || key === 'currency') {
      return formatCurrency(val);
    }
    return formatNumber(val);
  }
  
  return String(val);
};
