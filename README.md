# 1love.works — SLSM hub, dashboard, Codification and PNC pages

Part of **SLSM — Sustainable Legal Systems Meter** (overview, working rules and the history of every change: the
`EUlawscanner` repository, `CLAUDE.md` and `docs/`). Every output is a measurement, not legal advice.

## Stack and hosting
Static HTML + vanilla JavaScript, one serverless function. Vercel project `1love-works` (domain 1love.works,
redirects to www). `vercel.json`: `cleanUrls` (pages are served without `.html`). **A push to `main` goes live.**

## Pages
| Path | What it is | Data source |
| --- | --- | --- |
| `/` | Hub and the conversational Meter | `/api/meter` (below); ΣS from `eulawscanner.eu/api/stats` |
| `/dashboard` | ΣS and PNC implied value over time | `eulawscanner.eu/api/stats` |
| `/pnc` | PNC holder page, email-code login | `eulawscanner.eu/api/pnc/*`, `/api/stats` |
| `/participate` | Participation form | inserts unpaid rows into `love_submissions` (the only public write in the database) |
| `/codification` (+ `/codification/simulation`, `/codification/comune`) | Codification of territories: λ values for 377 Sardinian comuni and EU-27 country data | Data in `codification/data/*.js` and inline; computed in the page (fixed rule, issue 8) |
| `/codification/masullas` | The Masullas internal market | static |
| `/codification/start-a-market` | Start a market | static; where to link it is parked by the founder |
| `/methodology`, `/criticisms`, `/problem`, `/solutions`, `/privacy` | Texts | static (EN/IT/FR/ES on some pages) |

The Codification subscription is a Stripe Payment Link (business "1love.works"), with no webhook; see
`EUlawscanner/docs/SLSM-technical-update-issue17.md`.

## Server function
`api/meter.js` — the conversational Meter. Fixed system prompt, model `claude-haiku-4-5-20251001`, 300 output tokens;
needs `ANTHROPIC_API_KEY` (Vercel, Sensitive; this site's own Claude Console key `1loveworks-meter-prod-2026-11`, renewed 12 Nov 2026). It reads only the first block of the AI's answer, which must be
adapted before switching to a newer model (task 11).

## Change and check
No build step and no tests: edit, push to a branch, check the Vercel preview, then merge. Figures quoted in texts
must match what the pages compute (issues 8, 19).
