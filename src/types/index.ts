// TRADECRAFT Core Data Models & Type Definitions

export type UserRole = 'student' | 'trader' | 'admin';

export type UserExperienceLevel = 'NEW_TO_MARKETS' | 'KNOW_THE_BASICS' | 'INTERMEDIATE';

export type LearningGoal = 
  | 'UNDERSTAND_MARKETS' 
  | 'TECHNICAL_ANALYSIS' 
  | 'RISK_MANAGEMENT' 
  | 'PORTFOLIO_BUILDING' 
  | 'DECISION_MAKING';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  rank: PlayerRank;
  onboardingCompleted: boolean;
  experienceLevel?: UserExperienceLevel;
  learningGoal?: LearningGoal;
  cash: number;
  createdAt: string;
}

export type PlayerRank = 
  | 'FINANCIAL ROOKIE'
  | 'MARKET EXPLORER'
  | 'TRADER'
  | 'RISK MANAGER'
  | 'PORTFOLIO MANAGER'
  | 'MARKET STRATEGIST';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  sector: 'Energy' | 'Technology' | 'Financial' | 'Commodities' | 'Consumer' | 'Indices';
  price: number;
  basePrice: number;
  volatility: number; // 0 to 1
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  volume: number;
  description: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  impact: Record<string, number>; // assetId -> percentage change (-10 to +10)
  category: 'GEOPOLITICAL' | 'EARNINGS' | 'MACRO' | 'TECH';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: number;
  duration: number; // seconds
  affectedSectors: string[];
}

export interface Holding {
  assetId: string;
  quantity: number;
  averagePrice: number;
}

export interface Order {
  id: string;
  assetId: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'EXECUTED' | 'FAILED' | 'REJECTED';
}

export interface TradeRecord {
  id: string;
  assetId: string;
  assetSymbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  realizedPnL?: number;
  timestamp: number;
}

export interface PortfolioRiskMetrics {
  totalValue: number;
  cashBalance: number;
  investedValue: number;
  totalRealizedPnL: number;
  totalUnrealizedPnL: number;
  drawdownPercent: number;
  topHoldingPercentage: number;
  diversificationScore: number; // 0 - 100
  sharpeRatio: number;
  riskRating: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE' | 'HIGH_RISK';
}

export interface MissionStep {
  stepIndex: number;
  title: string;
  instruction: string;
  targetLocation?: string;
  targetNPC?: string;
  completed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  active: boolean;
  completed: boolean;
  currentStep: number;
  totalSteps: number;
  rewardXP: number;
  rewardCash: number;
  rewardSkillId?: string;
  steps: MissionStep[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  location: string;
  completed: boolean;
  completedAt?: number;
  rewardXP: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'ANALYSIS' | 'RISK' | 'PSYCHOLOGY' | 'EXECUTION';
  tier: number;
  unlocked: boolean;
  unlockedAt?: number;
  icon: string;
  perkDescription: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type PsychologyEventType = 
  | 'REVENGE_TRADING'
  | 'POSITION_SIZING_SPIKE'
  | 'FOMO_CHASING'
  | 'PANIC_SELL'
  | 'DISCIPLINED_EXECUTION';

export interface PsychologyEvent {
  id: string;
  type: PsychologyEventType;
  title: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: number;
}

export interface AIMentorMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  downsideQuestions?: string[];
  timestamp: number;
}

export interface OnboardingState {
  username: string;
  experienceLevel: UserExperienceLevel;
  learningGoal: LearningGoal;
  avatar: string;
}
