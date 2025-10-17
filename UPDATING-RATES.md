# How to Update Tax Rates and Data

**Audience:** Tax experts, accountants, compliance professionals  
**Requires:** Basic text editor skills (no coding experience needed)  
**Time:** 10-15 minutes

---

## Quick Start

**You only need to edit ONE file:** `data.js`

All tax rates, social security values, insurance data, and administrative costs are centralized in `data.js`. You can safely update these values without breaking the calculator.

---

## Step-by-Step Guide

### 1. Open data.js

Using any text editor (Notepad, VSCode, etc.), open `data.js`.

### 2. Find the Section to Update

The file is organized into clear sections:

```javascript
REGULATORY_DATA: {
  TAX_BRACKETS_2025: [...],      // IRS income tax brackets
  SOCIAL_SECURITY: {...},        // SS contribution rates
  IAS_2025: 522.5,              // IAS reference value
  NHR_RATES: {...},             // NHR tax rates
  PERSONAL_DEDUCTIONS: {...},   // Tax deductions
  // ... more
}

INSURANCE_DATA: {
  riskTiers: {...},             // Insurance premium rates
  // ... more
}

ADMIN_COSTS: {
  freelancer: 800,              // Admin costs for freelancers
  freelancer_organized: 3000,   // Admin costs (organized)
  transparent: 4800,            // Admin costs for LDA
}
```

### 3. Update Values

#### Example 1: Update IRS Tax Brackets (2026)

**When:** Government publishes new IRS tables  
**What to change:** Tax brackets and rates

**Location:** `REGULATORY_DATA.TAX_BRACKETS_2025`

```javascript
// OLD (2025)
TAX_BRACKETS_2025: [
  { max: 8059, rate: 0.13 },
  { max: 12160, rate: 0.165 },
  // ... more brackets
]

// NEW (2026) - example changes
TAX_BRACKETS_2026: [
  { max: 8500, rate: 0.13 },    // Updated threshold
  { max: 12800, rate: 0.165 },  // Updated threshold
  // ... more brackets
]
```

**Steps:**
1. Find `TAX_BRACKETS_2025` in `data.js`
2. Update the array name to `TAX_BRACKETS_2026`
3. Update the `max` values (thresholds)
4. Update the `rate` values if changed
5. Save file
6. Update `VERSION` and `LAST_UPDATED` at top of file

---

#### Example 2: Update IAS Value

**When:** Government publishes new IAS (typically January)  
**What to change:** Single number

**Location:** `REGULATORY_DATA.IAS_2025`

```javascript
// OLD
IAS_2025: 522.5,

// NEW (example for 2026)
IAS_2026: 540.0,
```

**IMPORTANT:** Also update these related values:
```javascript
SOCIAL_SECURITY: {
  ias: 540.0,  // Same as IAS_2026
  // ... other fields
}

PERSONAL_DEDUCTIONS: {
  personalAllowanceMin: 4611.6,  // 8.54 × 540.0
  // ... other fields
}

IRS_JOVEM_SCHEDULE: {
  incomeCap: 29700.0,  // 55 × 540.0
  // ... other fields
}
```

---

#### Example 3: Update Social Security Rate

**When:** SS contribution rate changes  
**What to change:** Percentage values

**Location:** `REGULATORY_DATA.SOCIAL_SECURITY`

```javascript
// OLD
SOCIAL_SECURITY: {
  rate: 0.214,                    // 21.4%
  relevantIncomeFactor: 0.70,     // 70%
  ias: 522.5,
  maxBaseMultiplier: 12,
  employeeRate: 0.11,             // 11%
  employerRate: 0.2375,           // 23.75%
}

// NEW (example if rate increases to 22%)
SOCIAL_SECURITY: {
  rate: 0.220,                    // Changed to 22%
  relevantIncomeFactor: 0.70,     // Unchanged
  ias: 522.5,                     // Unchanged
  maxBaseMultiplier: 12,          // Unchanged
  employeeRate: 0.11,             // Unchanged
  employerRate: 0.2375,           // Unchanged
}
```

---

#### Example 4: Update NHR Rate

**When:** NHR policy changes  
**What to change:** Flat tax rate

**Location:** `REGULATORY_DATA.NHR_RATES`

```javascript
// OLD
NHR_RATES: {
  original_nhr: 0.20,    // 20%
  nhr_2_ifici: 0.20,     // 20%
  standard: 'progressive'
}

// NEW (example if NHR increases to 22%)
NHR_RATES: {
  original_nhr: 0.22,    // Changed to 22%
  nhr_2_ifici: 0.22,     // Changed to 22%
  standard: 'progressive'
}
```

---

#### Example 5: Update Admin Costs

**When:** Market research shows new typical costs  
**What to change:** Annual cost estimates

**Location:** `ADMIN_COSTS`

```javascript
// OLD
ADMIN_COSTS: {
  freelancer: 800,                // EUR/year
  freelancer_organized: 3000,     // EUR/year
  transparent: 4800,              // EUR/year
}

// NEW (example based on market research)
ADMIN_COSTS: {
  freelancer: 900,                // Increased
  freelancer_organized: 3200,     // Increased
  transparent: 5000,              // Increased
}
```

---

#### Example 6: Update Insurance Risk Rates

**When:** Insurance market data changes  
**What to change:** Base rates and variable rates

**Location:** `INSURANCE_DATA.riskTiers`

```javascript
// OLD
riskTiers: {
  low: {
    baseRate: 280,
    variableRate: 0.0028,
    // ... other fields
  },
  medium: {
    baseRate: 360,
    variableRate: 0.0036,
    // ... other fields
  },
  // ... more tiers
}

// NEW (example if rates increase)
riskTiers: {
  low: {
    baseRate: 300,         // Increased
    variableRate: 0.0030,  // Increased
    // ... other fields unchanged
  },
  medium: {
    baseRate: 380,         // Increased
    variableRate: 0.0038,  // Increased
    // ... other fields unchanged
  },
  // ... more tiers
}
```

---

### 4. Update Metadata

**Always update** these fields after making changes:

```javascript
VERSION: '2026.1',              // Increment version
LAST_UPDATED: '2026-01-15',     // Today's date
```

### 5. Update Sources (Optional but Recommended)

```javascript
SOURCES: {
  tax: 'Orçamento do Estado 2026 (State Budget)',
  socialSecurity: 'Segurança Social - Trabalhadores Independentes 2026',
  ias: 'Portaria n.º XX/2026 (IAS €540.00)',
  insurance: 'Portugal insurance market estimates 2025-2026',
}
```

---

## Validation

After making changes, **always validate**:

### Method 1: Browser Console (Easiest)

1. Open `index.html` in a browser
2. Open browser console (F12)
3. Look for messages:
   ```
   ✅ TakeHomeData loaded successfully (v2026.1, 2026-01-15)
   ✅ Logic layer initialized with data from TakeHomeData
   ✅ UI layer initialized with data and logic
   ```
4. If you see errors, fix them before proceeding

### Method 2: Manual Validation

Run through test cases:
1. Enter €30,000 income
2. Check tax calculation looks reasonable
3. Try different income levels
4. Compare with manual calculations

### Method 3: Automated Tests (Future)

When automated tests are available, run:
```bash
npm test
```

---

## Common Mistakes

### ❌ Mistake 1: Forgetting Commas
```javascript
// WRONG - missing comma
ADMIN_COSTS: {
  freelancer: 800
  transparent: 4800  // ERROR: missing comma above
}

// RIGHT
ADMIN_COSTS: {
  freelancer: 800,   // ← comma here
  transparent: 4800
}
```

### ❌ Mistake 2: Wrong Number Format
```javascript
// WRONG - percentage as whole number
rate: 21.4,  // NO! This means 2140%

// RIGHT - percentage as decimal
rate: 0.214,  // This means 21.4%
```

### ❌ Mistake 3: Forgetting Related Values
```javascript
// WRONG - updated IAS but not dependent values
IAS_2026: 540.0,           // Updated ✓
SOCIAL_SECURITY: {
  ias: 522.5,              // Forgot to update! ✗
}

// RIGHT - update all related values
IAS_2026: 540.0,           // Updated ✓
SOCIAL_SECURITY: {
  ias: 540.0,              // Also updated ✓
}
```

---

## What NOT to Change

### ⚠️ Do NOT change:
- Field names (e.g., don't rename `TAX_BRACKETS_2025` to `tax_brackets`)
- Structure (e.g., don't change arrays to objects)
- Anything in `logic.js` or `app.js`
- Code outside the data values

### ✅ DO change:
- Numbers (rates, thresholds, costs)
- Strings (labels, descriptions, sources)
- Array values (brackets, codes)
- Metadata (VERSION, LAST_UPDATED)

---

## Getting Help

**If you see errors:**
1. Check for missing commas
2. Check for typos in field names
3. Check that percentages are decimals (0.20 not 20)
4. Revert changes and try again
5. Contact developer for help

**Questions?**
- **"Do I need coding skills?"** → No, just basic text editing
- **"Can I break the calculator?"** → Validation will catch most errors
- **"What if I make a mistake?"** → Git tracks all changes, easy to revert
- **"How do I test my changes?"** → Open in browser, enter test values

---

## Checklist

Before committing changes:

- [ ] Updated values in `data.js`
- [ ] Updated `VERSION` field
- [ ] Updated `LAST_UPDATED` field
- [ ] Updated `SOURCES` if applicable
- [ ] Checked for missing commas
- [ ] Checked percentages are decimals
- [ ] Updated related values (e.g., IAS in multiple places)
- [ ] Tested in browser (no console errors)
- [ ] Tested with sample income values
- [ ] Compared results with manual calculation

---

## Example: Complete 2026 Update

Here's what a typical yearly update looks like:

```javascript
// 1. Update version
VERSION: '2026.1',
LAST_UPDATED: '2026-01-15',

// 2. Update IAS
IAS_2026: 540.0,

// 3. Update tax brackets
TAX_BRACKETS_2026: [
  { max: 8500, rate: 0.13 },
  { max: 12800, rate: 0.165 },
  { max: 18100, rate: 0.22 },
  { max: 23400, rate: 0.25 },
  { max: 29800, rate: 0.32 },
  { max: 43700, rate: 0.355 },
  { max: 47200, rate: 0.435 },
  { max: 87900, rate: 0.45 },
  { max: Infinity, rate: 0.48 }
],

// 4. Update social security
SOCIAL_SECURITY: {
  rate: 0.214,
  relevantIncomeFactor: 0.70,
  ias: 540.0,  // ← Match IAS_2026
  maxBaseMultiplier: 12,
  employeeRate: 0.11,
  employerRate: 0.2375,
},

// 5. Update personal deductions
PERSONAL_DEDUCTIONS: {
  personalAllowanceMin: 4611.6,  // 8.54 × 540.0
  healthExpensesRate: 0.15,
  healthExpensesMax: 1000,
  dependentAllowance: 600
},

// 6. Update IRS Jovem cap
IRS_JOVEM_SCHEDULE: {
  incomeCap: 29700.0,  // 55 × 540.0
  exemptionRates: { /* unchanged */ }
},

// 7. Update sources
SOURCES: {
  tax: 'Orçamento do Estado 2026',
  socialSecurity: 'Segurança Social 2026',
  ias: 'Portaria n.º 10/2026 (IAS €540.00)',
  insurance: 'Portugal insurance market estimates 2025-2026',
}
```

**Done!** Test thoroughly and commit.

---

**Remember:** You're the expert on the numbers. This file makes it safe and easy for you to keep them up to date without needing to understand the code.
