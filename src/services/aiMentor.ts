// TRADECRAFT Educational AI Mentor Service & Provider Abstraction
import { AIMentorMessage } from '../types';

export interface AIProvider {
  name: string;
  generateFeedback(prompt: string, context?: { assetSymbol?: string; currentHoldings?: number; pnl?: number }): Promise<AIMentorMessage>;
}

/**
 * Rule-Based Educational Mentor Provider (Offline & Default Fallback)
 */
export class RuleBasedMentorProvider implements AIProvider {
  name = 'RuleBasedMentor';

  async generateFeedback(prompt: string, context?: { assetSymbol?: string; currentHoldings?: number; pnl?: number }): Promise<AIMentorMessage> {
    const lowerPrompt = prompt.toLowerCase();
    let text = '';
    const downsideQuestions: string[] = [];

    if (lowerPrompt.includes('buy') || lowerPrompt.includes('purchase')) {
      text = `When contemplating a BUY entry${context?.assetSymbol ? ` in ${context.assetSymbol}` : ''}, it is critical to evaluate risk before reward. Markets do not move in straight lines.`;
      downsideQuestions.push(
        'What specific catalyst or data point supports your bullish thesis?',
        'What is your max loss limit (stop loss) if the market moves against you?',
        'What assumptions are you making about macro economic conditions?'
      );
    } else if (lowerPrompt.includes('sell') || lowerPrompt.includes('exit')) {
      text = `Exiting a position requires discipline. Are you exiting based on a planned target, or reacting emotionally to short-term noise?`;
      downsideQuestions.push(
        'Did this trade hit your pre-determined take-profit or stop-loss level?',
        'If selling at a loss: Are you attempting to revenge-trade immediately after?',
        'What new evidence invalidates your original entry thesis?'
      );
    } else if (lowerPrompt.includes('oil') || lowerPrompt.includes('crude')) {
      text = `Energy markets are highly sensitive to geopolitical events and supply constraints. When Crude Oil surges, transport and retail sectors often experience margin compression while gold may act as a safe haven.`;
      downsideQuestions.push(
        'How does a 7% oil spike impact inflation expectations?',
        'Which sectors in your portfolio carry indirect exposure to energy prices?',
        'What downside protection do you have in place for retail or tech holdings?'
      );
    } else if (lowerPrompt.includes('risk') || lowerPrompt.includes('loss')) {
      text = `Risk management is the single most important skill of a professional trader. Preserving capital comes before generating yield.`;
      downsideQuestions.push(
        'What percentage of your total portfolio is allocated to this single asset?',
        'If this position declines 20%, how will it impact your overall drawdown?',
        'Are you risking more than 1-2% of your portfolio on a single trade?'
      );
    } else {
      text = `I am your Educational AI Mentor in the MarketVerse. My purpose is to help you refine your decision-making framework, analyze upside/downside risk, and understand market regimes.`;
      downsideQuestions.push(
        'What evidence supports your current market bias?',
        'What happens if your primary thesis turns out to be wrong?',
        'What key economic indicators or news events are you monitoring?'
      );
    }

    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender: 'mentor',
      text,
      downsideQuestions,
      timestamp: Date.now(),
    };
  }
}

/**
 * LLM-Based AI Mentor Provider (Connects to Server-Side API Proxy when configured)
 */
export class LLMMentorProvider implements AIProvider {
  name = 'LLMMentor';

  async generateFeedback(prompt: string, context?: { assetSymbol?: string; currentHoldings?: number; pnl?: number }): Promise<AIMentorMessage> {
    const apiKey = import.meta.env.VITE_AI_MENTOR_API_KEY;
    if (!apiKey) {
      // Gracefully fall back to RuleBasedMentorProvider
      const fallback = new RuleBasedMentorProvider();
      return fallback.generateFeedback(prompt, context);
    }

    try {
      // In production, privileged LLM calls route through secure server-side proxy
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });

      if (!response.ok) throw new Error('Proxy error');
      const data = await response.json();
      return data;
    } catch {
      const fallback = new RuleBasedMentorProvider();
      return fallback.generateFeedback(prompt, context);
    }
  }
}

export const getAIMentorProvider = (): AIProvider => {
  return new RuleBasedMentorProvider();
};
