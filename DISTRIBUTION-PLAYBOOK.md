# SponsorDesk — 7-Day Distribution Playbook

> Goal: **100 qualified waitlist signups by day 14.**
> Channels in priority order: r/PartneredYoutube → HN Show HN → X (Twitter indie makers) → r/CreatorsAdvice → r/SideProject → r/EntrepreneurRideAlong → niche newsletters.

## Pre-launch checklist (do these BEFORE posting anything)

- [ ] Buy `sponsordesk.io` on Cloudflare Registrar (~$10/yr) — done if you did this step
- [ ] Deploy to Vercel, set DNS, add env vars: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `NOTIFY_FROM`, `NOTIFY_TO`
- [ ] Submit a real signup from your phone → confirm Resend delivers welcome + you get notification
- [ ] Add Plausible (free 30-day trial) or Umami self-host for traffic source attribution
- [ ] Create UTM links for every channel so you can see which converts:
  - `?utm_source=reddit&utm_medium=r-partneredyoutube&utm_campaign=launch-d1`
  - `?utm_source=hn&utm_medium=show-hn&utm_campaign=launch-d2`
  - etc.
- [ ] Pre-write a personal "build log" post on X so your link bio has somewhere to point

## Posting rules

1. **Never spam your own URL.** Every post must teach something specific or solve a real question, with the link as context, not as the headline.
2. **Engage genuinely with comments for the first 2 hours after posting.** Reddit kills posts where the OP disappears.
3. **Cap yourself at 2 high-effort posts per day across all channels.** Below the spam threshold = better reception.
4. **One link in the body, not in the title.** Reddit auto-shadowbans posts with links in titles on most subreddits.
5. **Track every signup with UTM.** A signup with `utm_source=reddit` is 10x more valuable than one without.

---

## Day 1 — r/PartneredYoutube (highest-intent subreddit)

**Subreddit:** r/PartneredYoutube (~50K subs, creators actively monetizing)
**Best time to post:** Tue/Wed/Thu, 8–10am ET (US creator peak)
**Format:** "I built" / problem-validation post — DO NOT pitch directly

### Post variant A (Problem-led)

> **Title:** "How do you actually track brand deals? Spreadsheets are killing me."
>
> Body:
>
> I'm a mid-tier creator (~210K subs across YT + newsletter) and I lose track of brand deals constantly. Right now I track them in a Notion database with columns for status, follow-up dates, contract links, deliverable checklists, and payment terms. It works for about a week, then I forget to open it and a deal goes stale.
>
> I've tried:
> - A spreadsheet (Google Sheets). Failed at follow-up reminders.
> - Trello. Failed at storing contract docs and tracking usage rights windows.
> - A dedicated CRM (Pipedrive). Built for sales reps, not creators. Way too much friction.
> - Notion templates I downloaded. Same problem as my own Notion — they don't run in the background.
>
> So I'm building something purpose-built for solo creators with 10K–500K followers who actually close deals. Pipeline kanban, contract storage, deliverable checklists, follow-up reminders that fire even when you don't open the app, and invoicing.
>
> Waitlist is up at [sponsordesk.io] if you want to lock in $9/mo founder pricing. Honest ask: I'd love feedback on whether this is a real problem or just me. If you've solved it, I'd genuinely like to hear how.
>
> (Mods, this isn't a launch announcement — I'm asking about the workflow problem first, sharing the tool second.)

### Post variant B (Question-only, no link)

> **Title:** "Mid-tier creators: how are you tracking brand deals and not losing them?"
>
> Just text. NO link in the post.
>
> 200K+ subs here, 4–8 brand deals a month. My current system is a Notion database that I open maybe twice a week and follow-ups slip. I want to know if this is a universal problem or just me being bad at follow-up.
>
> - What do you use today?
> - What's the part that breaks?
> - What would you pay to fix it?
>
> I'll synthesize the top answers in a follow-up comment and link the tool I'm building for it if there's interest.

### What to expect
- 30–150 upvotes, 15–40 comments
- 20–60 signups via `utm_source=reddit`
- 5–10 useful pain-point comments to mine for v2 features

---

## Day 2 — Hacker News Show HN

**Best time:** Tuesday or Wednesday, 8–9am ET (peak HN traffic)
**Format:** "Show HN: [name] – [one-line description]"

### Post

> **Title:** Show HN: SponsorDesk – A CRM for individual creators tracking brand deals
>
> Hi HN. I've been working on SponsorDesk for the past 6 weeks — a lightweight CRM for individual creators (10K–500K followers) who actually close brand deals. Not for brands running influencer campaigns (GRIN, CreatorIQ own that), not for talent agencies (July owns that), but for the solo creator with 4–10 active deals at any given time.
>
> I built it because I was the user. I was tracking my own deals in a Notion database that quietly failed at follow-up reminders, and I lost a $4K deal because I forgot to reply for 11 days.
>
> Features shipping in the next 6–10 weeks:
> - Pipeline kanban (inbound → negotiating → live → paid)
> - Per-deal contract + usage-rights storage
> - Auto-reminders 3/7/14 days after a brand goes quiet
> - Deliverable checklists per deal
> - Stripe-powered invoicing with net-15 chasing
> - AI follow-up drafts (if and only if you ask for them)
>
> Stack: Next.js 15, Postgres, Resend for transactional email. Solo-built.
>
> Waitlist + founder pricing ($9/mo for life) is at https://sponsordesk.io. Looking for the first 200 creators who'd tell me what's broken.
>
> Happy to answer technical questions or talk through the founder economics. I have a day job and I'm funding this myself, so no growth hacks.

### What to expect
- 30–200 points, 20–80 comments
- 10–30 signups (HN converts less but signals are strong)
- 3–5 high-quality technical critiques to address

---

## Day 3 — X / Twitter (indie maker community)

**Format:** Build-in-public thread

### Thread (5 posts)

> **1/6** Building a CRM for creators because I was the user.
>
> 200K+ subs across YT + newsletter. 4–8 brand deals/month. I lost a $4K deal last month because I forgot to follow up for 11 days.
>
> My system was a Notion database that I opened twice a week. It failed quietly. That's the worst kind of failure.
>
> **2/6** The market is polarized:
> - GRIN / CreatorIQ = $478+/mo, built for brands running campaigns
> - July = $50+/mo, built for agencies managing rosters
> - Notion templates = free, fail at follow-ups
>
> The solo creator with 10K–500K followers is in a dead zone. That's the wedge.
>
> **3/6** So I'm building SponsorDesk:
> - Pipeline kanban
> - Per-deal contract + usage-rights storage
> - Auto-reminders at 3 / 7 / 14 days
> - Deliverable checklists
> - Stripe invoicing
>
> Solo, in public, from a day job. No funding.
>
> **4/6** What I've shipped so far:
> - Waitlist landing page (today)
> - ICP validation (multiple Reddit threads asking for this exact thing)
> - Resend integration for email capture
> - Founder pricing locked in: $9/mo for life for the first 200
>
> Next 2 weeks: schema design + auth. Will write about each in public.
>
> **5/6** Honest ask: if you're a creator with 50K+ subs and you've ever lost a deal to a follow-up you forgot, I want to talk to you. 20 min, your experience, no pitch. Reply or DM.
>
> **6/6** Waitlist (if interested): https://sponsordesk.io
>
> Founder pricing locked for the first 200. Will charge more at public launch. Build log at @yourhandle.

### What to expect
- 500–3K impressions, 30–100 engagements
- 5–15 signups
- 2–4 useful DM conversations with creators in your ICP

---

## Day 4 — r/CreatorsAdvice (advice-focused subreddit)

**Format:** Question / advice post with the tool as a "I'm trying this, what would you change?"

### Post

> **Title:** "Tracking brand deals across email, DMs, and Slack — what works for you?"
>
> Quick context: 150K subs, 6 brand deals/month across YouTube + a newsletter. I've been losing 1–2 deals a month to follow-ups I forget.
>
> I've tried:
> - Notion database (forgot to check it)
> - Google Calendar with reminder events (cluttered fast)
> - Spreadsheet on my desktop (same problem)
> - A SaaS designed for sales teams (Pipedrive — way too much friction for creator work)
>
> I started building a Notion-styled kanban for just my brand deals, with auto-reminders. If you're a creator struggling with the same thing, what would make it actually stick for you?
>
> [link to tool if I can share without looking spammy — mods, is this OK as a self-promo if it's framed as a question?]

---

## Day 5 — r/SideProject (the meta subreddit for builders)

**Format:** Build log / "I built this" with proof

### Post

> **Title:** "I built a CRM for creators. Here's what I learned validating the idea."
>
> Body:
>
> Quick backstory: I'm a solo developer with a day job. I was losing track of my own brand deals in a Notion database, and I assumed the issue was me being lazy. Then I found 4 separate Reddit threads where creators described the exact same problem, and one where a developer had started building something similar.
>
> So I built a waitlist landing page first. No code. Just a real spec, an email form, and a comparison table vs. GRIN / July / Notion templates.
>
> Numbers after 4 days:
> - [X] signups
> - [Y]% had > 50K followers
> - [Z]% were tracking deals in spreadsheets/Notion today
> - Top pain point in the free-text field: [paste 2–3 verbatim answers]
>
> Stack: Next.js 15, Postgres, Resend. Solo. ~6 weeks of evenings/weekends so far.
>
> Lessons:
> 1. Validate with a waitlist page BEFORE writing app code. It took me 2 days and answered 5 questions that would have taken 5 months to answer with code.
> 2. The "Notion template with extra steps" objection is the one I keep hearing. The answer is: follow-up reminders that fire whether or not you open the app.
> 3. People who self-select as "I forget follow-ups" are 10x more likely to pay than people who don't.
>
> Next: shipping the actual CRM in the next 6–10 weeks. Waitlist + founder pricing at https://sponsordesk.io if you want to follow along.

---

## Day 6 — Niche creator newsletters + communities

**Targets (cold email each, 50–100 words max):**
- The Publish Press (newsletter for newsletter creators)
- Creator Economy NYC / Creator Economy London (Slack communities)
- TubeFilter newsletter
- Karol Gadja's creator economy digest
- Beehiiv's creator resource list

**Email template:**

> Subject: Built something for the creators in your audience — quick look?
>
> Hi [name],
>
> Quick context: I built a CRM for individual creators with 10K–500K followers who actually close brand deals. It's purpose-built for solo creators (not the GRIN / July agency tier), and the waitlist just crossed [X] in the first week.
>
> Would you be open to a one-line mention in your next [newsletter / community digest] if it fits your editorial? Happy to give your readers a $5/mo discount code on founder pricing for life.
>
> No pressure either way.
>
> [your name]
> https://sponsordesk.io

**Expected response rate:** 5–15% (2–4 mentions out of 20–30 sends)
**Expected signups:** 10–50 per accepted mention

---

## Day 7 — Paid test (only if organic is working)

**Channel:** Reddit Ads (NOT boosted posts) targeting r/PartneredYoutube + r/CreatorsAdvice
**Budget:** $100
**Creative:** Your post variant A from Day 1, with a clear "Get on the waitlist" CTA button
**Expected:** 500–1,500 clicks, 50–150 signups at $0.65–$2.00 per signup

**Only do this if your organic Day 1–3 signups are converting at >5%.** Otherwise fix the page first.

---

## Success metrics

| Day | Target signups | Target channel attribution |
|---|---|---|
| 1 | 5–15 | r/PartneredYoutube |
| 2 | +5–10 | HN Show HN |
| 3 | +5–10 | X thread |
| 4 | +10–25 | r/CreatorsAdvice |
| 5 | +10–25 | r/SideProject |
| 6 | +10–50 | Newsletter mentions |
| 7 | +20–50 (if running ads) | Reddit Ads |
| **Day 14** | **100–200 total** | — |

**Conversion rate benchmarks:**
- 3–5% visitor → signup = solid demand signal
- 5–10% = strong demand signal (this is your ICP)
- >10% = either very strong ICP match or low traffic volume (false positive — get more traffic before trusting it)
- <2% = the page or the ICP is wrong — talk to the people who bounced, not the people who converted

**After 100 signups:** Email them all personally. Ask which 1 thing they'd cut and which 1 thing they'd add. That feedback becomes your MVP scope.

---

## Things to NOT do

- Don't post the link to r/SaaS, r/startups, r/Entrepreneur — wrong audience (founders, not creators)
- Don't post on LinkedIn cold — creator founders aren't there, brand marketers are
- Don't pitch journalists until you have >200 signups and a clear story arc
- Don't pay for Twitter / X ads — indie creator community is organic on X, paid reach goes to B2B SaaS buyers
- Don't run Product Hunt until you have >100 signups AND a working MVP (a waitlist-only PH launch signals you can't ship)

---

## Appendix: useful tooling for tracking

| Need | Tool | Why |
|---|---|---|
| Traffic attribution | Plausible (free 30-day) or Umami self-host | Cookie-light, GDPR-clean, source breakdown |
| Email capture | Resend | Already wired in. Free tier = 100/day |
| Lead database | Resend Audiences | Auto-tagged by deal volume via the API route |
| Waitlist dashboard | Airtable / Notion | Sync Resend audience → Airtable for ICP segmentation |
| Personal CRM | Folk CRM or Clay | Track 10–20 founders/creators you're personally following up with |

End of playbook. Ship the page, then ship the posts. The validation is the experiment.