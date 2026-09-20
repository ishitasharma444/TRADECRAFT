import { create } from 'zustand';
import { 
  Asset, 
  Holding, 
  Order, 
  TradeRecord, 
  Mission, 
  Quest, 
  Skill, 
  Achievement, 
  MarketEvent, 
  UserProfile,
  PortfolioRiskMetrics,
  PsychologyEvent
} from '../types';
import { APIService } from '../services/api';
import { AuthService, getStoredDemoUser } from '../services/auth';

export interface GameStoreState {
  // User & Auth Session
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;

  // Assets & Market Simulation
  assets: Asset[];
  marketEvents: MarketEvent[];
  lastPriceUpdate: number;
  currentScenario: string;

  // Portfolio & Orders
  cash: number;
  holdings: Holding[];
  tradeHistory: TradeRecord[];
  
  // Progression
  xp: number;
  level: number;
  unlockedSkills: Skill[];
  completedQuests: Quest[];
  achievements: Achievement[];
  currentMission: Mission | null;

  // Psychology Analytics
  psychologyEvents: PsychologyEvent[];
  consecutiveLosses: number;
  lastTradeTime: number;

  // Actions
  setUser: (user: UserProfile | null) => void;
  initializeGame: () => Promise<void>;
  updateMarketPrices: () => void;
  triggerMarketEvent: (event: MarketEvent) => void;
  
  // Trading Engine
  placeOrder: (order: { assetId: string; type: 'BUY' | 'SELL'; quantity: number }) => { success: boolean; message: string };
  
  // Risk Engine
  getRiskMetrics: () => PortfolioRiskMetrics;

  // Missions & Skills
  updateMissionStep: (step: number) => void;
  completeMission: () => void;
  unlockSkill: (skillId: string) => void;

  // Psychology
  recordPsychologyAlert: (event: PsychologyEvent) => void;
  
  // Session
  logout: () => Promise<void>;
}

const INITIAL_ASSETS: Asset[] = [
  { id: 'oil', symbol: 'OIL', name: 'Crude Oil Futures', sector: 'Energy', price: 75.0, basePrice: 75.0, volatility: 0.35, trend: 'BULLISH', volume: 145000, description: 'Global benchmark for crude oil prices.' },
  { id: 'gold', symbol: 'GLD', name: 'Gold Bullion ETF', sector: 'Commodities', price: 1850.0, basePrice: 1850.0, volatility: 0.15, trend: 'NEUTRAL', volume: 92000, description: 'Safe haven asset backed by physical gold.' },
  { id: 'tech', symbol: 'QQQ', name: 'Tech Leaders ETF', sector: 'Technology', price: 340.0, basePrice: 340.0, volatility: 0.28, trend: 'BULLISH', volume: 540000, description: 'Index tracking top technology growth stocks.' },
  { id: 'bank', symbol: 'KBE', name: 'Banking Index ETF', sector: 'Financial', price: 52.0, basePrice: 52.0, volatility: 0.22, trend: 'NEUTRAL', volume: 210000, description: 'Financial institutions and major retail banks.' },
  { id: 'retail', symbol: 'XRT', name: 'Consumer Retail ETF', sector: 'Consumer', price: 78.0, basePrice: 78.0, volatility: 0.20, trend: 'BEARISH', volume: 180000, description: 'Consumer discretionary and retail store index.' },
  { id: 'green', symbol: 'ICLN', name: 'Clean Energy ETF', sector: 'Energy', price: 24.5, basePrice: 24.5, volatility: 0.32, trend: 'BULLISH', volume: 110000, description: 'Solar, wind, and renewable energy innovators.' },
];

const INITIAL_MISSION: Mission = {
  id: 'market_awakens',
  title: 'The Market Awakens',
  description: 'Investigate the Crude Oil price surge, analyze sector impacts, and execute your first trade.',
  active: true,
  completed: false,
  currentStep: 0,
  totalSteps: 5,
  rewardXP: 500,
  rewardCash: 10000,
  rewardSkillId: 'market_basics',
  steps: [
    { stepIndex: 0, title: 'Meet AI Mentor', instruction: 'Talk to the AI Mentor in Beginner Village [Press E].', targetNPC: 'AI Mentor', completed: false },
    { stepIndex: 1, title: 'Travel to News Tower', instruction: 'Navigate across the world to the News Tower to gather market intelligence.', targetLocation: 'News Tower', completed: false },
    { stepIndex: 2, title: 'Analyze Breaking Event', instruction: 'Review the breaking headline: CRUDE OIL PRICES SURGE 7%.', completed: false },
    { stepIndex: 3, title: 'Execute Trade at Stock Exchange', instruction: 'Enter Stock Exchange Tower and execute a trade in OIL or GLD.', targetLocation: 'Stock Exchange', completed: false },
    { stepIndex: 4, title: 'Review Decision Replay', instruction: 'Receive feedback from AI Mentor and claim your rewards.', completed: false },
  ],
};

const DEFAULT_SKILLS: Skill[] = [
  { id: 'market_basics', name: 'Market Basics', description: 'Understand asset sectors and market regime definitions.', category: 'ANALYSIS', tier: 1, unlocked: false, icon: 'BookOpen', perkDescription: '+5% XP on trade execution' },
  { id: 'risk_management', name: 'Risk Management', description: 'Position sizing and max drawdown control techniques.', category: 'RISK', tier: 1, unlocked: false, icon: 'ShieldCheck', perkDescription: 'Unlocks Drawdown Analytics in Portfolio' },
  { id: 'psychology_discipline', name: 'Emotional Control', description: 'Detect and prevent revenge trading behavior after losses.', category: 'PSYCHOLOGY', tier: 2, unlocked: false, icon: 'Brain', perkDescription: 'Real-time alerts on position sizing spikes' },
];

export const useGameStore = create<GameStoreState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoadingAuth: true,

  assets: INITIAL_ASSETS,
  marketEvents: [],
  lastPriceUpdate: Date.now(),
  currentScenario: 'Crude Oil Supply Shock',

  cash: 100000,
  holdings: [],
  tradeHistory: [],

  xp: 0,
  level: 1,
  unlockedSkills: DEFAULT_SKILLS,
  completedQuests: [],
  achievements: [
    { id: 'first_login', title: 'Welcome to MarketVerse', description: 'Logged into TRADECRAFT for the first time.', icon: 'Award', unlocked: true, unlockedAt: new Date().toISOString() }
  ],
  currentMission: INITIAL_MISSION,

  psychologyEvents: [],
  consecutiveLosses: 0,
  lastTradeTime: 0,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: Boolean(user),
      isLoadingAuth: false, // CRITICAL FIX: Always turn off loading state when user is set!
      cash: user?.cash || 100000,
      xp: user?.xp || 0,
      level: user?.level || 1,
    });
  },

  initializeGame: async () => {
    // Check if a stored user session exists
    const storedUser = getStoredDemoUser();
    if (storedUser) {
      set({
        user: storedUser,
        isAuthenticated: true,
        isLoadingAuth: false,
        cash: storedUser.cash || 100000,
        xp: storedUser.xp || 0,
        level: storedUser.level || 1,
        assets: INITIAL_ASSETS,
        currentMission: INITIAL_MISSION,
        lastPriceUpdate: Date.now(),
      });
    } else {
      set({
        isLoadingAuth: false,
        assets: INITIAL_ASSETS,
        currentMission: INITIAL_MISSION,
        lastPriceUpdate: Date.now(),
      });
    }
  },

  updateMarketPrices: () => {
    set((state) => {
      const now = Date.now();
      const updatedAssets = state.assets.map((asset) => {
        const changePercent = (Math.random() * 2 - 1) * asset.volatility * 0.02;
        let newPrice = Math.max(0.1, asset.price * (1 + changePercent));
        newPrice = newPrice * 0.98 + asset.basePrice * 0.02;
        return { ...asset, price: Number(newPrice.toFixed(2)) };
      });

      return {
        assets: updatedAssets,
        lastPriceUpdate: now,
      };
    });
  },

  triggerMarketEvent: (event: MarketEvent) => {
    set((state) => {
      const updatedAssets = state.assets.map((asset) => {
        const impactPercent = event.impact[asset.id] || 0;
        if (impactPercent !== 0) {
          const newPrice = Math.max(0.1, asset.price * (1 + impactPercent / 100));
          return { ...asset, price: Number(newPrice.toFixed(2)) };
        }
        return asset;
      });

      return {
        assets: updatedAssets,
        marketEvents: [event, ...state.marketEvents].slice(0, 20),
      };
    });
  },

  placeOrder: ({ assetId, type, quantity }) => {
    const state = get();
    const asset = state.assets.find((a) => a.id === assetId);

    if (!asset) return { success: false, message: 'Invalid asset selection' };
    if (quantity <= 0 || isNaN(quantity)) return { success: false, message: 'Quantity must be greater than zero' };

    const totalCost = Number((asset.price * quantity).toFixed(2));

    if (type === 'BUY') {
      if (state.cash < totalCost) {
        return { success: false, message: `Insufficient virtual cash. Order requires ₹${totalCost.toLocaleString()}, available ₹${state.cash.toLocaleString()}` };
      }

      const existingHolding = state.holdings.find((h) => h.assetId === assetId);
      let updatedHoldings: Holding[];

      if (existingHolding) {
        const newQty = existingHolding.quantity + quantity;
        const newAvgPrice = (existingHolding.averagePrice * existingHolding.quantity + totalCost) / newQty;
        updatedHoldings = state.holdings.map((h) =>
          h.assetId === assetId ? { assetId, quantity: newQty, averagePrice: Number(newAvgPrice.toFixed(2)) } : h
        );
      } else {
        updatedHoldings = [...state.holdings, { assetId, quantity, averagePrice: asset.price }];
      }

      const newCash = Number((state.cash - totalCost).toFixed(2));

      const trade: TradeRecord = {
        id: `trade_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        assetId,
        assetSymbol: asset.symbol,
        type: 'BUY',
        quantity,
        price: asset.price,
        total: totalCost,
        timestamp: Date.now(),
      };

      set({
        cash: newCash,
        holdings: updatedHoldings,
        tradeHistory: [trade, ...state.tradeHistory],
        lastTradeTime: Date.now(),
      });

      if (state.user) {
        APIService.syncUserProfile({ ...state.user, cash: newCash });
        APIService.recordTrade(state.user.id, trade);
        APIService.syncHoldings(state.user.id, updatedHoldings);
      }

      if (state.currentMission && state.currentMission.id === 'market_awakens' && state.currentMission.currentStep === 3) {
        get().updateMissionStep(4);
      }

      return { success: true, message: `Successfully bought ${quantity} shares of ${asset.symbol} for ₹${totalCost.toLocaleString()}!` };
    } else {
      const holding = state.holdings.find((h) => h.assetId === assetId);
      if (!holding || holding.quantity < quantity) {
        return { success: false, message: `Insufficient position in ${asset.symbol}. Owned: ${holding?.quantity || 0}` };
      }

      const pnl = Number(((asset.price - holding.averagePrice) * quantity).toFixed(2));
      const newCash = Number((state.cash + totalCost).toFixed(2));

      let updatedHoldings: Holding[];
      if (holding.quantity === quantity) {
        updatedHoldings = state.holdings.filter((h) => h.assetId !== assetId);
      } else {
        updatedHoldings = state.holdings.map((h) =>
          h.assetId === assetId ? { ...h, quantity: h.quantity - quantity } : h
        );
      }

      const trade: TradeRecord = {
        id: `trade_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        assetId,
        assetSymbol: asset.symbol,
        type: 'SELL',
        quantity,
        price: asset.price,
        total: totalCost,
        realizedPnL: pnl,
        timestamp: Date.now(),
      };

      if (pnl < 0) {
        const newLosses = state.consecutiveLosses + 1;
        set({ consecutiveLosses: newLosses });
        if (newLosses >= 2) {
          get().recordPsychologyAlert({
            id: `psy_${Date.now()}`,
            type: 'REVENGE_TRADING',
            title: 'Revenge Trading Alert',
            description: 'You executed consecutive trades resulting in losses. Take a pause to review your downside parameters.',
            severity: 'WARNING',
            timestamp: Date.now(),
          });
        }
      } else {
        set({ consecutiveLosses: 0 });
      }

      set({
        cash: newCash,
        holdings: updatedHoldings,
        tradeHistory: [trade, ...state.tradeHistory],
        lastTradeTime: Date.now(),
      });

      if (state.user) {
        APIService.syncUserProfile({ ...state.user, cash: newCash });
        APIService.recordTrade(state.user.id, trade);
        APIService.syncHoldings(state.user.id, updatedHoldings);
      }

      return { success: true, message: `Successfully sold ${quantity} shares of ${asset.symbol} for ₹${totalCost.toLocaleString()} (P&L: ${pnl >= 0 ? '+' : ''}₹${pnl.toLocaleString()})` };
    }
  },

  getRiskMetrics: () => {
    const state = get();
    const assetsMap = new Map(state.assets.map((a) => [a.id, a]));

    let investedValue = 0;
    let totalUnrealizedPnL = 0;
    let topHoldingVal = 0;

    state.holdings.forEach((h) => {
      const asset = assetsMap.get(h.assetId);
      const currentPrice = asset?.price || h.averagePrice;
      const val = currentPrice * h.quantity;
      investedValue += val;
      totalUnrealizedPnL += (currentPrice - h.averagePrice) * h.quantity;
      if (val > topHoldingVal) topHoldingVal = val;
    });

    const totalValue = Number((state.cash + investedValue).toFixed(2));
    const totalRealizedPnL = state.tradeHistory.reduce((acc, t) => acc + (t.realizedPnL || 0), 0);

    const topHoldingPercentage = totalValue > 0 ? Number(((topHoldingVal / totalValue) * 100).toFixed(1)) : 0;
    const drawdownPercent = totalValue < 100000 ? Number((((100000 - totalValue) / 100000) * 100).toFixed(1)) : 0;
    const diversificationScore = state.holdings.length === 0 ? 0 : Math.min(100, state.holdings.length * 25);

    return {
      totalValue,
      cashBalance: state.cash,
      investedValue: Number(investedValue.toFixed(2)),
      totalRealizedPnL: Number(totalRealizedPnL.toFixed(2)),
      totalUnrealizedPnL: Number(totalUnrealizedPnL.toFixed(2)),
      drawdownPercent,
      topHoldingPercentage,
      diversificationScore,
      sharpeRatio: 1.42,
      riskRating: topHoldingPercentage > 50 ? 'HIGH_RISK' : topHoldingPercentage > 25 ? 'AGGRESSIVE' : 'BALANCED',
    };
  },

  updateMissionStep: (step: number) => {
    set((state) => {
      if (!state.currentMission) return state;
      const updatedSteps = state.currentMission.steps.map((s, idx) => ({
        ...s,
        completed: idx <= step,
      }));
      return {
        currentMission: {
          ...state.currentMission,
          currentStep: step,
          steps: updatedSteps,
        },
      };
    });
  },

  completeMission: () => {
    set((state) => {
      if (!state.currentMission) return state;
      const rewardXP = state.currentMission.rewardXP;
      const newXP = state.xp + rewardXP;
      const newLevel = Math.floor(newXP / 500) + 1;

      return {
        xp: newXP,
        level: newLevel,
        currentMission: {
          ...state.currentMission,
          completed: true,
        },
      };
    });
  },

  unlockSkill: (skillId: string) => {
    set((state) => ({
      unlockedSkills: state.unlockedSkills.map((s) =>
        s.id === skillId ? { ...s, unlocked: true, unlockedAt: Date.now() } : s
      ),
    }));
  },

  recordPsychologyAlert: (event: PsychologyEvent) => {
    set((state) => ({
      psychologyEvents: [event, ...state.psychologyEvents],
    }));
    if (get().user) {
      APIService.recordPsychologyEvent(get().user!.id, event);
    }
  },

  logout: async () => {
    await AuthService.signOut();
    set({
      user: null,
      isAuthenticated: false,
      isLoadingAuth: false,
      cash: 100000,
      holdings: [],
      tradeHistory: [],
    });
  },
}));
