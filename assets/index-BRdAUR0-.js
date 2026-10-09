(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const J="machvive-webmcp-change";function G(r){if(!r||typeof r!="object")throw new TypeError("WebMCP: tool descriptor must be an object");if(typeof r.name!="string"||r.name.length===0)throw new TypeError("WebMCP: tool.name must be a non-empty string");if(typeof r.execute!="function")throw new TypeError(`WebMCP: tool "${r.name}" must supply an execute() function`)}function de(r){return r&&Array.isArray(r.content)?r:typeof r=="string"?{content:[{type:"text",text:r}]}:r==null?{content:[]}:{content:[{type:"text",text:JSON.stringify(r)}]}}class ue{#e=new Map;registerTool(e){G(e),this.#e.set(e.name,e),this.#r()}unregisterTool(e){const t=this.#e.delete(e);return t&&this.#r(),t}provideContext({tools:e=[]}={}){e.forEach(G),this.#e.clear();for(const t of e)this.#e.set(t.name,t);this.#r()}get tools(){return[...this.#e.values()].map(({name:e,description:t,inputSchema:o})=>({name:e,description:t,inputSchema:o}))}async callTool(e,t={}){const o=this.#e.get(e);if(!o)return{content:[{type:"text",text:`Unknown tool: ${e}`}],isError:!0};try{return de(await o.execute(t,this.#t()))}catch(n){return{content:[{type:"text",text:String(n?.message??n)}],isError:!0}}}#t(){return{requestUserInteraction:e=>Promise.resolve().then(e)}}#r(){window.dispatchEvent(new CustomEvent(J,{detail:{tools:this.tools}}))}}function se({allowInsecureContext:r=!1}={}){return"modelContext"in navigator?!1:!window.isSecureContext&&!r?(console.warn(`WebMCP: ${globalThis.location?.origin??"this page"} is not a secure context, so navigator.modelContext was not installed. A secure origin, localhost or 127.0.0.1 qualifies; a LAN address or custom hostname does not. For an offline or intranet bundle, opt in with <machvive-webmcp-polyfill allow-insecure> or installWebmcpPolyfill({ allowInsecureContext: true }).`),!1):(Object.defineProperty(navigator,"modelContext",{value:new ue,configurable:!0,enumerable:!1,writable:!1}),!0)}class pe extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){se({allowInsecureContext:this.hasAttribute("allow-insecure")}),this.shadowRoot.innerHTML="<style>:host { display: none; }</style>"}registerTool(e){return navigator.modelContext?.registerTool(e)}unregisterTool(e){return navigator.modelContext?.unregisterTool(e)}}se();customElements.get("machvive-webmcp-polyfill")||customElements.define("machvive-webmcp-polyfill",pe);const V=`
    --mv-fg: #1a1a1a;
    --mv-muted: #666;
    --mv-faint: #6e6e6e;
    --mv-bg: #fff;
    --mv-surface: #fafafa;
    --mv-input-bg: #fff;
    --mv-border: #e2e2e2;
    --mv-border-soft: #eee;
    --mv-control-border: #ccc;
    --mv-hover: #f2f2f2;
    --mv-selected: #e8f0fe;
    --mv-accent: #1565c0;
    --mv-accent-fg: #fff;
    --mv-ok-bg: #e6f4ea;
    --mv-ok-fg: #0f6b2e;
    --mv-err-bg: #fce8e6;
    --mv-err-fg: #b3261e;
    --mv-err-border: #f5c6c2;
    --mv-danger: #a4161a;
    --mv-danger-border: #d8a0a0;
    --mv-shadow: rgba(0, 0, 0, .18);
`,X=`
    --mv-fg: #e8eaed;
    --mv-muted: #9aa0a6;
    --mv-faint: #8b9096;
    --mv-bg: #1f2125;
    --mv-surface: #282b30;
    --mv-input-bg: #16181b;
    --mv-border: #3c4046;
    --mv-border-soft: #33363b;
    --mv-control-border: #4a4f56;
    --mv-hover: #32363c;
    --mv-selected: #1e3a5f;
    --mv-accent: #5b9bf8;
    --mv-accent-fg: #0b1220;
    --mv-ok-bg: #16351f;
    --mv-ok-fg: #7ee2a0;
    --mv-err-bg: #3f1d1c;
    --mv-err-fg: #ff9d97;
    --mv-err-border: #5c2c2a;
    --mv-danger: #ff9d97;
    --mv-danger-border: #5c2c2a;
    --mv-shadow: rgba(0, 0, 0, .5);
`,j=`
  :host {
    color-scheme: light dark;
${V}  }

  @media (prefers-color-scheme: dark) {
    :host(:not([theme="light"])) {
${X}    }
  }

  /* Explicit choice beats the OS preference, in both directions. */
  :host([theme="dark"]) {
${X}  }

  :host([theme="light"]) {
    color-scheme: light;
${V}  }
`,B="machvive-webmcp-call",he="machvive-webmcp",O="calls",me=1,fe=500;class ge{#e=null;get available(){return!!globalThis.indexedDB}#t(){return this.available?(this.#e??=new Promise(e=>{let t;try{t=globalThis.indexedDB.open(he,me)}catch{return e(null)}t.onupgradeneeded=()=>{const o=t.result;o.objectStoreNames.contains(O)||o.createObjectStore(O,{keyPath:"id"})},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null),t.onblocked=()=>e(null)}),this.#e):Promise.resolve(null)}async#r(e,t){const o=await this.#t();return o?new Promise(n=>{let i;try{i=o.transaction(O,e)}catch{return n(null)}const s=t(i.objectStore(O));i.oncomplete=()=>n(s?s.result:null),i.onerror=()=>n(null),i.onabort=()=>n(null)}):null}all(){return this.#r("readonly",e=>e.getAll()).then(e=>e??[])}put(e){return this.#r("readwrite",t=>t.put(e))}delete(e){return this.#r("readwrite",t=>t.delete(e))}clear(){return this.#r("readwrite",e=>e.clear())}}let be=0;const Y=()=>`call-${Date.now().toString(36)}-${(be++).toString(36)}`;function D(r){if(r!==void 0)try{return JSON.parse(JSON.stringify(r))}catch{return String(r)}}class ye{#e=new Set;#t=[];#r;#o;#n=new ge;ready;constructor({limit:e=fe,persist:t=!0}={}){this.#r=e,this.#o=t,this.ready=this.#c()}get persistent(){return this.#o&&this.#n.available}addEventListener(e,t){e==="change"&&typeof t=="function"&&this.#e.add(t)}removeEventListener(e,t){e==="change"&&this.#e.delete(t)}get entries(){return[...this.#t]}get size(){return this.#t.length}add(e){const t={id:Y(),...e};this.#t.push(t);let o=[];return this.#t.length>this.#r&&(o=this.#t.splice(0,this.#t.length-this.#r)),this.#s(n=>{n.put(t);for(const i of o)n.delete(i.id)}),this.#i("add",t),t}update(e,t){const o=this.#t.find(n=>n.id===e);return o?(Object.assign(o,t),this.#s(n=>n.put(o)),this.#i("update",o),o):null}remove(e){const t=this.#t.findIndex(n=>n.id===e);if(t===-1)return!1;const[o]=this.#t.splice(t,1);return this.#s(n=>n.delete(o.id)),this.#i("remove",o),!0}clear(){this.#t=[],this.#s(e=>e.clear()),this.#i("clear",null)}toJSON(e=2){return JSON.stringify({version:1,exportedAt:new Date().toISOString(),entries:this.#t},null,e)}import(e){const t=typeof e=="string"?JSON.parse(e):e,o=Array.isArray(t)?t:t?.entries;if(!Array.isArray(o))throw new TypeError("Analytics: import expects an entries array");for(const n of o){const i={...n,id:n.id??Y()};this.#t.push(i),this.#s(s=>s.put(i))}return this.#i("import",null),o.length}async replay(e,t){const o=this.#t.find(i=>i.id===e);if(!o)throw new Error(`Analytics: no captured call ${e}`);const n=globalThis.navigator?.modelContext;if(!n?.callTool)throw new Error("Analytics: navigator.modelContext.callTool is unavailable");return n.callTool(o.tool,t??o.params??{})}pushToDataLayer(e){const t=this.#t.find(n=>n.id===e);return t?((globalThis.window.dataLayer||=[]).push({event:"webmcp_tool_call",webmcp_tool:t.tool,webmcp_status:t.status,webmcp_duration_ms:t.durationMs,webmcp_params:t.params,webmcp_error:t.error??void 0}),this.update(e,{pushedToDataLayer:!0}),!0):!1}#i(e,t){const o={reason:e,entry:t,entries:this.entries};for(const n of this.#e)try{n({type:"change",detail:o})}catch{}try{globalThis.window?.dispatchEvent?.(new CustomEvent(B,{detail:{reason:e,entry:t}}))}catch{}}#s(e){this.persistent&&this.#a(e).catch(()=>{})}async#a(e){const t=[];e({put:o=>t.push(["put",o]),delete:o=>t.push(["delete",o]),clear:()=>t.push(["clear"])});for(const[o,n]of t)await this.#n[o](n)}async#c(){if(this.persistent)try{const e=await this.#n.all();if(!Array.isArray(e)||e.length===0)return;const t=new Set(this.#t.map(n=>n.id)),o=[...e.filter(n=>!t.has(n.id)),...this.#t];this.#t=o.slice(-this.#r),this.#i("restore",null)}catch{}}}const ae=new ye;function Q(r,e){if(!r||typeof r!="object"||typeof r.execute!="function"||r.execute.__machviveWrapped)return r;const t=r.execute,o=async function(n,i){const s=new Date().toISOString(),c=Date.now(),a=l=>{try{e.add(l)}catch{}};try{const l=await t.call(this,n,i);return a({tool:r.name,params:D(n),result:D(l),status:"ok",startedAt:s,durationMs:Date.now()-c}),l}catch(l){throw a({tool:r.name,params:D(n),error:String(l?.message??l),status:"error",startedAt:s,durationMs:Date.now()-c}),l}};return o.__machviveWrapped=!0,{...r,execute:o}}let Z=!1;function ve(r=ae){const e=globalThis.navigator?.modelContext;if(!e||Z)return!1;e.tools?.length&&console.warn(`WebMCP analytics: ${e.tools.length} tool(s) were registered before analytics loaded and will not be captured. Import the analytics module earlier.`);const t=e.registerTool.bind(e);if(e.registerTool=o=>t(Q(o,r)),typeof e.provideContext=="function"){const o=e.provideContext.bind(e);e.provideContext=(n={})=>o({...n,tools:(n.tools??[]).map(i=>Q(i,r))})}return Z=!0,!0}const we=`
  ${j}

  /* Painting the background is not optional: this component sets its own text
     colour per theme, so it cannot rely on inheriting a compatible surface from
     whatever page embeds it. */
  :host { display: block; font: 13px/1.5 system-ui, sans-serif;
          color: var(--mv-fg); background: var(--mv-bg); }
  :host([hidden]) { display: none; }
  .bar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }
  .count { font-weight: 600; margin-right: auto; }
  /* color is required, not decorative: form controls do not inherit it, so
     without this the UA picks one per theme and white-on-white can result. */
  button { font: inherit; color: var(--mv-fg); padding: 3px 9px;
           border: 1px solid var(--mv-control-border); border-radius: 4px;
           background: var(--mv-bg); cursor: pointer; }
  button:hover { background: var(--mv-hover); }
  button.danger { color: var(--mv-danger); border-color: var(--mv-danger-border); }
  ol { list-style: none; margin: 0; padding: 0; border: 1px solid var(--mv-border);
       border-radius: 6px; max-height: 380px; overflow-y: auto; background: var(--mv-bg); }
  li { border-bottom: 1px solid var(--mv-border-soft); }
  li:last-child { border-bottom: 0; }
  .row { display: flex; gap: 8px; align-items: center; padding: 6px 10px; cursor: pointer; }
  .row:hover { background: var(--mv-hover); }
  .tool { font-family: ui-monospace, monospace; font-weight: 600; }
  .status { font-size: 11px; padding: 1px 6px; border-radius: 10px; }
  .status.ok { background: var(--mv-ok-bg); color: var(--mv-ok-fg); }
  .status.error { background: var(--mv-err-bg); color: var(--mv-err-fg); }
  .ms { color: var(--mv-muted); font-size: 11px; margin-left: auto; }
  .detail { padding: 8px 10px; background: var(--mv-surface);
            border-top: 1px solid var(--mv-border-soft); }
  .detail label { display: block; font-size: 11px; color: var(--mv-muted); margin: 6px 0 2px; }
  textarea { width: 100%; box-sizing: border-box; font-family: ui-monospace, monospace;
             font-size: 12px; color: var(--mv-fg); background: var(--mv-input-bg);
             border: 1px solid var(--mv-control-border); border-radius: 4px; padding: 5px; }
  pre { margin: 0; padding: 6px; color: var(--mv-fg); background: var(--mv-bg);
        border: 1px solid var(--mv-border-soft); border-radius: 4px;
        font-size: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; }
  .empty { padding: 20px; text-align: center; color: var(--mv-faint); }
  .err { color: var(--mv-err-fg); }
`;class xe extends HTMLElement{#e=ae;#t=null;#r=()=>this.#n();static get observedAttributes(){return["datalayer","theme"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`<style>${we}</style><div id="root"></div>`,this.#e.addEventListener("change",this.#r),globalThis.window.addEventListener(B,this.#o),this.#n(),this.#e.ready?.then(()=>this.isConnected&&this.#n())}disconnectedCallback(){this.#e.removeEventListener("change",this.#r),globalThis.window.removeEventListener(B,this.#o)}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get log(){return this.#e}#o=e=>{this.hasAttribute("datalayer")&&(e.detail?.reason!=="add"||!e.detail.entry||this.#e.pushToDataLayer(e.detail.entry.id))};#n(){const e=this.shadowRoot?.getElementById("root");if(!e)return;const t=this.#e.entries.slice().reverse();e.innerHTML=`
      <div class="bar">
        <span class="count">${t.length} call${t.length===1?"":"s"}</span>
        <button data-act="export">Export</button>
        <button data-act="copy">Copy JSON</button>
        <button data-act="clear" class="danger">Clear</button>
      </div>
      ${t.length===0?'<div class="empty">No WebMCP calls captured yet.</div>':`<ol>${t.map(o=>this.#i(o)).join("")}</ol>`}
    `,e.querySelector(".bar").addEventListener("click",o=>this.#c(o)),e.querySelectorAll("li").forEach(o=>this.#s(o))}#i(e){const t=this.#t===e.id;return`
      <li data-id="${e.id}">
        <div class="row">
          <span class="tool">${R(e.tool??"(unknown)")}</span>
          <span class="status ${e.status}">${e.status}</span>
          <span class="ms">${e.durationMs??0}ms</span>
        </div>
        ${t?`<div class="detail">
                 <label>Params (editable — used on replay)</label>
                 <textarea rows="3" data-role="params">${R(JSON.stringify(e.params??{},null,2))}</textarea>
                 <label>${e.status==="error"?"Error":"Result"}</label>
                 <pre class="${e.status==="error"?"err":""}">${R(e.status==="error"?e.error??"":JSON.stringify(e.result??null,null,2))}</pre>
                 <div class="bar" style="margin-top:8px">
                   <button data-act="save">Save params</button>
                   <button data-act="replay">Replay</button>
                   <button data-act="push">Push to dataLayer</button>
                   <button data-act="remove" class="danger">Delete</button>
                 </div>
               </div>`:""}
      </li>
    `}#s(e){const t=e.dataset.id;e.querySelector(".row").addEventListener("click",()=>{this.#t=this.#t===t?null:t,this.#n()}),e.querySelectorAll("button[data-act]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation(),this.#a(o.dataset.act,t,e)})})}async#a(e,t,o){const n=()=>{const i=o.querySelector('[data-role="params"]')?.value??"{}";try{return JSON.parse(i)}catch{return globalThis.window.alert("Params must be valid JSON."),null}};if(e==="save"){const i=n();i&&this.#e.update(t,{params:i})}else if(e==="replay"){const i=n();i&&await this.#e.replay(t,i)}else e==="push"?this.#e.pushToDataLayer(t):e==="remove"&&(this.#t===t&&(this.#t=null),this.#e.remove(t))}#c(e){const t=e.target.dataset?.act;t==="clear"?(this.#t=null,this.#e.clear()):t==="copy"?globalThis.navigator.clipboard?.writeText(this.#e.toJSON()):t==="export"&&this.#l()}#l(){const e=new Blob([this.#e.toJSON()],{type:"application/json"}),t=URL.createObjectURL(e),o=document.createElement("a");o.href=t,o.download=`webmcp-analytics-${Date.now()}.json`,o.click(),URL.revokeObjectURL(t)}}function R(r){return String(r).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}ve();customElements.get("machvive-webmcp-analytics")||customElements.define("machvive-webmcp-analytics",xe);function ke(r,e={}){if(r.type==="checkbox")return r.checked;const t=r.value;if(t!==""){if(e.type==="number"||e.type==="integer"){const o=Number(t);if(Number.isNaN(o))throw new TypeError(`"${t}" is not a number`);return e.type==="integer"?Math.trunc(o):o}if(e.type==="object"||e.type==="array")try{return JSON.parse(t)}catch{throw new TypeError("must be valid JSON")}return t}}const Se=`
  ${j}

  /* See analytics: a component that themes its own text must paint its own
     surface rather than assume the embedding page supplies a matching one. */
  :host { display: block; font: 13px/1.5 system-ui, sans-serif;
          color: var(--mv-fg); background: var(--mv-bg); }
  :host([hidden]) { display: none; }

  /* Floating mode docks the panel without disturbing page layout.
     The corner is configurable because bottom-right is crowded — chat widgets,
     cookie banners and support launchers all live there, and a fixed position
     means the inspector lands on top of one. */
  /* Floating mode is a detached panel: the .panel and .fab paint themselves, so
     the host must stay transparent or it draws a block over the page. */
  :host([floating]) { position: fixed; z-index: 2147483000; display: block; width: auto;
                      background: transparent;
                      inset-block-end: var(--mv-fab-offset-block, 16px);
                      inset-inline-end: var(--mv-fab-offset-inline, 16px); }
  :host([floating][position="bottom-left"])  { inset-inline-end: auto;
                      inset-inline-start: var(--mv-fab-offset-inline, 16px); }
  :host([floating][position="top-right"])    { inset-block-end: auto;
                      inset-block-start: var(--mv-fab-offset-block, 16px); }
  :host([floating][position="top-left"])     { inset-block-end: auto; inset-inline-end: auto;
                      inset-block-start: var(--mv-fab-offset-block, 16px);
                      inset-inline-start: var(--mv-fab-offset-inline, 16px); }
  /* hidden-fab keeps the panel reachable by hotkey with no launcher on screen. */
  :host([floating][hidden-fab]) .fab { display: none; }
  :host([floating]) .panel { display: none; width: min(420px, calc(100vw - 32px));
                             max-height: min(70vh, 560px); overflow: auto;
                             box-shadow: 0 8px 28px var(--mv-shadow); background: var(--mv-bg); }
  :host([floating][open]) .panel { display: block; }
  :host([floating]) .fab { display: inline-flex; }
  .fab { display: none; align-items: center; gap: 6px; margin-top: 8px; float: right;
         padding: 7px 13px; border-radius: 999px; border: 1px solid var(--mv-control-border);
         background: var(--mv-bg); color: var(--mv-fg); cursor: pointer; font: inherit;
         box-shadow: 0 2px 8px var(--mv-shadow); }

  .panel { border: 1px solid var(--mv-border); border-radius: 8px; overflow: hidden;
           background: var(--mv-bg); }
  header { display: flex; align-items: center; gap: 8px; padding: 7px 10px;
           background: var(--mv-surface); color: var(--mv-fg);
           border-bottom: 1px solid var(--mv-border-soft); font-weight: 600; }
  header .close { margin-left: auto; border: 0; background: none; cursor: pointer;
                  font-size: 16px; line-height: 1; color: var(--mv-muted); }
  :host(:not([floating])) header .close { display: none; }

  .body { display: flex; min-height: 150px; }
  @media (max-width: 520px) { .body { flex-direction: column; } }

  .tools { flex: 0 1 auto; min-width: 120px; max-width: 200px;
           border-right: 1px solid var(--mv-border-soft); overflow-y: auto; }
  @media (max-width: 520px) { .tools { flex: none; max-width: none; border-right: 0;
                                       border-bottom: 1px solid var(--mv-border-soft); } }
  /* Tool names are arbitrary identifiers; long ones must wrap inside the column
     rather than spill over the divider. */
  .tools button { display: block; width: 100%; text-align: left; padding: 6px 10px;
                  border: 0; background: none; color: var(--mv-fg); cursor: pointer;
                  font: inherit; font-family: ui-monospace, monospace; font-size: 12px;
                  overflow-wrap: anywhere; border-bottom: 1px solid var(--mv-border-soft); }
  .tools button:hover { background: var(--mv-hover); }
  .tools button[aria-current="true"] { background: var(--mv-selected); font-weight: 600; }

  .form { flex: 1; padding: 10px; min-width: 0; }
  .desc { color: var(--mv-muted); margin: 0 0 8px; }
  label { display: block; margin-bottom: 7px; }
  .name { font-family: ui-monospace, monospace; font-size: 12px; }
  .req { color: var(--mv-err-fg); }
  .hint { color: var(--mv-faint); font-size: 11px; }
  /* color/background are required, not decorative: form controls do not inherit
     them, so without these the UA picks per-theme defaults and text can render
     white on white. */
  input, select, textarea { width: 100%; box-sizing: border-box; font: inherit; font-size: 12px;
                            color: var(--mv-fg); background: var(--mv-input-bg); padding: 4px 6px;
                            border: 1px solid var(--mv-control-border); border-radius: 4px; }
  input[type="checkbox"] { width: auto; }
  textarea { font-family: ui-monospace, monospace; }
  .run { margin-top: 4px; padding: 5px 14px; border: 1px solid var(--mv-accent);
         border-radius: 4px; background: var(--mv-accent); color: var(--mv-accent-fg);
         cursor: pointer; font: inherit; }
  .run:disabled { opacity: .6; cursor: default; }
  pre { margin: 8px 0 0; padding: 7px; color: var(--mv-fg); background: var(--mv-surface);
        border: 1px solid var(--mv-border-soft); border-radius: 4px; font-size: 12px;
        white-space: pre-wrap; word-break: break-word; max-height: 180px; overflow: auto; }
  pre.error { background: var(--mv-err-bg); border-color: var(--mv-err-border); color: var(--mv-err-fg); }
  .field-error { color: var(--mv-err-fg); font-size: 11px; }
  .empty { padding: 20px; text-align: center; color: var(--mv-faint); }
`;class Ae extends HTMLElement{#e=null;#t=null;#r=()=>this.#s();static get observedAttributes(){return["floating","open","theme","position"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`<style>${Se}</style><div id="root"></div>`,globalThis.window.addEventListener(J,this.#r),this.getAttribute("hotkey")&&globalThis.window.addEventListener("keydown",this.#o),this.#s()}disconnectedCallback(){globalThis.window.removeEventListener(J,this.#r),globalThis.window.removeEventListener("keydown",this.#o)}#o=e=>{const t=(this.getAttribute("hotkey")||"").toLowerCase().split("+").map(i=>i.trim()),o=t.at(-1);if(!o)return;const n=i=>t.includes(i);e.key.toLowerCase()!==o||e.ctrlKey!==n("ctrl")||e.shiftKey!==n("shift")||e.altKey!==n("alt")||e.metaKey!==(n("meta")||n("cmd"))||(e.preventDefault(),this.hasAttribute("open")?this.hide():this.show())};attributeChangedCallback(){this.shadowRoot?.getElementById("root")&&this.#s()}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}get#n(){return globalThis.navigator?.modelContext??null}get#i(){return this.#n?.tools??[]}#s(){const e=this.shadowRoot?.getElementById("root");if(!e)return;const t=this.#n,o=!!(t&&Array.isArray(t.tools)&&typeof t.callTool=="function"),n=o?this.#i:[];this.#e&&!n.some(s=>s.name===this.#e)&&(this.#e=null),this.#e??=n[0]?.name??null;const i=n.find(s=>s.name===this.#e)??null;e.innerHTML=`
      <div class="panel">
        <header>WebMCP Inspector<button class="close" title="Close">&times;</button></header>
        ${o?n.length===0?'<div class="empty">No tools registered.</div>':`<div class="body">
                   <div class="tools">${n.map(s=>`<button data-tool="${f(s.name)}" aria-current="${s.name===this.#e}">${g(s.name)}</button>`).join("")}</div>
                   <div class="form">${this.#a(i)}</div>
                 </div>`:`<div class="empty">navigator.modelContext is unavailable here.<br>
                 <span class="hint">Needs a secure context, and tool discovery requires the machvive polyfill.</span></div>`}
      </div>
      <button class="fab" title="WebMCP Inspector">&#128295; WebMCP</button>
    `,this.#l(e)}#a(e){if(!e)return"";const t=e.inputSchema??{},o=t.properties??{},n=new Set(t.required??[]),i=Object.keys(o),s=i.length?i.map(c=>this.#c(c,o[c],n.has(c))).join(""):'<p class="hint">This tool takes no parameters.</p>';return`
      ${e.description?`<p class="desc">${g(e.description)}</p>`:""}
      <form>
        ${s}
        <button type="submit" class="run">Execute</button>
      </form>
      ${this.#t?`<pre class="${this.#t.isError?"error":""}">${g(this.#t.text)}</pre>`:""}
    `}#c(e,t={},o){const n=`<span class="name">${g(e)}</span>${o?' <span class="req" title="required">*</span>':""}${t.description?` <span class="hint">— ${g(t.description)}</span>`:""}`;let i;return Array.isArray(t.enum)?i=`<select data-field="${f(e)}">${o?"":'<option value=""></option>'}${t.enum.map(s=>`<option value="${f(s)}">${g(s)}</option>`).join("")}</select>`:t.type==="boolean"?i=`<input type="checkbox" data-field="${f(e)}">`:t.type==="object"||t.type==="array"?i=`<textarea rows="3" data-field="${f(e)}" placeholder="JSON"></textarea>`:i=`<input type="${t.type==="number"||t.type==="integer"?"number":"text"}"${t.type==="integer"?' step="1"':""} data-field="${f(e)}">`,`<label>${n}${i}<span class="field-error" data-error="${f(e)}"></span></label>`}#l(e){e.querySelector(".fab")?.addEventListener("click",()=>this.hasAttribute("open")?this.hide():this.show()),e.querySelector("header .close")?.addEventListener("click",()=>this.hide()),e.querySelectorAll("[data-tool]").forEach(t=>t.addEventListener("click",()=>{this.#e=t.dataset.tool,this.#t=null,this.#s()})),e.querySelector("form")?.addEventListener("submit",t=>{t.preventDefault(),this.#d(e)})}async#d(e){const t=this.#i.find(a=>a.name===this.#e);if(!t)return;const o=t.inputSchema?.properties??{},n=new Set(t.inputSchema?.required??[]),i={};let s=!1;e.querySelectorAll("[data-error]").forEach(a=>a.textContent="");for(const[a,l]of Object.entries(o)){const p=e.querySelector(`[data-field="${CSS.escape(a)}"]`);if(!p)continue;const h=e.querySelector(`[data-error="${CSS.escape(a)}"]`);try{const u=ke(p,l);if(u===void 0){n.has(a)&&(h&&(h.textContent="required"),s=!0);continue}i[a]=u}catch(u){h&&(h.textContent=String(u.message??u)),s=!0}}if(s)return;const c=e.querySelector(".run");c&&(c.disabled=!0);try{const a=await this.#n.callTool(t.name,i),l=(a?.content??[]).map(p=>p?.text??JSON.stringify(p)).join(`
`);this.#t={text:l||JSON.stringify(a,null,2),isError:!!a?.isError}}catch(a){this.#t={text:String(a?.message??a),isError:!0}}finally{c&&(c.disabled=!1)}this.#s()}}function g(r){return String(r).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}const f=g;customElements.get("machvive-webmcp-inspect")||customElements.define("machvive-webmcp-inspect",Ae);const Ce=`
  lorem ipsum a ab accusamus accusantium ad adipiscing alias aliquam aliquid amet animi
  aperiam architecto asperiores aspernatur assumenda at atque aut autem beatae blanditiis
  commodi consectetur consequatur consequuntur corporis corrupti culpa cum cumque cupiditate
  debitis delectus deleniti deserunt dicta dignissimos distinctio do dolor dolore dolorem
  doloremque dolores doloribus dolorum dquis ducimus ea eaque earum eius eligendi enim eos
  error ert esse est et eum eveniet ex excepturi exercitationem expedita explicabo facere
  facilis fuga fugiat fugit harum hic id illo illum impedit in incididunt inventore ipsa ipsam
  irure iste itaque iusto labore laboriosam laborum laudantium libero magnam magni maiores
  maxime minima minus modi molestiae molestias mollitia nam natus necessitatibus nemo neque
  nesciunt nihil nisi nobis non nostrumd nulla numquam obcaecati odio odit officia officiis
  omnis optio pariatur perferendis perspiciatis placeat porro possimus praesentium provident
  quae quaerat quam quas quasi qui quia quibusdam quidem quis quisquam quo quod quos ratione
  recusandae reiciendis rem repellat repellendaus reprehenderit repudiandae rerudum rerum
  saepe sapiente sed sequi similique sint sit soluta sunt suscipit tempora tempore temporibus
  tenetur totam ullam unde ut vel velit veniam veritatis vero vitae voluptas voluptate
  voluptatem voluptates voluptatibus voluptatum
`.trim().split(/\s+/),Ee=`
  a about absolutely accident action actionology admirable advocacy alchemy all an and angel
  animals anime answer anywhere application apprehension are arrester artisanal as asked atoms
  avant-garde awareness back bamboozle bananas based beauty best beyond blink bold book boost
  boy boys brand brandformance brands breakfast build but butterscotch buyer buyers by cadence
  can candy cash cellaphane centricity chain chaos claironic clarity clever clevor
  clevorvoyant clock clockwork coming common compass compel consensus contagious content
  context convergence conversational conviction convinced countenance counter crackerjack
  craftwork create creating crucial culture customer cut cutting damn data day decisis
  delirious delta depth design destroyed digital directed discerning discoverability
  distinctly doctor dog’s don't done doppelganger double dubious dust easy eat efficiency
  elastic electrokinetic emerging enablement enemy engage enigmatic enliven enterprise entice
  etch even every evocative evoked experience express extremely eyes faculties fad fall fast
  feasible ferver fishstick flow fluent fluid fly food for foray form freak fresh fringe from
  fruition fulcrum fundamental fusion future-proof game garish generation give glide glory
  gobsmackingly god golden gotta grokked grow guile hand happenstance he's heart help here
  high hold honey how however hyper-persuasive i iconic ideas ideation if imagine
  impossibilities in indigo infinite insipid into intuitive ion irrepressibly is isn’t it it's
  journeys joy keystone knot know latticework laureate leading-edge leapyear lengths let life
  like linchpin longing luxe madness majestic man many marketing me meaningful microsecond
  minds monkeys moonlight motion move movie moving my needle nevermore new noble noise
  nonsense not numbers observable of on once orgin other our outcome-based own page paragon
  pay pepper peppercoin physically piece pimento poet portal posh post potential probability
  product productivity propulsion purple quantum questions quinque quintessence rancid reason
  reasonable refreshingly reliable replicating required resonance results revenue reversed
  ridiculous right rise rocket salesforce saw say scalable score sculptor secure see seize
  sell seller sense shakespeare shoes single small smart socks sorrow stainless stars
  steadfast story straight strawberry striking studio sub-committee sunset surgery syncopated
  syncopation syndication take tech technology tell that the thee their theory there they this
  those through time to trebuchet trillions typing uncommon unexpected unfathomably universe
  unreasonable urgency use vantagepoint veins versus vessel video visualization visualizer
  visuals want was watch way were what wherewithal wind wine wise with within won't words work
  world yet you you'd your zenith
`.trim().split(/\s+/),ce=Object.freeze({latin:Object.freeze(Ce),english:Object.freeze(Ee)}),U=Object.freeze(Object.keys(ce)),Te=["lorem","ipsum","dolor","sit","amet"];function $e(r){let e=r>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const Le=r=>r.charAt(0).toUpperCase()+r.slice(1);function qe({sentences:r=5,paragraphs:e=1,lang:t="latin",minWords:o=5,maxWords:n=14,seed:i,classicOpening:s}={}){const c=ce[t];if(!c)throw new TypeError(`lang must be one of ${U.join(", ")}`);const a=i===void 0?Math.random:$e(i),l=(d,k)=>d+Math.floor(a()*(k-d+1)),p=Math.max(1,Math.min(o,n)),h=Math.max(p,n),u=s??t==="latin",L=[];let y=!0;for(let d=0;d<Math.max(1,e);d++){const k=r===-1?l(1,5):Math.max(1,r),q=[];for(let K=0;K<k;K++){const _=l(p,h),P=new Set,v=[];if(y&&u)for(const S of Te.slice(0,_))v.push(S),P.add(S);for(let S=0;v.length<_&&S<_*8;S++){const I=c[Math.floor(a()*c.length)];P.has(I)||(P.add(I),v.push(I))}v[0]=Le(v[0]),q.push(`${v.join(" ")}.`),y=!1}L.push(q.join(" "))}return L.join(`

`)}const z="generate_placeholder_text";let A=null;class F extends HTMLElement{#e="";static get observedAttributes(){return["lang","sentences","paragraphs","seed","theme","no-tool"]}constructor(){super(),this.attachShadow({mode:"open"})}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get lang(){const e=this.getAttribute("lang");return U.includes(e)?e:"latin"}set lang(e){this.setAttribute("lang",e)}get sentences(){const e=Number(this.getAttribute("sentences"));return Number.isFinite(e)&&e!==0?e:5}set sentences(e){this.setAttribute("sentences",String(e))}get paragraphs(){const e=Number(this.getAttribute("paragraphs"));return Number.isFinite(e)&&e>0?e:1}set paragraphs(e){this.setAttribute("paragraphs",String(e))}get seed(){const e=Number(this.getAttribute("seed"));return this.hasAttribute("seed")&&Number.isFinite(e)?e:void 0}set seed(e){e==null?this.removeAttribute("seed"):this.setAttribute("seed",String(e))}get text(){return this.#e}connectedCallback(){this.shadowRoot.innerHTML=`
      <style>
${j}
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          /* Inherit, and paint nothing. Placeholder copy stands in for a page's
             own text, so it belongs in whatever a card, table cell or chat
             bubble already uses.
             This is not a style preference. Setting a themed colour here
             measured 1.21:1 in three of six OS-preference x theme combinations —
             light text on a light page — because the component followed the OS
             while its host did not. A page decides its own palette; a text
             element that follows prefers-color-scheme independently of its
             container is wrong exactly whenever the container disagrees. */
          color: inherit;
        }

        /* An explicit choice is different: the author asked for this block to
           carry a palette, so it must paint the surface that palette assumes.
           A component that themes its own text and leaves the background to
           chance is how analytics once rendered at 1.21:1. */
        :host([theme="dark"]),
        :host([theme="light"]) {
          color: var(--mv-fg);
          background: var(--mv-bg);
        }
        p { margin: 0 0 0.75em; }
        p:last-child { margin-bottom: 0; }
      </style>
      <slot></slot>
    `,this.#t(),this.#r()}disconnectedCallback(){this.#o()}attributeChangedCallback(e){if(this.shadowRoot?.childElementCount&&e!=="theme"){if(e==="no-tool"){this.hasAttribute("no-tool")?this.#o():this.#r();return}this.#t()}}regenerate(){return this.#t(),this.#e}#t(){const e=this.shadowRoot.querySelector("slot");e&&(this.#e=qe({sentences:this.sentences,paragraphs:this.paragraphs,lang:this.lang,seed:this.seed}),e.replaceChildren(...this.#e.split(`

`).map(t=>{const o=document.createElement("p");return o.textContent=t,o})))}publishTool(){return A=null,this.#r(),this}withdrawTool(){return this.#o(),this}#r(){if(this.hasAttribute("no-tool"))return;const e=globalThis.navigator?.modelContext;if(!e)return;const t=e.tools?.some(o=>o.name===z);A&&t||(A=this,e.registerTool({name:z,description:"Generate placeholder copy and show it on the page. Latin reads as classic lorem ipsum; English is business-speak, which is better for judging whether a layout survives the text it will really hold.",inputSchema:{type:"object",properties:{lang:{type:"string",enum:[...U],description:"Vocabulary to draw from"},sentences:{type:"integer",description:"Sentences per paragraph. -1 picks 1-5 at random"},paragraphs:{type:"integer",description:"How many paragraphs"},seed:{type:"integer",description:"Omit for fresh copy; set for repeatable output"}}},execute:async(o={})=>{for(const i of["lang","sentences","paragraphs","seed"])o[i]!==void 0&&o[i]!==""&&(this[i]=o[i]);return{content:[{type:"text",text:this.regenerate()}]}}}))}#o(){if(A===this){globalThis.navigator?.modelContext?.unregisterTool(z),A=null;for(const e of globalThis.document?.querySelectorAll?.("machvive-lorum-ipsum")??[])if(e!==this&&e.isConnected&&e instanceof F){e.#r();break}}}}customElements.get("machvive-lorum-ipsum")||customElements.define("machvive-lorum-ipsum",F);function le(r){const e=r?.["@type"];return e?(Array.isArray(e)?e:[e]).map(t=>String(t).split(/[/#]/).pop()):[]}const Oe=r=>le(r).some(e=>e==="Product"||e==="ProductModel"||e==="IndividualProduct"),ee=r=>typeof r=="string"?r.split(/[/#]/).pop():void 0;function x(r){if(typeof r=="number")return Number.isFinite(r)?r:null;if(typeof r!="string")return null;const e=r.replace(/[^0-9.-]/g,""),t=Number.parseFloat(e);return Number.isFinite(t)?t:null}function $(r){if(typeof r=="string")return r;if(Array.isArray(r))return $(r[0]);if(r&&typeof r=="object")return r.name??r["@id"]??void 0}function N(r){if(typeof r=="string")return r;if(Array.isArray(r))return N(r[0]);if(r&&typeof r=="object")return r.url??r.contentUrl??r["@id"]??void 0}function Me(r){if(!r)return{};const e=Array.isArray(r)?r:[r];for(const t of e){if(!t||typeof t!="object")continue;const o=le(t).includes("AggregateOffer"),n=x(o?t.lowPrice??t.price:t.price);if(!(n===null&&!t.availability))return{price:n,priceCurrency:t.priceCurrency??t.priceSpecification?.priceCurrency,availability:ee(t.availability),condition:ee(t.itemCondition),seller:$(t.seller),offerUrl:N(t.url),priceRange:o?{low:x(t.lowPrice),high:x(t.highPrice),count:x(t.offerCount)}:void 0}}return{}}function Ne(r){const e=Me(r.offers),t=r.aggregateRating;return{name:r.name??$(r)??"",description:typeof r.description=="string"?r.description:void 0,sku:r.sku?String(r.sku):void 0,mpn:r.mpn?String(r.mpn):void 0,gtin:[r.gtin13,r.gtin14,r.gtin12,r.gtin8,r.gtin].find(o=>o!=null)?.toString(),brand:$(r.brand),category:$(r.category),url:N(r.url),image:N(r.image),price:e.price??null,currency:e.priceCurrency,availability:e.availability,condition:e.condition,seller:e.seller,priceRange:e.priceRange,rating:x(t?.ratingValue),reviewCount:x(t?.reviewCount),raw:r}}function te(r){const e=[],t=new WeakSet,o=n=>{if(!(!n||typeof n!="object")&&!t.has(n)){if(t.add(n),Array.isArray(n)){for(const i of n)o(i);return}Oe(n)&&e.push(Ne(n));for(const i of Object.values(n))i&&typeof i=="object"&&o(i)}};return o(r),je(e)}function je(r){const e=new Map;for(const t of r){const o=t.sku??t.gtin??t.url??t.name;if(!o)continue;const n=e.get(o);(!n||re(t)>re(n))&&e.set(o,t)}return[...e.values()]}const re=r=>Object.values(r).filter(e=>e!=null).length;function _e(r=globalThis.document){const e=r?.querySelectorAll?.('script[type="application/ld+json"]')??[],t=[];for(const o of e)try{t.push(JSON.parse(o.textContent))}catch(n){console.warn("[machvive] skipping malformed JSON-LD block:",n.message)}return t}function Pe(r){const e=o=>[...new Set(r.map(o).filter(Boolean))].sort(),t=r.map(o=>o.price).filter(o=>typeof o=="number");return{categories:e(o=>o.category),brands:e(o=>o.brand),availability:e(o=>o.availability),currencies:e(o=>o.currency),count:r.length,priceRange:t.length?{low:Math.min(...t),high:Math.max(...t)}:void 0}}const C=Object.freeze({SEARCH:"search_products",GET:"get_product",FACETS:"list_product_facets"});let E=null;const oe=10,ne=50,Ie=r=>({name:r.name,sku:r.sku,brand:r.brand,category:r.category,price:r.price,currency:r.currency,availability:r.availability,url:r.url}),De=r=>[r.name,r.description,r.sku,r.mpn,r.gtin,r.brand,r.category].filter(Boolean).join(" ").toLowerCase();class W extends HTMLElement{#e=[];static get observedAttributes(){return["src","theme","no-tool"]}constructor(){super(),this.attachShadow({mode:"open"})}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get src(){return this.getAttribute("src")}set src(e){e==null?this.removeAttribute("src"):this.setAttribute("src",e)}get products(){return[...this.#e]}get facets(){return Pe(this.#e)}async connectedCallback(){this.shadowRoot.innerHTML=`
      <style>
${j}
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.875rem;
          /* Inherit, and paint nothing. This renders a one-line status, not a
             surface of its own — and a text element that follows the OS
             independently of its container is wrong whenever they disagree. */
          color: inherit;
        }
        :host([theme="dark"]), :host([theme="light"]) {
          color: var(--mv-fg);
          background: var(--mv-bg);
        }
        :host([hidden]) { display: none; }
        p { margin: 0; }
        .count { font-weight: 600; }
        .muted { color: var(--mv-muted); }
      </style>
      <p class="muted">Reading product data…</p>
    `,await this.load()}disconnectedCallback(){this.#o()}attributeChangedCallback(e,t,o){if(!(!this.shadowRoot?.childElementCount||t===o)&&e!=="theme"){if(e==="no-tool"){this.hasAttribute("no-tool")?this.#o():this.#r();return}this.load()}}async load(){const e=this.src;try{this.#e=te(e?await fetch(e,{credentials:"omit"}).then(t=>t.json()):_e(this.ownerDocument??document)),this.#t()}catch(t){this.#e=[],this.#t(t)}return this.#r(),this.#e}#t(e){const t=this.shadowRoot?.querySelector("p");if(!t)return;if(e){t.className="muted",t.textContent=`Could not read product data: ${e.message}`;return}const o=this.#e.length;t.className=o?"count":"muted",t.textContent=o?`${o} product${o===1?"":"s"} exposed to agents`:"No product JSON-LD found on this page"}#r(){if(this.hasAttribute("no-tool"))return;const e=globalThis.navigator?.modelContext;if(!e)return;const t=e.tools?.some(i=>i.name===C.SEARCH);if(E&&E!==this&&t)return;E=this;const o=this.facets,n=i=>i.length?{enum:i}:{};e.registerTool({name:C.SEARCH,description:"Search the products this page describes. Combine free text with filters. Returns a compact summary of each match; use get_product for the full record.",inputSchema:{type:"object",properties:{query:{type:"string",description:"Free text matched against name, description, SKU, brand and category"},category:{type:"string",description:"Exact category",...n(o.categories)},brand:{type:"string",description:"Exact brand",...n(o.brands)},availability:{type:"string",description:"Stock status",...n(o.availability)},maxPrice:{type:"number",description:"Only products at or below this price"},minPrice:{type:"number",description:"Only products at or above this price"},limit:{type:"integer",description:`Maximum results (default ${oe}, max ${ne})`},offset:{type:"integer",description:"Skip this many matches, for paging"}}},execute:async(i={})=>this.#n(i)}),e.registerTool({name:C.GET,description:"Fetch one product in full by SKU, MPN or GTIN, including its original JSON-LD.",inputSchema:{type:"object",properties:{id:{type:"string",description:"A SKU, MPN or GTIN"}},required:["id"]},execute:async({id:i}={})=>this.#i(i)}),e.registerTool({name:C.FACETS,description:"List the categories, brands, stock states and price range present on this page. Call this before search_products to learn what the valid filter values are.",inputSchema:{type:"object",properties:{}},execute:async()=>T(this.facets)})}#o(){if(E!==this)return;const e=globalThis.navigator?.modelContext;for(const t of Object.values(C))e?.unregisterTool(t);E=null;for(const t of globalThis.document?.querySelectorAll?.("machvive-webmcp-products")??[])if(t!==this&&t.isConnected&&t instanceof W){t.#r();break}}#n({query:e,category:t,brand:o,availability:n,maxPrice:i,minPrice:s,limit:c,offset:a}={}){const l=typeof e=="string"?e.trim().toLowerCase():"",p=l?l.split(/\s+/):[],h=this.#e.filter(d=>{if(p.length){const k=De(d);if(!p.every(q=>k.includes(q)))return!1}return!(t&&d.category!==t||o&&d.brand!==o||n&&d.availability!==n||typeof i=="number"&&!(typeof d.price=="number"&&d.price<=i)||typeof s=="number"&&!(typeof d.price=="number"&&d.price>=s))}),u=Math.max(0,Number(a)||0),L=Math.min(ne,Math.max(1,Number(c)||oe)),y=h.slice(u,u+L);return T({total:h.length,returned:y.length,offset:u,truncated:u+y.length<h.length,products:y.map(Ie)})}#i(e){const t=String(e??"").trim().toLowerCase();if(!t)return T({error:"id is required"},!0);const o=this.#e.find(s=>[s.sku,s.mpn,s.gtin].filter(Boolean).some(c=>String(c).toLowerCase()===t));if(!o)return T({error:`no product matches "${e}"`,known:this.#e.length},!0);const{raw:n,...i}=o;return T({...i,jsonld:n})}}function T(r,e=!1){return{content:[{type:"text",text:JSON.stringify(r,null,2)}],...e?{isError:!0}:{}}}customElements.get("machvive-webmcp-products")||customElements.define("machvive-webmcp-products",W);const w=r=>new Promise(e=>setTimeout(e,r)),H={"M5T-001":{name:"Mach Five Tee",price:28},"M5T-002":{name:"Chicago Hoodie",price:64},"M5T-003":{name:"Vive Cap",price:22}},M=[],Re=[{name:"search_products",description:"Find products by keyword",inputSchema:{type:"object",properties:{query:{type:"string",description:"Search term"},limit:{type:"integer",description:"Max results"}},required:["query"]},execute:async({query:r,limit:e=10})=>{await w(40);const t=Object.entries(H).filter(([o,n])=>`${o} ${n.name}`.toLowerCase().includes(String(r).toLowerCase())).slice(0,e).map(([o,n])=>`${o} — ${n.name} ($${n.price})`);return t.length?t.join(`
`):`No products match "${r}".`}},{name:"add_to_cart",description:"Add a product to the shopping cart",inputSchema:{type:"object",properties:{sku:{type:"string",description:"Product SKU"},qty:{type:"integer",description:"How many"},gift:{type:"boolean",description:"Gift wrap it"},size:{type:"string",enum:["S","M","L","XL"]}},required:["sku"]},execute:async({sku:r,qty:e=1,gift:t=!1,size:o})=>{await w(30);const n=H[r];if(!n)throw new Error(`Unknown SKU: ${r}`);return M.push({sku:r,qty:e,gift:t,size:o}),`Added ${e} × ${n.name}${o?` (${o})`:""}${t?", gift wrapped":""}.`}},{name:"view_cart",description:"Show what is currently in the cart",inputSchema:{type:"object",properties:{}},execute:async()=>{if(await w(15),!M.length)return"Cart is empty.";const r=M.reduce((e,t)=>e+H[t.sku].price*t.qty,0);return`${M.length} line(s), total $${r}`}},{name:"apply_coupon",description:"Apply a discount code (try INVALID to see an error captured)",inputSchema:{type:"object",properties:{code:{type:"string",description:"Coupon code"}},required:["code"]},execute:async({code:r})=>{if(await w(25),r!=="MACHFIVE")throw new Error(`Coupon "${r}" is not valid.`);return"Coupon applied: 15% off."}},{name:"update_preferences",description:"Save shopper preferences (object field — enter JSON)",inputSchema:{type:"object",properties:{prefs:{type:"object",description:'e.g. {"newsletter":true,"currency":"USD"}'}},required:["prefs"]},execute:async({prefs:r})=>(await w(20),`Saved ${Object.keys(r??{}).length} preference(s).`)}];navigator.modelContext.provideContext({tools:Re});document.querySelector("machvive-lorum-ipsum")?.publishTool();const ie=document.getElementById("status"),m=r=>{ie.textContent=r,clearTimeout(m.t),m.t=setTimeout(()=>ie.textContent="",4e3)};document.getElementById("simulate").addEventListener("click",async r=>{r.target.disabled=!0,m("Simulating agent traffic…");const e=[["search_products",{query:"tee",limit:5}],["add_to_cart",{sku:"M5T-001",qty:2,size:"L",gift:!0}],["add_to_cart",{sku:"M5T-003",qty:1}],["apply_coupon",{code:"INVALID"}],["apply_coupon",{code:"MACHFIVE"}],["update_preferences",{prefs:{newsletter:!0,currency:"USD"}}],["view_cart",{}]];for(const[t,o]of e)await navigator.modelContext.callTool(t,o),await w(120);m(`Done — ${e.length} calls captured.`),r.target.disabled=!1});document.getElementById("register-late").addEventListener("click",()=>{const r=Math.floor(Math.random()*900+100);navigator.modelContext.registerTool({name:`track_order_${r}`,description:"Registered after page load",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:({id:e})=>`Order ${e} is in transit.`}),m(`Registered track_order_${r} — inspector updated live.`)});document.getElementById("unregister").addEventListener("click",()=>{m(navigator.modelContext.unregisterTool("search_products")?"Removed search_products.":"search_products was not registered.")});globalThis.mcp=navigator.modelContext;const b=document.querySelector("machvive-webmcp-products");await b.load();document.getElementById("products-remote").addEventListener("click",async()=>{b.src="./products.json",await b.load(),m(`Loaded ${b.products.length} products from products.json — re-open search_products to see the new filters`)});document.getElementById("products-page").addEventListener("click",async()=>{b.src=null,await b.load(),m(`Back to this page's own JSON-LD — ${b.products.length} products`)});
