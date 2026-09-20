import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">TRADECRAFT</span>
            <span>&copy; {new Date().getFullYear()} MarketVerse Educational Platform.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
