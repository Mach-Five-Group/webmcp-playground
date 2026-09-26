(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();const $="machvive-webmcp-change";function k(n){if(!n||typeof n!="object")throw new TypeError("WebMCP: tool descriptor must be an object");if(typeof n.name!="string"||n.name.length===0)throw new TypeError("WebMCP: tool.name must be a non-empty string");if(typeof n.execute!="function")throw new TypeError(`WebMCP: tool "${n.name}" must supply an execute() function`)}function P(n){return n&&Array.isArray(n.content)?n:typeof n=="string"?{content:[{type:"text",text:n}]}:n==null?{content:[]}:{content:[{type:"text",text:JSON.stringify(n)}]}}class j{#e=new Map;registerTool(e){k(e),this.#e.set(e.name,e),this.#r()}unregisterTool(e){const t=this.#e.delete(e);return t&&this.#r(),t}provideContext({tools:e=[]}={}){e.forEach(k),this.#e.clear();for(const t of e)this.#e.set(t.name,t);this.#r()}get tools(){return[...this.#e.values()].map(({name:e,description:t,inputSchema:r})=>({name:e,description:t,inputSchema:r}))}async callTool(e,t={}){const r=this.#e.get(e);if(!r)return{content:[{type:"text",text:`Unknown tool: ${e}`}],isError:!0};try{return P(await r.execute(t,this.#t()))}catch(o){return{content:[{type:"text",text:String(o?.message??o)}],isError:!0}}}#t(){return{requestUserInteraction:e=>Promise.resolve().then(e)}}#r(){window.dispatchEvent(new CustomEvent($,{detail:{tools:this.tools}}))}}function _(){return"modelContext"in navigator?!1:window.isSecureContext?(Object.defineProperty(navigator,"modelContext",{value:new j,configurable:!0,enumerable:!1,writable:!1}),!0):(console.warn("WebMCP: navigator.modelContext is a secure-context API; polyfill not installed."),!1)}class I extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){_(),this.shadowRoot.innerHTML="<style>:host { display: none; }</style>"}registerTool(e){return navigator.modelContext?.registerTool(e)}unregisterTool(e){return navigator.modelContext?.unregisterTool(e)}}_();customElements.get("machvive-webmcp-polyfill")||customElements.define("machvive-webmcp-polyfill",I);const T=`
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
`,C=`
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
`,q=`
  :host {
    color-scheme: light dark;
${T}  }

  @media (prefers-color-scheme: dark) {
    :host(:not([theme="light"])) {
${C}    }
  }

  /* Explicit choice beats the OS preference, in both directions. */
  :host([theme="dark"]) {
${C}  }

  :host([theme="light"]) {
    color-scheme: light;
${T}  }
`,E="machvive-webmcp-call",D="machvive-webmcp",v="calls",J=1,R=500;class z{#e=null;get available(){return!!globalThis.indexedDB}#t(){return this.available?(this.#e??=new Promise(e=>{let t;try{t=globalThis.indexedDB.open(D,J)}catch{return e(null)}t.onupgradeneeded=()=>{const r=t.result;r.objectStoreNames.contains(v)||r.createObjectStore(v,{keyPath:"id"})},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null),t.onblocked=()=>e(null)}),this.#e):Promise.resolve(null)}async#r(e,t){const r=await this.#t();return r?new Promise(o=>{let a;try{a=r.transaction(v,e)}catch{return o(null)}const i=t(a.objectStore(v));a.oncomplete=()=>o(i?i.result:null),a.onerror=()=>o(null),a.onabort=()=>o(null)}):null}all(){return this.#r("readonly",e=>e.getAll()).then(e=>e??[])}put(e){return this.#r("readwrite",t=>t.put(e))}delete(e){return this.#r("readwrite",t=>t.delete(e))}clear(){return this.#r("readwrite",e=>e.clear())}}let B=0;const L=()=>`call-${Date.now().toString(36)}-${(B++).toString(36)}`;function x(n){if(n!==void 0)try{return JSON.parse(JSON.stringify(n))}catch{return String(n)}}class H{#e=new Set;#t=[];#r;#a;#n=new z;ready;constructor({limit:e=R,persist:t=!0}={}){this.#r=e,this.#a=t,this.ready=this.#c()}get persistent(){return this.#a&&this.#n.available}addEventListener(e,t){e==="change"&&typeof t=="function"&&this.#e.add(t)}removeEventListener(e,t){e==="change"&&this.#e.delete(t)}get entries(){return[...this.#t]}get size(){return this.#t.length}add(e){const t={id:L(),...e};this.#t.push(t);let r=[];return this.#t.length>this.#r&&(r=this.#t.splice(0,this.#t.length-this.#r)),this.#i(o=>{o.put(t);for(const a of r)o.delete(a.id)}),this.#o("add",t),t}update(e,t){const r=this.#t.find(o=>o.id===e);return r?(Object.assign(r,t),this.#i(o=>o.put(r)),this.#o("update",r),r):null}remove(e){const t=this.#t.findIndex(o=>o.id===e);if(t===-1)return!1;const[r]=this.#t.splice(t,1);return this.#i(o=>o.delete(r.id)),this.#o("remove",r),!0}clear(){this.#t=[],this.#i(e=>e.clear()),this.#o("clear",null)}toJSON(e=2){return JSON.stringify({version:1,exportedAt:new Date().toISOString(),entries:this.#t},null,e)}import(e){const t=typeof e=="string"?JSON.parse(e):e,r=Array.isArray(t)?t:t?.entries;if(!Array.isArray(r))throw new TypeError("Analytics: import expects an entries array");for(const o of r){const a={...o,id:o.id??L()};this.#t.push(a),this.#i(i=>i.put(a))}return this.#o("import",null),r.length}async replay(e,t){const r=this.#t.find(a=>a.id===e);if(!r)throw new Error(`Analytics: no captured call ${e}`);const o=globalThis.navigator?.modelContext;if(!o?.callTool)throw new Error("Analytics: navigator.modelContext.callTool is unavailable");return o.callTool(r.tool,t??r.params??{})}pushToDataLayer(e){const t=this.#t.find(o=>o.id===e);return t?((globalThis.window.dataLayer||=[]).push({event:"webmcp_tool_call",webmcp_tool:t.tool,webmcp_status:t.status,webmcp_duration_ms:t.durationMs,webmcp_params:t.params,webmcp_error:t.error??void 0}),this.update(e,{pushedToDataLayer:!0}),!0):!1}#o(e,t){const r={reason:e,entry:t,entries:this.entries};for(const o of this.#e)try{o({type:"change",detail:r})}catch{}try{globalThis.window?.dispatchEvent?.(new CustomEvent(E,{detail:{reason:e,entry:t}}))}catch{}}#i(e){this.persistent&&this.#s(e).catch(()=>{})}async#s(e){const t=[];e({put:r=>t.push(["put",r]),delete:r=>t.push(["delete",r]),clear:()=>t.push(["clear"])});for(const[r,o]of t)await this.#n[r](o)}async#c(){if(this.persistent)try{const e=await this.#n.all();if(!Array.isArray(e)||e.length===0)return;const t=new Set(this.#t.map(o=>o.id)),r=[...e.filter(o=>!t.has(o.id)),...this.#t];this.#t=r.slice(-this.#r),this.#o("restore",null)}catch{}}}const N=new H;function A(n,e){if(!n||typeof n!="object"||typeof n.execute!="function"||n.execute.__machviveWrapped)return n;const t=n.execute,r=async function(o,a){const i=new Date().toISOString(),l=Date.now(),s=c=>{try{e.add(c)}catch{}};try{const c=await t.call(this,o,a);return s({tool:n.name,params:x(o),result:x(c),status:"ok",startedAt:i,durationMs:Date.now()-l}),c}catch(c){throw s({tool:n.name,params:x(o),error:String(c?.message??c),status:"error",startedAt:i,durationMs:Date.now()-l}),c}};return r.__machviveWrapped=!0,{...n,execute:r}}let O=!1;function W(n=N){const e=globalThis.navigator?.modelContext;if(!e||O)return!1;e.tools?.length&&console.warn(`WebMCP analytics: ${e.tools.length} tool(s) were registered before analytics loaded and will not be captured. Import the analytics module earlier.`);const t=e.registerTool.bind(e);if(e.registerTool=r=>t(A(r,n)),typeof e.provideContext=="function"){const r=e.provideContext.bind(e);e.provideContext=(o={})=>r({...o,tools:(o.tools??[]).map(a=>A(a,n))})}return O=!0,!0}const U=`
  ${q}

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
`;class F extends HTMLElement{#e=N;#t=null;#r=()=>this.#n();static get observedAttributes(){return["datalayer","theme"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`<style>${U}</style><div id="root"></div>`,this.#e.addEventListener("change",this.#r),globalThis.window.addEventListener(E,this.#a),this.#n(),this.#e.ready?.then(()=>this.isConnected&&this.#n())}disconnectedCallback(){this.#e.removeEventListener("change",this.#r),globalThis.window.removeEventListener(E,this.#a)}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get log(){return this.#e}#a=e=>{this.hasAttribute("datalayer")&&(e.detail?.reason!=="add"||!e.detail.entry||this.#e.pushToDataLayer(e.detail.entry.id))};#n(){const e=this.shadowRoot?.getElementById("root");if(!e)return;const t=this.#e.entries.slice().reverse();e.innerHTML=`
      <div class="bar">
        <span class="count">${t.length} call${t.length===1?"":"s"}</span>
        <button data-act="export">Export</button>
        <button data-act="copy">Copy JSON</button>
        <button data-act="clear" class="danger">Clear</button>
      </div>
      ${t.length===0?'<div class="empty">No WebMCP calls captured yet.</div>':`<ol>${t.map(r=>this.#o(r)).join("")}</ol>`}
    `,e.querySelector(".bar").addEventListener("click",r=>this.#c(r)),e.querySelectorAll("li").forEach(r=>this.#i(r))}#o(e){const t=this.#t===e.id;return`
      <li data-id="${e.id}">
        <div class="row">
          <span class="tool">${w(e.tool??"(unknown)")}</span>
          <span class="status ${e.status}">${e.status}</span>
          <span class="ms">${e.durationMs??0}ms</span>
        </div>
        ${t?`<div class="detail">
                 <label>Params (editable — used on replay)</label>
                 <textarea rows="3" data-role="params">${w(JSON.stringify(e.params??{},null,2))}</textarea>
                 <label>${e.status==="error"?"Error":"Result"}</label>
                 <pre class="${e.status==="error"?"err":""}">${w(e.status==="error"?e.error??"":JSON.stringify(e.result??null,null,2))}</pre>
                 <div class="bar" style="margin-top:8px">
                   <button data-act="save">Save params</button>
                   <button data-act="replay">Replay</button>
                   <button data-act="push">Push to dataLayer</button>
                   <button data-act="remove" class="danger">Delete</button>
                 </div>
               </div>`:""}
      </li>
    `}#i(e){const t=e.dataset.id;e.querySelector(".row").addEventListener("click",()=>{this.#t=this.#t===t?null:t,this.#n()}),e.querySelectorAll("button[data-act]").forEach(r=>{r.addEventListener("click",o=>{o.stopPropagation(),this.#s(r.dataset.act,t,e)})})}async#s(e,t,r){const o=()=>{const a=r.querySelector('[data-role="params"]')?.value??"{}";try{return JSON.parse(a)}catch{return globalThis.window.alert("Params must be valid JSON."),null}};if(e==="save"){const a=o();a&&this.#e.update(t,{params:a})}else if(e==="replay"){const a=o();a&&await this.#e.replay(t,a)}else e==="push"?this.#e.pushToDataLayer(t):e==="remove"&&(this.#t===t&&(this.#t=null),this.#e.remove(t))}#c(e){const t=e.target.dataset?.act;t==="clear"?(this.#t=null,this.#e.clear()):t==="copy"?globalThis.navigator.clipboard?.writeText(this.#e.toJSON()):t==="export"&&this.#l()}#l(){const e=new Blob([this.#e.toJSON()],{type:"application/json"}),t=URL.createObjectURL(e),r=document.createElement("a");r.href=t,r.download=`webmcp-analytics-${Date.now()}.json`,r.click(),URL.revokeObjectURL(t)}}function w(n){return String(n).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}W();customElements.get("machvive-webmcp-analytics")||customElements.define("machvive-webmcp-analytics",F);function V(n,e={}){if(n.type==="checkbox")return n.checked;const t=n.value;if(t!==""){if(e.type==="number"||e.type==="integer"){const r=Number(t);if(Number.isNaN(r))throw new TypeError(`"${t}" is not a number`);return e.type==="integer"?Math.trunc(r):r}if(e.type==="object"||e.type==="array")try{return JSON.parse(t)}catch{throw new TypeError("must be valid JSON")}return t}}const G=`
  ${q}

  /* See analytics: a component that themes its own text must paint its own
     surface rather than assume the embedding page supplies a matching one. */
  :host { display: block; font: 13px/1.5 system-ui, sans-serif;
          color: var(--mv-fg); background: var(--mv-bg); }
  :host([hidden]) { display: none; }

  /* Floating mode docks the panel without disturbing page layout. */
  /* Floating mode is a detached panel: the .panel and .fab paint themselves, so
     the host must stay transparent or it draws a block over the page. */
  :host([floating]) { position: fixed; right: 16px; bottom: 16px; z-index: 2147483000;
                      display: block; width: auto; background: transparent; }
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
`;class K extends HTMLElement{#e=null;#t=null;#r=()=>this.#o();static get observedAttributes(){return["floating","open","theme"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`<style>${G}</style><div id="root"></div>`,globalThis.window.addEventListener($,this.#r),this.#o()}disconnectedCallback(){globalThis.window.removeEventListener($,this.#r)}attributeChangedCallback(){this.shadowRoot?.getElementById("root")&&this.#o()}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}get#a(){return globalThis.navigator?.modelContext??null}get#n(){return this.#a?.tools??[]}#o(){const e=this.shadowRoot?.getElementById("root");if(!e)return;const t=this.#a,r=!!(t&&Array.isArray(t.tools)&&typeof t.callTool=="function"),o=r?this.#n:[];this.#e&&!o.some(i=>i.name===this.#e)&&(this.#e=null),this.#e??=o[0]?.name??null;const a=o.find(i=>i.name===this.#e)??null;e.innerHTML=`
      <div class="panel">
        <header>WebMCP Inspector<button class="close" title="Close">&times;</button></header>
        ${r?o.length===0?'<div class="empty">No tools registered.</div>':`<div class="body">
                   <div class="tools">${o.map(i=>`<button data-tool="${d(i.name)}" aria-current="${i.name===this.#e}">${p(i.name)}</button>`).join("")}</div>
                   <div class="form">${this.#i(a)}</div>
                 </div>`:`<div class="empty">navigator.modelContext is unavailable here.<br>
                 <span class="hint">Needs a secure context, and tool discovery requires the machvive polyfill.</span></div>`}
      </div>
      <button class="fab" title="WebMCP Inspector">&#128295; WebMCP</button>
    `,this.#c(e)}#i(e){if(!e)return"";const t=e.inputSchema??{},r=t.properties??{},o=new Set(t.required??[]),a=Object.keys(r),i=a.length?a.map(l=>this.#s(l,r[l],o.has(l))).join(""):'<p class="hint">This tool takes no parameters.</p>';return`
      ${e.description?`<p class="desc">${p(e.description)}</p>`:""}
      <form>
        ${i}
        <button type="submit" class="run">Execute</button>
      </form>
      ${this.#t?`<pre class="${this.#t.isError?"error":""}">${p(this.#t.text)}</pre>`:""}
    `}#s(e,t={},r){const o=`<span class="name">${p(e)}</span>${r?' <span class="req" title="required">*</span>':""}${t.description?` <span class="hint">— ${p(t.description)}</span>`:""}`;let a;return Array.isArray(t.enum)?a=`<select data-field="${d(e)}">${r?"":'<option value=""></option>'}${t.enum.map(i=>`<option value="${d(i)}">${p(i)}</option>`).join("")}</select>`:t.type==="boolean"?a=`<input type="checkbox" data-field="${d(e)}">`:t.type==="object"||t.type==="array"?a=`<textarea rows="3" data-field="${d(e)}" placeholder="JSON"></textarea>`:a=`<input type="${t.type==="number"||t.type==="integer"?"number":"text"}"${t.type==="integer"?' step="1"':""} data-field="${d(e)}">`,`<label>${o}${a}<span class="field-error" data-error="${d(e)}"></span></label>`}#c(e){e.querySelector(".fab")?.addEventListener("click",()=>this.hasAttribute("open")?this.hide():this.show()),e.querySelector("header .close")?.addEventListener("click",()=>this.hide()),e.querySelectorAll("[data-tool]").forEach(t=>t.addEventListener("click",()=>{this.#e=t.dataset.tool,this.#t=null,this.#o()})),e.querySelector("form")?.addEventListener("submit",t=>{t.preventDefault(),this.#l(e)})}async#l(e){const t=this.#n.find(s=>s.name===this.#e);if(!t)return;const r=t.inputSchema?.properties??{},o=new Set(t.inputSchema?.required??[]),a={};let i=!1;e.querySelectorAll("[data-error]").forEach(s=>s.textContent="");for(const[s,c]of Object.entries(r)){const m=e.querySelector(`[data-field="${CSS.escape(s)}"]`);if(!m)continue;const g=e.querySelector(`[data-error="${CSS.escape(s)}"]`);try{const f=V(m,c);if(f===void 0){o.has(s)&&(g&&(g.textContent="required"),i=!0);continue}a[s]=f}catch(f){g&&(g.textContent=String(f.message??f)),i=!0}}if(i)return;const l=e.querySelector(".run");l&&(l.disabled=!0);try{const s=await this.#a.callTool(t.name,a),c=(s?.content??[]).map(m=>m?.text??JSON.stringify(m)).join(`
`);this.#t={text:c||JSON.stringify(s,null,2),isError:!!s?.isError}}catch(s){this.#t={text:String(s?.message??s),isError:!0}}finally{l&&(l.disabled=!1)}this.#o()}}function p(n){return String(n).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}const d=p;customElements.get("machvive-webmcp-inspect")||customElements.define("machvive-webmcp-inspect",K);const u=n=>new Promise(e=>setTimeout(e,n)),S={"M5T-001":{name:"Mach Five Tee",price:28},"M5T-002":{name:"Chicago Hoodie",price:64},"M5T-003":{name:"Vive Cap",price:22}},b=[];let y=0;const Y=[{name:"search_products",description:"Find products by keyword",inputSchema:{type:"object",properties:{query:{type:"string",description:"Search term"},limit:{type:"integer",description:"Max results"}},required:["query"]},execute:async({query:n,limit:e=10})=>{await u(40);const t=Object.entries(S).filter(([r,o])=>`${r} ${o.name}`.toLowerCase().includes(String(n).toLowerCase())).slice(0,e).map(([r,o])=>`${r} — ${o.name} ($${o.price})`);return t.length?t.join(`
`):`No products match "${n}".`}},{name:"add_to_cart",description:"Add a product to the shopping cart",inputSchema:{type:"object",properties:{sku:{type:"string",description:"Product SKU"},qty:{type:"integer",description:"How many"},gift:{type:"boolean",description:"Gift wrap it"},size:{type:"string",enum:["S","M","L","XL"]}},required:["sku"]},execute:async({sku:n,qty:e=1,gift:t=!1,size:r})=>{await u(30);const o=S[n];if(!o)throw new Error(`Unknown SKU: ${n}`);return b.push({sku:n,qty:e,gift:t,size:r}),`Added ${e} × ${o.name}${r?` (${r})`:""}${t?", gift wrapped":""}.`}},{name:"view_cart",description:"Show what is currently in the cart",inputSchema:{type:"object",properties:{}},execute:async()=>{if(await u(15),!b.length)return"Cart is empty.";const n=b.reduce((t,r)=>t+S[r.sku].price*r.qty,0),e=n*(1-y);return y?`${b.length} line(s), subtotal $${n.toFixed(2)}, discount ${y*100}%, total $${e.toFixed(2)}`:`${b.length} line(s), total $${n.toFixed(2)}`}},{name:"apply_coupon",description:"Apply a discount code (try INVALID to see an error captured)",inputSchema:{type:"object",properties:{code:{type:"string",description:"Coupon code"}},required:["code"]},execute:async({code:n})=>{if(await u(25),n!=="MACHFIVE")throw new Error(`Coupon "${n}" is not valid.`);return y=.15,"Coupon applied: 15% off."}},{name:"update_preferences",description:"Save shopper preferences (object field — enter JSON)",inputSchema:{type:"object",properties:{prefs:{type:"object",description:'e.g. {"newsletter":true,"currency":"USD"}'}},required:["prefs"]},execute:async({prefs:n})=>(await u(20),`Saved ${Object.keys(n??{}).length} preference(s).`)}];navigator.modelContext.provideContext({tools:Y});const M=document.getElementById("status"),h=n=>{M.textContent=n,clearTimeout(h.t),h.t=setTimeout(()=>M.textContent="",4e3)};document.getElementById("simulate").addEventListener("click",async n=>{n.target.disabled=!0,h("Simulating agent traffic…");const e=[["search_products",{query:"tee",limit:5}],["add_to_cart",{sku:"M5T-001",qty:2,size:"L",gift:!0}],["add_to_cart",{sku:"M5T-003",qty:1}],["apply_coupon",{code:"INVALID"}],["apply_coupon",{code:"MACHFIVE"}],["update_preferences",{prefs:{newsletter:!0,currency:"USD"}}],["view_cart",{}]];for(const[t,r]of e)await navigator.modelContext.callTool(t,r),await u(120);h(`Done — ${e.length} calls captured.`),n.target.disabled=!1});document.getElementById("register-late").addEventListener("click",()=>{const n=Math.floor(Math.random()*900+100);navigator.modelContext.registerTool({name:`track_order_${n}`,description:"Registered after page load",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:({id:e})=>`Order ${e} is in transit.`}),h(`Registered track_order_${n} — inspector updated live.`)});document.getElementById("unregister").addEventListener("click",()=>{h(navigator.modelContext.unregisterTool("search_products")?"Removed search_products.":"search_products was not registered.")});globalThis.mcp=navigator.modelContext;
