import assert from "node:assert/strict";
import { buildPrinterModels, entitySuffixMatches } from "../bambu-dashboard-utils.js";

const devices = [
  { id: "printer", manufacturer: "Bambu Lab", model: "X-Series", name: "Werkstattdrucker", via_device_id: null, identifiers: [["bambu_lab", "SERIAL"]] },
  { id: "ams", manufacturer: "Bambu Lab", model: "AMS", name: "AMS", via_device_id: "printer", identifiers: [["bambu_lab", "AMS_SERIAL"]] },
];
const entities = [
  { entity_id: "sensor.p_bed", platform: "bambu_lab", device_id: "printer", unique_id: "SERIAL_bed_temp" },
  { entity_id: "sensor.p_nozzle", platform: "bambu_lab", device_id: "printer", unique_id: "SERIAL_nozzle_temp" },
  { entity_id: "sensor.p_progress", platform: "bambu_lab", device_id: "printer", unique_id: "SERIAL_print_progress" },
  { entity_id: "sensor.ams_tray", platform: "bambu_lab", device_id: "ams", unique_id: "SERIAL_AMS_AMS_SERIAL_tray_1" },
];

const printers = buildPrinterModels(devices, entities);
assert.equal(printers.length, 1);
assert.equal(printers[0].id, "printer");
assert.equal(printers[0].childEntries.length, 1);
assert.equal(entitySuffixMatches("SERIAL_target_bed_temp", "target_bed_temp"), true);
assert.equal(entitySuffixMatches("SERIAL_Speed", "Speed"), true);
console.log("Discovery tests OK");
