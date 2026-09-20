# TRADECRAFT Application Architecture

## Architectural Overview

TRADECRAFT uses a decoupled dual-layer architecture combining a modern React 19 web application shell with a 3D React Three Fiber game canvas.

```
+-----------------------------------------------------------------------+
|                           TRADECRAFT Shell                            |
|          React 19 + TypeScript + Vite + React Router (v7)             |
+-----------------------------------+-----------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
+-----------v-----------+                       +-----------v-----------+
|    Public Web Shell   |                       |  App Command Center   |
|   (/, /about, /learn) |                       |  (/app/world, /market)|
+-----------------------+                       +-----------+-----------+
                                                            |
                                                +-----------v-----------+
                                                |     3D Game Canvas    |
                                                | R3F + Three.js + Drei |
                                                +-----------+-----------+
                                                            |
                                                +-----------v-----------+
                                                |    Zustand Store      |
                                                | (Game & Market State) |
                                                +-----------+-----------+
                                                            |
                                                +-----------v-----------+
                                                |   Supabase Backend    |
                                                |  Auth + PostgreSQL DB |
                                                +-----------------------+
```

## Modular Layer Breakdown

1. **Routing & UI Domain (`src/app/`, `src/pages/`):** Manages navigation, auth guards (`AppLayout`), public pages, and fintech command center dashboards.
2. **3D Game Engine (`src/game/`):** Houses R3F Voxel World terrain generation, WASD player movement physics, camera lerping, building structures, and interactive NPC dialogue triggers.
3. **Market & Portfolio Engine (`src/market/`, `src/portfolio/`):** Handles deterministic scenario replay, asset price random walk with mean reversion, order execution (buy/sell), cost basis calculation, and portfolio risk metrics (drawdown, Sharpe ratio).
4. **AI Mentor & Psychology (`src/mentor/`, `src/psychology/`):** Educational prompt provider abstraction (`AIProvider`) and automated trading psychology monitoring (revenge trading alerts).
5. **Backend & Persistence (`src/services/`):** Supabase Auth client, database sync, and local session fallback when offline or evaluating without credentials.
