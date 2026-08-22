# SponsorDesk — Waitlist Landing

Solo-built waitlist for [sponsordesk.io](https://sponsordesk.io). Next.js 15 + Tailwind v4 + Motion. Resend for email.

## Stack

- **Framework:** Next.js 15 App Router, RSC by default
- **Styling:** Tailwind v4 (`@tailwindcss/postcss`), one CSS variables theme in `src/app/globals.css`
- **Motion:** `motion/react`, isolated in client-leaf components, `prefers-reduced-motion` respected
- **Icons:** `@phosphor-icons/react`
- **Email:** Resend (audience + transactional)
- **No design system** — clean Tailwind utilities. Chosen for indie speed.

## Run

```bash
npm install
cp .env.example .env.local   # add RESEND_API_KEY + RESEND_AUDIENCE_ID
npm run dev
```

Without `RESEND_API_KEY`, the API route logs and returns 200 (dev mode).

## Deploy

Vercel. Import this repo, set the 4 env vars above, point `sponsordesk.io` DNS at Vercel (Cloudflare Registrar).

## File map

```
src/
  app/
    api/waitlist/route.ts     Resend: audience add + welcome + founder notify
    globals.css               Single theme — paper + ink + one orange accent
    layout.tsx                Geist + Geist Mono, OG meta
    page.tsx                  Hero / form / preview / quotes / features / compare / pricing / FAQ / CTA
  components/
    ComparisonTable.tsx       vs July / Notion / GRIN (mobile-collapse-aware)
    FAQ.tsx                   useReducer-driven accordion
    FeatureGrid.tsx           6-card grid with viewport-reveal stagger
    ProductPreview.tsx        Native-UI kanban preview (no fake screenshot)
    QuoteWall.tsx             Pulled from real creator-subreddit language
    WaitlistForm.tsx          Email + 4 qualifiers + success / error states
```