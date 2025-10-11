        const { TAX_DATA, computeDeducoesAColeta, computeSimplified, computeTransparent, getMarginalTaxRate } = window.TakeHomeLogic;

        // Number formatter for currency values (no symbol; symbol is in markup)
        const fmtNumber = new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Application state
        let appState = {
            nhrStatus: 'standard',
            activityType: 'services',
            hasDependents: false,
            dependentsCount: 0,
            grossIncome: 0,
            divintIncome: 0,
            capgainsIncome: 0,
            employmentIncome: 0,
            rentalIncome: 0,
            investmentIncome: 0,
            foreignIncome: 0,
            expenses: {},
            isFirstYearSSExempt: false,
            isFirstYearIRS50pct: false,
            personalDeductions: {
                health: 0,
                education: 0,
                charitable: 0,
                retirement: 0
            }
        };

        // Initialize the application
        function initApp() {
            setupEventListeners();
            updateExpensesVisibility();
            applySuggestedAdminIfEnabled();
            updateExpenseTotal();
            calculateAndUpdate();
        }

        // Set up all event listeners
        function setupEventListeners() {
            // Debounce helper
            const debounce = (fn, delay = 200) => {
                let t;
                return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), delay); };
            };
            const recalc = debounce(calculateAndUpdate, 200);
            // Tab navigation
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const tabName = e.currentTarget?.dataset?.tab;
                    if (!tabName) return;
                    switchTab(tabName);
                });
            });

            // No upfront regime selection; always compute both

            // Basic info fields
            document.getElementById('nhr-status').addEventListener('change', (e) => {
                appState.nhrStatus = e.target.value;
                recalc();
            });

            document.getElementById('activity-type').addEventListener('change', (e) => {
                appState.activityType = e.target.value;
                recalc();
            });

            document.getElementById('has-dependents').addEventListener('change', (e) => {
                appState.hasDependents = e.target.checked;
                toggleDependentsCount();
                recalc();
            });

            document.getElementById('dependents-count').addEventListener('input', (e) => {
                appState.dependentsCount = parseInt(e.target.value) || 0;
                recalc();
            });

            // First-year toggles
            const ssEx = document.getElementById('firstyear-ss-exempt');
            if (ssEx) ssEx.addEventListener('change', (e) => { appState.isFirstYearSSExempt = e.target.checked; recalc(); });
            const irs50 = document.getElementById('firstyear-irs-50');
            if (irs50) irs50.addEventListener('change', (e) => { appState.isFirstYearIRS50pct = e.target.checked; recalc(); });

            // Income fields (explicit mapping to avoid incorrect replacements)
            const incomeMap = {
                'gross-income': 'grossIncome',
                'divint-income': 'divintIncome',
                'capgains-income': 'capgainsIncome',
                'employment-income': 'employmentIncome',
                'rental-income': 'rentalIncome',
                'investment-income': 'investmentIncome',
                'foreign-income': 'foreignIncome'
            };
            Object.keys(incomeMap).forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('input', (e) => {
                    const key = incomeMap[id];
                    appState[key] = parseFloat(e.target.value) || 0;
                    recalc();
                });
            });

            // Expense fields
            document.querySelectorAll('.expense-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    appState.expenses[e.target.id] = parseFloat(e.target.value) || 0;
                    updateExpenseTotal();
                    recalc();
                });
            });

            // Suggested admin toggle
            const chk = document.getElementById('use-suggested-admin');
            if (chk) {
                chk.addEventListener('change', () => {
                    applySuggestedAdminIfEnabled();
                    updateExpenseTotal();
                    recalc();
                });
            }

            // Personal deduction fields
            ['health-expenses', 'education-expenses', 'charitable-donations', 'retirement-contributions'].forEach(id => {
                document.getElementById(id).addEventListener('input', (e) => {
                    const key = id.split('-')[0];
                    appState.personalDeductions[key] = parseFloat(e.target.value) || 0;
                    updatePersonalDeductions();
                    recalc();
                });
            });
        }

        // Suggested admin helpers
        function computeSuggestedAdminFreelancer() {
            return 1200 + 50 + 300 + 500; // 2050
        }
        function computeSuggestedAdminTransparent() {
            return 3000 + 85 + 1200 + 150 + 200 + 500 + 500 + 300; // 5935
        }
        function setExpenseValue(id, value) {
            const el = document.getElementById(id);
            if (!el) return;
            el.value = (value || 0).toFixed(2);
            appState.expenses[id] = +value || 0;
        }
        function applySuggestedAdminIfEnabled() {
            const chk = document.getElementById('use-suggested-admin');
            if (!chk || !chk.checked) return;
            setExpenseValue('admin-freelancer', computeSuggestedAdminFreelancer());
            setExpenseValue('admin-transparent', computeSuggestedAdminTransparent());
        }

        // Tab switching functionality
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
            document.getElementById(tabName).classList.add('active');
        }

        // No regime selection UI needed

        // Toggle dependents count visibility
        function toggleDependentsCount() {
            const countGroup = document.getElementById('dependents-count-group');
            countGroup.style.display = appState.hasDependents ? 'block' : 'none';
            if (!appState.hasDependents) {
                appState.dependentsCount = 0;
                document.getElementById('dependents-count').value = 0;
            }
        }

        // Update expenses section visibility (always visible; apply differently by setup)
        function updateExpensesVisibility() {
            const expensesContent = document.getElementById('expenses-content');
            const expensesForm = document.getElementById('expenses-form');
            expensesContent.style.display = 'block';
            expensesForm.style.display = 'block';
        }

        // Update expense totals and validation
        function updateExpenseTotal() {
            const base = appState.expenses['total-business-expenses'] || 0;
            const adminSimp = appState.expenses['admin-freelancer'] || 0;
            const adminOrg = appState.expenses['admin-transparent'] || 0;
            const totalSimp = base + adminSimp;
            const totalOrg = base + adminOrg;

            const simpEl = document.getElementById('total-expenses-simp');
            const orgEl = document.getElementById('total-expenses-org');
            if (simpEl) simpEl.textContent = fmtNumber.format(totalSimp);
            if (orgEl) orgEl.textContent = fmtNumber.format(totalOrg);

            // Warnings/errors based on the worst case of the two totals
            const totalMax = Math.max(totalSimp, totalOrg);
            const warningElement = document.getElementById('expense-warning');
            const errorElement = document.getElementById('expense-error');
            const warn = appState.grossIncome > 0 && totalMax > appState.grossIncome * 0.8 && totalMax < appState.grossIncome;
            const err = appState.grossIncome > 0 && totalMax >= appState.grossIncome;
            if (warningElement) {
                warningElement.style.display = warn ? 'block' : 'none';
                if (warn) warningElement.textContent = '⚠️ Warning: Expenses exceed 80% of gross income (in at least one setup). Please review your entries.';
            }
            if (errorElement) {
                errorElement.style.display = err ? 'block' : 'none';
                if (err) errorElement.textContent = '⛔ In at least one setup, expenses are equal to or exceed gross income. Recommendation and break-even are disabled.';
            }
        }

        // Compute deductions to tax (deduções à coleta) and update display helpers
        function computeDeducoesToTax() {
            return computeDeducoesAColeta({
                dependentsCount: appState.dependentsCount,
                personalDeductions: appState.personalDeductions
            });
        }

        function updatePersonalDeductions() {
            const personalAllowance = TAX_DATA.personalDeductions.personalAllowanceMin; // shown for info only here
            const dependentAllowance = appState.dependentsCount * TAX_DATA.personalDeductions.dependentAllowance;
            const healthDeduction = Math.min(
                appState.personalDeductions.health * TAX_DATA.personalDeductions.healthExpensesRate,
                TAX_DATA.personalDeductions.healthExpensesMax
            );
            const totalToTax = computeDeducoesToTax();

            document.getElementById('personal-allowance-display').textContent = fmtNumber.format(personalAllowance);
            document.getElementById('dependent-allowance-display').textContent = fmtNumber.format(dependentAllowance);
            document.getElementById('health-deduction-display').textContent = fmtNumber.format(healthDeduction);
            document.getElementById('total-deductions-display').textContent = fmtNumber.format(totalToTax);
        }

        // Pure logic moved to logic.js and imported above

        // Main calculation and update function
        function calculateAndUpdate() {
            const base = appState.expenses['total-business-expenses'] || 0;
            const adminSimp = appState.expenses['admin-freelancer'] || 0;
            const adminOrg = appState.expenses['admin-transparent'] || 0;
            const inputsCommon = {
                grossIncome: appState.grossIncome,
                nhrStatus: appState.nhrStatus,
                dependentsCount: appState.dependentsCount,
                personalDeductions: appState.personalDeductions,
                isFirstYearIRS50pct: appState.isFirstYearIRS50pct,
                isFirstYearSSExempt: appState.isFirstYearSSExempt,
            };
            const simplifiedResults = computeSimplified({
                ...inputsCommon,
                activityType: appState.activityType,
                baseExpenses: base,
                adminExpenses: adminSimp,
            });
            const organizedResults = computeTransparent({
                ...inputsCommon,
                baseExpenses: base,
                adminExpenses: adminOrg,
            });
            
            updateResultsDisplayDual(simplifiedResults, organizedResults);
            updatePersonalDeductions();
            updateComparisonTable(simplifiedResults, organizedResults);
            updateRecommendation(simplifiedResults, organizedResults);
        }

        // Update results display for both setups side-by-side
        function updateResultsDisplayDual(simplified, organized) {
            // Other income (flat 28% model)
            const otherIncome = (appState.divintIncome || 0) + (appState.capgainsIncome || 0);
            const otherTax = otherIncome * 0.28;
            const otherNet = Math.max(0, otherIncome - otherTax);

            // Freelancer card
            document.getElementById('simp-gross').textContent = fmtNumber.format(appState.grossIncome);
            document.getElementById('simp-coefficient').textContent = simplified.coefficient;
            document.getElementById('simp-expenses').textContent = fmtNumber.format(simplified.totalExpenses);
            document.getElementById('simp-deducoes').textContent = fmtNumber.format(simplified.deducoesATax || 0);
            document.getElementById('simp-taxable').textContent = fmtNumber.format(simplified.taxableIncome);
            document.getElementById('simp-irs').textContent = fmtNumber.format(simplified.incomeTax);
            document.getElementById('simp-ss').textContent = fmtNumber.format(simplified.socialSecurity);
            document.getElementById('simp-net').textContent = fmtNumber.format(simplified.netIncome);
            document.getElementById('simp-other-net').textContent = fmtNumber.format(otherNet);
            document.getElementById('simp-total-net').textContent = fmtNumber.format(simplified.netIncome + otherNet);

            // Transparent LLC card
            document.getElementById('org-gross').textContent = fmtNumber.format(appState.grossIncome);
            document.getElementById('org-expenses').textContent = fmtNumber.format(organized.totalExpenses);
            document.getElementById('org-net-biz').textContent = fmtNumber.format(organized.netBusinessIncome);
            document.getElementById('org-deducoes').textContent = fmtNumber.format(organized.deducoesATax || 0);
            document.getElementById('org-taxable').textContent = fmtNumber.format(organized.taxableIncome);
            document.getElementById('org-irs').textContent = fmtNumber.format(organized.incomeTax);
            document.getElementById('org-ss').textContent = fmtNumber.format(organized.socialSecurity);
            document.getElementById('org-net').textContent = fmtNumber.format(organized.netIncome);
            document.getElementById('org-other-net').textContent = fmtNumber.format(otherNet);
            document.getElementById('org-total-net').textContent = fmtNumber.format(organized.netIncome + otherNet);

            // Tax rate info
            const simpTotalTax = simplified.incomeTax + simplified.socialSecurity;
            const orgTotalTax = organized.incomeTax + organized.socialSecurity;
            const simpEffective = appState.grossIncome > 0 ? (simpTotalTax / appState.grossIncome) * 100 : 0;
            const orgEffective = appState.grossIncome > 0 ? (orgTotalTax / appState.grossIncome) * 100 : 0;
            const simpMarginal = getMarginalTaxRate(simplified.taxableIncome);
            const orgMarginal = getMarginalTaxRate(organized.taxableIncome);
            document.getElementById('simp-effective').textContent = simpEffective.toFixed(1);
            document.getElementById('org-effective').textContent = orgEffective.toFixed(1);
            document.getElementById('simp-marginal').textContent = simpMarginal.toFixed(1);
            document.getElementById('org-marginal').textContent = orgMarginal.toFixed(1);

            // NHR benefit display
            const nhrRow = document.getElementById('nhr-benefit-row');
            if (appState.nhrStatus !== 'standard') { nhrRow.style.display = 'flex'; } else { nhrRow.style.display = 'none'; }

            // Monthly breakdowns
            document.getElementById('simp-monthly-gross').textContent = fmtNumber.format(appState.grossIncome / 12);
            document.getElementById('simp-monthly-irs').textContent = fmtNumber.format(simplified.incomeTax / 12);
            document.getElementById('simp-monthly-ss').textContent = fmtNumber.format(simplified.socialSecurity / 12);
            document.getElementById('simp-monthly-net').textContent = fmtNumber.format(simplified.netIncome / 12);
            document.getElementById('org-monthly-gross').textContent = fmtNumber.format(appState.grossIncome / 12);
            document.getElementById('org-monthly-irs').textContent = fmtNumber.format(organized.incomeTax / 12);
            document.getElementById('org-monthly-ss').textContent = fmtNumber.format(organized.socialSecurity / 12);
            document.getElementById('org-monthly-net').textContent = fmtNumber.format(organized.netIncome / 12);
        }

        // Update comparison table
        function updateComparisonTable(simplified, organized) {
            document.getElementById('comp-simple-taxable').textContent = fmtNumber.format(simplified.taxableIncome);
            document.getElementById('comp-organized-taxable').textContent = fmtNumber.format(organized.taxableIncome);
            document.getElementById('comp-simple-tax').textContent = fmtNumber.format(simplified.incomeTax);
            document.getElementById('comp-organized-tax').textContent = fmtNumber.format(organized.incomeTax);
            document.getElementById('comp-simple-ss').textContent = fmtNumber.format(simplified.socialSecurity);
            document.getElementById('comp-organized-ss').textContent = fmtNumber.format(organized.socialSecurity);
            document.getElementById('comp-simple-net').textContent = fmtNumber.format(simplified.netIncome);
            document.getElementById('comp-organized-net').textContent = fmtNumber.format(organized.netIncome);
            
            // Calculate differences
            const taxableDiff = organized.taxableIncome - simplified.taxableIncome;
            const taxDiff = organized.incomeTax - simplified.incomeTax;
            const ssDiff = organized.socialSecurity - simplified.socialSecurity;
            const netDiff = organized.netIncome - simplified.netIncome;
            
            const sign = (v) => v >= 0 ? '+' : '−';
            document.getElementById('comp-taxable-diff').textContent = `${sign(taxableDiff)} €${fmtNumber.format(Math.abs(taxableDiff))}`;
            document.getElementById('comp-tax-diff').textContent = `${sign(taxDiff)} €${fmtNumber.format(Math.abs(taxDiff))}`;
            document.getElementById('comp-ss-diff').textContent = `${sign(ssDiff)} €${fmtNumber.format(Math.abs(ssDiff))}`;
            document.getElementById('comp-net-diff').textContent = `${sign(netDiff)} €${fmtNumber.format(Math.abs(netDiff))}`;
            
            // Color code the differences using raw numeric diffs
            const styleFor = (v) => v < 0 ? 'var(--color-success)' : v > 0 ? 'var(--color-error)' : 'var(--color-text)';
            document.getElementById('comp-taxable-diff').style.color = styleFor(taxableDiff);
            document.getElementById('comp-tax-diff').style.color = styleFor(taxDiff);
            document.getElementById('comp-ss-diff').style.color = styleFor(ssDiff);
            document.getElementById('comp-net-diff').style.color = netDiff > 0 ? 'var(--color-success)' : netDiff < 0 ? 'var(--color-error)' : 'var(--color-text)';
        }

        // Update recommendation
        function updateRecommendation(simplified, organized) {
            // Error state: expenses >= gross disables recommendation/break-even
            const totalExpenses = Object.values(appState.expenses).reduce((s, v) => s + (v || 0), 0);
            const recommendationEl = document.getElementById('recommendation-text');
            if (appState.grossIncome > 0 && totalExpenses >= appState.grossIncome) {
                recommendationEl.textContent = 'Expenses are equal to or exceed gross income. Adjust expenses to see a recommendation.';
                document.getElementById('breakeven-expenses').textContent = '—';
                return;
            }

            const netDifference = organized.netIncome - simplified.netIncome;

            if (appState.grossIncome === 0) {
                recommendationEl.textContent = 'Enter your income and expenses to see a personalized recommendation.';
                document.getElementById('breakeven-expenses').textContent = '0,00';
                return;
            }

            if (netDifference > 1000) {
                recommendationEl.innerHTML = `<strong>Transparent LLC</strong> is recommended. You would net approximately <strong>€${fmtNumber.format(netDifference)}</strong> more annually.`;
            } else if (netDifference < -1000) {
                recommendationEl.innerHTML = `<strong>Freelancer (Simplified)</strong> is recommended. It nets <strong>€${fmtNumber.format(Math.abs(netDifference))}</strong> more annually.`;
            } else {
                recommendationEl.innerHTML = `Both setups are similar (difference: €${fmtNumber.format(Math.abs(netDifference))}). Prefer <strong>Freelancer</strong> for simplicity unless you have significant expenses.`;
            }

            // Break-even expenses via binary search where netOrganized >= netSimplified
            function netOrganizedAtExpenses(baseExpensesCandidate) {
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
                const org = computeTransparent(inputs);
                return org.netIncome;
            }
            const netSimplified = simplified.netIncome;
            let low = 0, high = appState.grossIncome, mid = 0, iter = 0;
            while (iter++ < 40 && high - low > 0.01) {
                mid = (low + high) / 2;
                const netOrg = netOrganizedAtExpenses(mid);
                if (netOrg >= netSimplified) {
                    high = mid;
                } else {
                    low = mid;
                }
            }
            const breakEvenExpenses = Math.max(0, Math.min(appState.grossIncome, (low + high) / 2));
            document.getElementById('breakeven-expenses').textContent = fmtNumber.format(breakEvenExpenses);
        }

        // Initialize the app when the page loads
        document.addEventListener('DOMContentLoaded', initApp);
