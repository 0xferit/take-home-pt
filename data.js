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
    // Metadata
    VERSION: '2025.1',
    LAST_UPDATED: '2025-10-17',

    // Portuguese Tax & Regulatory Data
    REGULATORY_DATA: {
      // Will be populated in Step 3
    },

    // Professional Liability Insurance Data
    INSURANCE_DATA: {
      // Will be populated in Step 3
    },

    // Administrative & Compliance Costs
    ADMIN_COSTS: {
      // Will be populated in Step 3
    },

    // Application Defaults
    DEFAULTS: {
      // Will be populated in Step 3
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

    // Will add more specific validations in Step 3 after data is populated

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

    // Will add sanity checks in Step 3 after data is populated
    // Examples:
    // - IAS value reasonable (€400-€600 range)
    // - Tax brackets in ascending order
    // - Insurance rates positive
    // - Admin costs reasonable (€500-€10000 range)

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
