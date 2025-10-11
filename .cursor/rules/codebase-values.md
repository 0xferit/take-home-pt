---
name: Codebase Values – Simplicity, Auditability, Maintainability, Usability, Consistency
description: Decision-making guide for changes. Prefer simple, auditable, maintainable, usable, and consistent solutions.
globs:
  - "**/*"
---

Product objective
+- This website helps self-employed professionals in Portugal optimally plan their tax and business setups to maximize take-home amounts.
+- Every feature, calculation, and UI decision should serve this goal: enabling informed, optimal financial planning.
+- Prioritize accuracy, transparency, and usability for financial decision-making.

Our priorities (in order when trade‑offs arise)
1) Simplicity
- Minimize moving parts. Prefer plain HTML/CSS/vanilla JS over frameworks.
- Remove options and branches that don't materially change outcomes (e.g., assume high‑value when in simplified mode).
- Keep functions small and pure; avoid side effects.
- **DRY (Don't Repeat Yourself):** Extract shared logic/styles/patterns. Use cascading CSS, utility tokens, and shared functions instead of duplicating code.

2) Auditability
- Keep all tax constants and calculations in `logic.js` (pure, UI‑agnostic). No hidden logic in HTML/CSS.
- Prefer explicit, named constants with year context (e.g., 2025). Link to sources in the UI sources section.
- Show intermediate calculation steps in Results to allow manual verification.

3) Maintainability
- Follow SMACSS for CSS organization; keep low specificity.
- Keep UI glue in `app.js` limited to formatting and DOM writes; no business rules.
- Use clear names and consistent patterns (e.g., is-* states, tab-shell layout).
- Use Conventional Commits, one logical change per commit, and push after every change.

4) Usability
- Default to the most common/decisive path (e.g., a single activity assumption if that’s the chosen mode).
- Keep copy short, precise, and legally cautious. Avoid ambiguous terms.
- Avoid layout jitter; keep tab layouts consistent. Reuse components and helper text styles.
- Validate inputs early; prefer informative hints over silent failures.

5) Consistency
- Keep components, copy, and interactions uniform across tabs (same order, same wording, same styles).
- Reuse the master tab layout (`tab-shell`), helper text styles, and button/toggle patterns.
- Persist selected states clearly; avoid re-ordering or relabeling options between screens.
- Align typography, spacing, and iconography; avoid one-off variations.

Change acceptance criteria
- Simplicity: Does this reduce code or cognitive load without harming clarity? Does it avoid duplication (DRY)?
- Auditability: Are formulas/constants in `logic.js`, with parameters and outputs easy to inspect?
- Maintainability: Does it follow our CSS/JS rules and naming, and reduce coupling?
- Usability: Is the UI consistent, predictable, and clear under typical scenarios?
- Consistency: Does it keep layout/components/copy patterns uniform across tabs and states?

DRY enforcement examples
- CSS: Use cascading (`[class*="card"]` for all cards), attribute selectors, utility tokens instead of repeating properties.
- JS: Extract shared formatting/validation into helper functions; avoid copy-pasting logic between compute* functions.
- HTML: Reuse the same tab-shell layout structure, card/form-section wrappers, and copy patterns across tabs.

Examples of preferred approaches
- Adding a tax change: Update constants and pure functions in `logic.js`, adjust copy, and cite sources.
- UI adjustment: Update CSS module or layout, keep styles consistent with tab-shell, avoid inline styles.
- New option: Only add if it changes outcomes materially and doesn’t bloat the UI; otherwise, document assumptions.


