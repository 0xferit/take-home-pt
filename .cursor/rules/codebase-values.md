---
name: Codebase Values – Simplicity, Auditability, Maintainability, Usability
description: Decision-making guide for changes. Prefer simple, auditable, maintainable, and usable solutions.
globs:
  - "**/*"
---

Our priorities (in order when trade‑offs arise)
1) Simplicity
- Minimize moving parts. Prefer plain HTML/CSS/vanilla JS over frameworks.
- Remove options and branches that don’t materially change outcomes (e.g., assume high‑value when in simplified mode).
- Keep functions small and pure; avoid side effects.

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

Change acceptance criteria
- Simplicity: Does this reduce code or cognitive load without harming clarity?
- Auditability: Are formulas/constants in `logic.js`, with parameters and outputs easy to inspect?
- Maintainability: Does it follow our CSS/JS rules and naming, and reduce coupling?
- Usability: Is the UI consistent, predictable, and clear under typical scenarios?

Examples of preferred approaches
- Adding a tax change: Update constants and pure functions in `logic.js`, adjust copy, and cite sources.
- UI adjustment: Update CSS module or layout, keep styles consistent with tab-shell, avoid inline styles.
- New option: Only add if it changes outcomes materially and doesn’t bloat the UI; otherwise, document assumptions.


