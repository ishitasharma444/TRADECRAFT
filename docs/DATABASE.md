# TRADECRAFT PostgreSQL & Supabase Database Architecture

## SQL Migrations

Database setup is defined in `supabase/schema.sql`.

## Primary Tables

1. `public.profiles`: Stores level, XP, virtual cash, rank, and avatar.
2. `public.player_progress`: Tracks 3D player coordinates, current zone, active mission step.
3. `public.portfolio_positions`: Virtual holdings, average cost basis, and quantity.
4. `public.trade_history`: Immutable log of buy/sell orders, executed prices, and realized P&L.
5. `public.psychology_events`: Behavioral analytics log tracking revenge trading alerts.
6. `public.player_skills`: Unlocked skill tree abilities and unlocked timestamps.
