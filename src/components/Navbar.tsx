import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { 
  Gamepad2, 
  TrendingUp, 
  PieChart, 
  BookOpen, 
  Brain, 
  Bot, 
  User, 
  Settings, 
  LogOut, 
  Sparkles,
  Award
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, cash, xp, level, logout } = useGameStore();

  const isAppRoute = location.pathname.startsWith('/app');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & SIMULATED Badge */}
        <div className="flex items-center gap-3">
          <Link to={isAuthenticated ? '/app/world' : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-wider font-mono">TRADECRAFT</span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase -mt-1">MarketVerse 3D</span>
            </div>
          </Link>
          <Badge variant="amber" className="hidden sm:inline-flex">
            SIMULATED TRADING
          </Badge>
        </div>

        {/* Navigation Links */}
        {!isAppRoute ? (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-emerald-400 transition-colors">About</Link>
            <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link>
            <Link to="/learn" className="hover:text-emerald-400 transition-colors">Curriculum</Link>
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <Link 
              to="/app/world" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname === '/app/world' || location.pathname === '/app'
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                  : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>3D World</span>
            </Link>

            <Link 
              to="/app/market" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname === '/app/market' 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                  : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Market</span>
            </Link>

            <Link 
              to="/app/portfolio" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname === '/app/portfolio' 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                  : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Portfolio</span>
            </Link>

            <Link 
              to="/app/mentor" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname === '/app/mentor' 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                  : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>AI Mentor</span>
            </Link>

            <Link 
              to="/app/psychology" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname === '/app/psychology' 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                  : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Psychology</span>
            </Link>

            <Link 
              to="/app/skills" 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                location.pathname === '/app/skills' 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                  : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Skills</span>
            </Link>
          </nav>
        )}

        {/* User Stats & Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Virtual Cash Display */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Virtual Capital</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  ₹{cash.toLocaleString()}
                </span>
              </div>

              {/* Level & XP Badge */}
              <Link to="/app/profile" className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 px-2.5 py-1 rounded-lg transition-all">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/40">
                  {level}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200">{user?.username || 'Trader'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{xp} XP</span>
                </div>
              </Link>

              {/* Quick Settings & Logout */}
              <Link to="/app/settings" className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all">
                <Settings className="w-4 h-4" />
              </Link>

              <button 
                onClick={handleLogout} 
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
