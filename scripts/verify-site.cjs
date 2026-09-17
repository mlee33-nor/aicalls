const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'dist');
const required = ['index.html', 'styles.css', 'live-demo.css', 'niche.css', 'config.js', 'app.js', 'robots.txt', 'sitemap.xml', 'locksmiths/index.html', 'pool-service/index.html', 'cleaning-companies/index.html'];

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

for (const expected of ['id="calculator"', 'Keep working.', 'Give callers a conversation.', '$199', 'TRY SAYING ON THE CALL', 'Build my backup line', 'PROOF YOU CAN TEST']) {
  if (!html.includes(expected)) throw new Error(`Expected conversion feature is missing: ${expected}`);
}

for (const removed of ['id="industries"', 'LOCKSMITHS', 'POOL SERVICES', 'data-demo-key="locksmith"', 'data-demo-key="pool"']) {
  if (html.includes(removed)) throw new Error(`Removed industry section is still present: ${removed}`);
}

if (/[↗↘↙→📱☎📞]/u.test(html)) {
  throw new Error('Platform-specific arrow or phone glyph found in page markup');
}

if (/junk|remov|garage cleanout|hauling/i.test(html)) {
  throw new Error('Legacy demo-industry wording found in page markup');
}

for (const page of ['locksmiths/index.html', 'pool-service/index.html', 'cleaning-companies/index.html']) {
  const niche = fs.readFileSync(path.join(root, page), 'utf8');
  if (!niche.includes('NO RING AI') || !niche.includes('tel:+15203817123') || !niche.includes('$199')) {
    throw new Error(`Niche landing page is incomplete: ${page}`);
  }
  if (/[↗↘↙→📱☎📞]/u.test(niche)) throw new Error(`Platform-specific glyph found in: ${page}`);
}

console.log('NO RING AI site assets verified');
