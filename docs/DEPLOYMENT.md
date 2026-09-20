# TRADECRAFT Production Deployment Guide

## Recommended Infrastructure

- **Frontend Hosting:** Vercel / Netlify
- **Database & Auth:** Supabase PostgreSQL

## Deployment Steps

1. **Vercel Setup:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
2. **Environment Variables:**
   - Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project settings.
3. **Database Migration:**
   - Execute `supabase/schema.sql` in Supabase SQL Editor.
