import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const code = fs.readFileSync(new URL("../Bambulab-Dashboard.js", import.meta.url), "utf8");
const marker = "class BambuLabDashboard extends HTMLElement";
const prelude = code.slice(0, code.indexOf(marker));
const context = { console, Intl, URL };
vm.createContext(context);
vm.runInContext(`${prelude}\nthis.__test={buildPrinterModels,printerArtworkUrl,entitySuffixMatches,entryMatchesAlias,isBambuRegistryEntry};`, context);
const {buildPrinterModels, printerArtworkUrl, entitySuffixMatches, entryMatchesAlias, isBambuRegistryEntry}=context.__test;
const devices=[
 {id:"printer",manufacturer:"Bambu Lab",model:"P1S",name:"P1S",via_device_id:null,identifiers:[["bambu_lab","SERIAL"]]},
 {id:"ams",manufacturer:"Bambu Lab",model:"AMS",name:"AMS",via_device_id:"printer",identifiers:[["bambu_lab","AMS"]]},
 {id:"integration",manufacturer:"Bambu Lab",model:"Integration",name:"Bambu Lab",via_device_id:null,identifiers:[["bambu_lab","integration"]]},
 {id:"dashboard",manufacturer:"OpenAI",model:"Dashboard",name:"Bambu Lab Dashboard",via_device_id:null,identifiers:[]},
];
const entities=[
 {entity_id:"sensor.p1s_print_progress",platform:"bambu_lab",device_id:"printer",unique_id:"SERIAL_print_progress"},
 {entity_id:"sensor.p1s_bed_temp",platform:"bambu_lab",device_id:"printer",unique_id:"SERIAL_bed_temp"},
 {entity_id:"sensor.ams_tray_1",platform:"bambu_lab",device_id:"ams",unique_id:"SERIAL_AMS_X_tray_1"},
 {entity_id:"update.bambu_lab",platform:"bambu_lab",device_id:"integration",unique_id:"integration_firmware_update"},
 {entity_id:"update.bambu_lab_dashboard",platform:"hacs",device_id:"dashboard",unique_id:"bambu_lab_dashboard_update"},
];
const models=buildPrinterModels(devices,entities);
assert.equal(models.length,1);
assert.equal(models[0].id,"printer");
assert.equal(models[0].childEntries.length,1);
assert.equal(entitySuffixMatches("SERIAL_print_progress","print_progress"),true);
assert.equal(entryMatchesAlias({unique_id:"opaque",translation_key:"print_progress"},"print_progress"),true);
assert.equal(isBambuRegistryEntry({platform:"hacs",unique_id:"bambu_lab_dashboard_update"}),false);
assert.equal(printerArtworkUrl(devices[0]),"https://raw.githubusercontent.com/greghesp/ha-bambulab-cards/main/src/images/P1S.png");
assert.equal(printerArtworkUrl({...devices[0],model:"A1 Mini"}).endsWith("/A1Mini.png"),true);
console.log("discovery/model artwork tests: ok");
