# TRADECRAFT Educational AI Mentor Specification

## Provider Abstraction (`AIProvider`)

The AI Mentor implementation resides in `src/services/aiMentor.ts` using a provider interface:

- `RuleBasedMentorProvider`: Default offline fallback requiring zero API keys.
- `LLMMentorProvider`: Connects to secure server-side LLM proxy when `VITE_AI_MENTOR_API_KEY` is configured.

## Safety & Educational Guardrails

- **Zero Stock Advice:** The mentor NEVER issues direct buy/sell recommendations.
- **Downside Risk Focus:** Prompt outputs always highlight downside risk, asking probing questions ("What is your stop loss limit?", "What assumptions are you making?").
