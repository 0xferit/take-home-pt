# Repository Instructions

## Core Boundary

- Presentation and business logic must stay separate.
- This repository will be shared with a designer who must not need access to tax logic or calculation rules.
- Do not intertwine formulas, tax rules, legal thresholds, or business decisions into presentation files.

## File Ownership

- Presentation layer:
  - `index.html`
  - `styles.css`
  - `app.js`
- Business logic and source data:
  - `logic.js`
  - `data.js`

## Required Rules

- Keep `app.js` focused on DOM state, interaction wiring, formatting, and rendering.
- Keep all tax calculations, thresholds, coefficients, eligibility rules, and scenario computation in `logic.js`.
- Keep static rate tables, legal constants, activity-code mappings, and defaults in `data.js`.
- If a new UI feature needs derived values, expose them from the logic/data layer instead of recreating them in the UI layer.
- Do not add inline `<script>` tags or inline calculation logic in `index.html`.
- Do not encode tax/business rules in CSS, HTML copy conditionals, or data attributes when they belong in `logic.js` or `data.js`.

## Collaboration Intent

- A designer should be able to work safely in the presentation layer without touching confidential or sensitive business logic.
- When in doubt, move logic down into `logic.js`/`data.js` and keep the UI as a thin rendering layer.
