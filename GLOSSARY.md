# SLSM glossary: symbols and terms

The reference for every SLSM site, document and line of code (founder's decision, 13 Nov 2026). It matches the
glossary of the book *De Lege et Amore* (manuscript, November 2026). The same file is in each repository:
`EUlawscanner`, `CorporateScanner`, `1love.works`, `claim-compass-eu`.

**λ is reserved for the ratio E/M.** The € estimate is the unexpressed value V_u, gross and net. Figures do not change.

| Symbol | Meaning |
| --- | --- |
| λ | Configuration ratio E/M (no unit): how much of a system is realised for every unit still waiting to be realised |
| η | Share realised, E/(E+M) = λ/(1+λ), 0 to 1 |
| E, M | Energy (green); mass (yellow, red) |
| S, ΣS | Entropy (submerged information); ΣS = sum of the entropy scores over all counted scans (`entropy_score`) |
| V_u | Unexpressed value in €, **gross**; net = **V_u × 0.77** (after the costs of realising it). Not the same as λ: λ is a ratio, V_u an amount |
| W_L | Legal weight (`legal_weight`): the burden a body of law places on those subject to it |
| p | Probability that a claim succeeds (older texts used λ for this) |
| η*, g | Rule of Love target; gap g = η* − η |

On the sites (from 14 Nov 2026): "Unexpressed value, gross (V_u)" and "Unexpressed value, net (V_u × 0.77)";
IT "Valore inespresso, lordo / netto", FR "Valeur non exprimée, brute / nette", ES "Valor no expresado, bruto / neto".
Older wording, now replaced: "gross λ", "λ Net Unexpressed Potential", "λ NUP" (NUP = Net Unexpressed Potential).

## Names in the database, the API and the code (not renamed)

Renaming belongs to the phase-2 versioned API. Until then, read the names like this:

| Name | Where | Glossary meaning |
| --- | --- | --- |
| `entropy_score` | tables `scans`, `scan_history`, `procurement_scan_results` | S of one scan (0–100) |
| `total_entropy` | `/api/stats` | ΣS: EU Law Meter scans + Corporate scans saved before 7 Aug 2026; Opus 5.5 scores × 0.85 (`lib/calibration.ts`) |
| `implied_value` | `/api/stats` | PNC indicative measure = €99 × (1 + ΣS / 1,000), rounded to the euro. Not a price |
| `calibration_factor` (1,000) | `/api/stats` | the divisor in that formula, **not** the ΣS calibration × 0.85 |
| `eu27_total_value` (€5.2T) | `/api/stats` | V_u net, EU-27 |
| `value_identified`, `pct_identified` | `/api/stats` | ΣS ÷ S_MAX × €5.2T, and that share in % |
| `legal_weight` / `legal_weight_score` | table `scans` / Corporate Meter | W_L (score 0–100) |
| `lambda_div` | table `scans` (Corporate) | "λ-divergence": investability score − market percentile; **not** λ = E/M |
| `lambda_estimate_eur_m` | table `territory_claims`, view `territory_claims_public` | V_u in € million (gross or net not recorded; no code writes it today) |
| `success_pct`, `success_probability_pct` | table `claims`; EU Law Meter scan result | p × 100 |
| `tot`, `p1`, `p2`, `p3`, `net` | Codification script rows (`1love.works/codification`) | V_u gross; its three pillars (53 / 28 / 19 %); V_u net = gross × 0.77 |
| `nup` | Codification single-comune page (`comune.html`) | V_u **gross** (despite the name) |
| `lambda` | Codification `window._COMUNI` | entropy ÷ 100, **not** λ = E/M |

Codification pillars: P1 Real Estate (Immobiliare), P2 Renewable Energy (Energia rinnovabile), P3 Local Value Chain
(Filiera locale).

## Rule for future conflicts

1. This file is the reference. Check every new term, symbol or label against it before it goes on a site, in a
   document or in code.
2. If something conflicts, record it in `EUlawscanner/docs/APPROVALS.md` (and `~/Projects/SLSM/APPROVALS.md`) and ask
   the founder before changing anything.
3. The published articles (JLMI 2/2025; GCLR 1/25, 1/26, 4/26) prevail over site text unless the founder decides
   otherwise.

Open questions, not yet decided (issue 31 inventory, `SLSM-issue31-inventory.md`): λ used on the sites for claim
probability, for applicable law, for entropy (λS) and for legal weight (λW); the formulas S = k·log W(λ), W = MG(λ)
and π = λ(R − C), which the book writes differently or does not use.
