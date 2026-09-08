import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const code=fs.readFileSync(new URL("../Bambulab-Dashboard.js", import.meta.url),"utf8");
class HTMLElement { attachShadow(){ this.shadowRoot={innerHTML:"",querySelectorAll(){return[]},querySelector(){return null},appendChild(){}}; return this.shadowRoot; } dispatchEvent(){} }
const registry=new Map();
const customElements={get:n=>registry.get(n),define:(n,c)=>registry.set(n,c)};
const context={console,Intl,URL,HTMLElement,customElements,window:{customCards:[]},document:{createElement:()=>({}),scrollingElement:null},setInterval:()=>1,clearInterval:()=>{},requestAnimationFrame:(fn)=>fn(),getComputedStyle:()=>({overflowY:"visible"}),CustomEvent:class{}};
vm.createContext(context); vm.runInContext(code,context);
const Card=registry.get("bambu-lab-dashboard"); const card=new Card();
const printer={id:"p",device:{model:"P1S",name:"P1S"},entries:[
 {entity_id:"sensor.p_status",unique_id:"S_print_status",translation_key:"print_status",platform:"bambu_lab"},
 {entity_id:"sensor.p_progress",unique_id:"S_print_progress",translation_key:"print_progress",platform:"bambu_lab"},
 {entity_id:"sensor.p_usage",unique_id:"S_total_usage_hours",translation_key:"total_usage_hours",platform:"bambu_lab"},
 {entity_id:"select.p_speed",unique_id:"S_Speed",translation_key:"printing_speed",platform:"bambu_lab"},
 {entity_id:"button.p_pause",unique_id:"S_pause",translation_key:"pause",platform:"bambu_lab"},
],childDevices:[]};
card._config={}; card._printers=[printer]; card._selectedPrinterId='p'; card._devices=[]; card._entities=[];
card._hass={themes:{darkMode:true},states:{
 'sensor.p_status':{entity_id:'sensor.p_status',state:'running',attributes:{}},
 'sensor.p_progress':{entity_id:'sensor.p_progress',state:'42',attributes:{unit_of_measurement:'%'}},
 'sensor.p_usage':{entity_id:'sensor.p_usage',state:'90',attributes:{unit_of_measurement:'min'}},
 'select.p_speed':{entity_id:'select.p_speed',state:'Standard',attributes:{options:['Silent','Standard']}},
 'button.p_pause':{entity_id:'button.p_pause',state:'unknown',attributes:{}},
}};
assert.equal(card._isPrinterActive(printer),true);
assert.equal(card._formatDurationState(card._hass.states['sensor.p_usage']),'1 h 30 min');
assert.equal(card._themeClass(),'theme-dark');
card._config.theme='light'; assert.equal(card._themeClass(),'theme-light');
assert.match(card._renderPrinterOverviewCard(printer),/42<span>%<\/span>/);
assert.match(card._renderControls(printer),/Pause/);
console.log('runtime tests: ok');
