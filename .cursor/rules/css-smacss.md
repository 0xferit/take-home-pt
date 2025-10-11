---
name: CSS Organization (SMACSS)
description: Organize and edit CSS using SMACSS categories for scalable, maintainable styles.
globs:
  - "**/*.css"
  - "**/*.scss"
---

Follow SMACSS when creating or modifying CSS. Keep changes minimal, readable, and consistent with existing tokens and formatting.

1) Categories and file sections
- Base: Element selectors only (e.g., html, body, a, button). No classes. Normalize and defaults. Variables/tokens (:root) are allowed here.
- Layout: Major regions and structural wrappers. Prefix with l- (e.g., .l-header, .l-main, .l-sidebar, .l-footer) or use tab-shell names already present. Avoid component-specific styling.
- Module: Reusable components (e.g., .btn, .card, .form-control, .result-card, .tab, .chip). Keep modules self-contained and portable.
- State: Temporary UI states prefixed with is- (e.g., .is-active, .is-dimmed, .is-hidden). Only toggle appearance; do not define structure here.
- Theme: Color schemes/appearance applied to existing classes (e.g., [data-color-scheme="dark"]). Limit to color/visual tokens and overrides.

2) Naming conventions
- Layout classes: l-* (or existing tab-shell* wrappers). Example: .l-container, .l-grid.
- Modules: semantic component names (e.g., .result-card, .profile-card, .comparison-table). Optional BEM for internal parts (.component__part, .component--variant) if needed.
- States: is-* (e.g., .is-active, .is-dimmed, .is-error).
- Themes: .theme-* or data attributes (preferred here: [data-color-scheme]).
- Avoid IDs in selectors. Prefer classes. Keep selector specificity low.

3) Selector and nesting rules
- Prefer flat selectors. Keep nesting to 0–1 level (max 2 in exceptional cases). No deep descendant chains.
- Modules should not rely on outer context for layout. Avoid external margins for positioning modules; use spacing wrappers or utilities if needed.
- Do not mix categories in one rule. Example: Don’t set layout grid on a module; put grid on a layout wrapper.

4) Property ordering (within a rule)
- Group properties for consistency:
  a) Positioning/layout: position, inset/top/right/bottom/left, z-index, display, flex/grid props
  b) Box model: box-sizing, width/height, min/max-*, padding, margin, border, border-radius
  c) Typography: font-*, line-height, letter-spacing, text-*, white-space
  d) Visual: color, background, fill/stroke, outline, box-shadow, opacity
  e) Effects/animation: transform, transition, animation
  f) Misc/accessibility: cursor, pointer-events, user-select

5) Tokens and theming
- Reuse existing custom properties (e.g., --color-*, --space-*, --radius-*, --shadow-*) defined in :root and dark-mode blocks. Do not introduce near-duplicate tokens.
- Theme overrides belong under [data-color-scheme] or media prefers-color-scheme.

6) Media queries and responsive
- Co-locate responsive rules directly after the base rule when possible. Keep related styles together.
- Use existing breakpoints and patterns already present in styles.css for consistency.

7) Utilities and importance
- Avoid !important except in narrowly-scoped utilities or to fix known UA quirks.
- Prefer existing utility classes (e.g., .hidden, .mt-*, .grid helpers) before adding new ones. If adding, prefix with u- and keep single-purpose.

8) Documentation and comments
- Add short, high-signal comments only where intent isn’t obvious (rationale, non-obvious constraints). Avoid redundant comments.

9) Migration guidance (when refactoring)
- If moving styles, place Base first, then Layout, then Modules, States, and Theme sections. Keep each section grouped and ordered alphabetically where sensible.
- Do not change visual design or tokens while reorganizing unless explicitly requested.

References: SMACSS by Jonathan Snook (https://smacss.com/book/), comparison guides (https://css-tricks.com/methods-organize-css/).


