import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Gamepad2, Award, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

export const AppIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, level, xp, cash, currentMission } = useGameStore();

  const xpForNext = level * 500;
  const progressPct = Math.min(100, Math.floor((xp / xpForNext) * 100));

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card variant="glow" className="w-full max-w-2xl space-y-8 p-8 relative z-10 border-emerald-500/40">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Badge variant="emerald" size="md">AUTHENTICATED MARKETVERSE SESSION</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider font-mono">
            TRADECRAFT MARKETVERSE
          </h1>
          <p className="text-xs text-slate-400">Your financial learning adventure awaits.</p>
        </div>

        {/* Player Stats Dashboard Card */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/40">
                {level}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{user?.username || 'Trader'}</h3>
                <span className="text-xs text-emerald-400 font-mono">{user?.rank || 'FINANCIAL ROOKIE'}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Virtual Capital</span>
              <div className="text-lg font-bold text-white font-mono">₹{cash.toLocaleString()}</div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Experience Level {level}</span>
              <span className="text-emerald-400 font-bold">{xp} / {xpForNext} XP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Active Mission Details */}
        {currentMission && (
          <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 font-bold uppercase font-mono">Active Story Objective</span>
              <Badge variant="amber">Step {currentMission.currentStep + 1} of {currentMission.totalSteps}</Badge>
            </div>
            <h4 className="text-sm font-bold text-white">{currentMission.title}</h4>
            <p className="text-xs text-slate-300">{currentMission.description}</p>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full font-extrabold text-base py-4 shadow-xl shadow-emerald-500/25 tracking-wide"
            onClick={() => navigate('/app/world')}
          >
            <Gamepad2 className="w-6 h-6 mr-2" /> ENTER MARKETVERSE <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
