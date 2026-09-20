import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Navbar } from './Navbar';
import { 
  Gamepad2, 
  TrendingUp, 
  PieChart, 
  BookOpen, 
  Brain, 
  Bot, 
  User, 
  Settings, 
  Sparkles,
  Award
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = useGameStore();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm font-mono text-emerald-400">Loading MarketVerse Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const sidebarLinks = [
    { path: '/app/world', label: '3D World', icon: Gamepad2 },
    { path: '/app/missions', label: 'Missions', icon: Award },
    { path: '/app/market', label: 'Market Desk', icon: TrendingUp },
    { path: '/app/portfolio', label: 'Portfolio', icon: PieChart },
    { path: '/app/learning', label: 'Learning', icon: BookOpen },
    { path: '/app/skills', label: 'Skills Tree', icon: Sparkles },
    { path: '/app/mentor', label: 'AI Mentor', icon: Bot },
    { path: '/app/psychology', label: 'Psychology', icon: Brain },
    { path: '/app/profile', label: 'Profile', icon: User },
    { path: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex w-56 flex-col bg-slate-950 border-r border-slate-900 p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Command Center
          </div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path === '/app/world' && location.pathname === '/app');
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
