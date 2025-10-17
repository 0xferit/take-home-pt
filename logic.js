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

  // Create backward-compatible aliases for gradual migration
  // These will be removed in Step 7 after all references are updated
  const TAX_DATA = {
    taxBrackets2025: DATA.REGULATORY_DATA.TAX_BRACKETS_2025,
    nhrRates: DATA.REGULATORY_DATA.NHR_RATES,
    activityProfiles: DATA.REGULATORY_DATA.ACTIVITY_PROFILES,
    highValueServiceCodes: DATA.REGULATORY_DATA.HIGH_VALUE_SERVICE_CODES,
    coreServiceCodes: DATA.REGULATORY_DATA.CORE_SERVICE_CODES,
    activityCatalog: DATA.REGULATORY_DATA.ACTIVITY_CATALOG,
    socialSecurity: DATA.REGULATORY_DATA.SOCIAL_SECURITY,
    personalDeductions: DATA.REGULATORY_DATA.PERSONAL_DEDUCTIONS,
  };

  const INSURANCE_DATA = DATA.INSURANCE_DATA;
  const SUGGESTED_ADMIN = DATA.ADMIN_COSTS;

  console.log('✅ Logic layer initialized with data from TakeHomeData');

  // ============================================================================
  // ORIGINAL CONSTANTS (TEMPORARY - Will be removed in Step 5)
  // ============================================================================
  // These are kept temporarily to ensure no breakage during migration
  // DO NOT EDIT - These will be deleted in Step 5

  const SUGGESTED_ADMIN_OLD = {
    // Annual admin/compliance midpoints (EUR)
    freelancer: 800, // simplified regime typical support
    freelancer_organized: 3000, // organized accounting with TOC
    transparent: 4800, // LDA ongoing accounting/compliance
  };

  const INSURANCE_DATA_OLD = {
    // Professional liability insurance risk tiers (ROUGH ESTIMATES ONLY)
    // These are guesstimates based on industry averages and typical Portugal market rates
    // Actual quotes may vary significantly (±20-40%) depending on insurer and specific circumstances
    riskTiers: {
      low: {
        id: 'low',
        label: 'Low Risk',
        description: 'Designers, writers, content creators',
        baseRate: 280,
        variableRate: 0.0028,
        riskMultiplier: 0.8,
      },
      medium: {
        id: 'medium',
        label: 'Medium Risk',
        description: 'IT consultants, developers, business consultants',
        baseRate: 360,
        variableRate: 0.0036,
        riskMultiplier: 1.0,
      },
      high: {
        id: 'high',
        label: 'High Risk',
        description: 'Fintech, healthcare tech, financial advisors',
        baseRate: 640,
        variableRate: 0.0064,
        riskMultiplier: 1.8,
      },
    },
    // Portugal market adjustment (12% cheaper than EU average)
    portugalDiscount: 0.88,
    // Economies of scale for larger businesses
    economiesOfScale: {
      tier1Threshold: 150000,
      tier1Multiplier: 0.95,
      tier2Threshold: 300000,
      tier2Multiplier: 0.90,
    },
    // Activity code to risk tier mapping
    activityRiskMap: {
      // IT & Software (Medium Risk)
      '62010': 'medium', // Computer programming
      '62020': 'medium', // Computer consultancy
      '62030': 'medium', // Computer facilities management
      '62090': 'medium', // Other IT services
      '63110': 'medium', // Data processing, hosting
      '63120': 'medium', // Web portals
      '63990': 'medium', // Other information services
      
      // Design & Creative (Low Risk)
      '74100': 'low',   // Specialised design activities
      '74200': 'low',   // Photographic activities
      '73110': 'low',   // Advertising agencies
      '90010': 'low',   // Performing arts
      '90020': 'low',   // Support activities to performing arts
      
      // Business Consulting (Medium Risk)
      '70220': 'medium', // Business consultancy
      '73200': 'medium', // Market research
      '71110': 'medium', // Architectural activities
      '71120': 'medium', // Engineering activities
      
      // Finance & Healthcare (High Risk)
      '69200': 'high',  // Accounting, auditing
      '69102': 'high',  // Legal activities
      '86230': 'high',  // Dental practice
      '86900': 'high',  // Other human health activities
      '64190': 'high',  // Other monetary intermediation
      '64920': 'high',  // Other credit granting
      '66190': 'high',  // Other financial service activities
      '66220': 'high',  // Insurance agents and brokers
    },
    adjustmentFactors: {
      usaCoverage: 1.35,           // +35% for USA/Canada coverage
      minorClaims: 1.15,           // +15% for minor claims history
      majorClaims: 1.40,           // +40% for major claims history
      experienceDiscount: 0.90,    // -10% for 3+ years clean record
    },
    // Standard coverage limit (can be adjusted)
    standardCoverage: 2000000, // €2M coverage
  };

  const TAX_DATA = {
    // Sources: 2025 IRS tables (Orçamento do Estado 2025) and Segurança Social guidance.
    taxBrackets2025: [
      { max: 8059, rate: 0.13 },
      { max: 12160, rate: 0.165 },
      { max: 17233, rate: 0.22 },
      { max: 22306, rate: 0.25 },
      { max: 28400, rate: 0.32 },
      { max: 41629, rate: 0.355 },
      { max: 44987, rate: 0.435 },
      { max: 83696, rate: 0.45 },
      { max: Infinity, rate: 0.48 }
    ],
    nhrRates: {
      original_nhr: 0.20,
      nhr_2_ifici: 0.20,
      standard: 'progressive'
    },
    activityProfiles: {
      services_general: {
        id: 'services_general',
        label: 'General professional services',
        coefficient: 0.35,
        description: 'Applies to Category B services outside the high added value list. 35% of gross income remains taxable (65% deemed expenses).',
      },
      services_high_value: {
        id: 'services_high_value',
        label: 'High-value professions (Article 151)',
        coefficient: 0.75,
        description: 'Professional services listed in Article 151 (CIRS). 75% of gross income remains taxable (25% deemed expenses).',
      },
    },
    highValueServiceCodes: [
      '62010', '62020', '62030', '62090', '63110', '63120', '63990',
      '70220', '71110', '71120', '71200', '72110', '72200', '73110',
      '73200', '74100', '74900'
    ],
    coreServiceCodes: [
      '69200', '69102', '69109', '86230', '86900', '74200', '73120',
      '74909', '70210', '70220', '62020'
    ],
    activityCatalog: [
      { code: '62010', label: 'Computer programming activities', profileId: 'services_high_value' },
      { code: '62020', label: 'Computer consultancy activities', profileId: 'services_high_value' },
      { code: '62030', label: 'Computer facilities management activities', profileId: 'services_high_value' },
      { code: '62090', label: 'Other information technology and computer service activities', profileId: 'services_high_value' },
      { code: '63110', label: 'Data processing, hosting and related activities', profileId: 'services_high_value' },
      { code: '63120', label: 'Web portals', profileId: 'services_high_value' },
      { code: '63990', label: 'Other information service activities', profileId: 'services_high_value' },
      { code: '70220', label: 'Business and other management consultancy activities', profileId: 'services_high_value' },
      { code: '73110', label: 'Advertising agencies', profileId: 'services_high_value' },
      { code: '73200', label: 'Market research and public opinion polling', profileId: 'services_high_value' },
      { code: '74100', label: 'Specialised design activities', profileId: 'services_high_value' },
      { code: '74900', label: 'Other professional, scientific and technical activities', profileId: 'services_high_value' },
      { code: '69200', label: 'Accounting, bookkeeping and auditing activities', profileId: 'services_general' },
      { code: '69102', label: 'Legal activities', profileId: 'services_general' },
      { code: '86900', label: 'Other human health activities', profileId: 'services_general' },
      { code: '74200', label: 'Photographic activities', profileId: 'services_general' }
    ],
    socialSecurity: {
      rate: 0.214,
      relevantIncomeFactor: 0.70,
      ias: 522.5,
      maxBaseMultiplier: 12
    },
    personalDeductions: {
      personalAllowanceMin: 4462.15, // 8.54 × IAS 2025 (522.5)
      healthExpensesRate: 0.15,
      healthExpensesMax: 1000,
      dependentAllowance: 600
    }
  };

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
    const catalogEntry = TAX_DATA.activityCatalog.find((entry) => entry.code === normalized);
    if (catalogEntry) return TAX_DATA.activityProfiles[catalogEntry.profileId] || null;
    if (TAX_DATA.highValueServiceCodes.includes(normalized)) {
      return TAX_DATA.activityProfiles.services_high_value;
    }
    if (TAX_DATA.coreServiceCodes.includes(normalized)) {
      return TAX_DATA.activityProfiles.services_general;
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
    return TAX_DATA.highValueServiceCodes.includes(normalized);
  }

  function computeProgressiveTax(taxableIncome) {
    const income = sanitizeAmount(taxableIncome);
    let tax = 0;
    let previousMax = 0;
    for (const bracket of TAX_DATA.taxBrackets2025) {
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
    for (const bracket of TAX_DATA.taxBrackets2025) {
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
      const rate = TAX_DATA.nhrRates[nhrStatus];
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
    const dependentAllowance = dependents * TAX_DATA.personalDeductions.dependentAllowance;
    const healthDeduction = Math.min(
      sanitizeAmount(health) * TAX_DATA.personalDeductions.healthExpensesRate,
      TAX_DATA.personalDeductions.healthExpensesMax
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
    const rate = TAX_DATA.socialSecurity.rate;
    const factor = TAX_DATA.socialSecurity.relevantIncomeFactor;
    const maxMonthlyBase = TAX_DATA.socialSecurity.ias * TAX_DATA.socialSecurity.maxBaseMultiplier;
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
    for (const bracket of TAX_DATA.taxBrackets2025) {
      if (income <= bracket.max) return bracket.rate * 100;
    }
    return TAX_DATA.taxBrackets2025[TAX_DATA.taxBrackets2025.length - 1].rate * 100;
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
    if (normalized && INSURANCE_DATA.activityRiskMap[normalized]) {
      return INSURANCE_DATA.activityRiskMap[normalized];
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
    coverageLimit = INSURANCE_DATA.standardCoverage,
  } = {}) {
    const income = sanitizeAmount(revenue);
    
    // Revenue validation
    if (income < 10000 || income > 10000000) {
      // Warn but still calculate
      console.warn('Insurance estimate: Revenue outside typical range (€10k-€10M)');
    }
    
    // 1. Determine risk tier
    const riskTierId = riskTierOverride || getRiskTierForActivity(activityCode, activityProfile);
    const riskTier = INSURANCE_DATA.riskTiers[riskTierId] || INSURANCE_DATA.riskTiers.medium;
    
    // 2. Calculate base premium: (BaseRate + Revenue × VariableRate) × RiskMultiplier
    const basePremium = (riskTier.baseRate + income * riskTier.variableRate) * riskTier.riskMultiplier;
    
    // 3. Apply adjustment factors
    let adjustedPremium = basePremium;
    const adjustments = [];
    
    // Portugal market discount
    adjustedPremium *= INSURANCE_DATA.portugalDiscount;
    adjustments.push({ 
      factor: 'Portugal market adjustment', 
      multiplier: INSURANCE_DATA.portugalDiscount 
    });
    
    // Economies of scale
    if (income >= INSURANCE_DATA.economiesOfScale.tier2Threshold) {
      adjustedPremium *= INSURANCE_DATA.economiesOfScale.tier2Multiplier;
      adjustments.push({ 
        factor: 'Economies of scale (>€300k)', 
        multiplier: INSURANCE_DATA.economiesOfScale.tier2Multiplier 
      });
    } else if (income >= INSURANCE_DATA.economiesOfScale.tier1Threshold) {
      adjustedPremium *= INSURANCE_DATA.economiesOfScale.tier1Multiplier;
      adjustments.push({ 
        factor: 'Economies of scale (>€150k)', 
        multiplier: INSURANCE_DATA.economiesOfScale.tier1Multiplier 
      });
    }
    
    // USA/Canada coverage (+35%)
    if (usaCoverage) {
      const adjustment = INSURANCE_DATA.adjustmentFactors.usaCoverage;
      adjustedPremium *= adjustment;
      adjustments.push({ factor: 'USA/Canada coverage', multiplier: adjustment });
    }
    
    // Claims history
    if (claimsHistory === 'minor') {
      const adjustment = INSURANCE_DATA.adjustmentFactors.minorClaims;
      adjustedPremium *= adjustment;
      adjustments.push({ factor: 'Minor claims history', multiplier: adjustment });
    } else if (claimsHistory === 'major') {
      const adjustment = INSURANCE_DATA.adjustmentFactors.majorClaims;
      adjustedPremium *= adjustment;
      adjustments.push({ factor: 'Major claims history', multiplier: adjustment });
    }
    
    // Experience discount (3+ years with clean record)
    if (yearsInBusiness >= 3 && claimsHistory === 'clean') {
      const adjustment = INSURANCE_DATA.adjustmentFactors.experienceDiscount;
      adjustedPremium *= adjustment;
      adjustments.push({ factor: '3+ years clean record', multiplier: adjustment });
    }
    
    // Coverage limit adjustment (±40% × (requested/typical - 1))
    const coverageRatio = coverageLimit / INSURANCE_DATA.standardCoverage;
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
      const monthlyBase = TAX_DATA.socialSecurity.ias; // 1× IAS as minimum manager base
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
        monthlyCap: TAX_DATA.socialSecurity.ias * TAX_DATA.socialSecurity.maxBaseMultiplier,
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

  global.TakeHomeLogic = {
    TAX_DATA,
    SUGGESTED_ADMIN,
    INSURANCE_DATA,
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
  };
})(window);
