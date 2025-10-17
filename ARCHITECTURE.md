# TakeHomePT Architecture

**Last Updated:** 2025-10-17  
**Version:** 2025.1 (Post-Refactor)

## Overview

TakeHomePT follows a **strict separation of concerns** architecture with three distinct layers:

```
┌─────────────┐
│   data.js   │  ← Pure data (no logic, no UI)
└──────┬──────┘
       │ loads first
       ↓
┌─────────────┐
│  logic.js   │  ← Pure calculations (no data, no UI)
└──────┬──────┘
       │ loads second
       ↓
┌─────────────┐
│   app.js    │  ← UI presentation (no data, no calculations)
└─────────────┘
       │ loads last
       ↓
┌─────────────┐
│ index.html  │  ← Loads all scripts in correct order
└─────────────┘
```

## Layer Responsibilities

### 1. Data Layer (`data.js`)

**Purpose:** Centralized repository for all constants and configuration.

**Contains:**
- Tax rates and brackets
- Social security parameters
- Insurance market data
- Activity codes and profiles
- Admin costs
- Application defaults

**Does NOT contain:**
- Functions or calculations
- DOM manipulation
- Business logic

**Who can edit:**
- ✅ Tax experts (update rates)
- ✅ Domain experts (update codes)
- ✅ Compliance team (update sources)
- ❌ Developers should NOT add logic here

**Access:**
```javascript
window.TakeHomeData
```

**Structure:**
```javascript
{
  VERSION: '2025.1',
  LAST_UPDATED: '2025-10-17',
  REGULATORY_DATA: { ... },
  INSURANCE_DATA: { ... },
  ADMIN_COSTS: { ... },
  DEFAULTS: { ... },
  SOURCES: { ... }
}
```

---

### 2. Business Logic Layer (`logic.js`)

**Purpose:** Pure calculation functions with no side effects.

**Contains:**
- Tax calculations
- Social security calculations
- Insurance premium estimations
- Validation functions
- Data transformations

**Does NOT contain:**
- Data definitions (imports from data.js)
- DOM manipulation
- User interaction handling

**Who can edit:**
- ✅ Developers (algorithms and calculations)
- ❌ Non-technical experts should NOT edit

**Access:**
```javascript
window.TakeHomeLogic
```

**Key functions:**
- `computeSimplified()` - Freelancer (simplified) calculations
- `computeFreelancerOrganized()` - Freelancer (organized) calculations
- `computeTransparent()` - LDA (transparent company) calculations
- `calculateInsurancePremium()` - Insurance premium estimation
- And 20+ other calculation functions

---

### 3. UI Presentation Layer (`app.js`)

**Purpose:** DOM manipulation and user interaction.

**Contains:**
- Event listeners
- Form handling
- Display formatting
- Tab management
- Results rendering

**Does NOT contain:**
- Data definitions (imports from data.js)
- Calculation logic (imports from logic.js)

**Who can edit:**
- ✅ Developers (UI behavior)
- ✅ Designers (in collaboration with developers)
- ❌ Non-technical experts should NOT edit

**Dependencies:**
```javascript
const DATA = window.TakeHomeData;
const { functions } = window.TakeHomeLogic;
```

---

## Data Flow

```
User Input (app.js)
    ↓
Calculation (logic.js)
    ↓
Data Reference (data.js)
    ↓
Result (logic.js)
    ↓
Display (app.js)
```

**Example:**
1. User enters €60,000 income in form → `app.js`
2. App calls `computeSimplified(60000, ...)` → `logic.js`
3. Logic reads `DATA.REGULATORY_DATA.TAX_BRACKETS_2025` → `data.js`
4. Logic calculates tax = €12,345 → `logic.js`
5. App displays "€12,345.00" → `app.js`

---

## Isolation Guarantees

| Who | File | Safe Changes | Cannot Break |
|-----|------|--------------|--------------|
| **Tax Expert** | `data.js` | Update rates, brackets, IAS | UI, algorithms |
| **Developer** | `logic.js` | Improve algorithms, add features | Data values, UI |
| **Designer** | `app.js`, `styles.css` | Change layout, styling | Calculations, data |

**Key Benefit:** Each team can work independently without stepping on each other's toes.

---

## File Organization

```
take-home-pt/
├── data.js              ← Data layer (322 lines)
├── logic.js             ← Business logic (695 lines, down from 861)
├── app.js               ← UI presentation (1629 lines)
├── index.html           ← Main page
├── styles.css           ← Styling
├── ARCHITECTURE.md      ← This file
├── UPDATING-RATES.md    ← Guide for tax experts
└── README.md            ← Project overview
```

---

## Script Load Order

**CRITICAL:** Scripts must load in this exact order:

```html
<script src="data.js"></script>     <!-- 1st: Data -->
<script src="logic.js"></script>    <!-- 2nd: Logic -->
<script src="app.js"></script>      <!-- 3rd: UI -->
```

**Why?**
- `logic.js` needs `window.TakeHomeData` from `data.js`
- `app.js` needs both `window.TakeHomeData` and `window.TakeHomeLogic`

**Safety:** Each layer checks for dependencies and logs errors if missing.

---

## Error Handling

Each layer validates its dependencies on load:

### data.js
```javascript
// Runs validation automatically
validateData() → { valid: boolean, errors: [] }
sanityCheck() → { valid: boolean, warnings: [] }
```

### logic.js
```javascript
if (!DATA) {
  console.error('FATAL: TakeHomeData not loaded');
  return; // Exit - cannot continue
}
```

### app.js
```javascript
if (!DATA || !window.TakeHomeLogic) {
  console.error('FATAL: Dependencies not loaded');
}
```

---

## Version Management

**Data Version:** Tracked in `data.js`
```javascript
VERSION: '2025.1',
LAST_UPDATED: '2025-10-17'
```

**When to update version:**
- Tax rates change → bump version
- IAS value changes → bump version  
- Major data structure changes → bump version
- Bug fixes in logic → no version bump (different concern)

**Version Format:** `YYYY.N` where N increments for each data update in that year.

---

## Testing Strategy

### Unit Tests (Future)
- Test `logic.js` functions in isolation
- Mock `DATA` for different scenarios
- Verify calculations match known values

### Integration Tests (Future)
- Test full flow: input → calculation → output
- Verify script load order
- Test with real data

### Regression Tests (Manual)
See `BASELINE-OUTPUTS.json` for test cases:
1. Load calculator in browser
2. Enter test case inputs
3. Verify outputs match baseline
4. Repeat for all 7+ test cases

---

## Common Tasks

### Update Tax Rates
👉 See [UPDATING-RATES.md](./UPDATING-RATES.md)

### Add New Feature
1. Add data to `data.js` (if needed)
2. Add calculation to `logic.js`
3. Add UI to `app.js`
4. Test thoroughly

### Fix Bug
1. Identify layer (data vs logic vs UI)
2. Fix in appropriate file
3. Test with baseline cases
4. Commit with clear message

### Refactor
1. Never move data out of `data.js`
2. Never move calculations out of `logic.js`
3. Never move UI out of `app.js`
4. Maintain separation of concerns

---

## Design Principles

1. **Single Responsibility:** Each layer has one job
2. **Dependency Direction:** Always flows data → logic → UI
3. **No Circular Dependencies:** Logic never imports from app, etc.
4. **Testability:** Logic is pure and testable
5. **Maintainability:** Non-technical experts can update data

---

## Migration History

**Before Refactor (2025-10-17):**
- 161 lines of data mixed in `logic.js`
- 6 lines of data in `app.js`
- Tax experts couldn't update rates safely
- No clear separation of concerns

**After Refactor (2025-10-17):**
- ✅ 322 lines in dedicated `data.js`
- ✅ 166 lines removed from `logic.js`
- ✅ Clear layer boundaries
- ✅ Tax experts can safely update rates
- ✅ Better testability
- ✅ Easier onboarding

---

## Questions?

- **Where do I add a new tax rate?** → `data.js`
- **Where do I fix a calculation bug?** → `logic.js`
- **Where do I change button colors?** → `styles.css`
- **Where do I add a form field?** → `index.html` + `app.js`
- **How do I test changes?** → See `BASELINE-OUTPUTS.json`

---

**This architecture ensures TakeHomePT remains maintainable, testable, and accessible to both technical and non-technical contributors.**
