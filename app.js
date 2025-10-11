        const {
            TAX_DATA,
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
        } = window.TakeHomeLogic;

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
const DEFAULTS = {
    softwareIncome: 170000,
    tradingIncome: 25000,
    bizExpenses: 25000,
    tradingRate: 0.28,
    simplifiedDeemed: 0.25,
};
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
    divintIncome: 0,
    capgainsIncome: 0,
    expenses: {},
    isFirstYearSSExempt: false,
    isFirstYearIRS50pct: false,
    liabilityInsurance: 0,
    freelancerBasis: 'simplified',
    personalDeductions: {
        health: 0,
        education: 0,
        charitable: 0,
        retirement: 0,
    },
};

function initApp() {
    setupEventListeners();
    populateAssumptions();
    applySuggestedAdminIfEnabled();
    populateActivityCodeOptions();
    updateActivitySelectionDisplay();
    const baseField = document.getElementById('total-business-expenses');
    if (baseField) {
        const baseValue = Math.max(0, parseFloat(baseField.value) || DEFAULTS.bizExpenses);
        appState.expenses['total-business-expenses'] = baseValue;
    }
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
    const freelancerBasisRadios = document.querySelectorAll('input[name="freelancer-basis"]');
    freelancerBasisRadios.forEach((input) => {
        input.addEventListener('change', (event) => {
            if (!event.target.checked) return;
            appState.freelancerBasis = event.target.value === 'organized' ? 'organized' : 'simplified';
            updateFreelancerTitle();
            recalc();
        });
    });


    document.getElementById('nhr-status').addEventListener('change', (event) => {
        appState.nhrStatus = event.target.value;
        updateInputsAtGlance();
        recalc();
    });

    // Activity profile is fixed to high-value in simplified mode; inputs removed

    // CAE input removed in simplified mode

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

    const incomeMap = {
        'gross-income': 'grossIncome',
        'divint-income': 'divintIncome',
        'capgains-income': 'capgainsIncome',
    };

    const grossField = document.getElementById('gross-income');
    if (grossField) {
        const initial = Math.max(0, parseFloat(grossField.value) || 0);
        appState.grossIncome = initial;
    }
    const capField = document.getElementById('capgains-income');
    if (capField) {
        const initial = Math.max(0, parseFloat(capField.value) || 0);
        appState.capgainsIncome = initial;
    }
    Object.entries(incomeMap).forEach(([id, key]) => {
        const field = document.getElementById(id);
        if (!field) return;
        field.addEventListener('input', (event) => {
            const value = Math.max(0, parseFloat(event.target.value) || 0);
            event.target.value = value;
            appState[key] = value;
            updateExpenseTotal();
            recalc();
        });
    });

    document.querySelectorAll('.expense-input').forEach((input) => {
        input.addEventListener('input', (event) => {
            const value = Math.max(0, parseFloat(event.target.value) || 0);
            event.target.value = value;
            appState.expenses[event.target.id] = value;
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
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
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
    syncActivityRadios();
    const profile = getActivityProfileData(appState.activityProfile);
    const taxablePercent = (profile.coefficient * 100).toFixed(1).replace(/\.0$/, '');
    const deemedPercent = ((1 - profile.coefficient) * 100).toFixed(1).replace(/\.0$/, '');
    setText('activity-summary-label', profile.label || 'General professional services');
    setText('activity-summary-coef', `${taxablePercent}% taxable / ${deemedPercent}% deemed expenses`);
    const codeListElement = document.getElementById('activity-summary-codes');
    if (codeListElement) {
        codeListElement.textContent =
            profile.id === 'services_high_value'
                ? TAX_DATA.highValueServiceCodes.join(', ')
                : 'Select "High value services" to view the code list.';
    }
    const caeInfo = document.getElementById('activity-code-status');
    if (caeInfo) {
        caeInfo.classList.remove('status--error', 'status--success');
        if (appState.activityCode) {
            if (appState.activityCode.length < 5) {
                caeInfo.textContent = 'Enter the full 5-digit CAE code to auto-select a coefficient.';
            } else if (isActivityCodeKnown(appState.activityCode)) {
                const entry = (TAX_DATA.activityCatalog || []).find((item) => item.code === appState.activityCode);
                const labelText = entry ? `${profile.label} · ${entry.label}` : profile.label;
                caeInfo.textContent = `CAE ${appState.activityCode} recognised (${labelText}).`;
                caeInfo.classList.add('status--success');
            } else {
                caeInfo.textContent = `CAE ${appState.activityCode} is not on the reference list. Please confirm the coefficient manually.`;
                caeInfo.classList.add('status--error');
            }
        } else {
            caeInfo.textContent = 'Enter your CAE code to auto-select a coefficient.';
        }
    }
    updateNHROptions();
    updateInputsAtGlance();
}

function applySuggestedAdminIfEnabled() {
    const toggle = document.getElementById('use-suggested-admin');
    if (!toggle || !toggle.checked) return;
    const freelAdmin = appState.freelancerBasis === 'organized' ? SUGGESTED_ADMIN.freelancer_organized : SUGGESTED_ADMIN.freelancer;
    setExpenseValue('admin-freelancer', freelAdmin);
    setExpenseValue('admin-transparent', SUGGESTED_ADMIN.transparent);
}

function updateExpenseTotal() {
    const base = appState.expenses['total-business-expenses'] || 0;
    const adminSimplified = appState.expenses['admin-freelancer'] || 0;
    const adminTransparent = appState.expenses['admin-transparent'] || 0;
    const { liabilityInsurance, totalFreelancer, totalTransparent } = computeExpenseTotals({
        grossIncome: appState.grossIncome,
        baseExpenses: base,
        adminFreelancer: adminSimplified,
        adminTransparent,
    });

    appState.liabilityInsurance = liabilityInsurance;

    setText('total-expenses-simp', formatCurrency(totalFreelancer));
    setText('total-expenses-org', formatCurrency(totalTransparent));

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
    const baseExpenses = appState.expenses['total-business-expenses'] || 0;
    const adminSimplified = appState.expenses['admin-freelancer'] || 0;
    const adminTransparent = appState.expenses['admin-transparent'] || 0;

    const commonInputs = {
        grossIncome: appState.grossIncome,
        nhrStatus: appState.nhrStatus,
        personalDeductions: appState.personalDeductions,
        isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
        isFirstYearSSExempt: appState.isFirstYearSSExempt,
    };

    const nhrEligible = isCurrentNHREligible();

    const simplifiedResults = appState.freelancerBasis === 'organized'
        ? computeFreelancerOrganized({
              ...commonInputs,
              baseExpenses,
              adminExpenses: adminSimplified,
              insuranceExpenses: appState.liabilityInsurance ?? getLiabilityInsurance(appState.grossIncome),
              isNHREligible: nhrEligible,
          })
        : computeSimplified({
              ...commonInputs,
              activityCoefficient: getCurrentActivityCoefficient(),
              baseExpenses,
              adminExpenses: adminSimplified,
              insuranceExpenses: appState.liabilityInsurance ?? getLiabilityInsurance(appState.grossIncome),
              isNHREligible: nhrEligible,
          });
    const transparentResults = computeTransparent({
        ...commonInputs,
        baseExpenses,
        adminExpenses: adminTransparent,
        isNHREligible: nhrEligible,
        useLLCManagerMinSS: true,
    });

    updateResultsDisplayDual(simplifiedResults, transparentResults);
    updateCalculationBreakdown(simplifiedResults, transparentResults);
    updatePersonalDeductions();
    updateComparisonTable(simplifiedResults, transparentResults);
    updateRecommendation(simplifiedResults, transparentResults);
    updateSanityChecks();
    updateResultsVisibility();
}

function updateResultsDisplayDual(simplified, transparent) {
    const otherIncome = (appState.divintIncome || 0) + (appState.capgainsIncome || 0);
    const otherTax = otherIncome * 0.28;
    const otherNet = Math.max(0, otherIncome - otherTax);

    setText('simp-gross', formatCurrency(appState.grossIncome));
    const coefficientPercent = (simplified.coefficient * 100).toFixed(1).replace(/\.0$/, '');
    setText('simp-coefficient', appState.freelancerBasis === 'organized' ? '—' : coefficientPercent);
function updateFreelancerTitle() {
    const title = document.getElementById('freelancer-results-title');
    if (!title) return;
    title.textContent = appState.freelancerBasis === 'organized' ? 'Freelancer (Organized) Results' : 'Freelancer (Simplified) Results';
}
    setText('simp-expenses-base', formatCurrency(simplified.baseExpenses || 0));
    setText('simp-expenses-admin', formatCurrency(simplified.adminExpenses || 0));
    setText('simp-expenses-total', formatCurrency(simplified.totalExpenses));
    setText('simp-liability', formatCurrency(simplified.insuranceExpenses || 0));
    setText('simp-deducoes', formatCurrency(simplified.deducoesATax || 0));
    setText('simp-taxable', formatCurrency(simplified.taxableIncome));
    setText('simp-irs', formatCurrency(simplified.incomeTax));
    setText('simp-ss', formatCurrency(simplified.socialSecurity));
    setText('simp-net', formatCurrency(simplified.netIncome));
    setText('simp-other-net', formatCurrency(otherNet));
    setText('simp-total-net', formatCurrency(simplified.netIncome + otherNet));

    setText('org-gross', formatCurrency(appState.grossIncome));
    setText('org-expenses-base', formatCurrency(transparent.baseExpenses || 0));
    setText('org-expenses-admin', formatCurrency(transparent.adminExpenses || 0));
    setText('org-expenses-total', formatCurrency(transparent.totalExpenses));
    setText('org-net-biz', formatCurrency(transparent.netBusinessIncome));
    setText('org-deducoes', formatCurrency(transparent.deducoesATax || 0));
    setText('org-taxable', formatCurrency(transparent.taxableIncome));
    setText('org-irs', formatCurrency(transparent.incomeTax));
    setText('org-ss', formatCurrency(transparent.socialSecurity));
    setText('org-net', formatCurrency(transparent.netIncome));
    setText('org-other-net', formatCurrency(otherNet));
    setText('org-total-net', formatCurrency(transparent.netIncome + otherNet));

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

    const summaryNetSimp = simplified.netIncome + otherNet;
    const summaryNetOrg = transparent.netIncome + otherNet;
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
        simplifiedSteps.push(`Solidarity tax = ${formatCurrency(simpSolidarity)}`);
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
        orgSteps.push(`Solidarity tax = ${formatCurrency(orgSolidarity)}`);
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
    setText('assumption-biz-expenses', formatCurrency(DEFAULTS.bizExpenses));
}

function populateAppVersion() {
    const versionEl = document.getElementById('app-version');
    if (!versionEl) return;
    const fallback = () => {
        const lastModified = new Date(document.lastModified || Date.now());
        versionEl.textContent = `Last updated ${lastModified.toISOString().slice(0, 10)}`;
    };
    if (typeof window.fetch !== 'function') {
        fallback();
        return;
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
                versionEl.textContent = `Version ${sha} · ${stamp}`;
            } else if (sha) {
                versionEl.textContent = `Version ${sha}`;
            } else if (stamp) {
                versionEl.textContent = `Last updated ${stamp}`;
            } else {
                fallback();
            }
        })
        .catch(() => fallback());
}

function updateNHROptions() {
    const nhrSelect = document.getElementById('nhr-status');
    const note = document.getElementById('nhr-status-note');
    if (!nhrSelect) return;
    const eligible = isCurrentNHREligible();
    Array.from(nhrSelect.options).forEach((option) => {
        if (option.value === 'standard') return;
        option.disabled = !eligible;
    });
    if (!eligible && appState.nhrStatus !== 'standard') {
        appState.nhrStatus = 'standard';
        nhrSelect.value = 'standard';
    }
    if (note) {
        note.classList.remove('status--error', 'status--success');
        if (eligible) {
            note.textContent = 'High added value activity detected. NHR 20% rate can be applied.';
            note.classList.add('status--success');
        } else {
            note.textContent = 'Select a high added value CAE/service to unlock the NHR 20% rate.';
            note.classList.add('status--error');
        }
    }
}

function updateSanityChecks() {
    const messages = [];
    const softwareIncome = appState.grossIncome;
    const tradingIncome = appState.capgainsIncome;
    const totals = softwareIncome + tradingIncome;

    if (!Number.isFinite(softwareIncome)) messages.push('Software income is not a number.');
    if (!Number.isFinite(tradingIncome)) messages.push('Trading income is not a number.');
    if (totals <= 0) messages.push('Gross income is zero.');
    if (softwareIncome < 0) messages.push('Software income cannot be negative.');
    if (tradingIncome < 0) messages.push('Trading income cannot be negative.');
    if (totals > 200000) messages.push('Gross exceeds 200k; simplified regime assumptions may not hold. Results are indicative only.');
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

function hasAnyUserInput() {
    return appState.grossIncome > 0 || appState.divintIncome > 0 || appState.capgainsIncome > 0;
}

function updateResultsVisibility() {
    const zeroState = document.getElementById('results-zero-state');
    const detail = document.getElementById('results-detail');
    if (!zeroState || !detail) return;
    const hasData = hasAnyUserInput();
    if (hasData) {
        zeroState.classList.remove('is-active');
        zeroState.setAttribute('hidden', 'hidden');
        detail.classList.remove('is-dimmed');
        detail.removeAttribute('aria-hidden');
    } else {
        zeroState.classList.add('is-active');
        zeroState.removeAttribute('hidden');
        detail.classList.add('is-dimmed');
        detail.setAttribute('aria-hidden', 'true');
    }
}

document.addEventListener('DOMContentLoaded', initApp);
