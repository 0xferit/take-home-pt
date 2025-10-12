// Pure business logic for TakeHomePT — exposed via window.TakeHomeLogic
(function (global) {
  const SUGGESTED_ADMIN = {
    // Annual admin/compliance midpoints (EUR)
    freelancer: 800, // simplified regime typical support
    freelancer_organized: 3000, // organized accounting with TOC
    transparent: 4800, // LDA ongoing accounting/compliance
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
    // Source: Portuguese Tax Code, IRS Jovem benefit (2020+)
    const exemptionRates = {
      1: 1.00,   // Year 1: 100% exemption
      2: 0.75,   // Year 2: 75% exemption
      3: 0.50,   // Year 3: 50% exemption
      4: 0.50,   // Year 4: 50% exemption
      5: 0.25,   // Year 5: 25% exemption
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

  function getLiabilityInsurance(grossIncome = 0) {
    return sanitizeAmount(grossIncome) * 0.01;
  }

  function computeExpenseTotals({
    grossIncome = 0,
    baseExpenses = 0,
    adminFreelancer = 0,
    adminTransparent = 0,
  } = {}) {
    const liability = getLiabilityInsurance(grossIncome);
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
    let irsJovemReduction = 0;
    if (irsJovemEnabled) {
      const exemptionRate = getIRSJovemExemption(irsJovemYear);
      irsJovemReduction = irsAfterDeductions * exemptionRate;
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
    let irsJovemReduction = 0;
    if (irsJovemEnabled) {
      const exemptionRate = getIRSJovemExemption(irsJovemYear);
      irsJovemReduction = irsAfterDeductions * exemptionRate;
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
    let irsJovemReduction = 0;
    if (irsJovemEnabled) {
      const exemptionRate = getIRSJovemExemption(irsJovemYear);
      irsJovemReduction = irsAfterDeductions * exemptionRate;
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
  };
})(window);
