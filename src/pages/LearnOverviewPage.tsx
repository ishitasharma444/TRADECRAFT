import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BookOpen, CheckCircle, Lock } from 'lucide-react';

export const LearnOverviewPage: React.FC = () => {
  const modules = [
    { id: 1, title: 'Module 1: Market Fundamentals', topics: ['Sectors & Asset Classes', 'Supply & Demand', 'Order Books & Execution'], unlocked: true },
    { id: 2, title: 'Module 2: Technical & News Analysis', topics: ['Candlestick Patterns', 'Macro News Interpretation', 'Sector Correlations'], unlocked: true },
    { id: 3, title: 'Module 3: Risk Management & Position Sizing', topics: ['Max Drawdown Limits', 'Stop-Loss Placement', 'Sharpe Ratio Metrics'], unlocked: false },
    { id: 4, title: 'Module 4: Trading Psychology', topics: ['Revenge Trading Risks', 'Over-Leveraging Pitfalls', 'Disciplined Execution'], unlocked: false },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="emerald">CURRICULUM ARCHITECTURE</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Financial Education Modules
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Learn financial mechanics through interactive quests and scenario challenges rather than boring slides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m) => (
          <Card key={m.id} variant={m.unlocked ? 'glow' : 'default'} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold">{m.unlocked ? 'UNLOCKED' : 'LOCKED'}</span>
              {m.unlocked ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-slate-500" />}
            </div>
            <h3 className="text-lg font-bold text-white">{m.title}</h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {m.topics.map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};
