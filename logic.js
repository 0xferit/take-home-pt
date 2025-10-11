// Pure business logic for TakeHomePT — exposed via window.TakeHomeLogic
(function (global) {
  const TAX_DATA = {
    // Sources: AT IRS tables for 2025 (Portaria n.º 43/2024) and Segurança Social contribution guidance.
    taxBrackets2025: [
      { min: 0, max: 7703, rate: 0.1325 },
      { min: 7703, max: 11623, rate: 0.165 },
      { min: 11623, max: 16472, rate: 0.225 },
      { min: 16472, max: 21321, rate: 0.265 },
      { min: 21321, max: 27146, rate: 0.3275 },
      { min: 27146, max: 39791, rate: 0.37 },
      { min: 39791, max: 51997, rate: 0.435 },
      { min: 51997, max: 81199, rate: 0.45 },
      { min: 81199, max: 999999999, rate: 0.48 }
    ],
    activityCoefficients: {
      services: 75,
      goods: 15,
      accommodation_food: 35
    },
    nhrRates: {
      original_nhr: 0.20,
      nhr_2_ifici: 0.20,
      standard: 'progressive'
    },
    socialSecurity: {
      rate: 0.214,
      relevantIncomeFactor: 0.70
    },
    personalDeductions: {
      personalAllowanceMin: 4104,
      healthExpensesRate: 0.15,
      healthExpensesMax: 1000,
      dependentAllowance: 600
    }
  };

  function sanitizeAmount(value) {
    return Math.max(0, Number(value) || 0);
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

  function computeGrossIRS(taxableIncome, nhrStatus) {
    if (nhrStatus === 'original_nhr' || nhrStatus === 'nhr_2_ifici') {
      return sanitizeAmount(taxableIncome) * TAX_DATA.nhrRates[nhrStatus];
    }
    return computeProgressiveTax(taxableIncome);
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

  function computeSSAnnual(relevantIncome, { isFirstYearSSExempt } = {}) {
    if (isFirstYearSSExempt) return 0;
    const base = sanitizeAmount(relevantIncome) * TAX_DATA.socialSecurity.relevantIncomeFactor;
    return base * TAX_DATA.socialSecurity.rate;
  }

  function getMarginalTaxRate(taxableIncome) {
    const income = sanitizeAmount(taxableIncome);
    for (const bracket of TAX_DATA.taxBrackets2025) {
      if (income <= bracket.max) return bracket.rate * 100;
    }
    return TAX_DATA.taxBrackets2025[TAX_DATA.taxBrackets2025.length - 1].rate * 100;
  }

  function computeSimplified({
    grossIncome = 0,
    activityType = 'services',
    nhrStatus,
    dependentsCount,
    personalDeductions,
    isFirstYearIRS50pct,
    isFirstYearSSExempt,
    baseExpenses = 0,
    adminExpenses = 0,
    insuranceExpenses = 0
  } = {}) {
    const income = sanitizeAmount(grossIncome);
    const coefficient = TAX_DATA.activityCoefficients[activityType] ?? TAX_DATA.activityCoefficients.services;
    const totalExpenses =
      sanitizeAmount(baseExpenses) + sanitizeAmount(adminExpenses) + sanitizeAmount(insuranceExpenses);
    const taxableIncome = income * (coefficient / 100);
    const grossIRS = computeGrossIRS(taxableIncome, nhrStatus);
    const deducoes = computeDeducoesAColeta({ dependentsCount, personalDeductions });
    let incomeTax = Math.max(0, grossIRS - deducoes);
    if (isFirstYearIRS50pct) incomeTax *= 0.5;
    const socialSecurity = computeSSAnnual(income, { isFirstYearSSExempt });
    const netIncome = income - totalExpenses - incomeTax - socialSecurity;
    return {
      taxableIncome,
      incomeTax,
      socialSecurity,
      netIncome,
      coefficient,
      totalExpenses,
      baseExpenses: sanitizeAmount(baseExpenses),
      adminExpenses: sanitizeAmount(adminExpenses),
      insuranceExpenses: sanitizeAmount(insuranceExpenses),
      deducoesATax: deducoes
    };
  }

  function computeTransparent({
    grossIncome = 0,
    nhrStatus,
    dependentsCount,
    personalDeductions,
    isFirstYearIRS50pct,
    isFirstYearSSExempt,
    baseExpenses = 0,
    adminExpenses = 0
  } = {}) {
    const income = sanitizeAmount(grossIncome);
    const totalExpenses = sanitizeAmount(baseExpenses) + sanitizeAmount(adminExpenses);
    const netBusinessIncome = Math.max(0, income - totalExpenses);
    const taxableIncome = netBusinessIncome;
    const grossIRS = computeGrossIRS(taxableIncome, nhrStatus);
    const deducoes = computeDeducoesAColeta({ dependentsCount, personalDeductions });
    let incomeTax = Math.max(0, grossIRS - deducoes);
    if (isFirstYearIRS50pct) incomeTax *= 0.5;
    const socialSecurity = computeSSAnnual(netBusinessIncome, { isFirstYearSSExempt });
    const netIncome = income - totalExpenses - incomeTax - socialSecurity;
    return {
      taxableIncome,
      incomeTax,
      socialSecurity,
      netIncome,
      totalExpenses,
      baseExpenses: sanitizeAmount(baseExpenses),
      adminExpenses: sanitizeAmount(adminExpenses),
      netBusinessIncome,
      deducoesATax: deducoes
    };
  }

  global.TakeHomeLogic = {
    TAX_DATA,
    computeProgressiveTax,
    computeGrossIRS,
    computeDeducoesAColeta,
    computeSSAnnual,
    getMarginalTaxRate,
    computeSimplified,
    computeTransparent
  };
})(window);
