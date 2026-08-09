import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlobalSearchModal from '../components/GlobalSearchModal';
import PageTransition from '../components/PageTransition';

const MainLayout = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-[#0A0A12]">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      
      <main className="flex-1">
        <PageTransition>
          <Outlet context={{ onOpenSearch: () => setSearchOpen(true) }} />
        </PageTransition>
      </main>

      <Footer />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default MainLayout;

