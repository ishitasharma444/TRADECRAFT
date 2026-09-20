# TRADECRAFT Comprehensive Security Architecture & Threat Model

**Document Version:** 1.0.0  
**Last Updated:** September 20, 2026  

---

## 1. Authentication & Session Architecture

TRADECRAFT uses Supabase Auth as its core identity provider, supporting Email/Password registration/login and Google OAuth 2.0.

- **JWT Tokens:** Auth sessions issue JSON Web Tokens containing `sub` (User UUID) and `exp` claims.
- **Session Persistence:** Tokens are securely managed by `@supabase/supabase-js` or safely stored in local session storage when evaluating in local demo mode.
- **Google OAuth:** Configured via Supabase OAuth redirect handlers (`/app` callback). Service role keys and client secrets remain strictly server-side.

---

## 2. Row Level Security (RLS) & Authorization

Every PostgreSQL database table (`profiles`, `player_progress`, `portfolio_positions`, `trade_history`, `psychology_events`) enforces strict RLS policies:

```sql
-- Example RLS Policy
CREATE POLICY "Users manage own positions" 
ON public.portfolio_positions 
FOR ALL 
USING (auth.uid() = user_id);
```

This guarantees that even if client-side code is tampered with, server-side database access controls prevent cross-user data exposure or illegal state mutations.

---

## 3. Input & Order Validation

All order execution and user profile forms pass through Zod schema validation (`src/validation/schemas.ts`):

- **Order Quantity:** Must be finite, positive (`> 0`), and capped to 100,000 shares per order.
- **Order Price:** Must be positive (`> 0`) and verified against market engine asset prices.
- **Cash Verification:** Orders automatically reject if total cost exceeds available virtual cash (`cash >= quantity * price`).

---

## 4. Threat Model & Countermeasures

| Threat Vector | Severity | Countermeasure Implemented |
| :--- | :--- | :--- |
| **Cross-Site Scripting (XSS)** | HIGH | React JSX automatic string escaping, zero `dangerouslySetInnerHTML`. |
| **SQL Injection** | HIGH | Parameterized SQL queries via Supabase PostgreSQL client ORM. |
| **Unauthorized Data Access** | HIGH | Supabase Row Level Security (RLS) policies (`auth.uid() = user_id`). |
| **Account Enumeration** | MEDIUM | Generic authentication error messages on login/signup endpoints. |
| **Secret Exposure** | CRITICAL | `.gitignore` excludes `.env`, secrets restricted to server environment. |

---

## 5. Production Deployment Checklist

- [x] Enforce HTTPS / TLS 1.3 on Vercel frontend.
- [x] Configure Supabase Auth redirect URLs to production domain.
- [x] Apply `supabase/schema.sql` database migrations and verify RLS activation.
- [x] Validate zero committed API keys or service role secrets.
