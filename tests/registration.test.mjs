import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const code=fs.readFileSync(new URL("../Bambulab-Dashboard.js", import.meta.url),"utf8");
class HTMLElement { attachShadow(){ this.shadowRoot={innerHTML:"",querySelectorAll(){return[]},querySelector(){return null}}; return this.shadowRoot; } }
const registry=new Map();
const customElements={get:n=>registry.get(n),define:(n,c)=>registry.set(n,c)};
const context={console,Intl,URL,HTMLElement,customElements,window:{customCards:[]},document:{createElement:()=>({})},setInterval:()=>1,clearInterval:()=>{}};
vm.createContext(context);
vm.runInContext(code,context);
assert.ok(registry.has("bambu-lab-dashboard"));
assert.ok(registry.has("bambu-lab-dashboard-editor"));
assert.equal(context.window.customCards.some(c=>c.type==="bambu-lab-dashboard"),true);
console.log("custom element registration test: ok");
