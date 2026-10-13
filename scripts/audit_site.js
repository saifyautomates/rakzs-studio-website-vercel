const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'frontend', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('--- 1. AUDITING VIDEO ASSETS ---');
const videoMatches = [...html.matchAll(/data-video="([^"]+)"/g)].map(m => m[1]);
console.log('Found', videoMatches.length, 'video references in html:');
videoMatches.forEach(src => {
  const full = path.join(root, 'frontend', src);
  if (!fs.existsSync(full)) {
    console.error('❌ MISSING VIDEO FILE:', full);
    process.exit(1);
  } else {
    const size = (fs.statSync(full).size / 1024).toFixed(1);
    console.log(`  ✓ ${src} (${size} KB) exists`);
  }
});

console.log('\n--- 2. AUDITING IMAGE ASSETS ---');
const imgMatches = [...html.matchAll(/src="assets\/([^"]+)"/g)].map(m => 'assets/' + m[1]);
const uniqueImgs = [...new Set(imgMatches)];
uniqueImgs.forEach(src => {
  const full = path.join(root, 'frontend', src);
  if (!fs.existsSync(full)) {
    console.error('❌ MISSING IMAGE FILE:', full);
    process.exit(1);
  } else {
    console.log(`  ✓ ${src} exists`);
  }
});

console.log('\n--- 3. AUDITING HTML IDS ---');
const idMatches = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
const idSet = new Set();
let dupes = false;
idMatches.forEach(id => {
  if (idSet.has(id)) {
    console.error('❌ DUPLICATE ID:', id);
    dupes = true;
  }
  idSet.add(id);
});
if (dupes) process.exit(1);
console.log(`  ✓ All ${idMatches.length} IDs are completely unique!`);

console.log('\n--- 4. AUDITING INTERNAL ANCHORS ---');
const anchorMatches = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
const uniqueAnchors = [...new Set(anchorMatches)];
uniqueAnchors.forEach(a => {
  if (!idSet.has(a)) {
    console.error('❌ BROKEN ANCHOR: #' + a);
    process.exit(1);
  } else {
    console.log(`  ✓ #${a} targets existing ID`);
  }
});

console.log('\n--- 5. AUDITING CSS BALANCE ---');
const cssPath = path.join(root, 'frontend', 'assets', 'css', 'styles.css');
const css = fs.readFileSync(cssPath, 'utf8');
let openBraces = (css.match(/\{/g) || []).length;
let closeBraces = (css.match(/\}/g) || []).length;
console.log(`  Braces: ${openBraces} opened, ${closeBraces} closed.`);
if (openBraces !== closeBraces) {
  console.error('❌ UNBALANCED CSS BRACES!');
  process.exit(1);
}
console.log('  ✓ CSS braces are 100% balanced!');

console.log('\n--- 6. AUDITING JAVASCRIPT SYNTAX ---');
const { execSync } = require('child_process');
execSync('node -c "' + path.join(root, 'frontend', 'assets', 'js', 'main.js') + '"');
console.log('  ✓ main.js syntax is 100% valid!');

console.log('\n=======================================');
console.log('✅ ALL AUDITS PASSED WITH ZERO ERRORS!');
console.log('=======================================');
