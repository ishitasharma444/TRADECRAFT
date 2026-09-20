import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { User, Award, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, level, xp, cash, achievements, tradeHistory, holdings } = useGameStore();

  const xpForNextLevel = level * 500;
  const xpProgress = Math.min(100, Math.floor((xp / xpForNextLevel) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <Card variant="glow" className="flex flex-col sm:flex-row items-center gap-6 p-6">
        <div className="relative">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-xl"
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 font-extrabold text-xs px-2 py-0.5 rounded-md shadow-lg">
            LVL {level}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-wide">{user?.username || 'MarketExplorer'}</h1>
            <Badge variant="emerald">{user?.rank || 'FINANCIAL ROOKIE'}</Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">{user?.email || 'demo@tradecraft.edu'}</p>

          {/* XP Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Level Progression ({xp} / {xpForNextLevel} XP)</span>
              <span className="text-emerald-400 font-bold">{xpProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="border" className="space-y-1 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Virtual Cash Balance</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">₹{cash.toLocaleString()}</div>
        </Card>
        <Card variant="border" className="space-y-1 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Holdings Count</span>
          <div className="text-xl font-bold text-white font-mono">{holdings.length} Assets</div>
        </Card>
        <Card variant="border" className="space-y-1 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Executed Trades</span>
          <div className="text-xl font-bold text-amber-400 font-mono">{tradeHistory.length} Trades</div>
        </Card>
      </div>

      {/* Achievements Unlocked Grid */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">Unlocked Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <div key={a.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-500/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{a.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
