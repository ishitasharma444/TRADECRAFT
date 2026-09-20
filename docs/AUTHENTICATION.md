# TRADECRAFT Authentication & Session Management

## Authentication Features

TRADECRAFT supports complete production authentication via Supabase Auth:

- **Email / Password Registration:** With Zod schema validation for password complexity.
- **Email / Password Login:** Session persistence across page reloads.
- **Google OAuth 2.0:** Single click "CONTINUE WITH GOOGLE" OAuth flow.
- **Instant Demo Mode:** Fallback mode for testing and evaluation without requiring live credentials.
- **Account Deletion:** Explicit user confirmation workflow purging user state.
