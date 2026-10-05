(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=t(o);fetch(o.href,i)}})();const O="machvive-webmcp-change";function R(n){if(!n||typeof n!="object")throw new TypeError("WebMCP: tool descriptor must be an object");if(typeof n.name!="string"||n.name.length===0)throw new TypeError("WebMCP: tool.name must be a non-empty string");if(typeof n.execute!="function")throw new TypeError(`WebMCP: tool "${n.name}" must supply an execute() function`)}function Y(n){return n&&Array.isArray(n.content)?n:typeof n=="string"?{content:[{type:"text",text:n}]}:n==null?{content:[]}:{content:[{type:"text",text:JSON.stringify(n)}]}}class X{#e=new Map;registerTool(e){R(e),this.#e.set(e.name,e),this.#r()}unregisterTool(e){const t=this.#e.delete(e);return t&&this.#r(),t}provideContext({tools:e=[]}={}){e.forEach(R),this.#e.clear();for(const t of e)this.#e.set(t.name,t);this.#r()}get tools(){return[...this.#e.values()].map(({name:e,description:t,inputSchema:r})=>({name:e,description:t,inputSchema:r}))}async callTool(e,t={}){const r=this.#e.get(e);if(!r)return{content:[{type:"text",text:`Unknown tool: ${e}`}],isError:!0};try{return Y(await r.execute(t,this.#t()))}catch(o){return{content:[{type:"text",text:String(o?.message??o)}],isError:!0}}}#t(){return{requestUserInteraction:e=>Promise.resolve().then(e)}}#r(){window.dispatchEvent(new CustomEvent(O,{detail:{tools:this.tools}}))}}function K({allowInsecureContext:n=!1}={}){return"modelContext"in navigator?!1:!window.isSecureContext&&!n?(console.warn(`WebMCP: ${globalThis.location?.origin??"this page"} is not a secure context, so navigator.modelContext was not installed. A secure origin, localhost or 127.0.0.1 qualifies; a LAN address or custom hostname does not. For an offline or intranet bundle, opt in with <machvive-webmcp-polyfill allow-insecure> or installWebmcpPolyfill({ allowInsecureContext: true }).`),!1):(Object.defineProperty(navigator,"modelContext",{value:new X,configurable:!0,enumerable:!1,writable:!1}),!0)}class Q extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){K({allowInsecureContext:this.hasAttribute("allow-insecure")}),this.shadowRoot.innerHTML="<style>:host { display: none; }</style>"}registerTool(e){return navigator.modelContext?.registerTool(e)}unregisterTool(e){return navigator.modelContext?.unregisterTool(e)}}K();customElements.get("machvive-webmcp-polyfill")||customElements.define("machvive-webmcp-polyfill",Q);const H=`
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
`,B=`
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
`,_=`
  :host {
    color-scheme: light dark;
${H}  }

  @media (prefers-color-scheme: dark) {
    :host(:not([theme="light"])) {
${B}    }
  }

  /* Explicit choice beats the OS preference, in both directions. */
  :host([theme="dark"]) {
${B}  }

  :host([theme="light"]) {
    color-scheme: light;
${H}  }
`,M="machvive-webmcp-call",Z="machvive-webmcp",x="calls",ee=1,te=500;class re{#e=null;get available(){return!!globalThis.indexedDB}#t(){return this.available?(this.#e??=new Promise(e=>{let t;try{t=globalThis.indexedDB.open(Z,ee)}catch{return e(null)}t.onupgradeneeded=()=>{const r=t.result;r.objectStoreNames.contains(x)||r.createObjectStore(x,{keyPath:"id"})},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null),t.onblocked=()=>e(null)}),this.#e):Promise.resolve(null)}async#r(e,t){const r=await this.#t();return r?new Promise(o=>{let i;try{i=r.transaction(x,e)}catch{return o(null)}const s=t(i.objectStore(x));i.oncomplete=()=>o(s?s.result:null),i.onerror=()=>o(null),i.onabort=()=>o(null)}):null}all(){return this.#r("readonly",e=>e.getAll()).then(e=>e??[])}put(e){return this.#r("readwrite",t=>t.put(e))}delete(e){return this.#r("readwrite",t=>t.delete(e))}clear(){return this.#r("readwrite",e=>e.clear())}}let oe=0;const J=()=>`call-${Date.now().toString(36)}-${(oe++).toString(36)}`;function C(n){if(n!==void 0)try{return JSON.parse(JSON.stringify(n))}catch{return String(n)}}class ne{#e=new Set;#t=[];#r;#n;#i=new re;ready;constructor({limit:e=te,persist:t=!0}={}){this.#r=e,this.#n=t,this.ready=this.#l()}get persistent(){return this.#n&&this.#i.available}addEventListener(e,t){e==="change"&&typeof t=="function"&&this.#e.add(t)}removeEventListener(e,t){e==="change"&&this.#e.delete(t)}get entries(){return[...this.#t]}get size(){return this.#t.length}add(e){const t={id:J(),...e};this.#t.push(t);let r=[];return this.#t.length>this.#r&&(r=this.#t.splice(0,this.#t.length-this.#r)),this.#o(o=>{o.put(t);for(const i of r)o.delete(i.id)}),this.#s("add",t),t}update(e,t){const r=this.#t.find(o=>o.id===e);return r?(Object.assign(r,t),this.#o(o=>o.put(r)),this.#s("update",r),r):null}remove(e){const t=this.#t.findIndex(o=>o.id===e);if(t===-1)return!1;const[r]=this.#t.splice(t,1);return this.#o(o=>o.delete(r.id)),this.#s("remove",r),!0}clear(){this.#t=[],this.#o(e=>e.clear()),this.#s("clear",null)}toJSON(e=2){return JSON.stringify({version:1,exportedAt:new Date().toISOString(),entries:this.#t},null,e)}import(e){const t=typeof e=="string"?JSON.parse(e):e,r=Array.isArray(t)?t:t?.entries;if(!Array.isArray(r))throw new TypeError("Analytics: import expects an entries array");for(const o of r){const i={...o,id:o.id??J()};this.#t.push(i),this.#o(s=>s.put(i))}return this.#s("import",null),r.length}async replay(e,t){const r=this.#t.find(i=>i.id===e);if(!r)throw new Error(`Analytics: no captured call ${e}`);const o=globalThis.navigator?.modelContext;if(!o?.callTool)throw new Error("Analytics: navigator.modelContext.callTool is unavailable");return o.callTool(r.tool,t??r.params??{})}pushToDataLayer(e){const t=this.#t.find(o=>o.id===e);return t?((globalThis.window.dataLayer||=[]).push({event:"webmcp_tool_call",webmcp_tool:t.tool,webmcp_status:t.status,webmcp_duration_ms:t.durationMs,webmcp_params:t.params,webmcp_error:t.error??void 0}),this.update(e,{pushedToDataLayer:!0}),!0):!1}#s(e,t){const r={reason:e,entry:t,entries:this.entries};for(const o of this.#e)try{o({type:"change",detail:r})}catch{}try{globalThis.window?.dispatchEvent?.(new CustomEvent(M,{detail:{reason:e,entry:t}}))}catch{}}#o(e){this.persistent&&this.#a(e).catch(()=>{})}async#a(e){const t=[];e({put:r=>t.push(["put",r]),delete:r=>t.push(["delete",r]),clear:()=>t.push(["clear"])});for(const[r,o]of t)await this.#i[r](o)}async#l(){if(this.persistent)try{const e=await this.#i.all();if(!Array.isArray(e)||e.length===0)return;const t=new Set(this.#t.map(o=>o.id)),r=[...e.filter(o=>!t.has(o.id)),...this.#t];this.#t=r.slice(-this.#r),this.#s("restore",null)}catch{}}}const V=new ne;function U(n,e){if(!n||typeof n!="object"||typeof n.execute!="function"||n.execute.__machviveWrapped)return n;const t=n.execute,r=async function(o,i){const s=new Date().toISOString(),l=Date.now(),a=c=>{try{e.add(c)}catch{}};try{const c=await t.call(this,o,i);return a({tool:n.name,params:C(o),result:C(c),status:"ok",startedAt:s,durationMs:Date.now()-l}),c}catch(c){throw a({tool:n.name,params:C(o),error:String(c?.message??c),status:"error",startedAt:s,durationMs:Date.now()-l}),c}};return r.__machviveWrapped=!0,{...n,execute:r}}let W=!1;function ie(n=V){const e=globalThis.navigator?.modelContext;if(!e||W)return!1;e.tools?.length&&console.warn(`WebMCP analytics: ${e.tools.length} tool(s) were registered before analytics loaded and will not be captured. Import the analytics module earlier.`);const t=e.registerTool.bind(e);if(e.registerTool=r=>t(U(r,n)),typeof e.provideContext=="function"){const r=e.provideContext.bind(e);e.provideContext=(o={})=>r({...o,tools:(o.tools??[]).map(i=>U(i,n))})}return W=!0,!0}const se=`
  ${_}

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
`;class ae extends HTMLElement{#e=V;#t=null;#r=()=>this.#i();static get observedAttributes(){return["datalayer","theme"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`<style>${se}</style><div id="root"></div>`,this.#e.addEventListener("change",this.#r),globalThis.window.addEventListener(M,this.#n),this.#i(),this.#e.ready?.then(()=>this.isConnected&&this.#i())}disconnectedCallback(){this.#e.removeEventListener("change",this.#r),globalThis.window.removeEventListener(M,this.#n)}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get log(){return this.#e}#n=e=>{this.hasAttribute("datalayer")&&(e.detail?.reason!=="add"||!e.detail.entry||this.#e.pushToDataLayer(e.detail.entry.id))};#i(){const e=this.shadowRoot?.getElementById("root");if(!e)return;const t=this.#e.entries.slice().reverse();e.innerHTML=`
      <div class="bar">
        <span class="count">${t.length} call${t.length===1?"":"s"}</span>
        <button data-act="export">Export</button>
        <button data-act="copy">Copy JSON</button>
        <button data-act="clear" class="danger">Clear</button>
      </div>
      ${t.length===0?'<div class="empty">No WebMCP calls captured yet.</div>':`<ol>${t.map(r=>this.#s(r)).join("")}</ol>`}
    `,e.querySelector(".bar").addEventListener("click",r=>this.#l(r)),e.querySelectorAll("li").forEach(r=>this.#o(r))}#s(e){const t=this.#t===e.id;return`
      <li data-id="${e.id}">
        <div class="row">
          <span class="tool">${$(e.tool??"(unknown)")}</span>
          <span class="status ${e.status}">${e.status}</span>
          <span class="ms">${e.durationMs??0}ms</span>
        </div>
        ${t?`<div class="detail">
                 <label>Params (editable — used on replay)</label>
                 <textarea rows="3" data-role="params">${$(JSON.stringify(e.params??{},null,2))}</textarea>
                 <label>${e.status==="error"?"Error":"Result"}</label>
                 <pre class="${e.status==="error"?"err":""}">${$(e.status==="error"?e.error??"":JSON.stringify(e.result??null,null,2))}</pre>
                 <div class="bar" style="margin-top:8px">
                   <button data-act="save">Save params</button>
                   <button data-act="replay">Replay</button>
                   <button data-act="push">Push to dataLayer</button>
                   <button data-act="remove" class="danger">Delete</button>
                 </div>
               </div>`:""}
      </li>
    `}#o(e){const t=e.dataset.id;e.querySelector(".row").addEventListener("click",()=>{this.#t=this.#t===t?null:t,this.#i()}),e.querySelectorAll("button[data-act]").forEach(r=>{r.addEventListener("click",o=>{o.stopPropagation(),this.#a(r.dataset.act,t,e)})})}async#a(e,t,r){const o=()=>{const i=r.querySelector('[data-role="params"]')?.value??"{}";try{return JSON.parse(i)}catch{return globalThis.window.alert("Params must be valid JSON."),null}};if(e==="save"){const i=o();i&&this.#e.update(t,{params:i})}else if(e==="replay"){const i=o();i&&await this.#e.replay(t,i)}else e==="push"?this.#e.pushToDataLayer(t):e==="remove"&&(this.#t===t&&(this.#t=null),this.#e.remove(t))}#l(e){const t=e.target.dataset?.act;t==="clear"?(this.#t=null,this.#e.clear()):t==="copy"?globalThis.navigator.clipboard?.writeText(this.#e.toJSON()):t==="export"&&this.#c()}#c(){const e=new Blob([this.#e.toJSON()],{type:"application/json"}),t=URL.createObjectURL(e),r=document.createElement("a");r.href=t,r.download=`webmcp-analytics-${Date.now()}.json`,r.click(),URL.revokeObjectURL(t)}}function $(n){return String(n).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}ie();customElements.get("machvive-webmcp-analytics")||customElements.define("machvive-webmcp-analytics",ae);function le(n,e={}){if(n.type==="checkbox")return n.checked;const t=n.value;if(t!==""){if(e.type==="number"||e.type==="integer"){const r=Number(t);if(Number.isNaN(r))throw new TypeError(`"${t}" is not a number`);return e.type==="integer"?Math.trunc(r):r}if(e.type==="object"||e.type==="array")try{return JSON.parse(t)}catch{throw new TypeError("must be valid JSON")}return t}}const ce=`
  ${_}

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
`;class de extends HTMLElement{#e=null;#t=null;#r=()=>this.#o();static get observedAttributes(){return["floating","open","theme","position"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`<style>${ce}</style><div id="root"></div>`,globalThis.window.addEventListener(O,this.#r),this.getAttribute("hotkey")&&globalThis.window.addEventListener("keydown",this.#n),this.#o()}disconnectedCallback(){globalThis.window.removeEventListener(O,this.#r),globalThis.window.removeEventListener("keydown",this.#n)}#n=e=>{const t=(this.getAttribute("hotkey")||"").toLowerCase().split("+").map(i=>i.trim()),r=t.at(-1);if(!r)return;const o=i=>t.includes(i);e.key.toLowerCase()!==r||e.ctrlKey!==o("ctrl")||e.shiftKey!==o("shift")||e.altKey!==o("alt")||e.metaKey!==(o("meta")||o("cmd"))||(e.preventDefault(),this.hasAttribute("open")?this.hide():this.show())};attributeChangedCallback(){this.shadowRoot?.getElementById("root")&&this.#o()}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}get#i(){return globalThis.navigator?.modelContext??null}get#s(){return this.#i?.tools??[]}#o(){const e=this.shadowRoot?.getElementById("root");if(!e)return;const t=this.#i,r=!!(t&&Array.isArray(t.tools)&&typeof t.callTool=="function"),o=r?this.#s:[];this.#e&&!o.some(s=>s.name===this.#e)&&(this.#e=null),this.#e??=o[0]?.name??null;const i=o.find(s=>s.name===this.#e)??null;e.innerHTML=`
      <div class="panel">
        <header>WebMCP Inspector<button class="close" title="Close">&times;</button></header>
        ${r?o.length===0?'<div class="empty">No tools registered.</div>':`<div class="body">
                   <div class="tools">${o.map(s=>`<button data-tool="${p(s.name)}" aria-current="${s.name===this.#e}">${h(s.name)}</button>`).join("")}</div>
                   <div class="form">${this.#a(i)}</div>
                 </div>`:`<div class="empty">navigator.modelContext is unavailable here.<br>
                 <span class="hint">Needs a secure context, and tool discovery requires the machvive polyfill.</span></div>`}
      </div>
      <button class="fab" title="WebMCP Inspector">&#128295; WebMCP</button>
    `,this.#c(e)}#a(e){if(!e)return"";const t=e.inputSchema??{},r=t.properties??{},o=new Set(t.required??[]),i=Object.keys(r),s=i.length?i.map(l=>this.#l(l,r[l],o.has(l))).join(""):'<p class="hint">This tool takes no parameters.</p>';return`
      ${e.description?`<p class="desc">${h(e.description)}</p>`:""}
      <form>
        ${s}
        <button type="submit" class="run">Execute</button>
      </form>
      ${this.#t?`<pre class="${this.#t.isError?"error":""}">${h(this.#t.text)}</pre>`:""}
    `}#l(e,t={},r){const o=`<span class="name">${h(e)}</span>${r?' <span class="req" title="required">*</span>':""}${t.description?` <span class="hint">— ${h(t.description)}</span>`:""}`;let i;return Array.isArray(t.enum)?i=`<select data-field="${p(e)}">${r?"":'<option value=""></option>'}${t.enum.map(s=>`<option value="${p(s)}">${h(s)}</option>`).join("")}</select>`:t.type==="boolean"?i=`<input type="checkbox" data-field="${p(e)}">`:t.type==="object"||t.type==="array"?i=`<textarea rows="3" data-field="${p(e)}" placeholder="JSON"></textarea>`:i=`<input type="${t.type==="number"||t.type==="integer"?"number":"text"}"${t.type==="integer"?' step="1"':""} data-field="${p(e)}">`,`<label>${o}${i}<span class="field-error" data-error="${p(e)}"></span></label>`}#c(e){e.querySelector(".fab")?.addEventListener("click",()=>this.hasAttribute("open")?this.hide():this.show()),e.querySelector("header .close")?.addEventListener("click",()=>this.hide()),e.querySelectorAll("[data-tool]").forEach(t=>t.addEventListener("click",()=>{this.#e=t.dataset.tool,this.#t=null,this.#o()})),e.querySelector("form")?.addEventListener("submit",t=>{t.preventDefault(),this.#d(e)})}async#d(e){const t=this.#s.find(a=>a.name===this.#e);if(!t)return;const r=t.inputSchema?.properties??{},o=new Set(t.inputSchema?.required??[]),i={};let s=!1;e.querySelectorAll("[data-error]").forEach(a=>a.textContent="");for(const[a,c]of Object.entries(r)){const d=e.querySelector(`[data-field="${CSS.escape(a)}"]`);if(!d)continue;const m=e.querySelector(`[data-error="${CSS.escape(a)}"]`);try{const u=le(d,c);if(u===void 0){o.has(a)&&(m&&(m.textContent="required"),s=!0);continue}i[a]=u}catch(u){m&&(m.textContent=String(u.message??u)),s=!0}}if(s)return;const l=e.querySelector(".run");l&&(l.disabled=!0);try{const a=await this.#i.callTool(t.name,i),c=(a?.content??[]).map(d=>d?.text??JSON.stringify(d)).join(`
`);this.#t={text:c||JSON.stringify(a,null,2),isError:!!a?.isError}}catch(a){this.#t={text:String(a?.message??a),isError:!0}}finally{l&&(l.disabled=!1)}this.#o()}}function h(n){return String(n).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}const p=h;customElements.get("machvive-webmcp-inspect")||customElements.define("machvive-webmcp-inspect",de);const ue=`
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
`.trim().split(/\s+/),pe=`
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
`.trim().split(/\s+/),G=Object.freeze({latin:Object.freeze(ue),english:Object.freeze(pe)}),N=Object.freeze(Object.keys(G)),he=["lorem","ipsum","dolor","sit","amet"];function me(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const fe=n=>n.charAt(0).toUpperCase()+n.slice(1);function be({sentences:n=5,paragraphs:e=1,lang:t="latin",minWords:r=5,maxWords:o=14,seed:i,classicOpening:s}={}){const l=G[t];if(!l)throw new TypeError(`lang must be one of ${N.join(", ")}`);const a=i===void 0?Math.random:me(i),c=(v,S)=>v+Math.floor(a()*(S-v+1)),d=Math.max(1,Math.min(r,o)),m=Math.max(d,o),u=s??t==="latin",I=[];let P=!0;for(let v=0;v<Math.max(1,e);v++){const S=n===-1?c(1,5):Math.max(1,n),D=[];for(let z=0;z<S;z++){const E=c(d,m),T=new Set,f=[];if(P&&u)for(const y of he.slice(0,E))f.push(y),T.add(y);for(let y=0;f.length<E&&y<E*8;y++){const A=l[Math.floor(a()*l.length)];T.has(A)||(T.add(A),f.push(A))}f[0]=fe(f[0]),D.push(`${f.join(" ")}.`),P=!1}I.push(D.join(" "))}return I.join(`

`)}const q="generate_placeholder_text";let w=null;class j extends HTMLElement{#e="";static get observedAttributes(){return["lang","sentences","paragraphs","seed","theme","no-tool"]}constructor(){super(),this.attachShadow({mode:"open"})}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get lang(){const e=this.getAttribute("lang");return N.includes(e)?e:"latin"}set lang(e){this.setAttribute("lang",e)}get sentences(){const e=Number(this.getAttribute("sentences"));return Number.isFinite(e)&&e!==0?e:5}set sentences(e){this.setAttribute("sentences",String(e))}get paragraphs(){const e=Number(this.getAttribute("paragraphs"));return Number.isFinite(e)&&e>0?e:1}set paragraphs(e){this.setAttribute("paragraphs",String(e))}get seed(){const e=Number(this.getAttribute("seed"));return this.hasAttribute("seed")&&Number.isFinite(e)?e:void 0}set seed(e){e==null?this.removeAttribute("seed"):this.setAttribute("seed",String(e))}get text(){return this.#e}connectedCallback(){this.shadowRoot.innerHTML=`
      <style>
${_}
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
    `,this.#t(),this.#r()}disconnectedCallback(){this.#n()}attributeChangedCallback(e){if(this.shadowRoot?.childElementCount&&e!=="theme"){if(e==="no-tool"){this.hasAttribute("no-tool")?this.#n():this.#r();return}this.#t()}}regenerate(){return this.#t(),this.#e}#t(){const e=this.shadowRoot.querySelector("slot");e&&(this.#e=be({sentences:this.sentences,paragraphs:this.paragraphs,lang:this.lang,seed:this.seed}),e.replaceChildren(...this.#e.split(`

`).map(t=>{const r=document.createElement("p");return r.textContent=t,r})))}publishTool(){return w=null,this.#r(),this}withdrawTool(){return this.#n(),this}#r(){if(this.hasAttribute("no-tool"))return;const e=globalThis.navigator?.modelContext;if(!e)return;const t=e.tools?.some(r=>r.name===q);w&&t||(w=this,e.registerTool({name:q,description:"Generate placeholder copy and show it on the page. Latin reads as classic lorem ipsum; English is business-speak, which is better for judging whether a layout survives the text it will really hold.",inputSchema:{type:"object",properties:{lang:{type:"string",enum:[...N],description:"Vocabulary to draw from"},sentences:{type:"integer",description:"Sentences per paragraph. -1 picks 1-5 at random"},paragraphs:{type:"integer",description:"How many paragraphs"},seed:{type:"integer",description:"Omit for fresh copy; set for repeatable output"}}},execute:async(r={})=>{for(const i of["lang","sentences","paragraphs","seed"])r[i]!==void 0&&r[i]!==""&&(this[i]=r[i]);return{content:[{type:"text",text:this.regenerate()}]}}}))}#n(){if(w===this){globalThis.navigator?.modelContext?.unregisterTool(q),w=null;for(const e of globalThis.document?.querySelectorAll?.("machvive-lorum-ipsum")??[])if(e!==this&&e.isConnected&&e instanceof j){e.#r();break}}}}customElements.get("machvive-lorum-ipsum")||customElements.define("machvive-lorum-ipsum",j);const b=n=>new Promise(e=>setTimeout(e,n)),L={"M5T-001":{name:"Mach Five Tee",price:28},"M5T-002":{name:"Chicago Hoodie",price:64},"M5T-003":{name:"Vive Cap",price:22}},k=[],ge=[{name:"search_products",description:"Find products by keyword",inputSchema:{type:"object",properties:{query:{type:"string",description:"Search term"},limit:{type:"integer",description:"Max results"}},required:["query"]},execute:async({query:n,limit:e=10})=>{await b(40);const t=Object.entries(L).filter(([r,o])=>`${r} ${o.name}`.toLowerCase().includes(String(n).toLowerCase())).slice(0,e).map(([r,o])=>`${r} — ${o.name} ($${o.price})`);return t.length?t.join(`
`):`No products match "${n}".`}},{name:"add_to_cart",description:"Add a product to the shopping cart",inputSchema:{type:"object",properties:{sku:{type:"string",description:"Product SKU"},qty:{type:"integer",description:"How many"},gift:{type:"boolean",description:"Gift wrap it"},size:{type:"string",enum:["S","M","L","XL"]}},required:["sku"]},execute:async({sku:n,qty:e=1,gift:t=!1,size:r})=>{await b(30);const o=L[n];if(!o)throw new Error(`Unknown SKU: ${n}`);return k.push({sku:n,qty:e,gift:t,size:r}),`Added ${e} × ${o.name}${r?` (${r})`:""}${t?", gift wrapped":""}.`}},{name:"view_cart",description:"Show what is currently in the cart",inputSchema:{type:"object",properties:{}},execute:async()=>{if(await b(15),!k.length)return"Cart is empty.";const n=k.reduce((e,t)=>e+L[t.sku].price*t.qty,0);return`${k.length} line(s), total $${n}`}},{name:"apply_coupon",description:"Apply a discount code (try INVALID to see an error captured)",inputSchema:{type:"object",properties:{code:{type:"string",description:"Coupon code"}},required:["code"]},execute:async({code:n})=>{if(await b(25),n!=="MACHFIVE")throw new Error(`Coupon "${n}" is not valid.`);return"Coupon applied: 15% off."}},{name:"update_preferences",description:"Save shopper preferences (object field — enter JSON)",inputSchema:{type:"object",properties:{prefs:{type:"object",description:'e.g. {"newsletter":true,"currency":"USD"}'}},required:["prefs"]},execute:async({prefs:n})=>(await b(20),`Saved ${Object.keys(n??{}).length} preference(s).`)}];navigator.modelContext.provideContext({tools:ge});document.querySelector("machvive-lorum-ipsum")?.publishTool();const F=document.getElementById("status"),g=n=>{F.textContent=n,clearTimeout(g.t),g.t=setTimeout(()=>F.textContent="",4e3)};document.getElementById("simulate").addEventListener("click",async n=>{n.target.disabled=!0,g("Simulating agent traffic…");const e=[["search_products",{query:"tee",limit:5}],["add_to_cart",{sku:"M5T-001",qty:2,size:"L",gift:!0}],["add_to_cart",{sku:"M5T-003",qty:1}],["apply_coupon",{code:"INVALID"}],["apply_coupon",{code:"MACHFIVE"}],["update_preferences",{prefs:{newsletter:!0,currency:"USD"}}],["view_cart",{}]];for(const[t,r]of e)await navigator.modelContext.callTool(t,r),await b(120);g(`Done — ${e.length} calls captured.`),n.target.disabled=!1});document.getElementById("register-late").addEventListener("click",()=>{const n=Math.floor(Math.random()*900+100);navigator.modelContext.registerTool({name:`track_order_${n}`,description:"Registered after page load",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},execute:({id:e})=>`Order ${e} is in transit.`}),g(`Registered track_order_${n} — inspector updated live.`)});document.getElementById("unregister").addEventListener("click",()=>{g(navigator.modelContext.unregisterTool("search_products")?"Removed search_products.":"search_products was not registered.")});globalThis.mcp=navigator.modelContext;
