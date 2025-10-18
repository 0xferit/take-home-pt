// ============================================================================
// DATA LAYER - TakeHomePT Calculator
// ============================================================================
// 
// PURPOSE: Centralized data repository for all regulatory, insurance, and
//          configuration constants used by the TakeHomePT calculator.
//
// SEPARATION OF CONCERNS:
//   - This file contains ONLY pure data (no logic, no calculations)
//   - Business logic lives in logic.js
//   - UI presentation lives in app.js
//   - This file is loaded FIRST (before logic.js and app.js)
//
// WHO CAN EDIT:
//   ✅ Tax experts: Update tax rates, brackets, IAS values
//   ✅ Domain experts: Update insurance data, activity codes
//   ✅ Compliance team: Update regulatory references
//   ❌ DO NOT add functions or calculations here
//   ❌ DO NOT add UI logic here
//
// MAINTENANCE:
//   - Update VERSION when data changes
//   - Update LAST_UPDATED with change date
//   - Update SOURCES with official references
//   - Run validation after any changes
//
// USAGE:
//   Access via: window.TakeHomeData
//   Example: const ias = window.TakeHomeData.REGULATORY_DATA.IAS_2025;
//
// ============================================================================

(function (global) {
  'use strict';

  // ============================================================================
  // DATA STRUCTURE
  // ============================================================================

  const TakeHomeData = {
  // ============================================================================
  // DATA LAYER METADATA
  // ============================================================================
  
  // Version format: YYYY.MM.DD (date-based, update with each code change)
  // Full version at runtime: YYYY.MM.DD.{commit_hash} (e.g., 2025.10.17.c432057)
  // Commit hash is auto-fetched by app.js - updates with every commit
    VERSION: '2025.10.27',  // Update this date when making changes
  
  // Legacy field (kept for compatibility)
  LAST_UPDATED: '2025-10-17',

    // Portuguese Tax & Regulatory Data
    // Source: Orçamento do Estado 2025, Segurança Social 2025, CIRS Article 151
    REGULATORY_DATA: {
      // IRS (Income Tax) Progressive Brackets for 2025
      // Source: Lei n.º 55-A/2025, Article 68.º of Código do IRS
      // Official: https://diariodarepublica.pt/dr/detalhe/lei/55-a-2025-925904929
      TAX_BRACKETS_2025: [
        { max: 8059, rate: 0.125 },      // 12.50%
        { max: 12160, rate: 0.16 },      // 16.00%
        { max: 17233, rate: 0.215 },     // 21.50%
        { max: 22306, rate: 0.244 },     // 24.40%
        { max: 28400, rate: 0.314 },     // 31.40%
        { max: 41629, rate: 0.349 },     // 34.90%
        { max: 44987, rate: 0.431 },     // 43.10%
        { max: 83696, rate: 0.446 },     // 44.60%
        { max: Infinity, rate: 0.48 }    // 48.00%
      ],

      // NHR (Non-Habitual Resident) Tax Rates
      NHR_RATES: {
        original_nhr: 0.20,
        nhr_2_ifici: 0.20,
        standard: 'progressive'
      },

      // Solidarity Tax (Additional tax on high incomes)
      SOLIDARITY_TAX: {
        tier1: { min: 80000, max: 250000, rate: 0.025 },
        tier2: { min: 250000, max: Infinity, rate: 0.05 }
      },

      // Activity Profiles (Deemed Expense Coefficients)
      ACTIVITY_PROFILES: {
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

      // CAE Activity Codes (High-Value Services - NHR Eligible)
      HIGH_VALUE_SERVICE_CODES: [
        '62010', '62020', '62030', '62090', '63110', '63120', '63990',
        '70220', '71110', '71120', '71200', '72110', '72200', '73110',
        '73200', '74100', '74900'
      ],

      // CAE Activity Codes (Core/General Services)
      CORE_SERVICE_CODES: [
        '69200', '69102', '69109', '86230', '86900', '74200', '73120',
        '74909', '70210', '70220', '62020'
      ],

      // Activity Catalog (CAE Code to Profile Mapping)
      ACTIVITY_CATALOG: [
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

      // Social Security Parameters
      // Source: Lei n.º 110/2009 (Código dos Regimes Contributivos)
      // Article 168.º (21.4% self-employed), Article 53.º (34.75% total LLC)
      // Official: https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34514575
      SOCIAL_SECURITY: {
        rate: 0.214,                    // 21.4% contribution rate (self-employed)
        relevantIncomeFactor: 0.70,     // 70% of quarterly income is "relevant"
        ias: 522.5,                     // IAS 2025 (Indexante de Apoios Sociais)
        rmmg: 870,                      // RMMG 2025 (Minimum Monthly Wage)
        maxBaseMultiplier: 12,          // Maximum base = 12 × IAS
        employeeRate: 0.11,             // Employee contribution (for LLC managers)
        employerRate: 0.2375,           // Employer contribution (for LLC managers)
      },

      // IAS Reference Value 2025
      // Source: Portaria n.º 6-B/2025, Article 2.º
      // Official: https://diariodarepublica.pt/dr/detalhe/portaria/6-b-2025-902111932
      IAS_2025: 522.5,
      
      // RMMG (Minimum Monthly Wage) 2025
      // Source: Decreto-Lei n.º 112/2024, Article 3.º  
      // Official: https://diariodarepublica.pt/dr/detalhe/decreto-lei/112-2024-900706889
      RMMG_2025: 870,

      // Personal Tax Deductions
      PERSONAL_DEDUCTIONS: {
        personalAllowanceMin: 4462.15,  // 8.54 × IAS 2025 (522.5)
        healthExpensesRate: 0.15,       // 15% of health expenses deductible
        healthExpensesMax: 1000,        // Maximum €1,000 health deduction
        dependentAllowance: 600         // €600 per dependent
      },

      // IRS Jovem (Young Tax Benefit) Schedule - NEW 2025
      // Source: Law 24-B/2024, CIRS Article 2-B
      IRS_JOVEM_SCHEDULE: {
        incomeCap: 28737.50,            // 55 × IAS (applies to taxable income)
        exemptionRates: {
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
        }
      },
    },

    // Professional Liability Insurance Data
    // Source: Portugal insurance market estimates 2024-2025
    // NOTE: These are ROUGH ESTIMATES based on industry averages
    //       Actual quotes may vary significantly (±20-40%)
    INSURANCE_DATA: {
      // Risk Tiers (Base Rates + Variable Rates)
      riskTiers: {
        low: {
          id: 'low',
          label: 'Low Risk',
          description: 'Designers, writers, content creators',
          baseRate: 280,              // Base annual premium (EUR)
          variableRate: 0.0028,       // Variable rate (% of revenue)
          riskMultiplier: 0.8,        // Risk adjustment multiplier
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

      // Portugal Market Adjustment (12% cheaper than EU average)
      portugalDiscount: 0.88,

      // Economies of Scale for Larger Businesses
      economiesOfScale: {
        tier1Threshold: 150000,       // €150k revenue threshold
        tier1Multiplier: 0.95,        // 5% discount
        tier2Threshold: 300000,       // €300k revenue threshold
        tier2Multiplier: 0.90,        // 10% discount
      },

      // Activity Code to Risk Tier Mapping
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

      // Premium Adjustment Factors
      adjustmentFactors: {
        usaCoverage: 1.35,            // +35% for USA/Canada coverage
        minorClaims: 1.15,            // +15% for minor claims history
        majorClaims: 1.40,            // +40% for major claims history
        experienceDiscount: 0.90,     // -10% for 3+ years clean record
      },

      // Standard Coverage Limit
      standardCoverage: 2000000,      // €2M coverage (typical)
    },

    // Administrative & Compliance Costs
    // Source: Professional accountant estimates (Portugal 2024-2025)
    // Updated 2025-10-27 based on accountant review
    // NOTE: These are professional estimates - actual costs vary by provider
    ADMIN_COSTS: {
      freelancer: 1200,               // Simplified regime typical support (EUR/year)
      freelancer_organized: 3000,     // Organized accounting with TOC (EUR/year)
      transparent: 2400,              // LDA ongoing accounting/compliance (EUR/year)
    },

    // Application Defaults
    DEFAULTS: {
      bizExpensesPercent: 0.05,       // Default business expenses: 5% of gross income
    },

    // Official Data Sources
    SOURCES: {
      tax: 'Orçamento do Estado 2025 (State Budget)',
      socialSecurity: 'Segurança Social - Trabalhadores Independentes 2025',
      ias: 'Portaria n.º 41/2025 (IAS €522.50)',
      insurance: 'Portugal insurance market estimates 2024-2025',
    },
  };

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  /**
   * Validates the data structure for completeness and correctness.
   * Called automatically on load and can be called manually after updates.
   * 
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  function validateData() {
    const errors = [];

    // Check metadata
    if (!TakeHomeData.VERSION) {
      errors.push('Missing VERSION');
    }
    if (!TakeHomeData.LAST_UPDATED) {
      errors.push('Missing LAST_UPDATED');
    }

    // Check main data sections exist
    if (!TakeHomeData.REGULATORY_DATA) {
      errors.push('Missing REGULATORY_DATA');
    }
    if (!TakeHomeData.INSURANCE_DATA) {
      errors.push('Missing INSURANCE_DATA');
    }
    if (!TakeHomeData.ADMIN_COSTS) {
      errors.push('Missing ADMIN_COSTS');
    }
    if (!TakeHomeData.DEFAULTS) {
      errors.push('Missing DEFAULTS');
    }
    if (!TakeHomeData.SOURCES) {
      errors.push('Missing SOURCES');
    }

    // Validate REGULATORY_DATA structure
    const reg = TakeHomeData.REGULATORY_DATA;
    if (reg) {
      if (!reg.TAX_BRACKETS_2025 || !Array.isArray(reg.TAX_BRACKETS_2025)) {
        errors.push('REGULATORY_DATA.TAX_BRACKETS_2025 must be an array');
      }
      if (!reg.NHR_RATES || typeof reg.NHR_RATES !== 'object') {
        errors.push('REGULATORY_DATA.NHR_RATES must be an object');
      }
      if (!reg.ACTIVITY_PROFILES || typeof reg.ACTIVITY_PROFILES !== 'object') {
        errors.push('REGULATORY_DATA.ACTIVITY_PROFILES must be an object');
      }
      if (!reg.SOCIAL_SECURITY || typeof reg.SOCIAL_SECURITY !== 'object') {
        errors.push('REGULATORY_DATA.SOCIAL_SECURITY must be an object');
      }
      if (typeof reg.IAS_2025 !== 'number' || reg.IAS_2025 <= 0) {
        errors.push('REGULATORY_DATA.IAS_2025 must be a positive number');
      }
      if (!reg.ACTIVITY_CATALOG || !Array.isArray(reg.ACTIVITY_CATALOG)) {
        errors.push('REGULATORY_DATA.ACTIVITY_CATALOG must be an array');
      }
    }

    // Validate INSURANCE_DATA structure
    const ins = TakeHomeData.INSURANCE_DATA;
    if (ins) {
      if (!ins.riskTiers || typeof ins.riskTiers !== 'object') {
        errors.push('INSURANCE_DATA.riskTiers must be an object');
      }
      if (typeof ins.portugalDiscount !== 'number' || ins.portugalDiscount <= 0) {
        errors.push('INSURANCE_DATA.portugalDiscount must be a positive number');
      }
      if (!ins.activityRiskMap || typeof ins.activityRiskMap !== 'object') {
        errors.push('INSURANCE_DATA.activityRiskMap must be an object');
      }
    }

    // Validate ADMIN_COSTS structure
    const admin = TakeHomeData.ADMIN_COSTS;
    if (admin) {
      if (typeof admin.freelancer !== 'number' || admin.freelancer < 0) {
        errors.push('ADMIN_COSTS.freelancer must be a non-negative number');
      }
      if (typeof admin.freelancer_organized !== 'number' || admin.freelancer_organized < 0) {
        errors.push('ADMIN_COSTS.freelancer_organized must be a non-negative number');
      }
      if (typeof admin.transparent !== 'number' || admin.transparent < 0) {
        errors.push('ADMIN_COSTS.transparent must be a non-negative number');
      }
    }

    // Validate DEFAULTS structure
    const defaults = TakeHomeData.DEFAULTS;
    if (defaults) {
      if (typeof defaults.bizExpensesPercent !== 'number' || defaults.bizExpensesPercent < 0 || defaults.bizExpensesPercent > 1) {
        errors.push('DEFAULTS.bizExpensesPercent must be a number between 0 and 1');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Performs sanity checks on populated data values.
   * Called after data is fully populated.
   * 
   * @returns {Object} { valid: boolean, warnings: string[] }
   */
  function sanityCheck() {
    const warnings = [];

    // Check IAS value is reasonable (€400-€700 range)
    const ias = TakeHomeData.REGULATORY_DATA?.IAS_2025;
    if (ias && (ias < 400 || ias > 700)) {
      warnings.push(`IAS value ${ias} is outside expected range (€400-€700)`);
    }

    // Check tax brackets are in ascending order
    const brackets = TakeHomeData.REGULATORY_DATA?.TAX_BRACKETS_2025;
    if (brackets && Array.isArray(brackets)) {
      let prevMax = 0;
      for (let i = 0; i < brackets.length; i++) {
        if (brackets[i].max <= prevMax && brackets[i].max !== Infinity) {
          warnings.push(`Tax bracket ${i} is not in ascending order`);
        }
        if (brackets[i].rate < 0 || brackets[i].rate > 1) {
          warnings.push(`Tax bracket ${i} has invalid rate: ${brackets[i].rate}`);
        }
        prevMax = brackets[i].max;
      }
    }

    // Check admin costs are reasonable (€500-€10,000 range)
    const admin = TakeHomeData.ADMIN_COSTS;
    if (admin) {
      if (admin.freelancer < 500 || admin.freelancer > 10000) {
        warnings.push(`ADMIN_COSTS.freelancer (${admin.freelancer}) is outside typical range (€500-€10,000)`);
      }
      if (admin.freelancer_organized < 500 || admin.freelancer_organized > 10000) {
        warnings.push(`ADMIN_COSTS.freelancer_organized (${admin.freelancer_organized}) is outside typical range (€500-€10,000)`);
      }
      if (admin.transparent < 500 || admin.transparent > 10000) {
        warnings.push(`ADMIN_COSTS.transparent (${admin.transparent}) is outside typical range (€500-€10,000)`);
      }
    }

    // Check insurance risk tiers have positive values
    const riskTiers = TakeHomeData.INSURANCE_DATA?.riskTiers;
    if (riskTiers) {
      ['low', 'medium', 'high'].forEach((tier) => {
        const t = riskTiers[tier];
        if (t) {
          if (t.baseRate <= 0) {
            warnings.push(`Insurance ${tier} tier has invalid baseRate: ${t.baseRate}`);
          }
          if (t.variableRate <= 0) {
            warnings.push(`Insurance ${tier} tier has invalid variableRate: ${t.variableRate}`);
          }
          if (t.riskMultiplier <= 0) {
            warnings.push(`Insurance ${tier} tier has invalid riskMultiplier: ${t.riskMultiplier}`);
          }
        }
      });
    }

    // Check social security rate is reasonable
    const ssRate = TakeHomeData.REGULATORY_DATA?.SOCIAL_SECURITY?.rate;
    if (ssRate && (ssRate < 0.15 || ssRate > 0.30)) {
      warnings.push(`Social Security rate ${ssRate} is outside expected range (15%-30%)`);
    }

    return {
      valid: warnings.length === 0,
      warnings: warnings,
    };
  }

  // ============================================================================
  // EXPORT TO GLOBAL SCOPE
  // ============================================================================

  // Expose data to window
  global.TakeHomeData = TakeHomeData;

  // Expose validation functions
  global.TakeHomeData.validate = validateData;
  global.TakeHomeData.sanityCheck = sanityCheck;

  // Run initial validation
  const validationResult = validateData();
  if (!validationResult.valid) {
    console.warn('TakeHomeData validation warnings:', validationResult.errors);
  }

  // Log successful load
  console.log(
    `✅ TakeHomeData loaded successfully (v${TakeHomeData.VERSION}, ${TakeHomeData.LAST_UPDATED})`
  );
})(window);
