import React from 'react';
import { Routes, Route, useOutletContext } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import { CompareProvider } from './context/CompareContext';
import CompareFloatingBar from './components/CompareFloatingBar';
import SubpropertyDetailModal from './components/SubpropertyDetailModal';

import HomePage from './pages/HomePage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ItemDetailPage from './pages/ItemDetailPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparePage from './pages/ComparePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryManager from './pages/admin/CategoryManager';
import ItemManager from './pages/admin/ItemManager';
import UserManager from './pages/admin/UserManager';
import SettingsManager from './pages/admin/SettingsManager';

const HomeWrapper = () => {
  const { onOpenSearch } = useOutletContext();
  return <HomePage onOpenSearch={onOpenSearch} />;
};

function App() {
  return (
    <CompareProvider>
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeWrapper />} />
          <Route path="category/:slug" element={<CategoryDetailPage />} />
          <Route path="item/:slug" element={<ItemDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="compare" element={<ComparePage />} />
        </Route>

        {/* Auth Standalone Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Panel Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="items" element={<ItemManager />} />
          <Route path="items/new" element={<ItemManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>
      </Routes>

      {/* Global Persistent Comparison Tray & Subproperty Inspector */}
      <CompareFloatingBar />
      <SubpropertyDetailModal />
    </CompareProvider>
  );
}

export default App;
