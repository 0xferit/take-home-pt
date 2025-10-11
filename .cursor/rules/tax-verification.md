---
name: Tax Text Verification (Portugal)
description: Before changing any text that describes Portuguese tax laws/rules, perform a web search and verify accuracy with reputable sources.
globs:
  - "**/*.html"
  - "**/*.md"
  - "**/*.js"
---

Scope
- Applies to edits that describe Portuguese tax rules, including: IRS brackets/rates, simplified regime coefficients (0.75/0.35), Article 151 references, IFICI/NHR rules, Social Security (rates, IAS, caps, factors), solidarity tax, minimum wage, VAT thresholds/rules, deductions (e.g., personal allowance), and first‑year benefits.

Verification workflow
1) Identify statements that assert tax rules, thresholds, rates, eligibility, or legal references.
2) Run a web search to confirm with up‑to‑date sources (prefer 2024/2025+):
   - Autoridade Tributária e Aduaneira (AT), Governo, Diário da República / legislação
   - PwC Portugal Tax Guide, EY Portugal State Budget summaries, KPMG, Deloitte
   - Other reputable legal/tax advisories with dated pages
3) Cross‑check at least two reputable sources when possible; ensure dates and context (PIT vs CIT; Category B vs A) match the statement.
4) Update copy precisely and concisely; avoid ambiguous or outdated terms (e.g., use “Article 151” instead of “Annex II” for coefficients; refer to IFICI/NHR 2.0 explicitly).
5) Add or update links in the “Disclaimers & Sources” section to reflect any new claims added to the UI.

Rules for implementation
- Do not embed business logic in HTML/CSS; keep rules in logic modules. This rule applies to text descriptions, tooltips, labels, and docs.
- Keep wording short and reproducible; avoid speculation. If uncertain after search, prefer omitting the claim or adding a clarifying note.
- Prefer numeric values that can be traced to sources (e.g., tax bands, IAS) and include the year context (2025).

Commit guidance
- Use Conventional Commits, e.g.,
  - docs(copy): clarify Article 151 coefficients (0.75/0.35) with sources
  - docs(copy): update IFICI/NHR 2.0 eligibility note (2025)
- Push immediately after committing (see commit policy rule).


