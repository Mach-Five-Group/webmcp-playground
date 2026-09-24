# webmcp-playground

> “I don't want to use your product's agent. I want my agent to be able to use your product.”

A live **WebMCP** endpoint. The page publishes named, schema-typed tools that an AI
agent can call directly — no DOM scraping, no simulated clicks, no selectors to
break.

**▶ [mach-five-group.github.io/webmcp-playground](https://mach-five-group.github.io/webmcp-playground/)**

Point [Browser Use](https://github.com/browser-use/browser-use), a Playwright
harness, or your own agent at it and watch what happens. Everything the agent does
is captured, and you can replay it.

Built with [`@machfivetechchicago/machvive-webmcp-ai`](https://www.npmjs.com/package/@machfivetechchicago/machvive-webmcp-ai).

## What the page exposes

A small storefront, with deliberately varied parameter types so a form generator
and an agent both get exercised:

| Tool | Parameters | Notes |
| --- | --- | --- |
| `search_products` | `query` (required), `limit` | |
| `add_to_cart` | `sku` (required), `qty`, `gift`, `size` | integer, boolean, and enum |
| `view_cart` | — | takes no arguments |
| `apply_coupon` | `code` (required) | `MACHFIVE` succeeds; anything else throws |
| `update_preferences` | `prefs` (required) | an object parameter, entered as JSON |

`apply_coupon` fails on purpose. An agent that only handles the happy path is not
finished, and a tool surface with no failures to handle is not a fair test.

## Try it

```bash
npm install
npm run dev          # http://localhost:5173
```

**Drive it as an agent would** — discovers the tools, then calls them by name:

```bash
npm run build && npm run preview &
node agent-demo.mjs
node agent-demo.mjs --url=https://mach-five-group.github.io/webmcp-playground/
```

It never touches the DOM. It asks the page what it can do, then calls those
functions. That is the entire argument for WebMCP.

**Check the integration end to end** — form generation, type coercion, required
fields, capture, replay, theming, and IndexedDB persistence across a reload:

```bash
node verify.mjs
node verify.mjs --url=https://mach-five-group.github.io/webmcp-playground/
```

Both use Playwright with `channel: 'chrome'`, which uses your installed Chrome
rather than downloading a browser.

## Using it from your own agent

Anything that can evaluate JavaScript in the page can use it:

```javascript
const tools = await page.evaluate(() => navigator.modelContext.tools);
const result = await page.evaluate(
  ([name, params]) => navigator.modelContext.callTool(name, params),
  ['add_to_cart', { sku: 'M5T-001', qty: 2 }]
);
```

`callTool` never rejects. A failure comes back as
`{ content: [...], isError: true }`, so an agent branches on data rather than
catching exceptions.

## Two things that will bite you

**HTTPS or localhost, nothing else.** WebMCP is a secure-context API, and the
polyfill matches it. Over plain HTTP `navigator.modelContext` is simply undefined —
no error, no tools, nothing to connect to a cause.

**Import order.** Analytics captures by wrapping each tool's handler at
registration time, so it must be imported *before* any tool is registered. See the
top of [main.js](main.js). Get this wrong and everything works except the log,
which stays empty.

## Deploying

`main` holds the source; pushing to it builds and publishes to `gh-pages` via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml).

[vite.config.js](vite.config.js) sets `base: '/webmcp-playground/'` because Pages
serves project sites from `/<repo>/`. Without it every asset 404s and the page
loads blank. On a custom domain serving from root, set `PAGES_BASE=/`.

## License

[Apache-2.0](LICENSE) © MachFiveTech Chicago
