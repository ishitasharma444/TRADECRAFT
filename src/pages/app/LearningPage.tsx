import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useGameStore } from '../../store/gameStore';
import { BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

export const LearningPage: React.FC = () => {
  const { xp } = useGameStore();
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const quizzes = [
    {
      id: 1,
      title: 'Crude Oil & Energy Shocks',
      question: 'When Crude Oil prices surge 7%, which sector typically faces margin compression?',
      options: ['A) Transport & Retail Stores', 'B) Physical Gold Bullion', 'C) Energy Sector Producers', 'D) Clean Energy Innovators'],
      correct: 0,
      explanation: 'Higher fuel and shipping costs squeeze profit margins for consumer retail and transport companies.'
    },
    {
      id: 2,
      title: 'Risk Management & Drawdown',
      question: 'What is the primary objective of managing position sizing on a trade?',
      options: ['A) Maximize single-trade profit', 'B) Preserve capital and limit portfolio drawdown', 'C) Guarantee 100% win rate', 'D) Avoid paying taxes'],
      correct: 1,
      explanation: 'Position sizing ensures a loss on any single trade will not jeopardize overall portfolio survival.'
    }
  ];

  const handleAnswer = (quizIdx: number, optionIdx: number) => {
    if (optionIdx === quizzes[quizIdx].correct) {
      setQuizScore(100);
    } else {
      setQuizScore(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Interactive Learning Hub</h1>
          <p className="text-xs text-slate-400">Master financial concepts through scenario challenges and instant quizzes.</p>
        </div>
        <Badge variant="emerald">XP: {xp}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((q, idx) => (
          <Card key={q.id} variant="glow" className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="emerald">QUIZ 0{q.id}</Badge>
              <HelpCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">{q.title}</h3>
            <p className="text-xs text-slate-300 font-medium">{q.question}</p>

            <div className="space-y-2 pt-2">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => {
                    setSelectedQuiz(idx);
                    handleAnswer(idx, optIdx);
                  }}
                  className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-200 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>

            {selectedQuiz === idx && quizScore !== null && (
              <div className={`p-3 rounded-lg text-xs font-semibold ${
                quizScore === 100 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}>
                {quizScore === 100 ? 'Correct! +50 XP awarded.' : 'Incorrect. Try again!'}
                <p className="text-[11px] font-normal text-slate-300 mt-1">{q.explanation}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
