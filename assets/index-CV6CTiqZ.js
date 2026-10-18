(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();const G="toolchange";function fe(r){if(!r||typeof r!="object")throw new TypeError("WebMCP: tool descriptor must be an object");if(typeof r.name!="string"||r.name.length===0)throw new TypeError("WebMCP: tool.name must be a non-empty string");if(typeof r.description!="string"||r.description.length===0)throw new TypeError(`WebMCP: tool "${r.name}" must supply a description`);if(typeof r.execute!="function")throw new TypeError(`WebMCP: tool "${r.name}" must supply an execute() function`)}function ge(r){return{name:r.name,title:r.title,description:r.description,inputSchema:r.inputSchema,annotations:r.annotations,window:globalThis.window,origin:globalThis.location?.origin??globalThis.window?.location?.origin??""}}class de extends EventTarget{#e=new Map;registerTool(e,t={}){try{fe(e)}catch(i){return Promise.reject(i)}if(this.#e.has(e.name))return Promise.reject(new DOMException(`WebMCP: a tool named "${e.name}" is already registered`,"InvalidStateError"));const n=t.signal;return n?.aborted||(this.#e.set(e.name,e),n?.addEventListener("abort",()=>{this.#e.get(e.name)===e&&(this.#e.delete(e.name),this.#t())},{once:!0}),this.#t()),Promise.resolve()}getTools(){return Promise.resolve([...this.#e.values()].map(ge))}async executeTool(e,t={},n={}){const i=typeof e=="string"?e:e?.name,o=this.#e.get(i);if(!o)throw new DOMException(`WebMCP: no tool named "${i}"`,"NotFoundError");const s=new AbortController;n.signal?.addEventListener("abort",()=>s.abort(n.signal.reason),{once:!0}),this.dispatchEvent(new Event("toolactivated"));try{const c=await o.execute(t,{signal:s.signal});return typeof c=="string"?c:JSON.stringify(c??null)}catch(c){throw s.signal.aborted&&this.dispatchEvent(new Event("toolcancel")),c}}#t(){this.dispatchEvent(new Event(G))}}for(const r of["toolchange","toolactivated","toolcancel"]){const e=Symbol(`on${r}`);Object.defineProperty(de.prototype,`on${r}`,{configurable:!0,get(){return this[e]??null},set(t){this[e]&&this.removeEventListener(r,this[e]),this[e]=typeof t=="function"?t:null,this[e]&&this.addEventListener(r,this[e])}})}function pe({allowInsecureContext:r=!1}={}){const e=globalThis.document;return!e||e.modelContext&&typeof e.modelContext.registerTool=="function"?!1:!(globalThis.isSecureContext??globalThis.window?.isSecureContext)&&!r?(console.warn(`WebMCP: ${globalThis.location?.origin??"this page"} is not a secure context, so document.modelContext was not installed. A secure origin, localhost or 127.0.0.1 qualifies; a LAN address or custom hostname does not. For an offline or intranet bundle, opt in with <machvive-webmcp-polyfill allow-insecure> or installWebmcpPolyfill({ allowInsecureContext: true }).`),!1):(Object.defineProperty(e,"modelContext",{value:new de,configurable:!0,enumerable:!1,writable:!1}),!0)}class be extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){pe({allowInsecureContext:this.hasAttribute("allow-insecure")}),this.shadowRoot.innerHTML="<style>:host { display: none; }</style>"}registerTool(e,t){return globalThis.document?.modelContext?.registerTool(e,t)}getTools(){return globalThis.document?.modelContext?.getTools()}}pe();customElements.get("machvive-webmcp-polyfill")||customElements.define("machvive-webmcp-polyfill",be);const ne=`
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
`,ie=`
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
`,P=`
  :host {
    color-scheme: light dark;
${ne}  }

  @media (prefers-color-scheme: dark) {
    :host(:not([theme="light"])) {
${ie}    }
  }

  /* Explicit choice beats the OS preference, in both directions. */
  :host([theme="dark"]) {
${ie}  }

  :host([theme="light"]) {
    color-scheme: light;
${ne}  }
`,V="machvive-webmcp-call",ye="machvive-webmcp",M="calls",ve=1,we=500;class xe{#e=null;get available(){return!!globalThis.indexedDB}#t(){return this.available?(this.#e??=new Promise(e=>{let t;try{t=globalThis.indexedDB.open(ye,ve)}catch{return e(null)}t.onupgradeneeded=()=>{const n=t.result;n.objectStoreNames.contains(M)||n.createObjectStore(M,{keyPath:"id"})},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null),t.onblocked=()=>e(null)}),this.#e):Promise.resolve(null)}async#r(e,t){const n=await this.#t();return n?new Promise(i=>{let o;try{o=n.transaction(M,e)}catch{return i(null)}const s=t(o.objectStore(M));o.oncomplete=()=>i(s?s.result:null),o.onerror=()=>i(null),o.onabort=()=>i(null)}):null}all(){return this.#r("readonly",e=>e.getAll()).then(e=>e??[])}put(e){return this.#r("readwrite",t=>t.put(e))}delete(e){return this.#r("readwrite",t=>t.delete(e))}clear(){return this.#r("readwrite",e=>e.clear())}}let ke=0;const oe=()=>`call-${Date.now().toString(36)}-${(ke++).toString(36)}`;function D(r){if(r!==void 0)try{return JSON.parse(JSON.stringify(r))}catch{return String(r)}}class Se{#e=new Set;#t=[];#r;#o;#n=new xe;ready;constructor({limit:e=we,persist:t=!0}={}){this.#r=e,this.#o=t,this.ready=this.#c()}get persistent(){return this.#o&&this.#n.available}addEventListener(e,t){e==="change"&&typeof t=="function"&&this.#e.add(t)}removeEventListener(e,t){e==="change"&&this.#e.delete(t)}get entries(){return[...this.#t]}get size(){return this.#t.length}add(e){const t={id:oe(),...e};this.#t.push(t);let n=[];return this.#t.length>this.#r&&(n=this.#t.splice(0,this.#t.length-this.#r)),this.#s(i=>{i.put(t);for(const o of n)i.delete(o.id)}),this.#i("add",t),t}update(e,t){const n=this.#t.find(i=>i.id===e);return n?(Object.assign(n,t),this.#s(i=>i.put(n)),this.#i("update",n),n):null}remove(e){const t=this.#t.findIndex(i=>i.id===e);if(t===-1)return!1;const[n]=this.#t.splice(t,1);return this.#s(i=>i.delete(n.id)),this.#i("remove",n),!0}clear(){this.#t=[],this.#s(e=>e.clear()),this.#i("clear",null)}toJSON(e=2){return JSON.stringify({version:1,exportedAt:new Date().toISOString(),entries:this.#t},null,e)}import(e){const t=typeof e=="string"?JSON.parse(e):e,n=Array.isArray(t)?t:t?.entries;if(!Array.isArray(n))throw new TypeError("Analytics: import expects an entries array");for(const i of n){const o={...i,id:i.id??oe()};this.#t.push(o),this.#s(s=>s.put(o))}return this.#i("import",null),n.length}async replay(e,t){const n=this.#t.find(o=>o.id===e);if(!n)throw new Error(`Analytics: no captured call ${e}`);const i=globalThis.document?.modelContext;if(!i?.executeTool)throw new Error("Analytics: document.modelContext.executeTool is unavailable");return i.executeTool(n.tool,t??n.params??{})}pushToDataLayer(e){const t=this.#t.find(i=>i.id===e);return t?((globalThis.window.dataLayer||=[]).push({event:"webmcp_tool_call",webmcp_tool:t.tool,webmcp_status:t.status,webmcp_duration_ms:t.durationMs,webmcp_params:t.params,webmcp_error:t.error??void 0}),this.update(e,{pushedToDataLayer:!0}),!0):!1}#i(e,t){const n={reason:e,entry:t,entries:this.entries};for(const i of this.#e)try{i({type:"change",detail:n})}catch{}try{globalThis.window?.dispatchEvent?.(new CustomEvent(V,{detail:{reason:e,entry:t}}))}catch{}}#s(e){this.persistent&&this.#a(e).catch(()=>{})}async#a(e){const t=[];e({put:n=>t.push(["put",n]),delete:n=>t.push(["delete",n]),clear:()=>t.push(["clear"])});for(const[n,i]of t)await this.#n[n](i)}async#c(){if(this.persistent)try{const e=await this.#n.all();if(!Array.isArray(e)||e.length===0)return;const t=new Set(this.#t.map(i=>i.id)),n=[...e.filter(i=>!t.has(i.id)),...this.#t];this.#t=n.slice(-this.#r),this.#i("restore",null)}catch{}}}const he=new Se;function Te(r,e){if(!r||typeof r!="object"||typeof r.execute!="function"||r.execute.__machviveWrapped)return r;const t=r.execute,n=async function(i,o){const s=new Date().toISOString(),c=Date.now(),a=l=>{try{e.add(l)}catch{}};try{const l=await t.call(this,i,o);return a({tool:r.name,params:D(i),result:D(l),status:"ok",startedAt:s,durationMs:Date.now()-c}),l}catch(l){throw a({tool:r.name,params:D(i),error:String(l?.message??l),status:"error",startedAt:s,durationMs:Date.now()-c}),l}};return n.__machviveWrapped=!0,{...r,execute:n}}let se=!1;function Ee(r=he){const e=globalThis.document?.modelContext;if(!e||se)return!1;Promise.resolve().then(()=>e.getTools?.()).then(n=>{n?.length&&console.warn(`WebMCP analytics: ${n.length} tool(s) were registered before analytics loaded and will not be captured. Import the analytics module earlier.`)}).catch(()=>{});const t=e.registerTool.bind(e);try{e.registerTool=(n,i)=>t(Te(n,r),i)}catch(n){return console.warn(`WebMCP analytics: this implementation does not allow wrapping registerTool, so tool calls will not be captured (${n.message}).`),!1}return se=!0,!0}const Ce=`
  ${P}

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
`;class Ae extends HTMLElement{#e=he;#t=null;#r=()=>this.#n();static get observedAttributes(){return["datalayer","theme"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`<style>${Ce}</style><div id="root"></div>`,this.#e.addEventListener("change",this.#r),globalThis.window.addEventListener(V,this.#o),this.#n(),this.#e.ready?.then(()=>this.isConnected&&this.#n())}disconnectedCallback(){this.#e.removeEventListener("change",this.#r),globalThis.window.removeEventListener(V,this.#o)}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get log(){return this.#e}#o=e=>{this.hasAttribute("datalayer")&&(e.detail?.reason!=="add"||!e.detail.entry||this.#e.pushToDataLayer(e.detail.entry.id))};#n(){const e=this.shadowRoot?.getElementById("root");if(!e)return;const t=this.#e.entries.slice().reverse();e.innerHTML=`
      <div class="bar">
        <span class="count">${t.length} call${t.length===1?"":"s"}</span>
        <button data-act="export">Export</button>
        <button data-act="copy">Copy JSON</button>
        <button data-act="clear" class="danger">Clear</button>
      </div>
      ${t.length===0?'<div class="empty">No WebMCP calls captured yet.</div>':`<ol>${t.map(n=>this.#i(n)).join("")}</ol>`}
    `,e.querySelector(".bar").addEventListener("click",n=>this.#c(n)),e.querySelectorAll("li").forEach(n=>this.#s(n))}#i(e){const t=this.#t===e.id;return`
      <li data-id="${e.id}">
        <div class="row">
          <span class="tool">${B(e.tool??"(unknown)")}</span>
          <span class="status ${e.status}">${e.status}</span>
          <span class="ms">${e.durationMs??0}ms</span>
        </div>
        ${t?`<div class="detail">
                 <label>Params (editable — used on replay)</label>
                 <textarea rows="3" data-role="params">${B(JSON.stringify(e.params??{},null,2))}</textarea>
                 <label>${e.status==="error"?"Error":"Result"}</label>
                 <pre class="${e.status==="error"?"err":""}">${B(e.status==="error"?e.error??"":JSON.stringify(e.result??null,null,2))}</pre>
                 <div class="bar" style="margin-top:8px">
                   <button data-act="save">Save params</button>
                   <button data-act="replay">Replay</button>
                   <button data-act="push">Push to dataLayer</button>
                   <button data-act="remove" class="danger">Delete</button>
                 </div>
               </div>`:""}
      </li>
    `}#s(e){const t=e.dataset.id;e.querySelector(".row").addEventListener("click",()=>{this.#t=this.#t===t?null:t,this.#n()}),e.querySelectorAll("button[data-act]").forEach(n=>{n.addEventListener("click",i=>{i.stopPropagation(),this.#a(n.dataset.act,t,e)})})}async#a(e,t,n){const i=()=>{const o=n.querySelector('[data-role="params"]')?.value??"{}";try{return JSON.parse(o)}catch{return globalThis.window.alert("Params must be valid JSON."),null}};if(e==="save"){const o=i();o&&this.#e.update(t,{params:o})}else if(e==="replay"){const o=i();o&&await this.#e.replay(t,o)}else e==="push"?this.#e.pushToDataLayer(t):e==="remove"&&(this.#t===t&&(this.#t=null),this.#e.remove(t))}#c(e){const t=e.target.dataset?.act;t==="clear"?(this.#t=null,this.#e.clear()):t==="copy"?globalThis.navigator.clipboard?.writeText(this.#e.toJSON()):t==="export"&&this.#l()}#l(){const e=new Blob([this.#e.toJSON()],{type:"application/json"}),t=URL.createObjectURL(e),n=document.createElement("a");n.href=t,n.download=`webmcp-analytics-${Date.now()}.json`,n.click(),URL.revokeObjectURL(t)}}function B(r){return String(r).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}Ee();customElements.get("machvive-webmcp-analytics")||customElements.define("machvive-webmcp-analytics",Ae);function $e(r,e={}){if(r.type==="checkbox")return r.checked;const t=r.value;if(t!==""){if(e.type==="number"||e.type==="integer"){const n=Number(t);if(Number.isNaN(n))throw new TypeError(`"${t}" is not a number`);return e.type==="integer"?Math.trunc(n):n}if(e.type==="object"||e.type==="array")try{return JSON.parse(t)}catch{throw new TypeError("must be valid JSON")}return t}}const Le=`
  ${P}

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
`;class Oe extends HTMLElement{#e=null;#t=null;#r=()=>this.#s();static get observedAttributes(){return["floating","open","theme","position"]}constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`<style>${Le}</style><div id="root"></div>`,this.#n?.addEventListener(G,this.#r),this.getAttribute("hotkey")&&globalThis.window.addEventListener("keydown",this.#o),this.#s()}disconnectedCallback(){this.#n?.removeEventListener(G,this.#r),globalThis.window.removeEventListener("keydown",this.#o)}#o=e=>{const t=(this.getAttribute("hotkey")||"").toLowerCase().split("+").map(o=>o.trim()),n=t.at(-1);if(!n)return;const i=o=>t.includes(o);e.key.toLowerCase()!==n||e.ctrlKey!==i("ctrl")||e.shiftKey!==i("shift")||e.altKey!==i("alt")||e.metaKey!==(i("meta")||i("cmd"))||(e.preventDefault(),this.hasAttribute("open")?this.hide():this.show())};attributeChangedCallback(){this.shadowRoot?.getElementById("root")&&this.#a()}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}get#n(){return globalThis.document?.modelContext??null}#i=[];async#s(){const e=this.#n;if(!e?.getTools){this.#i=[],this.#a();return}try{this.#i=await e.getTools()}catch{this.#i=[]}this.#a()}#a(){const e=this.shadowRoot?.getElementById("root");if(!e)return;const t=this.#n,n=!!(t&&typeof t.getTools=="function"&&typeof t.executeTool=="function"),i=n?this.#i:[];this.#e&&!i.some(s=>s.name===this.#e)&&(this.#e=null),this.#e??=i[0]?.name??null;const o=i.find(s=>s.name===this.#e)??null;e.innerHTML=`
      <div class="panel">
        <header>WebMCP Inspector<button class="close" title="Close">&times;</button></header>
        ${n?i.length===0?'<div class="empty">No tools registered.</div>':`<div class="body">
                   <div class="tools">${i.map(s=>`<button data-tool="${b(s.name)}" aria-current="${s.name===this.#e}">${v(s.name)}</button>`).join("")}</div>
                   <div class="form">${this.#c(o)}</div>
                 </div>`:`<div class="empty">document.modelContext is unavailable here.<br>
                 <span class="hint">Needs a secure context. Chrome and Edge ship it behind an origin trial; elsewhere the machvive polyfill provides it.</span></div>`}
      </div>
      <button class="fab" title="WebMCP Inspector">&#128295; WebMCP</button>
    `,this.#u(e)}#c(e){if(!e)return"";const t=e.inputSchema??{},n=t.properties??{},i=new Set(t.required??[]),o=Object.keys(n),s=o.length?o.map(c=>this.#l(c,n[c],i.has(c))).join(""):'<p class="hint">This tool takes no parameters.</p>';return`
      ${e.description?`<p class="desc">${v(e.description)}</p>`:""}
      <form>
        ${s}
        <button type="submit" class="run">Execute</button>
      </form>
      ${this.#t?`<pre class="${this.#t.isError?"error":""}">${v(this.#t.text)}</pre>`:""}
    `}#l(e,t={},n){const i=`<span class="name">${v(e)}</span>${n?' <span class="req" title="required">*</span>':""}${t.description?` <span class="hint">— ${v(t.description)}</span>`:""}`;let o;return Array.isArray(t.enum)?o=`<select data-field="${b(e)}">${n?"":'<option value=""></option>'}${t.enum.map(s=>`<option value="${b(s)}">${v(s)}</option>`).join("")}</select>`:t.type==="boolean"?o=`<input type="checkbox" data-field="${b(e)}">`:t.type==="object"||t.type==="array"?o=`<textarea rows="3" data-field="${b(e)}" placeholder="JSON"></textarea>`:o=`<input type="${t.type==="number"||t.type==="integer"?"number":"text"}"${t.type==="integer"?' step="1"':""} data-field="${b(e)}">`,`<label>${i}${o}<span class="field-error" data-error="${b(e)}"></span></label>`}#u(e){e.querySelector(".fab")?.addEventListener("click",()=>this.hasAttribute("open")?this.hide():this.show()),e.querySelector("header .close")?.addEventListener("click",()=>this.hide()),e.querySelectorAll("[data-tool]").forEach(t=>t.addEventListener("click",()=>{this.#e=t.dataset.tool,this.#t=null,this.#a()})),e.querySelector("form")?.addEventListener("submit",t=>{t.preventDefault(),this.#d(e)})}async#d(e){const t=this.#i.find(a=>a.name===this.#e);if(!t)return;const n=t.inputSchema?.properties??{},i=new Set(t.inputSchema?.required??[]),o={};let s=!1;e.querySelectorAll("[data-error]").forEach(a=>a.textContent="");for(const[a,l]of Object.entries(n)){const f=e.querySelector(`[data-field="${CSS.escape(a)}"]`);if(!f)continue;const p=e.querySelector(`[data-error="${CSS.escape(a)}"]`);try{const d=$e(f,l);if(d===void 0){i.has(a)&&(p&&(p.textContent="required"),s=!0);continue}o[a]=d}catch(d){p&&(p.textContent=String(d.message??d)),s=!0}}if(s)return;const c=e.querySelector(".run");c&&(c.disabled=!0);try{const a=await this.#n.executeTool(t,o);let l=String(a??"");try{l=JSON.stringify(JSON.parse(l),null,2)}catch{}this.#t={text:l,isError:!1}}catch(a){this.#t={text:String(a?.message??a),isError:!0}}finally{c&&(c.disabled=!1)}this.#a()}}function v(r){return String(r).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}const b=v;customElements.get("machvive-webmcp-inspect")||customElements.define("machvive-webmcp-inspect",Oe);const Me=`
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
`.trim().split(/\s+/),qe=`
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
`.trim().split(/\s+/),me=Object.freeze({latin:Object.freeze(Me),english:Object.freeze(qe)}),K=Object.freeze(Object.keys(me)),Ne=["lorem","ipsum","dolor","sit","amet"];function je(r){let e=r>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const Pe=r=>r.charAt(0).toUpperCase()+r.slice(1);function _e({sentences:r=5,paragraphs:e=1,lang:t="latin",minWords:n=5,maxWords:i=14,seed:o,classicOpening:s}={}){const c=me[t];if(!c)throw new TypeError(`lang must be one of ${K.join(", ")}`);const a=o===void 0?Math.random:je(o),l=(u,E)=>u+Math.floor(a()*(E-u+1)),f=Math.max(1,Math.min(n,i)),p=Math.max(f,i),d=s??t==="latin",L=[];let x=!0;for(let u=0;u<Math.max(1,e);u++){const E=r===-1?l(1,5):Math.max(1,r),O=[];for(let re=0;re<E;re++){const _=l(f,p),I=new Set,k=[];if(x&&d)for(const C of Ne.slice(0,_))k.push(C),I.add(C);for(let C=0;k.length<_&&C<_*8;C++){const R=c[Math.floor(a()*c.length)];I.has(R)||(I.add(R),k.push(R))}k[0]=Pe(k[0]),O.push(`${k.join(" ")}.`),x=!1}L.push(O.join(" "))}return L.join(`

`)}const ae="generate_placeholder_text";let g=null,h=null;class Q extends HTMLElement{#e="";static get observedAttributes(){return["lang","sentences","paragraphs","seed","theme","no-tool"]}constructor(){super(),this.attachShadow({mode:"open"})}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get lang(){const e=this.getAttribute("lang");return K.includes(e)?e:"latin"}set lang(e){this.setAttribute("lang",e)}get sentences(){const e=Number(this.getAttribute("sentences"));return Number.isFinite(e)&&e!==0?e:5}set sentences(e){this.setAttribute("sentences",String(e))}get paragraphs(){const e=Number(this.getAttribute("paragraphs"));return Number.isFinite(e)&&e>0?e:1}set paragraphs(e){this.setAttribute("paragraphs",String(e))}get seed(){const e=Number(this.getAttribute("seed"));return this.hasAttribute("seed")&&Number.isFinite(e)?e:void 0}set seed(e){e==null?this.removeAttribute("seed"):this.setAttribute("seed",String(e))}get text(){return this.#e}connectedCallback(){this.shadowRoot.innerHTML=`
      <style>
${P}
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
    `,this.#t(),this.#r()}disconnectedCallback(){this.#o()}attributeChangedCallback(e){if(this.shadowRoot?.childElementCount&&e!=="theme"){if(e==="no-tool"){this.hasAttribute("no-tool")?this.#o():this.#r();return}this.#t()}}regenerate(){return this.#t(),this.#e}#t(){const e=this.shadowRoot.querySelector("slot");e&&(this.#e=_e({sentences:this.sentences,paragraphs:this.paragraphs,lang:this.lang,seed:this.seed}),e.replaceChildren(...this.#e.split(`

`).map(t=>{const n=document.createElement("p");return n.textContent=t,n})))}publishTool(){return g!==this&&(h?.abort(),h=null,g=null),this.#r(),this}withdrawTool(){return this.#o(),this}#r(){if(this.hasAttribute("no-tool"))return;const e=globalThis.document?.modelContext;e&&(g?.isConnected&&h&&!h.signal.aborted||(h?.abort(),g=this,h=new AbortController,e.registerTool({name:ae,description:"Generate placeholder copy and show it on the page. Latin reads as classic lorem ipsum; English is business-speak, which is better for judging whether a layout survives the text it will really hold.",inputSchema:{type:"object",properties:{lang:{type:"string",enum:[...K],description:"Vocabulary to draw from"},sentences:{type:"integer",description:"Sentences per paragraph. -1 picks 1-5 at random"},paragraphs:{type:"integer",description:"How many paragraphs"},seed:{type:"integer",description:"Omit for fresh copy; set for repeatable output"}}},annotations:{readOnlyHint:!1},execute:async(t={})=>{for(const n of["lang","sentences","paragraphs","seed"])t[n]!==void 0&&t[n]!==""&&(this[n]=t[n]);return this.regenerate()}},{signal:h.signal}).catch(t=>{console.warn(`[machvive] could not register ${ae}:`,t.message),g===this&&(g=null,h=null)})))}#o(){if(g===this){h?.abort(),h=null,g=null;for(const e of globalThis.document?.querySelectorAll?.("machvive-lorum-ipsum")??[])if(e!==this&&e.isConnected&&e instanceof Q){e.#r();break}}}}customElements.get("machvive-lorum-ipsum")||customElements.define("machvive-lorum-ipsum",Q);function Z(r){const e=r?.["@type"];return e?(Array.isArray(e)?e:[e]).map(t=>String(t).split(/[/#]/).pop()):[]}const Ie=new Set(["Product","ProductModel","IndividualProduct","ProductGroup"]),Re=r=>Z(r).some(e=>Ie.has(e)),De=r=>Z(r).includes("ProductGroup"),Be=["name","brand","description","image","category","url","offers"],X=r=>typeof r=="string"?r.split(/[/#]/).pop():void 0;function T(r){if(typeof r=="number")return Number.isFinite(r)?r:null;if(typeof r!="string")return null;const e=r.replace(/[^0-9.-]/g,""),t=Number.parseFloat(e);return Number.isFinite(t)?t:null}function $(r){if(typeof r=="string")return r;if(Array.isArray(r))return $(r[0]);if(r&&typeof r=="object")return r.name??r["@id"]??void 0}function j(r){if(typeof r=="string")return r;if(Array.isArray(r))return j(r[0]);if(r&&typeof r=="object")return r.url??r.contentUrl??r["@id"]??void 0}function ze(r){if(!r)return{};const e=Array.isArray(r)?r:[r];for(const t of e){if(!t||typeof t!="object")continue;const n=Z(t).includes("AggregateOffer"),i=T(n?t.lowPrice??t.price:t.price);if(!(i===null&&!t.availability))return{price:i,priceCurrency:t.priceCurrency??t.priceSpecification?.priceCurrency,availability:X(t.availability),condition:X(t.itemCondition),seller:$(t.seller),offerUrl:j(t.url),priceRange:n?{low:T(t.lowPrice),high:T(t.highPrice),count:T(t.offerCount)}:void 0}}return{}}const He=r=>[].concat(r??[]).map(e=>X(typeof e=="string"?e:e?.["@id"])).filter(Boolean);function Fe(r){const e=Y(r),t=[].concat(r.hasVariant??[]).filter(a=>a&&typeof a=="object");if(!t.length)return e;const n={};for(const a of Be)r[a]!==void 0&&(n[a]=r[a]);const i=t.map(a=>Y({...n,...a})),o=i.map(a=>a.price).filter(a=>typeof a=="number"),s=i.map(a=>a.sku).filter(Boolean),c=i.map(a=>a.gtin).filter(Boolean);return{...e,price:e.price??(o.length?Math.min(...o):null),priceRange:e.priceRange??(o.length&&Math.min(...o)!==Math.max(...o)?{low:Math.min(...o),high:Math.max(...o),count:i.length}:e.priceRange),availability:e.availability??(i.some(a=>a.availability==="InStock")?"InStock":i.find(a=>a.availability)?.availability),variants:{count:i.length,variesBy:He(r.variesBy),inStock:i.filter(a=>a.availability==="InStock").length,skus:s.slice(0,50),gtins:c.slice(0,50)}}}function Y(r){const e=ze(r.offers),t=r.aggregateRating;return{name:r.name??$(r)??"",description:typeof r.description=="string"?r.description:void 0,sku:r.sku?String(r.sku):void 0,mpn:r.mpn?String(r.mpn):void 0,gtin:[r.gtin13,r.gtin14,r.gtin12,r.gtin8,r.gtin].find(n=>n!=null)?.toString(),brand:$(r.brand),category:$(r.category),url:j(r.url),image:j(r.image),price:e.price??null,currency:e.priceCurrency,availability:e.availability,condition:e.condition,seller:e.seller,priceRange:e.priceRange,rating:T(t?.ratingValue),reviewCount:T(t?.reviewCount),raw:r}}function ce(r){const e=[],t=new WeakSet,n=i=>{if(!(!i||typeof i!="object")&&!t.has(i)){if(t.add(i),Array.isArray(i)){for(const o of i)n(o);return}if(!i.isVariantOf){if(Re(i)){e.push(De(i)||i.hasVariant?Fe(i):Y(i));for(const[o,s]of Object.entries(i))o!=="hasVariant"&&s&&typeof s=="object"&&n(s);return}for(const o of Object.values(i))o&&typeof o=="object"&&n(o)}}};return n(r),Je(e)}function Je(r){const e=new Map;for(const i of r){const o=i.sku??i.gtin??i.url??i.name;if(!o)continue;const s=e.get(o);(!s||le(i)>le(s))&&e.set(o,i)}const t=[...e.values()],n=new Set(t.filter(i=>i.sku||i.gtin||i.url).map(i=>i.name).filter(Boolean));return t.filter(i=>i.sku||i.gtin||i.url||!n.has(i.name))}const le=r=>Object.values(r).filter(e=>e!=null).length;function Ue(r=globalThis.document){const e=r?.querySelectorAll?.('script[type="application/ld+json"]')??[],t=[];for(const n of e)try{t.push(JSON.parse(n.textContent))}catch(i){console.warn("[machvive] skipping malformed JSON-LD block:",i.message)}return t}function We(r){const e=n=>[...new Set(r.map(n).filter(Boolean))].sort(),t=r.map(n=>n.price).filter(n=>typeof n=="number");return{categories:e(n=>n.category),brands:e(n=>n.brand),availability:e(n=>n.availability),currencies:e(n=>n.currency),count:r.length,priceRange:t.length?{low:Math.min(...t),high:Math.max(...t)}:void 0}}const z=Object.freeze({SEARCH:"search_products",GET:"get_product",FACETS:"list_product_facets"});let A=null,y=null;const H=10,F=50,J=200,U=100,Ge=r=>({name:r.name,sku:r.sku,brand:r.brand,category:r.category,price:r.price,currency:r.currency,availability:r.availability,url:r.url,...r.variants?{variants:r.variants.count,variesBy:r.variants.variesBy}:{},...r.priceRange?{priceFrom:r.priceRange.low,priceTo:r.priceRange.high}:{}}),Ve=r=>[r.name,r.description,r.sku,r.mpn,r.gtin,r.brand,r.category].filter(Boolean).join(" ").toLowerCase();class ee extends HTMLElement{#e=[];static get observedAttributes(){return["src","theme","no-tool"]}constructor(){super(),this.attachShadow({mode:"open"})}get theme(){return this.getAttribute("theme")}set theme(e){e==null?this.removeAttribute("theme"):this.setAttribute("theme",e)}get src(){return this.getAttribute("src")}set src(e){e==null?this.removeAttribute("src"):this.setAttribute("src",e)}get products(){return[...this.#e]}get facets(){return We(this.#e)}async connectedCallback(){this.shadowRoot.innerHTML=`
      <style>
${P}
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
    `,await this.load()}disconnectedCallback(){this.#o()}attributeChangedCallback(e,t,n){if(!(!this.shadowRoot?.childElementCount||t===n)&&e!=="theme"){if(e==="no-tool"){this.hasAttribute("no-tool")?this.#o():this.#r();return}this.load()}}async load(){const e=this.src;try{this.#e=ce(e?await fetch(e,{credentials:"omit"}).then(t=>t.json()):Ue(this.ownerDocument??document)),this.#t()}catch(t){this.#e=[],this.#t(t)}return this.#r(),this.#e}#t(e){const t=this.shadowRoot?.querySelector("p");if(!t)return;if(e){t.className="muted",t.textContent=`Could not read product data: ${e.message}`;return}const n=this.#e.length;t.className=n?"count":"muted",t.textContent=n?`${n} product${n===1?"":"s"} exposed to agents`:"No product JSON-LD found on this page"}#r(){if(this.hasAttribute("no-tool"))return;const e=globalThis.document?.modelContext;if(!e||A?.isConnected&&A!==this&&y&&!y.signal.aborted)return;y?.abort(),y=new AbortController,A=this;const t=y.signal,n=s=>console.warn("[machvive] product tool registration failed:",s.message),i=this.facets,o=s=>s.length?{enum:s}:{};e.registerTool({name:z.SEARCH,description:"Search the products this page describes. Combine free text with filters. Returns a compact summary of each match, including a variant count where a product has options; use get_product for the full record.",inputSchema:{type:"object",properties:{query:{type:"string",maxLength:J,description:"Free text matched against name, description, SKU, brand and category"},category:{type:"string",description:"Exact category",...o(i.categories)},brand:{type:"string",description:"Exact brand",...o(i.brands)},availability:{type:"string",description:"Stock status",...o(i.availability)},maxPrice:{type:"number",minimum:0,description:"Only products at or below this price"},minPrice:{type:"number",minimum:0,description:"Only products at or above this price"},limit:{type:"integer",minimum:1,maximum:F,default:H,description:`Maximum results (default ${H}, max ${F})`},offset:{type:"integer",minimum:0,default:0,description:"Skip this many matches, for paging"}}},execute:async(s={})=>this.#n(s)},{signal:t}).catch(n),e.registerTool({name:z.GET,description:"Fetch one product in full by SKU, MPN or GTIN, including its original JSON-LD.",inputSchema:{type:"object",properties:{id:{type:"string",minLength:1,maxLength:U,description:"A SKU, MPN or GTIN"}},required:["id"]},execute:async({id:s}={})=>this.#i(s)},{signal:t}).catch(n),e.registerTool({name:z.FACETS,description:"List the categories, brands, stock states and price range present on this page. Call this before search_products to learn what the valid filter values are.",inputSchema:{type:"object",properties:{}},execute:async()=>this.facets},{signal:t}).catch(n)}#o(){if(A===this){y?.abort(),y=null,A=null;for(const e of globalThis.document?.querySelectorAll?.("machvive-webmcp-products")??[])if(e!==this&&e.isConnected&&e instanceof ee){e.#r();break}}}#n({query:e,category:t,brand:n,availability:i,maxPrice:o,minPrice:s,limit:c,offset:a}={}){if(typeof e=="string"&&e.length>J)throw new q(`query must be ${J} characters or fewer (received ${e.length})`);const l=typeof e=="string"?e.trim().toLowerCase():"",f=l?l.split(/\s+/):[],p=this.#e.filter(u=>{if(f.length){const E=Ve(u);if(!f.every(O=>E.includes(O)))return!1}return!(t&&u.category!==t||n&&u.brand!==n||i&&u.availability!==i||typeof o=="number"&&!(typeof u.price=="number"&&u.price<=o)||typeof s=="number"&&!(typeof u.price=="number"&&u.price>=s))}),d=Math.max(0,Number(a)||0),L=Math.min(F,Math.max(1,Number(c)||H)),x=p.slice(d,d+L);return{total:p.length,returned:x.length,offset:d,truncated:d+x.length<p.length,products:x.map(Ge)}}#i(e){const t=String(e??"").trim();if(!t)throw new q("id is required");if(t.length>U)throw new q(`id must be ${U} characters or fewer (received ${t.length})`);const n=t.toLowerCase(),i=a=>String(a).toLowerCase()===n,o=this.#e.find(a=>[a.sku,a.mpn,a.gtin].filter(Boolean).some(i)||(a.variants?.skus??[]).some(i)||(a.variants?.gtins??[]).some(i));if(!o)throw new q(`no product matches "${e}" (${this.#e.length} products on this page)`);const{raw:s,...c}=o;return{...c,jsonld:s}}}class q extends Error{}customElements.get("machvive-webmcp-products")||customElements.define("machvive-webmcp-products",ee);const S=r=>new Promise(e=>setTimeout(e,r)),W={"M5T-001":{name:"Mach Five Tee",price:28},"M5T-002":{name:"Chicago Hoodie",price:64},"M5T-003":{name:"Vive Cap",price:22}},N=[],Ke=[{name:"search_catalog",description:"Find products by keyword in this page's demo catalogue",inputSchema:{type:"object",properties:{query:{type:"string",description:"Search term"},limit:{type:"integer",description:"Max results"}},required:["query"]},execute:async({query:r,limit:e=10})=>{await S(40);const t=Object.entries(W).filter(([n,i])=>`${n} ${i.name}`.toLowerCase().includes(String(r).toLowerCase())).slice(0,e).map(([n,i])=>`${n} — ${i.name} ($${i.price})`);return t.length?t.join(`
`):`No products match "${r}".`}},{name:"add_to_cart",description:"Add a product to the shopping cart",inputSchema:{type:"object",properties:{sku:{type:"string",description:"Product SKU"},qty:{type:"integer",description:"How many"},gift:{type:"boolean",description:"Gift wrap it"},size:{type:"string",enum:["S","M","L","XL"]}},required:["sku"]},execute:async({sku:r,qty:e=1,gift:t=!1,size:n})=>{await S(30);const i=W[r];if(!i)throw new Error(`Unknown SKU: ${r}`);return N.push({sku:r,qty:e,gift:t,size:n}),`Added ${e} × ${i.name}${n?` (${n})`:""}${t?", gift wrapped":""}.`}},{name:"view_cart",description:"Show what is currently in the cart",inputSchema:{type:"object",properties:{}},execute:async()=>{if(await S(15),!N.length)return"Cart is empty.";const r=N.reduce((e,t)=>e+W[t.sku].price*t.qty,0);return`${N.length} line(s), total $${r}`}},{name:"apply_coupon",description:"Apply a discount code (try INVALID to see an error captured)",inputSchema:{type:"object",properties:{code:{type:"string",description:"Coupon code"}},required:["code"]},execute:async({code:r})=>{if(await S(25),r!=="MACHFIVE")throw new Error(`Coupon "${r}" is not valid.`);return"Coupon applied: 15% off."}},{name:"update_preferences",description:"Save shopper preferences (object field — enter JSON)",inputSchema:{type:"object",properties:{prefs:{type:"object",description:'e.g. {"newsletter":true,"currency":"USD"}'}},required:["prefs"]},execute:async({prefs:r})=>(await S(20),`Saved ${Object.keys(r??{}).length} preference(s).`)}],te=new AbortController;await Promise.all(Ke.map(r=>document.modelContext.registerTool(r,{signal:te.signal}).catch(e=>console.warn(`playground: ${r.name} did not register:`,e.message))));const ue=document.getElementById("status"),m=r=>{ue.textContent=r,clearTimeout(m.t),m.t=setTimeout(()=>ue.textContent="",4e3)};document.getElementById("simulate").addEventListener("click",async r=>{r.target.disabled=!0,m("Simulating agent traffic…");const e=[["search_catalog",{query:"tee",limit:5}],["add_to_cart",{sku:"M5T-001",qty:2,size:"L",gift:!0}],["add_to_cart",{sku:"M5T-003",qty:1}],["apply_coupon",{code:"INVALID"}],["apply_coupon",{code:"MACHFIVE"}],["update_preferences",{prefs:{newsletter:!0,currency:"USD"}}],["view_cart",{}]];for(const[t,n]of e){try{await document.modelContext.executeTool(t,n)}catch{}await S(120)}m(`Done — ${e.length} calls captured.`),r.target.disabled=!1});document.getElementById("register-late").addEventListener("click",()=>{const r=Math.floor(Math.random()*900+100);document.modelContext.registerTool({name:`track_order_${r}`,description:"Registered after page load",inputSchema:{type:"object",properties:{id:{type:"string"}},required:["id"]},annotations:{readOnlyHint:!0},execute:({id:e})=>`Order ${e} is in transit.`},{signal:te.signal}).then(()=>m(`Registered track_order_${r} — inspector updated live.`)).catch(e=>m(`Could not register: ${e.message}`))});document.getElementById("unregister").addEventListener("click",r=>{te.abort(),r.target.disabled=!0,m("Aborted the page signal — every tool registered with it is gone. The component tools remain.")});globalThis.mcp=document.modelContext;const w=document.querySelector("machvive-webmcp-products");await w.load();document.getElementById("products-remote").addEventListener("click",async()=>{w.src="./products.json",await w.load(),m(`Loaded ${w.products.length} products from products.json — re-open search_products to see the new filters`)});document.getElementById("products-page").addEventListener("click",async()=>{w.src=null,await w.load(),m(`Back to this page's own JSON-LD — ${w.products.length} products`)});
