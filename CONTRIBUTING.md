# Contributing to TRADECRAFT

Thank you for your interest in contributing to TRADECRAFT!

## Development Guidelines

1. **Simulated Education Principle:** All features must adhere to the core vision: TRADECRAFT is an educational 3D game with 100% simulated trading.
2. **Type Safety:** Maintain strict TypeScript types across game stores, services, and components. Run `npm run typecheck` before opening pull requests.
3. **Build & Tests:** All unit tests (`npm run test`) and production builds (`npm run build`) must pass cleanly.
4. **Security:** Never hardcode secrets, API keys, or credentials. Use `.env.example` placeholders.
