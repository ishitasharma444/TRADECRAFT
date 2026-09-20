import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Gamepad2, 
  TrendingUp, 
  ShieldCheck, 
  Brain, 
  Bot, 
  Sparkles, 
  Layers, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden space-y-24 pb-20">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center space-y-8">
        <Badge variant="emerald" size="md" className="animate-bounce">
          ✨ Voxel Financial Education Platform
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Learn. Explore. Trade. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Level Up in MarketVerse.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          TRADECRAFT is an interactive 3D voxel game where learning financial markets IS the gameplay. 
          Analyze simulated economic events, place virtual trades, and master trading psychology.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/signup">
            <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold text-base">
              ENTER MARKETVERSE <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              SEE HOW IT WORKS
            </Button>
          </Link>
        </div>

        {/* Feature Pill Grid */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-400 font-mono">100%</div>
            <div className="text-xs text-slate-400">Simulated Trading</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-teal-400 font-mono">₹1,00,000</div>
            <div className="text-xs text-slate-400">Virtual Starter Capital</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-amber-400 font-mono">8 Zones</div>
            <div className="text-xs text-slate-400">3D Voxel World</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-400 font-mono">AI Mentor</div>
            <div className="text-xs text-slate-400">Downside Risk Analysis</div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How TRADECRAFT Works</h2>
          <p className="text-sm text-slate-400">A complete financial education lifecycle disguised as an immersive RPG.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glow" className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <Gamepad2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">1. Explore 3D World</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Navigate MarketVerse regions from Beginner Village to Stock Exchange, News Tower, and Risk Mountains.
            </p>
          </Card>

          <Card variant="glow" className="space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/30">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Analyze & Trade</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interpret breaking news events like Crude Oil surges and execute virtual orders with risk management metrics.
            </p>
          </Card>

          <Card variant="glow" className="space-y-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/30">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Psychology & AI Mentor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive educational feedback from the AI Mentor on downside risk and track your emotional trading habits.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
