# TakeHome PT - Comprehensive Audit Routine

**Target:** [TakeHome PT - Structure Optimization Planner for Portugal Professionals](https://take-home-pt.netlify.app/)

**Purpose:** Exhaustive regulatory, computational, and user experience audit for compliance with Portuguese tax law and world-class financial calculator standards.

**Auditor Role:** You are an expert in Portuguese tax law, regulatory compliance, computational accuracy, and financial tool UX/UI design.

---

## Mission Statement

Conduct a **comprehensive audit** of the TakeHome PT calculator, evaluating:
1. **Computational accuracy** against 2025 Portuguese tax regulations
2. **Compliance** with the Four Tenets (Precision, Conciseness, Transparency, Reproducibility)
3. **User experience** quality, clarity, and accessibility
4. **Documentation** completeness and source verification
5. **Multi-year projection** accuracy and methodology
6. **Edge case handling** and error states

---

## I. Computational Accuracy

### A. Core Calculation Verification

Test all three regime structures against official Portuguese tax regulations:

#### Structure 1: Freelancer (Simplified Regime)
**Legal Basis:** CIRS Article 31 (Activity Coefficients)

**Test Scenarios:**
1. **Low Income:** €30,000/year
   - Activity: IT Services (coefficient 0.75)
   - Expected: Taxable income = €30,000 × 0.75 = €22,500
   - Verify: IRS progressive tax on €22,500
   - Verify: Social Security = 21.4% on (€30,000 × 70% ÷ 4 ÷ 3, capped at monthly max)

2. **Medium Income:** €60,000/year
   - Activity: Consulting (coefficient 0.75)
   - Expected: Full calculation with all brackets
   - Verify: Solidarity tax (if applicable)

3. **High Income:** €100,000/year
   - Activity: High-value services (coefficient 0.75)
   - Expected: Multiple tax brackets engaged
   - Verify: Social Security cap at 12× IAS

4. **Very High Income:** €180,000/year
   - Activity: Professional services (coefficient 0.75)
   - Expected: Top marginal rate (48%) engaged
   - Verify: Solidarity tax (2.5% or 5%)

5. **Extreme Income:** €250,000/year
   - Activity: Professional services (coefficient 0.75)
   - Expected: Maximum solidarity tax (5% on amount > €250k)

#### Structure 2: Freelancer (Organized Regime)
**Legal Basis:** CIRS Article 31 + Deductible Expenses

**Test Scenarios:**
- Same income levels as above, but with:
  - Business expenses: 5% of gross income
  - Admin costs: €800/year
  - Insurance: €360/year
- Verify: Actual expenses deducted instead of coefficient

#### Structure 3: Transparent Company (LDA)
**Legal Basis:** CIRS Category B + CIRC Article 6

**Test Scenarios:**
- Same income levels with:
  - Manager minimum wage: €16,185/year (2× RMMG)
  - Business expenses: 5% of gross income
  - Admin costs: €2,000/year
  - No insurance (covered by company)
- Verify: Manager SS = 34.75% on minimum wage
- Verify: Remaining income flows through as Category B

### B. Tax Components to Verify

#### 1. IRS (Income Tax)
- **Progressive Brackets 2025:**
  ```
  €0 - €8,059:       13.0%
  €8,060 - €12,160:  16.5%
  €12,161 - €17,232: 22.0%
  €17,233 - €22,297: 25.0%
  €22,298 - €28,635: 32.0%
  €28,636 - €41,629: 35.5%
  €41,630 - €44,998: 43.5%
  €44,999 - €83,696: 45.0%
  €83,697+:          48.0%
  ```
- **Source:** [Orçamento do Estado 2025](https://info.portaldasfinancas.gov.pt/)

#### 2. Solidarity Tax
- **2.5%** on taxable income **€85,447 - €253,388**
- **5.0%** on taxable income **> €253,388**
- **Source:** Lei n.º 27-A/2020

#### 3. Social Security (Trabalhadores Independentes)
- **Rate:** 21.4%
- **Base:** 70% of gross income (relevant income factor)
- **Quarterly base:** Gross income × 70% ÷ 4
- **Monthly base:** Quarterly ÷ 3
- **Cap:** 12× IAS (12 × €522.50 = €6,270/month in 2025)
- **Source:** [Segurança Social 2025](https://www.seg-social.pt/)

#### 4. Personal Deductions
- **Health expenses:** 15% deductible, max €1,000
- **Education expenses:** 30% deductible, max €800
- **Retirement contributions:** 20% deductible, max €2,500 (single) / €5,000 (married)
- **Charitable donations:** 25% deductible
- **Source:** CIRS Article 78-B

#### 5. IRS Jovem (Youth Tax Exemption)
- **Eligibility:** Age 18-26 (first job) or 18-30 (with higher ed)
- **Schedule:**
  ```
  Year 1-2: 100% exemption
  Year 3-4:  75% exemption
  Year 5-7:  50% exemption
  Year 8-10: 25% exemption
  ```
- **Cap:** €25,000 per year (2× IAS × 14 × 1.265)
- **Source:** CIRS Article 2-B

#### 6. NHR (Non-Habitual Resident)
- **Rate:** 20% flat (for high-value scientific/technical services)
- **Mutual exclusivity:** Cannot combine with IRS Jovem
- **Source:** CIRS Article 72

### C. Multi-Year Projection (10 Years)

**Verify:**
1. **Annual Growth:** Income compounds correctly at specified rate (0%, 3%, 5%, 7%)
2. **IRS Jovem Progression:** Exemption % changes correctly by year (100% → 75% → 50% → 25% → 0%)
3. **Cumulative Tracking:** Net income accumulates correctly year-over-year
4. **NPV Calculation:** 3% discount rate applied correctly
5. **First-Year Benefits:** 50% IRS discount and SS exemption only apply to Year 1

**Test Scenarios:**
- €60k starting, 0% growth, no special regimes
- €60k starting, 5% growth, IRS Jovem enabled
- €100k starting, 3% growth, NHR enabled
- €180k starting, 7% growth, all deductions maximized

### D. Edge Cases & Boundary Conditions

**Test:**
1. **Zero income:** Should show €0 across all fields (no crashes)
2. **Minimum income:** €10,000 - verify minimum SS contribution
3. **Bracket boundaries:** Test income exactly at bracket limits (€8,059, €12,160, etc.)
4. **SS cap boundary:** Income where monthly SS hits cap (€107,314 gross)
5. **Solidarity tax threshold:** €85,447 and €253,388 exactly
6. **IRS Jovem cap:** €25,000 exempt amount boundary
7. **Negative expenses:** Should not be possible (input validation)
8. **Expenses > Income:** Should not be possible or show warning
9. **Invalid activity codes:** Should default gracefully
10. **Extreme values:** €10,000,000+ income (should not crash)

---

## II. Four Tenets Compliance

### 1. Precision

**Verify:**
- [ ] All tax brackets match official 2025 values exactly
- [ ] IAS value = €522.50 (2025)
- [ ] RMMG = €8,092.50 × 2 = €16,185 for manager minimum
- [ ] Social Security rate = 21.4% (not 21.5%, not 21%)
- [ ] Activity coefficients match CIRS Article 31 exactly
- [ ] All calculations use correct order of operations
- [ ] Rounding is consistent and documented (e.g., round to nearest €1)
- [ ] No magic numbers in code (all constants in `data.js`)

**Pass Criteria:**
- 100% accuracy on all official values
- Zero undocumented constants
- All calculations within €1 of manual verification

### 2. Conciseness

**Verify:**
- [ ] Field labels are ≤10 words where possible
- [ ] Help text is ≤15 words for most fields
- [ ] No verbose explanations in input sections
- [ ] Progressive disclosure used (collapsed details, expandable sections)
- [ ] Summary cards show only essential info
- [ ] No redundant information repeated

**Count Examples:**
```
✅ GOOD: "Annual Gross Income" (3 words)
✅ GOOD: "Category B professional services revenue" (5 words)
❌ BAD:  "Enter your total annual gross income from self-employment..." (9+ words)

✅ GOOD: "5-digit CAE code. Auto-determines activity type." (6 words)
❌ BAD:  "Enter your 5-digit CAE code to automatically determine..." (15+ words)
```

**Pass Criteria:**
- 80%+ of labels ≤10 words
- 80%+ of help texts ≤15 words
- Zero paragraph-length explanations in input sections

### 3. Transparency

**Verify:**
- [ ] Every result shows the calculation formula
- [ ] "Calculation Breakdown" section exists and is complete
- [ ] Every tax rate links to official source
- [ ] Every coefficient links to CIRS article
- [ ] Formula display shows actual numbers used
- [ ] No "black box" calculations
- [ ] Step-by-step breakdown visible for all regimes

**Example - IRS Calculation Transparency:**
```
IRS Calculation:
1. Taxable Income: €60,000 × 75% = €45,000
2. Tax by bracket:
   - €0-€8,059 @ 13%:     €1,047.67
   - €8,060-€12,160 @ 16.5%: €676.65
   - €12,161-€17,232 @ 22%: €1,115.72
   - €17,233-€22,297 @ 25%: €1,266.00
   ... (all brackets shown)
3. Subtotal: €12,345.67
4. Deductions: -€500 (health)
5. Final IRS: €11,845.67

Source: [Tabela de IRS 2025] (clickable link)
```

**Pass Criteria:**
- 100% of calculations have visible formulas
- 100% of regulatory values have source links
- Step-by-step breakdown shows every intermediate value

### 4. Reproducibility

**Verify:**
- [ ] Methodology section exists and is complete
- [ ] Every formula is documented with legal reference
- [ ] Source links go to official government sites (.gov.pt)
- [ ] Version number visible (format: `v2025.X.{commit_hash}`)
- [ ] Commit hash allows exact code reproduction
- [ ] No proprietary/undocumented methods
- [ ] A qualified accountant could reproduce results manually

**Test - Manual Reproduction:**
Pick one scenario (e.g., €60k, simplified), and manually calculate using:
- Calculator's displayed methodology
- Official tax tables from links provided
- Verify results match within €1

**Pass Criteria:**
- Manual calculation matches calculator within €1
- All sources link to official Portuguese government sites
- Version + commit hash enables exact code verification

---

## III. UI/UX & Accessibility

### A. User Interface Quality

**Input Section:**
- [ ] Logical flow (Setup → Income → Expenses → Deductions → Results)
- [ ] Smart defaults pre-populated
- [ ] Input validation prevents invalid values
- [ ] Real-time calculation updates (no submit button)
- [ ] Clear error messages for invalid inputs
- [ ] Responsive design (mobile, tablet, desktop)

**Results Section:**
- [ ] Summary cards clearly show winner
- [ ] Color coding: Green = good, Red = bad, consistent
- [ ] Comparison table side-by-side (Freelancer vs LDA)
- [ ] Year-by-year table for 10-year projection
- [ ] Export/save functionality works
- [ ] Print-friendly layout

**Methodology Section:**
- [ ] Collapsible/expandable sections
- [ ] Complete documentation of all formulas
- [ ] Links to all official sources
- [ ] Worked examples with real numbers
- [ ] Legal references (CIRS articles, OE 2025)

### B. Decision Support Elements

**Verify:**
- [ ] "Winner" tag clearly identifies best structure
- [ ] Breakeven analysis shown (if applicable)
- [ ] Warnings for mutually exclusive options (NHR + IRS Jovem)
- [ ] Recommendations are actionable (e.g., "Choose LDA if income > €X")
- [ ] All advice is qualified (e.g., "consult a tax professional")
- [ ] No absolute guarantees or legal advice

**Example - Good Recommendation:**
```
✅ "Based on €100k income, LDA saves €2,500/year vs Freelancer Simplified.
    Breakeven point: Year 3.
    Note: Consult a tax advisor for your specific situation."

❌ "You MUST use LDA. It's always better for everyone."
```

### C. Accessibility (WCAG 2.1 AA)

**Verify:**
- [ ] Sufficient color contrast (≥4.5:1 for normal text)
- [ ] All interactive elements keyboard-accessible
- [ ] Semantic HTML (headings, landmarks, labels)
- [ ] Alt text for any images/icons
- [ ] Form labels properly associated with inputs
- [ ] Focus indicators visible
- [ ] Screen reader friendly (test with VoiceOver/NVDA)

### D. Error Handling

**Test:**
- [ ] Invalid income (negative, letters) → Clear error message
- [ ] Expenses > Income → Warning or prevention
- [ ] Missing required fields → Highlighted with message
- [ ] API failures (GitHub version fetch) → Graceful fallback
- [ ] Offline mode → Static version shown
- [ ] JavaScript disabled → Basic HTML fallback or message

### E. Performance

**Verify:**
- [ ] Initial load < 2 seconds (good connection)
- [ ] Calculations instant (< 100ms)
- [ ] No UI lag when typing
- [ ] Multi-year projection completes < 1 second
- [ ] No memory leaks (test extended use)

---

## IV. Regulatory Compliance

### A. Legal Accuracy

**Cross-reference with official sources:**

1. **Tax Brackets:** [Portal das Finanças - Tabelas de Retenção 2025](https://info.portaldasfinancas.gov.pt/)
2. **IAS Value:** [Portaria n.º 32/2025](https://dre.pt/) - €522.50
3. **RMMG:** [Decreto-Lei n.º 109/2024](https://dre.pt/) - €820 × 14 = €11,480/year
4. **Social Security:** [Segurança Social - Trabalhadores Independentes](https://www.seg-social.pt/)
5. **Activity Coefficients:** CIRS Article 31
6. **IRS Jovem:** CIRS Article 2-B (Lei n.º 26/2024)
7. **NHR:** CIRS Article 72

**Verify:**
- [ ] All values match official 2025 publications
- [ ] Recent law changes incorporated (check OE 2025)
- [ ] Deprecated rules not used (e.g., old NHR rates)

### B. Mutual Exclusivities

**Verify correct handling:**
- [ ] NHR + IRS Jovem → Warning shown, prevents both
- [ ] Simplified + Organized → Radio buttons, only one selectable
- [ ] First-year benefits → Only apply to Year 1 in multi-year

### C. Disclaimers

**Verify:**
- [ ] Clear disclaimer: "Educational tool, not legal advice"
- [ ] Recommendation to consult tax professional
- [ ] Version number visible for reference
- [ ] Data sources and date of last update shown
- [ ] Liability limitation stated

---

## V. Multi-Year Projection (Specific)

### A. Computational Logic

**Verify for each year 1-10:**
1. **Income Growth:**
   ```
   Year N Income = Year 1 Income × (1 + growth_rate)^(N-1)
   Example: €60k @ 5% growth
     Year 1: €60,000
     Year 2: €63,000
     Year 3: €66,150
     ...
     Year 10: €93,053
   ```

2. **IRS Jovem Progression:**
   ```
   Year 1-2:  100% exemption (up to €25k cap)
   Year 3-4:   75% exemption (up to €25k cap)
   Year 5-7:   50% exemption (up to €25k cap)
   Year 8-10:  25% exemption (up to €25k cap)
   ```
   Verify: Exemption applies BEFORE personal deductions

3. **First-Year Benefits:**
   - 50% IRS discount: Only Year 1
   - SS exemption: Only Year 1
   - Verify: Not applied to Years 2-10

4. **Cumulative Net Income:**
   ```
   Cumulative Year N = Sum of Net Income (Year 1 to N)
   ```
   Verify: Adds correctly, no rounding errors

5. **NPV (Net Present Value):**
   ```
   NPV = Σ (Net Income Year N) / (1.03)^(N-1)
   ```
   Using 3% discount rate, verify calculation

### B. Display & Comparison

**Verify:**
- [ ] Year-by-year table shows all 10 years
- [ ] Columns: Year, Income, Net, Tax, SS, Cumulative
- [ ] Comparison: Freelancer vs LDA side-by-side
- [ ] Winner determination: Based on 10-year cumulative net
- [ ] Breakeven year shown (if structures cross over)
- [ ] Total savings displayed clearly

### C. Edge Cases (Multi-Year)

**Test:**
- [ ] 0% growth rate → Flat income all 10 years
- [ ] 20% growth rate → Income doubles in ~4 years
- [ ] IRS Jovem enabled → Exemption decreases correctly
- [ ] Income exceeds IRS Jovem cap mid-way → Partial exemption
- [ ] NHR + high growth → 20% flat rate all 10 years
- [ ] Switch regimes mid-way → (Not supported, should be clear)

---

## VI. Technical Quality

### A. Code Architecture

**Verify separation of concerns:**
- [ ] `data.js` - Pure data only (no logic, no DOM)
- [ ] `logic.js` - Pure functions only (no data, no DOM)
- [ ] `app.js` - Presentation only (no calculations, no data definitions)
- [ ] Script load order: data.js → logic.js → app.js

**Code Quality:**
- [ ] No inline calculations in HTML
- [ ] No magic numbers (all constants in data.js)
- [ ] Functions are pure and testable
- [ ] Variable names are descriptive
- [ ] Comments explain "why" not "what"

### B. Version Control

**Verify:**
- [ ] Version format: `v2025.X.{commit_hash}` (e.g., `v2025.2.b02afbf`)
- [ ] Version visible in footer
- [ ] Commit hash links to exact code state
- [ ] `VERSION` and `LAST_UPDATED` in data.js
- [ ] Git history shows clear commit messages (Conventional Commits)

### C. Security & Privacy

**Verify:**
- [ ] No user data stored server-side
- [ ] Local storage only (optional, user-controlled)
- [ ] No external tracking/analytics (or clearly disclosed)
- [ ] HTTPS only (Netlify)
- [ ] No sensitive data in URLs
- [ ] XSS protection (sanitized inputs)

---

## VII. Test Scenarios (Concrete Examples)

### Scenario 1: Junior Developer
**Input:**
- Gross Income: €30,000
- Activity: IT Services (CAE 62010, coefficient 0.75)
- No special regimes (no NHR, no IRS Jovem)
- No dependents, no deductions
- First year: No benefits

**Expected Output (Simplified):**
- Taxable Income: €30,000 × 0.75 = €22,500
- IRS: ~€3,750 (progressive calculation)
- SS: ~€3,780 (21.4% on capped monthly base)
- Total Expenses: €800 (admin)
- Net Income: ~€21,670

**Verify:** Calculator matches within €10

---

### Scenario 2: Mid-Career Consultant
**Input:**
- Gross Income: €60,000
- Activity: Consulting (coefficient 0.75)
- NHR: Eligible (20% flat)
- Personal Deductions: €500 health, €300 education
- 10-year projection: 5% annual growth

**Expected Output (Organized, Year 1):**
- Taxable Income: €60,000 - €3,000 (expenses) = €57,000
- IRS @ 20% NHR: €11,400
- Less deductions: -€800 × 15% (health) -€300 × 30% (education)
- SS: ~€6,270 (capped)
- Net Income: ~€41,500

**Expected (Year 10):**
- Income: €60,000 × 1.05^9 = €93,053
- IRS @ 20%: €18,611
- Net Income: ~€64,000
- Cumulative 10-year net: ~€510,000

**Verify:** All year-by-year values, cumulative matches

---

### Scenario 3: Senior Professional with IRS Jovem
**Input:**
- Gross Income: €100,000
- Activity: High-value services (coefficient 0.75)
- IRS Jovem: Enabled (Year 3, so 50% exemption on first €25k)
- Personal Deductions: Max all (health €1,000, retirement €2,500)
- First Year: 50% IRS discount, SS exempt

**Expected Output (Simplified, Year 1):**
- Taxable Income: €100,000 × 0.75 = €75,000
- IRS before Jovem: ~€20,000
- IRS Jovem (50% on €25k): ~€5,000 reduction
- 50% first-year discount: Another 50% off
- Final IRS: ~€7,500
- SS: €0 (first-year exempt)
- Net Income: ~€90,500 (Year 1 bonus)

**Expected (Year 2):**
- IRS Jovem still 50%, but no first-year discount
- SS: ~€6,270 (capped, now paying)
- Net Income: ~€76,000

**Verify:** First-year benefits only apply once, IRS Jovem persists

---

### Scenario 4: High Earner Comparison
**Input:**
- Gross Income: €180,000
- Activity: Professional services (coefficient 0.75)
- Compare: Freelancer Simplified vs LDA
- 10-year projection: 3% growth

**Expected (Freelancer Simplified, Year 1):**
- Taxable: €135,000
- IRS: ~€52,000 (top brackets + solidarity 2.5%)
- SS: ~€6,270 (capped)
- Net: ~€119,000

**Expected (LDA, Year 1):**
- Manager wage: €16,185 @ 34.75% SS = ~€5,624 SS
- Remaining: €180k - €16,185 - €5,624 - €2,000 (admin) = €156,191 flows through
- IRS on Category B: ~€62,000 (higher tax, but more deductions)
- Net: ~€107,000

**Winner:** Freelancer Simplified (saves ~€12,000/year)

**Verify:** Comparison table shows Freelancer wins, correct reasoning displayed

---

## VIII. Scoring Rubric

### Computational Accuracy (40 points)
- [ ] All tax brackets correct (10 pts)
- [ ] Social Security calculated correctly (10 pts)
- [ ] Multi-year projections accurate (10 pts)
- [ ] Edge cases handled (5 pts)
- [ ] All test scenarios match expected (5 pts)

**Pass:** ≥36/40 (90%)

---

### Four Tenets Compliance (30 points)
- [ ] Precision: 100% regulatory accuracy (10 pts)
- [ ] Conciseness: 80%+ labels/help texts ≤10-15 words (5 pts)
- [ ] Transparency: All formulas visible + sources linked (10 pts)
- [ ] Reproducibility: Complete methodology, version control (5 pts)

**Pass:** ≥27/30 (90%)

---

### UI/UX Quality (20 points)
- [ ] Intuitive navigation and flow (5 pts)
- [ ] Clear decision support (winner, recommendations) (5 pts)
- [ ] Accessibility (WCAG 2.1 AA) (5 pts)
- [ ] Error handling and validation (5 pts)

**Pass:** ≥16/20 (80%)

---

### Documentation & Compliance (10 points)
- [ ] Methodology section complete (3 pts)
- [ ] All sources link to official .gov.pt sites (3 pts)
- [ ] Version control and traceability (2 pts)
- [ ] Disclaimers and legal compliance (2 pts)

**Pass:** ≥8/10 (80%)

---

### Overall Score: /100

**Rating:**
- **95-100:** World-class, audit-ready
- **90-94:** Excellent, minor improvements
- **85-89:** Good, some gaps to address
- **80-84:** Acceptable, notable issues
- **<80:** Needs significant work

**Pass Threshold:** ≥85/100

---

## IX. Reporting Template

### Executive Summary

**CRITICAL:** Always include the exact version number from the calculator footer.

- **Version Audited:** v[YYYY.MM.DD.commit_hash] ← **Copy from footer at bottom of calculator page**
- **Audit Date:** YYYY-MM-DD
- **Overall Score:** XX/100
- **Pass/Fail:** [PASS/FAIL]
- **Recommendation:** [Ready for production / Needs fixes / Major rework required]

**Example:**
- **Version Audited:** v2025.10.18.cdd91a7
- **Audit Date:** 2025-10-18
- **Overall Score:** 92/100
- **Pass/Fail:** PASS
- **Recommendation:** Ready for production with minor UX improvements

---

### Findings

#### 1. Computational Accuracy
**Score:** XX/40

**Correct:**
- [List what calculations are accurate]

**Errors Found:**
- [List any calculation discrepancies with expected vs actual]

**Edge Cases:**
- [List any edge case failures]

---

#### 2. Four Tenets Compliance
**Score:** XX/30

**Precision:**
- [Assessment of regulatory accuracy]

**Conciseness:**
- [Count of verbose labels/help texts]

**Transparency:**
- [Assessment of formula visibility and source linking]

**Reproducibility:**
- [Assessment of methodology completeness]

---

#### 3. UI/UX Quality
**Score:** XX/20

**Strengths:**
- [List UI/UX strengths]

**Issues:**
- [List usability problems, accessibility failures, etc.]

---

#### 4. Documentation & Compliance
**Score:** XX/10

**Complete:**
- [What's well documented]

**Missing:**
- [What needs better documentation]

---

### Critical Issues (Must Fix)
1. [Any calculation errors that affect results]
2. [Any missing regulatory compliance]
3. [Any accessibility blockers]

---

### Minor Issues (Should Fix)
1. [UI polish items]
2. [Documentation gaps]
3. [Performance optimizations]

---

### Recommendations
1. [Prioritized list of improvements]
2. [Suggestions for enhancements]
3. [Future feature considerations]

---

### Conclusion
[Overall assessment: Is the tool ready for professional use? Does it meet world-class standards? What's the confidence level for accuracy?]

---

**Auditor Signature:** ___________________  
**Date:** ___________________

---

## X. Audit Execution Checklist

**Before Starting:**
- [ ] **Record the version number** from calculator footer (bottom of page)
  - Format: v2025.10.18.abc123d (year.month.day.commithash)
  - **Include this version in your audit report header**
- [ ] Review latest Portuguese tax regulations (OE 2025)
- [ ] Confirm IAS, RMMG, tax brackets for 2025
- [ ] Have official source documents ready
- [ ] Prepare calculator (spreadsheet) for manual verification

**During Audit:**
- [ ] Test all scenarios in order (Section VII)
- [ ] Document every discrepancy immediately
- [ ] Screenshot any UI issues
- [ ] Note any unclear documentation
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile device
- [ ] Test with screen reader

**After Audit:**
- [ ] **Include version number in report header** (from calculator footer)
- [ ] Complete scoring rubric (Section VIII)
- [ ] Write executive summary with version
- [ ] List all issues (critical first)
- [ ] Provide actionable recommendations
- [ ] Rate overall: Pass/Fail
- [ ] Verify version number is prominently displayed in report

---

## XI. Quick Reference - Expected Values 2025

| Constant | Value | Source |
|----------|-------|--------|
| IAS | €522.50 | Portaria n.º 32/2025 |
| RMMG (monthly) | €820 | DL 109/2024 |
| RMMG (annual) | €11,480 | DL 109/2024 |
| Manager min (LDA) | €16,185 | 2× RMMG annual |
| SS Rate (self-employed) | 21.4% | SS 2025 |
| SS Relevant Income Factor | 70% | SS 2025 |
| SS Monthly Cap | €6,270 | 12× IAS |
| Top IRS Bracket | 48% | OE 2025 |
| Solidarity Tax Threshold 1 | €85,447 | Lei 27-A/2020 |
| Solidarity Tax Threshold 2 | €253,388 | Lei 27-A/2020 |
| IRS Jovem Max Exemption | €25,000 | CIRS Art 2-B |
| NHR High-Value Rate | 20% | CIRS Art 72 |

---

## XII. Official Sources (Must Link)

**Primary Sources:**
1. [Portal das Finanças](https://info.portaldasfinancas.gov.pt/) - Tax tables, IRS
2. [Segurança Social](https://www.seg-social.pt/) - SS rates, contributions
3. [Diário da República](https://dre.pt/) - Official legal publications
4. [INE - Instituto Nacional de Estatística](https://www.ine.pt/) - IAS, economic data
5. [CIRS - Código do IRS](https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/) - Tax code

**Specific Legislation:**
- Orçamento do Estado 2025 (OE 2025) - Tax brackets
- Lei n.º 27-A/2020 - Solidarity tax
- Lei n.º 26/2024 - IRS Jovem update
- Portaria n.º 32/2025 - IAS value
- Decreto-Lei n.º 109/2024 - RMMG value

---

## Usage Instructions

**For AI Auditors:**
1. Access the calculator at https://take-home-pt.netlify.app/
2. **FIRST: Record the version number from footer** (e.g., v2025.10.18.cdd91a7)
3. **Include version in all audit reports** (Executive Summary section)
4. Work through each section (I-VII) systematically
5. Test all scenarios in Section VII
6. Complete the scoring rubric (Section VIII)
7. Generate a report using template (Section IX) **with version number**
8. Provide clear pass/fail determination

**Why version matters:**
- Enables exact bug reproduction (`git checkout abc123d`)
- Links audit findings to specific code state
- Tracks improvements over time
- Essential for professional audit trail

**For Human Auditors:**
1. Print this routine or keep it open in a second window
2. Have a spreadsheet ready for manual calculations
3. Official source documents ready for cross-reference
4. Test methodically, document everything
5. Focus on critical issues first
6. Be thorough but efficient

**For Developers:**
1. Use this as a regression test checklist
2. Before each release, run key scenarios
3. Verify version number updated
4. Check no new calculation errors introduced
5. Confirm all sources still link correctly

---

**Last Updated:** 2025-10-17  
**Version:** 1.0  
**Maintained By:** TakeHome PT Development Team

---

**This audit routine ensures world-class quality, regulatory compliance, and user trust.**
