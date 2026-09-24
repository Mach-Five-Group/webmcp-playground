import { chromium } from 'playwright';

// Defaults to a local preview; point it at the deployed site to check that what
// is actually published still works:
//   node verify.mjs --url=https://mach-five-group.github.io/webmcp-playground/
const TARGET =
  process.argv.find((a) => a.startsWith('--url='))?.slice('--url='.length) ??
  'http://localhost:4173/';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto(TARGET, { waitUntil: 'networkidle' });

const inspect = page.locator('main machvive-webmcp-inspect');
const analytics = page.locator('machvive-webmcp-analytics');

console.log('target:', TARGET);
console.log('secure context:', await page.evaluate(() => window.isSecureContext));
console.log('polyfill installed:', await page.evaluate(() => 'modelContext' in navigator));
console.log('tools registered:', await page.evaluate(() => navigator.modelContext.tools.map(t => t.name).join(', ')));

// --- inspector lists tools (piercing shadow DOM) ---
const toolButtons = await inspect.locator('[data-tool]').allTextContents();
console.log('inspector lists:', toolButtons.join(', '));

// --- drive the inspector like a user ---
await inspect.locator('[data-tool="add_to_cart"]').click();
await inspect.locator('[data-field="sku"]').fill('M5T-002');
await inspect.locator('[data-field="qty"]').fill('3');
await inspect.locator('[data-field="gift"]').check();
await inspect.locator('[data-field="size"]').selectOption('L');
await inspect.locator('.run').click();
await page.waitForTimeout(250);
console.log('inspector result:', (await inspect.locator('pre').textContent())?.trim());

// --- required-field validation in a real browser ---
await inspect.locator('[data-tool="apply_coupon"]').click();
await inspect.locator('.run').click();
await page.waitForTimeout(150);
console.log('required blocks:', (await inspect.locator('[data-error="code"]').textContent())?.trim() || '(none)');

// --- simulate agent traffic ---
await page.locator('#simulate').click();
await page.waitForFunction(() => document.getElementById('status')?.textContent?.includes('Done'), null, { timeout: 15000 });

const summary = await page.evaluate(() => {
  // The element exposes the shared log — use the public API rather than
  // reaching for a module path the production bundle no longer has.
  const { log: callLog } = document.querySelector('machvive-webmcp-analytics');
  return {
    total: callLog.size,
    ok: callLog.entries.filter(e => e.status === 'ok').length,
    errors: callLog.entries.filter(e => e.status === 'error').length,
    tools: [...new Set(callLog.entries.map(e => e.tool))],
    withTiming: callLog.entries.filter(e => e.durationMs > 0).length,
    persistent: callLog.persistent
  };
});
console.log('captured:', JSON.stringify(summary));

console.log('analytics UI count:', (await analytics.locator('.count').textContent())?.trim());
const rows = await analytics.locator('li .tool').allTextContents();
console.log('analytics rows:', rows.join(', '));

// --- expand an entry, replay it ---
await analytics.locator('li').first().locator('.row').click();
await page.waitForTimeout(150);
console.log('detail opened:', await analytics.locator('[data-role="params"]').count() > 0);
await analytics.locator('button[data-act="replay"]').first().click();
await page.waitForTimeout(400);
console.log('after replay, count:', (await analytics.locator('.count').textContent())?.trim());

// --- floating inspector ---
const floating = page.locator('machvive-webmcp-inspect[floating]');
console.log('fab visible:', await floating.locator('.fab').isVisible());
await floating.locator('.fab').click();
await page.waitForTimeout(200);
console.log('panel open:', await floating.locator('.panel').isVisible());

// --- IndexedDB persistence across a real reload ---
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const afterReload = await analytics.locator('.count').textContent();
console.log('after reload, analytics shows:', afterReload?.trim());

await page.screenshot({ path: 'playground.png', fullPage: true });
console.log('page errors:', errors.length ? errors : 'none');
await browser.close();
