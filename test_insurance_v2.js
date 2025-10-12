/**
 * Insurance Model v2.0 - Validation Test Suite
 * 
 * HOW TO USE:
 * 1. Deploy the v2.0 changes to logic.js
 * 2. Open the website in browser
 * 3. Open browser console (F12)
 * 4. Copy/paste this entire file into console
 * 5. Press Enter
 * 6. All tests should PASS ✅
 */

console.log('='.repeat(60));
console.log('INSURANCE MODEL V2.0 - VALIDATION TEST SUITE');
console.log('='.repeat(60));
console.log('');

// Test Suite
const tests = [];
let passCount = 0;
let failCount = 0;

function runTest(name, testFn, expectedMin, expectedMax, expectedValue = null) {
  console.log(`\n🧪 ${name}`);
  try {
    const result = testFn();
    const pass = result >= expectedMin && result <= expectedMax;
    
    console.log(`   Result: €${result.toFixed(2)}`);
    if (expectedValue) {
      console.log(`   Target: €${expectedValue.toFixed(2)}`);
    }
    console.log(`   Range: €${expectedMin.toFixed(2)} - €${expectedMax.toFixed(2)}`);
    console.log(`   Status: ${pass ? '✅ PASS' : '❌ FAIL'}`);
    
    if (pass) passCount++;
    else failCount++;
    
    return pass;
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    failCount++;
    return false;
  }
}

// Test 1: Critical Validation - €250k Medium Risk
runTest(
  'Test 1: €250k Medium Risk (CRITICAL)',
  () => {
    const result = TakeHomeLogic.calculateInsurancePremium({
      revenue: 250000,
      riskTierOverride: 'medium',
      usaCoverage: false,
      claimsHistory: 'clean',
      yearsInBusiness: 3,
    });
    return result.annualPremium;
  },
  820,  // min
  860,  // max
  838   // target
);

// Test 2: Low Revenue - €50k Medium Risk
runTest(
  'Test 2: €50k Medium Risk',
  () => {
    const result = TakeHomeLogic.calculateInsurancePremium({
      revenue: 50000,
      riskTierOverride: 'medium',
      usaCoverage: false,
      claimsHistory: 'clean',
      yearsInBusiness: 3,
    });
    return result.annualPremium;
  },
  440,  // min
  480   // max
);

// Test 3: High Revenue with Economy of Scale - €400k Medium Risk
runTest(
  'Test 3: €400k Medium Risk (Economy of Scale)',
  () => {
    const result = TakeHomeLogic.calculateInsurancePremium({
      revenue: 400000,
      riskTierOverride: 'medium',
      usaCoverage: false,
      claimsHistory: 'clean',
      yearsInBusiness: 3,
    });
    
    // Check that economy of scale was applied
    const hasEconomyScale = result.adjustments.some(a => 
      a.factor.toLowerCase().includes('economies')
    );
    console.log(`   Economy of scale applied: ${hasEconomyScale ? '✅' : '❌'}`);
    console.log(`   Premium %: ${result.premiumPercentage.toFixed(2)}%`);
    
    return result.annualPremium;
  },
  1200,  // min
  1350   // max
);

// Test 4: Low Risk Profile - €100k
runTest(
  'Test 4: €100k Low Risk',
  () => {
    const result = TakeHomeLogic.calculateInsurancePremium({
      revenue: 100000,
      riskTierOverride: 'low',
      usaCoverage: false,
      claimsHistory: 'clean',
      yearsInBusiness: 3,
    });
    return result.annualPremium;
  },
  370,  // min
  430   // max
);

// Test 5: High Risk with USA Coverage - €200k
runTest(
  'Test 5: €200k High Risk + USA Coverage',
  () => {
    const result = TakeHomeLogic.calculateInsurancePremium({
      revenue: 200000,
      riskTierOverride: 'high',
      usaCoverage: true,
      claimsHistory: 'clean',
      yearsInBusiness: 3,
    });
    
    // Check that USA coverage was applied
    const hasUSA = result.adjustments.some(a => 
      a.factor.toLowerCase().includes('usa')
    );
    console.log(`   USA coverage applied: ${hasUSA ? '✅' : '❌'}`);
    
    return result.annualPremium;
  },
  2300,  // min
  2700   // max
);

// Parameter Verification Tests
console.log('\n' + '='.repeat(60));
console.log('PARAMETER VERIFICATION');
console.log('='.repeat(60));

const checks = [
  {
    name: 'Low Risk Base Rate',
    value: TakeHomeLogic.INSURANCE_DATA.riskTiers.low.baseRate,
    expected: 280,
  },
  {
    name: 'Medium Risk Base Rate',
    value: TakeHomeLogic.INSURANCE_DATA.riskTiers.medium.baseRate,
    expected: 360,
  },
  {
    name: 'High Risk Base Rate',
    value: TakeHomeLogic.INSURANCE_DATA.riskTiers.high.baseRate,
    expected: 640,
  },
  {
    name: 'Low Risk Variable Rate',
    value: TakeHomeLogic.INSURANCE_DATA.riskTiers.low.variableRate,
    expected: 0.0028,
  },
  {
    name: 'Medium Risk Variable Rate',
    value: TakeHomeLogic.INSURANCE_DATA.riskTiers.medium.variableRate,
    expected: 0.0036,
  },
  {
    name: 'High Risk Variable Rate',
    value: TakeHomeLogic.INSURANCE_DATA.riskTiers.high.variableRate,
    expected: 0.0064,
  },
  {
    name: 'Portugal Discount',
    value: TakeHomeLogic.INSURANCE_DATA.portugalDiscount,
    expected: 0.88,
  },
  {
    name: 'Economy Tier 1 Threshold',
    value: TakeHomeLogic.INSURANCE_DATA.economiesOfScale?.tier1Threshold,
    expected: 150000,
  },
  {
    name: 'Economy Tier 1 Multiplier',
    value: TakeHomeLogic.INSURANCE_DATA.economiesOfScale?.tier1Multiplier,
    expected: 0.95,
  },
  {
    name: 'Economy Tier 2 Threshold',
    value: TakeHomeLogic.INSURANCE_DATA.economiesOfScale?.tier2Threshold,
    expected: 300000,
  },
  {
    name: 'Economy Tier 2 Multiplier',
    value: TakeHomeLogic.INSURANCE_DATA.economiesOfScale?.tier2Multiplier,
    expected: 0.90,
  },
];

let paramPassCount = 0;
let paramFailCount = 0;

checks.forEach(check => {
  const pass = check.value === check.expected;
  console.log(`\n${check.name}:`);
  console.log(`   Expected: ${check.expected}`);
  console.log(`   Actual: ${check.value ?? 'undefined'}`);
  console.log(`   ${pass ? '✅ PASS' : '❌ FAIL'}`);
  
  if (pass) paramPassCount++;
  else paramFailCount++;
});

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log(`\nFunctional Tests: ${passCount}/${passCount + failCount} passed`);
console.log(`Parameter Checks: ${paramPassCount}/${paramPassCount + paramFailCount} passed`);
console.log(`\nTotal: ${passCount + paramPassCount}/${passCount + failCount + paramPassCount + paramFailCount} passed`);

if (failCount === 0 && paramFailCount === 0) {
  console.log('\n✅ ALL TESTS PASSED! Model v2.0 is correctly deployed.');
  console.log('\n🎉 Ready for production use!');
} else {
  console.log('\n❌ SOME TESTS FAILED! Review implementation.');
  console.log('\n⚠️  DO NOT deploy to production until all tests pass.');
  console.log('\nCheck INSURANCE_MODEL_V2_IMPLEMENTATION.md for troubleshooting.');
}

console.log('\n' + '='.repeat(60));
console.log('');

// Export results for programmatic access
window.insuranceV2TestResults = {
  functionalTests: { passed: passCount, failed: failCount },
  parameterChecks: { passed: paramPassCount, failed: paramFailCount },
  allPassed: failCount === 0 && paramFailCount === 0,
};
