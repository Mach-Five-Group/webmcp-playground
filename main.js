/**
 * WebMCP playground.
 *
 * Import order matters: analytics instruments the registry by wrapping each
 * tool's handler at registration time, so it has to load before any tool is
 * registered or those calls are never captured.
 */
import '@machfivetechchicago/machvive-webmcp-ai/webmcp-analytics';
import '@machfivetechchicago/machvive-webmcp-ai/webmcp-inspect';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CATALOG = {
  'M5T-001': { name: 'Mach Five Tee', price: 28 },
  'M5T-002': { name: 'Chicago Hoodie', price: 64 },
  'M5T-003': { name: 'Vive Cap', price: 22 }
};

const cart = [];

/** Tools a storefront might expose, with varied schemas to exercise the form builder. */
const TOOLS = [
  {
    name: 'search_products',
    description: 'Find products by keyword',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term' },
        limit: { type: 'integer', description: 'Max results' }
      },
      required: ['query']
    },
    execute: async ({ query, limit = 10 }) => {
      await sleep(40); // a touch of latency so durations are not all 0ms
      const hits = Object.entries(CATALOG)
        .filter(([sku, p]) => `${sku} ${p.name}`.toLowerCase().includes(String(query).toLowerCase()))
        .slice(0, limit)
        .map(([sku, p]) => `${sku} — ${p.name} ($${p.price})`);
      return hits.length ? hits.join('\n') : `No products match "${query}".`;
    }
  },
  {
    name: 'add_to_cart',
    description: 'Add a product to the shopping cart',
    inputSchema: {
      type: 'object',
      properties: {
        sku: { type: 'string', description: 'Product SKU' },
        qty: { type: 'integer', description: 'How many' },
        gift: { type: 'boolean', description: 'Gift wrap it' },
        size: { type: 'string', enum: ['S', 'M', 'L', 'XL'] }
      },
      required: ['sku']
    },
    execute: async ({ sku, qty = 1, gift = false, size }) => {
      await sleep(30);
      const product = CATALOG[sku];
      if (!product) throw new Error(`Unknown SKU: ${sku}`);
      cart.push({ sku, qty, gift, size });
      return `Added ${qty} × ${product.name}${size ? ` (${size})` : ''}${gift ? ', gift wrapped' : ''}.`;
    }
  },
  {
    name: 'view_cart',
    description: 'Show what is currently in the cart',
    inputSchema: { type: 'object', properties: {} },
    execute: async () => {
      await sleep(15);
      if (!cart.length) return 'Cart is empty.';
      const total = cart.reduce((sum, i) => sum + CATALOG[i.sku].price * i.qty, 0);
      return `${cart.length} line(s), total $${total}`;
    }
  },
  {
    name: 'apply_coupon',
    description: 'Apply a discount code (try INVALID to see an error captured)',
    inputSchema: {
      type: 'object',
      properties: { code: { type: 'string', description: 'Coupon code' } },
      required: ['code']
    },
    execute: async ({ code }) => {
      await sleep(25);
      if (code !== 'MACHFIVE') throw new Error(`Coupon "${code}" is not valid.`);
      return 'Coupon applied: 15% off.';
    }
  },
  {
    name: 'update_preferences',
    description: 'Save shopper preferences (object field — enter JSON)',
    inputSchema: {
      type: 'object',
      properties: {
        prefs: { type: 'object', description: 'e.g. {"newsletter":true,"currency":"USD"}' }
      },
      required: ['prefs']
    },
    execute: async ({ prefs }) => {
      await sleep(20);
      return `Saved ${Object.keys(prefs ?? {}).length} preference(s).`;
    }
  }
];

navigator.modelContext.provideContext({ tools: TOOLS });

const status = document.getElementById('status');
const say = (msg) => {
  status.textContent = msg;
  clearTimeout(say.t);
  say.t = setTimeout(() => (status.textContent = ''), 4000);
};

/** Fires a plausible sequence of calls, including one that fails. */
document.getElementById('simulate').addEventListener('click', async (e) => {
  e.target.disabled = true;
  say('Simulating agent traffic…');
  const script = [
    ['search_products', { query: 'tee', limit: 5 }],
    ['add_to_cart', { sku: 'M5T-001', qty: 2, size: 'L', gift: true }],
    ['add_to_cart', { sku: 'M5T-003', qty: 1 }],
    ['apply_coupon', { code: 'INVALID' }], // captured as an error
    ['apply_coupon', { code: 'MACHFIVE' }],
    ['update_preferences', { prefs: { newsletter: true, currency: 'USD' } }],
    ['view_cart', {}]
  ];
  for (const [tool, params] of script) {
    await navigator.modelContext.callTool(tool, params);
    await sleep(120);
  }
  say(`Done — ${script.length} calls captured.`);
  e.target.disabled = false;
});

// Registering later proves the inspector's list stays live.
document.getElementById('register-late').addEventListener('click', () => {
  const n = Math.floor(Math.random() * 900 + 100);
  navigator.modelContext.registerTool({
    name: `track_order_${n}`,
    description: 'Registered after page load',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
    execute: ({ id }) => `Order ${id} is in transit.`
  });
  say(`Registered track_order_${n} — inspector updated live.`);
});

document.getElementById('unregister').addEventListener('click', () => {
  say(
    navigator.modelContext.unregisterTool('search_products')
      ? 'Removed search_products.'
      : 'search_products was not registered.'
  );
});

// Handy for poking at things from devtools.
globalThis.mcp = navigator.modelContext;
