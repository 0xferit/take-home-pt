// ============================================================================
// UI PRESENTATION LAYER - TakeHomePT Calculator
// ============================================================================
//
// PURPOSE: DOM manipulation, user interaction, and visual presentation.
//          NO data definitions here - all data comes from data.js
//          NO calculations here - all logic comes from logic.js
//
// SEPARATION OF CONCERNS:
//   - Data definitions: data.js
//   - Business logic: logic.js
//   - UI presentation: app.js (this file)
//
// DEPENDENCIES:
//   - Requires data.js and logic.js to be loaded first
//   - Accesses: window.TakeHomeData and window.TakeHomeLogic
//
// ============================================================================

// Import business logic functions from window.TakeHomeLogic
const {
    TAX_DATA,
    INSURANCE_DATA,
    computeDeducoesAColeta,
    computeSimplified,
    computeTransparent,
    computeFreelancerOrganized,
    SUGGESTED_ADMIN,
    computeExpenseTotals,
    getLiabilityInsurance,
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
} = window.TakeHomeLogic;

// Import data from window.TakeHomeData (for app defaults)
const DATA = window.TakeHomeData;
if (!DATA) {
    console.error('FATAL: TakeHomeData not loaded. Ensure data.js loads before app.js in index.html.');
    console.error('Script load order should be: data.js → logic.js → app.js');
}
if (!window.TakeHomeLogic) {
    console.error('FATAL: TakeHomeLogic not loaded. Ensure logic.js loads before app.js in index.html.');
}

console.log('✅ UI layer initialized with data and logic');

const currencyFormatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const formatCurrency = (value) => currencyFormatter.format(Number.isFinite(value) ? value : 0);
const formatSignedCurrency = (value) => {
    const normalized = Number(value) || 0;
    const prefix = normalized >= 0 ? '+' : '−';
    return `${prefix} ${formatCurrency(Math.abs(normalized))}`;
};
const formatPercent = (value) => `${value.toFixed(1)}%`;
const formatSignedPercent = (value) => `${value >= 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}%`;
const formatRate = (value) => `${(value * 100).toFixed(1).replace(/\.0$/, '')}%`;

// Format solidarity tax with calculation breakdown
// Shows how solidarity tax is computed based on income tiers:
// - 2.5% on income between €80,000 and €250,000
// - 5% on income above €250,000
const formatSolidarityTaxBreakdown = (taxableIncome, totalSolidarityTax) => {
    const income = Number(taxableIncome) || 0;
    const tier1Min = 80000;
    const tier2Min = 250000;
    
    // Calculate each tier
    const tier1Amount = income > tier1Min ? Math.min(income, tier2Min) - tier1Min : 0;
    const tier2Amount = income > tier2Min ? income - tier2Min : 0;
    
    const tier1Tax = tier1Amount * 0.025;
    const tier2Tax = tier2Amount * 0.05;
    
    let breakdown = 'Solidarity tax: ';
    
    if (tier2Amount > 0) {
        // Both tiers apply (income > €250,000)
        breakdown += `[${formatCurrency(tier1Amount)} (€80k-€250k) × 2.5% = ${formatCurrency(tier1Tax)}] + `;
        breakdown += `[${formatCurrency(tier2Amount)} (>€250k) × 5% = ${formatCurrency(tier2Tax)}] = `;
        breakdown += `${formatCurrency(totalSolidarityTax)}`;
    } else if (tier1Amount > 0) {
        // Only tier 1 applies (€80,000 < income ≤ €250,000)
        const incomeFormatted = formatCurrency(income).replace(/\s/g, '');
        breakdown += `${formatCurrency(tier1Amount)} (€80k-${incomeFormatted}) × 2.5% = ${formatCurrency(totalSolidarityTax)}`;
    } else {
        // No solidarity tax (income ≤ €80,000)
        breakdown += `${formatCurrency(totalSolidarityTax)} (no solidarity tax, income ≤ €80k)`;
    }
    
    return breakdown;
};

// Get application defaults from data layer
const DEFAULTS = DATA.DEFAULTS;

const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
};

const ACTIVITY_DEFAULT = 'services_high_value';

const appState = {
    nhrStatus: 'standard',
    activityProfile: ACTIVITY_DEFAULT,
    activityCode: '',
    grossIncome: 0,
    expenses: {},
    expensesUserModified: false, // Track if user manually set business expenses
    isFirstYearSSExempt: false,
    isFirstYearIRS50pct: false,
    irsJovemEnabled: false,
    irsJovemYear: 1,
    liabilityInsurance: 0,
    insuranceRate: 0.01, // Legacy, kept for compatibility
    freelancerBasis: 'simplified',
    personalDeductions: {
        health: 0,
        education: 0,
        charitable: 0,
        retirement: 0,
    },
    // New insurance settings
    insurance: {
        useManual: false,
        manualAmount: 0,
        riskOverride: null,
        claimsHistory: 'clean',
        yearsInBusiness: 3,
        usaCoverage: false,
        coverageLimit: 2000000,
        calculatedPremium: null,
    },
    // Multi-year projection settings (NEW)
    multiYear: {
        annualGrowthRate: 0.00,  // 0% default (conservative)
        years: 10,                // 10-year projection
    },
};

function initApp() {
    setupEventListeners();
    populateAssumptions();
    applySuggestedAdminIfEnabled();
    populateActivityCodeOptions();
    updateActivitySelectionDisplay();
    updateActivityTypeRadioState(); // Initialize radio button state
    updateCAECodeStatus(); // Initialize CAE code status display
    updateNHROptions(); // Initialize NHR dropdown state based on default activity
    updateFreelancerTitle();
    const baseField = document.getElementById('total-business-expenses');
    if (baseField) {
        // Initialize to 5% of gross income if empty/zero
        const fieldValue = parseFloat(baseField.value) || 0;
        const autoValue = appState.grossIncome * DEFAULTS.bizExpensesPercent;
        appState.expenses['total-business-expenses'] = fieldValue > 0 ? fieldValue : autoValue;
        // Update field to show calculated value
        if (fieldValue === 0 && autoValue > 0) {
            baseField.value = Math.round(autoValue);
        }
    }
    // Initialize admin expense fields with their default values
    const adminFreelancerField = document.getElementById('admin-freelancer');
    if (adminFreelancerField) {
        const adminFreelancerValue = Math.max(0, parseFloat(adminFreelancerField.value) || 0);
        appState.expenses['admin-freelancer'] = adminFreelancerValue;
    }
    const adminTransparentField = document.getElementById('admin-transparent');
    if (adminTransparentField) {
        const adminTransparentValue = Math.max(0, parseFloat(adminTransparentField.value) || 0);
        appState.expenses['admin-transparent'] = adminTransparentValue;
    }
    updateInsuranceDisplay(); // Initialize insurance calculation
    updateExpenseTotal();
    calculateAndUpdate();
    populateAppVersion();
}

function setupEventListeners() {
    let recalcTimer;
    const recalc = () => {
        clearTimeout(recalcTimer);
        recalcTimer = setTimeout(() => calculateAndUpdate(), 200);
    };

    document.querySelectorAll('.tab').forEach((tab) => {
        tab.addEventListener('click', (event) => {
            const tabName = event.currentTarget?.dataset?.tab;
            if (tabName) switchTab(tabName);
        });
    });
    
    // Activity profile radio buttons
    const activityProfileRadios = document.querySelectorAll('input[name="activity-profile"]');
    activityProfileRadios.forEach((input) => {
        input.addEventListener('change', (event) => {
            if (!event.target.checked) return;
            // Clear activity code when manually selecting activity type
            appState.activityCode = '';
            const codeField = document.getElementById('activity-code');
            if (codeField) codeField.value = '';
            
            appState.activityProfile = event.target.value;
            syncActivityRadios();
            updateActivitySelectionDisplay();
            updateActivityTypeRadioState(); // Update disabled state
            updateCAECodeStatus(); // Update CAE status since code was cleared
            updateNHROptions();
            updateInputsAtGlance();
            updateInsuranceDisplay(); // Update insurance when activity changes
            recalc();
        });
    });
    
    const freelancerBasisRadios = document.querySelectorAll('input[name="freelancer-basis"]');
    freelancerBasisRadios.forEach((input) => {
        input.addEventListener('change', (event) => {
            if (!event.target.checked) return;
            appState.freelancerBasis = event.target.value === 'organized' ? 'organized' : 'simplified';
            // Update admin expenses if suggested admin is enabled
            applySuggestedAdminIfEnabled();
            updateFreelancerTitle();
            updateExpenseTotal();
            recalc();
        });
    });


    document.getElementById('nhr-status').addEventListener('change', (event) => {
        appState.nhrStatus = event.target.value;
        
        // Mutual exclusion: Disable IRS Jovem if NHR selected
        const irsJovemCheckbox = document.getElementById('irs-jovem');
        const irsJovemWarning = document.getElementById('irs-jovem-nhr-warning');
        
        if (event.target.value !== 'standard') {
            // NHR selected - disable IRS Jovem
            if (irsJovemCheckbox) {
                irsJovemCheckbox.disabled = true;
                irsJovemCheckbox.checked = false;
                appState.irsJovemEnabled = false;
            }
            if (irsJovemWarning) {
                irsJovemWarning.style.display = 'block';
            }
            const irsJovemYearSelector = document.getElementById('irs-jovem-year-selector');
            if (irsJovemYearSelector) {
                irsJovemYearSelector.style.display = 'none';
            }
        } else {
            // Standard selected - enable IRS Jovem
            if (irsJovemCheckbox) {
                irsJovemCheckbox.disabled = false;
            }
            if (irsJovemWarning) {
                irsJovemWarning.style.display = 'none';
            }
        }
        
        updateInputsAtGlance();
        recalc();
    });

    // Insurance manual override toggle
    const insuranceUseManual = document.getElementById('insurance-use-manual');
    const insuranceManualInput = document.getElementById('insurance-manual-input');
    if (insuranceUseManual && insuranceManualInput) {
        insuranceUseManual.addEventListener('change', (event) => {
            appState.insurance.useManual = event.target.checked;
            insuranceManualInput.style.display = event.target.checked ? 'block' : 'none';
            updateInsuranceDisplay();
            updateExpenseTotal();
            recalc();
        });
    }

    // Insurance manual amount
    const insuranceManualAmount = document.getElementById('insurance-manual-amount');
    if (insuranceManualAmount) {
        insuranceManualAmount.addEventListener('input', (event) => {
            appState.insurance.manualAmount = Math.max(0, parseFloat(event.target.value) || 0);
            updateInsuranceDisplay();
            updateExpenseTotal();
            recalc();
        });
    }

    // Insurance advanced settings
    const insuranceRiskOverride = document.getElementById('insurance-risk-override');
    if (insuranceRiskOverride) {
        insuranceRiskOverride.addEventListener('change', (event) => {
            appState.insurance.riskOverride = event.target.value || null;
            updateInsuranceDisplay();
            updateExpenseTotal();
            recalc();
        });
    }

    const insuranceClaimsHistory = document.getElementById('insurance-claims-history');
    if (insuranceClaimsHistory) {
        insuranceClaimsHistory.addEventListener('change', (event) => {
            appState.insurance.claimsHistory = event.target.value;
            updateInsuranceDisplay();
            updateExpenseTotal();
            recalc();
        });
    }

    const insuranceYearsBusiness = document.getElementById('insurance-years-business');
    if (insuranceYearsBusiness) {
        insuranceYearsBusiness.addEventListener('input', (event) => {
            appState.insurance.yearsInBusiness = Math.max(0, parseInt(event.target.value) || 3);
            updateInsuranceDisplay();
            updateExpenseTotal();
            recalc();
        });
    }

    const insuranceUsaCoverage = document.getElementById('insurance-usa-coverage');
    if (insuranceUsaCoverage) {
        insuranceUsaCoverage.addEventListener('change', (event) => {
            appState.insurance.usaCoverage = event.target.checked;
            updateInsuranceDisplay();
            updateExpenseTotal();
            recalc();
        });
    }

    const insuranceCoverageLimit = document.getElementById('insurance-coverage-limit');
    if (insuranceCoverageLimit) {
        insuranceCoverageLimit.addEventListener('change', (event) => {
            appState.insurance.coverageLimit = parseInt(event.target.value) || 2000000;
            updateInsuranceDisplay();
            updateExpenseTotal();
            recalc();
        });
    }

    // Activity profile selector
    const activityProfileSelect = document.getElementById('activity-profile');
    if (activityProfileSelect) {
        activityProfileSelect.addEventListener('change', (event) => {
            appState.activityProfile = event.target.value;
            updateInputsAtGlance();
            updateNHROptions();
            recalc();
        });
    }

    const ssExemption = document.getElementById('firstyear-ss-exempt');
    if (ssExemption) {
        ssExemption.addEventListener('change', (event) => {
            appState.isFirstYearSSExempt = event.target.checked;
            updateInputsAtGlance();
            recalc();
        });
    }

    const irsReduction = document.getElementById('firstyear-irs-50');
    if (irsReduction) {
        irsReduction.addEventListener('change', (event) => {
            appState.isFirstYearIRS50pct = event.target.checked;
            updateInputsAtGlance();
            recalc();
        });
    }

    const irsJovemCheckbox = document.getElementById('irs-jovem');
    const irsJovemYearSelector = document.getElementById('irs-jovem-year-selector');
    const irsJovemYear = document.getElementById('irs-jovem-year');
    
    if (irsJovemCheckbox && irsJovemYearSelector) {
        irsJovemCheckbox.addEventListener('change', (event) => {
            appState.irsJovemEnabled = event.target.checked;
            irsJovemYearSelector.style.display = event.target.checked ? 'block' : 'none';
            
            // Mutual exclusion: Disable NHR if IRS Jovem selected
            const nhrSelect = document.getElementById('nhr-status');
            const nhrWarning = document.getElementById('nhr-irs-jovem-warning');
            
            if (event.target.checked) {
                // IRS Jovem selected - disable NHR, force standard
                if (nhrSelect) {
                    // Disable NHR options
                    Array.from(nhrSelect.options).forEach((option) => {
                        if (option.value !== 'standard') {
                            option.disabled = true;
                        }
                    });
                    // Force standard if NHR was selected
                    if (nhrSelect.value !== 'standard') {
                        nhrSelect.value = 'standard';
                        appState.nhrStatus = 'standard';
                    }
                }
                if (nhrWarning) {
                    nhrWarning.style.display = 'block';
                }
            } else {
                // IRS Jovem unchecked - re-enable NHR based on activity eligibility
                if (nhrWarning) {
                    nhrWarning.style.display = 'none';
                }
                updateNHROptions(); // This will enable NHR options if activity is eligible
            }
            
            updateInputsAtGlance();
            recalc();
        });
    }

    if (irsJovemYear) {
        irsJovemYear.addEventListener('change', (event) => {
            appState.irsJovemYear = parseInt(event.target.value) || 1;
            recalc();
        });
    }

    // Export to PDF
    const exportBtn = document.getElementById('export-pdf-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Save scenario
    const saveBtn = document.getElementById('save-scenario-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveScenario();
        });
    }

    const incomeMap = {
        'gross-income': 'grossIncome',
    };

    const grossField = document.getElementById('gross-income');
    if (grossField) {
        const initial = Math.max(0, parseFloat(grossField.value) || 0);
        appState.grossIncome = initial;
    }
    
    // Income growth rate field
    const growthRateField = document.getElementById('income-growth-rate');
    if (growthRateField) {
        growthRateField.addEventListener('input', (event) => {
            const value = Math.max(0, Math.min(20, parseFloat(event.target.value) || 0));
            event.target.value = value;
            appState.multiYear.annualGrowthRate = value / 100; // Convert percentage to decimal
            recalc();
        });
    }
    
    Object.entries(incomeMap).forEach(([id, key]) => {
        const field = document.getElementById(id);
        if (!field) return;
        field.addEventListener('input', (event) => {
            const value = Math.max(0, parseFloat(event.target.value) || 0);
            event.target.value = value;
            appState[key] = value;
            
            if (id === 'gross-income') {
                updateInsuranceDisplay(); // Update insurance when income changes
                checkSimplifiedRegimeLimit(); // Check €200k limit
                
                // Auto-update business expenses to 5% if user hasn't manually set them
                if (!appState.expensesUserModified) {
                    const baseExpensesField = document.getElementById('total-business-expenses');
                    if (baseExpensesField) {
                        const autoValue = Math.round(value * DEFAULTS.bizExpensesPercent);
                        baseExpensesField.value = autoValue;
                        appState.expenses['total-business-expenses'] = autoValue;
                    }
                }
            }
            
            updateExpenseTotal();
            recalc();
        });
    });

    document.querySelectorAll('.expense-input').forEach((input) => {
        input.addEventListener('input', (event) => {
            const value = Math.max(0, parseFloat(event.target.value) || 0);
            event.target.value = value;
            appState.expenses[event.target.id] = value;
            
            // Mark that user has manually set business expenses
            if (event.target.id === 'total-business-expenses') {
                appState.expensesUserModified = true;
            }
            
            updateExpenseTotal();
            recalc();
        });
    });

    const suggestedAdminToggle = document.getElementById('use-suggested-admin');
    if (suggestedAdminToggle) {
        suggestedAdminToggle.addEventListener('change', () => {
            applySuggestedAdminIfEnabled();
            updateExpenseTotal();
            recalc();
        });
    }

    ['health-expenses', 'education-expenses', 'charitable-donations', 'retirement-contributions'].forEach((id) => {
        const field = document.getElementById(id);
        if (!field) return;
        field.addEventListener('input', (event) => {
            const value = Math.max(0, parseFloat(event.target.value) || 0);
            event.target.value = value;
            const key = id.split('-')[0];
            appState.personalDeductions[key] = value;
            updatePersonalDeductions();
            recalc();
        });
    });

    // CAE code lookup - auto-select activity type
    const activityCodeField = document.getElementById('activity-code');
    const activityCodeClearBtn = document.getElementById('activity-code-clear');
    
    if (activityCodeField) {
        activityCodeField.addEventListener('input', (event) => {
            const code = normalizeActivityCode(event.target.value);
            
            // If code is cleared, re-enable manual activity selection
            if (!code || code.length === 0) {
                appState.activityCode = '';
                updateActivityTypeRadioState(); // Re-enable radio buttons
                updateCAECodeStatus(); // Update status indicators
                return;
            }
            
            if (code.length === 5) {
                const profile = getActivityProfileForCode(code);
                if (profile) {
                    setActivityProfile(profile.id, { source: 'cae', silent: false });
                    appState.activityCode = code;
                    updateActivityTypeRadioState(); // Disable radio buttons when code is set
                    updateCAECodeStatus(); // Update status indicators
                    updateNHROptions();
                    updateInputsAtGlance();
                    updateInsuranceDisplay(); // Update insurance when CAE code changes
                    recalc();
                }
            }
        });
    }
    
    // Clear button for CAE code
    if (activityCodeClearBtn && activityCodeField) {
        activityCodeClearBtn.addEventListener('click', () => {
            activityCodeField.value = '';
            appState.activityCode = '';
            updateActivityTypeRadioState();
            updateCAECodeStatus();
            updateInsuranceDisplay();
            recalc();
        });
    }

    document.querySelectorAll('[data-tab-target]').forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            const target = event.currentTarget?.dataset?.tabTarget;
            if (!target) return;
            switchTab(target);
            if (target === 'income') {
                setTimeout(() => {
                    const incomeInput = document.getElementById('gross-income');
                    if (incomeInput) incomeInput.focus();
                }, 80);
            }
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));
    const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(tabName);
    if (tabButton) tabButton.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
}

function updateFreelancerTitle() {
    const title = document.getElementById('freelancer-results-title');
    if (!title) return;
    title.textContent = appState.freelancerBasis === 'organized'
        ? 'Freelancer (Organized) Results'
        : 'Freelancer (Simplified) Results';
}

function setExpenseValue(id, value) {
    const field = document.getElementById(id);
    if (!field) return;
    const normalized = Math.max(0, Number(value) || 0);
    field.value = normalized.toFixed(2);
    appState.expenses[id] = normalized;
}

function setActivityProfile(profileId = ACTIVITY_DEFAULT, { source = 'manual', silent = false } = {}) {
    if (!profileId || !TAX_DATA.activityProfiles[profileId]) {
        profileId = ACTIVITY_DEFAULT;
    }
    appState.activityProfile = profileId;
    syncActivityRadios();
    if (!silent) {
        updateActivitySelectionDisplay();
    }
    if (source === 'manual') {
        appState.activityCode = '';
        const codeField = document.getElementById('activity-code');
        if (codeField) codeField.value = '';
    }
}

function syncActivityRadios() {
    document.querySelectorAll('[data-activity-option]').forEach((option) => {
        if (!option) return;
        const optionId = option.getAttribute('data-activity-option');
        const input = option.querySelector('input[type="radio"]');
        const isSelected = optionId === appState.activityProfile;
        option.classList.toggle('selected', isSelected);
        if (input) input.checked = isSelected;
    });
}

function updateActivityTypeRadioState() {
    // Disable activity type radio buttons if CAE code is set
    const hasActivityCode = appState.activityCode && appState.activityCode.length === 5;
    const activityRadios = document.querySelectorAll('input[name="activity-profile"]');
    const activityCards = document.querySelectorAll('[data-activity-option]');
    
    activityRadios.forEach((radio) => {
        radio.disabled = hasActivityCode;
    });
    
    activityCards.forEach((card) => {
        if (hasActivityCode) {
            card.style.opacity = '0.6';
            card.style.cursor = 'not-allowed';
            card.style.pointerEvents = 'none';
        } else {
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
            card.style.pointerEvents = 'auto';
        }
    });
    
    // Update the label text to indicate locked state
    const manualLabel = document.getElementById('activity-manual-label');
    if (manualLabel) {
        if (hasActivityCode) {
            manualLabel.innerHTML = '🔒 Activity type (locked - derived from CAE code above):';
            manualLabel.style.fontWeight = '600';
            manualLabel.style.color = 'var(--color-text-muted)';
        } else {
            manualLabel.textContent = 'Or select activity type manually:';
            manualLabel.style.fontWeight = 'normal';
            manualLabel.style.color = '';
        }
    }
}

function updateCAECodeStatus() {
    const hasActivityCode = appState.activityCode && appState.activityCode.length === 5;
    const statusElement = document.getElementById('activity-code-status');
    const derivedTypeElement = document.getElementById('activity-code-derived-type');
    const unlockHint = document.getElementById('activity-code-unlock-hint');
    const clearBtn = document.getElementById('activity-code-clear');
    const codeContainer = document.getElementById('activity-code-container');
    
    if (hasActivityCode) {
        // Show status and clear button
        if (statusElement) statusElement.style.display = 'block';
        if (clearBtn) clearBtn.style.display = 'block';
        if (unlockHint) unlockHint.style.display = 'inline';
        
        // Update derived type text
        if (derivedTypeElement) {
            const profile = getActivityProfileData(appState.activityProfile);
            derivedTypeElement.textContent = profile?.label || appState.activityProfile;
        }
        
        // Highlight the container
        if (codeContainer) {
            codeContainer.style.borderLeftColor = 'var(--color-success)';
            codeContainer.style.borderLeftWidth = '4px';
        }
    } else {
        // Hide status and clear button
        if (statusElement) statusElement.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
        if (unlockHint) unlockHint.style.display = 'none';
        
        // Reset container highlight
        if (codeContainer) {
            codeContainer.style.borderLeftColor = 'var(--color-primary)';
        }
    }
}

function populateActivityCodeOptions() {
    const datalist = document.getElementById('activity-code-options');
    if (!datalist) return;
    datalist.innerHTML = '';
    (TAX_DATA.activityCatalog || []).forEach((entry) => {
        const option = document.createElement('option');
        option.value = entry.code;
        option.textContent = `${entry.code} — ${entry.label}`;
        datalist.appendChild(option);
    });
}

function getActivityProfileData(profileId = ACTIVITY_DEFAULT) {
    return TAX_DATA.activityProfiles[profileId] || TAX_DATA.activityProfiles[ACTIVITY_DEFAULT];
}

function isCurrentNHREligible() {
    if (appState.activityCode) {
        return isNHREligibleCode(appState.activityCode);
    }
    return appState.activityProfile === 'services_high_value';
}

function getCurrentActivityCoefficient() {
    const profile = getActivityProfileData(appState.activityProfile);
    return profile.coefficient;
}

function getNHRStatusLabel() {
    const select = document.getElementById('nhr-status');
    if (!select) return 'Standard progressive rates';
    const selectedOption = Array.from(select.options).find((option) => option.value === appState.nhrStatus);
    if (selectedOption) return selectedOption.textContent.trim();
    const fallback = select.options[select.selectedIndex];
    return fallback ? fallback.textContent.trim() : 'Standard progressive rates';
}

function updateInputsAtGlance() {
    const nhrSummary = document.getElementById('glance-nhr-status');
    if (nhrSummary) {
        nhrSummary.textContent = getNHRStatusLabel();
    }
    const activitySummary = document.getElementById('glance-activity-value');
    if (activitySummary) {
        const profile = getActivityProfileData(appState.activityProfile);
        const label = profile?.id === 'services_high_value'
            ? 'High‑value professions (Art. 151) – 75% taxable'
            : 'General professional services – 35% taxable';
        activitySummary.textContent = label;
    }
    const firstYearContainer = document.getElementById('glance-firstyear');
    if (firstYearContainer) {
        const chips = [];
        if (appState.isFirstYearSSExempt) {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.textContent = 'SS exemption';
            chips.push(chip);
        }
        if (appState.isFirstYearIRS50pct) {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.textContent = '50% IRS reduction';
            chips.push(chip);
        }
        if (!chips.length) {
            const chip = document.createElement('span');
            chip.className = 'chip chip--muted';
            chip.textContent = 'None selected';
            chips.push(chip);
        }
        firstYearContainer.replaceChildren(...chips);
    }
}

function updateActivitySelectionDisplay() {
    const codeListElement = document.getElementById('activity-summary-codes');
    if (codeListElement) {
        codeListElement.textContent = TAX_DATA.highValueServiceCodes.join(', ');
    }
    updateNHROptions();
    updateInputsAtGlance();
}

function applySuggestedAdminIfEnabled() {
    const toggle = document.getElementById('use-suggested-admin');
    if (!toggle || !toggle.checked) return;
    const freelAdmin = appState.freelancerBasis === 'organized' 
        ? SUGGESTED_ADMIN.freelancer_organized 
        : SUGGESTED_ADMIN.freelancer;
    setExpenseValue('admin-freelancer', freelAdmin);
    setExpenseValue('admin-transparent', SUGGESTED_ADMIN.transparent);
}

function updateInsuranceDisplay() {
    // Get the auto-derived risk tier (what the system thinks it should be)
    const derivedRiskTier = getRiskTierForActivity(appState.activityCode, appState.activityProfile);
    
    // Calculate insurance premium using the new formula
    const premiumResult = calculateInsurancePremium({
        revenue: appState.grossIncome,
        activityCode: appState.activityCode,
        activityProfile: appState.activityProfile,
        riskTierOverride: appState.insurance.riskOverride, // null means use auto-derived
        usaCoverage: appState.insurance.usaCoverage,
        claimsHistory: appState.insurance.claimsHistory,
        yearsInBusiness: appState.insurance.yearsInBusiness,
        coverageLimit: appState.insurance.coverageLimit,
    });

    // Store the calculated premium for use in expense calculations
    appState.insurance.calculatedPremium = premiumResult;

    // Determine which premium to display
    const displayPremium = appState.insurance.useManual 
        ? appState.insurance.manualAmount 
        : premiumResult.annualPremium;

    // Update display elements
    setText('insurance-auto-estimate', formatCurrency(displayPremium));
    setText('insurance-auto-percentage', (premiumResult.premiumPercentage || 0).toFixed(2) + '%');
    
    // Show risk label with indicator if it's overridden
    const riskLabel = appState.insurance.riskOverride 
        ? `${premiumResult.riskTier.label} (manual)` 
        : `${premiumResult.riskTier.label} (auto)`;
    setText('insurance-risk-label', riskLabel);
    
    // Update the risk override dropdown to show the current auto-derived value as hint
    const riskOverrideSelect = document.getElementById('insurance-risk-override');
    if (riskOverrideSelect && !appState.insurance.riskOverride) {
        // Update the "Auto" option text to show what it will use
        const autoOption = riskOverrideSelect.querySelector('option[value=""]');
        if (autoOption) {
            const tierLabel = INSURANCE_DATA.riskTiers[derivedRiskTier]?.label || 'Medium';
            autoOption.textContent = `Auto (${tierLabel} - based on activity)`;
        }
    }
    
    // Update activity label
    const activityLabel = appState.activityCode 
        ? `CAE ${appState.activityCode}` 
        : (appState.activityProfile === 'services_high_value' ? 'High-value services' : 'General services');
    setText('insurance-activity-label', activityLabel);
    setText('insurance-revenue-label', formatCurrency(appState.grossIncome).replace('€', '').replace(/\s/g, ''));

    // Show warning if premium is outside expected range
    const warningElement = document.getElementById('insurance-warning');
    if (warningElement) {
        if (premiumResult.warning && !appState.insurance.useManual) {
            warningElement.textContent = '⚠️ ' + premiumResult.warning;
            warningElement.style.display = 'block';
        } else {
            warningElement.style.display = 'none';
        }
    }
}

function updateExpenseTotal() {
    const base = appState.expenses['total-business-expenses'] || 0;
    const adminSimplified = appState.expenses['admin-freelancer'] || 0;
    const adminTransparent = appState.expenses['admin-transparent'] || 0;
    
    // Calculate insurance using new formula
    updateInsuranceDisplay();
    const liabilityInsurance = appState.insurance.useManual 
        ? appState.insurance.manualAmount 
        : (appState.insurance.calculatedPremium?.annualPremium || 0);

    appState.liabilityInsurance = liabilityInsurance;
    
    // Calculate totals
    const totalFreelancer = base + adminSimplified + liabilityInsurance;
    const totalTransparent = base + adminTransparent;

    setText('total-expenses-simp', formatCurrency(totalFreelancer));
    setText('total-expenses-org', formatCurrency(totalTransparent));
    
    // Show expense breakdown for transparency
    const simpBreakdown = `Shared: ${formatCurrency(base)} + Admin: ${formatCurrency(adminSimplified)} + Insurance: ${formatCurrency(liabilityInsurance)}`;
    const orgBreakdown = `Shared: ${formatCurrency(base)} + Admin: ${formatCurrency(adminTransparent)}`;
    setText('expense-breakdown-simp', simpBreakdown);
    setText('expense-breakdown-org', orgBreakdown);

    const totalMax = Math.max(totalFreelancer, totalTransparent);
    const warningElement = document.getElementById('expense-warning');
    const errorElement = document.getElementById('expense-error');
    const hasIncome = appState.grossIncome > 0;
    const warn = hasIncome && totalMax > appState.grossIncome * 0.8 && totalMax < appState.grossIncome;
    const err = hasIncome && totalMax >= appState.grossIncome;
    if (warningElement) {
        warningElement.style.display = warn ? 'block' : 'none';
        if (warn) {
            warningElement.textContent = '⚠️ Warning: Expenses exceed 80% of gross income (in at least one setup). Please review your entries.';
        }
    }
    if (errorElement) {
        errorElement.style.display = err ? 'block' : 'none';
        if (err) {
            errorElement.textContent = '⛔ In at least one setup, expenses are equal to or exceed gross income. Recommendation and break-even are disabled.';
        }
    }
}

function computeDeducoesToTax() {
    return computeDeducoesAColeta({
        personalDeductions: appState.personalDeductions,
    });
}

function updatePersonalDeductions() {
    const { personalAllowanceMin, healthExpensesRate, healthExpensesMax } = TAX_DATA.personalDeductions;
    const healthDeduction = Math.min(appState.personalDeductions.health * healthExpensesRate, healthExpensesMax);
    const total = computeDeducoesToTax();

    setText('personal-allowance-display', formatCurrency(personalAllowanceMin));
    setText('health-deduction-display', formatCurrency(healthDeduction));
    setText('total-deductions-display', formatCurrency(total));
}

function calculateAndUpdate() {
    // Check simplified regime income limit (€200,000 for Category B professional income only)
    const SIMPLIFIED_REGIME_LIMIT = 200000;
    const exceedsSimplifiedLimit = appState.grossIncome > SIMPLIFIED_REGIME_LIMIT;
    const simplifiedWarning = document.getElementById('simplified-regime-warning');
    const incomeOverLimit = document.getElementById('income-over-limit');
    
    // ENFORCE organized accounting when income exceeds limit
    if (exceedsSimplifiedLimit) {
        if (appState.freelancerBasis === 'simplified') {
            // Automatically switch to organized
            appState.freelancerBasis = 'organized';
            
            // Update the radio buttons
            const organizedRadio = document.querySelector('input[name="freelancer-basis"][value="organized"]');
            if (organizedRadio) {
                organizedRadio.checked = true;
            }
            
            // Update admin expenses if suggested admin is enabled
            applySuggestedAdminIfEnabled();
            updateFreelancerTitle();
        }
        
        // Disable simplified radio button
        const simplifiedRadio = document.querySelector('input[name="freelancer-basis"][value="simplified"]');
        if (simplifiedRadio) {
            simplifiedRadio.disabled = true;
        }
        
        // Show warning with enforcement message
        if (simplifiedWarning) {
            simplifiedWarning.style.display = 'block';
            if (incomeOverLimit) {
                incomeOverLimit.textContent = formatCurrency(appState.grossIncome).replace(/\s/g, '');
            }
        }
    } else {
        // Re-enable simplified option when below limit
        const simplifiedRadio = document.querySelector('input[name="freelancer-basis"][value="simplified"]');
        if (simplifiedRadio) {
            simplifiedRadio.disabled = false;
        }
        
        if (simplifiedWarning) {
            simplifiedWarning.style.display = 'none';
        }
    }

    // Capture expense values AFTER enforcement (in case they were updated)
    const baseExpenses = appState.expenses['total-business-expenses'] || 0;
    const adminSimplified = appState.expenses['admin-freelancer'] || 0;
    const adminTransparent = appState.expenses['admin-transparent'] || 0;

    const nhrEligible = isCurrentNHREligible();

    // Build common parameters (shared by all structures)
    const commonParams = {
        activityCoefficient: getCurrentActivityCoefficient(),
        activityProfile: appState.activityProfile,
        nhrStatus: appState.nhrStatus,
        personalDeductions: appState.personalDeductions,
        isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
        isFirstYearSSExempt: appState.isFirstYearSSExempt,
        irsJovemEnabled: appState.irsJovemEnabled,
        baseExpenses,
        insuranceExpenses: appState.liabilityInsurance ?? getLiabilityInsurance(appState.grossIncome, appState.insuranceRate),
        isNHREligible: nhrEligible,
        dependentsCount: 0,
    };

    // Compute freelancer projection (simplified or organized based on user selection)
    const freelancerStructure = appState.freelancerBasis === 'organized' ? 'organized' : 'simplified';
    const freelancerProjection = computeMultiYearProjection({
        structure: freelancerStructure,
        grossIncomeYear1: appState.grossIncome,
        annualGrowthRate: appState.multiYear.annualGrowthRate,
        years: appState.multiYear.years,
        baseParams: {
            ...commonParams,
            adminExpenses: adminSimplified,  // Freelancer admin costs
        },
    });

    // Compute transparent (LDA) projection with different admin expenses
    const transparentProjection = computeMultiYearProjection({
        structure: 'transparent',
        grossIncomeYear1: appState.grossIncome,
        annualGrowthRate: appState.multiYear.annualGrowthRate,
        years: appState.multiYear.years,
        baseParams: {
            ...commonParams,
            adminExpenses: adminTransparent,  // LDA admin costs
            useLLCManagerMinSS: true,          // LDA-specific SS calculation
        },
    });

    // Validate projections before updating display
    if (!freelancerProjection || !freelancerProjection.yearByYear || !freelancerProjection.totals) {
        console.error('Freelancer projection failed:', freelancerProjection);
        return;
    }
    if (!transparentProjection || !transparentProjection.yearByYear || !transparentProjection.totals) {
        console.error('Transparent projection failed:', transparentProjection);
        return;
    }

    // Update displays with multi-year results
    try {
        updateResultsDisplayMultiYear(freelancerProjection, transparentProjection);
        updatePersonalDeductions();
        updateComparisonTableMultiYear(freelancerProjection, transparentProjection);
        updateRecommendationMultiYear(freelancerProjection, transparentProjection);
        updateWinnerBannerMultiYear(freelancerProjection, transparentProjection);
        updateCalculationBreakdownMultiYear(freelancerProjection, transparentProjection);
        updateRecommendationDetailsMultiYear(freelancerProjection, transparentProjection);
        updateSanityChecks();
        updateResultsVisibility();
    } catch (error) {
        console.error('Error updating display:', error);
        console.error('Stack:', error.stack);
    }
}

// ============================================================================
// MULTI-YEAR DISPLAY FUNCTIONS
// ============================================================================

function updateResultsDisplayMultiYear(freelancer, transparent) {
    // Display 10-year summary at top
    const freelancerTotal = freelancer.totals.totalNetIncome;
    const transparentTotal = transparent.totals.totalNetIncome;
    const difference = transparentTotal - freelancerTotal;
    
    const freelancerName = appState.freelancerBasis === 'organized' 
        ? 'Freelancer (Organized)' 
        : 'Freelancer (Simplified)';
    
    // Update 10-year summary totals
    setText('summary-net-simp', formatCurrency(freelancerTotal));
    setText('summary-net-org', formatCurrency(transparentTotal));
    setText('summary-net-diff', formatSignedCurrency(difference));
    
    setText('summary-cost-simp', formatCurrency(freelancer.totals.totalExpenses));
    setText('summary-cost-org', formatCurrency(transparent.totals.totalExpenses));
    setText('summary-cost-diff', formatSignedCurrency(transparent.totals.totalExpenses - freelancer.totals.totalExpenses));
    
    const freelancerTotalTax = freelancer.totals.totalIncomeTax + freelancer.totals.totalSocialSecurity;
    const transparentTotalTax = transparent.totals.totalIncomeTax + transparent.totals.totalSocialSecurity;
    
    setText('summary-tax-simp', formatCurrency(freelancerTotalTax));
    setText('summary-tax-org', formatCurrency(transparentTotalTax));
    setText('summary-tax-diff', formatSignedCurrency(transparentTotalTax - freelancerTotalTax));
    
    const freelancerAvgRate = freelancer.totals.averageEffectiveRate;
    const transparentAvgRate = transparent.totals.averageEffectiveRate;
    
    setText('summary-rate-simp', formatPercent(freelancerAvgRate));
    setText('summary-rate-org', formatPercent(transparentAvgRate));
    setText('summary-rate-diff', formatSignedPercent(transparentAvgRate - freelancerAvgRate));
    
    // Apply colors to differences
    const applyDiffColor = (id, value, positiveIsGood = true) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (value === 0) {
            el.style.color = 'var(--color-text)';
            return;
        }
        const isGood = positiveIsGood ? value > 0 : value < 0;
        el.style.color = isGood ? 'var(--color-success)' : 'var(--color-error)';
    };
    
    applyDiffColor('summary-net-diff', difference, true);
    applyDiffColor('summary-cost-diff', transparent.totals.totalExpenses - freelancer.totals.totalExpenses, false);
    applyDiffColor('summary-tax-diff', transparentTotalTax - freelancerTotalTax, false);
    applyDiffColor('summary-rate-diff', transparentAvgRate - freelancerAvgRate, false);
    
    // ALSO populate detailed Year 1 breakdown (for backward compatibility with HTML)
    // This ensures all existing UI elements still work
    const year1Freelancer = freelancer.yearByYear[0];
    const year1Transparent = transparent.yearByYear[0];
    
    // Need to recalculate single-year results to get full detail
    // (yearByYear only has summary fields, not all the detail)
    const year1FreelancerDetail = appState.freelancerBasis === 'organized'
        ? computeFreelancerOrganized({
              grossIncome: year1Freelancer.income,
              activityCoefficient: getCurrentActivityCoefficient(),
              nhrStatus: appState.nhrStatus,
              personalDeductions: appState.personalDeductions,
              isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
              isFirstYearSSExempt: appState.isFirstYearSSExempt,
              irsJovemEnabled: appState.irsJovemEnabled,
              irsJovemYear: 1,
              baseExpenses: appState.expenses['total-business-expenses'] || 0,
              adminExpenses: appState.expenses['admin-freelancer'] || 0,
              insuranceExpenses: appState.liabilityInsurance || 0,
              isNHREligible: isCurrentNHREligible(),
          })
        : computeSimplified({
              grossIncome: year1Freelancer.income,
              activityCoefficient: getCurrentActivityCoefficient(),
              nhrStatus: appState.nhrStatus,
              personalDeductions: appState.personalDeductions,
              isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
              isFirstYearSSExempt: appState.isFirstYearSSExempt,
              irsJovemEnabled: appState.irsJovemEnabled,
              irsJovemYear: 1,
              baseExpenses: appState.expenses['total-business-expenses'] || 0,
              adminExpenses: appState.expenses['admin-freelancer'] || 0,
              insuranceExpenses: appState.liabilityInsurance || 0,
              isNHREligible: isCurrentNHREligible(),
          });
    
    const year1TransparentDetail = computeTransparent({
        grossIncome: year1Transparent.income,
        nhrStatus: appState.nhrStatus,
        personalDeductions: appState.personalDeductions,
        isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
        isFirstYearSSExempt: appState.isFirstYearSSExempt,
        irsJovemEnabled: appState.irsJovemEnabled,
        irsJovemYear: 1,
        baseExpenses: appState.expenses['total-business-expenses'] || 0,
        adminExpenses: appState.expenses['admin-transparent'] || 0,
        isNHREligible: isCurrentNHREligible(),
        useLLCManagerMinSS: true,
    });
    
    // Now call the legacy display function to populate all detailed fields
    updateResultsDisplayDual(year1FreelancerDetail, year1TransparentDetail);
    
    // Update year-by-year table (create if doesn't exist)
    updateYearByYearTable(freelancer, transparent, freelancerName);
}

function updateYearByYearTable(freelancer, transparent, freelancerName) {
    // Find or create the year-by-year table container
    let tableContainer = document.getElementById('year-by-year-table');
    
    if (!tableContainer) {
        // Create new container after the summary section
        const summarySection = document.querySelector('.comparison-summary');
        if (summarySection && summarySection.parentNode) {
            tableContainer = document.createElement('div');
            tableContainer.id = 'year-by-year-table';
            tableContainer.style.marginTop = 'var(--space-6)';
            summarySection.parentNode.insertBefore(tableContainer, summarySection.nextSibling);
        } else {
            return; // Can't find where to insert
        }
    }
    
    // Build the table HTML
    let tableHTML = `
        <div style="background: var(--bg-elevated); padding: var(--space-5); border-radius: var(--radius); border-left: 4px solid var(--color-primary);">
            <h3 style="margin-bottom: var(--space-4); font-size: var(--text-lg);">
                📊 Year-by-Year Breakdown (10 Years)
            </h3>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm);">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--color-border);">
                            <th style="text-align: left; padding: var(--space-2);">Year</th>
                            <th style="text-align: right; padding: var(--space-2);">Income</th>
                            <th style="text-align: right; padding: var(--space-2);">${freelancerName} Net</th>
                            <th style="text-align: right; padding: var(--space-2);">LDA Net</th>
                            <th style="text-align: right; padding: var(--space-2);">Difference</th>
                            <th style="text-align: right; padding: var(--space-2);">Cumulative</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Add rows for each year
    for (let i = 0; i < freelancer.yearByYear.length; i++) {
        const fYear = freelancer.yearByYear[i];
        const tYear = transparent.yearByYear[i];
        const diff = tYear.netIncome - fYear.netIncome;
        const cumDiff = tYear.cumulativeNet - fYear.cumulativeNet;
        
        const rowStyle = i % 2 === 0 ? 'background: var(--bg-elevated);' : 'background: var(--bg-base);';
        const diffColor = diff > 0 ? 'var(--color-success)' : diff < 0 ? 'var(--color-error)' : 'var(--color-text)';
        const cumColor = cumDiff > 0 ? 'var(--color-success)' : cumDiff < 0 ? 'var(--color-error)' : 'var(--color-text)';
        
        tableHTML += `
            <tr style="${rowStyle}">
                <td style="padding: var(--space-2); font-weight: 600;">${fYear.year}</td>
                <td style="padding: var(--space-2); text-align: right;">${formatCurrency(fYear.income)}</td>
                <td style="padding: var(--space-2); text-align: right;">${formatCurrency(fYear.netIncome)}</td>
                <td style="padding: var(--space-2); text-align: right;">${formatCurrency(tYear.netIncome)}</td>
                <td style="padding: var(--space-2); text-align: right; color: ${diffColor}; font-weight: 600;">
                    ${formatSignedCurrency(diff)}
                </td>
                <td style="padding: var(--space-2); text-align: right; color: ${cumColor};">
                    ${formatSignedCurrency(cumDiff)}
                </td>
            </tr>
        `;
    }
    
    tableHTML += `
                    </tbody>
                    <tfoot style="border-top: 2px solid var(--color-border); font-weight: 600;">
                        <tr>
                            <td style="padding: var(--space-3);">10-Year Total</td>
                            <td style="padding: var(--space-3); text-align: right;">${formatCurrency(freelancer.totals.totalGrossIncome)}</td>
                            <td style="padding: var(--space-3); text-align: right;">${formatCurrency(freelancer.totals.totalNetIncome)}</td>
                            <td style="padding: var(--space-3); text-align: right;">${formatCurrency(transparent.totals.totalNetIncome)}</td>
                            <td style="padding: var(--space-3); text-align: right; color: ${transparent.totals.totalNetIncome > freelancer.totals.totalNetIncome ? 'var(--color-success)' : 'var(--color-error)'};">
                                ${formatSignedCurrency(transparent.totals.totalNetIncome - freelancer.totals.totalNetIncome)}
                            </td>
                            <td style="padding: var(--space-3); text-align: right;"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <p style="margin-top: var(--space-4); font-size: var(--text-sm); color: var(--color-text-muted);">
                💡 <strong>Cumulative</strong> shows the running total difference. 
                <strong>Year ${freelancer.yearByYear.length}</strong> shows the final 10-year advantage.
            </p>
        </div>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

function updateComparisonTableMultiYear(freelancer, transparent) {
    // Update comparison table with 10-year totals
    setText('comp-simple-taxable', formatCurrency(freelancer.totals.totalGrossIncome));
    setText('comp-organized-taxable', formatCurrency(transparent.totals.totalGrossIncome));
    setText('comp-simple-tax', formatCurrency(freelancer.totals.totalIncomeTax));
    setText('comp-organized-tax', formatCurrency(transparent.totals.totalIncomeTax));
    setText('comp-simple-ss', formatCurrency(freelancer.totals.totalSocialSecurity));
    setText('comp-organized-ss', formatCurrency(transparent.totals.totalSocialSecurity));
    setText('comp-simple-net', formatCurrency(freelancer.totals.totalNetIncome));
    setText('comp-organized-net', formatCurrency(transparent.totals.totalNetIncome));

    const taxDiff = transparent.totals.totalIncomeTax - freelancer.totals.totalIncomeTax;
    const ssDiff = transparent.totals.totalSocialSecurity - freelancer.totals.totalSocialSecurity;
    const netDiff = transparent.totals.totalNetIncome - freelancer.totals.totalNetIncome;

    setText('comp-taxable-diff', formatSignedCurrency(0)); // Same gross for both
    setText('comp-tax-diff', formatSignedCurrency(taxDiff));
    setText('comp-ss-diff', formatSignedCurrency(ssDiff));
    setText('comp-net-diff', formatSignedCurrency(netDiff));

    const styleFor = (value) => (value < 0 ? 'var(--color-success)' : value > 0 ? 'var(--color-error)' : 'var(--color-text)');
    const taxEl = document.getElementById('comp-tax-diff');
    const ssEl = document.getElementById('comp-ss-diff');
    const netEl = document.getElementById('comp-net-diff');
    if (taxEl) taxEl.style.color = styleFor(taxDiff);
    if (ssEl) ssEl.style.color = styleFor(ssDiff);
    if (netEl) netEl.style.color = netDiff > 0 ? 'var(--color-success)' : netDiff < 0 ? 'var(--color-error)' : 'var(--color-text)';
}

function updateRecommendationMultiYear(freelancer, transparent) {
    const recommendationEl = document.getElementById('recommendation-text');
    const breakevenEl = document.getElementById('breakeven-expenses');

    if (!recommendationEl) return;

    const netDifference = transparent.totals.totalNetIncome - freelancer.totals.totalNetIncome;
    const freelancerName = appState.freelancerBasis === 'organized' 
        ? 'Freelancer (Organized)' 
        : 'Freelancer (Simplified)';

    if (appState.grossIncome === 0) {
        recommendationEl.textContent = 'Enter your income to see a personalized 10-year recommendation.';
        if (breakevenEl) breakevenEl.textContent = formatCurrency(0);
        return;
    }

    if (netDifference > 5000) {
        recommendationEl.innerHTML = `<strong>Single-Member Company (LDA)</strong> is recommended. Over 10 years, you would net approximately <strong>${formatCurrency(netDifference)}</strong> more.`;
    } else if (netDifference < -5000) {
        recommendationEl.innerHTML = `<strong>${freelancerName}</strong> is recommended. Over 10 years, it nets <strong>${formatCurrency(Math.abs(netDifference))}</strong> more.`;
    } else {
        recommendationEl.innerHTML = `Both structures are similar over 10 years (difference: ${formatCurrency(Math.abs(netDifference))}). Prefer <strong>Freelancer</strong> for simplicity or <strong>LDA</strong> for limited liability.`;
    }

    // Breakeven is less meaningful in multi-year, but keep it
    if (breakevenEl) {
        breakevenEl.textContent = '—';
    }
}

function updateWinnerBannerMultiYear(freelancer, transparent) {
    const winnerBanner = document.getElementById('winner-banner');
    const winnerTitle = document.getElementById('winner-title');
    const winnerSubtitle = document.getElementById('winner-subtitle');
    const winnerStats = document.getElementById('winner-stats');

    if (!winnerBanner || !winnerTitle || !winnerStats) return;

    const netDiff = Math.abs(transparent.totals.totalNetIncome - freelancer.totals.totalNetIncome);
    const freelancerName = appState.freelancerBasis === 'organized' 
        ? 'Freelancer (Organized)' 
        : 'Freelancer (Simplified)';
    
    if (transparent.totals.totalNetIncome > freelancer.totals.totalNetIncome + 5000) {
        winnerBanner.style.display = 'flex';
        winnerTitle.textContent = '🏆 Best Option (10 Years): Single-Member Company (LDA)';
        winnerSubtitle.textContent = `You'll take home ${formatCurrency(netDiff)} more over 10 years`;
        
        const totalGross = transparent.totals.totalGrossIncome;
        const avgTakeHome = (transparent.totals.totalNetIncome / totalGross) * 100;
        
        winnerStats.innerHTML = `
            <div class="winner-stat">
                <div class="winner-stat__label">10-Year Savings</div>
                <div class="winner-stat__value">${formatCurrency(netDiff)}</div>
            </div>
            <div class="winner-stat">
                <div class="winner-stat__label">Avg Take-Home %</div>
                <div class="winner-stat__value">${formatPercent(avgTakeHome)}</div>
            </div>
        `;
    } else if (freelancer.totals.totalNetIncome > transparent.totals.totalNetIncome + 5000) {
        winnerBanner.style.display = 'flex';
        winnerTitle.textContent = `🏆 Best Option (10 Years): ${freelancerName}`;
        winnerSubtitle.textContent = `You'll take home ${formatCurrency(netDiff)} more over 10 years`;
        
        const totalGross = freelancer.totals.totalGrossIncome;
        const avgTakeHome = (freelancer.totals.totalNetIncome / totalGross) * 100;
        
        winnerStats.innerHTML = `
            <div class="winner-stat">
                <div class="winner-stat__label">10-Year Savings</div>
                <div class="winner-stat__value">${formatCurrency(netDiff)}</div>
            </div>
            <div class="winner-stat">
                <div class="winner-stat__label">Avg Take-Home %</div>
                <div class="winner-stat__value">${formatPercent(avgTakeHome)}</div>
            </div>
        `;
    } else {
        winnerBanner.style.display = 'none';
    }
}

// ============================================================================
// LEGACY SINGLE-YEAR DISPLAY FUNCTIONS (KEPT FOR REFERENCE)
// ============================================================================

function updateResultsDisplayDual(simplified, transparent) {
    // Investment income excluded - taxed identically in both structures (28% flat)

    setText('simp-gross', formatCurrency(appState.grossIncome));
    const coefficientPercent = (simplified.coefficient * 100).toFixed(1).replace(/\.0$/, '');
    setText('simp-coefficient', appState.freelancerBasis === 'organized' ? '—' : `${coefficientPercent}%`);
    setText('simp-expenses-base', formatCurrency(simplified.baseExpenses || 0));
    setText('simp-expenses-admin', formatCurrency(simplified.adminExpenses || 0));
    setText('simp-expenses-total', formatCurrency(simplified.totalExpenses));
    setText('simp-liability', formatCurrency(simplified.insuranceExpenses || 0));
    const simpGrossProfit = appState.grossIncome - simplified.totalExpenses;
    setText('simp-gross-profit', formatCurrency(simpGrossProfit));
    setText('simp-deducoes', formatCurrency(simplified.deducoesATax || 0));
    setText('simp-taxable', formatCurrency(simplified.taxableIncome));
    setText('simp-irs', formatCurrency(simplified.incomeTax));
    setText('simp-ss', formatCurrency(simplified.socialSecurity));
    const simpTotalTaxes = simplified.incomeTax + simplified.socialSecurity;
    setText('simp-total-taxes', formatCurrency(simpTotalTaxes));
    setText('simp-total-net', formatCurrency(simplified.netIncome));

    setText('org-gross', formatCurrency(appState.grossIncome));
    setText('org-expenses-base', formatCurrency(transparent.baseExpenses || 0));
    setText('org-expenses-admin', formatCurrency(transparent.adminExpenses || 0));
    setText('org-expenses-total', formatCurrency(transparent.totalExpenses));
    const orgGrossProfit = appState.grossIncome - transparent.totalExpenses;
    setText('org-gross-profit', formatCurrency(orgGrossProfit));
    setText('org-net-biz', formatCurrency(transparent.netBusinessIncome));
    setText('org-deducoes', formatCurrency(transparent.deducoesATax || 0));
    setText('org-taxable', formatCurrency(transparent.taxableIncome));
    setText('org-irs', formatCurrency(transparent.incomeTax));
    setText('org-ss', formatCurrency(transparent.socialSecurity));
    const orgTotalTaxes = transparent.incomeTax + transparent.socialSecurity;
    setText('org-total-taxes', formatCurrency(orgTotalTaxes));
    setText('org-total-net', formatCurrency(transparent.netIncome));

    const simpSSNote = document.getElementById('simp-ss-note');
    const orgSSNote = document.getElementById('org-ss-note');
    const buildSSNote = (info) => {
        if (!info) return '';
        if (info.monthly === 0) {
            return appState.isFirstYearSSExempt
                ? 'First-year exemption applied.'
                : 'No Social Security payable under current inputs.';
        }
        const baseApplied = formatCurrency(info.monthlyBaseApplied);
        const monthlyContribution = formatCurrency(info.monthly);
        if (info.capped) {
            const capBase = formatCurrency(info.monthlyCap);
            return `Monthly base ${baseApplied} (capped at ${capBase}); contribution ${monthlyContribution}.`;
        }
        return `Monthly base ${baseApplied}; contribution ${monthlyContribution}.`;
    };
    if (simpSSNote) simpSSNote.textContent = buildSSNote(simplified.socialSecurityInfo);
    if (orgSSNote) {
        if (transparent.socialSecurityInfo?.mode === 'llc_manager_min') {
            const emp = formatCurrency(transparent.socialSecurityInfo.monthlyEmployee);
            const er = formatCurrency(transparent.socialSecurityInfo.monthlyEmployer);
            const base = formatCurrency(transparent.socialSecurityInfo.monthlyBaseApplied);
            orgSSNote.textContent = `LLC manager minimum applied: base ${base}; employee ${emp} + employer ${er} per month.`;
        } else {
            orgSSNote.textContent = buildSSNote(transparent.socialSecurityInfo);
        }
    }

    const simpTotalTax = simplified.incomeTax + simplified.socialSecurity;
    const orgTotalTax = transparent.incomeTax + transparent.socialSecurity;
    const simpTakeHome = appState.grossIncome > 0 ? (simplified.netIncome / appState.grossIncome) * 100 : 0;
    const orgTakeHome = appState.grossIncome > 0 ? (transparent.netIncome / appState.grossIncome) * 100 : 0;
    setText('simp-effective', formatPercent(simpTakeHome));
    setText('org-effective', formatPercent(orgTakeHome));

    const summaryNetSimp = simplified.netIncome;
    const summaryNetOrg = transparent.netIncome;
    const netDiff = summaryNetOrg - summaryNetSimp;
    const costDiff = transparent.totalExpenses - simplified.totalExpenses;
    const taxDiff = orgTotalTax - simpTotalTax;
    const rateDiff = orgTakeHome - simpTakeHome;

    setText('summary-net-simp', formatCurrency(summaryNetSimp));
    setText('summary-net-org', formatCurrency(summaryNetOrg));
    setText('summary-net-diff', formatSignedCurrency(netDiff));
    setText('summary-cost-simp', formatCurrency(simplified.totalExpenses));
    setText('summary-cost-org', formatCurrency(transparent.totalExpenses));
    setText('summary-cost-diff', formatSignedCurrency(costDiff));
    setText('summary-tax-simp', formatCurrency(simpTotalTax));
    setText('summary-tax-org', formatCurrency(orgTotalTax));
    setText('summary-tax-diff', formatSignedCurrency(taxDiff));
    setText('summary-rate-simp', formatPercent(simpTakeHome));
    setText('summary-rate-org', formatPercent(orgTakeHome));
    setText('summary-rate-diff', formatSignedPercent(rateDiff));

    const applyDiffColor = (id, value, positiveIsGood = true) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (value === 0) {
            el.style.color = 'var(--color-text)';
            return;
        }
        const isGood = positiveIsGood ? value > 0 : value < 0;
        el.style.color = isGood ? 'var(--color-success)' : 'var(--color-error)';
    };

    applyDiffColor('summary-net-diff', netDiff, true);
    applyDiffColor('summary-cost-diff', costDiff, false);
    applyDiffColor('summary-tax-diff', taxDiff, false);
    applyDiffColor('summary-rate-diff', rateDiff, true);

    // NHR benefit row removed from UI

}

function fillBreakdownList(element, lines = []) {
    if (!element) return;
    element.innerHTML = '';
    const entries = lines.length ? lines : ['No taxable income in this scenario.'];
    entries.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line;
        element.appendChild(li);
    });
}

function buildIRSBreakdownLines(irsDetails) {
    if (!irsDetails || !Array.isArray(irsDetails.breakdown)) return [];
    return irsDetails.breakdown.map((entry) => {
        const amount = formatCurrency(entry.amount);
        const rate = formatRate(entry.rate);
        const tax = formatCurrency(entry.tax);
        const minLabel = formatCurrency(entry.min);
        const maxLabel = entry.max === Infinity ? 'Infinity' : formatCurrency(entry.max);
        return `${amount} @ ${rate} (bracket ${minLabel} - ${maxLabel}) -> ${tax}`;
    });
}

function updateCalculationBreakdownMultiYear(freelancer, transparent) {
    // Show Year 1 breakdown as an example
    // Full 10-year breakdown would be too verbose
    
    const year1Freelancer = freelancer.yearByYear[0];
    const year1Transparent = transparent.yearByYear[0];
    
    // Recalculate Year 1 with full detail for breakdown
    const year1FreelancerDetail = appState.freelancerBasis === 'organized'
        ? computeFreelancerOrganized({
              grossIncome: year1Freelancer.income,
              activityCoefficient: getCurrentActivityCoefficient(),
              nhrStatus: appState.nhrStatus,
              personalDeductions: appState.personalDeductions,
              isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
              isFirstYearSSExempt: appState.isFirstYearSSExempt,
              irsJovemEnabled: appState.irsJovemEnabled,
              irsJovemYear: 1,
              baseExpenses: appState.expenses['total-business-expenses'] || 0,
              adminExpenses: appState.expenses['admin-freelancer'] || 0,
              insuranceExpenses: appState.liabilityInsurance || 0,
              isNHREligible: isCurrentNHREligible(),
          })
        : computeSimplified({
              grossIncome: year1Freelancer.income,
              activityCoefficient: getCurrentActivityCoefficient(),
              nhrStatus: appState.nhrStatus,
              personalDeductions: appState.personalDeductions,
              isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
              isFirstYearSSExempt: appState.isFirstYearSSExempt,
              irsJovemEnabled: appState.irsJovemEnabled,
              irsJovemYear: 1,
              baseExpenses: appState.expenses['total-business-expenses'] || 0,
              adminExpenses: appState.expenses['admin-freelancer'] || 0,
              insuranceExpenses: appState.liabilityInsurance || 0,
              isNHREligible: isCurrentNHREligible(),
          });
    
    const year1TransparentDetail = computeTransparent({
        grossIncome: year1Transparent.income,
        nhrStatus: appState.nhrStatus,
        personalDeductions: appState.personalDeductions,
        isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
        isFirstYearSSExempt: appState.isFirstYearSSExempt,
        irsJovemEnabled: appState.irsJovemEnabled,
        irsJovemYear: 1,
        baseExpenses: appState.expenses['total-business-expenses'] || 0,
        adminExpenses: appState.expenses['admin-transparent'] || 0,
        isNHREligible: isCurrentNHREligible(),
        useLLCManagerMinSS: true,
    });
    
    // Call the legacy breakdown function with Year 1 data
    // Add a note that this is Year 1 only
    updateCalculationBreakdown(year1FreelancerDetail, year1TransparentDetail);
    
    // Add a note above the breakdown
    const simpList = document.getElementById('calc-simp-steps');
    if (simpList && simpList.parentElement) {
        let noteEl = document.getElementById('calc-breakdown-note');
        if (!noteEl) {
            noteEl = document.createElement('p');
            noteEl.id = 'calc-breakdown-note';
            noteEl.className = 'help-text';
            noteEl.style.marginBottom = 'var(--space-3)';
            noteEl.style.background = 'var(--bg-elevated)';
            noteEl.style.padding = 'var(--space-3)';
            noteEl.style.borderRadius = 'var(--radius)';
            noteEl.style.borderLeft = '4px solid var(--color-primary)';
            simpList.parentElement.insertBefore(noteEl, simpList.previousSibling);
        }
        noteEl.innerHTML = '<strong>📊 Year 1 Calculation Breakdown</strong> — See year-by-year table above for all 10 years.';
    }
}

function updateCalculationBreakdown(simplified, transparent) {
    const simpList = document.getElementById('calc-simp-steps');
    const orgList = document.getElementById('calc-org-steps');
    const simpIRSList = document.getElementById('calc-simp-irs-breakdown');
    const orgIRSList = document.getElementById('calc-org-irs-breakdown');
    if (!simpList || !orgList || !simpIRSList || !orgIRSList) return;

    const grossIncome = appState.grossIncome;
    const ssFactor = TAX_DATA.socialSecurity.relevantIncomeFactor;
    const ssRate = TAX_DATA.socialSecurity.rate;
    const ssCap = TAX_DATA.socialSecurity.ias * TAX_DATA.socialSecurity.maxBaseMultiplier;

    const coefficientPercent = formatRate(simplified.coefficient);
    const simpCashLine = `Cash expenses = shared ${formatCurrency(simplified.baseExpenses)} + admin ${formatCurrency(simplified.adminExpenses)} + liability ${formatCurrency(simplified.insuranceExpenses || 0)} = ${formatCurrency(simplified.totalExpenses)}`;
    const simpBaseIRS = simplified.irsDetails.baseIRS || simplified.grossIRS || 0;
    const simpSolidarity = simplified.irsDetails.solidarityTax || 0;
    const simpGrossIRSLine =
        simplified.irsDetails.method === 'nhr'
            ? `Base IRS (NHR ${formatRate(simplified.irsDetails.rate)}) = ${formatCurrency(simpBaseIRS)}`
            : `Base IRS (progressive brackets) = ${formatCurrency(simpBaseIRS)}`;
    const simpIRSAfterDeductions = Math.max(0, simpBaseIRS - simplified.deducoesATax);
    const simplifiedSteps = [
        `Taxable income = ${formatCurrency(grossIncome)} * ${coefficientPercent} = ${formatCurrency(simplified.taxableIncome)}`,
        simpCashLine,
        simpGrossIRSLine,
        `Deductions to tax = ${formatCurrency(simplified.deducoesATax)}`,
    ];
    if (simpSolidarity > 0) {
        const solidarityBreakdown = formatSolidarityTaxBreakdown(simplified.taxableIncome, simpSolidarity);
        simplifiedSteps.push(solidarityBreakdown);
    }
    if (simplified.irsDetails.nhrRequested && !simplified.irsDetails.nhrApplied) {
        simplifiedSteps.push(`NHR 20% requested but not applied: ${simplified.irsDetails.nhrReason || 'activity not eligible.'}`);
    }
    if (appState.isFirstYearIRS50pct) {
        simplifiedSteps.push(`IRS after deductions = ${formatCurrency(simpIRSAfterDeductions)} -> 50% first-year relief = ${formatCurrency(simplified.incomeTax)}`);
    } else {
        simplifiedSteps.push(`Final IRS = max(0, ${formatCurrency(simplified.grossIRS)} − ${formatCurrency(simplified.deducoesATax)}) = ${formatCurrency(simplified.incomeTax)}`);
    }
    if (appState.isFirstYearSSExempt) {
        simplifiedSteps.push('Social Security: first-year exemption applied -> 0,00 €');
    } else {
        const quarterlyGross = grossIncome / 4;
        const quarterlyRelevant = quarterlyGross * ssFactor;
        const monthlyRelevant = quarterlyRelevant / 3;
        const monthlyBaseApplied = simplified.socialSecurityInfo.monthlyBaseApplied;
        simplifiedSteps.push(`Quarterly gross ${formatCurrency(quarterlyGross)} * ${formatRate(ssFactor)} = ${formatCurrency(quarterlyRelevant)} relevant; /3 -> monthly ${formatCurrency(monthlyRelevant)}`);
        if (simplified.socialSecurityInfo.capped) {
            simplifiedSteps.push(`Monthly base capped at ${formatCurrency(ssCap)} -> ${formatCurrency(monthlyBaseApplied)}`);
        } else {
            simplifiedSteps.push(`Monthly base (no cap) = ${formatCurrency(monthlyBaseApplied)}`);
        }
        simplifiedSteps.push(`Social Security = ${formatCurrency(monthlyBaseApplied)} * ${formatRate(ssRate)} * 12 = ${formatCurrency(simplified.socialSecurity)}`);
    }
    simplifiedSteps.push(`Net Category B = ${formatCurrency(grossIncome)} − ${formatCurrency(simplified.totalExpenses)} − ${formatCurrency(simplified.incomeTax)} − ${formatCurrency(simplified.socialSecurity)} = ${formatCurrency(simplified.netIncome)}`);

    const orgBaseIRS = transparent.irsDetails.baseIRS || transparent.grossIRS || 0;
    const orgSolidarity = transparent.irsDetails.solidarityTax || 0;
    const orgCashLine = `Cash expenses = shared ${formatCurrency(transparent.baseExpenses)} + admin ${formatCurrency(transparent.adminExpenses)} = ${formatCurrency(transparent.totalExpenses)}`;
    const orgGrossIRSLine =
        transparent.irsDetails.method === 'nhr'
            ? `Base IRS (NHR ${formatRate(transparent.irsDetails.rate)}) = ${formatCurrency(orgBaseIRS)}`
            : `Base IRS (progressive brackets) = ${formatCurrency(orgBaseIRS)}`;
    const orgIRSAfterDeductions = Math.max(0, orgBaseIRS - transparent.deducoesATax);
    const orgSteps = [
        `Net business income = ${formatCurrency(appState.grossIncome)} − ${formatCurrency(transparent.totalExpenses)} = ${formatCurrency(transparent.netBusinessIncome)}`,
        `Taxable income = max(0, net business income) = ${formatCurrency(transparent.taxableIncome)}`,
        orgCashLine,
        orgGrossIRSLine,
        `Deductions to tax = ${formatCurrency(transparent.deducoesATax)}`,
    ];
    if (orgSolidarity > 0) {
        const solidarityBreakdown = formatSolidarityTaxBreakdown(transparent.taxableIncome, orgSolidarity);
        orgSteps.push(solidarityBreakdown);
    }
    if (transparent.irsDetails.nhrRequested && !transparent.irsDetails.nhrApplied) {
        orgSteps.push(`NHR 20% requested but not applied: ${transparent.irsDetails.nhrReason || 'activity not eligible.'}`);
    }
    if (appState.isFirstYearIRS50pct) {
        orgSteps.push(`IRS after deductions = ${formatCurrency(orgIRSAfterDeductions)} -> 50% first-year relief = ${formatCurrency(transparent.incomeTax)}`);
    } else {
        orgSteps.push(`Final IRS = max(0, ${formatCurrency(transparent.grossIRS)} − ${formatCurrency(transparent.deducoesATax)}) = ${formatCurrency(transparent.incomeTax)}`);
    }
    if (appState.isFirstYearSSExempt) {
        orgSteps.push('Social Security: first-year exemption applied -> 0,00 €');
    } else {
        const quarterlyGrossOrg = transparent.netBusinessIncome / 4;
        const quarterlyRelevantOrg = quarterlyGrossOrg * ssFactor;
        const monthlyRelevantOrg = quarterlyRelevantOrg / 3;
        const monthlyBaseAppliedOrg = transparent.socialSecurityInfo.monthlyBaseApplied;
        orgSteps.push(`Quarterly net business ${formatCurrency(quarterlyGrossOrg)} * ${formatRate(ssFactor)} = ${formatCurrency(quarterlyRelevantOrg)} relevant; /3 -> monthly ${formatCurrency(monthlyRelevantOrg)}`);
        if (transparent.socialSecurityInfo.capped) {
            orgSteps.push(`Monthly base capped at ${formatCurrency(ssCap)} -> ${formatCurrency(monthlyBaseAppliedOrg)}`);
        } else {
            orgSteps.push(`Monthly base (no cap) = ${formatCurrency(monthlyBaseAppliedOrg)}`);
        }
        orgSteps.push(`Social Security = ${formatCurrency(monthlyBaseAppliedOrg)} * ${formatRate(ssRate)} * 12 = ${formatCurrency(transparent.socialSecurity)}`);
    }
    orgSteps.push(`Net Category B = ${formatCurrency(appState.grossIncome)} − ${formatCurrency(transparent.totalExpenses)} − ${formatCurrency(transparent.incomeTax)} − ${formatCurrency(transparent.socialSecurity)} = ${formatCurrency(transparent.netIncome)}`);

    fillBreakdownList(simpList, simplifiedSteps);
    fillBreakdownList(orgList, orgSteps);

    const simpIRSBreakdownLines = buildIRSBreakdownLines(simplified.irsDetails);
    const orgIRSBreakdownLines = buildIRSBreakdownLines(transparent.irsDetails);

    fillBreakdownList(simpIRSList, simpIRSBreakdownLines);
    fillBreakdownList(orgIRSList, orgIRSBreakdownLines);
}

function updateComparisonTable(simplified, transparent) {
    setText('comp-simple-taxable', formatCurrency(simplified.taxableIncome));
    setText('comp-organized-taxable', formatCurrency(transparent.taxableIncome));
    setText('comp-simple-tax', formatCurrency(simplified.incomeTax));
    setText('comp-organized-tax', formatCurrency(transparent.incomeTax));
    setText('comp-simple-ss', formatCurrency(simplified.socialSecurity));
    setText('comp-organized-ss', formatCurrency(transparent.socialSecurity));
    setText('comp-simple-net', formatCurrency(simplified.netIncome));
    setText('comp-organized-net', formatCurrency(transparent.netIncome));

    const taxableDiff = transparent.taxableIncome - simplified.taxableIncome;
    const taxDiff = transparent.incomeTax - simplified.incomeTax;
    const ssDiff = transparent.socialSecurity - simplified.socialSecurity;
    const netDiff = transparent.netIncome - simplified.netIncome;

    setText('comp-taxable-diff', formatSignedCurrency(taxableDiff));
    setText('comp-tax-diff', formatSignedCurrency(taxDiff));
    setText('comp-ss-diff', formatSignedCurrency(ssDiff));
    setText('comp-net-diff', formatSignedCurrency(netDiff));

    const styleFor = (value) => (value < 0 ? 'var(--color-success)' : value > 0 ? 'var(--color-error)' : 'var(--color-text)');
    const taxableEl = document.getElementById('comp-taxable-diff');
    const taxEl = document.getElementById('comp-tax-diff');
    const ssEl = document.getElementById('comp-ss-diff');
    const netEl = document.getElementById('comp-net-diff');
    if (taxableEl) taxableEl.style.color = styleFor(taxableDiff);
    if (taxEl) taxEl.style.color = styleFor(taxDiff);
    if (ssEl) ssEl.style.color = styleFor(ssDiff);
    if (netEl) netEl.style.color = netDiff > 0 ? 'var(--color-success)' : netDiff < 0 ? 'var(--color-error)' : 'var(--color-text)';
}

function updateRecommendation(simplified, transparent) {
    const { totalFreelancer, totalTransparent } = computeExpenseTotals({
        grossIncome: appState.grossIncome,
        baseExpenses: appState.expenses['total-business-expenses'] || 0,
        adminFreelancer: appState.expenses['admin-freelancer'] || 0,
        adminTransparent: appState.expenses['admin-transparent'] || 0,
    });
    const totalExpenses = Math.max(totalFreelancer, totalTransparent);
    const recommendationEl = document.getElementById('recommendation-text');
    const breakevenEl = document.getElementById('breakeven-expenses');

    if (!recommendationEl || !breakevenEl) return;

    if (appState.grossIncome > 0 && totalExpenses >= appState.grossIncome) {
        recommendationEl.textContent = 'Expenses are equal to or exceed gross income. Adjust expenses to see a recommendation.';
        breakevenEl.textContent = '—';
        return;
    }

    const netDifference = transparent.netIncome - simplified.netIncome;

    if (appState.grossIncome === 0) {
        recommendationEl.textContent = 'Enter your income and expenses to see a personalized recommendation.';
        breakevenEl.textContent = formatCurrency(0);
        return;
    }

    if (netDifference > 1000) {
        recommendationEl.innerHTML = `<strong>Transparent LLC</strong> is recommended. You would net approximately <strong>${formatCurrency(netDifference)}</strong> more annually.`;
    } else if (netDifference < -1000) {
        recommendationEl.innerHTML = `<strong>Freelancer (Simplified)</strong> is recommended. It nets <strong>${formatCurrency(Math.abs(netDifference))}</strong> more annually.`;
    } else {
        recommendationEl.innerHTML = `Both setups are similar (difference: ${formatCurrency(Math.abs(netDifference))}). Prefer <strong>Freelancer</strong> for simplicity unless you have significant expenses.`;
    }

    const netSimplified = simplified.netIncome;
    let low = 0;
    let high = appState.grossIncome;
    let mid = 0;
    let iteration = 0;

    const netOrganizedAtExpenses = (baseExpensesCandidate) => {
        const inputs = {
            grossIncome: appState.grossIncome,
            nhrStatus: appState.nhrStatus,
            personalDeductions: appState.personalDeductions,
            isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
            isFirstYearSSExempt: appState.isFirstYearSSExempt,
            baseExpenses: baseExpensesCandidate,
            adminExpenses: appState.expenses['admin-transparent'] || 0,
            isNHREligible: isCurrentNHREligible(),
        };
        return computeTransparent(inputs).netIncome;
    };

    while (iteration++ < 40 && high - low > 0.01) {
        mid = (low + high) / 2;
        const netOrg = netOrganizedAtExpenses(mid);
        if (netOrg >= netSimplified) {
            high = mid;
        } else {
            low = mid;
        }
    }
    const breakEvenExpenses = Math.max(0, Math.min(appState.grossIncome, (low + high) / 2));
    breakevenEl.textContent = formatCurrency(breakEvenExpenses);
}

function populateAssumptions() {
    const generalProfile = getActivityProfileData('services_general');
    const highValueProfile = getActivityProfileData('services_high_value');
    const generalPercent = (generalProfile.coefficient * 100).toFixed(1).replace(/\.0$/, '');
    const highValuePercent = (highValueProfile.coefficient * 100).toFixed(1).replace(/\.0$/, '');
    setText('assumption-nhr-rate', formatPercent(TAX_DATA.nhrRates.original_nhr * 100));
    setText('assumption-trading-rate', formatPercent(DEFAULTS.tradingRate * 100));
    setText('assumption-simplified-coef', `${highValuePercent}% taxable (high value assumed)`);
    const codes = TAX_DATA.highValueServiceCodes.join(', ');
    setText('assumption-highvalue-codes', codes);
    setText('assumption-ss-rate', formatPercent(TAX_DATA.socialSecurity.rate * 100));
    setText('assumption-ss-coef', formatPercent(TAX_DATA.socialSecurity.relevantIncomeFactor * 100));
    const ssCap = TAX_DATA.socialSecurity.ias * TAX_DATA.socialSecurity.maxBaseMultiplier;
    setText('assumption-ss-cap', `${formatCurrency(ssCap)} per month (base cap, not payable)`);
    const ssMax = ssCap * TAX_DATA.socialSecurity.rate;
    setText('assumption-ss-max', `${formatCurrency(ssMax)} per month (max contribution)`);
    setText('assumption-admin-freelancer', formatCurrency(SUGGESTED_ADMIN.freelancer));
    setText('assumption-admin-transparency', formatCurrency(SUGGESTED_ADMIN.transparent));
    setText('assumption-biz-expenses', `${(DEFAULTS.bizExpensesPercent * 100).toFixed(0)}% of gross income`);
}

function populateAppVersion() {
    const versionEl = document.getElementById('app-version');
    if (!versionEl) return;
    
    // Immediate display: Show data layer version (always available)
    const dataVersion = DATA?.VERSION || '2025.1';
    const dataUpdated = DATA?.LAST_UPDATED || '2025-10-17';
    versionEl.textContent = `TakeHome PT v${dataVersion} (Data: ${dataUpdated})`;
    
    // Then try to enhance with git commit info (non-blocking)
    const fallback = () => {
        const lastModified = new Date(document.lastModified || Date.now());
        versionEl.textContent = `TakeHome PT v${dataVersion} · Updated ${lastModified.toISOString().slice(0, 10)}`;
    };
    
    if (typeof window.fetch !== 'function') {
        return; // Keep data version display
    }
    
    const owner = '0xferit';
    const repo = 'take-home-pt';
    const branch = 'main';
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;
    fetch(url, {
        headers: {
            Accept: 'application/vnd.github+json'
        }
    })
        .then((response) => {
            if (!response.ok) throw new Error(`status ${response.status}`);
            return response.json();
        })
        .then((data) => {
            const sha = (data?.sha || '').slice(0, 7);
            const isoDate = data?.commit?.committer?.date;
            let stamp = '';
            if (isoDate) {
                const date = new Date(isoDate);
                if (!Number.isNaN(date.valueOf())) {
                    const datePart = date.toISOString().slice(0, 10);
                    const timePart = date.toISOString().slice(11, 16);
                    stamp = `${datePart} ${timePart} UTC`;
                }
            }
            if (sha && stamp) {
                versionEl.textContent = `TakeHome PT v${dataVersion} · ${sha} · ${stamp}`;
            } else if (sha) {
                versionEl.textContent = `TakeHome PT v${dataVersion} · ${sha}`;
            }
        })
        .catch(() => {
            // Keep the data version display on fetch error (don't replace with fallback)
        });
}

function updateNHROptions() {
    const nhrSelect = document.getElementById('nhr-status');
    const note = document.getElementById('nhr-status-note');
    if (!nhrSelect) return;
    const eligible = isCurrentNHREligible();
    
    // Enable/disable NHR options based on eligibility
    Array.from(nhrSelect.options).forEach((option) => {
        if (option.value === 'standard') return;
        option.disabled = !eligible;
    });
    
    // Reset to standard if currently selected NHR but not eligible
    if (!eligible && appState.nhrStatus !== 'standard') {
        appState.nhrStatus = 'standard';
        nhrSelect.value = 'standard';
    }
    
    // Update help text with clear messaging
    if (note) {
        note.classList.remove('status--error', 'status--success');
        if (eligible) {
            note.textContent = '✅ High-value activity detected. NHR 20% flat rate is available for selection.';
            note.classList.add('status--success');
        } else {
            note.textContent = '⚠️ NHR 20% rate only applies to High-value professions (Article 151). Select high-value activity type above to enable.';
            note.classList.add('status--error');
        }
    }
}

function updateSanityChecks() {
    const messages = [];
    const categoryBIncome = appState.grossIncome;

    if (!Number.isFinite(categoryBIncome)) messages.push('Professional income is not a number.');
    if (categoryBIncome <= 0) messages.push('Gross income is zero.');
    if (categoryBIncome < 0) messages.push('Professional income cannot be negative.');
    if (categoryBIncome > 200000) messages.push('Category B income exceeds €200k; simplified regime assumptions may not hold. Results are indicative only.');
    if (appState.activityCode && appState.activityCode.length === 5 && !isActivityCodeKnown(appState.activityCode)) {
        messages.push('Entered CAE code not found in the current mapping. Please confirm the coefficient manually.');
    }

    const list = document.getElementById('sanity-list');
    if (!list) return;
    list.innerHTML = '';
    const items = messages.length ? messages : ['All inputs look good.'];
    items.forEach((msg) => {
        const li = document.createElement('li');
        li.textContent = msg;
        list.appendChild(li);
    });
}

function updateWinnerBanner(simplified, transparent) {
    const winnerBanner = document.getElementById('winner-banner');
    const winnerTitle = document.getElementById('winner-title');
    const winnerSubtitle = document.getElementById('winner-subtitle');
    const winnerStats = document.getElementById('winner-stats');

    if (!winnerBanner || !winnerTitle || !winnerStats) return;

    const netDiff = Math.abs(transparent.netIncome - simplified.netIncome);
    const structureName = appState.freelancerBasis === 'organized' ? 'Freelancer (Organized)' : 'Freelancer (Simplified)';
    
    if (transparent.netIncome > simplified.netIncome + 500) {
        winnerBanner.style.display = 'flex';
        winnerTitle.textContent = '🏆 Best Option: Single-Member Company (LDA)';
        winnerSubtitle.textContent = `You'll take home €${netDiff.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2})} more per year`;
        
        winnerStats.innerHTML = `
            <div class="winner-stat">
                <div class="winner-stat__label">Annual Savings</div>
                <div class="winner-stat__value">${formatCurrency(netDiff)}</div>
            </div>
            <div class="winner-stat">
                <div class="winner-stat__label">Take-Home %</div>
                <div class="winner-stat__value">${formatPercent((transparent.netIncome / appState.grossIncome) * 100)}</div>
            </div>
        `;
    } else if (simplified.netIncome > transparent.netIncome + 500) {
        winnerBanner.style.display = 'flex';
        winnerTitle.textContent = `🏆 Best Option: ${structureName}`;
        winnerSubtitle.textContent = `You'll take home €${netDiff.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2})} more per year`;
        
        winnerStats.innerHTML = `
            <div class="winner-stat">
                <div class="winner-stat__label">Annual Savings</div>
                <div class="winner-stat__value">${formatCurrency(netDiff)}</div>
            </div>
            <div class="winner-stat">
                <div class="winner-stat__label">Take-Home %</div>
                <div class="winner-stat__value">${formatPercent((simplified.netIncome / appState.grossIncome) * 100)}</div>
            </div>
        `;
    } else {
        winnerBanner.style.display = 'none';
    }
}

function updateRecommendationDetailsMultiYear(freelancer, transparent) {
    const recommendationDetails = document.getElementById('recommendation-details');
    if (!recommendationDetails) return;

    const freelancerName = appState.freelancerBasis === 'organized' ? 'Freelancer (Organized)' : 'Freelancer (Simplified)';
    const netDiff = transparent.totals.totalNetIncome - freelancer.totals.totalNetIncome;
    const taxDiff = transparent.totals.totalIncomeTax - freelancer.totals.totalIncomeTax;
    const ssDiff = transparent.totals.totalSocialSecurity - freelancer.totals.totalSocialSecurity;
    const costDiff = transparent.totals.totalExpenses - freelancer.totals.totalExpenses;

    let details = '<ul class="info-list">';

    if (Math.abs(netDiff) > 5000) {
        if (netDiff > 0) {
            details += `<li><strong>LDA wins</strong> by ${formatCurrency(netDiff)} over 10 years</li>`;
        } else {
            details += `<li><strong>${freelancerName} wins</strong> by ${formatCurrency(Math.abs(netDiff))} over 10 years</li>`;
        }

        if (Math.abs(taxDiff) > 1000) {
            if (taxDiff > 0) {
                details += `<li>LDA pays ${formatCurrency(taxDiff)} <strong>more</strong> in total income tax (10 years)</li>`;
            } else {
                details += `<li>LDA pays ${formatCurrency(Math.abs(taxDiff))} <strong>less</strong> in total income tax (10 years)</li>`;
            }
        }

        if (Math.abs(ssDiff) > 1000) {
            if (ssDiff > 0) {
                details += `<li>LDA pays ${formatCurrency(ssDiff)} <strong>more</strong> in total social security (10 years)</li>`;
            } else {
                details += `<li>LDA pays ${formatCurrency(Math.abs(ssDiff))} <strong>less</strong> in total social security (10 years)</li>`;
            }
        }

        if (Math.abs(costDiff) > 1000) {
            if (costDiff > 0) {
                details += `<li>LDA has ${formatCurrency(Math.abs(costDiff))} <strong>higher</strong> total operating expenses (10 years)</li>`;
            } else {
                details += `<li>LDA has ${formatCurrency(Math.abs(costDiff))} <strong>lower</strong> total operating expenses (10 years)</li>`;
            }
        }

        if (appState.multiYear.annualGrowthRate > 0) {
            const growthPct = (appState.multiYear.annualGrowthRate * 100).toFixed(1);
            details += `<li>Projection includes ${growthPct}% annual income growth over 10 years</li>`;
        }

        if (appState.irsJovemEnabled) {
            const totalSavings = freelancer.totals.totalIrsJovemSavings;
            if (totalSavings > 0) {
                details += `<li>IRS Jovem saves you ${formatCurrency(totalSavings)} in total taxes over 10 years</li>`;
            }
        }

    } else {
        details += `<li>Both structures are very similar over 10 years (difference: ${formatCurrency(Math.abs(netDiff))})</li>`;
        details += `<li>Choose Freelancer for <strong>simplicity</strong> or LDA for <strong>limited liability</strong></li>`;
    }

    details += '</ul>';
    recommendationDetails.innerHTML = details;
}

function updateRecommendationDetails(simplified, transparent) {
    const recommendationDetails = document.getElementById('recommendation-details');
    if (!recommendationDetails) return;

    const structureName = appState.freelancerBasis === 'organized' ? 'Freelancer (Organized)' : 'Freelancer (Simplified)';
    const netDiff = transparent.netIncome - simplified.netIncome;
    const taxDiff = transparent.incomeTax - simplified.incomeTax;
    const ssDiff = transparent.socialSecurity - simplified.socialSecurity;
    const costDiff = transparent.totalExpenses - simplified.totalExpenses;

    let details = '<ul class="info-list">';

    if (Math.abs(netDiff) > 500) {
        if (netDiff > 0) {
            details += `<li><strong>LDA wins</strong> by ${formatCurrency(netDiff)}/year</li>`;
        } else {
            details += `<li><strong>${structureName} wins</strong> by ${formatCurrency(Math.abs(netDiff))}/year</li>`;
        }

        if (Math.abs(taxDiff) > 100) {
            if (taxDiff > 0) {
                details += `<li>LDA pays ${formatCurrency(taxDiff)} <strong>more</strong> in income tax</li>`;
            } else {
                details += `<li>LDA pays ${formatCurrency(Math.abs(taxDiff))} <strong>less</strong> in income tax</li>`;
            }
        }

        if (Math.abs(ssDiff) > 100) {
            if (ssDiff > 0) {
                details += `<li>LDA pays ${formatCurrency(ssDiff)} <strong>more</strong> in social security</li>`;
            } else {
                details += `<li>LDA pays ${formatCurrency(Math.abs(ssDiff))} <strong>less</strong> in social security</li>`;
            }
        }

        if (Math.abs(costDiff) > 100) {
            if (costDiff > 0) {
                details += `<li>LDA has ${formatCurrency(Math.abs(costDiff))} <strong>higher</strong> operating expenses (admin & overhead)</li>`;
            } else {
                details += `<li>LDA has ${formatCurrency(Math.abs(costDiff))} <strong>lower</strong> operating expenses (admin costs minus insurance savings)</li>`;
            }
        }

        if (appState.freelancerBasis === 'simplified') {
            const deemedExpenses = appState.grossIncome * (1 - getCurrentActivityCoefficient());
            const realExpenses = appState.expenses['total-business-expenses'] || 0;
            if (deemedExpenses > realExpenses) {
                details += `<li>Simplified regime gives you ${formatCurrency(deemedExpenses)} in <strong>deemed expenses</strong> vs ${formatCurrency(realExpenses)} actual</li>`;
            }
        }

        if (appState.irsJovemEnabled) {
            const exemptionRates = {1: '100%', 2: '75%', 3: '50%', 4: '50%', 5: '25%'};
            const rate = exemptionRates[appState.irsJovemYear] || '0%';
            details += `<li>IRS Jovem (${rate} exemption) significantly reduces your income tax</li>`;
        }

    } else {
        details += `<li>Both structures are very similar (difference: ${formatCurrency(Math.abs(netDiff))})</li>`;
        details += `<li>Choose Freelancer for <strong>simplicity</strong> or LDA for <strong>limited liability</strong></li>`;
    }

    details += '</ul>';
    recommendationDetails.innerHTML = details;
}

function saveScenario() {
    const scenarioName = prompt('Name this scenario:', `Scenario ${new Date().toLocaleDateString()}`);
    if (!scenarioName) return;

    const scenario = {
        name: scenarioName,
        timestamp: new Date().toISOString(),
        state: {...appState},
        results: {
            simplified: document.getElementById('summary-net-simp')?.textContent || '',
            transparent: document.getElementById('summary-net-org')?.textContent || '',
        }
    };

    try {
        const savedScenarios = JSON.parse(localStorage.getItem('takehome-scenarios') || '[]');
        savedScenarios.push(scenario);
        // Keep only last 10 scenarios
        if (savedScenarios.length > 10) savedScenarios.shift();
        localStorage.setItem('takehome-scenarios', JSON.stringify(savedScenarios));
        alert(`✅ Scenario "${scenarioName}" saved!`);
    } catch (e) {
        alert('❌ Failed to save scenario. Local storage may be full.');
    }
}

function hasAnyUserInput() {
    return appState.grossIncome > 0;
}

function updateResultsVisibility() {
    const zeroState = document.getElementById('results-zero-state');
    const detail = document.getElementById('results-detail');
    const exportBtn = document.getElementById('export-pdf-btn');
    const saveBtn = document.getElementById('save-scenario-btn');
    
    if (!zeroState || !detail) return;
    const hasData = hasAnyUserInput();
    
    if (hasData) {
        zeroState.classList.remove('is-active');
        zeroState.setAttribute('hidden', 'hidden');
        detail.classList.remove('is-dimmed');
        detail.removeAttribute('aria-hidden');
        
        // Show action buttons
        if (exportBtn) exportBtn.style.display = 'inline-flex';
        if (saveBtn) saveBtn.style.display = 'inline-flex';
    } else {
        zeroState.classList.add('is-active');
        zeroState.removeAttribute('hidden');
        detail.classList.add('is-dimmed');
        detail.setAttribute('aria-hidden', 'true');
        
        // Hide action buttons
        if (exportBtn) exportBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', initApp);
