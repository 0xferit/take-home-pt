// WCAG Contrast Checker
// Calculates contrast ratios for accessibility compliance

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// TakeHome PT Color Palette
const colors = {
  // Backgrounds
  'bg-body (light)': '#F8F9FA',
  'bg-surface (light)': '#FFFFFF',
  
  // Text colors
  'text-primary': '#212529',
  'text-muted': '#6C757D',
  
  // Semantic (WCAG AA compliant)
  'aqua': '#157973',
  'aura': '#6B5785',
  'green': '#5D7A4D',
  'coral': '#C54A35',
  'butter': '#F4E4C1',
  
  // Neutrals
  'neutral-400': '#CED4DA',
  'neutral-600': '#59636A',
};

console.log('🔍 WCAG AA Contrast Audit for TakeHome PT\n');
console.log('Required: 4.5:1 for normal text, 3:1 for large text\n');
console.log('═══════════════════════════════════════════════════════\n');

// Test critical combinations
const tests = [
  { name: 'Muted text on light bg', fg: colors['neutral-600'], bg: colors['bg-body (light)'], size: 'normal' },
  { name: 'Primary text on light bg', fg: colors['text-primary'], bg: colors['bg-body (light)'], size: 'normal' },
  { name: 'Muted text on white', fg: colors['text-muted'], bg: colors['bg-surface (light)'], size: 'normal' },
  { name: 'Aqua primary on light bg', fg: colors['aqua'], bg: colors['bg-body (light)'], size: 'normal' },
  { name: 'Green success on light bg', fg: colors['green'], bg: colors['bg-body (light)'], size: 'normal' },
  { name: 'Coral error on light bg', fg: colors['coral'], bg: colors['bg-body (light)'], size: 'normal' },
  { name: 'Aura secondary on light bg', fg: colors['aura'], bg: colors['bg-body (light)'], size: 'normal' },
];

let failures = [];

tests.forEach(test => {
  const ratio = getContrastRatio(test.fg, test.bg);
  const required = test.size === 'large' ? 3.0 : 4.5;
  const passes = ratio >= required;
  
  const status = passes ? '✅ PASS' : '❌ FAIL';
  const emoji = passes ? '✅' : '❌';
  
  console.log(`${emoji} ${test.name}`);
  console.log(`   FG: ${test.fg} / BG: ${test.bg}`);
  console.log(`   Ratio: ${ratio.toFixed(2)}:1 (required: ${required}:1)`);
  console.log(`   ${status}\n`);
  
  if (!passes) {
    failures.push({
      ...test,
      ratio: ratio.toFixed(2),
      required
    });
  }
});

console.log('═══════════════════════════════════════════════════════\n');
console.log(`Total tests: ${tests.length}`);
console.log(`Passed: ${tests.length - failures.length}`);
console.log(`Failed: ${failures.length}\n`);

if (failures.length > 0) {
  console.log('❌ WCAG AA FAILURES:\n');
  failures.forEach(f => {
    console.log(`   ${f.name}: ${f.ratio}:1 (need ${f.required}:1)`);
  });
  console.log('\n🔴 CONTRACT VIOLATION: WCAG AA not met!');
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASS - WCAG AA COMPLIANT!\n');
  process.exit(0);
}
