# TakeHome PT Calculator - Comprehensive Audit Routine V2.0

## ⚠️ CRITICAL: Primary Source Verification Required

**This routine was updated after audits scored 93-95/100 while missing CRITICAL data errors:**
- 8 out of 9 tax brackets were WRONG (off by 0.4-0.5%)
- CAE references were OUTDATED (Rev. 3 vs Rev. 4)
- Government sources were INADEQUATE (generic PDFs vs actionable tools)

**DO NOT TRUST SECONDARY SOURCES. VERIFY EVERYTHING AGAINST OFFICIAL GOVERNMENT PUBLICATIONS.**

---

## Access Information

**Live Calculator:** https://take-home-pt.netlify.app  
**Repository:** (if provided by client)  
**Audit Frequency:** After each major legislative change (minimum: annually before tax season)

---

## Phase 1: Pre-Audit Preparation (MANDATORY)

### Step 1.1: Gather Official 2025 Portuguese Government Sources

Before testing the calculator, you MUST obtain and verify these PRIMARY SOURCES:

**REQUIRED DOCUMENTS (Download/Bookmark ALL):**

1. **IRS Progressive Tax Brackets 2025**
   - Source: Lei n.º 55-A/2025, Article 68.º of Código do IRS
   - Link: https://diariodarepublica.pt/dr/detalhe/lei/55-a-2025-925904929
   - **VERIFY:** All 9 bracket rates and thresholds
   - **FORMAT:** Create verification table with exact percentages

2. **IAS 2025 Value**
   - Source: Portaria n.º 6-B/2025, Article 2.º
   - Link: https://diariodarepublica.pt/dr/detalhe/portaria/6-b-2025-902111932
   - **VERIFY:** Exact value (€522.50 for 2025)

3. **RMMG 2025 (Minimum Wage)**
   - Source: Decreto-Lei n.º 112/2024, Article 3.º
   - Link: https://diariodarepublica.pt/dr/detalhe/decreto-lei/112-2024-900706889
   - **VERIFY:** Exact value (€870 for 2025)

4. **Social Security Rates**
   - Source: Lei n.º 110/2009, Article 168.º & Article 53.º
   - Link: https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34514575
   - **VERIFY:** 21.4% (self-employed), 34.75% (LLC total: 23.75% employer + 11% employee)

5. **CAE Classification Current Version**
   - Source: Decreto-Lei n.º 9/2025 (CAE Rev. 4, effective Jan 1, 2025)
   - Link: https://diariodarepublica.pt/dr/detalhe/decreto-lei/9-2025-907026813
   - **VERIFY:** Calculator uses CAE Rev. 4, not outdated Rev. 3

6. **Article 151 Professional Services (CIRS Codes)**
   - Source: Portaria n.º 1011/2001
   - Link: https://diariodarepublica.pt/dr/legislacao-consolidada/portaria/2001-177307831
   - **VERIFY:** High-value profession codes list

7. **IRS Jovem Schedule**
   - Source: Lei n.º 24-D/2024 (State Budget 2025), Article 200 & CIRS Article 2-B
   - Link: https://dre.pt/dre/legislacao-consolidada/lei/2024-926649154
   - **VERIFY:** 10-year progressive exemption schedule, €28,737.50 cap

8. **Solidarity Tax Thresholds**
   - Source: Lei n.º 82-B/2014, Article 191
   - Link: https://dre.pt/dre/legislacao-consolidada/lei/2014-58476020
   - **VERIFY:** Tier 1 (€80k-€250k @ 2.5%), Tier 2 (>€250k @ 5%)

**⚠️ CHECKPOINT:** Do you have ALL 8 primary sources open? If NO, STOP and gather them first.

---

### Step 1.2: Create Verification Spreadsheet

Create a spreadsheet with these columns:
- **Constant/Rate Name**
- **Official Value (from Primary Source)**
- **Calculator Value (to be tested)**
- **Match? (Yes/No)**
- **Source Article/Law**
- **Date Verified**

**Example Row:**
| Constant | Official Value | Calculator | Match | Source | Date |
|----------|----------------|------------|-------|--------|------|
| IRS Bracket 1 | 12.5% (€0-8,059) | [TEST] | [Y/N] | Lei 55-A/2025 Art 68º | 2025-XX-XX |

---

## Phase 2: Data Accuracy Verification (CRITICAL - DO THIS FIRST)

### Test 2.1: Tax Bracket Rates (ZERO TOLERANCE FOR ERRORS)

**Procedure:**
1. Open calculator's `data.js` or equivalent constants file
2. Locate `TAX_BRACKETS_2025` array or equivalent
3. Compare EACH rate against Lei 55-A/2025, Article 68.º

**Expected Values (2025):**
```
Bracket 1:  €0 - €8,059        → 12.5%  (NOT 13.0%)
Bracket 2:  €8,059 - €12,160   → 16.0%  (NOT 16.5%)
Bracket 3:  €12,160 - €17,233  → 21.5%  (NOT 22.0%)
Bracket 4:  €17,233 - €22,306  → 24.4%  (NOT 25.0%)
Bracket 5:  €22,306 - €28,400  → 31.4%  (NOT 32.0%)
Bracket 6:  €28,400 - €41,629  → 34.9%  (NOT 35.5%)
Bracket 7:  €41,629 - €44,987  → 43.1%  (NOT 43.5%)
Bracket 8:  €44,987 - €83,696  → 44.6%  (NOT 45.0%)
Bracket 9:  >€83,696           → 48.0%
```

**✅ PASS CRITERIA:** All 9 rates match EXACTLY. Even 0.1% difference = FAIL.

**❌ FAIL ACTION:** Flag as CRITICAL blocker. Calculator produces legally incorrect results.

---

### Test 2.2: Core Constants Verification

For EACH constant below, verify against primary source:

| Constant | Expected 2025 Value | Primary Source |
|----------|---------------------|----------------|
| IAS_2025 | €522.50 | Portaria 6-B/2025, Art. 2º |
| RMMG_2025 | €870.00 | Decreto-Lei 112/2024, Art. 3º |
| SS_Rate_SelfEmployed | 21.4% | Lei 110/2009, Art. 168º |
| SS_Rate_Employer | 23.75% | Lei 110/2009, Art. 53º |
| SS_Rate_Employee | 11% | Lei 110/2009, Art. 53º |
| IRS_Jovem_Cap | €28,737.50 | CIRS Art. 2-B |
| Solidarity_Tier1_Min | €80,000 | Lei 82-B/2014, Art. 191 |
| Solidarity_Tier1_Max | €250,000 | Lei 82-B/2014, Art. 191 |
| Solidarity_Tier1_Rate | 2.5% | Lei 82-B/2014, Art. 191 |
| Solidarity_Tier2_Min | €250,000 | Lei 82-B/2014, Art. 191 |
| Solidarity_Tier2_Rate | 5% | Lei 82-B/2014, Art. 191 |

**✅ PASS CRITERIA:** 100% match on all constants.

**❌ FAIL ACTION:** Each mismatch is a CRITICAL error.

---

### Test 2.3: IRS Jovem 10-Year Schedule Verification

Verify the progressive exemption schedule:

| Year | Expected Exemption % | Calculator Value | Match? |
|------|---------------------|------------------|--------|
| 1 | 100% | [TEST] | [Y/N] |
| 2 | 75% | [TEST] | [Y/N] |
| 3 | 50% | [TEST] | [Y/N] |
| 4 | 50% | [TEST] | [Y/N] |
| 5 | 25% | [TEST] | [Y/N] |
| 6-10 | 25% | [TEST] | [Y/N] |

**Source:** Lei 24-D/2024, Article 200

**✅ PASS CRITERIA:** All years match official schedule.

---

### Test 2.4: CAE Classification Version Check

**Critical Update:** CAE Rev. 4 became mandatory January 1, 2025.

**Procedure:**
1. Search calculator for "CAE Rev"
2. Check all references to INE classification system

**✅ PASS CRITERIA:** 
- All references say "CAE Rev. 4" or "CAE Rev. 4 (2025)"
- NO references to "CAE Rev. 3" unless explicitly historical
- Decreto-Lei 9/2025 is cited as current legal basis

**❌ FAIL CRITERIA:**
- Any reference to "CAE Rev. 3" as current
- No mention of Rev. 4
- Outdated INE links to Rev. 3 materials

---

## Phase 3: Government Source Link Verification

### Test 3.1: Link Quality Assessment

For EVERY government link in the calculator, verify:

**Criteria:**
1. **Primary Source?** Link goes to Diário da República or official .gov.pt page
2. **Specific?** Link points to exact article/portaria, not homepage
3. **Actionable?** Users can actually DO something (search, verify, register)
4. **Current?** Not pointing to outdated years/versions

**Examples:**

**✅ GOOD LINKS:**
- https://diariodarepublica.pt/dr/detalhe/portaria/6-b-2025-902111932
- https://www.gov.pt/servicos/abrir-atividade-nas-financas
- http://www.sicae.pt/consulta.aspx

**❌ BAD LINKS:**
- Generic PDFs with no context
- "About" pages with no specific data
- Broken/404 links
- Links to private tax blogs

**Scoring:**
- Count total government links in calculator
- Count how many meet ALL 4 criteria
- **PASS:** ≥80% of links are "GOOD"
- **FAIL:** <80% are "GOOD"

---

### Test 3.2: CAE/CIRS Resource Usability

**User Task:** "I'm a freelance web designer. How do I find my CAE/CIRS code?"

**Evaluate calculator's guidance:**

**✅ MUST INCLUDE:**
1. Portal das Finanças interactive search tool
2. SICAE lookup (for verification)
3. INE support contact (email/phone)
4. Explanation of CIRS vs CAE distinction
5. Link to Article 151 list (Portaria 1011/2001)

**❌ NOT SUFFICIENT:**
- Only generic INE PDF links
- Only "consult your accountant"
- Dead links or 404 errors

**PASS CRITERIA:** Calculator provides ≥3 actionable pathways to find CAE/CIRS code.

---

## Phase 4: Computational Accuracy Testing

**IMPORTANT:** Only proceed to this phase AFTER passing Phase 2 (Data Accuracy). 
If Phase 2 failed, calculations will be wrong regardless of logic.

### Test 4.1: Standard Scenarios (Cross-Check with Manual Calculation)

For EACH scenario below, calculate manually using official tax tables, then compare:

**Scenario 1: Freelancer, Simplified, No Benefits**
- Income: €50,000
- Activity: Article 151 (75% coefficient)
- Expenses: €2,500
- Deductions: Standard
- Expected: [Calculate using Lei 55-A/2025 rates]

**Scenario 2: Freelancer, IRS Jovem Year 1**
- Income: €30,000
- Activity: Article 151 (75% coefficient)
- Year: 1 (100% exemption)
- Expected: Exempt up to €28,737.50 cap

**Scenario 3: LDA, High Income, Solidarity Tax**
- Income: €150,000
- Structure: LDA
- Expected: Standard progressive + solidarity tier 1

**Scenario 4: Simplified Regime Limit Edge Case**
- Income: €200,000
- Regime: Simplified
- Expected: Warning/auto-switch behavior

**Scenario 5: Multi-Year Projection**
- Income: €60,000 year 1
- Growth: 5% annually
- Years: 10
- Expected: Verify Year 10 calculations

**✅ PASS CRITERIA:** Calculator results within €10 of manual calculation for all scenarios.

**❌ FAIL CRITERIA:** Any result differs by >€10 OR wrong direction (e.g., shows loss instead of profit).

---

### Test 4.2: Edge Cases & Boundary Conditions

Test these specific edge cases:

1. **Zero Income:** Does calculator handle €0 without errors?
2. **Bracket Boundaries:** Test income at exact bracket limits (€8,059, €12,160, etc.)
3. **Solidarity Tax Threshold:** Test €79,999 vs €80,001
4. **IRS Jovem Cap:** Test €28,737 vs €28,738 taxable income
5. **Simplified Limit:** Test €199,999 vs €200,001
6. **Negative Values:** Does calculator reject negative inputs?
7. **Extreme Income:** Test €10M+ (should not crash)

**✅ PASS CRITERIA:** All edge cases handled correctly with appropriate warnings/errors.

---

## Phase 5: Reference & Documentation Quality

### Test 5.1: Source Attribution Audit

For EACH number, formula, or constant displayed to users:

**Check:**
1. Is there a cited source?
2. Is the source primary (DRE/official) or secondary (blog)?
3. Is there a direct link to the source?
4. Is the article/law number specified?

**Sample Checklist:**
- [ ] Tax brackets show Lei 55-A/2025 citation
- [ ] IAS value links to Portaria 6-B/2025
- [ ] SS rates cite Lei 110/2009 with article numbers
- [ ] IRS Jovem cites CIRS Article 2-B
- [ ] Coefficient values cite CIRS Article 31

**PASS CRITERIA:** ≥90% of displayed constants have proper primary source citations.

---

### Test 5.2: Text Brevity (10-Word Rule)

**Rule:** Help text should be ≤15 words. Labels should be ≤10 words.

**Procedure:**
1. Count words in all `<p class="help-text">` elements
2. Count words in all `<label>` elements
3. Flag any exceeding limits

**✅ PASS CRITERIA:** 
- ≥80% of help texts ≤15 words
- ≥90% of labels ≤10 words

**Rationale:** Conciseness is a core tenet (audit requirement).

---

## Phase 6: Accessibility & WCAG Compliance

### Test 6.1: Automated Lighthouse Audit

**Procedure:**
```bash
npx lighthouse https://take-home-pt.netlify.app --only-categories=accessibility --output=json --output-path=./lighthouse-audit.json
```

**✅ PASS CRITERIA:** Score = 100/100 (WCAG 2.1 Level AA)

**Zero tolerance:** Any score <100 = FAIL

**Common Issues to Check:**
- Color contrast (4.5:1 for normal text, 3:1 for large text 18pt+)
- Focus indicators on all interactive elements
- ARIA labels on all inputs/buttons
- Semantic HTML (proper heading hierarchy)
- Keyboard navigation (no mouse-only functions)

---

### Test 6.2: Manual Accessibility Checks

1. **Keyboard Navigation:** Tab through entire calculator without mouse
2. **Screen Reader:** Test with NVDA/JAWS/VoiceOver
3. **High Contrast Mode:** Verify readability in Windows High Contrast
4. **Zoom:** Test at 200% zoom (WCAG requirement)

---

## Phase 7: UI/UX & Four Tenets Compliance

### Test 7.1: Four Tenets Verification

**1. Precision**
- [ ] All formulas are unambiguous
- [ ] No "magic numbers" (all constants defined)
- [ ] Single official source for each value

**2. Conciseness**
- [ ] Labels ≤10 words
- [ ] Help text ≤15 words
- [ ] Progressive disclosure (detail hidden until requested)

**3. Transparency**
- [ ] Every result shows formula
- [ ] Step-by-step breakdown visible
- [ ] Source links for all constants

**4. Reproducibility**
- [ ] Manual calculation possible from methodology
- [ ] All inputs and assumptions documented
- [ ] Version number visible

**PASS CRITERIA:** All 4 tenets score ≥9/10

---

### Test 7.2: Insurance Estimate Presentation

**Check:**
- [ ] Premium amounts shown as INTEGERS (no decimals)
- [ ] Clear "ROUGH ESTIMATE" disclaimer
- [ ] Variance range stated (±20-40%)
- [ ] Directs users to get real quotes

**Rationale:** Decimals imply false precision for estimates.

---

## Phase 8: Version Control & Traceability

### Test 8.1: Version Number Verification

**Check:**
1. Footer displays version (format: vYYYY.MM.DD.commithash)
2. Version increments with each code change
3. Git commit hash displayed (if using git)
4. "Last Updated" date visible

**✅ PASS CRITERIA:** Version visible and matches latest deployment.

---

### Test 8.2: Changelog/Audit Trail

**Check:**
1. Is there documentation of changes since last audit?
2. Are legislative updates tracked?
3. Is there a process for annual updates?

---

## Phase 9: Final Scoring & Reporting

### Scoring Rubric

| Category | Weight | Score (0-10) | Weighted |
|----------|--------|--------------|----------|
| **Data Accuracy (Phase 2)** | 40% | [SCORE] | [CALC] |
| **Government Sources (Phase 3)** | 15% | [SCORE] | [CALC] |
| **Computational Accuracy (Phase 4)** | 20% | [SCORE] | [CALC] |
| **Documentation Quality (Phase 5)** | 10% | [SCORE] | [CALC] |
| **Accessibility (Phase 6)** | 10% | [SCORE] | [CALC] |
| **Four Tenets (Phase 7)** | 5% | [SCORE] | [CALC] |
| **TOTAL** | 100% | | **/100** |

### Critical Failures (Auto-Fail Entire Audit)

**ANY of these = OVERALL FAIL, regardless of other scores:**
- ❌ Wrong tax bracket rates (Phase 2.1)
- ❌ Wrong IAS, RMMG, or SS rates (Phase 2.2)
- ❌ Outdated CAE version (Phase 2.4)
- ❌ Lighthouse Accessibility <100 (Phase 6.1)
- ❌ No version number displayed (Phase 8.1)

**Rationale:** These are LEGAL/REGULATORY compliance issues, not UX preferences.

---

## Audit Report Template

```markdown
# TakeHome PT Calculator Audit Report

**Auditor:** [Name]
**Date:** [YYYY-MM-DD]
**Version Audited:** [vYYYY.MM.DD.hash]
**Audit Routine Version:** 2.0

## Executive Summary
- **Overall Score:** [X]/100
- **Pass/Fail:** [PASS/FAIL]
- **Critical Issues Found:** [Count]
- **Recommendation:** [Production Ready / Requires Fixes / Major Issues]

## Phase 2: Data Accuracy (40 points)
**Score: [X]/10 → [Weighted]**

### Tax Brackets Verification
- Bracket 1 (12.5%): [✅ PASS / ❌ FAIL - Found: X%]
- Bracket 2 (16.0%): [✅ PASS / ❌ FAIL - Found: X%]
- [Continue for all 9 brackets]

**Primary Source Verified:** Lei 55-A/2025, Article 68º
**Link:** https://diariodarepublica.pt/dr/detalhe/lei/55-a-2025-925904929
**Date Accessed:** [YYYY-MM-DD]

### Core Constants
- IAS 2025: [✅ €522.50 / ❌ FAIL - Found: €X]
- RMMG 2025: [✅ €870 / ❌ FAIL - Found: €X]
- [Continue for all constants]

**Issues Found:** [List any discrepancies]

---

## Phase 3: Government Sources (15 points)
**Score: [X]/10 → [Weighted]**

**Link Quality:**
- Total links audited: [N]
- Primary sources: [N]
- Actionable tools: [N]
- Broken/outdated: [N]

**CAE Rev. 4 Status:** [✅ CURRENT / ❌ OUTDATED]

**Issues Found:** [List inadequate sources]

---

## Phase 4: Computational Accuracy (20 points)
**Score: [X]/10 → [Weighted]**

**Scenario Testing:**
| Scenario | Expected | Calculator | Difference | Pass? |
|----------|----------|------------|------------|-------|
| Freelancer €50k | €X | €Y | €Z | [Y/N] |
| IRS Jovem Y1 | €X | €Y | €Z | [Y/N] |
| [Continue for all scenarios]

**Edge Cases:** [X]/7 passed

**Issues Found:** [List calculation errors]

---

## Phase 5: Documentation (10 points)
**Score: [X]/10 → [Weighted]**

**Source Citations:** [X]% of constants properly cited
**Text Brevity:** [X]% help texts ≤15 words

**Issues Found:** [List documentation gaps]

---

## Phase 6: Accessibility (10 points)
**Score: [X]/10 → [Weighted]**

**Lighthouse Score:** [X]/100
**Manual Tests:** [X]/4 passed

**Issues Found:** [List WCAG violations]

---

## Phase 7: Four Tenets (5 points)
**Score: [X]/10 → [Weighted]**

- Precision: [X]/10
- Conciseness: [X]/10
- Transparency: [X]/10
- Reproducibility: [X]/10

---

## Critical Issues (MUST FIX)
1. [Issue description + severity + fix required]
2. [Issue description + severity + fix required]

## Minor Issues (SHOULD FIX)
1. [Issue description + recommendation]
2. [Issue description + recommendation]

## Recommendations
1. [Specific actionable recommendation]
2. [Specific actionable recommendation]

## Conclusion
[Summary paragraph on production readiness]

---

**Auditor Signature:** _________________
**Date:** [YYYY-MM-DD]
**Next Audit Due:** [YYYY-MM-DD]
```

---

## Appendix A: Auditor Checklist (Print This)

**Before starting audit:**
- [ ] Downloaded all 8 primary source documents
- [ ] Created verification spreadsheet
- [ ] Opened calculator in browser
- [ ] Opened calculator source code (if available)
- [ ] Noted version number being audited

**Phase 2 - Data Accuracy:**
- [ ] Verified all 9 tax bracket rates
- [ ] Verified IAS 2025
- [ ] Verified RMMG 2025
- [ ] Verified SS rates
- [ ] Verified IRS Jovem schedule
- [ ] Verified solidarity tax thresholds
- [ ] Checked CAE version (Rev. 4)

**Phase 3 - Government Sources:**
- [ ] Audited all government links
- [ ] Verified CAE/CIRS resource quality
- [ ] Checked for actionable tools

**Phase 4 - Computational:**
- [ ] Tested 5 standard scenarios
- [ ] Tested 7 edge cases
- [ ] Compared to manual calculations

**Phase 5 - Documentation:**
- [ ] Checked source citations
- [ ] Measured text brevity
- [ ] Verified methodology section

**Phase 6 - Accessibility:**
- [ ] Ran Lighthouse audit
- [ ] Tested keyboard navigation
- [ ] Tested screen reader

**Phase 7 - Four Tenets:**
- [ ] Scored Precision
- [ ] Scored Conciseness
- [ ] Scored Transparency
- [ ] Scored Reproducibility

**Phase 8 - Version Control:**
- [ ] Verified version display
- [ ] Checked changelog

**Final:**
- [ ] Calculated total score
- [ ] Checked for critical failures
- [ ] Completed audit report
- [ ] Submitted to client

---

## Appendix B: Annual Update Checklist

**Every January (before tax season):**
- [ ] Check for new State Budget law (Orçamento do Estado)
- [ ] Verify IRS brackets updated
- [ ] Verify IAS value updated
- [ ] Verify RMMG updated
- [ ] Check for Social Security rate changes
- [ ] Check for CAE classification updates
- [ ] Update all Diário da República links to current year
- [ ] Re-run full audit routine

**Legislative Trigger Events:**
- [ ] New State Budget published → Full data verification
- [ ] CAE revision announced → Update references
- [ ] Social Security reform → Verify rates
- [ ] IRS Jovem changes → Update schedule

---

## Version History

**v2.0 (2025-10-27)** - Complete rewrite after critical errors found
- Added mandatory Phase 2 (Data Accuracy First)
- Required primary source verification for ALL constants
- Added CAE Rev. 4 check
- Added critical failure criteria (auto-fail)
- Increased Data Accuracy weight to 40%
- Added detailed government source quality assessment

**v1.0 (2025-10-17)** - Original version
- Basic functionality testing
- Lighthouse accessibility check
- Light reference verification
- **INSUFFICIENT** - Missed 8 wrong tax rates

---

**END OF AUDIT ROUTINE V2.0**
