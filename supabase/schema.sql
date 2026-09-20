-- TRADECRAFT Production Database Schema & Row Level Security Policies
-- PostgreSQL / Supabase Compatible

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES & USER ACCOUNTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar TEXT,
  level INT DEFAULT 1 CHECK (level >= 1),
  xp INT DEFAULT 0 CHECK (xp >= 0),
  rank VARCHAR(50) DEFAULT 'FINANCIAL ROOKIE',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  experience_level VARCHAR(30),
  learning_goal VARCHAR(30),
  cash NUMERIC(15, 2) DEFAULT 100000.00 CHECK (cash >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PLAYER PROGRESS (3D World & Location)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.player_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position_x NUMERIC(8, 2) DEFAULT 0.00,
  position_y NUMERIC(8, 2) DEFAULT 0.00,
  position_z NUMERIC(8, 2) DEFAULT 0.00,
  current_location VARCHAR(100) DEFAULT 'Beginner Village',
  current_mission_id VARCHAR(100) DEFAULT 'market_awakens',
  mission_step INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. SKILLS & UNLOCKED SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30) NOT NULL,
  tier INT DEFAULT 1,
  icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.player_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id VARCHAR(50) NOT NULL REFERENCES public.skills(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- ============================================================
-- 4. QUESTS & MISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quests (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  reward_xp INT DEFAULT 100
);

CREATE TABLE IF NOT EXISTS public.quest_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id VARCHAR(50) NOT NULL REFERENCES public.quests(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, quest_id)
);

-- ============================================================
-- 5. PORTFOLIO & POSITIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.portfolio_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_id VARCHAR(50) NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL CHECK (quantity >= 0),
  average_price NUMERIC(15, 2) NOT NULL CHECK (average_price > 0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, asset_id)
);

-- ============================================================
-- 6. TRADE HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trade_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_id VARCHAR(50) NOT NULL,
  asset_symbol VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('BUY', 'SELL')),
  quantity NUMERIC(15, 4) NOT NULL CHECK (quantity > 0),
  price NUMERIC(15, 2) NOT NULL CHECK (price > 0),
  total NUMERIC(15, 2) NOT NULL CHECK (total > 0),
  realized_pnl NUMERIC(15, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. PSYCHOLOGY EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.psychology_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'INFO',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_trade_history_user ON public.trade_history(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_positions_user ON public.portfolio_positions(user_id);
CREATE INDEX IF NOT EXISTS idx_psychology_events_user ON public.psychology_events(user_id);
CREATE INDEX IF NOT EXISTS idx_player_skills_user ON public.player_skills(user_id);

-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychology_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Player Progress: Users can only read/update their own progress
CREATE POLICY "Users manage own progress" ON public.player_progress FOR ALL USING (auth.uid() = user_id);

-- Portfolio Positions: Users can only read/update their own holdings
CREATE POLICY "Users manage own positions" ON public.portfolio_positions FOR ALL USING (auth.uid() = user_id);

-- Trade History: Users can only read/insert their own trades
CREATE POLICY "Users manage own trades" ON public.trade_history FOR ALL USING (auth.uid() = user_id);

-- Psychology Events: Users can only read/insert their own psychology records
CREATE POLICY "Users manage own psychology events" ON public.psychology_events FOR ALL USING (auth.uid() = user_id);
