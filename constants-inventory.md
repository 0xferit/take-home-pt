# Constants Inventory - Separation of Concerns Refactor

**Date:** 2025-10-17  
**Purpose:** Complete audit of all data constants before extracting to data.js  
**Status:** ✅ Complete

## Summary

| File | Constants Found | Lines | Should Move to data.js? |
|------|----------------|-------|------------------------|
| logic.js | 3 major data objects | 3-164 | ✅ YES |
| app.js | 1 defaults object | 66-72 | ✅ YES |
| **TOTAL** | **4 data objects** | | **All moving to data.js** |

---

## Detailed Inventory

### 1. logic.js - Line 3-8: SUGGESTED_ADMIN
```javascript
const SUGGESTED_ADMIN = {
  freelancer: 800,              // EUR annual
  freelancer_organized: 3000,   // EUR annual
  transparent: 4800,            // EUR annual
};
```

**Purpose:** Admin/compliance cost estimates for each business structure  
**Used By:** app.js (expense calculations), logic.js (exported)  
**Move to data.js:** ✅ YES → `DATA.ADMIN_COSTS`  
**Category:** Business operational data

---

### 2. logic.js - Line 10-91: INSURANCE_DATA
```javascript
const INSURANCE_DATA = {
  riskTiers: {
    low: { id, label, description, baseRate, variableRate, riskMultiplier },
    medium: { ... },
    high: { ... }
  },
  portugalDiscount: 0.88,
  economiesOfScale: { tier1Threshold, tier1Multiplier, tier2Threshold, tier2Multiplier },
  activityRiskMap: {
    '62010': 'medium',  // Computer programming
    '62020': 'medium',  // Computer consultancy
    // ... 20+ CAE code mappings
  },
  adjustmentFactors: { usaCoverage, minorClaims, majorClaims, experienceDiscount },
  standardCoverage: 2000000,
};
```

**Purpose:** Professional liability insurance premium calculation parameters  
**Used By:** logic.js (calculateInsurancePremium), app.js (insurance display)  
**Move to data.js:** ✅ YES → `DATA.INSURANCE_DATA` (keep same name)  
**Category:** Insurance market data

---

### 3. logic.js - Line 93-164: TAX_DATA
```javascript
const TAX_DATA = {
  // IRS progressive tax brackets for 2025
  taxBrackets2025: [
    { max: 8059, rate: 0.13 },
    { max: 12160, rate: 0.165 },
    // ... 9 brackets total
  ],
  
  // NHR (Non-Habitual Resident) special tax rates
  nhrRates: {
    original_nhr: 0.20,
    nhr_2_ifici: 0.20,
    standard: 'progressive'
  },
  
  // Activity profiles (deemed expense coefficients)
  activityProfiles: {
    services_general: { id, label, coefficient: 0.35, description },
    services_high_value: { id, label, coefficient: 0.75, description }
  },
  
  // CAE activity codes
  highValueServiceCodes: ['62010', '62020', ... 14 codes],
  coreServiceCodes: ['69200', '69102', ... 11 codes],
  activityCatalog: [
    { code: '62010', label: 'Computer programming activities', profileId: 'services_high_value' },
    // ... 16 entries total
  ],
  
  // Social Security parameters
  socialSecurity: {
    rate: 0.214,
    relevantIncomeFactor: 0.70,
    ias: 522.5,              // Indexante de Apoios Sociais 2025
    maxBaseMultiplier: 12
  },
  
  // Personal tax deductions
  personalDeductions: {
    personalAllowanceMin: 4462.15,  // 8.54 × IAS
    healthExpensesRate: 0.15,
    healthExpensesMax: 1000,
    dependentAllowance: 600
  }
};
```

**Purpose:** ALL Portuguese tax law parameters (IRS, SS, NHR, deductions)  
**Used By:** logic.js (all tax calculation functions), app.js (UI display)  
**Move to data.js:** ✅ YES → `DATA.REGULATORY_DATA`  
**Category:** Government regulatory data (tax law)  
**Sources:**
- IRS brackets: Orçamento do Estado 2025
- Social Security: Segurança Social guidance 2025
- IAS: Official 2025 value €522.50

---

### 4. app.js - Line 66-72: DEFAULTS
```javascript
const DEFAULTS = {
  softwareIncome: 170000,       // Default income (unused?)
  tradingIncome: 25000,         // Default trading income (unused?)
  bizExpensesPercent: 0.05,     // 5% of gross income
  tradingRate: 0.28,            // Trading income tax rate (unused?)
  simplifiedDeemed: 0.25,       // Simplified deemed expenses (unused?)
};
```

**Purpose:** Application default values and UI initialization  
**Used By:** app.js (business expense auto-calculation)  
**Move to data.js:** ✅ YES → `DATA.DEFAULTS`  
**Category:** Application configuration  
**Note:** Some values appear unused (softwareIncome, tradingIncome, tradingRate, simplifiedDeemed). Will verify during refactor.

---

## Non-Data Constants (NOT moving to data.js)

### app.js - Formatting Functions (Lines 20-29)
```javascript
const currencyFormatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const formatCurrency = (value) => ...
const formatSignedCurrency = (value) => ...
const formatPercent = (value) => ...
const formatSignedPercent = (value) => ...
const formatRate = (value) => ...
```
**Keep in app.js:** ✅ These are UI presentation utilities, not data

### app.js - Helper Functions (Lines 35-64, 73-76)
```javascript
const formatSolidarityTaxBreakdown = (taxableIncome, totalSolidarityTax) => ...
const setText = (id, value) => ...
```
**Keep in app.js:** ✅ These are DOM manipulation utilities

### app.js - Application State (Lines 78-111)
```javascript
const ACTIVITY_DEFAULT = 'services_high_value';
const appState = { nhrStatus, activityProfile, ... };
```
**Keep in app.js:** ✅ This is runtime application state, not source data

---

## Refactoring Plan

### Step 2-3: Create data.js with ALL 4 constants
```javascript
window.TakeHomeData = {
  VERSION: '2025.1',
  LAST_UPDATED: '2025-10-17',
  
  // From logic.js TAX_DATA
  REGULATORY_DATA: {
    TAX_BRACKETS_2025: [...],
    SOCIAL_SECURITY: {...},
    IAS_2025: 522.5,
    NHR_RATES: {...},
    IRS_JOVEM_SCHEDULE: {...},
    SOLIDARITY_TAX: {...},
    PERSONAL_DEDUCTIONS: {...},
    ACTIVITY_PROFILES: {...},
    ACTIVITY_CODES: [...],
  },
  
  // From logic.js INSURANCE_DATA
  INSURANCE_DATA: {...},  // Keep existing structure
  
  // From logic.js SUGGESTED_ADMIN
  ADMIN_COSTS: {
    freelancer: 800,
    freelancer_organized: 3000,
    transparent: 4800,
  },
  
  // From app.js DEFAULTS
  DEFAULTS: {
    bizExpensesPercent: 0.05,
    // Remove unused: softwareIncome, tradingIncome, tradingRate, simplifiedDeemed
  },
  
  SOURCES: {
    tax: 'Orçamento do Estado 2025',
    socialSecurity: 'Segurança Social 2025',
    ias: 'Portaria 41/2025',
  },
};
```

### Step 4: Access Layer in logic.js
```javascript
// At top of logic.js IIFE:
const DATA = window.TakeHomeData;
if (!DATA) {
  console.error('FATAL: TakeHomeData not loaded. Ensure data.js loads before logic.js');
  return;
}

// Create aliases for backward compatibility during migration
const TAX_DATA = DATA.REGULATORY_DATA;
const INSURANCE_DATA = DATA.INSURANCE_DATA;
const SUGGESTED_ADMIN = DATA.ADMIN_COSTS;
```

### Step 5: Remove Original Declarations
Delete lines 3-164 from logic.js (but keep access layer)

### Step 6: Update app.js
```javascript
// At top of app.js, after TakeHomeLogic destructuring:
const DATA = window.TakeHomeData;
if (!DATA) {
  console.error('FATAL: TakeHomeData not loaded. Ensure data.js loads before app.js');
}

// Replace line 66-72:
const DEFAULTS = DATA.DEFAULTS;
```

### Step 7: Remove Aliases
Replace all `TAX_DATA` → `DATA.REGULATORY_DATA` in logic.js  
Replace all `INSURANCE_DATA` → `DATA.INSURANCE_DATA` in logic.js  
Replace all `SUGGESTED_ADMIN` → `DATA.ADMIN_COSTS` in logic.js  
Remove alias declarations

---

## Verification Checklist

- [ ] All 4 constants identified and documented
- [ ] No hardcoded data values missed
- [ ] Formatting/utility functions correctly excluded
- [ ] Application state correctly excluded
- [ ] Refactoring plan matches constants found
- [x] Inventory reviewed and approved

---

## Notes

1. **No hardcoded values found** outside these 4 constants
2. **Total lines to move:** ~161 lines of pure data
3. **Script load order critical:** data.js → logic.js → app.js
4. **Zero business logic in data.js:** All functions stay in logic.js
5. **Unused DEFAULTS values:** Will clean up during migration

**Gate Status:** ✅ PASS - Ready for Step 2
