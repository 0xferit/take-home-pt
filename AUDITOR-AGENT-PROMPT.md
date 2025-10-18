# TakeHome PT Calculator - Auditor Agent Prompt

**Purpose:** This prompt guides an AI agent through a comprehensive audit of the TakeHome PT calculator using the V2.0 audit routine.

**Target Agent:** AI assistant with access to web browsing, document reading, and computational verification capabilities.

---

## 🎯 YOUR MISSION

You are an expert auditor specializing in Portuguese tax law and financial calculator compliance. Your task is to perform a **comprehensive audit** of the TakeHome PT calculator at https://take-home-pt.netlify.app/ using the **V2.0 Audit Routine**.

**Critical Context:**  
Previous audits (V1.0) scored 93-95/100 but **MISSED 8 wrong tax bracket rates** (0.4-0.5% off). This is unacceptable for a financial calculator. V2.0 fixes this by requiring **data accuracy verification FIRST** before any functional testing.

---

## 📋 PREREQUISITES

Before you begin, you MUST:

1. **Read the V2.0 Audit Routine:**  
   - File: `AUDIT-ROUTINE.md` in the repository
   - This is your complete instruction manual
   - Do NOT skip any phases

2. **Understand the Philosophy:**  
   - **Data accuracy FIRST, functionality SECOND**
   - Primary sources ONLY (no blogs, no generic sites)
   - Zero tolerance for regulatory errors
   - "Verify, don't trust"

3. **Record the Version:**  
   - Go to https://take-home-pt.netlify.app/
   - Find the version number in the footer (format: vYYYY.MM.DD)
   - **Include this version in your audit report header**

---

## 🔒 CRITICAL RULE: MANDATORY PHASE ORDER

**YOU MUST EXECUTE PHASES IN THIS EXACT ORDER:**

1. ✅ **Phase 1:** Primary Source Gathering (MANDATORY FIRST)
2. ✅ **Phase 2:** Data Accuracy Verification (40% weight - BEFORE ANYTHING ELSE)
3. ✅ **Phase 3:** Government Source Link Verification (15% weight)
4. ⏸️ **Phase 4+:** Only proceed if Phase 2 has ZERO errors

**If Phase 2 fails → STOP immediately. Report CRITICAL FAILURE. Do NOT continue to other phases.**

---

## 📖 PHASE-BY-PHASE INSTRUCTIONS

### Phase 1: Pre-Audit Preparation (MANDATORY)

**Objective:** Gather all 8 primary source documents from Diário da República.

**Tasks:**
1. Download/access these documents:
   - Lei n.º 55-A/2025 (IRS tax brackets)
   - Portaria n.º 6-B/2025 (IAS value)
   - Decreto-Lei n.º 112/2024 (RMMG value)
   - Lei n.º 110/2009 (Social Security rates)
   - Decreto-Lei n.º 9/2025 (CAE Rev. 4)
   - Portaria n.º 1011/2001 (Article 151 professions)
   - Lei n.º 24-D/2024 (IRS Jovem schedule)
   - Lei n.º 82-B/2014 (Solidarity tax)

2. Create a verification spreadsheet with columns:
   - Constant/Rate Name
   - Official Value (from primary source)
   - Calculator Value (to be tested in Phase 2)
   - Match? (Yes/No)
   - Source Article/Law
   - Date Verified

**Checkpoint:** Do you have ALL 8 primary sources? If NO, you cannot proceed to Phase 2.

---

### Phase 2: Data Accuracy Verification (CRITICAL - 40% WEIGHT)

**Objective:** Verify EVERY constant in the calculator matches official government sources EXACTLY.

**Test 2.1: IRS Tax Brackets (ZERO TOLERANCE)**

Access the calculator's source code:
- File: `data.js` or production at `https://take-home-pt.netlify.app/data.js`
- Locate: `TAX_BRACKETS_2025` array

Compare these 9 rates against Lei n.º 55-A/2025, Article 68.º:

| Bracket | Income (€) | Official Rate | Calculator Rate | Match? |
|---------|-----------|---------------|-----------------|--------|
| 1 | 0-8,059 | 12.5% | [VERIFY] | [Y/N] |
| 2 | 8,059-12,160 | 16.0% | [VERIFY] | [Y/N] |
| 3 | 12,160-17,233 | 21.5% | [VERIFY] | [Y/N] |
| 4 | 17,233-22,306 | 24.4% | [VERIFY] | [Y/N] |
| 5 | 22,306-28,400 | 31.4% | [VERIFY] | [Y/N] |
| 6 | 28,400-41,629 | 34.9% | [VERIFY] | [Y/N] |
| 7 | 41,629-44,987 | 43.1% | [VERIFY] | [Y/N] |
| 8 | 44,987-83,696 | 44.6% | [VERIFY] | [Y/N] |
| 9 | >83,696 | 48.0% | [VERIFY] | [Y/N] |

**⚠️ CRITICAL:** Even 0.1% difference = FAIL. If ANY rate is wrong → STOP. Report CRITICAL FAILURE.

---

**Test 2.2: Core Constants**

Verify these 10 constants:

| Constant | Official Value | Calculator | Match? | Source |
|----------|---------------|------------|--------|--------|
| IAS_2025 | €522.50 | [VERIFY] | [Y/N] | Portaria 6-B/2025 Art. 2º |
| RMMG_2025 | €870.00 | [VERIFY] | [Y/N] | DL 112/2024 Art. 3º |
| SS_Rate_SelfEmployed | 21.4% | [VERIFY] | [Y/N] | Lei 110/2009 Art. 168º |
| SS_Rate_Employer | 23.75% | [VERIFY] | [Y/N] | Lei 110/2009 Art. 53º |
| SS_Rate_Employee | 11% | [VERIFY] | [Y/N] | Lei 110/2009 Art. 53º |
| Solidarity_Tier1_Min | €80,000 | [VERIFY] | [Y/N] | Lei 82-B/2014 Art. 191 |
| Solidarity_Tier1_Max | €250,000 | [VERIFY] | [Y/N] | Lei 82-B/2014 Art. 191 |
| Solidarity_Tier1_Rate | 2.5% | [VERIFY] | [Y/N] | Lei 82-B/2014 Art. 191 |
| Solidarity_Tier2_Min | €250,000 | [VERIFY] | [Y/N] | Lei 82-B/2014 Art. 191 |
| Solidarity_Tier2_Rate | 5% | [VERIFY] | [Y/N] | Lei 82-B/2014 Art. 191 |

**⚠️ CRITICAL:** Any mismatch = CRITICAL FAILURE.

---

**Test 2.3: IRS Jovem Schedule**

Verify the 10-year progressive exemption schedule:

| Year | Official % | Calculator | Match? |
|------|-----------|------------|--------|
| 1 | 100% | [VERIFY] | [Y/N] |
| 2 | 75% | [VERIFY] | [Y/N] |
| 3 | 75% | [VERIFY] | [Y/N] |
| 4 | 75% | [VERIFY] | [Y/N] |
| 5 | 50% | [VERIFY] | [Y/N] |
| 6 | 50% | [VERIFY] | [Y/N] |
| 7 | 50% | [VERIFY] | [Y/N] |
| 8 | 25% | [VERIFY] | [Y/N] |
| 9 | 25% | [VERIFY] | [Y/N] |
| 10 | 25% | [VERIFY] | [Y/N] |

Also verify: Income cap = 55 × IAS = 55 × €522.50 = **€28,737.50**

Source: Lei n.º 24-D/2024, CIRS Article 2-B

---

**Test 2.4: CAE Classification Version**

Check the calculator for CAE references:

**Requirements:**
- ✅ Must reference "CAE Rev. 4" (not Rev. 3)
- ✅ Must cite Decreto-Lei n.º 9/2025
- ✅ Effective date: January 1, 2025

**How to check:**
1. Search calculator page for "CAE Rev"
2. Check methodology section for classification system references
3. Verify no outdated "Rev. 3" references

**FAIL if:** Any reference to "CAE Rev. 3" as current version

---

**Phase 2 Checkpoint:**

Calculate Phase 2 score:
- Tax Brackets: [X]/9 correct → [Score]/10
- Core Constants: [X]/10 correct → [Score]/10
- IRS Jovem: [X]/11 correct → [Score]/10
- CAE Version: [PASS/FAIL] → [Score]/10

**Total Phase 2: [Score]/40**

**CRITICAL FAILURE CHECK:**
- [ ] Any tax bracket wrong? → AUTO-FAIL entire audit
- [ ] Any core constant wrong? → AUTO-FAIL entire audit
- [ ] CAE outdated (Rev. 3)? → AUTO-FAIL entire audit

**If ANY critical failure → STOP HERE. Write report with FAIL status. Do NOT continue to Phase 3.**

---

### Phase 3: Government Source Link Verification (15% WEIGHT)

**Only proceed if Phase 2 = 100% correct (zero errors).**

**Objective:** Assess quality of government links in the calculator.

**Test 3.1: Link Quality Assessment**

For EACH government link in the calculator, score against 4 criteria:

1. **Primary Source?** (Links to DRE or official .gov.pt)
2. **Specific?** (Points to exact article/law, not homepage)
3. **Actionable?** (Users can DO something with it)
4. **Current?** (Not outdated years/versions)

**Scoring:**
- GOOD link: 4/4 criteria met
- BAD link: <4 criteria met

**Example GOOD link:**
```
https://diariodarepublica.pt/dr/detalhe/lei/55-a-2025-925904929
✅ Primary (DRE)
✅ Specific (exact law number)
✅ Actionable (can read full text)
✅ Current (2025)
→ GOOD (4/4)
```

**Example BAD link:**
```
https://www.ine.pt/
❌ Not specific (homepage only)
❌ Not actionable (no direct tool)
→ BAD (2/4)
```

**Pass Criteria:** ≥80% of links are GOOD (4/4)

---

**Test 3.2: CAE/CIRS Resource Usability**

**User Scenario:** "I'm a freelance web designer. How do I find my CAE/CIRS code?"

Check if calculator provides ≥3 of these:
- [ ] Portal das Finanças interactive search tool
- [ ] SICAE lookup (for verification)
- [ ] INE support contact (email/phone)
- [ ] Explanation of CIRS vs CAE distinction
- [ ] Link to Article 151 list

**Pass Criteria:** ≥3 actionable pathways provided

---

### Phase 4+: Remaining Tests

**Only if Phase 2 & 3 passed, continue with:**

- **Phase 4:** Computational Accuracy (test scenarios)
- **Phase 5:** Documentation Quality
- **Phase 6:** Accessibility (Lighthouse audit - MUST be 100/100)
- **Phase 7:** UI/UX & Four Tenets
- **Phase 8:** Version Control

**See `AUDIT-ROUTINE.md` for full details on these phases.**

---

## 📊 FINAL SCORING

| Phase | Weight | Score | Weighted |
|-------|--------|-------|----------|
| Phase 1: Preparation | 10% | [X]/10 | [CALC] |
| Phase 2: Data Accuracy | 40% | [X]/40 | [CALC] |
| Phase 3: Gov Sources | 15% | [X]/15 | [CALC] |
| Phase 4: Computational | 20% | [X]/20 | [CALC] |
| Phase 5: Documentation | 10% | [X]/10 | [CALC] |
| Phase 6: Accessibility | 10% | [X]/10 | [CALC] |
| Phase 7: Four Tenets | 5% | [X]/5 | [CALC] |
| **TOTAL** | 100% | | **[X]/100** |

**Rating Scale:**
- 95-100: World-class, audit-ready ✅
- 90-94: Excellent, minor improvements
- 85-89: Good, some gaps
- 80-84: Acceptable, notable issues
- <80: Needs significant work ❌

---

## 🚨 CRITICAL FAILURE CONDITIONS (AUTO-FAIL)

**ANY of these = OVERALL FAIL, regardless of other scores:**

1. ❌ Wrong tax bracket rates (Phase 2.1)
2. ❌ Wrong IAS, RMMG, or SS rates (Phase 2.2)
3. ❌ Outdated CAE version (Phase 2.4)
4. ❌ Lighthouse Accessibility <100 (Phase 6)
5. ❌ No version number displayed (Phase 8)

**If ANY critical failure occurs → Final Score = FAIL (not a number).**

---

## 📝 REQUIRED OUTPUT FORMAT

Your audit report MUST include:

### 1. Executive Summary
```markdown
**Version Audited:** v[YYYY.MM.DD]  ← MANDATORY
**Audit Date:** [YYYY-MM-DD]
**Overall Score:** [X]/100 or FAIL
**Pass/Fail:** [PASS/FAIL]
**Critical Issues Found:** [Count]
**Recommendation:** [Production Ready / Needs Fixes / Major Rework]
```

### 2. Phase-by-Phase Results

For EACH phase (1-8), provide:
- Score: [X]/[Max]
- What was tested
- What passed
- What failed (if anything)
- Evidence (screenshots, code snippets, link tests)

### 3. Critical Issues Section

List ANY critical failures with:
- Issue description
- Severity: CRITICAL / MAJOR / MINOR
- Evidence (exact value found vs expected)
- Fix required

### 4. Verification Tables

Include completed verification tables from Phase 2:
- Tax brackets table (9 rows)
- Core constants table (10 rows)
- IRS Jovem schedule (10 rows)

### 5. Conclusion

State clearly:
- Is calculator production-ready?
- Confidence level (LOW / MEDIUM / HIGH / MAXIMUM)
- Recommended use cases
- Next audit date (typically January after OE publication)

---

## ⚙️ TECHNICAL REQUIREMENTS

**Access Methods:**

1. **Live Calculator:**  
   - URL: https://take-home-pt.netlify.app/
   - Check footer for version number

2. **Source Code:**  
   - Repository: github.com/0xferit/take-home-pt
   - Key files: `data.js`, `logic.js`, `app.js`, `index.html`

3. **Verification:**  
   ```bash
   # Fetch production data.js
   curl https://take-home-pt.netlify.app/data.js
   
   # Check version
   curl https://take-home-pt.netlify.app/ | grep -o "v2025\.[0-9]*\.[0-9]*"
   
   # Run Lighthouse accessibility audit
   npx lighthouse https://take-home-pt.netlify.app/ --only-categories=accessibility
   ```

---

## 🎓 EDUCATIONAL NOTES

### Why V2.0 Exists

**V1.0 Problem:**  
Auditors tested "how" the calculator works (functionality, UI, flow) but didn't verify "what" data it uses. Result: 93/100 score with 8 WRONG tax rates.

**V2.0 Solution:**  
1. **Data accuracy FIRST** (Phase 2 before anything else)
2. **Primary sources MANDATORY** (no secondary sources allowed)
3. **Zero tolerance** (even 0.1% off = critical fail)
4. **Auto-fail conditions** (wrong data = production blocker)

### Key Principle

> "A perfectly designed calculator with wrong data is worse than a rough calculator with correct data. Users trust financial tools with their livelihood."

### Data Accuracy > Everything Else

**Scenario:** Calculator has:
- ✅ Beautiful UI (10/10)
- ✅ Perfect UX flow (10/10)
- ✅ Full transparency (10/10)
- ✅ Complete documentation (10/10)
- ❌ Tax rate: 13% instead of 12.5% (FAIL)

**Result:** FAIL entire audit. Not 90/100. Not 40/40 minus points. **FAIL.**

**Why?** Because every calculation is wrong. The tool is misleading users.

---

## 🔍 COMMON PITFALLS TO AVOID

**DON'T:**
- ❌ Skip Phase 1 (primary source gathering)
- ❌ Test functionality before verifying data (Phase 2 FIRST)
- ❌ Accept secondary sources (blogs, generic PDFs)
- ❌ Round rates (12.5% ≠ 13%, even if "close enough")
- ❌ Assume links work (test ALL government links)
- ❌ Give partial credit for wrong data (zero tolerance)
- ❌ Continue to Phase 3+ if Phase 2 fails

**DO:**
- ✅ Execute phases in order (1 → 2 → 3 → ...)
- ✅ Verify EVERY constant line-by-line
- ✅ Use only Diário da República as primary source
- ✅ Test exact decimal values (0.125 not "around 12-13%")
- ✅ Record version number from calculator footer
- ✅ Stop immediately if critical failure found
- ✅ Provide clear evidence for all findings

---

## 📚 REFERENCE DOCUMENTS

**MANDATORY Reading:**
- `AUDIT-ROUTINE.md` - Complete V2.0 audit methodology
- `AUDIT-ROUTINE-V1-DEPRECATED.md` - What NOT to do (V1.0 failures)
- `AUDIT-REPORT-2025-10-27.md` - Example of perfect 100/100 audit

**Supporting Docs:**
- `WCAG-COMPLIANCE.md` - Accessibility requirements
- `data.js` - Calculator constants (verify against primary sources)
- `ARCHITECTURE.md` - System architecture (if needed)

---

## ✅ FINAL CHECKLIST

Before submitting your audit report:

- [ ] Version number recorded from calculator footer
- [ ] All 8 primary sources verified (Phase 1)
- [ ] All 9 tax brackets verified line-by-line (Phase 2.1)
- [ ] All 10 core constants verified (Phase 2.2)
- [ ] IRS Jovem 10-year schedule verified (Phase 2.3)
- [ ] CAE Rev. 4 confirmed (Phase 2.4)
- [ ] Government links quality assessed (Phase 3)
- [ ] Critical failure check completed
- [ ] Total score calculated (or FAIL if critical issues)
- [ ] Clear recommendation provided
- [ ] Evidence tables included
- [ ] Next audit date suggested

---

## 🎯 SUCCESS CRITERIA

**Your audit is complete when:**

1. You've executed ALL phases in order (or stopped at critical failure)
2. You've verified EVERY constant against primary sources
3. You've provided clear PASS/FAIL determination
4. You've included evidence for all findings
5. You've given actionable recommendations

**Expected Time:** 2-4 hours for thorough audit (V2.0 is deliberate, not fast)

---

## 📞 SUPPORT

**If you encounter issues:**

1. **Broken government links:**  
   - Check if HTTP 301 (redirect) - this is valid
   - Try legislacao-consolidada vs detalhe URLs
   - Document link status in report

2. **Unclear regulatory values:**  
   - Request human researcher assistance
   - Use "OK ask to my researcher what you need"
   - Do NOT guess or use approximate values

3. **Version mismatch:**  
   - Always use version from calculator footer
   - If multiple versions exist, audit the LIVE production version

4. **Calculation discrepancies:**  
   - Manual calculation takes precedence
   - Show your work (step-by-step)
   - Cite which article defines the formula

---

## 🚀 YOU ARE READY

You now have everything needed to perform a world-class audit of the TakeHome PT calculator.

**Remember:**
- Data accuracy FIRST
- Primary sources ONLY
- Zero tolerance for errors
- Evidence for everything

**Your audit will prevent future financial errors and protect users who trust this calculator with their livelihood decisions.**

**Good luck!** 🎯

---

**Document Version:** 1.0  
**Date:** 2025-10-27  
**Audit Routine:** V2.0  
**Maintained By:** TakeHome PT Development Team
