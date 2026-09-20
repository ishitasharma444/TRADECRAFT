import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle, ArrowRight, Gamepad2 } from 'lucide-react';

export const MissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMission, completeMission, xp } = useGameStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Story Missions & Quests</h1>
          <p className="text-xs text-slate-400">Complete story objectives to earn virtual cash, XP, and unlock skills.</p>
        </div>
        <Badge variant="emerald" size="md">Current XP: {xp}</Badge>
      </div>

      {currentMission ? (
        <Card variant="glow" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="emerald">ACTIVE MISSION</Badge>
                <span className="text-xs text-slate-400 font-mono">ID: {currentMission.id}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{currentMission.title}</h2>
              <p className="text-xs text-slate-300 mt-1">{currentMission.description}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Rewards</span>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                +{currentMission.rewardXP} XP | +₹{currentMission.rewardCash.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Mission Steps Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Mission Objectives</h3>
            {currentMission.steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  step.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200' 
                    : idx === currentMission.currentStep
                    ? 'bg-slate-900 border-amber-500/50 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="mt-0.5">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{step.title}</span>
                    {idx === currentMission.currentStep && <Badge variant="amber">IN PROGRESS</Badge>}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{step.instruction}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/app/world')}>
              <Gamepad2 className="w-4 h-4 mr-1" /> Resume 3D World Exploration
            </Button>

            {currentMission.currentStep >= currentMission.totalSteps - 1 && !currentMission.completed && (
              <Button variant="primary" size="sm" onClick={completeMission} className="font-bold">
                Claim Mission Rewards <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">All Story Missions Complete!</h3>
          <p className="text-xs text-slate-400 mt-1">Check back soon for new MarketVerse scenario expansions.</p>
        </Card>
      )}
    </div>
  );
};
