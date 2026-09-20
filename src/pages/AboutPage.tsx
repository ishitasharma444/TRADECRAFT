import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, BookOpen, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="emerald">ABOUT TRADECRAFT</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Financial Education Built as an Interactive 3D RPG
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          TRADECRAFT bridges the gap between dry financial theory and real decision-making through simulated market gameplay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Our Educational Mission</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Most financial education relies on static textbooks or dangerous real-money trading apps. TRADECRAFT gives students a safe 3D sandbox to experiment, experience market regimes, and learn downside risk management.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Simulated & Risk-Free</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            There is no real money deposited or traded in TRADECRAFT. Every transaction uses virtual currency (₹1,00,000 starter capital) to promote learning and discipline over reckless speculation.
          </p>
        </Card>
      </div>
    </div>
  );
};
