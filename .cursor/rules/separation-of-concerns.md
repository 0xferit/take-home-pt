---
name: Separation of Concerns (Logic vs Presentation)
description: Keep business logic in JS modules and presentation in HTML/CSS. UI glue only orchestrates.
globs:
  - "**/*.js"
  - "**/*.ts"
  - "**/*.html"
  - "**/*.css"
---

Principles
- Business logic lives in dedicated JS modules (here: logic.js). It must be UI-agnostic, pure, and testable.
- Presentation lives in HTML/CSS. No computation, tax constants, or app state in HTML/CSS.
- UI glue (here: app.js) only wires DOM events to logic, formats values, and updates the DOM. No business rules.

JS structure
- logic.js (business domain)
  - Define constants (e.g., TAX_DATA), calculation functions, and return structured results.
  - No DOM access or CSS class manipulation.
  - Expose a small public API (window.TakeHomeLogic = { ... }) with pure functions only.
- app.js (UI glue)
  - Read inputs from the DOM, assemble a typed input object, call TakeHomeLogic.* functions.
  - Format numbers/percentages and write results back to the DOM.
  - Toggle classes for state (e.g., is-active), but do not compute business outcomes inside app.js.
  - Do not duplicate constants from TAX_DATA; read from logic when needed.

HTML
- Semantic structure only. No inline styles or inline event handlers (no onclick, oninput, etc.).
- Use data-* attributes and class names for hooks. JS should attach listeners via query selectors.
- Avoid embedding computed values; render via app.js from logic.js outputs.

CSS
- Styling only. Do not encode business logic or state branching in CSS beyond class-based states.
- Use existing tokens and SMACSS structure. Avoid IDs and high-specificity selectors.
- State changes are class toggles (e.g., .is-active); do not hardcode visibility rules that imply logic.

Data flow
1) DOM → app.js: collect/normalize inputs
2) app.js → logic.js: call pure functions with a plain object
3) logic.js → app.js: receive results object
4) app.js → DOM: render via textContent/attributes/classes

Migration guidance
- If you encounter calculations, thresholds, or tax rules in app.js or HTML, move them to logic.js.
- Expose a new pure function (or extend an existing one) instead of duplicating logic in app.js.
- Keep UI utilities in app.js limited to formatting and DOM updates.

Commits
- Use Conventional Commits with clear scopes:
  - feat(logic): new calculation function
  - fix(logic): correct tax bracket
  - refactor(ui): move computation from app.js to logic.js
  - style(css): presentation-only changes
  - docs(cursor): rule updates


