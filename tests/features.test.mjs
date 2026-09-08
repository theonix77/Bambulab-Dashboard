import fs from "node:fs";
import assert from "node:assert/strict";
const code=fs.readFileSync(new URL("../Bambulab-Dashboard.js", import.meta.url),"utf8");
assert.match(code,/const VERSION = "1\.8\.3"/);
assert.match(code,/_isInCardPicker/);
assert.match(code,/preview: true/);
assert.match(code,/data-open-printer=/);
assert.doesNotMatch(code,/<ha-entity-picker/);
assert.match(code,/measurementOptionHtml/);
assert.match(code,/data-spool-entity/);
assert.match(code,/hass-more-info/);
assert.match(code,/target_nozzle_temperature/);
assert.match(code,/data-fan-entity/);
assert.match(code,/printing_speed/);
assert.match(code,/data-theme/);
assert.match(code,/theme-light/);
assert.match(code,/object-fit:contain/);
assert.match(code,/_captureScrollState/);
assert.match(code,/_renderCurrentPrint/);
assert.match(code,/total_usage_hours/);
assert.doesNotMatch(code,/image_url/);
assert.doesNotMatch(code,/"A2L"\s*:\s*"A1\.png"/);
console.log("feature/static tests: ok");

assert.match(code,/_openEditorDetails/);
assert.match(code,/Object\.values\(this\._hass\?\.entities/);
assert.match(code,/data-close-spool-inline/);
assert.match(code,/total_usage_entity/);

assert.match(code,/smart_plug_entity/);
assert.match(code,/camera_proxy_stream/);
assert.match(code,/_officialMaintenanceTasks/);
assert.match(code,/_activeFilament/);
assert.match(code,/data-number-set/);

assert.match(code,/_findExactEntity/);
assert.match(code,/hybrid_mode_blocks_control/);
assert.match(code,/Developer LAN Mode/);
assert.match(code,/data-maint-source/);
assert.match(code,/_renderMaintenanceModal/);

assert.match(code,/_mobileTouchActive/);
assert.match(code,/spool-modal-backdrop/);
assert.match(code,/data-close-spool-backdrop/);
assert.match(code,/touch-action:pan-x/);

assert.match(code,/Nächste Wartungen/);
assert.match(code,/_maintenanceTiming/);
assert.match(code,/durchschnittlich mehr als 8 Druckstunden pro Tag/);
assert.match(code,/alwaysVisible:true/);
assert.doesNotMatch(code,/!last\|\|now-last>=t\.days/);

assert.match(code,/I18N_EN/);
assert.match(code,/applyUiTranslations/);
assert.match(code,/data-maint-log-filter/);
assert.match(code,/data-maint-log-page/);
assert.match(code,/data-maint-log-delete/);
assert.match(code,/data-maint-log-clear/);
assert.match(code,/maintenance-summary/);

// v1.8.3: maintenance must be selected by the detected model, never globally from X2D.
for (const model of ["A1","A1MINI","A2L","P1P","P1S","P2S","H2C","H2D","H2DPRO","H2S","X1","X1C","X1E","X2D"]) {
  assert.ok(code.includes(`\"${model}\"`), `maintenance/model support missing: ${model}`);
}
assert.match(code,/_maintenanceProfile\(printer\)/);
assert.match(code,/model===\"X2D\"/);
assert.match(code,/key:\"GENERIC\"/);
assert.match(code,/kein erfundenes Kalenderintervall/);
