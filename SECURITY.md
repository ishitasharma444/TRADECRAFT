# Security Policy - TRADECRAFT

## Reporting Security Vulnerabilities

The TRADECRAFT engineering team takes security seriously. If you discover a security vulnerability, please do NOT create a public issue. Instead, disclose it responsibly to:

`security@tradecraft.edu`

We aim to respond to all reports within 48 hours and release patches promptly.

## Security Posture Overview

TRADECRAFT implements defense-in-depth controls across authentication, authorization, session management, and data handling:

1. **Authentication:** Production authentication relies on Supabase Auth (Email/Password & Google OAuth).
2. **Authorization & Row Level Security (RLS):** All user tables in PostgreSQL/Supabase enforce strict Row Level Security policies (`auth.uid() = user_id`).
3. **Secret Management:** No API keys, service role keys, or OAuth secrets are committed to Git. All configuration relies on environment variables (`.env`).
4. **Input Validation:** All client inputs and trade orders are strictly validated using Zod schemas (`src/validation/schemas.ts`).
5. **Simulated Financial Environment:** TRADECRAFT processes zero real money transactions and does not request banking or credit card details.

For detailed architecture analysis, threat models, and production hardening checklists, see [`docs/SECURITY.md`](docs/SECURITY.md).
