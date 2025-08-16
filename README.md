# Romain Stride — Portfolio

- Next.js 15 App Router + Tailwind v4 + TypeScript
- Dark mode default, light toggle via `localStorage`
- Animations: Framer Motion

Useful:
- Health check: `/health` → 200 ok
- Contact endpoint: `POST /contact` (logs payload server-side)
- Sitemap/robots generated from `NEXT_PUBLIC_SITE_URL`

Run locally:

```bash
npm ci
npm run dev
```

Docker (multi-stage) is available via `Dockerfile`.
