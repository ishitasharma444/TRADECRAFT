// TRADECRAFT Authentication Service
import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile } from '../types';

const DEMO_USER_STORAGE_KEY = 'tradecraft_demo_user_session';

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;
}

export const getStoredDemoUser = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setStoredDemoUser = (user: UserProfile | null): void => {
  try {
    if (user) {
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to update stored demo user:', err);
  }
};

export const createDefaultUserProfile = (email: string, username?: string): UserProfile => {
  const name = username || email.split('@')[0] || 'Trader';
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email,
    username: name,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 1,
    xp: 0,
    rank: 'FINANCIAL ROOKIE',
    onboardingCompleted: false,
    cash: 100000, // ₹1,00,000 initial virtual capital
    createdAt: new Date().toISOString(),
  };
};

export class AuthService {
  /**
   * Sign Up with Email and Password
   */
  static async signUp(email: string, password: string, username: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) return { user: null, error: error.message };

      const profile = createDefaultUserProfile(email, username);
      if (data.user?.id) profile.id = data.user.id;
      return { user: profile, error: null };
    }

    // Local Demo Fallback Mode
    const profile = createDefaultUserProfile(email, username);
    setStoredDemoUser(profile);
    return { user: profile, error: null };
  }

  /**
   * Sign In with Email and Password
   */
  static async signIn(email: string, password: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { user: null, error: error.message };

      const profile = createDefaultUserProfile(data.user.email || email, data.user.user_metadata?.username);
      profile.id = data.user.id;
      return { user: profile, error: null };
    }

    // Local Demo Fallback Mode
    const existing = getStoredDemoUser();
    if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
      return { user: existing, error: null };
    }

    const profile = createDefaultUserProfile(email);
    setStoredDemoUser(profile);
    return { user: profile, error: null };
  }

  /**
   * Sign In with Google OAuth
   */
  static async signInWithGoogle(): Promise<{ error: string | null }> {
    if (isSupabaseConfigured && supabase) {
      const redirectUrl = `${window.location.origin}/app`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) return { error: error.message };
      return { error: null };
    }

    // Fallback when OAuth credentials are not yet configured in environment
    return { 
      error: 'Google OAuth requires VITE_SUPABASE_URL and Google OAuth Client credentials in your .env configuration. Click "Enter Demo Mode" below to test the full application state!' 
    };
  }

  /**
   * Login as Demo User for Hackathon / Evaluation
   */
  static loginAsDemoUser(): UserProfile {
    const existing = getStoredDemoUser();
    if (existing) return existing;

    const demoUser = createDefaultUserProfile('demo@tradecraft.edu', 'MarketExplorer');
    demoUser.onboardingCompleted = true;
    demoUser.level = 2;
    demoUser.xp = 450;
    demoUser.rank = 'MARKET EXPLORER';
    setStoredDemoUser(demoUser);
    return demoUser;
  }

  /**
   * Sign Out
   */
  static async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setStoredDemoUser(null);
  }

  /**
   * Account Deletion Workflow
   */
  static async deleteAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (isSupabaseConfigured && supabase) {
        // Clear user data tables
        await supabase.from('profiles').delete().eq('id', userId);
        await supabase.auth.signOut();
      }
      setStoredDemoUser(null);
      localStorage.clear(); // Safe clean out of local session cache
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete account' };
    }
  }
}
