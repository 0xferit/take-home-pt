# Separation of Concerns Refactor Plan

## Objective
Enforce three-layer architecture: Data → Logic → Presentation

## Current State (Mixed Concerns)
```
logic.js (826 lines)
├── SUGGESTED_ADMIN (data) ❌
├── INSURANCE_DATA (data) ❌
├── TAX_DATA (data) ❌
├── Pure functions (logic) ✅
└── Exports mixed data + logic ❌

app.js
├── Some constants (should be in data.js)
├── State management (presentation)
├── DOM manipulation (presentation)
└── Event handlers (presentation)
```

## Target State (Separated Concerns)
```
data.js (~300 lines)
├── REGULATORY_DATA
│   ├── TAX_BRACKETS_2025
│   ├── SOCIAL_SECURITY_RATES
│   ├── IAS_2025
│   ├── PERSONAL_DEDUCTIONS
│   ├── NHR_RATES
│   ├── IRS_JOVEM_SCHEDULE
│   └── ACTIVITY_PROFILES
├── INSURANCE_DATA
│   ├── RISK_TIERS
│   ├── ACTIVITY_RISK_MAP
│   ├── ADJUSTMENT_FACTORS
│   └── PORTUGAL_MARKET_FACTORS
└── SUGGESTED_ADMIN_COSTS

logic.js (~500 lines)
├── Pure calculation functions only
├── Import from data.js
├── No DOM manipulation
├── No data constants
└── Fully testable in isolation

app.js (~remaining lines)
├── UI state management
├── DOM manipulation
├── Event handlers
├── Display formatting
├── Import from data.js and logic.js
└── No calculations, no data definitions
```

## Migration Steps

### Step 1: Create data.js ✅
Extract all regulatory constants:
- [x] TAX_DATA → REGULATORY_DATA
- [x] INSURANCE_DATA → INSURANCE_DATA
- [x] SUGGESTED_ADMIN → ADMIN_COSTS
- [x] Export as `window.TakeHomeData`

### Step 2: Purify logic.js
- [ ] Remove all const data definitions
- [ ] Add `const { REGULATORY_DATA, INSURANCE_DATA, ADMIN_COSTS } = window.TakeHomeData;` at top
- [ ] Keep only pure functions
- [ ] Verify no DOM manipulation
- [ ] Update exports

### Step 3: Update app.js
- [ ] Add data.js script import
- [ ] Import needed data from `window.TakeHomeData`
- [ ] Verify no calculations in event handlers
- [ ] Verify all calculations delegate to logic.js

### Step 4: Update index.html
- [ ] Add `<script src="data.js"></script>` BEFORE logic.js
- [ ] Load order: data.js → logic.js → app.js

### Step 5: Test
- [ ] Verify calculator still works
- [ ] Test all income levels (€30K, €60K, €100K, €180K, €250K)
- [ ] Verify no regressions

### Step 6: Document
- [ ] Update README with architecture
- [ ] Add comments explaining separation
- [ ] Document team responsibilities

## Isolation Guarantees After Refactor

| Change | File | Can Break | Cannot Break |
|--------|------|-----------|--------------|
| Update 2026 tax brackets | `data.js` | N/A (just data) | `logic.js`, `app.js` |
| Improve calculation algorithm | `logic.js` | Data integrity (if accessing wrong constants) | UI layout, styling |
| Redesign UI | `app.js`, `index.html`, `styles.css` | User experience | Tax calculations, regulatory data |

## Testing Strategy

### Unit Tests (data.js)
```javascript
test('2025 tax brackets match official Diário da República', () => {
  expect(REGULATORY_DATA.TAX_BRACKETS_2025[0]).toEqual({
    max: 8059,
    rate: 0.13
  });
});
```

### Unit Tests (logic.js)
```javascript
test('computeProgressiveTax calculates correctly', () => {
  const tax = computeProgressiveTax(50000, REGULATORY_DATA.TAX_BRACKETS_2025);
  expect(tax).toBe(10567.50);
});
```

### Integration Tests (app.js)
```javascript
test('UI updates correctly when income changes', () => {
  setIncome(50000);
  expect(getDisplayedTax()).toBe('10,567.50 €');
});
```

## Rollback Plan
If refactor causes issues:
1. Git revert to commit before refactor
2. OR keep backup of original `logic.js` as `logic.js.backup`
3. Incremental rollback: revert one file at a time

## Success Criteria
- ✅ All tests pass
- ✅ Calculator produces identical results
- ✅ No data constants in logic.js
- ✅ No calculations in app.js
- ✅ data.js has only constants
- ✅ Designer can modify UI without risk
- ✅ Tax expert can update rates without risk
