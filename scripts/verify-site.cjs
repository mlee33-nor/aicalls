const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'dist');
const required = ['index.html', 'styles.css', 'config.js', 'app.js'];

for (const file of required) {
  const target = path.join(root, file);
  if (!fs.existsSync(target) || fs.statSync(target).size === 0) {
    throw new Error(`Missing required site asset: ${file}`);
  }
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!html.includes('NO RING AI') || !html.includes('tel:+15203817123')) {
  throw new Error('Expected brand or demo phone link is missing');
}

for (const expected of ['id="calculator"', 'Any industry', 'Your call flow', 'Your business rules', 'LOCKSMITHS', 'POOL SERVICES', 'data-demo-key="locksmith"', 'data-demo-key="pool"']) {
  if (!html.includes(expected)) throw new Error(`Expected conversion feature is missing: ${expected}`);
}

if (/[↗↘↙→📱☎📞]/u.test(html)) {
  throw new Error('Platform-specific arrow or phone glyph found in page markup');
}

if (/junk|remov|garage cleanout|hauling/i.test(html)) {
  throw new Error('Legacy demo-industry wording found in page markup');
}

console.log('NO RING AI site assets verified');
