# Phase 0 Baseline

Recorded on 2026-07-27 before the database and security remediation phases.

## Runtime

- Node.js: 24.11.0
- npm: 11.6.1
- Frontend: React 18 with Vite
- Backend services: Supabase database, authentication, and storage
- Hosting target: Cloudflare Pages

## Build baseline

The production build completed successfully before Phase 0. It emitted one known bundle
warning: the single JavaScript entry chunk was approximately 509 kB before gzip and
exceeded Vite's 500 kB advisory threshold. Route-level splitting and removal of production
mock data remain scheduled for Phase 6.

## Dependency baseline

The original dependency tree reported two moderate React Router advisories. Phase 0
upgraded Vite and React Router to remove the directly relevant Vite development-server and
older React Router browser-routing findings.

React Router 7.18.1 currently has a high advisory for its RSC/server-action mode. This
project is a client-rendered SPA and does not use React Server Components, server actions,
SSR hydration, or React Router framework mode. The residual advisory is therefore recorded
as a scoped temporary exception rather than a reachable production path. CI prints the
complete audit and fails on critical findings. Phase 2 must reassess and upgrade when a
fixed upstream release is available.

## Environment variables

| Variable | Development | Preview | Production | Secret classification |
| --- | --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Required unless mock mode is introduced | Required | Required | Public project URL |
| `VITE_SUPABASE_ANON_KEY` | Required unless mock mode is introduced | Required | Required | Public anon key protected by RLS |

The Supabase `service_role` key must never be placed in a `VITE_*` variable, browser code,
Cloudflare Pages public build variables, test fixture, commit, or documentation example.

Local values belong in `frontend/.env`. Production values belong in the client-owned
Cloudflare Pages environment-variable configuration.

## Verification commands

Run from `frontend/`:

```bash
npm ci
npm run lint
npm run format:check
npm run test
npm run build
npm run audit
npx playwright install chromium
npm run test:e2e
```
