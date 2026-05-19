# Romain Stride Portfolio

Personal portfolio and service site for Romain Stride, a freelance cybersecurity consultant. The app is built with Next.js and serves a bilingual French/English experience with service pages, technical write-ups, SEO metadata, RSS, sitemap generation, and a validated contact form.

## Features

- Bilingual routing: French at `/` and English under `/en`
- Portfolio pages for services, contact, privacy, and offensive security write-ups
- Markdown blog content with frontmatter, GitHub-flavored Markdown, heading slugs, and syntax highlighting
- SEO helpers for canonical URLs, hreflang alternates, Open Graph, Twitter cards, robots, sitemap, and RSS feed
- Contact API with locale-aware validation, honeypot spam handling, and SMTP delivery through Nodemailer
- Responsive navigation with mobile focus handling and language switching
- Standalone Next.js output and Docker production image
- Node test coverage for contact validation, service mapping, posts, and SEO behavior

## Tech Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4 and custom global styles
- Motion for page transitions
- Nodemailer for contact email delivery
- Unified, Remark, Rehype, Shiki, and Gray Matter for markdown rendering
- Node's built-in test runner via `tsx`

## Project Structure

```text
app/                    Next.js App Router routes, API route, sitemap, robots, RSS
components/             Shared UI components
features/contact/       Contact form, validation, and mail delivery
lib/                    Markdown, SEO, and utility helpers
content/blog/fr/        French markdown posts
content/blog/en/        English markdown posts
public/                 Static assets and Open Graph image
tests/                  Node test suite
```

## Getting Started

Prerequisites:

- Node.js 24 is recommended to match the Docker image
- npm

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Build and run the production app locally:

```bash
npm run build
npm run start
```

## Environment Variables

The site can run without email credentials, but submitting the contact form requires SMTP configuration.

Create `.env.local` with:

```bash
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_RSTRIDE=contact@rstride.fr
EMAIL_RSTRIDE_PASS=your-smtp-password
```

`EMAIL_PORT=465` enables a secure SMTP transport. Other ports use the standard non-secure transport expected by Nodemailer.

The contact route also attempts to load environment values from the parent directory, which is useful when running this portfolio inside a larger deployment workspace.

## Available Scripts

```bash
npm run dev      # Start Next.js in development mode using .next-dev
npm run build    # Build the standalone production app
npm run start    # Start the production server from .next
npm run lint     # Run ESLint on app, components, features, lib, and tests
npm run test     # Run the Node test suite
npm run clean    # Remove local Next.js build output
```

## Blog Content

Posts live in `content/blog/<locale>/<slug>.md`. Each localized post should use the same slug in `fr` and `en` so generated alternates, sitemap entries, and language switching remain consistent.

Use `content/blog/WRITEUP_TEMPLATE.md` as the starting point for new posts. Frontmatter is read by `lib/markdown.ts` and supports metadata such as:

- `title`, `excerpt`, `date`, `updated`
- `tags`, `category`, `severity`, `difficulty`
- `platform`, `target_os`, `icon`, `author`
- optional SEO overrides: `seoTitle`, `seoDescription`, `ogImage`, `ogImageAlt`

## Testing and Quality

Run the full local checks before shipping changes:

```bash
npm run lint
npm run test
npm run build
```

The current tests cover contact payload normalization and validation, service slug mapping, markdown post loading, and SEO output for sitemap, robots, privacy metadata, and blog fallback metadata.

## Docker

Build the production image:

```bash
docker build -t rstride-portfolio .
```

Run it locally:

```bash
docker run --rm -p 3000:3000 --env-file .env.local rstride-portfolio
```

The Dockerfile builds a standalone Next.js output and runs `server.js` as the non-root `node` user.

## Deployment Notes

- Canonical production URLs are defined in `lib/seo.ts` and currently point to `https://rstride.fr`.
- The sitemap excludes privacy pages and blocks `/api/` through `robots.ts`.
- Next.js `output: 'standalone'` is enabled for container deployments.
- The production server listens on `PORT=3000` and `HOSTNAME=0.0.0.0` in Docker.

## License

See [LICENSE](./LICENSE).
