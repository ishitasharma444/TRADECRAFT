// TRADECRAFT Unified Backend API & Data Persistence Service
import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile, Holding, TradeRecord, Skill, Quest, Mission, Achievement, PsychologyEvent } from '../types';

export class APIService {
  /**
   * Save User Profile & Progress to Database / Local Storage
   */
  static async syncUserProfile(profile: UserProfile): Promise<void> {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').upsert({
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar,
          level: profile.level,
          xp: profile.xp,
          rank: profile.rank,
          onboarding_completed: profile.onboardingCompleted,
          cash: profile.cash,
          updated_at: new Date().toISOString(),
        });
      }
      localStorage.setItem(`tradecraft_profile_${profile.id}`, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to sync user profile:', err);
    }
  }

  /**
   * Save Trade Record (Atomic Transaction simulation)
   */
  static async recordTrade(userId: string, trade: TradeRecord): Promise<void> {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('trade_history').insert({
          id: trade.id,
          user_id: userId,
          asset_id: trade.assetId,
          asset_symbol: trade.assetSymbol,
          type: trade.type,
          quantity: trade.quantity,
          price: trade.price,
          total: trade.total,
          realized_pnl: trade.realizedPnL || 0,
          created_at: new Date(trade.timestamp).toISOString(),
        });
      }
      
      const localTrades = JSON.parse(localStorage.getItem(`tradecraft_trades_${userId}`) || '[]');
      localTrades.unshift(trade);
      localStorage.setItem(`tradecraft_trades_${userId}`, JSON.stringify(localTrades.slice(0, 100)));
    } catch (err) {
      console.error('Failed to record trade:', err);
    }
  }

  /**
   * Save Holdings
   */
  static async syncHoldings(userId: string, holdings: Holding[]): Promise<void> {
    try {
      if (isSupabaseConfigured && supabase) {
        // Upsert positions
        for (const h of holdings) {
          await supabase.from('portfolio_positions').upsert({
            user_id: userId,
            asset_id: h.assetId,
            quantity: h.quantity,
            average_price: h.averagePrice,
            updated_at: new Date().toISOString(),
          });
        }
      }
      localStorage.setItem(`tradecraft_holdings_${userId}`, JSON.stringify(holdings));
    } catch (err) {
      console.error('Failed to sync holdings:', err);
    }
  }

  /**
   * Record Trading Psychology Observation Event
   */
  static async recordPsychologyEvent(userId: string, event: PsychologyEvent): Promise<void> {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('psychology_events').insert({
          id: event.id,
          user_id: userId,
          type: event.type,
          title: event.title,
          description: event.description,
          severity: event.severity,
          created_at: new Date(event.timestamp).toISOString(),
        });
      }
      const localEvents = JSON.parse(localStorage.getItem(`tradecraft_psychology_${userId}`) || '[]');
      localEvents.unshift(event);
      localStorage.setItem(`tradecraft_psychology_${userId}`, JSON.stringify(localEvents.slice(0, 50)));
    } catch (err) {
      console.error('Failed to record psychology event:', err);
    }
  }
}
