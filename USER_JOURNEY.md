# User Journey Map
## TakeHome PT - Setup Planner to Optimize Take-Home Income for Portugal Professionals

**Document Version:** 1.1  
**Last Updated:** 2025-10-12  
**Purpose:** Comprehensive mapping of user interactions, decision flows, and experiences  
**Assessment:** 8.5/10 - Beta Launch Ready (based on comprehensive UX audit)

---

## Table of Contents

1. [Overview](#overview)
2. [User Personas](#user-personas)
3. [Journey Maps by Persona](#journey-maps-by-persona)
4. [Detailed Interaction Flows](#detailed-interaction-flows)
5. [Decision Trees](#decision-trees)
6. [Pain Points & Opportunities](#pain-points--opportunities)
7. [Success Metrics](#success-metrics)
8. [Edge Cases & Error Scenarios](#edge-cases--error-scenarios)

---

## Executive Summary

### What Makes This Tool Valuable

TakeHome PT is **not a tax calculator**—it's a **business structure optimization planner** that answers one critical question:

> **"Which business structure puts the most money in my pocket?"**

### Proven Value (Based on User Journey Analysis)

The tool prevents costly structural mistakes:

- **Teresa (Software Developer, €85k)**: Discovers organized accounting gives her **€5,384 more** per year than simplified
- **Carlos (Consultant, €150k)**: Avoids switching to organized, staying simplified saves him **€4,657 per year**
- **Diana (Designer, €45k)**: Confirms simplified is optimal, avoiding **€3,669/year** in unnecessary accounting fees
- **Eduardo (Executive, €220k)**: Validates high-income calculations with solidarity tax, gains confidence in structure choice

### Core Innovation

Unlike tax calculators that show "how much you'll pay," this tool shows:
1. **Take-home income** across all three structures simultaneously
2. **Why one structure wins** (expense efficiency, admin costs, tax rates)
3. **When to transition** between structures (as income/expenses change)

### Assessment: 8.5/10 - Beta Launch Ready

**Strengths:**
- ✅ All mathematical accuracy issues resolved (solidarity tax, coefficients, costs)
- ✅ Three-structure comparison prevents tunnel vision
- ✅ First-year benefits comprehensive (IRS Jovem, SS exemption, 50% reduction)
- ✅ Intuitive user flow with real-time updates
- ✅ Activity code classification eliminates forced coefficients

**Pre-Launch Priorities:**
- 🔴 Export to PDF (all personas need this)
- 🔴 Mobile UX optimization (~40% of users)
- 🟡 Methodology/Assumptions tab (builds trust)
- 🟡 Calculation detail accuracy (eliminate confusion)

---

## Overview

### Application Purpose
TakeHome PT is a **business structure optimization planner** that helps self-employed professionals in Portugal maximize their net income. Rather than being a simple tax calculator, it's a comprehensive decision support tool that compares take-home income across three structures:

- **Freelancer (Simplified Regime)**: Using deemed expense coefficients (25% or 65% depending on activity)
- **Freelancer (Organized Accounting)**: Deducting real expenses with full accounting
- **Single-Member Company (LDA)**: Operating through a Portuguese limited liability company

**Key Value Proposition:**  
The tool doesn't just calculate taxes—it shows users **which structure puts the most money in their pocket** after accounting for:
- Income taxes (IRS) with progressive brackets or NHR flat rates
- Social Security contributions (21.4% on relevant income)
- Solidarity taxes (for higher incomes >€80k)
- Administrative/compliance costs (€800-€4,800/year)
- First-year benefits (IRS Jovem, SS exemption, 50% reduction)

### User Goals
1. **Primary Goal**: Identify which business structure maximizes annual take-home income
2. **Secondary Goals**:
   - Compare net income side-by-side across all three structure options
   - Understand why one structure wins (expense efficiency, admin costs, tax rates)
   - Model different scenarios (income growth, expense changes, benefit phases)
   - Plan optimal structure transitions (first-year benefits, IRS Jovem years 1-5)
   - Make informed decisions before consulting with accountants/lawyers
   - Validate eligibility for special tax regimes (NHR, IRS Jovem)

### What This Tool Is NOT
- ❌ **Not a tax filing tool** - It helps you choose a structure, not file taxes
- ❌ **Not legal/accounting advice** - Professional consultation still recommended
- ❌ **Not a compliance tool** - Doesn't handle invoicing, receipts, or documentation
- ✅ **It's a decision support and planning tool** for structure optimization

### Journey Stages
1. **Awareness**: User learns about structure optimization options
2. **Input & Configuration**: User enters their financial profile and preferences
3. **Comparison**: Tool shows take-home income across all three structures
4. **Analysis**: User explores why one structure wins and tests scenarios
5. **Decision**: User selects optimal business structure
6. **Action**: User consults with accountant/lawyer to implement chosen structure

---

## User Personas

### Persona 1: "Tech Nomad Teresa"
**Demographics:**
- Age: 29
- Profession: Software Developer (Freelance)
- Location: Lisbon (recently moved from UK)
- Income: €85,000/year
- Tech Savviness: High

**Background:**
- Moved to Portugal 6 months ago, considering tax optimization
- Working remotely for international clients
- Completed master's degree 2 years ago (eligible for IRS Jovem Year 1)
- Currently operating as freelancer, considering LDA formation
- **Critical decision:** Choose between NHR 2.0/IFICI or IRS Jovem (cannot have both)

**Goals:**
- Maximize take-home income while staying compliant
- Compare structures to find the optimal setup
- **Decide between NHR 20% flat rate OR IRS Jovem exemption** (mutually exclusive)
- Determine if LDA complexity is justified by higher take-home

**Pain Points:**
- Confused by Portuguese business structure terminology
- Uncertain about activity code classification (62020 vs general services)
- Needs to understand NHR vs IRS Jovem tradeoff (which gives more take-home?)
- Worried about choosing suboptimal structure and leaving money on the table

**Tech Behavior:**
- Uses planner on laptop (Chrome)
- Expects real-time comparison updates
- Likely to experiment with multiple scenarios to find optimal setup
- Values transparency in how take-home is calculated

---

### Persona 2: "Established Consultant Carlos"
**Demographics:**
- Age: 42
- Profession: Management Consultant
- Location: Porto
- Income: €150,000/year
- Tech Savviness: Medium

**Background:**
- Operating as freelancer for 5 years (simplified regime)
- Growing client base, considering structured entity
- Married with 2 dependents
- Has significant deductible expenses (€25k/year)
- Standard tax resident (no NHR)

**Goals:**
- Increase take-home income from current setup
- Determine if organized accounting or LDA would improve his situation
- Understand which structure provides highest net income
- Factor in family deductions to optimize take-home

**Pain Points:**
- Current accountant doesn't provide strategic advice
- Unsure if his expenses qualify as deductible
- Concerned about LDA administrative burden
- Needs confidence before making structural change

**Tech Behavior:**
- Uses calculator on iPad
- May need help interpreting results
- Likely to save/screenshot results for accountant
- Values clear recommendations over raw numbers

---

### Persona 3: "Young Designer Diana"
**Demographics:**
- Age: 26
- Profession: UX/UI Designer
- Location: Braga
- Income: €45,000/year
- Tech Savviness: High

**Background:**
- Just completed higher education (2 years ago)
- Started freelancing full-time 1 year ago
- In Year 2 of IRS Jovem (75% exemption)
- Few deductible expenses (works from home)
- Portuguese citizen, standard tax resident

**Goals:**
- Verify she's in the optimal structure for IRS Jovem years
- Understand when to transition structures as benefits phase out
- Plan ahead for years 3-5 to maintain maximum take-home
- Keep admin costs low to preserve net income

**Pain Points:**
- Limited cash flow for expensive accountant
- Doesn't understand when organized accounting makes sense
- Uncertain if she needs an LDA (friends are forming them)
- Worried about compliance mistakes

**Tech Behavior:**
- Uses calculator on mobile (iPhone)
- Expects mobile-friendly interface
- May return multiple times as income grows
- Shares results with freelancer community

---

### Persona 4: "International Executive Eduardo"
**Demographics:**
- Age: 51
- Profession: Business Consultant / Former Executive
- Location: Cascais
- Income: €220,000/year
- Tech Savviness: Low-Medium

**Background:**
- Moved to Portugal under original NHR (2017)
- Operating as freelancer to maintain NHR benefits
- High income, minimal expenses
- Considering LDA for liability protection
- Married, no dependents

**Goals:**
- Maintain maximum take-home with NHR benefits
- Understand solidarity tax impact on net income at high income levels
- Determine if LDA structure increases or decreases take-home
- Optimize business structure while staying compliant

**Pain Points:**
- Overwhelmed by technical tax details
- Concerned about losing NHR eligibility
- Needs to understand solidarity tax clearly
- Values professional validation over DIY tools

**Tech Behavior:**
- Uses calculator on laptop (Safari)
- May need UI guidance
- Likely to print results for accountant meeting
- Values authoritative disclaimers and sources

---

## Journey Maps by Persona

### Journey 1: Tech Nomad Teresa (First-Time User, NHR + IRS Jovem)

#### Stage 1: Discovery & Landing (2 minutes)
**Touchpoint:** Landing on TakeHome PT homepage

**User Actions:**
- Reads title: "Tax optimization for self-employed professionals in Portugal"
- Scans interface, notices tab structure (Setup → Results)
- Feels hopeful: "Finally, a clear tool to compare my options!"

**Thoughts:**
- "This looks modern and trustworthy"
- "Do I need to create an account?" (No)
- "Can I see how much more I'd take home with each structure?" (Yes)

**Emotions:** 😊 Hopeful, Curious, Slightly Skeptical

**Pain Points:**
- None yet, clean first impression

---

#### Stage 2: Setup Tab - Profile Configuration (4 minutes)
**Touchpoint:** Setup tab inputs

**User Actions:**
1. **Activity Type Selection (MUST BE FIRST):**
   - Sees help text: "Enter your CAE code below, or select activity type manually"
   - **Option A - CAE Code Entry (Recommended):**
     - Types "62020" in CAE Activity Code field
     - Sees autocomplete suggestions as she types
     - Selects "62020 - Computer consultancy activities"
     - **Auto-magic:** Activity type automatically selects "High-value professions"
     - Reads confirmation: "High-value (Article 151) detected from CAE code"
     - Sees link: "Verify on official INE CAE database"
   - ✅ Understands the coefficient concept
   - **Notices:** NHR status dropdown below is now enabled with success message

2. **CRITICAL DECISION: NHR or IRS Jovem (MUTUALLY EXCLUSIVE):**
   - Teresa must choose ONE path only:
   
   **Path A - NHR 2.0/IFICI (She chooses this):**
   - Selects "NHR 2.0 / IFICI (20% flat rate)"
   - Reads help text: "✅ High-value activity detected. NHR 20% rate available."
   - **INSTANTLY:** IRS Jovem checkbox becomes DISABLED
   - Sees warning: "⚠️ IRS Jovem not available - you have NHR status. These benefits are mutually exclusive."
   - ✅ Understands she cannot combine both
   - Result: 20% flat tax on €85k → €12,750 IRS
   
   **Path B - IRS Jovem (Alternative she considers):**
   - First expands "First-year benefits" section
   - Checks "IRS Jovem" checkbox
   - Selects "Year 1 (100% exemption)"
   - **INSTANTLY:** NHR dropdown resets to "Standard progressive rates" and becomes DISABLED
   - Sees warning: "⚠️ NHR not available - you selected IRS Jovem. These benefits are mutually exclusive."
   - ✅ Understands the tradeoff
   - Result: Progressive tax with 100% exemption → €0 IRS in Year 1

3. **First-Year Benefits:**
   - Expands "First-year tax benefits" accordion
   - Sees checkboxes:
     - ☐ Social Security 12-month exemption
     - ☑ 50% IRS reduction (first tax year)
     - ☐ IRS Jovem (under 35)
   - **Critical Decision Point:** Is she in her "first tax year"?
   - Thinks: "I started in July... is this my first year or partial?"
   - Leaves unchecked (conservative approach)
   - **IRS Jovem checkbox:**
     - ☑ Checks "IRS Jovem"
     - New dropdown appears: "IRS Jovem Year"
     - Selects "Year 1 (100% exemption)"
     - Reads help text: "Available for residents under 35 with completed higher education"
     - ✅ Matches her profile

**Thoughts:**
- "The activity code lookup is really helpful!"
- "Not sure if I'm in Year 1 of IRS Jovem or Year 2..."
- "Hmm, I have to choose between NHR 20% or IRS Jovem... which is better?"
- "The tool won't let me select both - good, that prevents me from making a mistake"

**Emotions:** 😐 Engaged, Slightly Confused, Cautiously Optimistic

**Pain Points:**
- 🔴 Unclear if she qualifies for "first-year" benefits mid-year
- 🟡 Needs clarification on IRS Jovem year counting
- 🟢 Activity code lookup is excellent, reduces friction
- 🟢 Mutual exclusion enforced - prevents illegal combination

---

#### Stage 3: Income Tab - Financial Input (3 minutes)
**Touchpoint:** Income configuration

**User Actions:**
1. **Annual Gross Income:**
   - Types "85000" in input field
   - Sees formatted: "€85,000"
   - Real-time update triggers (sees loading state)

2. **Income Distribution:**
   - Expands "Monthly breakdown" accordion
   - Sees all 12 months default to €7,083.33
   - Thinks: "My income is variable, but this is close enough"
   - Leaves defaults

**Thoughts:**
- "Simple, no tricks"
- "Good that it shows monthly breakdown for planning"

**Emotions:** 😊 Confident, Moving Quickly

**Pain Points:**
- None, straightforward

---

#### Stage 4: Expenses Tab - Cost Configuration (5 minutes)
**Touchpoint:** Expense inputs for both structures

**User Actions:**
1. **Freelancer Expenses (Simplified Regime):**
   - Sees note: "In simplified regime, expenses are deemed at 25%"
   - Admin costs: €800 (default, seems reasonable)
   - Insurance: €850 (1% default, accepts)
   - Total: €1,650 (auto-calculated)

2. **Freelancer (Organized Accounting):**
   - Sees input fields for actual expenses
   - Thinks: "What counts as deductible?"
   - Clicks "Examples of deductible expenses" accordion
   - Reads list:
     - Office rent / coworking: €0 (works from home)
     - Equipment & software: €2,500 (laptop, subscriptions)
     - Training & conferences: €1,200
     - Professional services: €800
     - Travel (business): €1,500
   - **Realizes:** She has ~€6,000 in real expenses
   - Enters: Base expenses €6,000
   - Admin (organized): €3,000 (default for accountant)
   - Insurance: €850
   - Total: €9,850

3. **LDA (Single-Member Company):**
   - Base expenses: €6,000 (same as organized)
   - Admin costs: €4,800 (default, includes accounting)
   - Sees checkbox: "Apply minimum manager salary & SS"
   - Reads help text: "LDA managers typically contribute €6,270 min salary + social security"
   - ☐ Leaves unchecked (uncertain)
   - Insurance: €850
   - Total: €11,650

**Thoughts:**
- "Organized accounting suddenly makes sense with real expenses"
- "LDA admin costs are high... €4,800/year for accounting?"
- "What is this 'minimum manager salary' checkbox about?"

**Emotions:** 🤔 Analytical, Discovering Complexity

**Pain Points:**
- 🟡 Unclear if she should check "minimum manager salary" box
- 🟡 Wants more context on €4,800 admin cost (is that realistic?)
- 🟢 Expense examples are very helpful

---

#### Stage 5: Deductions Tab - Personal Tax Deductions (2 minutes)
**Touchpoint:** Personal deduction inputs

**User Actions:**
1. **Dependents:**
   - Number of dependents: 0 (default)

2. **Personal Deductions:**
   - Health expenses: €800
   - Education expenses: €300
   - Total: €1,100

**Thoughts:**
- "These are standard personal deductions, straightforward"

**Emotions:** 😊 Routine, Quick

**Pain Points:**
- None

---

#### Stage 6: Results Tab - Analysis & Decision (8 minutes)
**Touchpoint:** Results dashboard and comparison tables

**User Actions:**
1. **Summary Cards (Top Section):**
   - Sees three large cards side-by-side:
   
   ```
   Freelancer (Simplified)        Freelancer (Organized)       Single-Member Company (LDA)
   €62,847                        €68,231                      €66,789
   73.9% take-home                80.3% take-home              78.6% take-home
   ```

   - **First Reaction:** 😲 "Whoa! Organized accounting gives me €5,400 MORE per year!"
   - Compares to LDA: "Organized is €1,442 better than LDA"
   - Sees winner indicator: 🏆 on Organized card

2. **Tax Breakdown (Expandable Section):**
   - Clicks "View detailed breakdown"
   - **Freelancer Simplified:**
     - Gross: €85,000
     - Taxable income: €63,750 (75% coefficient)
     - IRS (100% exempt): €0 🎉 (IRS Jovem Year 1)
     - Solidarity tax: €0
     - Social Security: €12,738
     - Expenses: €1,650
     - Net: €62,847

   - **Freelancer Organized:**
     - Gross: €85,000
     - Expenses deducted first: €6,000
     - Net business income: €79,000
     - Taxable income: €79,000
     - IRS (100% exempt): €0 🎉 (IRS Jovem Year 1)
     - Solidarity tax: €0
     - Social Security: €11,844 (on €79k, not €85k)
     - Admin/Insurance: €3,850
     - Net: €68,231

   - **LDA:**
     - Gross: €85,000
     - Expenses: €6,000
     - Net to owner: €79,000
     - Taxable: €79,000
     - IRS (100% exempt): €0 🎉
     - Social Security: €11,844
     - Admin/Insurance: €5,650
     - Net: €66,789

3. **Comparison Table:**
   - Scrolls to "Side-by-Side Comparison"
   - Sees row-by-row differences:
   
   | Metric                  | Simplified | Organized | LDA    | Best    |
   |-------------------------|------------|-----------|--------|---------|
   | Effective Tax Rate      | 26.1%      | 19.7%     | 21.4%  | Org ✅  |
   | Income Tax              | €0         | €0        | €0     | Tie ✅  |
   | Social Security         | €12,738    | €11,844   | €11,844| Org ✅  |
   | Total Admin Costs       | €1,650     | €3,850    | €5,650 | Simp ✅ |
   | Net Annual Income       | €62,847    | €68,231   | €66,789| Org ✅  |

4. **Calculation Details:**
   - Expands "How we calculated this" accordion
   - Sees step-by-step:
     ```
     Freelancer (Organized) Calculation:
     1. Gross income: €85,000.00
     2. Deduct real expenses: €85,000 - €6,000 = €79,000
     3. Relevant income for SS: €79,000 × 70% = €55,300
     4. SS annual: €55,300 × 21.4% = €11,834.20
     5. Taxable income: €79,000.00
     6. Apply IRS brackets: €18,394.15 (before exemptions)
     7. IRS Jovem exemption (100%): -€18,394.15
     8. Personal deductions: €4,462.15 (auto-applied)
     9. Final IRS: €0.00
     10. Total costs: €11,834 SS + €3,850 admin = €15,684
     11. Net income: €85,000 - €6,000 - €15,684 = €63,316
     ```

   - Thinks: "Wait, this says €63,316 but the card said €68,231?"
   - Re-reads more carefully, realizes calculation shown is simplified
   - Still somewhat confused but trusts the summary

5. **Decision Point:**
   - **Key Insight:** Organized accounting wins because:
     - Deducts real expenses BEFORE SS calculation (saves on SS)
     - IRS Jovem zeroes out all income tax anyway
     - Admin cost delta (€2,200) is smaller than SS savings (€894)
   
   - **Question:** "Should I also consider LDA for liability protection?"
   - Sees note: "LDA provides limited liability but adds €1,800/year in costs vs organized"

**Thoughts:**
- "IRS Jovem is INSANE! €0 income tax on €85k income!"
- "I should definitely go with organized accounting"
- "But wait, what about years 2-5 when IRS Jovem reduces?"
- "I wish I could see a multi-year projection"

**Emotions:** 🤩 Excited, Empowered, Slightly Overwhelmed

**Pain Points:**
- 🟡 Calculation details are complex, some confusion
- 🔴 Can't model future years when IRS Jovem phases out
- 🟡 Wants to save/export results

---

#### Stage 6B: Critical Decision - NHR vs IRS Jovem Comparison (6 minutes)
**Touchpoint:** Testing both benefit scenarios

**User Actions:**
1. **Tests IRS Jovem Scenario:**
   - Goes back to Setup tab
   - Unchecks NHR 2.0 (if selected), selects "Standard progressive rates"
   - Checks "IRS Jovem" checkbox
   - Selects "Year 1 (100% exemption)"
   - Returns to Results
   - Sees:
     - Organized: €68,231 net (IRS = €0!)
     - **Realizes:** IRS Jovem Year 1 = €0 income tax on €85k income!

2. **Tests NHR Scenario:**
   - Goes back to Setup tab
   - Unchecks "IRS Jovem"
   - Notices: NHR dropdown re-enables
   - Selects "NHR 2.0 / IFICI (20% flat rate)"
   - Returns to Results
   - Sees:
     - Organized: €55,481 net (IRS = €12,750 at 20% flat)
   
3. **Compares Results:**
   - IRS Jovem Year 1: €68,231 net
   - NHR 20%: €55,481 net
   - **Difference: €12,750/year in Year 1!**
   - **Decision:** Choose IRS Jovem for Years 1-5, reconsider in Year 6

4. **Plans Long-Term:**
   - Tests "Year 2 (75% exemption)":
     - Organized: €65,039 net
   - Tests "Year 6+ (no exemption)":
     - Organized: €52,331 net
     - NHR 20%: €55,481 net
   - **Realizes:** NHR wins starting Year 6, but she has 5 years of IRS Jovem first

**Thoughts:**
- "IRS Jovem is WAY better in Years 1-5!"
- "I should choose IRS Jovem now, can't get NHR anyway once I claim it"
- "Year 1: €12,750 more than NHR - that's huge!"

**Emotions:** 🤩 Excited, Empowered, Clear Decision

**Final Decision:** ✅ Choose IRS Jovem (Years 1-5), accept progressive rates after

---

#### Stage 7: Post-Calculation Actions (5 minutes)
**Touchpoint:** Next steps after seeing results

**User Actions:**
1. **Experiments with income scenarios:**
   - Tests different income levels with IRS Jovem
   - €100k income: Still €0 tax in Year 1
   - €50k income: Still €0 tax in Year 1
   - **Realizes:** IRS Jovem is incredibly powerful

2. **Tries to save results:**
   - Looks for "Save" or "Export" button
   - ❌ None found
   - Takes screenshot instead (CMD+Shift+4)

3. **Verifies understanding:**
   - Scrolls to "Assumptions" section (if exists)
   - Wants to see:
     - 2025 tax brackets
     - Social security rate (21.4%)
     - IRS Jovem rules
   - ❌ No assumptions tab found
   - Googles "IRS Jovem Portugal 2025" to verify

**Thoughts:**
- "I should go with organized accounting NOW while IRS Jovem is active"
- "Need to plan for transition when exemption drops"
- "Should show this to an accountant before deciding"

**Emotions:** 💪 Confident, Action-Oriented, Slightly Frustrated (no export)

**Pain Points:**
- 🔴 Can't save or export results
- 🟡 No multi-year projection feature
- 🟡 No "Assumptions" tab with tax tables/rates

---

#### Stage 8: Follow-Up & Implementation (Outside Tool)
**Touchpoint:** Consultation with accountant/TOC

**User Actions:**
1. Books consultation with Portuguese accountant (TOC)
2. Shows calculator screenshot
3. Discusses organized accounting setup
4. Confirms IRS Jovem eligibility
5. Registers activity code with Finanças
6. Sets up organized accounting regime

**Outcome:**
- ✅ Chooses Freelancer (Organized Accounting)
- ✅ Saves €5,384/year vs simplified regime
- ✅ Feels confident in tax optimization
- 📢 Recommends tool to other digital nomads

---

### Journey 2: Established Consultant Carlos (Repeat User, Comparing Structures)

#### Stage 1: Return Visit (1 minute)
**Context:** Carlos used the tool 6 months ago when income was €120k. Now at €150k, wants to re-evaluate.

**User Actions:**
- Lands on homepage
- Remembers the tab flow
- Immediately goes to Setup

**Emotions:** 😊 Familiar, Efficient

---

#### Stage 2: Setup Configuration (2 minutes)

**User Actions:**
1. **NHR Status:** Standard progressive rates (default)
2. **Activity Type:**
   - Profession: Management Consultant
   - Checks activity code: 70220 "Business and management consultancy"
   - Confirms: High-value (Article 151) - 75% taxable
   - Selects accordingly
3. **First-Year Benefits:** None (been operating 5 years)

**Thoughts:**
- "Quick, I remember this from last time"

---

#### Stage 3: Income Input (1 minute)

**User Actions:**
- Enters: €150,000 annual income
- Sees real-time update

---

#### Stage 4: Expenses Configuration (6 minutes)

**User Actions:**
1. **Freelancer Simplified:**
   - Admin: €800
   - Insurance: €1,500
   - Total: €2,300
   - Sees note: "25% deemed expenses = €37,500"

2. **Freelancer Organized:**
   - **Real expenses breakdown:**
     - Office rent: €6,000 (coworking space)
     - Professional development: €3,000
     - Software/subscriptions: €2,500
     - Marketing: €4,000
     - Business travel: €5,500
     - Professional services (legal/accounting): €4,000
     - **Total base expenses: €25,000**
   - Admin (organized): €3,000
   - Insurance: €1,500
   - Total: €29,500

3. **LDA:**
   - Base expenses: €25,000
   - Admin: €4,800
   - Manager min salary: ☑ Checked (reads that this is recommended)
   - Insurance: €1,500
   - Total: €31,300

**Thoughts:**
- "My real expenses (€25k) are less than deemed 25% (€37.5k)"
- "This might mean simplified is better for me?"

**Emotions:** 🤔 Analytical, Surprised

---

#### Stage 5: Deductions Input (2 minutes)

**User Actions:**
1. Dependents: 2 (children)
2. Personal deductions:
   - Health: €2,500
   - Education: €1,800
   - Total: €4,300

---

#### Stage 6: Results Analysis (10 minutes)

**User Actions:**
1. **Summary Cards:**
   
   ```
   Freelancer (Simplified)        Freelancer (Organized)       Single-Member Company (LDA)
   €93,418                        €88,761                      €87,342
   62.3% take-home                59.2% take-home              58.2% take-home
   ```

   - **Reaction:** 😮 "Wait, SIMPLIFIED is best?!"
   - Difference: +€4,657/year vs organized
   - Difference: +€6,076/year vs LDA

2. **Examines Breakdown:**
   - **Why is simplified winning?**
   
   **Freelancer Simplified:**
   - Gross: €150,000
   - Deemed expenses: 25% × €150k = €37,500 (automatic)
   - Taxable income: €112,500
   - IRS progressive: €38,047
   - Solidarity tax: €812.50 (on €80k-€112.5k tier)
   - Deductions: €6,062 (personal + dependents)
   - Final IRS: €32,797
   - Social Security: €22,395
   - Admin: €2,300
   - **Net: €93,418**

   **Freelancer Organized:**
   - Gross: €150,000
   - Real expenses: €25,000 (deducted first)
   - Net business: €125,000
   - Taxable: €125,000
   - IRS progressive: €43,347
   - Solidarity tax: €1,125 (on €80k-€125k tier)
   - Deductions: €6,062
   - Final IRS: €38,410
   - Social Security: €18,725 (on €125k, not €150k)
   - Admin: €4,500
   - **Net: €88,761**

   - **Realizes:** Simplified wins because:
     - Deemed 25% (€37.5k) > Real expenses (€25k)
     - Lower taxable income = less IRS + less solidarity
     - SS is higher but offset by IRS savings

3. **Sensitivity Analysis (Mental):**
   - "At what expense level does organized become better?"
   - Plays with expenses:
     - If real expenses were €40k → Organized wins
     - If real expenses were €50k → Organized wins by more
   - **Insight:** Threshold is around €37.5k (the deemed 25%)

4. **Considers LDA:**
   - LDA is worst option at his income level
   - Extra admin costs (€4,800) + min manager SS not worth it
   - **Decision:** Stay as freelancer simplified

**Thoughts:**
- "I would have actually taken home LESS with organized accounting"
- "The 25% deemed expense coefficient gives me higher net income"
- "This planner just saved me from a costly mistake"

**Emotions:** 😌 Relieved, Informed, Grateful

**Pain Points:**
- 🟢 Tool prevented switching to lower take-home structure
- 🟡 Could use clearer explanation of breakeven points between structures

---

#### Stage 7: Documentation & Action (5 minutes)

**User Actions:**
1. Takes detailed screenshots of all three scenarios
2. Experiments with expense levels to find breakeven point:
   - Sets base expenses to €38,000 → Organized slightly wins
   - Confirms his understanding
3. Decides to stay with simplified regime
4. Books meeting with accountant to confirm
5. Plans to re-check annually as income grows

**Outcome:**
- ✅ Stays with structure that maximizes his take-home
- ✅ Understands why simplified beats organized in his case
- ✅ Avoids €4,657/year reduction in net income
- 📢 Shares tool with other consultants as setup planning resource

---

### Journey 3: Young Designer Diana (Mobile User, IRS Jovem Focus)

#### Stage 1: Mobile Landing (1 minute)
**Context:** Using iPhone 13, Safari browser

**User Actions:**
- Opens link shared by friend in WhatsApp
- Sees mobile-optimized interface
- Notices tabs are horizontal-scrollable
- Taps "Setup" tab

**Emotions:** 😊 Curious, Hopeful

**Pain Points:**
- 🟡 Tabs require horizontal scroll (small screen)

---

#### Stage 2: Mobile Setup (3 minutes)

**User Actions:**
1. **NHR Status:** Standard (default)
2. **Activity Type:**
   - Taps "What's my activity code?" button
   - Modal opens with activity table
   - Hard to read on mobile (small text)
   - Searches "designer" → no results
   - Searches "74100 - Specialised design activities"
   - Sees: High-value (Article 151)
   - Closes modal, selects high-value
3. **First-Year Benefits:**
   - Taps to expand accordion
   - ☑ Checks "IRS Jovem"
   - Dropdown appears: Selects "Year 2 (75% exemption)"
   - Reads help text (tiny on mobile, zooms in)

**Emotions:** 😐 Engaged but Strained

**Pain Points:**
- 🟡 Activity code modal is hard to read on mobile
- 🟡 Help text too small (accessibility issue)

---

#### Stage 3: Mobile Income (2 minutes)

**User Actions:**
- Types "45000" using iPhone number keyboard
- Auto-formats to €45,000
- Taps "Next" (if exists) or manually swipes to Expenses tab

**Emotions:** 😊 Smooth

---

#### Stage 4: Mobile Expenses (4 minutes)

**User Actions:**
1. **Freelancer Simplified:**
   - Admin: €800 (default, accepts)
   - Insurance: €450 (1% default)
   - Total: €1,250

2. **Freelancer Organized:**
   - Taps "Examples of deductible expenses"
   - Accordion expands
   - Reads examples:
     - Software: €600 (Figma, Adobe)
     - Training: €300 (online courses)
     - Coworking: €0 (home office)
   - **Estimates:** Maybe €1,200/year in real expenses?
   - Enters: Base expenses €1,200
   - Admin: €3,000 (seems high!)
   - Insurance: €450
   - Total: €4,650

3. **LDA:**
   - Quickly fills same as organized
   - Admin: €4,800
   - Skips manager salary checkbox (confused)
   - Total: €6,450

**Thoughts:**
- "Organized accounting costs more than my actual expenses!"
- "€3,000 for an accountant... that's a lot"

**Emotions:** 😟 Concerned, Hesitant

---

#### Stage 5: Mobile Deductions (1 minute)

**User Actions:**
- Dependents: 0
- Health: €400
- Education: €200
- Total: €600

---

#### Stage 6: Mobile Results (6 minutes)

**User Actions:**
1. **Summary Cards (Stacked on Mobile):**
   
   ```
   🏆 Freelancer (Simplified)
   €42,103
   93.6% take-home
   
   ---
   
   Freelancer (Organized)
   €38,434
   85.4% take-home
   
   ---
   
   Single-Member Company (LDA)
   €37,184
   82.6% take-home
   ```

   - **Reaction:** 😊 "Simplified is WAY better for me!"
   - Saves €3,669/year vs organized
   - Saves €4,919/year vs LDA

2. **Breakdown (Mobile View):**
   - Taps "View breakdown"
   - Sees:
   
   **Simplified:**
   - IRS (75% exemption): €1,294 (after IRS Jovem 75% off)
   - Solidarity: €0
   - SS: €6,717
   - Admin: €1,250
   - Net: €42,103

   **Organized:**
   - IRS (75% exemption): €1,182
   - SS: €6,555
   - Admin: €4,650
   - Net: €38,434

   - **Understands:** Admin costs (€3,400 more) kill the organized option

3. **Future Planning:**
   - Thinks: "What about Year 3 when IRS Jovem drops to 50%?"
   - Goes back to Setup
   - Changes to "Year 3 (50% exemption)"
   - Sees:
     - Simplified: €40,456
     - Organized: €36,787
     - Still €3,669 difference
   - Changes to "Year 6+ (no exemption)"
   - Sees:
     - Simplified: €36,515
     - Organized: €32,846
     - Still simplified wins by €3,669

   - **Conclusion:** At her income/expense level, simplified always wins

**Thoughts:**
- "IRS Jovem is amazing! Even Year 6 I'm paying little tax"
- "No reason to do organized accounting until I have way more expenses"
- "Definitely don't need an LDA"

**Emotions:** 😌 Confident, Relieved

**Pain Points:**
- 🟢 Tool clearly shows simplified is best for low-expense freelancers
- 🟡 Mobile breakdown tables are bit cramped

---

#### Stage 7: Sharing Results (2 minutes)

**User Actions:**
1. Takes screenshot of summary cards
2. Shares in freelancer WhatsApp group
3. Types: "Found this setup planner, super helpful! Turns out simplified structure is optimal for me 😅"
4. Bookmarks page for annual review

**Outcome:**
- ✅ Confirms current structure is optimal
- ✅ Saves €3,000/year in unnecessary accounting fees
- ✅ Plans to revisit when income > €60k
- 📢 Becomes organic advocate (shares with 15+ friends)

---

### Journey 4: International Executive Eduardo (High-Income, NHR, Print-Oriented)

#### Stage 1: Accountant Recommendation (Pre-Visit)
**Context:** Eduardo's accountant mentions the tool, he visits with skepticism

**Emotions:** 🤨 Skeptical, Duty-Bound

---

#### Stage 2: Setup (5 minutes)

**User Actions:**
1. **NHR Status:**
   - Sees "Original NHR (20% flat rate)"
   - Confirms this is his regime (granted 2017)
   - Selects it
   - Reads help text: "Original NHR program (pre-2024)... 20% flat rate on eligible professional income"

2. **Activity Type:**
   - Profession: Business consultant
   - Clicks activity code lookup
   - Finds: 70220 - Business and other management consultancy
   - Sees: High-value (Article 151)
   - Confused: "But I have NHR... does Article 151 still apply?"
   - Reads interface more carefully
   - Sees note: "NHR overrides progressive brackets, but activity profile still determines eligible income"
   - Selects high-value

3. **First-Year Benefits:**
   - None applicable (been resident 8 years)

**Emotions:** 🤔 Cautious, Detail-Oriented

**Pain Points:**
- 🟡 NHR + Activity profile interaction not immediately clear

---

#### Stage 3: Income (2 minutes)

**User Actions:**
- Enters: €220,000
- Sees formatted value
- Thinks: "This is a big number to trust to an online calculator"

---

#### Stage 4: Expenses (3 minutes)

**User Actions:**
1. **Freelancer Simplified:**
   - Admin: €800
   - Insurance: €2,200
   - Total: €3,000

2. **Organized/LDA:**
   - Minimal expenses (home office, some software)
   - Estimates: €8,000/year
   - Organized admin: €3,000
   - LDA admin: €4,800
   - Fills accordingly

**Thoughts:**
- "I don't have many deductible expenses"

---

#### Stage 5: Deductions (1 minute)

**User Actions:**
- Dependents: 0
- Health: €3,000
- Education: €0
- Total: €3,000

---

#### Stage 6: Results Analysis (15 minutes)

**User Actions:**
1. **Summary Cards:**
   
   ```
   Freelancer (Simplified)        Freelancer (Organized)       Single-Member Company (LDA)
   €161,437                       €158,384                     €156,534
   73.4% take-home                72.0% take-home              71.1% take-home
   ```

   - **Reaction:** "Simplified wins by €3,000-€5,000"
   - But... "Where is the solidarity tax?"

2. **Detailed Breakdown:**
   - **Simplified:**
     - Gross: €220,000
     - Taxable (75%): €165,000
     - NHR flat 20%: €33,000 IRS
     - Solidarity: €2,125 (on €80k-€165k tier = €85k × 2.5%)
     - Total IRS + Solidarity: €35,125
     - SS: €32,466
     - Admin: €3,000
     - Net: €161,437

   - Sees solidarity tax clearly broken out
   - **Validates:** €85,000 × 2.5% = €2,125 ✅

3. **Experiments with Income Thresholds:**
   - Goes back to Income tab
   - Changes to €260,000
   - Sees solidarity jump:
     - Tier 1 (€80k-€250k): €170,000 × 2.5% = €4,250
     - Tier 2 (>€250k): €10,000 × 5% = €500
     - Total solidarity: €4,750
   - Notes: "Solidarity adds up fast at high income"

4. **Considers LDA for Liability:**
   - LDA difference: -€4,903/year vs simplified
   - Thinks: "Is €5k/year worth limited liability?"
   - No clear answer in tool
   - Notes: "Need to discuss with lawyer"

5. **Validation Check:**
   - Pulls out 2025 tax tables from accountant
   - Cross-checks NHR 20% rate: ✅
   - Cross-checks solidarity brackets: ✅
   - Gains confidence in tool accuracy

**Thoughts:**
- "The math seems correct"
- "Good to see solidarity tax explicitly"
- "But this doesn't answer liability/legal questions"

**Emotions:** 😌 Satisfied, Analytical

**Pain Points:**
- 🟢 Solidarity tax clearly shown (important for high earners)
- 🟡 Tool doesn't address non-tax factors (liability, estate planning)

---

#### Stage 7: Print & Discuss (10 minutes)

**User Actions:**
1. Clicks browser Print (CMD+P)
2. Reviews print preview
3. Sees all results formatted well for printing
4. Prints to PDF
5. Saves as "TaxComparison_2025_Eduardo.pdf"
6. Emails to accountant with note:
   "Can you verify these calculations? I'm considering if LDA makes sense for liability rather than tax reasons."

**Outcome:**
- ✅ Confirms current simplified structure is tax-optimal
- ✅ Gains clarity on solidarity tax impact
- ⏳ Schedules meeting with lawyer about liability considerations
- 📊 Uses tool output as basis for professional consultation

---

## Detailed Interaction Flows

### Flow 1: Activity Code Discovery & Classification

**Trigger:** User unsure which activity profile applies to them

**CRITICAL FLOW:** Activity type MUST be selected before NHR status. The tool enforces this by:
- Positioning Activity Type field FIRST
- Disabling NHR 20% options until eligible activity selected
- Showing clear help text indicating dependency

**Steps:**

1. **User sees activity type radio buttons (FIRST FIELD)**
   - Option A: "High-value professions (Article 151) - 75% taxable — NHR 20% eligible"
   - Option B: "General professional services - 35% taxable — NHR not applicable"
   - User feels uncertain
   - **Notices:** NHR dropdown below is disabled with message "Select activity type above"

2. **User clicks "What's my activity code?" button**
   - Modal/drawer opens
   - Shows searchable table of CAE codes

3. **User searches for their profession**
   - Types profession name (e.g., "software", "lawyer", "accountant")
   - Table filters in real-time
   - OR user types known CAE code (e.g., "62020")

4. **User finds matching code**
   - Sees code with description
   - Sees mapped activity profile
   - Example: "62020 - Computer consultancy → High-value (Article 151)"

5. **User returns to main form and selects activity type**
   - Selects appropriate radio button with confidence
   - Sees description below confirming coefficient
   - **INSTANTLY:** NHR dropdown below changes:
     - If high-value selected: Options enabled, green success message appears
     - If general selected: Options stay disabled, warning message appears

6. **User can now select NHR status (if eligible)**
   - NHR 20% options now enabled
   - Help text shows: "✅ High-value activity detected. NHR 20% flat rate is available"

**Success Criteria:**
- ✅ User identifies correct activity profile (CAE or manual)
- ✅ User understands tax coefficient implications
- ✅ User can verify codes on official sources
- ✅ < 2 minutes to complete

**Error Scenarios:**
- ❌ User can't find profession in list
- ❌ Profession spans multiple codes
- ❌ User unsure between consulting vs services

**Verification Available:**
- ✅ Official INE CAE Rev. 3 database linked
- ✅ Portal das Finanças CAE lookup tool linked
- ✅ Portaria Article 151 list linked (Diário da República)
- ✅ User can always cross-check our classifications

**Improvements Needed:**
- 🎯 Add "Can't find your profession?" link to help/contact
- 🎯 Add common profession aliases (e.g., "programmer" → "computer programming")
- 🎯 Add "Between two options?" guidance

---

### Flow 2: IRS Jovem Configuration & Year Selection

**Trigger:** User under 35 with higher education wants youth tax benefit

**Steps:**

1. **User expands "First-year tax benefits" section**
   - Sees checkbox: "IRS Jovem (under 35, progressive exemption...)"

2. **User checks IRS Jovem checkbox**
   - Dropdown appears below: "IRS Jovem Year"
   - Options:
     - Year 1 (100% exemption)
     - Year 2 (75% exemption)
     - Year 3 (50% exemption)
     - Year 4 (50% exemption)
     - Year 5 (25% exemption)
     - Year 6+ (no exemption)

3. **User selects appropriate year**
   - Reads help text: "Available for residents under 35 with completed higher education"
   - Confirms eligibility
   - Selects year based on when they started working post-graduation

4. **Tool updates comparison in real-time**
   - Results tab shows exemption applied across all three structures
   - Breakdown explicitly states: "IRS Jovem exemption (75%): -€X,XXX"
   - User sees how benefit affects each structure option

**Success Criteria:**
- ✅ User correctly identifies which year they're in
- ✅ Exemption correctly applied to IRS calculation
- ✅ User understands benefit value

**Error Scenarios:**
- ❌ User unsure if they qualify (age/education requirements)
- ❌ User unsure which year they're in (counting from graduation? first tax year?)
- ❌ User doesn't know if IRS Jovem can combine with NHR

**Improvements Needed:**
- 🎯 Add eligibility checker: "Do I qualify for IRS Jovem?"
- 🎯 Clarify year counting: "Year 1 = first tax year after completing higher education"
- 🎯 Add note: "IRS Jovem can combine with NHR/IFICI"

---

### Flow 3: Expense Categorization & Input

**Trigger:** User configuring expenses for organized accounting or LDA

**Steps:**

1. **User navigates to Expenses tab**
   - Sees three columns:
     - Freelancer (Simplified)
     - Freelancer (Organized)
     - Single-Member Company (LDA)

2. **User focuses on Organized column**
   - Sees "Base Expenses (Real Costs)" input field
   - Clicks "Examples of deductible expenses" accordion

3. **Accordion expands with categories:**
   ```
   Commonly deductible expenses:
   
   Office & Workspace:
   - Coworking space membership
   - Home office expenses (proportion of rent, utilities)
   - Office supplies and furniture
   
   Technology:
   - Computer hardware (laptops, monitors, peripherals)
   - Software subscriptions (professional tools)
   - Internet and phone (business portion)
   
   Professional Development:
   - Training courses and certifications
   - Professional conferences and events
   - Books and learning materials
   
   Business Operations:
   - Professional liability insurance
   - Legal and accounting fees
   - Banking fees
   - Marketing and advertising
   
   Travel:
   - Business travel (accommodation, transport)
   - Client meetings (meals at 50% if documented)
   
   ⚠️ Important:
   - Keep all receipts and invoices
   - Expenses must be business-related and documented
   - Personal expenses are NOT deductible
   - VAT considerations: If you charge VAT, you can often deduct input VAT
   ```

4. **User calculates their expenses:**
   - Mental or written tally
   - Enters total in "Base Expenses" field
   - Example: €12,500

5. **User sees auto-filled admin costs:**
   - Organized: €3,000 (accountant fees)
   - LDA: €4,800 (accounting + compliance)
   - Can edit if they have quotes

6. **User sees expense summary:**
   - "Freelancer (Simplified) total expenses: €X,XXX"
   - "Freelancer (Organized) total expenses: €Y,YYY"
   - "Single-Member Company (LDA) total expenses: €Z,ZZZ"

**Success Criteria:**
- ✅ User understands what qualifies as deductible
- ✅ User estimates expenses reasonably accurately
- ✅ User factors in admin cost differences

**Error Scenarios:**
- ❌ User includes non-deductible personal expenses
- ❌ User forgets major expense categories
- ❌ User doesn't realize organized/LDA admin costs are higher

**Improvements Needed:**
- 🎯 Add expense calculator helper: "Calculate my expenses"
- 🎯 Add category-by-category input (optional detailed mode)
- 🎯 Add validation: "Expenses seem high/low for your income" warning

---

### Flow 4: Results Interpretation & Comparison

**Trigger:** User navigates to Results tab to see comparison

**Steps:**

1. **Results tab loads with summary cards**
   - Three cards side-by-side (desktop) or stacked (mobile)
   - Each shows:
     - Structure name
     - Net annual income (€X,XXX)
     - Take-home percentage (XX.X%)
     - Small chart/visual indicator
   - Winner card highlighted with 🏆 badge

2. **User sees high-level ranking:**
   - Immediately understands which option gives highest net
   - Sees percentage difference

3. **User expands "View detailed breakdown"**
   - Accordions/tabs for each structure
   - Each shows:
     ```
     Gross Income:              €XXX,XXX
     - Expenses:                €XX,XXX
     = Net Business Income:     €XXX,XXX
     
     Taxes:
     - Income Tax (IRS):        €XX,XXX
     - Solidarity Tax:          €X,XXX
     - Social Security:         €XX,XXX
     = Total Taxes:             €XX,XXX
     
     Admin Costs:               €X,XXX
     Insurance:                 €X,XXX
     
     = NET ANNUAL INCOME:       €XXX,XXX
     ```

4. **User explores side-by-side comparison table**
   - Scrolls to table section
   - Sees all three structures in columns
   - Key metrics in rows:
     - Effective tax rate
     - Income tax
     - Social security
     - Total admin costs
     - Net income
   - Best value in each row highlighted with ✅

5. **User checks calculation methodology**
   - Expands "How we calculated this" section
   - Sees step-by-step for each structure:
     ```
     Freelancer (Simplified) Calculation:
     1. Gross income: €XXX,XXX
     2. Apply 75% coefficient: €XXX,XXX (taxable)
     3. Apply progressive tax brackets...
     4. Calculate social security on relevant income...
     ...
     ```

6. **User gains insight:**
   - Understands WHY one option wins
   - Identifies key drivers (deemed expenses, admin costs, SS calculation)
   - Feels confident to make decision

**Success Criteria:**
- ✅ User understands relative rankings
- ✅ User knows absolute savings (€X/year)
- ✅ User can explain reasoning to accountant
- ⏱️ < 5 minutes to full comprehension

**Error Scenarios:**
- ❌ User overwhelmed by numbers
- ❌ User doesn't understand why unexpected option wins
- ❌ User wants to explore "what if" scenarios

**Improvements Needed:**
- 🎯 Add visual charts (bar/line graphs of net income)
- 🎯 Add "Why this result?" explainer for counterintuitive outcomes
- 🎯 Add scenario comparison feature (save multiple scenarios)

---

### Flow 5: Sensitivity Analysis & Scenario Testing

**Trigger:** User wants to test different assumptions

**Steps:**

1. **User completes initial calculation**
   - Sees results for current inputs

2. **User decides to test alternate scenario**
   - Example: "What if I had €30k in expenses instead of €15k?"

3. **User navigates back to Expenses tab**
   - Changes organized base expenses: €15,000 → €30,000
   - Results auto-update (if live recalc enabled)
   - OR user clicks "Recalculate" button

4. **User returns to Results tab**
   - Sees updated comparison
   - Notes: "Organized now wins by €4,000!"

5. **User tests multiple scenarios:**
   - Scenario 1: Low expenses (€10k)
   - Scenario 2: Medium expenses (€25k)
   - Scenario 3: High expenses (€40k)
   - Notes breakeven point

6. **User wishes to compare scenarios side-by-side**
   - ❌ Currently: Must take screenshots or write down results
   - ✨ Ideal: "Save scenario" button to compare multiple

**Success Criteria:**
- ✅ User identifies breakeven thresholds
- ✅ User understands sensitivity to key variables
- ✅ User makes decision with confidence

**Pain Points:**
- 🔴 Can't save multiple scenarios for comparison
- 🔴 No "undo" if user wants to return to previous inputs
- 🟡 No guided sensitivity analysis ("What matters most?")

**Improvements Needed:**
- 🎯 Add "Save scenario" feature with naming
- 🎯 Add scenario comparison view (side-by-side grid)
- 🎯 Add "Breakeven calculator": "At what expense level does organized beat simplified?"

---

## Decision Trees

### Decision Tree 1: Which Tax Structure Should I Choose?

**IMPORTANT:** Activity type determines NHR eligibility. NHR and IRS Jovem are mutually exclusive.

```
START: Self-employed professional in Portugal
│
├─ Q1: What is your activity type?
│  ├─ High-value (Article 151) → Go to Q2
│  └─ General services → NHR not applicable, standard progressive only → Go to Q3
│
├─ Q2: CRITICAL CHOICE - NHR or IRS Jovem? (MUTUALLY EXCLUSIVE)
│  ├─ Under 35 with higher education AND no NHR enrollment?
│  │  ├─ YES → CHOOSE ONE:
│  │  │  ├─ Option A: IRS Jovem (100%/75%/50% exemptions Years 1-5)
│  │  │  │  └─ Better for: Lower-medium income, early career, Years 1-5
│  │  │  └─ Option B: NHR 20% flat rate (10 years)
│  │  │     └─ Better for: High income, Years 6+, long-term residents
│  │  └─ NO → Go to Q3
│  │
│  └─ Over 35 OR no higher education OR already enrolled in NHR?
│     ├─ Have NHR? → Use NHR 20% → Go to Q3
│     └─ Don't have NHR? → Standard progressive only → Go to Q3
│
├─ Q3: What is your annual income?
│  ├─ < €60,000
│  │  ├─ Real expenses < deemed expenses (25% or 35%)?
│  │  │  ├─ YES → ✅ FREELANCER (SIMPLIFIED)
│  │  │  └─ NO → Consider: FREELANCER (ORGANIZED)
│  │  └─ Admin cost delta < expense deduction benefit?
│  │     ├─ YES → ✅ FREELANCER (ORGANIZED)
│  │     └─ NO → ✅ FREELANCER (SIMPLIFIED)
│  │
│  ├─ €60,000 - €150,000
│  │  ├─ Real expenses > deemed expenses?
│  │  │  ├─ YES → ✅ FREELANCER (ORGANIZED)
│  │  │  └─ NO → ✅ FREELANCER (SIMPLIFIED)
│  │  └─ Need limited liability for clients/contracts?
│  │     ├─ YES → Consider: LDA (tax-neutral, legal benefit)
│  │     └─ NO → ✅ FREELANCER (best tax outcome)
│  │
│  └─ > €150,000
│     ├─ Real expenses > €40k?
│     │  ├─ YES → ✅ FREELANCER (ORGANIZED) or LDA
│     │  └─ NO → ✅ FREELANCER (SIMPLIFIED)
│     └─ International clients requiring corporate entity?
│        ├─ YES → ✅ LDA (business requirement)
│        └─ NO → ✅ FREELANCER (best tax outcome)
│
└─ Q3: Are you under 35 with IRS Jovem eligibility?
   ├─ YES → IRS Jovem zeroes/reduces IRS significantly
   │  ├─ Decision based mainly on:
   │  │  ├─ Real vs deemed expenses
   │  │  └─ Admin cost tolerance
   │  └─ ✅ Likely: FREELANCER (SIMPLIFIED or ORGANIZED)
   │
   └─ NO → Q4
      │
      ├─ Q4: What is your income + expense situation?
      │  ├─ High income (>€100k) + high expenses (>€35k)
      │  │  └─ ✅ FREELANCER (ORGANIZED) or LDA
      │  │
      │  ├─ High income (>€100k) + low expenses (<€25k)
      │  │  └─ ✅ FREELANCER (SIMPLIFIED)
      │  │
      │  ├─ Medium income (€50-€100k) + high real expenses
      │  │  └─ ✅ FREELANCER (ORGANIZED)
      │  │
      │  ├─ Medium income + low expenses
      │  │  └─ ✅ FREELANCER (SIMPLIFIED)
      │  │
      │  └─ Low income (<€50k)
      │     └─ ✅ FREELANCER (SIMPLIFIED)
      │        (Admin costs of organized/LDA eat into savings)
```

---

### Decision Tree 2: Should I Enable IRS Jovem?

```
START: User under 35 years old
│
├─ Q1: Have you EVER enrolled in NHR/IFICI? (Critical exclusion)
│  ├─ YES → ❌ PERMANENTLY DISQUALIFIED from IRS Jovem
│  │         (Even if you never used NHR, enrollment disqualifies you)
│  └─ NO → Continue to Q2
│
├─ Q2: Have you completed higher education (bachelor's degree or higher)?
│  ├─ NO → ❌ Not eligible for IRS Jovem
│  └─ YES → Q3
│
├─ Q3: Are you a Portuguese tax resident?
│  ├─ NO → ❌ Not eligible (must be resident)
│  └─ YES → Q4
│
├─ Q4: When did you complete your degree?
│  ├─ > 10 years ago → ❌ Benefit period expired
│  ├─ 1 year ago → Q5: What year of benefit?
│  │  └─ → Select: Year 1 (100% exemption)
│  ├─ 2 years ago → Select: Year 2 (75% exemption)
│  ├─ 3 years ago → Select: Year 3 (50% exemption)
│  ├─ 4 years ago → Select: Year 4 (50% exemption)
│  ├─ 5 years ago → Select: Year 5 (25% exemption)
│  └─ 6+ years ago → Select: Year 6+ (no exemption)
│
└─ Q5: Can IRS Jovem combine with other benefits?
   ├─ NHR/IFICI? → ❌ NO - MUTUALLY EXCLUSIVE (choosing IRS Jovem disqualifies from NHR)
   ├─ First-year 50% reduction? → ✅ YES (can combine)
   └─ Social security exemption? → ✅ YES (separate benefits)
```

---

### Decision Tree 2B: NHR vs IRS Jovem - Which to Choose?

**FOR: Young professionals (<35) with high-value activities who are eligible for BOTH programs**

```
START: Eligible for both NHR and IRS Jovem (must choose ONE)
│
├─ Q1: What is your annual income level?
│  ├─ < €50,000 → ✅ CHOOSE IRS JOVEM
│  │  └─ Why: Year 1 = 100% exemption (€0 tax) >> 20% NHR
│  │
│  ├─ €50,000 - €100,000 → ✅ CHOOSE IRS JOVEM (for Years 1-5)
│  │  └─ Why: Years 1-3 exemptions (100%/75%/50%) >> 20% NHR
│  │     │
│  │     └─ Calculation example (€85k income, 75% coefficient):
│  │        ├─ IRS Jovem Year 1: €0 tax (100% exemption)
│  │        ├─ IRS Jovem Year 2: ~€3,200 tax (75% exemption)
│  │        ├─ IRS Jovem Year 3: ~€6,400 tax (50% exemption)
│  │        ├─ NHR 20%: €12,750 tax (constant)
│  │        └─ IRS Jovem wins Years 1-5, NHR might win Year 6+
│  │
│  └─ > €100,000 → ⚠️ DEPENDS on time horizon
│     ├─ Planning to stay 5+ years? → Consider NHR (10-year benefit)
│     ├─ Early career, income will grow? → Consider IRS Jovem (Years 1-3 huge savings)
│     └─ Run both scenarios in tool to compare!
│
├─ Q2: How long do you plan to stay in Portugal?
│  ├─ 1-3 years → ✅ CHOOSE IRS JOVEM
│  │  └─ Why: Maximize exemption years (100%/75%/50%)
│  │
│  ├─ 5-10 years → ⚠️ DEPENDS on income
│  │  ├─ Low-medium income → IRS Jovem better
│  │  └─ Very high income → NHR might be better long-term
│  │
│  └─ > 10 years → ⚠️ CALCULATE BOTH
│     └─ IRS Jovem expires after ~10 years, NHR is 10 years fixed
│
└─ RECOMMENDATION: For MOST young professionals, IRS Jovem wins in Years 1-5
   └─ Exception: Very high income (>€200k) with 10+ year horizon might favor NHR
```

---

### Decision Tree 3: Simplified vs Organized Accounting for Freelancers

```
START: Freelancer choosing between simplified and organized
│
├─ Q1: What is your activity coefficient?
│  ├─ 75% (High-value Article 151)
│  │  └─ Deemed expenses = 25% of gross
│  └─ 35% (General services)
│     └─ Deemed expenses = 65% of gross
│
├─ Q2: What are your REAL annual deductible expenses?
│  ├─ Example: €20,000
│  └─ [User calculates using expense categories]
│
├─ Q3: Compare real vs deemed:
│  ├─ Real expenses > Deemed expenses?
│  │  └─ ✅ ORGANIZED LIKELY BETTER
│  └─ Real expenses < Deemed expenses?
│     └─ ✅ SIMPLIFIED LIKELY BETTER
│
├─ Q4: Factor in admin cost difference:
│  ├─ Organized admin: ~€2,400-€3,600/year (TOC fees)
│  ├─ Simplified admin: ~€360-€1,200/year (light support)
│  └─ Difference: ~€2,000-€2,500/year
│
├─ Q5: Calculate breakeven:
│  ├─ Expense deduction benefit > Admin cost delta?
│  │  └─ ✅ ORGANIZED WINS
│  └─ Expense deduction benefit < Admin cost delta?
│     └─ ✅ SIMPLIFIED WINS
│
└─ EXAMPLES:
   ├─ Income €80k, High-value (75%), Real expenses €15k:
   │  ├─ Deemed: 25% × €80k = €20k
   │  ├─ Real: €15k
   │  ├─ Deemed > Real by €5k
   │  └─ ✅ SIMPLIFIED WINS
   │
   ├─ Income €120k, High-value (75%), Real expenses €40k:
   │  ├─ Deemed: 25% × €120k = €30k
   │  ├─ Real: €40k
   │  ├─ Real > Deemed by €10k
   │  ├─ Tax/SS savings: ~€4,000
   │  ├─ Admin cost delta: ~€2,500
   │  ├─ Net benefit: ~€1,500/year
   │  └─ ✅ ORGANIZED WINS
   │
   └─ Income €60k, General services (35%), Real expenses €25k:
      ├─ Deemed: 65% × €60k = €39k
      ├─ Real: €25k
      ├─ Deemed > Real by €14k
      └─ ✅ SIMPLIFIED WINS (dramatically)
```

---

## Pain Points & Opportunities

### Critical Pain Points (P0)

#### 1. **No Multi-Year Projection**
**Pain Point:**
- Users with IRS Jovem can't see how results change over 5-10 years
- Users planning long-term can't model income growth scenarios
- Decision feels incomplete without future visibility

**Impact:** High - Affects 30%+ of users (young professionals with IRS Jovem)

**User Quote:**
> "I can see Year 1 is great with IRS Jovem, but what about Year 3 when it drops to 50%? Should I switch structures then?"

**Opportunity:**
- 🎯 Add "Multi-year projection" feature
- Show timeline graph: Net income over 5/10 years
- Model income growth assumptions (e.g., +5% annually)
- Show when to transition between structures

**Priority:** P0 - Core decision support feature

---

#### 2. **No Scenario Saving/Comparison**
**Pain Point:**
- Users test multiple scenarios but can't save/compare them
- Must take screenshots or write down results
- Can't easily A/B test different assumptions

**Impact:** High - Affects 60%+ of users who experiment

**User Quote:**
> "I want to compare 3 scenarios: current income, +20% growth, and +50% growth. But I can't see them side-by-side."

**Opportunity:**
- 🎯 Add "Save scenario" button
- Create scenario library (local storage or account-based)
- Add comparison view: 2-4 scenarios in table format
- Allow naming scenarios: "Conservative", "Growth", "Best case"

**Priority:** P0 - Essential for thorough analysis

---

#### 3. **Export/Print Functionality Missing**
**Pain Point:**
- Users want to share results with accountants/lawyers
- No PDF export, email, or professional print format
- Screenshot quality varies, unprofessional

**Impact:** Medium-High - Affects 40% of users who consult professionals

**User Quote:**
> "My accountant asked for the calculations. I took a screenshot but it looks unprofessional."

**Opportunity:**
- 🎯 Add "Export to PDF" button (client-side generation)
- Include: All inputs, all results, calculation methodology
- Add "Email results" option
- Ensure print stylesheet is optimized

**Priority:** P0 - Professional credibility

---

### High-Priority Pain Points (P1)

#### 4. **Unclear Eligibility Rules**
**Pain Point:**
- Users uncertain about IRS Jovem eligibility (year counting, age limits)
- Confused about NHR 2.0 vs original NHR
- Don't know if benefits can combine

**Impact:** Medium - Affects 35% of users with special regimes

**Opportunity:**
- 🎯 Add eligibility checker widgets:
  - "Do I qualify for IRS Jovem?" → Interactive questionnaire
  - "NHR eligibility checker" → Step-by-step guide
- Add tooltips/info icons throughout
- Link to authoritative sources (Finanças, official guides)

**Priority:** P1 - Reduces user confusion

---

#### 5. **Activity Code Classification Friction**
**Pain Point:**
- Activity code lookup modal is hard to use on mobile
- Not all professions clearly map to codes
- Users uncertain between high-value vs general services

**Impact:** Medium - Affects 30% of users (first-time, edge cases)

**Opportunity:**
- 🎯 Improve mobile modal (larger text, better search)
- Add profession aliases ("programmer" → "computer programming")
- Add "Between two options?" help section
- Show CAE code search in main flow (not just modal)

**Priority:** P1 - Critical for correct calculations

---

#### 6. **Limited Guidance on LDA vs Freelancer**
**Pain Point:**
- Tool focuses on tax comparison, but LDA decision also involves:
  - Limited liability (legal protection)
  - Client requirements (some prefer corporate entity)
  - International invoicing (VAT, ease of payment)
  - Future equity/investment (LDA easier to scale)

**Impact:** Medium - Affects 25% of users considering LDA

**Opportunity:**
- 🎯 Add "Non-tax factors" checklist
- Add decision helper: "When LDA makes sense despite higher costs"
- Include qualitative comparison table
- Link to legal resources

**Priority:** P1 - Holistic decision support

---

### Medium-Priority Pain Points (P2)

#### 7. **No Breakeven Analyzer**
**Pain Point:**
- Users manually experiment to find optimal structure transition points
- "At what expense level should I switch from simplified to organized?"
- "At what income does LDA maximize my take-home?"
- Need visual threshold indicators

**Impact:** Low-Medium - Affects 20% of analytical users

**Opportunity:**
- 🎯 Add "Breakeven analyzer" tool
- Show: "Organized becomes better at €X,XXX in expenses"
- Show: "LDA becomes competitive at €X,XXX annual income"
- Interactive slider to visualize breakeven

**Priority:** P2 - Power user feature

---

#### 8. **Missing Assumptions/Documentation Tab**
**Pain Point:**
- Tax brackets, SS rates, IRS Jovem rules not visible in UI
- Users can't verify calculations manually
- Trust relies on "black box" feeling

**Impact:** Low-Medium - Affects 15% of detail-oriented users

**Opportunity:**
- 🎯 Add "Assumptions" tab or footer section
- Display:
  - 2025 IRS progressive brackets
  - Social security rate (21.4%)
  - Solidarity tax thresholds
  - IRS Jovem exemption schedule
  - Activity coefficients (25%, 65%)
- Add "Methodology" page explaining calculations

**Priority:** P2 - Builds trust and transparency

---

#### 9. **Mobile Experience Rough Edges**
**Pain Point:**
- Horizontal-scrolling tabs on small screens
- Tiny help text (accessibility)
- Activity code modal cramped
- Breakdown tables don't fit well

**Impact:** Low-Medium - Affects 30% of users on mobile

**Opportunity:**
- 🎯 Improve mobile responsive design:
  - Vertical tab navigation on mobile
  - Larger touch targets (min 44px)
  - Collapsible/accordion tables
  - Zoom-friendly text (16px minimum)

**Priority:** P2 - UX polish

---

### Low-Priority Pain Points (P3)

#### 10. **No User Accounts / Data Persistence**
**Pain Point:**
- Calculations lost on page refresh
- Can't access previous calculations
- No cross-device sync

**Impact:** Low - Affects 10% of returning users

**Opportunity:**
- 🎯 Add optional user accounts (email + password)
- Store calculation history
- Enable cross-device access
- Privacy-respecting (GDPR compliant)

**Priority:** P3 - Nice-to-have feature

---

#### 11. **No Community/Forum**
**Pain Point:**
- Users have questions beyond the calculator
- Want to discuss with other freelancers
- No support channel

**Impact:** Low - Affects 5% of highly engaged users

**Opportunity:**
- 🎯 Add community forum or Discord
- Create FAQ based on common questions
- Offer expert Q&A sessions
- Build user community

**Priority:** P3 - Community building

---

## Success Metrics

### Primary Metrics (North Star)

#### 1. **User Decision Confidence**
**Definition:** Percentage of users who feel confident making a tax structure decision after using the tool

**Target:** 80%+ of users rate confidence as 4-5 out of 5

**Measurement:**
- Post-calculation survey: "How confident are you in your decision?" (1-5 scale)
- Qualitative feedback: "What would make you more confident?"

**Current Baseline:** Unknown (need to implement survey)

---

#### 2. **Calculation Completion Rate**
**Definition:** Percentage of users who complete full calculation (all 5 tabs)

**Target:** 70%+ completion rate

**Measurement:**
- Track tab progression: Setup → Income → Expenses → Deductions → Results
- Identify drop-off points

**Current Baseline:** Unknown (need analytics)

**Optimization Opportunities:**
- Reduce Setup tab friction (activity code lookup)
- Simplify Expenses tab (too many inputs?)
- Add progress indicator (e.g., "3 of 5 steps complete")

---

#### 3. **Result Interpretation Success**
**Definition:** Users correctly understand which structure is optimal and why

**Target:** 85%+ of users can explain the reasoning

**Measurement:**
- Survey: "Why did [Option X] win?" (open-ended)
- Analyze responses for understanding of key drivers

**Current Baseline:** Unknown

---

### Secondary Metrics

#### 4. **Time to Result**
**Definition:** Median time from landing to viewing Results tab

**Target:** < 5 minutes for first-time users

**Current Estimate:** 8-12 minutes (based on persona journeys)

**Optimization:**
- Pre-fill smart defaults (median values)
- "Quick calculation" mode with minimal inputs
- Auto-save inputs for repeat visitors

---

#### 5. **Tool Accuracy Validation**
**Definition:** Percentage of professional accountants who confirm tool results

**Target:** 95%+ accuracy when validated by TOC/accountant

**Measurement:**
- Partner with accountants for spot-checks
- Collect user feedback: "My accountant confirmed these results"

**Current Baseline:** Unknown (anecdotal only)

---

#### 6. **Repeat Usage Rate**
**Definition:** Percentage of users who return to tool within 12 months

**Target:** 40%+ annual return rate

**Measurement:**
- Track cookie/fingerprint (privacy-respecting)
- Measure: Users who visit 2+ times
- Segment: Same-year (experimenting) vs next-year (annual review)

**Current Baseline:** Unknown

---

#### 7. **Mobile Usage Success**
**Definition:** Mobile users complete calculation at same rate as desktop

**Target:** Mobile completion ≥ 90% of desktop completion rate

**Measurement:**
- Compare mobile vs desktop completion rates
- Identify mobile-specific drop-offs

**Current Baseline:** Unknown (likely lower due to UI issues)

---

### Engagement Metrics

#### 8. **Scenario Experimentation Rate**
**Definition:** Percentage of users who modify inputs and re-calculate

**Target:** 60%+ of users test at least 2 scenarios

**Measurement:**
- Track input changes after initial result view
- Count: Number of recalculations per session

**Insight:** High experimentation = engaged, analytical users (good!)

---

#### 9. **Help Content Usage**
**Definition:** Percentage of users who expand help accordions/tooltips

**Target:** 50%+ of users view at least 1 help item

**Measurement:**
- Track: Activity code lookup clicks
- Track: "Examples of deductible expenses" expansions
- Track: Help text icon clicks

**Insight:** High usage = need for better upfront clarity?

---

#### 10. **Social Sharing Rate**
**Definition:** Users who share results/tool with others

**Target:** 15%+ of users share

**Measurement:**
- Add share buttons (WhatsApp, Email, Copy link)
- Track: Social share button clicks
- Monitor: Referral traffic sources

**Current:** Organic sharing happening (anecdotal), but not measured

---

### Business Impact Metrics

#### 11. **Professional Consultation Conversion**
**Definition:** Users who book accountant/lawyer after using tool

**Target:** 30%+ of users seek professional help (positive!)

**Measurement:**
- Survey: "Did you consult a professional after using this tool?"
- Partner referrals: "How did you hear about us?"

**Note:** This is SUCCESS, not failure - tool empowers better consultations

---

#### 12. **Tax Savings Realized**
**Definition:** Estimated annual savings for users who change structures

**Target:** €2,500 median savings per user who switches

**Measurement:**
- Survey: "Did you change your tax structure based on this tool?"
- Track: Difference between previous and new structure
- Aggregate: Total community savings

**Impact:** Demonstrate tool's real-world value

---

#### 13. **Tool Accuracy vs Reality**
**Definition:** How closely tool predictions match actual tax bills

**Target:** < 5% variance for 90% of users

**Measurement:**
- 12-month follow-up survey: "How accurate was the calculator?"
- Collect: Actual tax bill vs predicted
- Analyze: Sources of variance (edge cases, user input errors)

**Optimization:** Improve edge case handling

---

### Qualitative Metrics

#### 14. **Net Promoter Score (NPS)**
**Question:** "How likely are you to recommend TakeHome PT to a fellow freelancer?" (0-10 scale)

**Target:** NPS > 50 (World-class: 70+)

**Segmentation:**
- By persona (tech workers vs consultants vs designers)
- By income level
- By tax regime (NHR vs standard)

---

#### 15. **User Testimonials**
**Target:** Collect 20+ testimonials within first year

**Themes to capture:**
- "Saved me €X,XXX per year"
- "Clarified confusion about [topic]"
- "Empowered me to talk to my accountant confidently"

**Distribution:** Website, social proof, case studies

---

## Edge Cases & Error Scenarios

### Edge Case 1: Very High Income (>€300k)

**Scenario:** User enters annual income of €400,000

**Challenges:**
- Solidarity tax becomes major factor (5% on amounts >€250k)
- Social security cap (12× IAS) becomes less relevant
- LDA with dividend distribution might be optimal (not modeled)
- Tax optimization becomes more complex (holding structures, etc.)

**Current Behavior:**
- Tool handles basic math correctly
- But may not suggest optimal strategies at this level

**Recommendation:**
- Add disclaimer: "For income >€300k, consult a tax specialist for advanced strategies"
- Add note: "LDA with dividend distribution may offer additional benefits"

---

### Edge Case 2: Multiple Income Sources

**Scenario:** User has both Portuguese freelance income AND foreign passive income

**Challenges:**
- Tool assumes single income source
- NHR status affects different income types differently
- Solidarity tax applies to total taxable income (not just freelance)

**Current Behavior:**
- Tool only models Portuguese professional income
- Doesn't account for other income sources

**Recommendation:**
- Add input: "Other taxable income (if any)"
- Include in total for solidarity tax calculation
- Add help text: "Include rental income, foreign wages, etc."

---

### Edge Case 3: Part-Year Residency

**Scenario:** User moved to Portugal mid-year (e.g., started in July)

**Challenges:**
- First-year benefits may apply differently
- Pro-rata income calculations
- Unclear if IRS Jovem "Year 1" applies to calendar year or tax year

**Current Behavior:**
- Tool assumes full-year residency
- May overstate or understate benefits

**Recommendation:**
- Add question: "Full-year resident?" Yes/No
- If No: Add "Months of residency" input
- Pro-rate all annual calculations
- Add disclaimer about first-year benefit eligibility

---

### Edge Case 4: Mixed Activity Types

**Scenario:** User has both high-value (75%) and general services (35%) income

**Example:** Software consultant who also does photography side work

**Challenges:**
- Different coefficients apply to different income streams
- Most freelancers register single CAE code (primary activity)
- Tool can't split income by activity type

**Current Behavior:**
- Forces single activity profile selection
- May over-tax or under-tax depending on choice

**Recommendation:**
- Add option: "Mixed activity types"
- Allow income split: X% high-value, Y% general
- Apply weighted average coefficient
- Add help: "Use primary activity if <20% is secondary"

---

### Edge Case 5: IRS Jovem + NHR Combination Uncertainty

**Scenario:** User has both IRS Jovem and NHR 2.0/IFICI

**Question:** Do benefits stack? In what order are they applied?

**Tax Law Reality:**
1. NHR applies first: 20% flat rate on eligible income
2. IRS Jovem applies to final IRS amount: Reduces tax by exemption %

**Example:**
- Taxable income: €80,000
- NHR 20%: €16,000 IRS
- IRS Jovem Year 1 (100%): -€16,000
- Final IRS: €0

**Current Behavior:**
- Tool applies both correctly
- But user may not understand the interaction

**Recommendation:**
- Add explanation: "IRS Jovem applies to final IRS after NHR"
- Show calculation steps clearly
- Add example in help text

---

### Edge Case 6: Negative Taxable Income (High Deductions)

**Scenario:** User has very high deductible expenses (organized) that exceed income coefficient

**Example:**
- Gross: €50,000
- Real expenses: €45,000
- Net business income: €5,000
- Very low taxable income

**Challenges:**
- Social security still applies to net business income (not taxable)
- User may have cash flow issues if expenses are high
- Might trigger tax authority scrutiny

**Current Behavior:**
- Tool handles math correctly (low/zero IRS)
- But doesn't warn about scrutiny risk

**Recommendation:**
- Add warning: "High expense ratio may require detailed documentation"
- Add note: "Ensure all expenses are business-related and supported by invoices"

---

### Edge Case 7: LDA Manager Salary Ambiguity

**Scenario:** User checks "Apply minimum manager salary & SS" for LDA

**Confusion:**
- What exactly is "minimum manager salary"?
- How does it interact with freelance income drawing?
- Can user avoid this if they have foreign SS (exemption)?

**Current Behavior:**
- Checkbox exists but explanation is minimal
- User may mis-apply or not understand implications

**Recommendation:**
- Expand help text:
  ```
  LDA Manager Minimum Salary:
  - Portuguese LDA managers typically declare minimum salary (€522.50/month)
  - Annual total: €6,270 salary + €2,179 employer/employee SS
  - Check this if you will be LDA manager without foreign SS coverage
  - Uncheck if you have foreign social security exemption (e.g., via bilateral treaty)
  ```
- Add link: "Learn about SS exemptions for foreign residents"

---

### Edge Case 8: Input Validation Errors

**Scenario:** User enters invalid or extreme values

**Examples:**
- Negative income
- Expenses > income by large margin
- Very low income (€5,000/year) but high admin costs

**Current Behavior:**
- May calculate but produce nonsensical results
- No validation warnings

**Recommendation:**
- Add input validation:
  - Min income: €5,000 (below this, not viable business)
  - Max income: €1,000,000 (above this, suggest specialist)
  - Expenses should be < 95% of income (warn if exceeded)
  - Admin costs reasonable for income level (warn if >20% of income)
- Add error messages:
  - "Income seems low for self-employment. Are you sure?"
  - "Expenses exceed 90% of income. This may trigger audit risk."
  - "Admin costs seem high for your income level. Double-check amounts."

---

### Error Scenario 1: Browser Compatibility

**Issue:** User on old browser (e.g., IE11, old Safari)

**Current Behavior:**
- May not load, or display incorrectly
- JavaScript errors break functionality

**Recommendation:**
- Add browser detection
- Display warning: "This tool requires a modern browser. Please use Chrome, Firefox, Safari (latest), or Edge."
- Graceful degradation: Static fallback form

---

### Error Scenario 2: Calculation Timeout/Error

**Issue:** JavaScript error during calculation

**Current Behavior:**
- Results don't display, or show €0.00
- User confused, no error message

**Recommendation:**
- Add try-catch around calculation functions
- Display user-friendly error:
  ```
  ⚠️ Calculation Error
  We encountered an issue calculating your results. Please:
  - Check that all inputs are valid numbers
  - Try refreshing the page
  - If problem persists, contact support
  ```
- Log errors for debugging (privacy-respecting)

---

### Error Scenario 3: Network Issues (If Tool Becomes API-Based)

**Issue:** API call fails due to network timeout

**Current Behavior:**
- Client-side only (no API), so N/A currently
- But if future version uses backend...

**Recommendation (Future):**
- Add loading states: "Calculating..." with spinner
- Add retry logic (automatic 2-3 retries)
- Display error: "Unable to connect. Please check your internet and try again."
- Offline mode: Cache last calculation, allow offline viewing

---

## Implementation Priorities Based on User Journey Analysis

### ✅ Already Implemented (Strengths)

Based on the comprehensive user journey analysis, these features are working well:

1. **Three-Structure Comparison** (10/10)
   - All personas benefit from side-by-side comparison
   - Prevents costly structural mistakes (Carlos saves €4,657/year)
   - Clear winner indication with reasoning

2. **Activity Code Classification** (10/10)
   - Searchable modal eliminates forced coefficient problem
   - Teresa successfully finds her code (62020) and understands mapping
   - Reduces user confusion and calculation errors

3. **First-Year Benefits Suite** (9/10)
   - IRS Jovem with year-by-year dropdown
   - Social Security 12-month exemption
   - 50% IRS coefficient reduction
   - Teresa models Years 1-6+ for long-term planning

4. **Solidarity Tax Integration** (10/10)
   - Eduardo validates calculation at €220k income
   - Progressive tiers properly displayed
   - Critical for high-income accuracy

5. **Compliance Costs Transparency** (9/10)
   - Diana avoids €3,669/year loss from unnecessary organized accounting
   - Admin cost delta is visible decision factor
   - Realistic cost ranges (€800-€4,800)

6. **Multi-Year Scenario Testing** (10/10)
   - Users can test IRS Jovem phase-out impact
   - Income growth modeling
   - Long-term structure planning

### 🔴 Critical Priority (Must Fix for Launch)

**P0: Export/Save Functionality** (Currently 5/10)
- **User Impact:** All four personas want this feature
- **Pain Points:**
  - Teresa: Takes screenshots (CMD+Shift+4)
  - Carlos: Needs professional format for accountant
  - Eduardo: Uses browser print (inconsistent results)
- **Requirements:**
  - Export to PDF with full breakdown
  - Save scenarios (localStorage minimum)
  - Professional formatting for consultations
- **Success Metric:** 80%+ of users export or save results

**P0: Mobile UX Optimization** (Currently 6/10)
- **User Impact:** ~40% of users affected (Diana's journey shows friction)
- **Pain Points:**
  - Activity code modal too small
  - Help text not readable (accessibility)
  - Horizontal scrolling tabs
  - Cramped breakdown tables
- **Requirements:**
  - Minimum 16px font size
  - 44px touch targets
  - Vertical navigation on mobile
  - Collapsible sections vs. tabs
- **Success Metric:** Mobile completion rate ≥ 90% of desktop

**P0: Calculation Detail Accuracy** (Currently 7/10)
- **User Impact:** Teresa confused by mismatch (€63,316 vs €68,231)
- **Pain Points:**
  - Step-by-step doesn't match summary
  - Creates trust issues
- **Requirements:**
  - Ensure exact match between calculation steps and final number
  - OR label as "Simplified illustration"
  - Add downloadable detailed calculation
- **Success Metric:** <5% of users report calculation confusion

### 🟡 High Priority (Launch Week)

**P1: Methodology/Assumptions Tab** (Currently 6/10)
- **User Impact:** Teresa Googles to verify, Eduardo cross-checks tax tables
- **Requirements:**
  - 2025 IRS progressive brackets
  - Social Security rate (21.4%)
  - IRS Jovem exemption schedule
  - Solidarity tax thresholds (€80k, €250k)
  - Activity coefficients (25%, 65%)
  - Data sources and last update date
- **Success Metric:** User trust score >8/10

**P1: LDA Manager Salary Clarity** (Currently 7/10)
- **User Impact:** Teresa and Diana uncertain about checkbox
- **Requirements:**
  - Clearer label: "Include mandatory manager remuneration"
  - Default to checked with explanation
  - Tooltip: "Required unless you have foreign SS exemption"
  - Link to detailed explanation
- **Success Metric:** <10% confusion on this input

**P1: Calendar Year Ambiguity** (Currently 7/10)
- **User Impact:** Teresa uncertain (started mid-year)
- **Requirements:**
  - Clear tooltip: "First tax year = first calendar year of activity"
  - OR date picker: "Activity start date"
  - Note: "SS exemption is 12 rolling months; IRS reduction is calendar year"
- **Success Metric:** <5% of users ask about timing

### 🟢 Medium Priority (Post-Launch)

**P2: Breakeven Analyzer** (Currently 6/10)
- **User Impact:** Carlos manually calculates threshold (€37.5k)
- **Requirements:**
  - Visual indicator: "Your expenses (€25k) vs deemed (€37.5k)"
  - Interactive slider showing breakeven
  - Display: "Switch to organized when expenses exceed €XX,XXX"
- **Success Metric:** 40%+ of users interact with analyzer

**P2: Multi-Scenario Comparison** (Currently 5/10)
- **User Impact:** Teresa tests 3+ scenarios but can't compare side-by-side
- **Requirements:**
  - Save up to 4 scenarios with names
  - Comparison table: scenarios in columns
  - Identify optimal scenario automatically
- **Success Metric:** 30%+ of users save multiple scenarios

**P2: Detailed Expense Wizard** (Currently 7/10)
- **User Impact:** Carlos estimates €25k total but uncertain of accuracy
- **Requirements:**
  - Category-by-category input
  - Examples per category
  - Validation: "Expenses seem high/low for your income"
- **Success Metric:** 25%+ of users use detailed mode

### 📊 Success Metrics Summary

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| **Decision Confidence** | Unknown | 80%+ rate 4-5/5 | P0 |
| **Completion Rate** | Unknown | 70%+ complete all tabs | P0 |
| **Mobile Completion** | ~50%? | ≥90% of desktop | P0 |
| **Export Usage** | 0% | 80%+ export results | P0 |
| **Calculation Trust** | Unknown | <5% report confusion | P0 |
| **Methodology Views** | 0% | 50%+ view assumptions | P1 |
| **NPS Score** | Unknown | >50 (world-class: 70+) | P1 |
| **Professional Validation** | Unknown | 95%+ accuracy confirmed | P1 |
| **Scenario Testing** | Unknown | 60%+ test 2+ scenarios | P2 |
| **Breakeven Usage** | 0% | 40%+ interact | P2 |

### Launch Readiness Assessment

**Current State: 8.5/10 - BETA READY**

**Why Launch-Ready:**
- ✅ All critical mathematical accuracy issues resolved
- ✅ All three structures properly compared
- ✅ First-year benefits comprehensive
- ✅ Prevents costly structural mistakes (proven value)
- ✅ Intuitive user flow

**Pre-Launch Must-Haves (1-2 weeks):**
1. Export to PDF functionality
2. Mobile UX optimization pass
3. Methodology/Assumptions tab
4. Calculation detail accuracy fix

**Launch Week Nice-to-Haves:**
5. LDA checkbox clarity improvements
6. Calendar year tooltip
7. Basic analytics implementation

**Post-Launch Roadmap (4-8 weeks):**
8. Breakeven analyzer
9. Multi-scenario comparison
10. Detailed expense wizard
11. Email results feature
12. Share link with encoded parameters

---

## Appendix: User Research Questions

### Post-Calculation Survey (5 questions, <2 minutes)

1. **How confident are you in your tax structure decision after using this tool?**
   - [ ] 1 - Not confident at all
   - [ ] 2 - Slightly confident
   - [ ] 3 - Moderately confident
   - [ ] 4 - Very confident
   - [ ] 5 - Extremely confident

2. **Which tax structure will you likely choose?**
   - [ ] Freelancer (Simplified)
   - [ ] Freelancer (Organized Accounting)
   - [ ] Single-Member Company (LDA)
   - [ ] Still undecided
   - [ ] Other/None

3. **Will you consult a professional (accountant/lawyer) before finalizing your decision?**
   - [ ] Yes, definitely
   - [ ] Probably yes
   - [ ] Probably no
   - [ ] No, I'm confident deciding on my own

4. **What would make you MORE confident in your decision?** (Select all that apply)
   - [ ] Multi-year projections
   - [ ] Ability to save/compare scenarios
   - [ ] More detailed calculation explanations
   - [ ] Validation from a tax professional
   - [ ] Case studies / examples from similar professionals
   - [ ] Nothing, I'm already confident

5. **How likely are you to recommend TakeHome PT to a fellow freelancer?** (NPS)
   - [ ] 0-10 scale

**Optional:** Email for follow-up (anonymized, GDPR compliant)

---

### 12-Month Follow-Up Survey (For users who opted in)

1. **Did you change your tax structure based on TakeHome PT's recommendation?**
   - [ ] Yes, I switched structures
   - [ ] No, I stayed with my existing structure
   - [ ] I'm still deciding

2. **If you switched, how much are you saving per year (estimated)?**
   - [ ] €0-€1,000
   - [ ] €1,000-€3,000
   - [ ] €3,000-€5,000
   - [ ] €5,000-€10,000
   - [ ] >€10,000

3. **How accurate were the tool's predictions compared to your actual tax situation?**
   - [ ] Very accurate (within 5%)
   - [ ] Mostly accurate (within 10%)
   - [ ] Somewhat accurate (within 20%)
   - [ ] Not accurate (>20% difference)

4. **If there was a difference, what caused it?** (Open-ended)

5. **Would you use TakeHome PT again for your next tax year?**
   - [ ] Definitely yes
   - [ ] Probably yes
   - [ ] Not sure
   - [ ] Probably no
   - [ ] Definitely no

---

## Conclusion

This user journey document provides a comprehensive map of how different personas interact with TakeHome PT **as a structure optimization planner** (not just a tax calculator). Key insights:

### What's Working Exceptionally Well ✅

**Core Value Delivery:**
- **Prevents costly mistakes**: Carlos saves €4,657/year by NOT switching structures
- **Reveals hidden opportunities**: Teresa gains €5,384/year by choosing organized accounting
- **Validates current setup**: Diana confirms simplified is optimal, avoiding €3,669 in unnecessary fees
- **Builds confidence**: Eduardo validates high-income calculations before accountant meeting

**UX Excellence:**
- Clean, modern interface inspires trust on first impression
- Activity code lookup eliminates forced coefficient problem (10/10)
- Real-time three-structure comparison shows optimization opportunities
- Clear winner indication (🏆 badge) with reasoning helps decision-making
- IRS Jovem year-by-year modeling empowers long-term planning

**Mathematical Accuracy:**
- Solidarity tax properly integrated (critical for >€80k income)
- All three first-year benefits implemented (IRS Jovem, SS exemption, 50% reduction)
- Compliance costs transparent (€800-€4,800 range)
- Social Security calculated correctly (21.4% on relevant income)

### Critical Improvements for Launch 🔴

**P0 Priorities (Must-Have):**
1. **Export to PDF** - All four personas need professional format for accountants
2. **Mobile UX optimization** - ~40% of users affected (Diana's journey shows friction)
3. **Calculation detail accuracy** - Eliminate Teresa's confusion (€63k vs €68k mismatch)
4. **Methodology/Assumptions tab** - Build trust with transparent tax tables

**P1 Priorities (Launch Week):**
5. **LDA manager salary clarity** - Default checked with better tooltip
6. **Calendar year ambiguity** - Clear guidance for mid-year starters
7. **Basic analytics** - Measure completion rates, decision confidence

**P2 Post-Launch Roadmap:**
8. **Breakeven analyzer** - Visual thresholds for structure transitions
9. **Multi-scenario comparison** - Save and compare 2-4 scenarios side-by-side
10. **Detailed expense wizard** - Category-by-category input with validation

### Success Metrics to Track 📊

**Primary Metrics:**
- **Decision confidence:** Target 80%+ rate 4-5/5
- **Structure optimization value:** Target €2,500 median savings per user
- **Completion rate:** Target 70%+ complete all tabs
- **Export usage:** Target 80%+ export or save results
- **NPS:** Target >50 (World-class: 70+)

**Validation Metrics:**
- **Accuracy validation:** Target 95%+ vs professional accountant confirmation
- **Mobile completion:** Target ≥90% of desktop completion rate
- **Calculation trust:** Target <5% report confusion
- **Professional referrals:** Target 30%+ consult accountant with tool results (success!)

### Assessment: 8.5/10 - Green Light for Beta Launch 🚀

**Why This Works:**
1. ✅ **Solves real problems** - All four personas achieve their goals
2. ✅ **Prevents mistakes** - Carlos avoids €4,657/year loss
3. ✅ **Reveals opportunities** - Teresa discovers €5,384/year gain
4. ✅ **Builds confidence** - Eduardo validates before professional consultation
5. ✅ **Long-term planning** - Multi-year IRS Jovem modeling
6. ✅ **Mathematically accurate** - All previous audit issues resolved

**Launch Recommendation:**
Proceed with **beta launch** after implementing P0 priorities (export, mobile, methodology). The tool demonstrates clear value across all user personas and prevents costly structural mistakes. With 1-2 weeks of focused improvements, this will be the best Portugal structure optimization tool available.

### Next Steps 🚀

**Week 1: Pre-Launch Polish**
1. Implement export to PDF functionality
2. Mobile UX optimization pass (font sizes, touch targets, layout)
3. Add Methodology/Assumptions tab with 2025 tax tables
4. Fix calculation detail accuracy (exact match or clear labeling)
5. Implement basic analytics (Google Analytics or similar)

**Week 2: Beta Launch**
6. Recruit 20-30 beta testers across all four personas
7. Monitor completion rates and drop-off points
8. Collect feedback via post-calculation survey
9. Validate accuracy with partner accountants
10. Iterate based on real user behavior

**Week 3: Full Launch**
11. Improve LDA checkbox clarity based on beta feedback
12. Add calendar year tooltips/guidance
13. Optimize based on analytics data
14. Build initial case studies from beta users
15. Plan post-launch roadmap (breakeven analyzer, scenarios)

---

**Document Maintained By:** Product Team  
**Review Cadence:** Quarterly (or after major feature releases)  
**Next Review:** 2026-01-12  
**Changelog:**
- v1.1 (2025-10-12): Repositioned as "structure optimization planner" vs "tax calculator", added implementation priorities, incorporated 8.5/10 audit feedback
- v1.0 (2025-10-12): Initial comprehensive user journey map with 4 personas
