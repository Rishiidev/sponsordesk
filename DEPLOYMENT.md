# Deployment — SponsorDesk Waitlist

## Status: ✅ Code deployed, ⚠️ need 1 dashboard click to make it public

The site is **deployed to Vercel** but currently behind "Vercel Authentication" (Vercel's default for new projects). One click in the dashboard fixes it.

## URLs

- **Live URL (currently behind auth):** https://sponsordesk-waitlist-7mfrcae6w-rishiidevs-projects.vercel.app
- **Project dashboard:** https://vercel.com/dashboard/rishiidevs-projects/sponsordesk-waitlist
- **Deployment protection settings:** https://vercel.com/dashboard/rishiidevs-projects/sponsordesk-waitlist/settings/deployment-protection

## To make it public (1 minute)

1. Open: https://vercel.com/dashboard/rishiidevs-projects/sponsordesk-waitlist/settings/deployment-protection
2. Find the **"Vercel Authentication"** section
3. **Toggle it OFF** (or set it to "Standard Protection" → off)
4. Save — takes effect on next request, no redeploy needed
5. Reload https://sponsordesk-waitlist-7mfrcae6w-rishiidevs-projects.vercel.app — should now load publicly

## Alternative (works from CLI)

If you'd rather keep protection on for previews but expose the production deploy publicly:

1. In the same settings page, change **"Vercel Authentication"** from "All Deployments" to **"Only Preview Deployments"**
2. Production stays public, previews stay protected

## After it's public

Test the full flow:

```bash
curl -X POST https://sponsordesk-waitlist-7mfrcae6w-rishiidevs-projects.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","followers":"200K - 500K","dealVolume":"4 - 10 / month","currentTool":"Notion","pain":"Testing live deploy","utm_source":"verification"}'
```

Expected response: `{"ok":true}` (dev mode, no Resend key set yet) — the payload will appear in the Vercel function logs.

## Add real email (optional, ~5 min)

If you want signups to actually send welcome emails:

1. Sign up at https://resend.com (free tier = 100 emails/day, no card)
2. Verify a domain you control (or use the `onresend.com` default for testing)
3. Create an Audience, copy its ID
4. In Vercel dashboard → Project → Settings → Environment Variables, add:
   - `RESEND_API_KEY` = your Resend API key
   - `RESEND_AUDIENCE_ID` = your audience ID
   - `NOTIFY_FROM` = `SponsorDesk <hello@yourdomain.com>`
   - `NOTIFY_TO` = your email
5. Redeploy (or wait — Vercel auto-redeploys on env var change)

## Use a custom domain (optional, ~10 min)

Once you buy `sponsordesk.io` on Cloudflare Registrar (~$10/yr):

1. Vercel → Project → Settings → Domains
2. Add `sponsordesk.io` and `www.sponsordesk.io`
3. Vercel gives you DNS records to add in Cloudflare
4. SSL cert auto-provisions within ~60 seconds

That's it. The site is otherwise ready to share.

## Tech notes

- **Build size:** 45kB page, 150kB First Load JS
- **Stack:** Next.js 15.1.12, Tailwind v4, Motion, Resend
- **Region:** Vercel default (auto-routed)
- **Costs:** $0/mo on Vercel free tier (100GB bandwidth, plenty for a waitlist)