import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for JWT auth header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eliterank_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth Services
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

// Categories Services
export const categoryService = {
  getAll: async () => {
    const res = await api.get('/categories');
    return res.data;
  },
  getBySlug: async (slug) => {
    const res = await api.get(`/categories/${slug}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/categories', data);
    return res.data;
  },
  createWithItems: async (data) => {
    const res = await api.post('/categories/with-items', data);
    return res.data;
  },
  generate100: async (id) => {
    const res = await api.post(`/categories/${id}/generate-100`);
    return res.data;
  },
  exportCategory: async (id) => {
    const res = await api.get(`/categories/${id}/export`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  }
};

// Items Services
export const itemService = {
  getAll: async (params = {}) => {
    const res = await api.get('/items', { params: { limit: 100, ...params } });
    return res.data;
  },
  getBySlug: async (slug) => {
    const res = await api.get(`/items/${slug}`);
    return res.data;
  },
  compare: async (ids = []) => {
    const idsParam = Array.isArray(ids) ? ids.join(',') : ids;
    const res = await api.get('/items/compare', { params: { ids: idsParam } });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/items', data);
    return res.data;
  },
  bulkCreate: async (data) => {
    const res = await api.post('/items/bulk', data);
    return res.data;
  },
  bulkRankUpdate: async (updates) => {
    const res = await api.post('/items/bulk-rank-update', { updates });
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/items/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/items/${id}`);
    return res.data;
  }
};

// Favorites Services
export const favoriteService = {
  getFavorites: async () => {
    const res = await api.get('/favorites');
    return res.data;
  },
  toggleFavorite: async (itemId) => {
    const res = await api.post('/favorites/toggle', { itemId });
    return res.data;
  }
};

// Settings & Analytics Services
export const adminService = {
  getUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  updateUserRole: async (id, role) => {
    const res = await api.put(`/users/${id}/role`, { role });
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
  getSettings: async () => {
    const res = await api.get('/settings');
    return res.data;
  },
  updateSettings: async (settings) => {
    const res = await api.post('/settings', settings);
    return res.data;
  },
  exportDb: async () => {
    const res = await api.get('/settings/export-db');
    return res.data;
  },
  importDb: async (data) => {
    const res = await api.post('/settings/import-db', data);
    return res.data;
  },
  getAnalytics: async () => {
    const res = await api.get('/analytics');
    return res.data;
  },
  uploadImage: async (formData) => {
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

export default api;

