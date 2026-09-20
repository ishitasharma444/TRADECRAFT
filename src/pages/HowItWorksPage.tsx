import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MapPin, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const regions = [
    { name: 'Beginner Village', desc: 'Spawn point & AI Mentor introduction. Learn asset fundamentals.' },
    { name: 'Market City Hub', desc: 'Central commerce center with NPC traders and basic order desks.' },
    { name: 'Stock Exchange Tower', desc: 'Financial skyscrapers, live market index charts, and sector heatmaps.' },
    { name: 'News Tower', desc: 'Breaking geopolitical events, Crude Oil surges, and macro announcements.' },
    { name: 'Learning Forest', desc: 'Curriculum hub for technical analysis, support/resistance, and volume.' },
    { name: 'Risk Mountains', desc: 'Drawdown simulator, position sizing limits, and risk exposure tests.' },
    { name: 'Psychology Caverns', desc: 'Behavioral analytics tracking revenge trading and emotional exits.' },
    { name: 'Portfolio Castle', desc: 'Vault containing your lifetime P&L, badges, and unlockable skills.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="emerald">MARKETVERSE WORLD REGIONS</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Explore 8 Voxel Destinations
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Each zone in MarketVerse represents a critical pillar of market mechanics and risk management.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {regions.map((r, idx) => (
          <Card key={idx} variant="border" className="space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-bold">ZONE 0{idx + 1}</div>
            <h3 className="text-base font-bold text-white">{r.name}</h3>
            <p className="text-xs text-slate-400">{r.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
