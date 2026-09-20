import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Sparkles, CheckCircle, Lock, ShieldCheck, BookOpen, Brain } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const { unlockedSkills, unlockSkill, level, xp } = useGameStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Trading Skills Tree</h1>
          <p className="text-xs text-slate-400">Unlock specialized trading abilities and market perks as you level up.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald">Level {level}</Badge>
          <Badge variant="amber">{xp} Total XP</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {unlockedSkills.map((skill) => (
          <Card key={skill.id} variant={skill.unlocked ? 'glow' : 'default'} className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={skill.unlocked ? 'emerald' : 'slate'}>
                TIER {skill.tier}
              </Badge>
              {skill.unlocked ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <Lock className="w-5 h-5 text-slate-500" />
              )}
            </div>

            <h3 className="text-lg font-bold text-white">{skill.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{skill.description}</p>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Unlocked Perk</span>
              <span className="text-emerald-400 font-semibold">{skill.perkDescription}</span>
            </div>

            {!skill.unlocked && (
              <Button
                variant="primary"
                size="sm"
                className="w-full font-bold"
                onClick={() => unlockSkill(skill.id)}
              >
                <Sparkles className="w-4 h-4 mr-1" /> Unlock Skill
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
