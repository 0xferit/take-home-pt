---
name: Website Copy – Legal‑grade Precision
description: All user‑facing text must be precise, correct to the letter, non‑misleading, and legally cautious.
globs:
  - "**/*.html"
  - "**/*.md"
  - "**/*.js"
---

Scope
- Applies to user‑visible text (headings, labels, tooltips, help text, notes, disclaimers, tab copy) embedded in HTML/JS/MD.
- Coordinates with Tax Text Verification rule for any statements about Portuguese tax law.

Standards
- Precision: Use exact terms, include the applicable year (e.g., 2025) when stating rates/thresholds.
- Legal terminology: Prefer Article 151 (CIRS) for coefficients; refer to IFICI/NHR 2.0 explicitly when discussing 20% regimes.
- Conditions and scope: State eligibility conditions; avoid implying universal applicability. Clarify when examples are indicative.
- No speculation: Avoid vague language, marketing claims, or promises. No “likely”, “should”, “typically” unless backed by a source.
- Non‑misleading: Do not conflate concepts (e.g., coefficients vs rates; Category A vs B). Distinguish taxable base vs cash cost.
- Consistency: Keep wording, capitalization, and iconography consistent across tabs; reuse shared copy patterns.

Required checks before commit
1) Readability: Short, unambiguous sentences. Prefer lists for conditions.
2) Accuracy: If text references tax rules/thresholds, follow the Tax Text Verification rule and update Sources.
3) Terminology: Verify we’re not mixing terms (e.g., “Annex II” vs Article 151). Prefer the canonical term.
4) Scope note: If a statement can be misread as universal, add a brief qualifier (e.g., “if eligible”, “Category B only”).
5) UI alignment: Ensure identical components use the same helper text and tooltip style.

Prohibited
- Outdated references (e.g., legacy NHR without year/context).
- Absolute or promotional language (“guarantees”, “best”, “always”) for tax outcomes.
- Hidden assumptions; if an assumption exists, disclose succinctly or remove the claim.

Commit guidance
- Use Conventional Commits with scope `docs(copy)` for text‑only changes.
- If a change includes both copy and behavior, split into separate commits where feasible.

Examples
- Good: “IFICI/NHR 2.0 (20%) applies only if you meet program criteria; otherwise progressive rates apply.”
- Good: “Article 151 (CIRS) activities use a 0.75 coefficient; other services use 0.35.”
- Avoid: “Annex II unlocks 20% rate” (conflates concepts and may be outdated).


