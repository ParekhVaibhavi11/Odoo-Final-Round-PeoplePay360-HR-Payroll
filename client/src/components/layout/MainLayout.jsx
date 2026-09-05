import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-bgTint flex flex-col justify-between selection:bg-plum-200 selection:text-plum-900">
      <div>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-plum-100/60 bg-white/60 backdrop-blur-sm py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-plum-700">People Power Organizations</span>
            <span className="mx-2">•</span>
            <span>A simpler way to manage your workforce.</span>
          </div>
          <div>© 2026 PeoplePay360 Platform. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
