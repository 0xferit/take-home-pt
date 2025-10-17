// ============================================================================
// BUSINESS LOGIC LAYER - TakeHomePT Calculator
// ============================================================================
//
// PURPOSE: Pure calculation functions for Portuguese tax and business structures.
//          NO data definitions here - all data comes from data.js
//
// SEPARATION OF CONCERNS:
//   - Data definitions: data.js
//   - Business logic: logic.js (this file)
//   - UI presentation: app.js
//
// DEPENDENCIES:
//   - Requires data.js to be loaded first
//   - Exposes window.TakeHomeLogic for app.js
//
// ============================================================================

// Pure business logic for TakeHomePT — exposed via window.TakeHomeLogic
(function (global) {
  'use strict';

  // ============================================================================
  // DATA ACCESS LAYER
  // ============================================================================
  // Import data from window.TakeHomeData (loaded via data.js)
  // Error handling ensures graceful failure if data.js not loaded

  const DATA = global.TakeHomeData;
  if (!DATA) {
    console.error('FATAL: TakeHomeData not loaded. Ensure data.js loads before logic.js in index.html.');
    console.error('Script load order should be: data.js → logic.js → app.js');
    return; // Exit IIFE - cannot continue without data
  }

  console.log('✅ Logic layer initialized with data from TakeHomeData');

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function sanitizeAmount(value) {
    return Math.max(0, Number(value) || 0);
  }

  function normalizeActivityCode(code) {
    if (!code) return '';
    const digits = String(code).replace(/\D+/g, '');
    if (!digits) return '';
    return digits.slice(0, 5);
  }

  function getActivityProfileForCode(code) {
    const normalized = normalizeActivityCode(code);
    if (!normalized || normalized.length < 5) return null;
    const catalogEntry = DATA.REGULATORY_DATA.ACTIVITY_CATALOG.find((entry) => entry.code === normalized);
    if (catalogEntry) return DATA.REGULATORY_DATA.ACTIVITY_PROFILES[catalogEntry.profileId] || null;
    if (DATA.REGULATORY_DATA.HIGH_VALUE_SERVICE_CODES.includes(normalized)) {
      return DATA.REGULATORY_DATA.ACTIVITY_PROFILES.services_high_value;
    }
    if (DATA.REGULATORY_DATA.CORE_SERVICE_CODES.includes(normalized)) {
      return DATA.REGULATORY_DATA.ACTIVITY_PROFILES.services_general;
    }
    return null;
  }

  function isActivityCodeKnown(code) {
    const normalized = normalizeActivityCode(code);
    if (!normalized || normalized.length < 5) return false;
    return Boolean(getActivityProfileForCode(normalized));
  }

  function isNHREligibleCode(code) {
    const normalized = normalizeActivityCode(code);
    if (!normalized || normalized.length < 5) return false;
    return DATA.REGULATORY_DATA.HIGH_VALUE_SERVICE_CODES.includes(normalized);
  }

  function computeProgressiveTax(taxableIncome) {
    const income = sanitizeAmount(taxableIncome);
    let tax = 0;
    let previousMax = 0;
    for (const bracket of DATA.REGULATORY_DATA.TAX_BRACKETS_2025) {
      if (income <= previousMax) break;
      const taxableInThisBracket = Math.min(income, bracket.max) - previousMax;
      tax += taxableInThisBracket * bracket.rate;
      previousMax = bracket.max;
      if (income <= bracket.max) break;
    }
    return tax;
  }

  function computeProgressiveTaxDetailed(taxableIncome) {
    const income = sanitizeAmount(taxableIncome);
    const breakdown = [];
    let totalTax = 0;
    let previousMax = 0;
    for (const bracket of DATA.REGULATORY_DATA.TAX_BRACKETS_2025) {
      if (income <= previousMax) break;
      const upperBound = Math.min(income, bracket.max);
      const taxableInThisBracket = upperBound - previousMax;
      if (taxableInThisBracket <= 0) {
        previousMax = bracket.max;
        continue;
      }
      const taxForBracket = taxableInThisBracket * bracket.rate;
      breakdown.push({
        min: previousMax,
        max: bracket.max,
        rate: bracket.rate,
        amount: taxableInThisBracket,
        tax: taxForBracket,
      });
      totalTax += taxForBracket;
      previousMax = bracket.max;
      if (income <= bracket.max) break;
    }
    return { totalTax, breakdown };
  }

  function computeSolidarityTax(taxableIncome) {
    const income = sanitizeAmount(taxableIncome);
    let tax = 0;
    const tier1Min = 80000;
    const tier2Min = 250000;
    if (income > tier1Min) {
      const tier1Portion = Math.min(income, tier2Min) - tier1Min;
      if (tier1Portion > 0) tax += tier1Portion * 0.025;
    }
    if (income > tier2Min) {
      const tier2Portion = income - tier2Min;
      if (tier2Portion > 0) tax += tier2Portion * 0.05;
    }
    return tax;
  }

  function computeIRSDetails(taxableIncome, nhrStatus, { isNHREligible = true } = {}) {
    const income = sanitizeAmount(taxableIncome);
    const nhrRequested = nhrStatus === 'original_nhr' || nhrStatus === 'nhr_2_ifici';
    if (nhrRequested && isNHREligible) {
      const rate = DATA.REGULATORY_DATA.NHR_RATES[nhrStatus];
      const baseIRS = income * rate;
      const solidarityTax = computeSolidarityTax(income);
      return {
        baseIRS,
        solidarityTax,
        totalIRSBeforeDeductions: baseIRS + solidarityTax,
        method: 'nhr',
        rate,
        nhrApplied: true,
        nhrRequested: true,
        breakdown: [
          {
            min: 0,
            max: income,
            rate,
            amount: income,
            tax: baseIRS,
          }
        ],
      };
    }
    const { totalTax, breakdown } = computeProgressiveTaxDetailed(income);
    const solidarityTax = computeSolidarityTax(income);
    return {
      baseIRS: totalTax,
      solidarityTax,
      totalIRSBeforeDeductions: totalTax + solidarityTax,
      method: 'progressive',
      nhrApplied: false,
      nhrRequested,
      nhrReason: nhrRequested && !isNHREligible ? 'Activity code not on NHR eligible list' : undefined,
      breakdown,
    };
  }

  function computeDeducoesAColeta({ dependentsCount = 0, personalDeductions = {} } = {}) {
    const dependents = sanitizeAmount(dependentsCount);
    const {
      health = 0,
      education = 0,
      charitable = 0,
      retirement = 0
    } = personalDeductions;
    const dependentAllowance = dependents * DATA.REGULATORY_DATA.PERSONAL_DEDUCTIONS.dependentAllowance;
    const healthDeduction = Math.min(
      sanitizeAmount(health) * DATA.REGULATORY_DATA.PERSONAL_DEDUCTIONS.healthExpensesRate,
      DATA.REGULATORY_DATA.PERSONAL_DEDUCTIONS.healthExpensesMax
    );
    return (
      dependentAllowance +
      healthDeduction +
      sanitizeAmount(education) +
      sanitizeAmount(charitable) +
      sanitizeAmount(retirement)
    );
  }

  function getIRSJovemExemption(year) {
    // IRS Jovem progressive exemption rates for residents under 35
    // NEW 2025 SCHEDULE: 10-year benefit (was 5 years pre-2025)
    // Source: Law 24-B/2024 (State Budget 2025), CIRS Article 2-B
    const exemptionRates = {
      1: 1.00,    // Year 1: 100% exemption
      2: 0.75,    // Year 2: 75% exemption
      3: 0.75,    // Year 3: 75% exemption
      4: 0.75,    // Year 4: 75% exemption
      5: 0.50,    // Year 5: 50% exemption
      6: 0.50,    // Year 6: 50% exemption
      7: 0.50,    // Year 7: 50% exemption
      8: 0.25,    // Year 8: 25% exemption
      9: 0.25,    // Year 9: 25% exemption
      10: 0.25,   // Year 10: 25% exemption
    };
    const yearNum = Number(year) || 0;
    return exemptionRates[yearNum] || 0;
  }

  function computeSSAnnual(grossIncome, { isFirstYearSSExempt } = {}) {
    const income = sanitizeAmount(grossIncome);
    const rate = DATA.REGULATORY_DATA.SOCIAL_SECURITY.rate;
    const factor = DATA.REGULATORY_DATA.SOCIAL_SECURITY.relevantIncomeFactor;
    const maxMonthlyBase = DATA.REGULATORY_DATA.SOCIAL_SECURITY.ias * DATA.REGULATORY_DATA.SOCIAL_SECURITY.maxBaseMultiplier;
    if (isFirstYearSSExempt || income === 0) {
      return {
        annual: 0,
        monthly: 0,
        monthlyRelevantIncome: 0,
        monthlyBaseApplied: 0,
        monthlyCap: maxMonthlyBase,
        capped: false
      };
    }
    const quarterlyGrossIncome = income / 4;
    const quarterlyRelevantIncome = quarterlyGrossIncome * factor;
    const monthlyRelevantIncome = quarterlyRelevantIncome / 3;
    const monthlyBaseApplied = Math.min(monthlyRelevantIncome, maxMonthlyBase);
    const monthlyContribution = monthlyBaseApplied * rate;
    const capped = monthlyRelevantIncome > maxMonthlyBase;
    return {
      annual: monthlyContribution * 12,
      monthly: monthlyContribution,
      monthlyRelevantIncome,
      monthlyBaseApplied,
      monthlyCap: maxMonthlyBase,
      capped
    };
  }

  function getMarginalTaxRate(taxableIncome) {
    const income = sanitizeAmount(taxableIncome);
    for (const bracket of DATA.REGULATORY_DATA.TAX_BRACKETS_2025) {
      if (income <= bracket.max) return bracket.rate * 100;
    }
    return DATA.REGULATORY_DATA.TAX_BRACKETS_2025[DATA.REGULATORY_DATA.TAX_BRACKETS_2025.length - 1].rate * 100;
  }

  function getLiabilityInsurance(grossIncome = 0, rate = 0.01) {
    return sanitizeAmount(grossIncome) * rate;
  }

  /**
   * Get risk tier for an activity code or profile
   * @param {string} activityCode - 5-digit CAE code (optional)
   * @param {string} activityProfile - 'services_high_value' or 'services_general'
   * @returns {string} Risk tier ID ('low', 'medium', 'high')
   */
  function getRiskTierForActivity(activityCode, activityProfile = 'services_high_value') {
    const normalized = normalizeActivityCode(activityCode);
    
    // First priority: Specific activity code mapping (for exceptions)
    if (normalized && DATA.INSURANCE_DATA.activityRiskMap[normalized]) {
      return DATA.INSURANCE_DATA.activityRiskMap[normalized];
    }
    
    // Second priority: Derive from activity profile
    // services_high_value (IT, consulting, design, etc.) → Medium risk
    // services_general (catch-all) → Low risk (conservative default)
    // Note: High risk activities like finance/healthcare are explicitly mapped above
    if (activityProfile === 'services_high_value') {
      return 'medium';
    }
    
    return 'low'; // Conservative default for general services
  }

  /**
   * GUESSTIMATE professional liability insurance premium (NOT a precise calculation)
   * This is a rough estimation based on industry averages and typical market rates.
   * Actual premiums can vary by ±20-40% depending on insurer, specific profession details,
   * claims history, and market conditions.
   * 
   * Formula: (BaseRate + Revenue × VariableRate) × RiskMultiplier × AdjustmentFactors
   * 
   * @param {Object} params
   * @param {number} params.revenue - Annual gross income
   * @param {string} params.activityCode - 5-digit CAE code (optional)
   * @param {string} params.activityProfile - Activity profile ID (fallback)
   * @param {string} params.riskTierOverride - Manual risk tier override ('low', 'medium', 'high')
   * @param {boolean} params.usaCoverage - Include USA/Canada coverage (+35%)
   * @param {string} params.claimsHistory - 'clean', 'minor', 'major'
   * @param {number} params.yearsInBusiness - Years in business (3+ gets discount)
   * @param {number} params.coverageLimit - Requested coverage limit (default: €2M)
   * @returns {Object} Premium guesstimate with breakdown
   */
  function calculateInsurancePremium({
    revenue = 0,
    activityCode = '',
    activityProfile = 'services_high_value',
    riskTierOverride = null,
    usaCoverage = false,
    claimsHistory = 'clean',
    yearsInBusiness = 3,
    coverageLimit = DATA.INSURANCE_DATA.standardCoverage,
  } = {}) {
    const income = sanitizeAmount(revenue);
    
    // Revenue validation
    if (income < 10000 || income > 10000000) {
      // Warn but still calculate
      console.warn('Insurance estimate: Revenue outside typical range (€10k-€10M)');
    }
    
    // 1. Determine risk tier
    const riskTierId = riskTierOverride || getRiskTierForActivity(activityCode, activityProfile);
    const riskTier = DATA.INSURANCE_DATA.riskTiers[riskTierId] || DATA.INSURANCE_DATA.riskTiers.medium;
    
    // 2. Calculate base premium: (BaseRate + Revenue × VariableRate) × RiskMultiplier
    const basePremium = (riskTier.baseRate + income * riskTier.variableRate) * riskTier.riskMultiplier;
    
    // 3. Apply adjustment factors
    let adjustedPremium = basePremium;
    const adjustments = [];
    
    // Portugal market discount
    adjustedPremium *= DATA.INSURANCE_DATA.portugalDiscount;
    adjustments.push({ 
      factor: 'Portugal market adjustment', 
      multiplier: DATA.INSURANCE_DATA.portugalDiscount 
    });
    
    // Economies of scale
    if (income >= DATA.INSURANCE_DATA.economiesOfScale.tier2Threshold) {
      adjustedPremium *= DATA.INSURANCE_DATA.economiesOfScale.tier2Multiplier;
      adjustments.push({ 
        factor: 'Economies of scale (>€300k)', 
        multiplier: DATA.INSURANCE_DATA.economiesOfScale.tier2Multiplier 
      });
    } else if (income >= DATA.INSURANCE_DATA.economiesOfScale.tier1Threshold) {
      adjustedPremium *= DATA.INSURANCE_DATA.economiesOfScale.tier1Multiplier;
      adjustments.push({ 
        factor: 'Economies of scale (>€150k)', 
        multiplier: DATA.INSURANCE_DATA.economiesOfScale.tier1Multiplier 
      });
    }
    
    // USA/Canada coverage (+35%)
    if (usaCoverage) {
      const adjustment = DATA.INSURANCE_DATA.adjustmentFactors.usaCoverage;
      adjustedPremium *= adjustment;
      adjustments.push({ factor: 'USA/Canada coverage', multiplier: adjustment });
    }
    
    // Claims history
    if (claimsHistory === 'minor') {
      const adjustment = DATA.INSURANCE_DATA.adjustmentFactors.minorClaims;
      adjustedPremium *= adjustment;
      adjustments.push({ factor: 'Minor claims history', multiplier: adjustment });
    } else if (claimsHistory === 'major') {
      const adjustment = DATA.INSURANCE_DATA.adjustmentFactors.majorClaims;
      adjustedPremium *= adjustment;
      adjustments.push({ factor: 'Major claims history', multiplier: adjustment });
    }
    
    // Experience discount (3+ years with clean record)
    if (yearsInBusiness >= 3 && claimsHistory === 'clean') {
      const adjustment = DATA.INSURANCE_DATA.adjustmentFactors.experienceDiscount;
      adjustedPremium *= adjustment;
      adjustments.push({ factor: '3+ years clean record', multiplier: adjustment });
    }
    
    // Coverage limit adjustment (±40% × (requested/typical - 1))
    const coverageRatio = coverageLimit / DATA.INSURANCE_DATA.standardCoverage;
    if (Math.abs(coverageRatio - 1.0) > 0.01) {
      const coverageAdjustment = 1 + 0.4 * (coverageRatio - 1);
      adjustedPremium *= coverageAdjustment;
      adjustments.push({ 
        factor: `Coverage limit €${(coverageLimit / 1000000).toFixed(1)}M`, 
        multiplier: coverageAdjustment 
      });
    }
    
    // 4. Sanity check: Premium should be 0.3% - 3% of revenue
    const premiumPercentage = income > 0 ? (adjustedPremium / income) * 100 : 0;
    const warning = premiumPercentage < 0.3 || premiumPercentage > 3.0
      ? `GUESSTIMATE: ${premiumPercentage.toFixed(2)}% of revenue (typical range 0.3%-3%). Get actual quotes for accuracy.`
      : null;
    
    return {
      annualPremium: adjustedPremium,
      basePremium,
      riskTier: riskTier,
      riskTierId,
      adjustments,
      premiumPercentage,
      revenue: income,
      coverageLimit,
      warning,
      breakdown: {
        baseRate: riskTier.baseRate,
        variableComponent: income * riskTier.variableRate,
        riskMultiplier: riskTier.riskMultiplier,
        adjustmentMultiplier: adjustedPremium / basePremium,
      },
    };
  }

  /**
   * Simple insurance guessetimation using activity profile fallback
   * (Used when activity code is not available)
   * Returns a rough estimate - actual premiums may vary significantly
   */
  function calculateSimpleInsurance(revenue, activityProfile = 'services_high_value') {
    return calculateInsurancePremium({
      revenue,
      activityProfile,
      // Use conservative defaults for guesstimate
      usaCoverage: false,
      claimsHistory: 'clean',
      yearsInBusiness: 3,
    });
  }

  function computeExpenseTotals({
    grossIncome = 0,
    baseExpenses = 0,
    adminFreelancer = 0,
    adminTransparent = 0,
    insuranceRate = 0.01,
  } = {}) {
    const liability = getLiabilityInsurance(grossIncome, insuranceRate);
    const base = sanitizeAmount(baseExpenses);
    const adminSimp = sanitizeAmount(adminFreelancer);
    const adminOrg = sanitizeAmount(adminTransparent);
    return {
      liabilityInsurance: liability,
      totalFreelancer: base + adminSimp + liability,
      totalTransparent: base + adminOrg,
    };
  }

  function computeSimplified({
    grossIncome = 0,
    activityCoefficient = 0.75,
    nhrStatus,
    dependentsCount,
    personalDeductions,
    isFirstYearIRS50pct,
    isFirstYearSSExempt,
    irsJovemEnabled,
    irsJovemYear,
    baseExpenses = 0,
    adminExpenses = 0,
    insuranceExpenses = 0,
    isNHREligible = true
  } = {}) {
    const income = sanitizeAmount(grossIncome);
    const coefficient = Math.min(1, Math.max(0, Number(activityCoefficient) || 0.75));
    const totalExpenses =
      sanitizeAmount(baseExpenses) + sanitizeAmount(adminExpenses) + sanitizeAmount(insuranceExpenses);
    const taxableIncome = income * coefficient;
    const irsDetails = computeIRSDetails(taxableIncome, nhrStatus, { isNHREligible });
    const baseIRS = Number(irsDetails.baseIRS || 0);
    const solidarityTax = Number(irsDetails.solidarityTax || 0);
    const deducoes = computeDeducoesAColeta({ dependentsCount, personalDeductions });
    let irsAfterDeductions = Math.max(0, baseIRS - deducoes);
    
    // Apply IRS Jovem exemption (if applicable)
    // Income cap: €28,737.50 (55 × IAS €522.50) applies to TAXABLE income after coefficient
    // Exemption applies only to IRS on income up to cap
    let irsJovemReduction = 0;
    if (irsJovemEnabled) {
      const IRS_JOVEM_CAP = 28737.50; // 55 × IAS for 2025
      const exemptionRate = getIRSJovemExemption(irsJovemYear);
      
      // Calculate what portion of taxable income is under the cap
      const taxableUnderCap = Math.min(taxableIncome, IRS_JOVEM_CAP);
      const portionUnderCap = taxableIncome > 0 ? taxableUnderCap / taxableIncome : 1;
      
      // Apply exemption only to IRS portion corresponding to income under cap
      const irsEligibleForExemption = irsAfterDeductions * portionUnderCap;
      irsJovemReduction = irsEligibleForExemption * exemptionRate;
      irsAfterDeductions -= irsJovemReduction;
    }
    
    // Apply first-year 50% reduction (if applicable)
    if (isFirstYearIRS50pct) irsAfterDeductions *= 0.5;
    
    let incomeTax = irsAfterDeductions + solidarityTax;
    const socialSecurityInfo = computeSSAnnual(income, { isFirstYearSSExempt });
    const netIncome = income - totalExpenses - incomeTax - socialSecurityInfo.annual;
    return {
      taxableIncome,
      incomeTax,
      socialSecurity: socialSecurityInfo.annual,
      socialSecurityInfo,
      netIncome,
      coefficient,
      totalExpenses,
      baseExpenses: sanitizeAmount(baseExpenses),
      adminExpenses: sanitizeAmount(adminExpenses),
      insuranceExpenses: sanitizeAmount(insuranceExpenses),
      deducoesATax: deducoes,
      grossIRS: baseIRS + solidarityTax,
      irsDetails,
      isNHREligible,
      irsJovemReduction,
    };
  }

  function computeFreelancerOrganized({
    grossIncome = 0,
    nhrStatus,
    dependentsCount,
    personalDeductions,
    isFirstYearIRS50pct,
    isFirstYearSSExempt,
    irsJovemEnabled,
    irsJovemYear,
    baseExpenses = 0,
    adminExpenses = 0,
    insuranceExpenses = 0,
    isNHREligible = true,
  } = {}) {
    const income = sanitizeAmount(grossIncome);
    const totalExpenses = sanitizeAmount(baseExpenses) + sanitizeAmount(adminExpenses) + sanitizeAmount(insuranceExpenses);
    const netBusinessIncome = Math.max(0, income - totalExpenses);
    const taxableIncome = netBusinessIncome;
    const irsDetails = computeIRSDetails(taxableIncome, nhrStatus, { isNHREligible });
    const baseIRS = Number(irsDetails.baseIRS || 0);
    const solidarityTax = Number(irsDetails.solidarityTax || 0);
    const deducoes = computeDeducoesAColeta({ dependentsCount, personalDeductions });
    let irsAfterDeductions = Math.max(0, baseIRS - deducoes);
    
    // Apply IRS Jovem exemption (if applicable)
    // Income cap: €28,737.50 (55 × IAS €522.50) applies to TAXABLE income
    // Exemption applies only to IRS on income up to cap
    let irsJovemReduction = 0;
    if (irsJovemEnabled) {
      const IRS_JOVEM_CAP = 28737.50; // 55 × IAS for 2025
      const exemptionRate = getIRSJovemExemption(irsJovemYear);
      
      // Calculate what portion of taxable income is under the cap
      const taxableUnderCap = Math.min(taxableIncome, IRS_JOVEM_CAP);
      const portionUnderCap = taxableIncome > 0 ? taxableUnderCap / taxableIncome : 1;
      
      // Apply exemption only to IRS portion corresponding to income under cap
      const irsEligibleForExemption = irsAfterDeductions * portionUnderCap;
      irsJovemReduction = irsEligibleForExemption * exemptionRate;
      irsAfterDeductions -= irsJovemReduction;
    }
    
    // Apply first-year 50% reduction (if applicable)
    if (isFirstYearIRS50pct) irsAfterDeductions *= 0.5;
    
    let incomeTax = irsAfterDeductions + solidarityTax;
    const socialSecurityInfo = computeSSAnnual(netBusinessIncome, { isFirstYearSSExempt });
    const netIncome = income - totalExpenses - incomeTax - socialSecurityInfo.annual;
    return {
      taxableIncome,
      incomeTax,
      socialSecurity: socialSecurityInfo.annual,
      socialSecurityInfo,
      netIncome,
      netBusinessIncome,
      coefficient: 1,
      totalExpenses,
      baseExpenses: sanitizeAmount(baseExpenses),
      adminExpenses: sanitizeAmount(adminExpenses),
      insuranceExpenses: sanitizeAmount(insuranceExpenses),
      deducoesATax: deducoes,
      grossIRS: baseIRS + solidarityTax,
      irsDetails,
      isNHREligible,
      irsJovemReduction,
    };
  }

  function computeTransparent({
    grossIncome = 0,
    nhrStatus,
    dependentsCount,
    personalDeductions,
    isFirstYearIRS50pct,
    isFirstYearSSExempt,
    irsJovemEnabled,
    irsJovemYear,
    baseExpenses = 0,
    adminExpenses = 0,
    isNHREligible = true,
    useLLCManagerMinSS = true,
  } = {}) {
    const income = sanitizeAmount(grossIncome);
    const totalExpenses = sanitizeAmount(baseExpenses) + sanitizeAmount(adminExpenses);
    const netBusinessIncome = Math.max(0, income - totalExpenses);
    const taxableIncome = netBusinessIncome;
    const irsDetails = computeIRSDetails(taxableIncome, nhrStatus, { isNHREligible });
    const baseIRS = Number(irsDetails.baseIRS || 0);
    const solidarityTax = Number(irsDetails.solidarityTax || 0);
    const deducoes = computeDeducoesAColeta({ dependentsCount, personalDeductions });
    let irsAfterDeductions = Math.max(0, baseIRS - deducoes);
    
    // Apply IRS Jovem exemption (if applicable)
    // Income cap: €28,737.50 (55 × IAS €522.50) applies to TAXABLE income
    // Exemption applies only to IRS on income up to cap
    let irsJovemReduction = 0;
    if (irsJovemEnabled) {
      const IRS_JOVEM_CAP = 28737.50; // 55 × IAS for 2025
      const exemptionRate = getIRSJovemExemption(irsJovemYear);
      
      // Calculate what portion of taxable income is under the cap
      const taxableUnderCap = Math.min(taxableIncome, IRS_JOVEM_CAP);
      const portionUnderCap = taxableIncome > 0 ? taxableUnderCap / taxableIncome : 1;
      
      // Apply exemption only to IRS portion corresponding to income under cap
      const irsEligibleForExemption = irsAfterDeductions * portionUnderCap;
      irsJovemReduction = irsEligibleForExemption * exemptionRate;
      irsAfterDeductions -= irsJovemReduction;
    }
    
    // Apply first-year 50% reduction (if applicable)
    if (isFirstYearIRS50pct) irsAfterDeductions *= 0.5;
    
    let incomeTax = irsAfterDeductions + solidarityTax;
    let socialSecurityInfo;
    if (useLLCManagerMinSS && !isFirstYearSSExempt) {
      const monthlyBase = DATA.REGULATORY_DATA.SOCIAL_SECURITY.ias; // 1× IAS as minimum manager base
      const employeeRate = 0.11;
      const employerRate = 0.2375;
      const monthlyEmployee = monthlyBase * employeeRate;
      const monthlyEmployer = monthlyBase * employerRate;
      const monthly = monthlyEmployee + monthlyEmployer;
      socialSecurityInfo = {
        annual: monthly * 12,
        monthly,
        monthlyEmployee,
        monthlyEmployer,
        monthlyBaseApplied: monthlyBase,
        monthlyCap: DATA.REGULATORY_DATA.SOCIAL_SECURITY.ias * DATA.REGULATORY_DATA.SOCIAL_SECURITY.maxBaseMultiplier,
        capped: false,
        mode: 'llc_manager_min',
      };
    } else {
      socialSecurityInfo = computeSSAnnual(netBusinessIncome, { isFirstYearSSExempt });
    }
    const netIncome = income - totalExpenses - incomeTax - socialSecurityInfo.annual;
    return {
      taxableIncome,
      incomeTax,
      socialSecurity: socialSecurityInfo.annual,
      socialSecurityInfo,
      netIncome,
      totalExpenses,
      baseExpenses: sanitizeAmount(baseExpenses),
      adminExpenses: sanitizeAmount(adminExpenses),
      netBusinessIncome,
      deducoesATax: deducoes,
      grossIRS: baseIRS + solidarityTax,
      irsDetails,
      isNHREligible,
      ssMode: useLLCManagerMinSS ? 'llc_manager_min' : 'self_employed',
      irsJovemReduction,
    };
  }

  /**
   * Compute 10-year projection for a given structure.
   * Shows year-by-year breakdown with income growth, declining benefits, etc.
   * 
   * @param {Object} params
   * @param {string} params.structure - 'simplified', 'organized', or 'transparent'
   * @param {number} params.grossIncomeYear1 - Starting gross income
   * @param {number} params.annualGrowthRate - Annual income growth (0.00 = 0%, 0.05 = 5%)
   * @param {number} params.years - Number of years to project (default: 10)
   * @param {Object} params.baseParams - All other params (nhrStatus, activityProfile, etc.)
   * @returns {Object} { yearByYear: [], totals: {}, npv: number }
   */
  function computeMultiYearProjection({
    structure = 'simplified',
    grossIncomeYear1 = 0,
    annualGrowthRate = 0.00,
    years = 10,
    baseParams = {},
  } = {}) {
    const results = [];
    let cumulativeNet = 0;
    
    for (let year = 1; year <= years; year++) {
      // Calculate income for this year with growth
      const yearIncome = Math.round(grossIncomeYear1 * Math.pow(1 + annualGrowthRate, year - 1));
      
      // Adjust IRS Jovem year if enabled
      const irsJovemYear = baseParams.irsJovemEnabled ? year : null;
      
      // First-year benefits only apply to year 1
      const isFirstYear = year === 1;
      const yearParams = {
        ...baseParams,
        grossIncome: yearIncome,
        irsJovemYear,
        irsJovemEnabled: baseParams.irsJovemEnabled,
        isFirstYearIRS50pct: isFirstYear && baseParams.isFirstYearIRS50pct,
        isFirstYearSSExempt: isFirstYear && baseParams.isFirstYearSSExempt,
      };
      
      // Compute for this year based on structure
      let yearResult;
      if (structure === 'organized') {
        yearResult = computeFreelancerOrganized(yearParams);
      } else if (structure === 'transparent') {
        yearResult = computeTransparent(yearParams);
      } else {
        yearResult = computeSimplified(yearParams);
      }
      
      cumulativeNet += yearResult.netIncome;
      
      results.push({
        year,
        income: yearIncome,
        netIncome: yearResult.netIncome,
        incomeTax: yearResult.incomeTax,
        socialSecurity: yearResult.socialSecurity,
        totalExpenses: yearResult.totalExpenses,
        taxableIncome: yearResult.taxableIncome,
        cumulativeNet,
        irsJovemReduction: yearResult.irsJovemReduction || 0,
        effectiveRate: yearIncome > 0 ? ((yearIncome - yearResult.netIncome) / yearIncome) * 100 : 0,
      });
    }
    
    // Calculate totals
    const totals = {
      totalGrossIncome: results.reduce((sum, r) => sum + r.income, 0),
      totalNetIncome: results.reduce((sum, r) => sum + r.netIncome, 0),
      totalIncomeTax: results.reduce((sum, r) => sum + r.incomeTax, 0),
      totalSocialSecurity: results.reduce((sum, r) => sum + r.socialSecurity, 0),
      totalExpenses: results.reduce((sum, r) => sum + r.totalExpenses, 0),
      totalIrsJovemSavings: results.reduce((sum, r) => sum + r.irsJovemReduction, 0),
      averageEffectiveRate: results.reduce((sum, r) => sum + r.effectiveRate, 0) / years,
    };
    
    // Calculate NPV (Net Present Value) with 3% discount rate
    const discountRate = 0.03;
    const npv = results.reduce((sum, r) => {
      const discountFactor = Math.pow(1 + discountRate, r.year - 1);
      return sum + (r.netIncome / discountFactor);
    }, 0);
    
    return {
      yearByYear: results,
      totals,
      npv: Math.round(npv),
      structure,
    };
  }

  /**
   * Compare all three structures over 10 years.
   * Returns projections for all structures plus comparison metrics.
   * 
   * @param {Object} params - Base parameters for all structures
   * @returns {Object} { simplified, organized, transparent, winner, breakeven }
   */
  function compareStructuresMultiYear(params) {
    const simplified = computeMultiYearProjection({
      ...params,
      structure: 'simplified',
    });
    
    const organized = computeMultiYearProjection({
      ...params,
      structure: 'organized',
    });
    
    const transparent = computeMultiYearProjection({
      ...params,
      structure: 'transparent',
    });
    
    // Determine winner based on total net income
    let winner = 'simplified';
    let maxNet = simplified.totals.totalNetIncome;
    
    if (organized.totals.totalNetIncome > maxNet) {
      winner = 'organized';
      maxNet = organized.totals.totalNetIncome;
    }
    
    if (transparent.totals.totalNetIncome > maxNet) {
      winner = 'transparent';
      maxNet = transparent.totals.totalNetIncome;
    }
    
    // Find breakeven point (if any) between simplified and transparent
    let breakevenYear = null;
    for (let year = 1; year <= params.years; year++) {
      const simpCum = simplified.yearByYear[year - 1].cumulativeNet;
      const transCum = transparent.yearByYear[year - 1].cumulativeNet;
      
      if (year === 1) continue; // Skip year 1
      
      const prevSimpCum = simplified.yearByYear[year - 2].cumulativeNet;
      const prevTransCum = transparent.yearByYear[year - 2].cumulativeNet;
      
      // Check if crossover happens between year-1 and year
      if (prevSimpCum > prevTransCum && simpCum <= transCum) {
        breakevenYear = year;
        break;
      } else if (prevTransCum > prevSimpCum && transCum <= simpCum) {
        breakevenYear = year;
        break;
      }
    }
    
    return {
      simplified,
      organized,
      transparent,
      winner,
      breakevenYear,
      advantage: {
        amount: maxNet - Math.min(
          simplified.totals.totalNetIncome,
          organized.totals.totalNetIncome,
          transparent.totals.totalNetIncome
        ),
        percentage: ((maxNet / Math.min(
          simplified.totals.totalNetIncome,
          organized.totals.totalNetIncome,
          transparent.totals.totalNetIncome
        )) - 1) * 100,
      },
    };
  }

  // Export business logic functions (no data - data comes from DATA)
  global.TakeHomeLogic = {
    // For backward compatibility, export data references
    // App.js still expects these - they now point to DATA
    TAX_DATA: DATA.REGULATORY_DATA,
    SUGGESTED_ADMIN: DATA.ADMIN_COSTS,
    INSURANCE_DATA: DATA.INSURANCE_DATA,
    
    // Pure calculation functions
    computeProgressiveTax,
    computeProgressiveTaxDetailed,
    computeIRSDetails,
    computeSolidarityTax,
    computeDeducoesAColeta,
    getIRSJovemExemption,
    computeSSAnnual,
    getMarginalTaxRate,
    computeSimplified,
    computeFreelancerOrganized,
    computeTransparent,
    getLiabilityInsurance,
    computeExpenseTotals,
    normalizeActivityCode,
    getActivityProfileForCode,
    isActivityCodeKnown,
    isNHREligibleCode,
    getRiskTierForActivity,
    calculateInsurancePremium,
    calculateSimpleInsurance,
    
    // Multi-year projection functions (NEW)
    computeMultiYearProjection,
    compareStructuresMultiYear,
  };
})(window);
