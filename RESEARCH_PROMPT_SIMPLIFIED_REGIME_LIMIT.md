# Research Prompt: Portuguese Simplified Regime €200,000 Income Limit

## Core Question
Does the €200,000 annual income limit for Portugal's simplified regime (regime simplificado) apply to:
- **Option A:** Category B professional income ONLY, OR
- **Option B:** Total taxable income from ALL sources (including Category B + dividends + capital gains + other income categories)?

## Context
This research is for a Portuguese tax calculator that handles:
1. Category B professional income (freelance/business services - Categoria B)
2. Dividends and interest income
3. Capital gains from securities

The calculator currently enforces organized accounting when Category B income alone exceeds €200,000, but we need to verify if this is legally correct or if the limit should include all income sources.

## Specific Research Questions

### 1. Legal Framework
- What does **CIRS Article 28** (Código do IRS - regime simplificado) specify about the €200,000 limit?
- Does the law refer to "rendimentos da categoria B" (Category B income) or "rendimento total" (total income)?
- Are there any AT (Autoridade Tributária) clarifications or official circulars on this topic?

### 2. Income Calculation for Limit
- If a freelancer has:
  - €180,000 in Category B professional services income
  - €30,000 in capital gains
  - €15,000 in dividends
- What is the relevant income figure for checking the €200,000 simplified regime limit: €180k or €225k?

### 3. Cross-Category Scenarios
- Can someone in simplified regime for Category B also have:
  - Category E income (capital income - dividends/interest)?
  - Category G income (capital gains)?
  - Category F income (real estate)?
- Do these other categories count toward the €200,000 threshold?

### 4. Official Sources to Consult
Please check these authoritative Portuguese sources:
- **CIRS Article 28** (regime simplificado): https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/index_cirs.htm#a28
- Portal das Finanças official guidance
- AT (Autoridade Tributária e Aduaneira) circulars and clarifications
- Recent State Budget laws (Orçamento do Estado) that may have modified this
- Professional tax advisor guidance from reputable Portuguese sources

### 5. Related Questions
- Does the limit apply to gross income (total invoiced) or net income (after expenses)?
- Is the calculation based on calendar year or tax year?
- What happens if someone exceeds the limit mid-year?

## Expected Output Format

Please provide:
1. **Direct Legal Citation**: Quote the exact Portuguese legal text from CIRS Article 28 or relevant law
2. **Clear Answer**: State definitively whether the limit is Category B only or total income
3. **Source Links**: Provide URLs to official Portuguese government sources
4. **Date Verification**: Confirm the information is current for tax year 2025
5. **Edge Cases**: Note any exceptions or special circumstances

## Current Implementation Being Verified
Our calculator currently:
- Checks: `if (categoryBIncome > 200000)` → enforce organized accounting
- Does NOT include dividends or capital gains in this check
- We need to confirm this is **legally correct**

## Language Note
Sources will be in Portuguese. Please provide both:
- Original Portuguese text (for verification)
- English translation (for understanding)
