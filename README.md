# TRADECRAFT — 3D Financial Education & Market Simulation Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/tradecraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-emerald)](https://vitejs.dev/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R173-black)](https://threejs.org/)

TRADECRAFT is an authentic software product combining an interactive 3D voxel-style game world (**MarketVerse**) with simulated trading, risk management metrics, educational AI mentorship, trading psychology monitoring, authentication, and persistent user progress.

> **EDUCATIONAL SIMULATION DISCLAIMER:** TRADECRAFT is a 100% simulated educational experience. There is NO real-money trading, zero deposit execution, and no financial performance guarantees. All capital represented (₹1,00,000 starter balance) is purely virtual currency.

---

## 🌟 Key Features

### 1. 3D Voxel MarketVerse World
- **8 Distinct Regions:** Beginner Village, Market City Hub, Stock Exchange Tower, News Tower, Learning Forest, Risk Mountains, Psychology Caverns, and Portfolio Castle.
- **Controls:** `WASD` / Arrow keys to move, `Shift` to sprint, `Space` to jump, `E` to interact with NPCs.

### 2. Authentic Product UI & Navigation
- **Public Routes:** Landing Page (`/`), About (`/about`), How It Works (`/how-it-works`), Curriculum (`/learn`), Login (`/login`), Signup (`/signup`), Privacy (`/privacy`), Terms (`/terms`).
- **Authenticated Command Center:** 3D World (`/app/world`), Missions (`/app/missions`), Market Desk (`/app/market`), Portfolio & Risk (`/app/portfolio`), Learning (`/app/learning`), Skills (`/app/skills`), AI Mentor (`/app/mentor`), Psychology (`/app/psychology`), Profile (`/app/profile`), Settings (`/app/settings`).

### 3. Production Authentication & OAuth
- **Supabase Auth:** Email/Password registration & login with Zod validation.
- **Google OAuth:** "CONTINUE WITH GOOGLE" OAuth flow integration.
- **Demo Mode Fallback:** Instant evaluation session capability when environment credentials are absent.

### 4. Database & Row Level Security (RLS)
- **PostgreSQL / Supabase Schema:** Full migration script in `supabase/schema.sql`.
- **Strict RLS Policies:** Data access restricted per authenticated user (`auth.uid() = user_id`).

### 5. Simulated Trading Engine & Risk Analytics
- **Assets & Orders:** Trade Crude Oil, Gold, Tech Index, Banking Index, Consumer Retail, Clean Energy with Buy/Sell order validation.
- **Risk Metrics:** Realized P&L, Unrealized P&L, Average Cost Basis, Drawdown %, Top Holding Concentration %, Diversification Score (0-100), Sharpe Ratio, and Risk Ratings.

### 6. Educational AI Mentor & Psychology Analytics
- **AIProvider Abstraction:** Downside risk prompting ("What evidence supports your decision?", "What happens if Crude Oil drops 10%?") without direct stock tips.
- **Psychology Monitor:** Automated behavioral detection for revenge trading after losses and position sizing spikes.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router v7, Zustand, Tailwind / Vanilla CSS design tokens.
- **3D Engine:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Simplex Noise.
- **Auth & Database:** Supabase Auth, Supabase PostgreSQL, Row Level Security (RLS).
- **Validation & Icons:** Zod, Lucide React icons.
- **Testing:** Vitest, React Testing Library.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ & npm

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-username/tradecraft.git
cd tradecraft

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env

# 4. Start local development server
npm run dev
```

---

## 🧪 Testing & Build Verification

```bash
# Run unit tests
npm run test

# Run TypeScript type check
npm run typecheck

# Build production bundle
npm run build
```

---

## 📄 Documentation Suite

Detailed technical documentation is available in the [`docs/`](docs/) directory:
- [`docs/IMPLEMENTATION_AUDIT.md`](docs/IMPLEMENTATION_AUDIT.md)
- [`docs/SECURITY.md`](docs/SECURITY.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md)
- [`docs/MARKET_SIMULATION.md`](docs/MARKET_SIMULATION.md)
- [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md)
- [`docs/DATABASE.md`](docs/DATABASE.md)
- [`docs/AI_MENTOR.md`](docs/AI_MENTOR.md)
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)

---

## 🛡 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
