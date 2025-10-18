// Playwright test for TakeHome PT Calculator
// Run with: node test-calculator.js

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting calculator test...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('✅')) console.log('  ' + text);
    if (text.includes('❌')) console.error('  ' + text);
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.error('❌ PAGE ERROR:', error.message);
  });
  
  try {
    // 1. Navigate to calculator
    console.log('1️⃣ Loading calculator...');
    await page.goto('https://take-home-pt.netlify.app/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // 2. Check version
    const version = await page.locator('#app-version').textContent();
    console.log(`   Version: ${version}\n`);
    
    // 3. Enter income
    console.log('2️⃣ Entering €30,000 income...');
    await page.fill('#gross-income', '30000');
    await page.waitForTimeout(500);
    
    // 4. Check for JavaScript errors
    const errors = await page.evaluate(() => {
      return window.console.errors || [];
    });
    
    if (errors.length > 0) {
      console.error('❌ JavaScript errors detected:', errors);
    }
    
    // 5. Click Results tab
    console.log('3️⃣ Clicking Results tab...');
    await page.click('[data-tab="results"]');
    await page.waitForTimeout(1000);
    
    // 6. Check if results are visible
    console.log('4️⃣ Checking results...');
    
    const zeroStateVisible = await page.locator('#results-zero-state').isVisible();
    const resultsDetailVisible = await page.locator('#results-detail').isVisible();
    
    console.log(`   Zero state visible: ${zeroStateVisible}`);
    console.log(`   Results detail visible: ${resultsDetailVisible}`);
    
    if (!zeroStateVisible && resultsDetailVisible) {
      console.log('✅ SUCCESS: Results are displaying!\n');
      
      // Get some result values
      const netSimp = await page.locator('#summary-net-simp').textContent();
      const netOrg = await page.locator('#summary-net-org').textContent();
      
      console.log('   📊 Results:');
      console.log(`      Freelancer: ${netSimp}`);
      console.log(`      LDA: ${netOrg}\n`);
      
    } else if (zeroStateVisible) {
      console.error('❌ FAILED: Zero state still showing (no results calculated)\n');
    } else {
      console.error('❌ FAILED: Results section not found\n');
    }
    
    // 7. Take screenshot
    await page.screenshot({ path: 'test-result.png', fullPage: true });
    console.log('📸 Screenshot saved: test-result.png\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
    console.log('✅ Test complete!');
  }
})();
