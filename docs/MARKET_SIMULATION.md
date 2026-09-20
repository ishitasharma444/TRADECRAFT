# TRADECRAFT Market Simulation Engine

## Overview

The Market Engine models asset prices using a combination of random walks, sector correlation matrices, and deterministic market events.

## Asset Roster

- **OIL (Crude Oil Futures):** High volatility, energy sector benchmark.
- **GLD (Gold Bullion ETF):** Low volatility, inverse correlation safe haven.
- **QQQ (Tech Leaders ETF):** Medium volatility, sensitive to interest rates and oil costs.
- **KBE (Banking Index ETF):** Sensitive to macro interest rate shifts.
- **XRT (Consumer Retail ETF):** Negatively impacted by energy transport surges.
- **ICLN (Clean Energy ETF):** High growth volatility, renewable innovation sector.

## Deterministic Scenario Event

**Event:** `CRUDE OIL PRICES SURGE 7%`
- **Impact Matrix:** `OIL: +7%`, `GLD: +3.5%`, `QQQ: -2.0%`, `XRT: -1.0%`
- **Educational Objective:** Teach students how geopolitical supply shocks in energy cascade through retail margins and drive safe-haven gold demand.
