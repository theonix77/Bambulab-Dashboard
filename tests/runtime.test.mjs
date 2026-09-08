import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const code=fs.readFileSync(new URL("../Bambulab-Dashboard.js", import.meta.url),"utf8");
class HTMLElement {
  attachShadow(){
    this.shadowRoot={innerHTML:"",querySelectorAll(){return[]},querySelector(){return null}};
    return this.shadowRoot;
  }
}
const registry=new Map();
const customElements={get:n=>registry.get(n),define:(n,c)=>registry.set(n,c)};
const context={console,Intl,URL,HTMLElement,customElements,window:{customCards:[]},document:{createElement:()=>({})},setInterval:()=>1,clearInterval:()=>{}};
vm.createContext(context);
vm.runInContext(code,context);
const Card=registry.get("bambu-lab-dashboard");
const card=new Card();

const a2l={id:"a2l",device:{model:"A2L",name:"A2L"},entries:[
  {entity_id:"sensor.a2l_status",unique_id:"A2L_print_status",translation_key:"print_status",platform:"bambu_lab"},
  {entity_id:"sensor.a2l_progress",unique_id:"A2L_print_progress",translation_key:"print_progress",platform:"bambu_lab"},
  {entity_id:"sensor.a2l_bed",unique_id:"A2L_bed_temp",translation_key:"bed_temp",platform:"bambu_lab"},
  {entity_id:"sensor.a2l_nozzle",unique_id:"A2L_nozzle_temp",translation_key:"nozzle_temp",platform:"bambu_lab"},
], childDevices:[]};
const x2d={id:"x2d",device:{model:"X2D",name:"X2D"},entries:[
  {entity_id:"sensor.x2d_status",unique_id:"X2D_print_status",translation_key:"print_status",platform:"bambu_lab"},
  {entity_id:"sensor.x2d_progress",unique_id:"X2D_print_progress",translation_key:"print_progress",platform:"bambu_lab"},
  {entity_id:"sensor.x2d_task",unique_id:"X2D_subtask_name",translation_key:"subtask_name",platform:"bambu_lab"},
  {entity_id:"sensor.x2d_bed",unique_id:"X2D_bed_temp",translation_key:"bed_temp",platform:"bambu_lab"},
  {entity_id:"sensor.x2d_nozzle",unique_id:"X2D_nozzle_temp",translation_key:"nozzle_temp",platform:"bambu_lab"},
], childDevices:[]};

card._config={printers:[
  {device_id:"a2l", image_url:"/local/bambu/a2l.png", status_entity:"sensor.custom_status", progress_entity:"sensor.custom_progress", order:1},
  {device_id:"x2d", order:2}
]};
card._hass={states:{
  "sensor.a2l_status":{entity_id:"sensor.a2l_status",state:"running",attributes:{}},
  "sensor.a2l_progress":{entity_id:"sensor.a2l_progress",state:"100",attributes:{unit_of_measurement:"%"}},
  "sensor.a2l_bed":{entity_id:"sensor.a2l_bed",state:"25",attributes:{unit_of_measurement:"°C"}},
  "sensor.a2l_nozzle":{entity_id:"sensor.a2l_nozzle",state:"25",attributes:{unit_of_measurement:"°C"}},
  "sensor.custom_status":{entity_id:"sensor.custom_status",state:"offline",attributes:{}},
  "sensor.custom_progress":{entity_id:"sensor.custom_progress",state:"100",attributes:{unit_of_measurement:"%"}},
  "sensor.x2d_status":{entity_id:"sensor.x2d_status",state:"running",attributes:{}},
  "sensor.x2d_progress":{entity_id:"sensor.x2d_progress",state:"42",attributes:{unit_of_measurement:"%"}},
  "sensor.x2d_task":{entity_id:"sensor.x2d_task",state:"Testauftrag",attributes:{}},
  "sensor.x2d_bed":{entity_id:"sensor.x2d_bed",state:"60",attributes:{unit_of_measurement:"°C"}},
  "sensor.x2d_nozzle":{entity_id:"sensor.x2d_nozzle",state:"220",attributes:{unit_of_measurement:"°C"}},
}};
card._printers=[a2l,x2d];
card._devices=[];
card._entities=[];

assert.equal(card._printerArtworkUrl(a2l),"/local/bambu/a2l.png");
assert.equal(card._val(a2l,"status"),"offline","manual status override must win");
assert.equal(card._num(a2l,"progress"),100,"manual progress override must win");
assert.equal(card._isPrinterOnline(a2l),false,"explicit offline status must win over stale sensor values");
assert.equal(card._isPrinterActive(a2l),false,"offline printer must not count as active even with stale 100% progress");
assert.equal(card._isPrinterActive(x2d),true);

const a2lHtml=card._renderPrinterOverviewCard(a2l);
assert.match(a2lHtml,/data-open-printer="a2l"/);
assert.match(a2lHtml,/Kein aktiver Druckauftrag/);
assert.doesNotMatch(a2lHtml,/>100<span>%<\/span>/,"offline overview must not show stale 100% as active progress");
assert.match(a2lHtml,/fleet-fallback/,"overview must have isolated image fallback");
const x2dHtml=card._renderPrinterOverviewCard(x2d);
assert.match(x2dHtml,/>42<span>%<\/span>/);
assert.match(x2dHtml,/Testauftrag/);

console.log("runtime override/offline/overview tests: ok");
