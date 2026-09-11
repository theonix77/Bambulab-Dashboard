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
 {entity_id:"sensor.p_end",unique_id:"S_end_time",translation_key:"end_time",platform:"bambu_lab"},
],childDevices:[]};
card._config={printers:[{device_id:'p',secondary_light_entity:'light.p_extra',idle_shutdown_entity:'input_boolean.idle_shutdown'}]}; card._printers=[printer]; card._selectedPrinterId='p'; card._devices=[]; card._entities=[];
card._hass={themes:{darkMode:true},entities:{
 'select.p_speed':{entity_id:'select.p_speed',device_id:'p',translation_key:'printing_speed',platform:'bambu_lab'},
 'button.p_pause':{entity_id:'button.p_pause',device_id:'p',translation_key:'pause',platform:'bambu_lab'},
 'light.p_extra':{entity_id:'light.p_extra',device_id:'p',translation_key:'extra_light',platform:'bambu_lab'},
 'input_boolean.idle_shutdown':{entity_id:'input_boolean.idle_shutdown',device_id:null,translation_key:'idle_shutdown',platform:'input_boolean'},
 'number.p_nozzle':{entity_id:'number.p_nozzle',device_id:'p',translation_key:'target_nozzle_temperature',platform:'bambu_lab'},
 'fan.p_cooling':{entity_id:'fan.p_cooling',device_id:'p',translation_key:'cooling_fan',platform:'bambu_lab'},
 'binary_sensor.p_hybrid':{entity_id:'binary_sensor.p_hybrid',device_id:'p',translation_key:'hybrid_mode_blocks_control',platform:'bambu_lab'},
 'sensor.p_active_tray':{entity_id:'sensor.p_active_tray',device_id:'p',translation_key:'active_tray',platform:'bambu_lab'},
},states:{
 'sensor.p_status':{entity_id:'sensor.p_status',state:'running',attributes:{}},
 'sensor.p_progress':{entity_id:'sensor.p_progress',state:'42',attributes:{unit_of_measurement:'%'}},
 'sensor.p_usage':{entity_id:'sensor.p_usage',state:'90',attributes:{unit_of_measurement:'min'}},
 'sensor.p_end':{entity_id:'sensor.p_end',state:'2026-09-09T20:30:00+02:00',attributes:{}},
 'select.p_speed':{entity_id:'select.p_speed',state:'Standard',attributes:{options:['Silent','Standard']}},
 'button.p_pause':{entity_id:'button.p_pause',state:'unknown',attributes:{}},
 'number.p_nozzle':{entity_id:'number.p_nozzle',state:'220',attributes:{min:0,max:320,step:1}},
 'fan.p_cooling':{entity_id:'fan.p_cooling',state:'on',attributes:{percentage:50}},
 'binary_sensor.p_hybrid':{entity_id:'binary_sensor.p_hybrid',state:'on',attributes:{}},
 'sensor.p_active_tray':{entity_id:'sensor.p_active_tray',state:'Bambu PETG',attributes:{name:'Bambu PETG',type:'PETG',color:'#112233',remain:66}},
 'light.p_extra':{entity_id:'light.p_extra',state:'on',attributes:{}},
 'input_boolean.idle_shutdown':{entity_id:'input_boolean.idle_shutdown',state:'on',attributes:{}},
}};
assert.equal(card._isPrinterActive(printer),true);
assert.equal(card._formatDurationState(card._hass.states['sensor.p_usage']),'1 h 30 min');
assert.equal(card._themeClass(),'theme-dark');
card._config.theme='light'; assert.equal(card._themeClass(),'theme-light');
assert.match(card._renderPrinterOverviewCard(printer),/42<span>%<\/span>/);
assert.match(card._renderPrinterOverviewCard(printer),/Endzeit/);
assert.match(card._renderPrinterOverviewCard(printer),/09\.09\.2026/);
const controls=card._renderControls(printer); assert.match(controls,/Pause/); assert.match(controls,/Düse Soll/); assert.match(controls,/Bauteillüfter/); assert.match(controls,/Druckgeschwindigkeit/); assert.match(controls,/Schreibzugriffe sind für diesen Drucker eingeschränkt/);
assert.match(controls,/>Licht 2<.*>EIN<\/strong>/); assert.match(controls,/light\.p_extra/); assert.match(controls,/mdi:lightbulb/); assert.match(controls,/control-state/);
card._hass.states['light.p_extra'].state='off';
const controlsOff=card._renderControls(printer); assert.match(controlsOff,/>Licht 2<.*>AUS<\/strong>/); assert.match(controlsOff,/mdi:lightbulb-off/);
assert.match(controls,/Leerlaufabschaltung EIN/); assert.match(controls,/mdi:timer/);
assert.match(card._renderActiveFilament(printer),/Bambu PETG/); assert.match(card._renderActiveFilament(printer),/66%/);
console.log('runtime tests: ok');
