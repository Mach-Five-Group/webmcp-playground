/**
 * Emulates how an external agent — Browser Use, a custom Playwright harness, a
 * browser extension — would discover and call this page's tools.
 *
 * The point is that it never reads the DOM. It asks the page what it can do,
 * then calls those functions by name. That is the whole argument for WebMCP:
 * no selectors to break, no clicks to simulate, no guessing which div is a
 * button.
 *
 *   node agent-demo.mjs
 *   node agent-demo.mjs --url=https://mach-five-group.github.io/webmcp-playground/
 */
import { chromium } from 'playwright';

const TARGET =
  process.argv.find((a) => a.startsWith('--url='))?.slice('--url='.length) ??
  'http://localhost:4173/';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto(TARGET, { waitUntil: 'networkidle' });

if (!(await page.evaluate(() => 'modelContext' in navigator))) {
  console.error(`No navigator.modelContext at ${TARGET}.`);
  console.error('WebMCP requires a secure context — https:// or localhost.');
  await browser.close();
  process.exit(1);
}

// 1. Discovery — what can this page do?
const tools = await page.evaluate(() => navigator.modelContext.tools);
console.log(`Discovered ${tools.length} tools at ${TARGET}\n`);
for (const t of tools) {
  const params = Object.keys(t.inputSchema?.properties ?? {});
  console.log(`  ${t.name}(${params.join(', ')})`);
  if (t.description) console.log(`    ${t.description}`);
}

// 2. Invocation — call them by name, with typed arguments.
const plan = [
  ['search_products', { query: 'tee', limit: 3 }],
  ['add_to_cart', { sku: 'M5T-001', qty: 2, size: 'L' }],
  ['apply_coupon', { code: 'INVALID' }], // a failure an agent must handle
  ['apply_coupon', { code: 'MACHFIVE' }],
  ['view_cart', {}]
];

console.log('\nCalling tools as an agent would:\n');
for (const [name, params] of plan) {
  if (!tools.some((t) => t.name === name)) {
    console.log(`  ${name} — not registered on this page, skipping`);
    continue;
  }
  const result = await page.evaluate(
    ([n, p]) => navigator.modelContext.callTool(n, p),
    [name, params]
  );
  const text = (result.content ?? []).map((b) => b.text).join(' ');
  console.log(`  ${result.isError ? '✗' : '✓'} ${name}(${JSON.stringify(params)})`);
  console.log(`      ${text.replace(/\n/g, '\n      ')}`);
}

// 3. Everything above was captured by the analytics component, which is what
//    makes agent behaviour reviewable after the fact.
const captured = await page.evaluate(() => {
  const el = document.querySelector('machvive-webmcp-analytics');
  return el ? { total: el.log.size, errors: el.log.entries.filter((e) => e.status === 'error').length } : null;
});
if (captured) {
  console.log(`\nAnalytics captured ${captured.total} calls (${captured.errors} failed).`);
  console.log('Open the page in a browser to inspect, edit, and replay them.');
}

await browser.close();
