        const { TAX_DATA, computeDeducoesAColeta, computeSimplified, computeTransparent } = window.TakeHomeLogic;

const currencyFormatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const formatCurrency = (value) => currencyFormatter.format(Number.isFinite(value) ? value : 0);
const formatSignedCurrency = (value) => {
    const normalized = Number(value) || 0;
    const prefix = normalized >= 0 ? '+' : '−';
    return `${prefix} ${formatCurrency(Math.abs(normalized))}`;
};
const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
};

const SUGGESTED_ADMIN = {
    freelancer: 2050,
    transparent: 5935,
};

const appState = {
    nhrStatus: 'standard',
    activityType: 'services',
    hasDependents: false,
    dependentsCount: 0,
    grossIncome: 0,
    divintIncome: 0,
    capgainsIncome: 0,
    expenses: {},
    isFirstYearSSExempt: false,
    isFirstYearIRS50pct: false,
    personalDeductions: {
        health: 0,
        education: 0,
        charitable: 0,
        retirement: 0,
    },
};

function initApp() {
    setupEventListeners();
    applySuggestedAdminIfEnabled();
    updateExpenseTotal();
    calculateAndUpdate();
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

    document.getElementById('nhr-status').addEventListener('change', (event) => {
        appState.nhrStatus = event.target.value;
        recalc();
    });

    document.getElementById('activity-type').addEventListener('change', (event) => {
        appState.activityType = event.target.value;
        recalc();
    });

    document.getElementById('has-dependents').addEventListener('change', (event) => {
        appState.hasDependents = event.target.checked;
        toggleDependentsCount();
        recalc();
    });

    document.getElementById('dependents-count').addEventListener('input', (event) => {
        const clamped = Math.max(0, Math.min(10, parseInt(event.target.value, 10) || 0));
        event.target.value = clamped;
        appState.dependentsCount = clamped;
        recalc();
    });

    const ssExemption = document.getElementById('firstyear-ss-exempt');
    if (ssExemption) {
        ssExemption.addEventListener('change', (event) => {
            appState.isFirstYearSSExempt = event.target.checked;
            recalc();
        });
    }

    const irsReduction = document.getElementById('firstyear-irs-50');
    if (irsReduction) {
        irsReduction.addEventListener('change', (event) => {
            appState.isFirstYearIRS50pct = event.target.checked;
            recalc();
        });
    }

    const incomeMap = {
        'gross-income': 'grossIncome',
        'divint-income': 'divintIncome',
        'capgains-income': 'capgainsIncome',
    };
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
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function toggleDependentsCount() {
    const countGroup = document.getElementById('dependents-count-group');
    if (!countGroup) return;
    if (appState.hasDependents) {
        countGroup.style.display = 'block';
    } else {
        countGroup.style.display = 'none';
        appState.dependentsCount = 0;
        const dependentsField = document.getElementById('dependents-count');
        if (dependentsField) dependentsField.value = 0;
    }
}

function setExpenseValue(id, value) {
    const field = document.getElementById(id);
    if (!field) return;
    const normalized = Math.max(0, Number(value) || 0);
    field.value = normalized.toFixed(2);
    appState.expenses[id] = normalized;
}

function applySuggestedAdminIfEnabled() {
    const toggle = document.getElementById('use-suggested-admin');
    if (!toggle || !toggle.checked) return;
    setExpenseValue('admin-freelancer', SUGGESTED_ADMIN.freelancer);
    setExpenseValue('admin-transparent', SUGGESTED_ADMIN.transparent);
}

function updateExpenseTotal() {
    const base = appState.expenses['total-business-expenses'] || 0;
    const adminSimplified = appState.expenses['admin-freelancer'] || 0;
    const adminTransparent = appState.expenses['admin-transparent'] || 0;
    const liabilityInsurance = Math.max(0, appState.grossIncome * 0.01);
    const totalSimplified = base + adminSimplified + liabilityInsurance;
    const totalTransparent = base + adminTransparent;

    setText('total-expenses-simp', formatCurrency(totalSimplified));
    setText('total-expenses-org', formatCurrency(totalTransparent));

    const totalMax = Math.max(totalSimplified, totalTransparent);
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
        dependentsCount: appState.dependentsCount,
        personalDeductions: appState.personalDeductions,
    });
}

function updatePersonalDeductions() {
    const { personalAllowanceMin, dependentAllowance, healthExpensesRate, healthExpensesMax } = TAX_DATA.personalDeductions;
    const dependentTotal = appState.dependentsCount * dependentAllowance;
    const healthDeduction = Math.min(appState.personalDeductions.health * healthExpensesRate, healthExpensesMax);
    const total = computeDeducoesToTax();

    setText('personal-allowance-display', formatCurrency(personalAllowanceMin));
    setText('dependent-allowance-display', formatCurrency(dependentTotal));
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
        dependentsCount: appState.dependentsCount,
        personalDeductions: appState.personalDeductions,
        isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
        isFirstYearSSExempt: appState.isFirstYearSSExempt,
    };

    const liabilityInsurance = Math.max(0, appState.grossIncome * 0.01);
    const simplifiedResults = computeSimplified({
        ...commonInputs,
        activityType: appState.activityType,
        baseExpenses,
        adminExpenses: adminSimplified,
        insuranceExpenses: liabilityInsurance,
    });
    const transparentResults = computeTransparent({
        ...commonInputs,
        baseExpenses,
        adminExpenses: adminTransparent,
    });

    updateResultsDisplayDual(simplifiedResults, transparentResults);
    updatePersonalDeductions();
    updateComparisonTable(simplifiedResults, transparentResults);
    updateRecommendation(simplifiedResults, transparentResults);
}

function updateResultsDisplayDual(simplified, transparent) {
    const otherIncome = (appState.divintIncome || 0) + (appState.capgainsIncome || 0);
    const otherTax = otherIncome * 0.28;
    const otherNet = Math.max(0, otherIncome - otherTax);

    setText('simp-gross', formatCurrency(appState.grossIncome));
    setText('simp-coefficient', simplified.coefficient);
    setText('simp-expenses', formatCurrency(simplified.totalExpenses));
    setText('simp-liability', formatCurrency(simplified.insuranceExpenses || 0));
    setText('simp-deducoes', formatCurrency(simplified.deducoesATax || 0));
    setText('simp-taxable', formatCurrency(simplified.taxableIncome));
    setText('simp-irs', formatCurrency(simplified.incomeTax));
    setText('simp-ss', formatCurrency(simplified.socialSecurity));
    setText('simp-net', formatCurrency(simplified.netIncome));
    setText('simp-other-net', formatCurrency(otherNet));
    setText('simp-total-net', formatCurrency(simplified.netIncome + otherNet));

    setText('org-gross', formatCurrency(appState.grossIncome));
    setText('org-expenses', formatCurrency(transparent.totalExpenses));
    setText('org-net-biz', formatCurrency(transparent.netBusinessIncome));
    setText('org-deducoes', formatCurrency(transparent.deducoesATax || 0));
    setText('org-taxable', formatCurrency(transparent.taxableIncome));
    setText('org-irs', formatCurrency(transparent.incomeTax));
    setText('org-ss', formatCurrency(transparent.socialSecurity));
    setText('org-net', formatCurrency(transparent.netIncome));
    setText('org-other-net', formatCurrency(otherNet));
    setText('org-total-net', formatCurrency(transparent.netIncome + otherNet));

    const simpTotalTax = simplified.incomeTax + simplified.socialSecurity;
    const orgTotalTax = transparent.incomeTax + transparent.socialSecurity;
    const simpEffective = appState.grossIncome > 0 ? (simpTotalTax / appState.grossIncome) * 100 : 0;
    const orgEffective = appState.grossIncome > 0 ? (orgTotalTax / appState.grossIncome) * 100 : 0;
    setText('simp-effective', simpEffective.toFixed(1));
    setText('org-effective', orgEffective.toFixed(1));

    const nhrRow = document.getElementById('nhr-benefit-row');
    if (nhrRow) nhrRow.style.display = appState.nhrStatus !== 'standard' ? 'flex' : 'none';

    setText('simp-monthly-gross', formatCurrency(appState.grossIncome / 12));
    setText('simp-monthly-irs', formatCurrency(simplified.incomeTax / 12));
    setText('simp-monthly-ss', formatCurrency(simplified.socialSecurity / 12));
    setText('simp-monthly-net', formatCurrency(simplified.netIncome / 12));
    setText('org-monthly-gross', formatCurrency(appState.grossIncome / 12));
    setText('org-monthly-irs', formatCurrency(transparent.incomeTax / 12));
    setText('org-monthly-ss', formatCurrency(transparent.socialSecurity / 12));
    setText('org-monthly-net', formatCurrency(transparent.netIncome / 12));
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
    const totalExpenses = Object.values(appState.expenses).reduce((sum, value) => sum + (value || 0), 0);
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
            dependentsCount: appState.dependentsCount,
            personalDeductions: appState.personalDeductions,
            isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
            isFirstYearSSExempt: appState.isFirstYearSSExempt,
            baseExpenses: baseExpensesCandidate,
            adminExpenses: appState.expenses['admin-transparent'] || 0,
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

document.addEventListener('DOMContentLoaded', initApp);
