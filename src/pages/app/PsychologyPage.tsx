import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Brain, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export const PsychologyPage: React.FC = () => {
  const { psychologyEvents, consecutiveLosses, tradeHistory } = useGameStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Trading Psychology Monitor</h1>
          <p className="text-xs text-slate-400">Automated behavioral analysis to identify emotional trading patterns.</p>
        </div>
        <Badge variant={consecutiveLosses > 1 ? 'rose' : 'emerald'}>
          Revenge Risk: {consecutiveLosses > 1 ? 'ELEVATED' : 'LOW'}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="border" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Consecutive Loss Sequence</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{consecutiveLosses} Trades</div>
          <p className="text-xs text-slate-400">Monitors tendency to revenge-trade after losses.</p>
        </Card>

        <Card variant="border" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Position Sizing Consistency</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">STABLE</div>
          <p className="text-xs text-slate-400">Position sizes remain within 1-2% risk threshold.</p>
        </Card>

        <Card variant="border" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Execution Discipline</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 font-mono">HIGH</div>
          <p className="text-xs text-slate-400">Orders align with pre-trade plan analysis.</p>
        </Card>
      </div>

      {/* Behavioral Observation Logs */}
      <Card variant="glow" className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">Educational Observations</h3>
        {psychologyEvents.length === 0 ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>No emotional trading patterns detected. You are executing trades with disciplined risk parameters.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {psychologyEvents.map((evt) => (
              <div 
                key={evt.id} 
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  evt.severity === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
              >
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{evt.title}</span>
                    <Badge variant={evt.severity === 'WARNING' ? 'amber' : 'rose'}>{evt.type}</Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
