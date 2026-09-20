import React, { useState } from 'react';
import { getAIMentorProvider } from '../../services/aiMentor';
import { AIMentorMessage } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Bot, Send, ShieldCheck, HelpCircle } from 'lucide-react';

export const MentorPage: React.FC = () => {
  const mentorProvider = getAIMentorProvider();

  const [messages, setMessages] = useState<AIMentorMessage[]>([
    {
      id: 'welcome',
      sender: 'mentor',
      text: 'Greetings, Trader! I am your Educational AI Mentor in MarketVerse. I do not provide direct buy/sell tips, but I will challenge your thesis and help you evaluate downside risk before placing orders.',
      downsideQuestions: [
        'What evidence supports your current market bias?',
        'What happens if Crude Oil or interest rates move against your thesis?',
        'What is your pre-determined stop loss limit?'
      ],
      timestamp: Date.now(),
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const prompt = queryText || inputQuery;
    if (!prompt.trim()) return;

    const userMsg: AIMentorMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    const feedback = await mentorProvider.generateFeedback(prompt);
    setIsLoading(false);

    setMessages((prev) => [...prev, feedback]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Educational AI Mentor</h1>
          <p className="text-xs text-slate-400">Refine your decision framework and evaluate downside risk parameters.</p>
        </div>
        <Badge variant="emerald" size="md">Provider: {mentorProvider.name}</Badge>
      </div>

      {/* Messages Chat Box */}
      <Card variant="glow" className="h-[550px] flex flex-col justify-between p-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                m.sender === 'user' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
              }`}>
                {m.sender === 'user' ? 'YOU' : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl p-3.5 rounded-2xl text-xs space-y-2 ${
                m.sender === 'user' 
                  ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 rounded-tr-none' 
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                <p className="leading-relaxed">{m.text}</p>

                {m.downsideQuestions && m.downsideQuestions.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase font-mono flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Downside Risk Questions to Consider:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {m.downsideQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono italic">
              <Bot className="w-4 h-4 animate-bounce" /> AI Mentor analyzing downside risk parameters...
            </div>
          )}
        </div>

        {/* Quick Sample Scenario Buttons */}
        <div className="py-2 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-mono shrink-0">Scenarios:</span>
          <button 
            onClick={() => handleSend('What happens if Crude Oil drops 10%?')}
            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md shrink-0"
          >
            Crude Oil Drop Scenario
          </button>
          <button 
            onClick={() => handleSend('How do I manage risk on a buy order?')}
            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md shrink-0"
          >
            Buy Order Risk Rules
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <Input
            placeholder="Ask AI Mentor about downside risk or thesis validation..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="bg-slate-950"
          />
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
