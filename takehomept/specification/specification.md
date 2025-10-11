## TakeHomePT Software Specification v1.1 (optimized for expat software engineers)

This specification defines a minimal, offline tool that helps expats in Portugal (especially in software/tech) compare two common setups for self‑employment tax optimization: Freelancer (Recibos Verdes, Regime Simplificado) vs Transparent LLC (Sociedade Unipessoal under fiscal transparency).

The core objective is to show a clear annual net, a monthly average, and a simple recommendation with a break‑even expense threshold between the two setups, while keeping the implementation extremely lean and reproducible by the user.

### 1) Core Principles
- Simplicity above all else
  - Max three files: `index.html`, `styles.css`, `app.js`
  - Vanilla JavaScript only (no frameworks, no build tools)
  - Plain CSS (no preprocessors)
  - No external assets; must work fully offline (no webfonts, CDNs, or APIs)
  - Total payload under 100 KB uncompressed

### 2) Target Persona and Scope
- Persona: Expat software engineers and similar tech professionals deciding between working as a self‑employed freelancer vs. creating a transparent single‑member LLC.
- In scope (Category B only):
  - Freelancer (Regime Simplificado)
  - Transparent LLC (Sociedade Unipessoal under fiscal transparency)
  - NHR 1.0 and NHR 2.0 (IFICI) where eligible, at 20% substitution rate
- Out of scope for v1.1 (explicitly):
  - Employees (Category A) and withholding tables
  - Solidarity surtax, regional adjustments (Azores/Madeira)
  - Marital filing status, joint assessment rules
  - VAT mechanics (23%/13%/6%), autonomous taxation (e.g., vehicles), detailed NHR eligibility vetting

### 3) Inputs (with defaults and validation)
All inputs are annual values unless noted. Provide sensible placeholders.
- Income
  - `grossIncome` (required, number ≥ 0)
  - `activityType` (enum): `services` (75%), `goods` (15%), `accommodation_food` (35%) — simplified coefficients
  - `nhrStatus` (enum): `standard`, `original_nhr`, `nhr_2_ifici`
- Personal
  - `hasDependents` (boolean)
  - `dependentsCount` (integer 0–10)
- Expenses
  - `businessExpenses` (object of numeric fields, sum used in calculations)
  - `adminCosts` (numeric, optional; accountant, bank, legal) — applied as cash expense in both setups
- First‑year toggles (optional)
  - `isFirstYearSSExempt` (boolean) — Social Security exemption in first 12 months
  - `isFirstYearIRS50pct` (boolean) — 50% IRS reduction in first year of activity (if applicable)
- Deductions to tax (deduções à coleta)
  - `healthExpenses` (number ≥ 0), rate 15%, cap €1,000
  - `educationExpenses`, `charitableDonations`, `retirementContributions` (numbers ≥ 0)

Validation rules:
- Expenses warning at 80% of gross; error state at 100% of gross
  - 80%: non‑blocking warning banner
  - 100% or more: error banner; disable recommendation and break‑even output
- Numerical inputs clamp to [0, +∞); integers clamp to [0, 10] for dependents
- Debounce recomputation on input (200 ms)

### 4) Data (2025 Portugal)
Represent constants in a single `TAX_DATA` object in `app.js` and include the source link in comments.
- Progressive IRS brackets (2025): array of `{min, max, rate}` entries
- Simplified coefficients: services 75%, goods 15%, accommodation/food 35%
- NHR substitution rate: 20% for eligible Category B activities
- Social Security (independent workers): 21.4% on 70% of relevant income
- Deductions to tax: health rate 15% capped at €1,000; dependent allowance €600 each; show 4,104 “personal allowance” for information only unless rules are updated

Notes:
- Keep a single source of truth by year; isolate in an easily updated object
- Round monetary results to cents at user‑visible steps

### 5) Calculations (deterministic and reproducible)
All monetary values are annual; “monthly” is annual/12 and labeled as an average.

5.1 Deductions to tax (deduções à coleta)
- `dependentAllowance = dependentsCount × €600`
- `healthDeduction = min(healthExpenses × 0.15, €1,000)`
- `deducoesAColeta = dependentAllowance + healthDeduction + educationExpenses + charitableDonations + retirementContributions`

5.2 IRS — gross tax before deductions
- Standard: apply progressive rates to `taxableBase`
- NHR (original or IFICI): 20% substitution rate on `taxableBase`
- `finalIRS = max(0, grossIRS − deducoesAColeta)`

5.3 Social Security (independent workers)
- Relevant income factor 70%
- `SS = (relevantIncome × 0.70) × 0.214`
- First‑year exemption: if `isFirstYearSSExempt`, then `SS = 0`

5.4 Setups
- Freelancer (Regime Simplificado)
  - `taxableBase = grossIncome × coefficient(activityType)`
  - `grossIRS = progressive(taxableBase)` or `0.20 × taxableBase` if NHR
  - `finalIRS = max(0, grossIRS − deducoesAColeta)`
  - `SS = (grossIncome × 0.70) × 0.214` (or 0 if first‑year exemption)
  - `netIncome = grossIncome − businessExpensesSum − adminCosts − finalIRS − SS` (expenses are cash out, not tax‑deductible in simplified)

- Transparent LLC (Fiscal Transparency)
  - `taxableBase = max(0, grossIncome − businessExpensesSum − adminCosts)` (both reduce base)
  - `grossIRS = progressive(taxableBase)` or `0.20 × taxableBase` if NHR
  - `finalIRS = max(0, grossIRS − deducoesAColeta)`
  - `SS = ((grossIncome − businessExpensesSum − adminCosts) × 0.70) × 0.214` (or 0 if first‑year exemption)
  - `netIncome = grossIncome − businessExpensesSum − adminCosts − finalIRS − SS`

5.5 Recommendation and break‑even
- Recommendation text determined by `netIncomeTransparent − netIncomeFreelancer` thresholds:
  - > €1,000: recommend Transparent LLC
  - < −€1,000: recommend Freelancer
  - Otherwise: neutral guidance
- Break‑even expenses: smallest annual `businessExpensesSum` where `netTransparent ≥ netFreelancer` at fixed inputs
  - Compute via binary search on `expenses` ∈ [0, grossIncome]; 40 iters or until €0.01 precision
  - If error state (expenses ≥ grossIncome), suppress result

### 6) UX and Output
- Tabs: Basic Info, Income, Expenses, Deductions, Results, Comparison
- Results (annual and monthly average): gross, taxable base, IRS, SS, net
- Comparison table: taxable base, IRS, SS, net for both setups + deltas with color cues
- Transparency: optional collapsible section showing bracket‑by‑bracket IRS computation
- Labels: monthly clearly marked “average monthly (annual/12)”
- Currency formatting: `Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' })`
- Accessibility: proper labels, focus states, color contrast, and `aria-live="polite"` for result updates

### 7) Architecture and Constraints
- Files:
  - `index.html` (markup)
  - `styles.css` (styles)
  - `logic.js` (pure domain logic; loaded before app.js, exposes `window.TakeHomeLogic`)
  - `app.js` (UI glue; consumes `window.TakeHomeLogic`)
- No external network requests; no cookies or telemetry
- Lightweight, readable code; functions are pure and small
- Keep business logic isolated in `logic.js`; `app.js` must not contain tax formulas

### 8) Performance and Size Budget
- Total ≤ 120 KB (allowance for 4th file); avoid images, fonts, and heavy gradients
- Fast input response with 200 ms debouncing
- No layout shift when results update

### 9) Validation and Error Handling
- Show inline warnings at 80% expense ratio; error banner at ≥ 100%
- Disable recommendation and break‑even when in error state
- Clamp invalid inputs; show helpful helper text on fields

### 10) Maintenance
- Single `TAX_DATA` object with year‑scoped constants
- Annual update checklist:
  - Update IRS brackets, SS parameters (rates/bases), NHR rules
  - Verify coefficients and deduction caps
  - Add a new `year` key if multi‑year support is added later

### 11) Success Criteria
- Produces correct, reproducible annual net and break‑even under the stated assumptions
- Works offline, no external assets; three files only; size ≤ 100 KB
- Clear recommendation and transparent breakdowns

### 12) Assumptions and Limitations (disclaimer)
- NHR application assumes eligibility and correct activity classification; transitional NHR rules are not modeled
- Solidarity surtax, regional adjustments, marital filing, and autonomous taxation are excluded in v1.1
- VAT treatment is out of scope; figures represent pre‑VAT net from income
- This is an educational estimator; not tax advice

---

Suggested sources to validate yearly data
- AT official IRS tables and Portaria for 2025
- Segurança Social guidance for independent workers (rates and relevant income)
- OCC (Ordem dos Contabilistas Certificados) resources on fiscal transparency
