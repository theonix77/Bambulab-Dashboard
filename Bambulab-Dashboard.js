/* Bambu Lab Dashboard v1.8.1 | standalone HACS resource */

const VERSION = "1.8.1";
const DOMAIN = "bambu_lab";


// Printer artwork is provided by the existing greghesp/ha-bambulab-cards project,
// which is also the source of the cards bundled with the Bambu Lab integration.
// We reference the upstream PNGs rather than shipping copied artwork.
const PRINTER_ART_BASE = "https://raw.githubusercontent.com/greghesp/ha-bambulab-cards/main/src/images";
const OFFICIAL_MODEL_ART = Object.freeze({
  "A2L": "https://storage.ghost.io/c/8d/d9/8dd9f85b-21c3-4782-bba8-8778cd8f2f93/content/images/size/w1200/2026/05/BBL-A2L-00-hero.jpg"
});
const PRINTER_ART_FILES = Object.freeze({
  "A1": "A1.png",
  "A1 MINI": "A1Mini.png",
  "A1MINI": "A1Mini.png",
  "H2C": "H2C.png",
  "H2D": "H2D.png",
  "H2D PRO": "H2DPRO.png",
  "H2DPRO": "H2DPRO.png",
  "H2S": "H2S.png",
  "P1P": "P1P.png",
  "P1S": "P1S.png",
  "P2S": "P2S.png",
  "X1": "X1C.png",
  "X1 CARBON": "X1C.png",
  "X1C": "X1C.png",
  "X1E": "X1E.png",
  "X2D": "X2D.png"
});

function normalizedPrinterModel(device) {
  return String(device?.model || "").trim().toUpperCase().replace(/\s+/g, " ");
}

function printerArtworkUrl(device) {
  const model = normalizedPrinterModel(device);
  const compact = model.replace(/[\s_-]+/g, "");
  let filename = PRINTER_ART_FILES[model] || PRINTER_ART_FILES[compact] || null;
  if (!filename && /^X1/.test(model)) filename = "X1C.png";
  if (!filename && /^A1\s*MINI/.test(model)) filename = "A1Mini.png";
  if (filename) return `${PRINTER_ART_BASE}/${filename}`;
  return OFFICIAL_MODEL_ART[model] || OFFICIAL_MODEL_ART[compact] || null;
}

const ENTITY_KEYS = {
  progress: ["print_progress", "progress"],
  status: ["print_status", "gcode_state", "current_stage"],
  currentStage: ["current_stage"],
  currentLayer: ["current_layer"],
  totalLayers: ["total_layer_count", "total_layers"],
  remainingTime: ["remaining_time"],
  startTime: ["start_time"],
  endTime: ["end_time"],
  taskName: ["subtask_name", "task_name"],
  printWeight: ["print_weight"],
  printLength: ["print_length"],
  bedType: ["print_bed_type", "bed_type"],
  totalUsage: ["total_usage_hours"],
  nozzleTemp: ["nozzle_temp"],
  targetNozzleTemp: ["target_nozzle_temp"],
  leftNozzleTemp: ["left_nozzle_temp"],
  leftTargetNozzleTemp: ["left_target_nozzle_temp"],
  rightNozzleTemp: ["right_nozzle_temp"],
  rightTargetNozzleTemp: ["right_target_nozzle_temp"],
  bedTemp: ["bed_temp"],
  targetBedTemp: ["target_bed_temp"],
  chamberTemp: ["chamber_temp"],
  targetChamberTemp: ["target_chamber_temp"],
  coolingFan: ["cooling_fan_speed", "fan_speed"],
  auxFan: ["aux_fan_speed"],
  chamberFan: ["chamber_fan_speed"],
  wifi: ["wifi_signal"],
  online: ["online"],
  hms: ["hms"],
  printError: ["print_error"],
  doorOpen: ["door_open"],
  mqttMode: ["mqtt_mode"],
  timelapse: ["timelapse"],
  speed: ["printing_speed", "Speed", "speed", "speed_profile"],
  chamberLight: ["chamber_light", "camera_light", "light"],
  camera: ["camera"],
  coverImage: ["cover_image"],
  jobImage: ["cover_image", "pick_image"],
  pause: ["pause"],
  resume: ["resume"],
  stop: ["stop"],
  forceRefresh: ["refresh", "force_refresh"],
  targetNozzleControl: ["target_nozzle_temperature"],
  targetBedControl: ["target_bed_temperature"],
  targetChamberControl: ["target_chamber_temperature"],
  coolingFanControl: ["cooling_fan"],
  auxFanControl: ["aux_fan"],
  chamberFanControl: ["chamber_fan"],
  secondaryAuxFanControl: ["secondary_aux_fan"],
  airductMode: ["airduct_mode"],
  buzzerSilence: ["buzzer_silence"],
  buzzerFire: ["buzzer_fire_alarm"],
  buzzerBeep: ["buzzer_beeping"],
  cameraSwitch: ["camera"],
  imageCameraSwitch: ["imagecamera"],
  promptSound: ["prompt_sound"],
  activeTray: ["active_tray"],
  hybridModeBlocksControl: ["hybrid_mode_blocks_control"],
  developerLanMode: ["developer_lan_mode"],
  mqttEncryption: ["mqtt_encryption"],
};

const ENTITY_OVERRIDE_FIELDS = Object.freeze({
  progress: "progress_entity",
  status: "status_entity",
  taskName: "task_entity",
  remainingTime: "remaining_time_entity",
  nozzleTemp: "nozzle_temp_entity",
  bedTemp: "bed_temp_entity",
  online: "online_entity",
  camera: "camera_entity",
  coverImage: "cover_image_entity",
  currentLayer: "current_layer_entity",
  totalLayers: "total_layers_entity",
  totalUsage: "total_usage_entity",
  speed: "speed_entity",
  pause: "pause_entity",
  resume: "resume_entity",
  stop: "stop_entity",
  chamberLight: "light_entity",
  targetNozzleControl: "target_nozzle_control_entity",
  targetBedControl: "target_bed_control_entity",
  targetChamberControl: "target_chamber_control_entity",
  coolingFanControl: "cooling_fan_control_entity",
  auxFanControl: "aux_fan_control_entity",
  chamberFanControl: "chamber_fan_control_entity",
  secondaryAuxFanControl: "secondary_aux_fan_control_entity",
  airductMode: "airduct_mode_entity",
  smartPlug: "smart_plug_entity"
});

const STATUS_TRANSLATIONS = {
  RUNNING: "Druckt",
  PRINTING: "Druckt",
  PREPARE: "Vorbereitung",
  PREPARING: "Vorbereitung",
  PAUSE: "Pausiert",
  PAUSED: "Pausiert",
  FINISH: "Fertig",
  FINISHED: "Fertig",
  IDLE: "Bereit",
  FAILED: "Fehler",
  ERROR: "Fehler",
  OFFLINE: "Offline",
  UNKNOWN: "Unbekannt",
};

const KNOWN_PRINTER_SUFFIXES = [
  "bed_temp",
  "target_bed_temp",
  "nozzle_temp",
  "target_nozzle_temp",
  "print_progress",
  "gcode_state",
  "current_stage",
  "remaining_time",
  "subtask_name",
  "total_usage_hours",
];

function normalize(v) {
  return String(v ?? "").trim().toLowerCase();
}

function isUnavailableState(stateObj) {
  if (!stateObj) return true;
  const s = normalize(stateObj.state);
  return s === "unknown" || s === "unavailable" || s === "none" || s === "";
}

function entitySuffixMatches(uniqueId, alias) {
  const uid = normalize(uniqueId);
  const a = normalize(alias);
  return uid === a || uid.endsWith(`_${a}`) || uid.endsWith(`-${a}`);
}

function entryMatchesAlias(entry, alias) {
  if (!entry) return false;
  if (entitySuffixMatches(entry.unique_id, alias)) return true;
  if (normalize(entry.translation_key) === normalize(alias)) return true;
  const original = normalize(entry.original_name).replace(/[\s-]+/g, "_");
  return original === normalize(alias).replace(/[\s-]+/g, "_");
}

function findRegistryEntry(entries, aliases) {
  for (const alias of aliases || []) {
    const match = entries.find((e) => entryMatchesAlias(e, alias));
    if (match) return match;
  }
  return null;
}

function findState(hass, entries, aliases) {
  const reg = findRegistryEntry(entries, aliases);
  return reg ? hass?.states?.[reg.entity_id] ?? null : null;
}

function stateValue(hass, entries, aliases, fallback = null) {
  const st = findState(hass, entries, aliases);
  if (!st || isUnavailableState(st)) return fallback;
  return st.state;
}

function numericState(hass, entries, aliases, fallback = null) {
  const value = stateValue(hass, entries, aliases, null);
  if (value === null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatNumber(value, digits = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "–";
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(n);
}

function formatDurationMinutes(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "–";
  const minutes = Math.max(0, Math.round(n));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h} h ${m.toString().padStart(2, "0")} min`;
  return `${m} min`;
}

function translateStatus(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "Unbekannt";
  const upper = raw.toUpperCase();
  return STATUS_TRANSLATIONS[upper] || raw.replaceAll("_", " ");
}

function statusClass(value) {
  const s = normalize(value);
  if (["running", "printing", "prepare", "preparing"].includes(s)) return "ok";
  if (["pause", "paused"].includes(s)) return "warn";
  if (["failed", "error"].includes(s)) return "bad";
  if (["offline", "unavailable"].includes(s)) return "muted";
  return "idle";
}

function safePercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

function isBambuRegistryEntry(entry) {
  return entry?.platform === DOMAIN;
}

function isBambuDevice(device) {
  const manufacturer = normalize(device?.manufacturer);
  const model = normalize(device?.model);
  const name = normalize(device?.name_by_user || device?.name);
  const identifiers = (device?.identifiers || []).flat().map(normalize).join(" ");
  return manufacturer.includes("bambu") || model.includes("bambu") || name.includes("bambu") || identifiers.includes(DOMAIN);
}

function printerConfidence(device, entries) {
  let score = 0;
  const text = normalize(`${device?.manufacturer || ""} ${device?.model || ""} ${device?.name_by_user || device?.name || ""}`);
  if (text.includes("bambu")) score += 2;
  for (const suffix of KNOWN_PRINTER_SUFFIXES) {
    if (entries.some((e) => entitySuffixMatches(e.unique_id, suffix))) score += 1;
  }
  return score;
}

function getDescendantDeviceIds(rootId, devices) {
  const children = new Map();
  for (const d of devices) {
    if (!d?.via_device_id) continue;
    if (!children.has(d.via_device_id)) children.set(d.via_device_id, []);
    children.get(d.via_device_id).push(d.id);
  }
  const out = new Set();
  const queue = [...(children.get(rootId) || [])];
  while (queue.length) {
    const id = queue.shift();
    if (out.has(id)) continue;
    out.add(id);
    queue.push(...(children.get(id) || []));
  }
  return out;
}

function cssEscape(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[ch]);
}

function colorFromAttributes(attrs = {}) {
  const candidates = [attrs.color, attrs.tray_color, attrs.filament_color, attrs.rgb_color];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length >= 3) return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    if (typeof c === "string" && c.trim()) {
      const s = c.trim();
      if (/^[0-9A-Fa-f]{6,8}$/.test(s)) return `#${s.slice(0, 6)}`;
      return s;
    }
  }
  return null;
}

function displayName(device) {
  return device?.name_by_user || device?.name || device?.model || "Bambu Lab Drucker";
}

function unit(stateObj) {
  return stateObj?.attributes?.unit_of_measurement || "";
}

function hasMeaningfulValue(stateObj) {
  return !!stateObj && !isUnavailableState(stateObj);
}

function buildPrinterModels(devices, entities) {
  const bambuEntries = entities.filter(isBambuRegistryEntry);
  const byDevice = new Map();
  for (const e of bambuEntries) {
    if (!e.device_id) continue;
    if (!byDevice.has(e.device_id)) byDevice.set(e.device_id, []);
    byDevice.get(e.device_id).push(e);
  }

  const hasSuffix = (entries, suffix) => entries.some((e) => entryMatchesAlias(e, suffix));
  const isRealPrinter = (device) => {
    const own = byDevice.get(device.id) || [];
    if (!own.length) return false;
    const domains = new Set(own.map((e) => String(e.entity_id || '').split('.')[0]));
    const name = normalize(`${device?.name_by_user || ''} ${device?.name || ''} ${device?.model || ''}`);
    if (name.includes('dashboard') || (domains.size === 1 && domains.has('update'))) return false;
    const thermal = hasSuffix(own, 'bed_temp') || hasSuffix(own, 'nozzle_temp') || hasSuffix(own, 'target_bed_temp') || hasSuffix(own, 'target_nozzle_temp');
    const printCore = hasSuffix(own, 'print_progress') || hasSuffix(own, 'gcode_state') || hasSuffix(own, 'remaining_time') || hasSuffix(own, 'subtask_name');
    const printerSpecific = thermal && printCore;
    return printerSpecific;
  };

  const printerIds = new Set(devices.filter(isRealPrinter).map((d) => d.id));
  const roots = devices.filter((d) => printerIds.has(d.id) && !(d.via_device_id && printerIds.has(d.via_device_id)));

  return roots.map((root) => {
    const descendants = getDescendantDeviceIds(root.id, devices);
    const rootEntries = (byDevice.get(root.id) || []).filter(isBambuRegistryEntry);
    const childEntries = bambuEntries.filter((e) => descendants.has(e.device_id));
    return {
      id: root.id,
      device: root,
      entries: rootEntries,
      childEntries,
      descendants,
      childDevices: devices.filter((d) => descendants.has(d.id)),
    };
  }).sort((a, b) => displayName(a.device).localeCompare(displayName(b.device), "de"));
}

function resolveConfiguredPrinter(config, printerId) {
  const list = config?.printers || [];
  return list.find((p) => p.device_id === printerId) || {};
}

function configuredPrinterName(config, printer) {
  const cfg = resolveConfiguredPrinter(config, printer.id);
  return String(cfg.name || "").trim() || displayName(printer.device);
}

function configuredPrinterOrder(config, printer, fallbackIndex = 0) {
  const cfg = resolveConfiguredPrinter(config, printer.id);
  const n = Number(cfg.order);
  return Number.isFinite(n) ? n : fallbackIndex + 1000;
}

function printerIsVisible(config, printer) {
  const cfg = resolveConfiguredPrinter(config, printer.id);
  return cfg.visible !== false;
}

function printerSectionEnabled(config, printer, section) {
  const cfg = resolveConfiguredPrinter(config, printer.id);
  const key = `show_${section}`;
  return cfg[key] !== false;
}

function formatKwh(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${formatNumber(n, 2)} kWh` : "–";
}

function formatWatt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${formatNumber(n, n < 100 ? 1 : 0)} W` : "–";
}



const I18N_EN = Object.freeze({
  "Übersicht":"Overview","Drucker-Details":"Printer Details","Energie":"Energy","Wartung":"Maintenance",
  "Restzeit":"Remaining","Düse":"Nozzle","Bett":"Bed","Laufzeit":"Runtime","Details öffnen":"Open details",
  "Alle Drucker":"All printers","Drucker erkannt":"printers detected","aktiv":"active","druckt":"printing","gesamt":"total",
  "Kein Drucker ausgewählt.":"No printer selected.","Mehrdrucker-Control-Center mit AMS, Kamera, Steuerung, Energie und Wartung.":"Multi-printer control center with AMS, camera, controls, energy and maintenance.",
  "Bambu-Geräte werden automatisch erkannt …":"Bambu devices are being detected automatically …","Geräteerkennung fehlgeschlagen":"Device discovery failed",
  "Kein sichtbarer Bambu-Lab-Drucker gefunden.":"No visible Bambu Lab printer found.","Zusätzliche Lovelace-Karten sind nicht erforderlich.":"Additional Lovelace cards are not required.",
  "Datenquelle":"Data source","Drucker":"Printer","Geschwindigkeit":"Speed","Aktueller Druck":"Current Print","Bauteil / Vorschau":"Part / Preview",
  "abgeschlossen":"complete","Temperaturen & Lüfter":"Temperatures & Fans","Keine passenden Temperatur- oder Lüfter-Entitäten vorhanden.":"No matching temperature or fan entities available.",
  "Druckerinformationen":"Printer Information","Keine zusätzlichen Druckerinformationen vorhanden.":"No additional printer information available.","Tür":"Door","Offen":"Open","Geschlossen":"Closed",
  "Kamera-Diagnose":"Camera Diagnostics","HA-Status":"HA State","Access-Token":"Access Token","vorhanden":"present","fehlt":"missing","unbekannt":"unknown","In Home Assistant öffnen":"Open in Home Assistant",
  "Kamera":"Camera","Keine Kamera-Entität verfügbar oder Kamera nicht aktiviert.":"No camera entity available or camera is not enabled.","Kamera aktiv":"Camera enabled","Einzelbild-Modus":"Still image mode","EIN":"ON","AUS":"OFF",
  "Kein AMS für diesen Drucker erkannt.":"No AMS detected for this printer.","Einheit":"unit","Einheiten":"units","AMS Slot Details":"AMS Slot Details","Schließen":"Close","Home-Assistant-Details öffnen":"Open Home Assistant details",
  "Aktives Filament nicht gemeldet":"Active filament not reported","Schreibzugriffe sind für diesen Drucker eingeschränkt.":"Write access is restricted for this printer.",
  "Druck & Gerät":"Print & Device","Smart-Steckdose":"Smart Plug","Ausschalten":"Turn off","Einschalten":"Turn on","Strom & Steckdose":"Power & Smart Plug","Leistung":"Power","Kosten":"Cost",
  "Bambu-Lab-Intervalllogik:":"Bambu Lab interval logic:","Gesamtlaufzeit laut Bambu-Integration":"Total runtime reported by Bambu integration",
  "Nächste Wartungen":"Upcoming Maintenance","FÄLLIG":"DUE","Als erledigt quittieren":"Mark as completed","Wartungsbuch":"Maintenance Log",
  "Aktuell ist keine Wartung fällig. Noch nicht fällige Arbeiten erscheinen automatisch wieder zum nächsten Herstellerintervall.":"No maintenance is currently due. Tasks that are not yet due will automatically reappear at the next manufacturer interval.",
  "Noch keine Wartung quittiert.":"No maintenance has been completed yet.","Zeitpunkt":"Date / time","Offizielle Wartungsanleitung":"Official maintenance instructions","Intervall":"Interval","Quelle":"Source",
  "Originalanleitung öffnen":"Open original instructions","Intensive Nutzung":"Intensive use","Tage (normale Nutzung)":"days (normal use)","Tage laut verkürztem Bambu-Intervall":"days according to Bambu's shortened interval",
  "regelmäßig / nach Zustand":"regularly / as needed","Filter":"Filter","Alle Arbeiten":"All tasks","Nur letzte 30 Tage":"Last 30 days only","Einträge pro Seite":"Entries per page",
  "Vorherige":"Previous","Nächste":"Next","Seite":"Page","von":"of","Eintrag löschen":"Delete entry","Logbuch leeren":"Clear log","Auswertung":"Summary","Einträge gesamt":"Total entries","Letzte 30 Tage":"Last 30 days","Häufigste Wartung":"Most frequent task",
  "Wartung als erledigt gespeichert.":"Maintenance completion saved.","Wartungseintrag gelöscht.":"Maintenance entry deleted.","Wartungsbuch wurde geleert.":"Maintenance log cleared.",
  "Diesen Wartungseintrag wirklich löschen?":"Delete this maintenance entry?","Das komplette Wartungsbuch dieses Druckers wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.":"Clear the complete maintenance log for this printer? This cannot be undone.",
  "Build Plate reinigen":"Clean build plate","Live-View-Kamera reinigen":"Clean live-view camera","Druckraum / Boden reinigen":"Clean chamber / bottom","X-/Y-Achsen reinigen & schmieren":"Clean & lubricate X/Y axes","Z-Achse reinigen & schmieren":"Clean & lubricate Z axis","Luftfilter prüfen / reinigen":"Check / clean air filter","Toolhead-Kamera reinigen":"Clean toolhead camera","Extruder reinigen & schmieren":"Clean & lubricate extruder","Hotend reinigen":"Clean hotend",
  "Schienen / Führungen / Rollen / Lead Screws schmieren":"Lubricate rails / guides / rollers / lead screws","Filament-Cutter, Wiper und PTFE prüfen":"Check filament cutter, wiper and PTFE","Kamera, Lüfter und Filamentsensor reinigen":"Clean camera, fans and filament sensor",
  "Druckt":"Printing","Vorbereitung":"Preparing","Pausiert":"Paused","Fertig":"Finished","Bereit":"Ready","Fehler":"Error","Unbekannt":"Unknown",
  "Plugin-Hinweis öffnen":"Open integration note","Hybrid blockiert":"Hybrid blocked","nicht gemeldet":"not reported","MQTT-Verschlüsselung":"MQTT encryption",
  "Automatisch (Home Assistant)":"Automatic (Home Assistant)","Dunkel":"Dark","Hell":"Light","Strompreis in €/kWh":"Electricity price in €/kWh","Anzeigename":"Display name","Reihenfolge":"Order","anzeigen":"show",
  "Leistungssensor":"Power sensor","Energiesensor":"Energy sensor","Bereiche im Detail":"Detail sections","AMS-Zuordnung":"AMS assignment","Erweiterte Entity-Zuordnung":"Advanced entity mapping","automatisch":"automatic","Nicht zugeordnet":"Not assigned",
  "Mit warmem Wasser und Spülmittel reinigen und vollständig trocknen. Bambu Lab nennt bei normaler Nutzung 1 Woche.":"Clean with warm water and dish soap, then dry completely. Bambu Lab specifies one week for normal use.",
  "Kamerafläche mit Wattestäbchen oder fusselfreiem Tuch und wenig Alkohol reinigen. Normal: 1 Monat; bei intensiver Nutzung laut Bambu wöchentlich.":"Clean the camera surface with a cotton swab or lint-free cloth and a small amount of alcohol. Normal: one month; weekly for intensive use according to Bambu.",
  "Filamentreste und Fremdkörper abbürsten, anschließend mit einem fusselfreien, leicht mit Alkohol angefeuchteten Tuch reinigen. Normal: 1 Monat.":"Brush away filament residue and debris, then clean with a lint-free cloth lightly dampened with alcohol. Normal: one month.",
  "X/Y-Linearführungen reinigen und danach mit Schmieröl ölen. Normal: 1 Monat. Nach Wartung wichtiger Achskomponenten empfiehlt Bambu eine vollständige Druckkalibrierung.":"Clean the X/Y linear guides and lubricate them with oil. Normal: one month. After maintenance on major axis components, Bambu recommends a full printer calibration.",
  "Linearführungen mit Schmieröl, Gewindespindeln mit Schmierfett behandeln – die Schmierstoffe nicht verwechseln. Normal: 3 Monate.":"Lubricate linear guides with oil and lead screws with grease – do not mix up the lubricants. Normal: three months.",
  "Filterabdeckung von Staub befreien. Aktivkohlefilter regelmäßig ersetzen, insbesondere wenn er sichtbar verschmutzt oder gesättigt ist. Normal: 3 Monate.":"Remove dust from the filter cover. Replace the activated-carbon filter regularly, especially when visibly dirty or saturated. Normal: three months.",
  "Kamerafläche mit Wattestäbchen oder fusselfreiem Tuch und wenig Alkohol reinigen. Ablagerungen können Bild und Erkennung beeinträchtigen. Normal: 1 Monat.":"Clean the camera surface with a cotton swab or lint-free cloth and a small amount of alcohol. Deposits can affect the image and detection. Normal: one month.",
  "Interne Ablagerungen entfernen und die vorgesehenen Zahnräder mit Schmierfett schmieren. Normal: 1 Monat; für die Demontage verweist Bambu auf die X2D-Anleitung im Wiki.":"Remove internal deposits and lubricate the specified gears with grease. Normal: one month; Bambu refers to the X2D wiki instructions for disassembly.",
  "Bambu nennt für die regelmäßige Hotend-Reinigung einen Cold Pull. Normal: 1 Monat.":"Bambu specifies a cold pull for regular hotend cleaning. Normal: one month.",
  "X/Y und Umlenkrollen mit Öl; Lead Screws und Extruder-Zahnräder mit Fett. Bambu nennt im A2L Quick Start kein fixes Zeitintervall – deshalb erfolgt hier keine erfundene Fälligkeitsberechnung.":"Use oil on X/Y and idler rollers; use grease on lead screws and extruder gears. The A2L Quick Start does not specify a fixed interval, so the dashboard does not invent one.",
  "Auf Alterung, Verformung und Verschleiß prüfen; bei Bedarf ersetzen. Ohne Herstellerintervall wird kein Datum berechnet.":"Check for aging, deformation and wear; replace as needed. No date is calculated without a manufacturer interval.",
  "Staub und Schmutz entfernen; Kamera vorsichtig reinigen. Ohne Herstellerintervall wird kein Datum berechnet.":"Remove dust and dirt; clean the camera carefully. No date is calculated without a manufacturer interval.",
  "Die Gesamtbetriebsstunden dienen hier nur als Information und lösen keine Wartung aus. Die normalen X2D-Intervalle stammen aus Kapitel 11 des offiziellen Handbuchs. Bei dauerhaftem Druck mit Hochtemperatur-/Engineering-Filamenten oder bei durchschnittlich mehr als 8 Druckstunden pro Tag verlangt Bambu häufigere Wartung: 3-Monats-Arbeiten monatlich und Monats-Arbeiten wöchentlich. Zusätzlich kann der X2D mit aktueller Firmware eigene Wartungshinweise anhand von Aufgabe und Druckdauer ausgeben. Die Dashboard-Termine sind Erinnerungen anhand der Bambu-Vorgaben; sichtbarer Verschleiß, Verschmutzung oder eine direkte Wartungsmeldung des Druckers haben Vorrang.":"Total runtime is informational only and does not trigger maintenance. The normal X2D intervals come from chapter 11 of the official manual. For continuous high-temperature/engineering filament use or an average of more than 8 print hours per day, Bambu requires more frequent maintenance: three-month tasks monthly and monthly tasks weekly. With current firmware, the X2D may also issue its own maintenance notices based on task and print duration. Dashboard dates are reminders based on Bambu guidance; visible wear, contamination or a direct printer maintenance notice takes priority.",
  "Die offizielle ha-bambulab-Integration dokumentiert, dass bei gesperrter Firmware bzw. Hybrid-/Cloud-Betrieb die meisten Schreibfunktionen nicht bereitgestellt werden; bei älteren Hybrid-Firmwares bleibt ausdrücklich nur das Licht steuerbar. Für volle Schreibzugriffe verlangt die Integration LAN Mode + Developer LAN Mode.":"The official ha-bambulab integration documents that locked-down firmware or hybrid/cloud operation can remove most write controls; with older hybrid firmware, only the light may remain controllable. Full write access requires LAN Mode + Developer LAN Mode.",
  "Keine total_usage_hours-Entity bzw. kein letzter Gesamtwert verfügbar. Die letzte Druckdauer wird ausdrücklich nicht als Gesamtlaufzeit verwendet.":"No total_usage_hours entity or last total value is available. The last print duration is explicitly not used as total runtime.",
  "zuletzt gemeldet":"last reported"
});
function uiLanguage(hass){ return String(hass?.language || hass?.locale?.language || globalThis.navigator?.language || "en").toLowerCase().split("-")[0]; }
function uiLocale(hass){ return uiLanguage(hass)==="de" ? "de-DE" : "en-US"; }
function translateUiText(text,hass){
  if(uiLanguage(hass)==="de") return text;
  let out=String(text??"");
  const entries=Object.entries(I18N_EN).sort((a,b)=>b[0].length-a[0].length);
  for(const [de,en] of entries) out=out.split(de).join(en);
  return out;
}
function applyUiTranslations(root,hass){
  if(!root || uiLanguage(hass)==="de") return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  for(const n of nodes){ if(n.parentElement?.closest('style,script')) continue; n.nodeValue=translateUiText(n.nodeValue,hass); }
  root.querySelectorAll('[title],[aria-label],[placeholder]').forEach(el=>{ for(const a of ['title','aria-label','placeholder']) if(el.hasAttribute(a)) el.setAttribute(a,translateUiText(el.getAttribute(a),hass)); });
}

const styles = `
  :host {
    --bd-bg: #050907;
    --bd-panel: #0c1210;
    --bd-panel-2: #111a16;
    --bd-card: #111a16;
    --bd-border: #1d2923;
    --bd-accent: #50d926;
    --bd-accent-2: #22e681;
    --bd-text: #f4f7f5;
    --bd-muted: #a8b0ac;
    --bd-danger: #ff5f62;
    --bd-warn: #f4c95d;
    --bd-radius: 20px;
    display: block;
    container-type: inline-size;
    color: var(--bd-text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }

  .shell.theme-light, .overlay-theme.theme-light {
    --bd-bg:#f4f7f5; --bd-panel:#ffffff; --bd-panel-2:#eef4f0; --bd-card:#ffffff; --bd-border:#d5e0d9;
    --bd-text:#132019; --bd-muted:#617067; --bd-danger:#b4232b; --bd-warn:#8a6500;
    background:radial-gradient(circle at 18% 0%,rgba(80,217,38,.10),transparent 28%),linear-gradient(180deg,#fbfdfb 0%,#eef5f0 100%);
    box-shadow:0 18px 55px rgba(28,55,36,.15),inset 0 1px 0 rgba(255,255,255,.7);
  }
  .shell.theme-light .panel,.shell.theme-light .fleet-card,.shell.theme-light .side-brand,.shell.theme-light .side-printers { background:rgba(255,255,255,.88); }
  .shell.theme-light .printer-visual,.shell.theme-light .fleet-visual,.shell.theme-light .camera-wrap { background:rgba(223,234,226,.72); }
  .shell.theme-light .select-wrap select,.shell.theme-light .control-field input,.shell.theme-light .control-field select { background:#fff;color:var(--bd-text); }
  .shell.theme-light, .overlay-theme.theme-light { --bd-accent:#188f12; --bd-accent-2:#087a45; color:var(--bd-text); }
  .shell.theme-light .panel,.shell.theme-light .fleet-card,.shell.theme-light .side-brand,.shell.theme-light .side-printers,.shell.theme-light .control-field,.shell.theme-light .metric,.shell.theme-light .energy-stat,.shell.theme-light .maint-item,.shell.theme-light .ams-unit,.shell.theme-light .spool,.shell.theme-light .fleet-metrics>div { background:#ffffff !important; color:var(--bd-text) !important; border-color:var(--bd-border) !important; box-shadow:none; }
  .shell.theme-light .fleet-card:hover,.shell.theme-light .spool:hover,.shell.theme-light .control-btn:hover { background:#f0f7f2 !important; }
  .shell.theme-light .control-btn,.shell.theme-light .tab,.shell.theme-light .pill,.shell.theme-light .nav-btn,.shell.theme-light .fleet-detail,.shell.theme-light .side-printer { color:var(--bd-text); background:#f7faf8; border-color:var(--bd-border); }
  .shell.theme-light .nav-btn.active,.shell.theme-light .side-printer.active,.shell.theme-light .tab.active,.shell.theme-light .fleet-detail { background:rgba(24,143,18,.10); border-color:rgba(24,143,18,.42); }
  .shell.theme-light .progress-ring::before { background:#ffffff; border-color:var(--bd-border); }
  .shell.theme-light .fleet-visual,.shell.theme-light .printer-visual,.shell.theme-light .job-art-image { background:#eef4f0 !important; border-color:var(--bd-border) !important; }
  .shell.theme-light .camera-wrap { background:#dfe9e2 !important; border-color:var(--bd-border) !important; }
  .shell.theme-light .camera-empty,.shell.theme-light .empty,.shell.theme-light .notice,.shell.theme-light .eyebrow,.shell.theme-light .label,.shell.theme-light small,.shell.theme-light .spool-meta,.shell.theme-light .workspace-title p,.shell.theme-light .fleet-task { color:var(--bd-muted) !important; }
  .shell.theme-light .bar,.shell.theme-light .fleet-progress { background:#dce6df; }
  .shell.theme-light .panel-title,.shell.theme-light h1,.shell.theme-light h2,.shell.theme-light h3,.shell.theme-light strong,.shell.theme-light .fleet-name,.shell.theme-light .ams-name { color:var(--bd-text) !important; }
  .shell.theme-light .shell::before { opacity:.08; }
  .spool { cursor:pointer; touch-action:manipulation; width:100%; color:inherit; font:inherit; }
  .spool:hover { border-color:rgba(80,217,38,.42); background:rgba(80,217,38,.055); }
  .spool:focus-visible { outline:2px solid var(--bd-accent); outline-offset:2px; }
  .spool-dialog-backdrop { position:fixed; inset:0; z-index:9999; display:grid; place-items:center; padding:18px; background:rgba(0,0,0,.62); backdrop-filter:blur(5px); }
  .ams-slot-detail { margin:14px 17px 17px; padding:15px; border:1px solid rgba(80,217,38,.28); border-radius:16px; background:var(--bd-panel-2); }
  :host,.shell { overflow-anchor:none; }
  @container (max-width:560px) { .fleet-card { padding:13px; } .fleet-main { gap:12px; } .fleet-visual { width:100%; height:180px; } .fleet-visual img { width:100%; height:100%; object-fit:contain; object-position:center; object-position:center; } .fleet-content { min-width:0; } .fleet-task { white-space:normal; overflow-wrap:anywhere; } }
  .spool-dialog { width:min(560px,100%); max-height:min(78vh,720px); overflow:auto; border-radius:20px; padding:18px; color:var(--bd-text); background:var(--bd-panel); border:1px solid rgba(80,217,38,.35); box-shadow:0 25px 80px rgba(0,0,0,.45); }
  .spool-dialog-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  .spool-dialog-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-top:14px; }
  .spool-detail-row { border:1px solid var(--bd-border); background:rgba(255,255,255,.025); border-radius:11px; padding:9px 10px; min-width:0; }
  .spool-detail-row small { display:block; color:var(--bd-muted); font-size:9px; text-transform:uppercase; letter-spacing:.08em; }
  .spool-detail-row strong { display:block; margin-top:4px; overflow-wrap:anywhere; font-size:12px; }
  .dialog-close { border:1px solid var(--bd-border); background:transparent; color:inherit; width:34px; height:34px; border-radius:10px; cursor:pointer; }
  .control-groups { padding:14px 17px 17px; display:grid; gap:14px; }
  .control-group { display:grid; gap:8px; }
  .control-group-title { color:var(--bd-muted); font-size:10px; letter-spacing:.1em; text-transform:uppercase; font-weight:800; }
  .control-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
  .control-field { border:1px solid var(--bd-border); border-radius:12px; padding:10px; background:rgba(255,255,255,.02); }
  .control-field label { display:block; color:var(--bd-muted); font-size:10px; margin-bottom:6px; }
  .control-field input,.control-field select { width:100%; min-height:36px; border-radius:9px; border:1px solid var(--bd-border); background:#0b120e; color:var(--bd-text); padding:0 8px; }
  .fan-control-row { display:grid; grid-template-columns:1fr auto; gap:8px; align-items:center; }
  .fan-control-row input[type=range] { padding:0; }
  .job-art-panel { overflow:hidden; }
  .job-art-body { display:grid; grid-template-columns:minmax(220px,1.2fr) minmax(220px,.8fr); gap:16px; padding:16px 17px 17px; align-items:stretch; }
  .job-art-image { min-height:260px; border-radius:16px; display:grid; place-items:center; overflow:hidden; background:rgba(0,0,0,.25); border:1px solid rgba(255,255,255,.05); }
  .job-art-image img { width:100%; height:100%; max-height:420px; object-fit:contain; object-position:center; }
  .job-art-info { display:flex; flex-direction:column; justify-content:center; min-width:0; }
  .job-art-info h3 { margin:0 0 8px; font-size:clamp(20px,2.2vw,30px); overflow-wrap:anywhere; }
  .job-art-info p { margin:0; color:var(--bd-muted); line-height:1.5; }
  @container (max-width:700px) { .job-art-body { grid-template-columns:1fr; } .job-art-image { min-height:210px; } .control-grid { grid-template-columns:1fr; } }
  @container (max-width:430px) { .spool-dialog-grid { grid-template-columns:1fr; } }
  .picker-preview { min-height:210px; border-radius:18px; padding:18px; display:grid; grid-template-columns:92px minmax(0,1fr); gap:16px; align-items:center; color:#f4f7f5; background:linear-gradient(145deg,#08120d,#0e2015); border:1px solid rgba(80,217,38,.24); overflow:hidden; }
  .picker-preview-icon { width:92px; aspect-ratio:1; border-radius:20px; display:grid; place-items:center; background:rgba(80,217,38,.10); border:1px solid rgba(80,217,38,.28); }
  .picker-preview-icon ha-icon { --mdc-icon-size:58px; color:var(--bd-accent); }
  .picker-preview h3 { margin:0; font-size:20px; }
  .picker-preview p { margin:7px 0 0; color:#a8b0ac; font-size:12px; line-height:1.4; }

  button, select, input { font: inherit; }
  button { color: inherit; }
  .shell {
    position: relative;
    overflow: hidden;
    border-radius: 26px;
    padding: 22px;
    background:
      radial-gradient(circle at 18% 0%, rgba(80,217,38,.11), transparent 28%),
      radial-gradient(circle at 92% 10%, rgba(34,230,129,.08), transparent 30%),
      linear-gradient(180deg, #07100c 0%, var(--bd-bg) 38%, #030605 100%);
    border: 1px solid rgba(80,217,38,.14);
    box-shadow: 0 20px 60px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.03);
  }
  .shell::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .22;
    background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, black, transparent 72%);
  }
  .header { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
  .brand { display:flex; align-items:center; gap:12px; min-width:0; }
  .brand-mark { width: 42px; height: 42px; border-radius: 13px; display:grid; place-items:center; background: linear-gradient(145deg, rgba(80,217,38,.23), rgba(80,217,38,.05)); border:1px solid rgba(80,217,38,.38); box-shadow: 0 0 28px rgba(80,217,38,.10); }
  .brand-mark ha-icon { color: var(--bd-accent); --mdc-icon-size: 25px; }
  .brand h1 { margin:0; font-size: clamp(18px, 2.2vw, 28px); line-height:1.05; letter-spacing:.02em; font-weight:800; }
  .brand small { display:block; color:var(--bd-muted); margin-top:4px; font-size:11px; letter-spacing:.14em; text-transform:uppercase; }
  .header-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
  .pill { display:inline-flex; align-items:center; gap:7px; min-height:34px; padding:7px 10px; border-radius:999px; border:1px solid var(--bd-border); background:rgba(255,255,255,.025); color:var(--bd-muted); font-size:12px; }
  .pill.ok { color:#b9ffac; border-color:rgba(80,217,38,.28); background:rgba(80,217,38,.08); }
  .dot { width:7px; height:7px; border-radius:50%; background:currentColor; box-shadow:0 0 10px currentColor; }
  .tabs { position:relative; z-index:1; display:flex; gap:8px; overflow:auto; padding:3px 1px 14px; scrollbar-width:none; }
  .tabs::-webkit-scrollbar { display:none; }
  .tab { flex:0 0 auto; cursor:pointer; border:1px solid var(--bd-border); background:rgba(255,255,255,.02); border-radius:13px; padding:9px 13px; display:flex; align-items:center; gap:8px; transition:.18s ease; }
  .tab:hover { border-color:rgba(80,217,38,.32); transform:translateY(-1px); }
  .tab.active { background:linear-gradient(180deg, rgba(80,217,38,.15), rgba(80,217,38,.05)); border-color:rgba(80,217,38,.5); box-shadow:0 0 24px rgba(80,217,38,.08); }
  .tab ha-icon { --mdc-icon-size:19px; color:var(--bd-accent); }
  .tab span { font-size:13px; font-weight:700; white-space:nowrap; }
  .layout { position:relative; z-index:1; display:grid; grid-template-columns:minmax(0,1.38fr) minmax(290px,.82fr); gap:14px; }
  .left, .right { display:grid; gap:14px; align-content:start; }
  .grid-2 { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:14px; }
  .panel { position:relative; overflow:hidden; border-radius:var(--bd-radius); background:linear-gradient(180deg, rgba(17,26,22,.96), rgba(9,15,12,.96)); border:1px solid var(--bd-border); box-shadow:inset 0 1px 0 rgba(255,255,255,.025), 0 14px 36px rgba(0,0,0,.18); }
  .panel.glow { border-color:rgba(80,217,38,.27); }
  .panel.glow::after { content:""; position:absolute; right:-80px; top:-80px; width:180px; height:180px; border-radius:50%; background:rgba(80,217,38,.08); filter:blur(20px); pointer-events:none; }
  .panel-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:16px 17px 0; }
  .eyebrow { color:var(--bd-muted); font-size:10px; letter-spacing:.15em; text-transform:uppercase; font-weight:800; }
  .panel-title { margin:4px 0 0; font-size:15px; font-weight:800; }
  .muted { color:var(--bd-muted); }
  .hero-body { display:grid; grid-template-columns:minmax(170px,.82fr) minmax(230px,1.18fr); gap:18px; padding:17px; align-items:center; }

  .hero-body { grid-template-columns:minmax(180px,.9fr) minmax(160px,.72fr) minmax(230px,1.18fr); }
  .printer-visual { position:relative; min-height:245px; border-radius:18px; overflow:hidden; display:grid; place-items:center; background:radial-gradient(circle at 50% 45%, rgba(80,217,38,.09), rgba(255,255,255,.018) 46%, rgba(0,0,0,.18) 100%); border:1px solid rgba(255,255,255,.045); }
  .printer-visual::before { content:""; position:absolute; left:12%; right:12%; bottom:12%; height:18%; border-radius:50%; background:rgba(80,217,38,.08); filter:blur(24px); }
  .printer-product-image { position:relative; z-index:1; width:auto; height:auto; max-width:92%; max-height:225px; object-fit:contain; object-position:center; filter:drop-shadow(0 22px 28px rgba(0,0,0,.58)); }
  .printer-product-fallback { position:relative; z-index:1; display:none; width:100%; height:210px; place-items:center; color:rgba(80,217,38,.55); }
  .printer-product-fallback ha-icon { --mdc-icon-size:96px; }
  .printer-model-chip { position:absolute; z-index:2; left:10px; bottom:10px; display:inline-flex; align-items:center; gap:6px; max-width:calc(100% - 20px); padding:6px 9px; border-radius:999px; border:1px solid rgba(80,217,38,.24); background:rgba(4,10,7,.76); backdrop-filter:blur(9px); color:#c9ffc0; font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; }
  .print-cover-mini { position:absolute; z-index:3; right:10px; top:10px; width:58px; height:58px; border-radius:13px; object-fit:contain; background:rgba(0,0,0,.42); border:1px solid rgba(255,255,255,.09); box-shadow:0 10px 24px rgba(0,0,0,.3); }
  .progress-wrap { display:grid; place-items:center; min-height:220px; }
  .progress-ring { --p:0; width:min(210px, 70vw); aspect-ratio:1; border-radius:50%; display:grid; place-items:center; background:conic-gradient(var(--bd-accent) calc(var(--p) * 1%), #1b2821 0); position:relative; box-shadow:0 0 34px rgba(80,217,38,.11); }
  .progress-ring::before { content:""; position:absolute; inset:12px; border-radius:50%; background:radial-gradient(circle at 50% 35%, #111c16, #080d0a 72%); border:1px solid rgba(255,255,255,.04); }
  .progress-inner { position:relative; text-align:center; padding:20px; }
  .progress-number { font-size:clamp(40px, 6vw, 66px); line-height:.9; font-weight:900; letter-spacing:-.05em; }
  .progress-number span { font-size:.37em; color:var(--bd-muted); margin-left:3px; }
  .status-badge { margin-top:13px; display:inline-flex; align-items:center; gap:7px; padding:6px 9px; border-radius:999px; font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; border:1px solid var(--bd-border); }
  .status-badge.ok { color:#bcffad; background:rgba(80,217,38,.09); border-color:rgba(80,217,38,.34); }
  .status-badge.warn { color:#ffe6a1; background:rgba(244,201,93,.08); border-color:rgba(244,201,93,.28); }
  .status-badge.bad { color:#ffc0c1; background:rgba(255,95,98,.08); border-color:rgba(255,95,98,.3); }
  .status-badge.muted, .status-badge.idle { color:var(--bd-muted); }
  .task { min-width:0; }
  .task-name { font-size:clamp(19px, 2.6vw, 30px); line-height:1.08; font-weight:850; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
  .task-meta { margin-top:8px; color:var(--bd-muted); font-size:12px; display:flex; flex-wrap:wrap; gap:8px 14px; }
  .metric-grid { margin-top:18px; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
  .metric { padding:11px; border-radius:14px; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.045); min-width:0; }
  .metric .label { color:var(--bd-muted); font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
  .metric .value { margin-top:5px; font-size:17px; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .temperature-list, .info-list { padding:13px 17px 17px; display:grid; gap:9px; }
  .temp-row, .info-row { display:grid; grid-template-columns:1fr auto; gap:10px; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.045); }
  .temp-row:last-child, .info-row:last-child { border-bottom:0; }
  .row-label { display:flex; align-items:center; gap:9px; min-width:0; color:var(--bd-muted); font-size:12px; }
  .row-label ha-icon { color:var(--bd-accent); --mdc-icon-size:18px; }
  .row-value { font-size:13px; font-weight:800; text-align:right; }
  .active-filament{display:flex;align-items:center;gap:8px;margin-top:8px;color:var(--bd-muted);font-size:12px}.active-filament strong{color:var(--bd-text)}.filament-dot{--filament:#8e9a92;width:14px;height:14px;border-radius:50%;background:var(--filament);border:2px solid rgba(255,255,255,.25);box-shadow:0 0 10px color-mix(in srgb,var(--filament) 45%,transparent);flex:0 0 auto}.active-filament.muted{opacity:.7}
  .number-set-row{display:grid;grid-template-columns:1fr auto;gap:7px}.number-set-row button,.maint-actions button{border:1px solid var(--bd-green-dim);background:rgba(80,217,38,.08);color:var(--bd-text);border-radius:9px;padding:8px 10px;cursor:pointer}.toggle-row{width:100%;display:flex;justify-content:space-between;align-items:center;border:1px solid var(--bd-border);background:var(--bd-card);color:var(--bd-text);border-radius:11px;padding:10px;cursor:pointer}.toggle-row.on strong,.plug-state.on{color:var(--bd-green)}
  .smart-plug{display:flex;justify-content:space-between;gap:12px;align-items:center;border:1px solid var(--bd-border);border-radius:13px;padding:12px;margin-bottom:12px}.smart-plug small,.smart-plug strong,.smart-plug span{display:block}.plug-state{margin-top:4px;font-size:11px;font-weight:800;color:var(--bd-muted)}
  .maint-item.due{border-color:rgba(255,166,0,.55);box-shadow:inset 3px 0 0 #f1a21b}.maint-item small{display:block;color:var(--bd-muted);margin-top:6px;line-height:1.45}.maint-actions{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:10px;font-size:10px;color:var(--bd-muted)}.maintenance-note{padding:11px 12px;border-radius:13px;border:1px solid var(--bd-border);background:rgba(80,217,38,.045);color:var(--bd-muted);font-size:11px;line-height:1.5}.maintenance-next{padding:11px 12px;border-radius:13px;border:1px solid var(--bd-border);background:rgba(255,255,255,.018)}.maintenance-next strong{display:block;margin-bottom:7px}.maintenance-next-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:6px 0;border-top:1px solid var(--bd-border);font-size:11px}.maintenance-next-row:first-of-type{border-top:0}.maintenance-next-row span:last-child{font-weight:800;white-space:nowrap}.maintenance-log{margin-top:8px}.maintenance-log summary{cursor:pointer;font-weight:800}.maintenance-log table{width:100%;border-collapse:collapse;margin-top:10px;font-size:11px}.maintenance-log th,.maintenance-log td{text-align:left;padding:7px;border-bottom:1px solid var(--bd-border)}.maintenance-log-toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:end;margin:12px 0}.maintenance-log-toolbar label{display:grid;gap:4px;font-size:10px;color:var(--bd-muted)}.maintenance-log-toolbar select,.maintenance-log-toolbar input{min-height:34px;border:1px solid var(--bd-border);border-radius:9px;background:var(--bd-card);color:var(--bd-text);padding:6px 9px}.maintenance-log-actions{display:flex;gap:7px;flex-wrap:wrap;margin-left:auto}.maintenance-log-actions button,.maintenance-pager button,.maint-actions button,.maintenance-modal-actions button{border:1px solid rgba(80,217,38,.28);background:rgba(80,217,38,.08);color:var(--bd-text);border-radius:9px;padding:8px 10px;font-weight:800;cursor:pointer;transition:background .16s ease,border-color .16s ease,transform .16s ease,box-shadow .16s ease}.maintenance-log-actions button:hover,.maintenance-pager button:hover,.maint-actions button:hover,.maintenance-modal-actions button:hover{background:rgba(80,217,38,.20);border-color:rgba(80,217,38,.62);box-shadow:0 0 0 2px rgba(80,217,38,.08);transform:translateY(-1px)}.maintenance-log-actions button:active,.maintenance-pager button:active,.maint-actions button:active,.maintenance-modal-actions button:active{transform:translateY(0);background:rgba(80,217,38,.28)}.maintenance-log-actions .danger,.maintenance-log .danger{border-color:rgba(255,90,90,.34);background:rgba(255,90,90,.07)}.maintenance-log-actions .danger:hover,.maintenance-log .danger:hover{border-color:rgba(255,90,90,.65);background:rgba(255,90,90,.16)}.maintenance-pager{display:flex;justify-content:center;align-items:center;gap:9px;padding:10px 0}.maintenance-pager button:disabled{opacity:.35;cursor:default;transform:none;box-shadow:none}.maintenance-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0}.maintenance-summary div{border:1px solid var(--bd-border);border-radius:10px;padding:9px;background:rgba(255,255,255,.018)}.maintenance-summary small{display:block;color:var(--bd-muted);margin-bottom:4px}.maintenance-summary strong{display:block;overflow-wrap:anywhere}.maintenance-toast{position:sticky;top:8px;z-index:4;padding:10px 12px;border:1px solid rgba(80,217,38,.45);background:rgba(80,217,38,.14);border-radius:10px;font-weight:800}.maintenance-log td:last-child,.maintenance-log th:last-child{text-align:right;width:1%}.maintenance-log td button{white-space:nowrap}.maint-source-link:hover{color:var(--bd-text);text-decoration:underline}.maint-actions button:focus-visible,.maintenance-log button:focus-visible,.maintenance-pager button:focus-visible{outline:2px solid var(--bd-green);outline-offset:2px}@media(max-width:700px){.maintenance-summary{grid-template-columns:1fr}.maintenance-log-toolbar{display:grid;grid-template-columns:1fr 1fr}.maintenance-log-actions{grid-column:1/-1;margin-left:0}.maintenance-log table{display:block;overflow-x:auto}.maintenance-log-toolbar label:first-child{grid-column:1/-1}}.control-warning{margin:0 17px 14px;padding:12px 13px;border:1px solid rgba(241,162,27,.45);background:rgba(241,162,27,.08);border-radius:13px;font-size:11px;line-height:1.5}.control-warning strong{display:block;margin-bottom:4px}.control-warning a,.maint-source-link,.maintenance-modal a{color:var(--bd-green);font-weight:800;text-decoration:none}.capability-list{display:grid;gap:5px;margin-top:8px}.capability-row{display:flex;justify-content:space-between;gap:10px;border-top:1px solid var(--bd-border);padding-top:5px}.capability-row code{font-size:9px;overflow-wrap:anywhere;text-align:right}.maint-source-link{background:none;border:0;padding:0;cursor:pointer;font:inherit}.spool-modal-backdrop{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.72);display:grid;place-items:center;padding:18px;touch-action:pan-y}.spool-modal{width:min(680px,96vw);max-height:min(86vh,820px);overflow:auto;-webkit-overflow-scrolling:touch;background:var(--bd-panel);color:var(--bd-text);border:1px solid var(--bd-border);border-radius:18px;box-shadow:0 28px 80px rgba(0,0,0,.48);padding:18px;box-sizing:border-box}.spool-dialog-grid{display:grid;gap:7px;margin-top:14px}.spool-detail-row{display:grid;grid-template-columns:minmax(110px,.8fr) minmax(0,1.2fr);gap:12px;padding:8px 0;border-bottom:1px solid var(--bd-border)}.spool-detail-row small{color:var(--bd-muted);text-transform:capitalize}.spool-detail-row strong{overflow-wrap:anywhere}.spool-dialog-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}@media(max-width:600px){.spool-modal-backdrop{padding:0}.spool-modal{width:100vw;height:100dvh;max-height:none;border-radius:0;padding:18px}.spool-detail-row{grid-template-columns:1fr;gap:3px}}.maintenance-modal-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.72);display:grid;place-items:center;padding:18px}.maintenance-modal{width:min(720px,96vw);max-height:min(86vh,820px);overflow:auto;background:var(--bd-panel);color:var(--bd-text);border:1px solid var(--bd-border);border-radius:18px;box-shadow:0 28px 80px rgba(0,0,0,.48);padding:20px}.maintenance-modal-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.maintenance-modal h3{margin:4px 0 10px;font-size:22px}.maintenance-modal p{line-height:1.6;color:var(--bd-muted)}.maintenance-modal-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}.maintenance-modal-actions a,.maintenance-modal-actions button{border:1px solid var(--bd-border);border-radius:10px;padding:10px 12px;background:var(--bd-card);color:var(--bd-text);font-weight:800;cursor:pointer}.maintenance-modal-actions a{background:rgba(80,217,38,.10);border-color:rgba(80,217,38,.35)}@media(max-width:600px){.maintenance-modal-backdrop{padding:0}.maintenance-modal{width:100vw;height:100dvh;max-height:none;border-radius:0;padding:18px;box-sizing:border-box}}
  .shell.theme-light .active-filament strong,.shell.theme-light .toggle-row,.shell.theme-light .number-set-row button,.shell.theme-light .maint-actions button{color:#102017!important}.shell.theme-light .toggle-row,.shell.theme-light .smart-plug{background:#fff!important;border-color:#c9d8cd!important}
  .overlay-theme.theme-light .spool-modal, .overlay-theme.theme-light .maintenance-modal { background:#ffffff !important; color:#132019 !important; border-color:#d5e0d9 !important; box-shadow:0 28px 80px rgba(28,55,36,.20); }
  .overlay-theme.theme-light .spool-detail-row { border-color:#d5e0d9 !important; }
  .overlay-theme.theme-light .spool-detail-row small, .overlay-theme.theme-light .maintenance-modal p, .overlay-theme.theme-light .maintenance-modal .eyebrow { color:#617067 !important; }
  .overlay-theme.theme-light .spool-detail-row strong, .overlay-theme.theme-light .maintenance-modal h3, .overlay-theme.theme-light .maintenance-modal strong { color:#132019 !important; }
  .overlay-theme.theme-light .dialog-close, .overlay-theme.theme-light .icon-btn, .overlay-theme.theme-light .maintenance-modal-actions button { background:#f7faf8 !important; color:#132019 !important; border-color:#d5e0d9 !important; }
  .overlay-theme.theme-light .maintenance-modal-actions a, .overlay-theme.theme-light .fleet-detail { background:rgba(24,143,18,.10) !important; color:#126b0e !important; border-color:rgba(24,143,18,.42) !important; }
  .overlay-theme.theme-light .spool-dialog-backdrop, .overlay-theme.theme-light .spool-modal-backdrop, .overlay-theme.theme-light .maintenance-modal-backdrop { background:rgba(19,32,25,.32); }

  .camera-wrap { position:relative; aspect-ratio:16/9; margin:14px 17px 17px; border-radius:15px; overflow:hidden; background:#030504; border:1px solid rgba(255,255,255,.05); display:grid; place-items:center; }
  .camera-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
  .camera-empty { text-align:center; color:var(--bd-muted); padding:20px; font-size:12px; }
  .camera-empty ha-icon { display:block; margin:0 auto 10px; --mdc-icon-size:34px; color:#637068; }
  .camera-actions { position:absolute; right:9px; bottom:9px; display:flex; gap:7px; }
  .icon-btn { cursor:pointer; border:1px solid rgba(255,255,255,.1); background:rgba(4,9,7,.75); backdrop-filter:blur(10px); border-radius:10px; width:34px; height:34px; display:grid; place-items:center; }
  .icon-btn:hover { border-color:rgba(80,217,38,.45); }
  .icon-btn ha-icon { --mdc-icon-size:18px; }
  .ams-list { padding:14px 17px 17px; display:grid; gap:14px; }
  .ams-unit { border:1px solid rgba(255,255,255,.05); border-radius:15px; padding:12px; background:rgba(255,255,255,.018); }
  .ams-unit-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:11px; }
  .ams-name { font-size:12px; font-weight:800; }
  .spools { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:9px; }
  .spool { min-width:0; text-align:center; border-radius:14px; padding:10px 6px 8px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.045); }
  .spool-disc { --filament:#8e9a92; width:50px; max-width:100%; aspect-ratio:1; margin:0 auto 8px; border-radius:50%; background:radial-gradient(circle, #0b110e 0 26%, var(--filament) 27% 56%, #19211c 58% 67%, rgba(255,255,255,.04) 69%); box-shadow:0 0 18px color-mix(in srgb, var(--filament) 24%, transparent); border:1px solid rgba(255,255,255,.08); }
  .spool.active { border-color:rgba(80,217,38,.42); box-shadow:0 0 18px rgba(80,217,38,.06); }
  .spool-title { font-size:10px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .spool-meta { margin-top:3px; color:var(--bd-muted); font-size:9px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .controls { padding:14px 17px 17px; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
  .control-btn { cursor:pointer; border-radius:13px; padding:11px 10px; border:1px solid var(--bd-border); background:rgba(255,255,255,.022); display:flex; align-items:center; justify-content:center; gap:8px; font-size:12px; font-weight:800; transition:.18s ease; }
  .control-btn:hover:not(:disabled) { transform:translateY(-1px); border-color:rgba(80,217,38,.42); background:rgba(80,217,38,.06); }
  .control-btn:disabled { opacity:.35; cursor:not-allowed; }
  .control-btn.danger:hover:not(:disabled) { border-color:rgba(255,95,98,.45); background:rgba(255,95,98,.06); }
  .control-btn ha-icon { --mdc-icon-size:18px; }
  .select-wrap { padding:0 17px 17px; }
  .select-wrap select { width:100%; min-height:42px; border-radius:12px; color:var(--bd-text); background:#0b120e; border:1px solid var(--bd-border); padding:0 10px; }
  .energy-body { padding:14px 17px 17px; }
  .energy-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px; }
  .energy-stat { padding:11px; border-radius:13px; border:1px solid rgba(255,255,255,.045); background:rgba(255,255,255,.02); }
  .energy-stat small { color:var(--bd-muted); display:block; font-size:9px; letter-spacing:.07em; text-transform:uppercase; }
  .energy-stat strong { display:block; margin-top:5px; font-size:14px; }
  .spark { width:100%; height:76px; margin-top:12px; display:block; overflow:visible; }
  .spark polyline { fill:none; stroke:var(--bd-accent); stroke-width:2.25; vector-effect:non-scaling-stroke; filter:drop-shadow(0 0 5px rgba(80,217,38,.25)); }
  .spark line { stroke:rgba(255,255,255,.055); stroke-width:1; }
  .maintenance { padding:14px 17px 17px; display:grid; gap:9px; }
  .maint-item { padding:10px 11px; border-radius:13px; border:1px solid rgba(255,255,255,.045); background:rgba(255,255,255,.02); }
  .maint-top { display:flex; justify-content:space-between; gap:10px; font-size:11px; }
  .maint-top strong { font-size:12px; }
  .bar { height:5px; border-radius:999px; background:#1b2821; overflow:hidden; margin-top:8px; }
  .bar > span { display:block; height:100%; background:linear-gradient(90deg,var(--bd-accent),var(--bd-accent-2)); border-radius:inherit; }
  .empty { padding:20px 17px; color:var(--bd-muted); font-size:12px; text-align:center; }
  .empty ha-icon { display:block; margin:0 auto 9px; --mdc-icon-size:30px; color:#647067; }
  .error-panel { padding:18px; border-radius:16px; background:rgba(255,95,98,.07); border:1px solid rgba(255,95,98,.22); color:#ffd2d3; }
  .notice { padding:12px 14px; border-radius:14px; background:rgba(80,217,38,.055); border:1px solid rgba(80,217,38,.15); color:#c9d4ce; font-size:11px; line-height:1.5; }
  .editor { padding:16px; color:var(--primary-text-color); }
  .editor h3 { margin:0 0 12px; }
  .editor-section { margin:14px 0; padding:13px; border:1px solid var(--divider-color); border-radius:12px; }
  .editor-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px; }
  .editor label { display:block; font-size:12px; margin-bottom:5px; color:var(--secondary-text-color); }
  .editor select, .editor input { width:100%; min-height:38px; border-radius:8px; border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); padding:0 8px; }
  .editor .help { font-size:12px; color:var(--secondary-text-color); line-height:1.45; }
  @container (max-width: 1180px) {
    .layout { grid-template-columns:1fr; }
    .right { grid-template-columns:repeat(3,minmax(0,1fr)); }
    .right .camera-panel { grid-column:span 2; }
    .hero-body { grid-template-columns:minmax(220px,.9fr) minmax(180px,.7fr) minmax(260px,1.2fr); }
  }
  @container (max-width: 860px) {
    .shell { padding:16px; border-radius:20px; }
    .hero-body { grid-template-columns:1fr 1fr; }
    .task { grid-column:1 / -1; }
    .right { grid-template-columns:1fr 1fr; }
    .right .camera-panel { grid-column:1 / -1; }
  }
  @container (max-width: 640px) {
    .shell { padding:12px; border-radius:16px; }
    .header { align-items:flex-start; }
    .header-meta { display:none; }
    .brand h1 { font-size:20px; }
    .tabs { margin-inline:-2px; }
    .hero-body { grid-template-columns:1fr; padding:12px; }
    .task { grid-column:auto; }
    .printer-visual { min-height:210px; }
    .progress-wrap { min-height:170px; }
    .progress-ring { width:168px; }
    .grid-2, .right { grid-template-columns:1fr; }
    .right .camera-panel { grid-column:auto; }
    .spools { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .energy-stats { grid-template-columns:1fr 1fr; }
    .energy-stat:last-child { grid-column:span 2; }
    .metric-grid { grid-template-columns:1fr 1fr; }
    .editor-row { grid-template-columns:1fr; }
  }
  @container (max-width: 420px) {
    .shell { padding:10px; }
    .panel-head { padding:14px 14px 0; }
    .metric-grid, .energy-stats { grid-template-columns:1fr; }
    .energy-stat:last-child { grid-column:auto; }
    .controls { grid-template-columns:1fr; }
    .spools { grid-template-columns:1fr; }
  }

  /* v1.0.3 cockpit navigation + true card-container responsiveness */
  .app-grid { position:relative; z-index:1; display:grid; grid-template-columns:210px minmax(0,1fr); gap:18px; }
  .sidebar { position:sticky; top:10px; align-self:start; display:flex; flex-direction:column; gap:14px; min-width:0; }
  .side-brand { padding:15px; border:1px solid var(--bd-border); border-radius:18px; background:linear-gradient(180deg,rgba(17,26,22,.95),rgba(7,13,10,.95)); }
  .side-brand-row { display:flex; align-items:center; gap:10px; }
  .side-title { font-size:16px; font-weight:900; letter-spacing:.04em; }
  .side-sub { margin-top:3px; font-size:9px; color:var(--bd-muted); text-transform:uppercase; letter-spacing:.13em; }
  .nav { display:grid; gap:7px; }
  .nav-btn { width:100%; cursor:pointer; touch-action:manipulation; border:1px solid transparent; background:transparent; border-radius:13px; padding:11px 12px; display:flex; align-items:center; gap:10px; text-align:left; color:var(--bd-muted); transition:.16s ease; }
  .nav-btn:hover { color:var(--bd-text); background:rgba(255,255,255,.025); }
  .nav-btn.active { color:#d7ffd0; border-color:rgba(80,217,38,.35); background:linear-gradient(90deg,rgba(80,217,38,.15),rgba(80,217,38,.035)); box-shadow:inset 3px 0 0 var(--bd-accent); }
  .nav-btn ha-icon { --mdc-icon-size:19px; color:var(--bd-accent); }
  .nav-btn span { font-size:12px; font-weight:800; }
  .side-printers { padding:12px; border:1px solid var(--bd-border); border-radius:16px; background:rgba(255,255,255,.018); }
  .side-label { margin:0 0 8px 3px; color:var(--bd-muted); font-size:9px; text-transform:uppercase; letter-spacing:.14em; font-weight:900; }
  .printer-switch { display:grid; gap:6px; }
  .printer-switch .tab { width:100%; justify-content:flex-start; padding:8px 9px; border-radius:11px; }
  .side-footer { color:#6f7b74; font-size:9px; line-height:1.45; padding:0 4px; }
  .workspace { min-width:0; }
  .workspace-head { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:14px; }
  .workspace-title h2 { margin:0; font-size:clamp(19px,2.2vw,28px); line-height:1.05; }
  .workspace-title p { margin:5px 0 0; color:var(--bd-muted); font-size:11px; }
  .view-grid { display:grid; gap:14px; }
  .overview-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(300px,.65fr); gap:14px; align-items:start; }
  .overview-main,.overview-side { display:grid; gap:14px; min-width:0; }
  .wide-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
  .mobile-nav { display:none; }
  .hero-body { grid-template-columns:minmax(180px,.85fr) minmax(175px,.7fr) minmax(240px,1.2fr); }
  .shell { width:100%; max-width:none; margin:0; }
  @container (max-width: 1050px) {
    .app-grid { grid-template-columns:170px minmax(0,1fr); gap:12px; }
    .overview-grid { grid-template-columns:1fr; }
    .hero-body { grid-template-columns:minmax(160px,.9fr) minmax(160px,.75fr); }
    .hero-body .task { grid-column:1/-1; }
  }
  @container (max-width: 760px) {
    .shell { padding:12px; border-radius:20px; overflow-anchor:none; }
    .app-grid { display:block; }
    .sidebar { position:static; }
    .side-brand,.sidebar > .nav,.side-footer { display:none; }
    .side-printers { padding:8px; margin-bottom:8px; overflow-x:auto; overflow-y:hidden; -webkit-overflow-scrolling:touch; touch-action:pan-x; overscroll-behavior-x:contain; }
    .side-printers .side-label { display:none; }
    .printer-switch { display:flex; min-width:max-content; }
    .printer-switch .tab { width:auto; }
    .mobile-nav { display:flex; overflow-x:auto; overflow-y:hidden; gap:6px; padding:3px 0 10px; scrollbar-width:none; -webkit-overflow-scrolling:touch; touch-action:pan-x; overscroll-behavior-x:contain; position:relative; z-index:5; }
    .mobile-nav .nav-btn { width:auto; flex:0 0 auto; padding:8px 10px; }
    .workspace-head { align-items:flex-start; }
    .workspace-title p { display:none; }
    .wide-grid { grid-template-columns:1fr; }
    .hero-body { grid-template-columns:1fr; }
    .hero-body .task { grid-column:auto; }
    .printer-visual { min-height:210px; }
    .printer-product-image { width:auto; height:auto; max-height:190px; max-width:92%; }
  }
  @container (max-width: 460px) {
    .workspace-head .header-meta .pill:last-child { display:none; }
    .progress-ring { width:175px; }
    .metric-grid { grid-template-columns:1fr 1fr; }
    .panel-head { padding:14px 14px 0; }
    .camera-wrap { margin:12px 14px 14px; }
  }

  .fleet-page { display:grid; gap:16px; }
  .fleet-summary { display:flex; align-items:end; justify-content:space-between; gap:14px; padding:4px 2px 2px; }
  .fleet-summary h2 { margin:2px 0 3px; font-size:28px; }
  .fleet-summary p { margin:0; color:var(--bd-muted); }
  .fleet-summary-badges { display:flex; gap:8px; flex-wrap:wrap; }
  .fleet-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:14px; }
  .fleet-card { min-width:0; overflow:hidden; border:1px solid var(--bd-border); border-radius:18px; background:linear-gradient(180deg,rgba(17,26,22,.96),rgba(8,13,11,.98)); padding:16px; box-shadow:inset 0 1px 0 rgba(255,255,255,.025); cursor:pointer; transition:.18s ease; }
  .fleet-card:hover { border-color:rgba(80,217,38,.46); transform:translateY(-1px); }
  .fleet-top { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .fleet-name { font-size:20px; font-weight:800; margin-top:2px; }
  .fleet-main { display:grid; grid-template-columns:128px minmax(0,1fr); gap:14px; align-items:center; margin:12px 0; }
  .fleet-visual { height:128px; display:grid; place-items:center; position:relative; border-radius:14px; background:rgba(0,0,0,.2); overflow:hidden; }
  .fleet-visual img { max-width:94%; max-height:118px; object-fit:contain; }
  .fleet-visual .printer-product-fallback { position:absolute; inset:0; place-items:center; display:none; font-size:48px; color:var(--bd-accent); }
  .fleet-progress { min-width:0; }
  .fleet-progress-number { font-size:38px; line-height:1; font-weight:900; letter-spacing:-.03em; }
  .fleet-progress-number span { font-size:18px; color:var(--bd-muted); margin-left:2px; }
  .fleet-bar { height:8px; border-radius:999px; overflow:hidden; margin:10px 0; background:#17231d; }
  .fleet-bar span { display:block; height:100%; background:linear-gradient(90deg,var(--bd-accent),var(--bd-accent-2)); border-radius:inherit; }
  .fleet-task { font-size:13px; color:var(--bd-muted); line-height:1.35; overflow-wrap:anywhere; }
  .fleet-idle-mark { font-size:34px !important; color:var(--bd-muted) !important; margin:0 !important; }
  .fleet-metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }
  .fleet-metrics > div { min-width:0; padding:9px; border:1px solid var(--bd-border); border-radius:11px; background:rgba(255,255,255,.018); }
  .fleet-metrics span { display:block; font-size:9px; text-transform:uppercase; letter-spacing:.1em; color:var(--bd-muted); margin-bottom:4px; }
  .fleet-metrics strong { display:block; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .fleet-detail { width:100%; margin-top:12px; border:1px solid rgba(80,217,38,.26); border-radius:11px; background:rgba(80,217,38,.07); min-height:38px; display:flex; align-items:center; justify-content:center; gap:7px; cursor:pointer; font-weight:750; }
  .fleet-detail:hover { background:rgba(80,217,38,.13); }
  .detail-layout { display:grid; grid-template-columns:minmax(0,1.55fr) minmax(300px,.75fr); gap:14px; align-items:start; }
  .detail-main,.detail-side { display:grid; gap:14px; min-width:0; }
  @container (max-width:1050px) { .detail-layout { grid-template-columns:1fr; } }
  @container (max-width:760px) { .fleet-grid { grid-template-columns:1fr; } .fleet-summary { align-items:flex-start; flex-direction:column; } }
  @container (max-width:560px) { .fleet-main { grid-template-columns:1fr; } .fleet-visual { height:150px; } .fleet-visual img { max-height:142px; max-width:88%; } .fleet-metrics { grid-template-columns:1fr 1fr; } }
  @container (max-width:380px) { .fleet-metrics { grid-template-columns:1fr; } }

  .editor-title-row { display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .editor-sub { margin-top:13px; padding-top:11px; border-top:1px solid var(--divider-color); }
  .editor-checks { display:flex; gap:14px; flex-wrap:wrap; margin-top:7px; }
  .check { display:flex !important; align-items:center; gap:6px; font-size:12px !important; margin:0 !important; cursor:pointer; }
  .check input { width:auto !important; min-height:0 !important; }
  .ams-editor { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; margin-top:8px; }
  .ams-option { padding:8px 9px; border:1px solid var(--divider-color); border-radius:9px; }
  .ams-option small { color:var(--secondary-text-color); }
  @container (max-width:600px) { .ams-editor { grid-template-columns:1fr; } }

  /* v1.4.0: robust overview card layout; intentionally uses separate fallback classes. */
  .fleet-card { overflow:hidden; }
  .fleet-main { display:grid; grid-template-columns:minmax(110px,150px) minmax(0,1fr); gap:16px; align-items:center; margin:14px 0; }
  .fleet-visual { height:136px; min-height:136px; position:relative; overflow:hidden; }
  .fleet-visual img { width:auto; height:auto; max-width:94%; max-height:94%; object-fit:contain; object-position:center; display:block; }
  .fleet-fallback { width:100%; height:100%; display:grid; place-items:center; color:rgba(80,217,38,.62); }
  .fleet-fallback ha-icon { --mdc-icon-size:72px; }
  .fleet-progress { align-self:center; min-width:0; overflow:hidden; }
  .fleet-task { display:block; min-height:36px; max-height:54px; overflow:hidden; overflow-wrap:anywhere; }
  .fleet-metrics { position:relative; z-index:2; }
  @container (max-width:620px) {
    .fleet-main { grid-template-columns:88px minmax(0,1fr); gap:11px; align-items:center; }
    .fleet-visual { height:104px; min-height:104px; }
    .fleet-visual img { width:100%; height:100%; object-fit:contain; object-position:center; object-position:center; }
    .fleet-fallback ha-icon { --mdc-icon-size:54px; }
    .fleet-progress-number { font-size:30px; }
    .fleet-metrics { grid-template-columns:repeat(2,minmax(0,1fr)); }
  }
  @container (max-width:350px) {
    .fleet-main { grid-template-columns:1fr; }
    .fleet-visual { height:128px; min-height:128px; }
    .fleet-metrics { grid-template-columns:1fr 1fr; }
  }
  .custom-image-hint { color:var(--secondary-text-color); font-size:11px; margin-top:4px; line-height:1.35; }
  .entity-override-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; margin-top:8px; }
  .entity-override-grid label { min-width:0; }
  .entity-override-grid input { width:100%; }
  details.editor-sub summary { cursor:pointer; font-weight:700; }
  @container (max-width:620px) { .entity-override-grid { grid-template-columns:1fr; } }

`;


class BambuLabDashboard extends HTMLElement {
  static getStubConfig() { return {}; }
  static async getConfigElement() {
    if (!customElements.get("bambu-lab-dashboard-editor")) customElements.define("bambu-lab-dashboard-editor", BambuLabDashboardEditor);
    return document.createElement("bambu-lab-dashboard-editor");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._devices = [];
    this._entities = [];
    this._printers = [];
    this._selectedPrinterId = null;
    this._activeView = "overview";
    this._loaded = false;
    this._loading = false;
    this._loadError = null;
    this._cameraBust = Date.now();
    this._maintenanceModalTask = null;
    this._maintenanceLogPage = 1;
    this._maintenanceLogFilter = "all";
    this._maintenanceLogRecentOnly = false;
    this._maintenanceToast = "";
    this._maintenanceToastTimer = null;
    this._powerSamples = new Map();
    this._lastPowerSampleAt = new Map();
    this._selectedSpoolEntityId = null;
    this._lastRenderSignature = "";
    this._mobileTouchActive = false;
    this._renderDirtyDuringTouch = false;
    this._touchGuardBound = false;
    this._touchReleaseTimer = null;
  }

  setConfig(config) {
    this._config = { ...config };
    if (!this._config.type) this._config.type = "custom:bambu-lab-dashboard";
    this._render();
  }

  set hass(hass) {
    const previous = this._hass;
    this._hass = hass;
    if (!this._loaded && !this._loading) this._discover();
    if (this._loaded) {
      this._samplePower();
      if (previous !== hass) {
        if (this._mobileTouchActive) this._renderDirtyDuringTouch = true;
        else this._scheduleRender();
      }
    }
  }

  getCardSize() { return 12; }
  getGridOptions() {
    // Full width means the full width of the current Home Assistant section.
    // A wider dashboard requires a wider section or a Panel view; a card cannot resize its parent section.
    return { columns: 12, min_columns: 6, max_columns: 12 };
  }

  connectedCallback() {
    if (!this._rediscoverTimer) this._rediscoverTimer = setInterval(() => this._discover(false), 60000);
    if (!this._touchGuardBound) {
      this._touchGuardBound = true;
      this.addEventListener("touchstart", () => {
        this._mobileTouchActive = true;
        if (this._touchReleaseTimer) clearTimeout(this._touchReleaseTimer);
      }, { passive:true });
      const release = () => {
        if (this._touchReleaseTimer) clearTimeout(this._touchReleaseTimer);
        this._touchReleaseTimer = setTimeout(() => {
          this._mobileTouchActive = false;
          if (this._renderDirtyDuringTouch) {
            this._renderDirtyDuringTouch = false;
            this._scheduleRender();
          }
        }, 220);
      };
      this.addEventListener("touchend", release, { passive:true });
      this.addEventListener("touchcancel", release, { passive:true });
    }
  }

  disconnectedCallback() {
    if (this._rediscoverTimer) clearInterval(this._rediscoverTimer);
    this._rediscoverTimer = null;
    if (this._touchReleaseTimer) clearTimeout(this._touchReleaseTimer);
    this._touchReleaseTimer = null;
  }

  async _discover(showLoading = true) {
    if (!this._hass || this._loading) return;
    this._loading = true;
    this._loadError = null;
    if (showLoading) this._render();
    try {
      const [devices, entities] = await Promise.all([
        this._hass.callWS({ type: "config/device_registry/list" }),
        this._hass.callWS({ type: "config/entity_registry/list" }),
      ]);
      this._devices = Array.isArray(devices) ? devices : [];
      this._entities = Array.isArray(entities) ? entities : [];
      this._printers = buildPrinterModels(this._devices, this._entities);
      if (!this._selectedPrinterId || !this._printers.some((p) => p.id === this._selectedPrinterId)) {
        this._selectedPrinterId = this._printers[0]?.id || null;
      }
      this._loaded = true;
    } catch (err) {
      this._loadError = err?.message || String(err);
    } finally {
      this._loading = false;
      this._render();
    }
  }

  _visiblePrinters() {
    return this._printers.filter((p) => printerIsVisible(this._config, p)).sort((a,b) => {
      const ai = this._printers.indexOf(a), bi = this._printers.indexOf(b);
      const ao = configuredPrinterOrder(this._config, a, ai), bo = configuredPrinterOrder(this._config, b, bi);
      if (ao !== bo) return ao - bo;
      return configuredPrinterName(this._config, a).localeCompare(configuredPrinterName(this._config, b), "de");
    });
  }

  _selectedPrinter() {
    const visible = this._visiblePrinters();
    return visible.find((p) => p.id === this._selectedPrinterId) || visible[0] || null;
  }

  _entityEntries(printer) {
    if (!printer) return [];
    const merged = new Map();
    for (const e of [...(printer.entries || []), ...(printer.childEntries || [])]) if (e?.entity_id) merged.set(e.entity_id, e);
    // Controls and nozzle/toolhead entities can live on child devices. Merge the complete printer tree.
    const allowedDeviceIds = new Set([printer.id, ...(printer.descendants || [])]);
    for (const e of Object.values(this._hass?.entities || {})) {
      if (!e?.entity_id || !allowedDeviceIds.has(e.device_id)) continue;
      const prev = merged.get(e.entity_id) || {};
      merged.set(e.entity_id, { ...prev, ...e });
    }
    return [...merged.values()];
  }
  _findExactEntity(printer, domain, keys) {
    const wanted = new Set((keys || []).map(normalize));
    const candidates = this._entityEntries(printer).filter((e) => {
      if (!e?.entity_id || e.entity_id.split(".")[0] !== domain) return false;
      const tk = normalize(e.translation_key);
      const uid = normalize(e.unique_id);
      const eid = normalize(e.entity_id.split(".")[1]);
      return [...wanted].some((k) => tk === k || entitySuffixMatches(uid, k) || eid === k || eid.endsWith(`_${k}`));
    });
    candidates.sort((a,b) => {
      const sa = this._hass?.states?.[a.entity_id] ? 1 : 0;
      const sb = this._hass?.states?.[b.entity_id] ? 1 : 0;
      return sb-sa;
    });
    return candidates[0] || null;
  }

  _controlEntity(printer, key) {
    const override = this._configuredEntityId(printer, key);
    if (override) return { entity_id: override, ...(this._hass?.entities?.[override] || {}) };
    const spec = {
      pause:["button",["pause"]], resume:["button",["resume"]], stop:["button",["stop"]],
      chamberLight:["light",["chamber_light"]],
      targetNozzleControl:["number",["target_nozzle_temperature"]],
      targetBedControl:["number",["target_bed_temperature"]],
      targetChamberControl:["number",["target_chamber_temperature"]],
      coolingFanControl:["fan",["cooling_fan"]], auxFanControl:["fan",["aux_fan"]],
      chamberFanControl:["fan",["chamber_fan"]], secondaryAuxFanControl:["fan",["secondary_aux_fan"]],
      speed:["select",["printing_speed","speed"]], airductMode:["select",["airduct_mode"]],
      cameraSwitch:["switch",["camera"]], imageCameraSwitch:["switch",["imagecamera"]], promptSound:["switch",["prompt_sound"]],
      buzzerSilence:["button",["buzzer_silence"]], buzzerFire:["button",["buzzer_fire_alarm"]], buzzerBeep:["button",["buzzer_beeping"]]
    }[key];
    return spec ? this._findExactEntity(printer, spec[0], spec[1]) : this._entry(printer,key);
  }

  _writeRestriction(printer) {
    const hybrid = this._findExactEntity(printer, "binary_sensor", ["hybrid_mode_blocks_control"]);
    const dev = this._findExactEntity(printer, "binary_sensor", ["developer_lan_mode"]);
    const enc = this._findExactEntity(printer, "binary_sensor", ["mqtt_encryption"]);
    const stateOf=(e)=>normalize(e?.entity_id ? this._hass?.states?.[e.entity_id]?.state : "");
    const restricted = stateOf(hybrid)==="on" || (stateOf(enc)==="on" && stateOf(dev)!=="on");
    return { restricted, hybrid, dev, enc, hybridState:stateOf(hybrid), developerState:stateOf(dev), encryptionState:stateOf(enc) };
  }

  _totalUsageState(printer) {
    const override=this._configuredEntityId(printer,"totalUsage");
    const reg=override?{entity_id:override}:this._findExactEntity(printer,"sensor",["total_usage_hours"]);
    const st=reg?.entity_id?this._hass?.states?.[reg.entity_id]:null;
    const key=`bambu-dashboard-total-usage:${printer.id}`;
    if (st && hasMeaningfulValue(st)) {
      try { localStorage.setItem(key, JSON.stringify({state:st.state,attributes:st.attributes,entity_id:reg.entity_id,ts:Date.now()})); } catch(_) {}
      return { state:st, entity:reg, cached:false };
    }
    try { const c=JSON.parse(localStorage.getItem(key)||"null"); if(c){return {state:{entity_id:c.entity_id,state:c.state,attributes:c.attributes||{}},entity:{entity_id:c.entity_id},cached:true,ts:c.ts};} } catch(_) {}
    return {state:null,entity:reg,cached:false};
  }

  _configuredEntityId(printer, key) {
    const field = ENTITY_OVERRIDE_FIELDS[key];
    if (!field) return null;
    const cfg = resolveConfiguredPrinter(this._config, printer?.id);
    return String(cfg?.[field] || "").trim() || null;
  }
  _entry(printer, key) {
    const override = this._configuredEntityId(printer, key);
    if (override) {
      const runtime = this._hass?.entities?.[override];
      return runtime ? { ...runtime, entity_id: override } : { entity_id: override };
    }
    return findRegistryEntry(this._entityEntries(printer), ENTITY_KEYS[key] || []);
  }
  _st(printer, key) {
    const reg = this._entry(printer, key);
    return reg?.entity_id ? this._hass?.states?.[reg.entity_id] || null : null;
  }
  _val(printer, key, fallback = null) {
    const st = this._st(printer, key);
    if (!st || isUnavailableState(st)) return fallback;
    return st.state;
  }
  _num(printer, key, fallback = null) {
    const v = this._val(printer, key, null);
    if (v === null) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  _isPrinterOnline(printer) {
    if (!printer) return false;
    const status = normalize(this._val(printer, "status", ""));
    if (["offline","unavailable","disconnected"].includes(status)) return false;
    const online = this._st(printer, "online");
    if (online && hasMeaningfulValue(online)) {
      const v = normalize(online.state);
      if (["off","offline","false","0","disconnected"].includes(v)) return false;
      if (["on","online","true","1","connected"].includes(v)) return true;
    }
    return !this._entityEntries(printer).every((e) => isUnavailableState(this._hass?.states?.[e.entity_id]));
  }

  _isPrinterActive(printer) {
    if (!this._isPrinterOnline(printer)) return false;
    const status = normalize(this._val(printer, "status", ""));
    if (["running","printing","prepare","preparing","pause","paused"].includes(status)) return true;
    const progress = safePercent(this._num(printer, "progress", 0));
    // Fallback only for integrations/firmware that temporarily report an unknown state.
    return (!status || status === "unknown") && progress > 0 && progress < 100;
  }

  _samplePower() {
    const printer = this._selectedPrinter();
    if (!printer || !this._hass) return;
    const cfg = resolveConfiguredPrinter(this._config, printer.id);
    const id = cfg.power_entity;
    if (!id) return;
    const st = this._hass.states[id];
    if (!hasMeaningfulValue(st)) return;
    const value = Number(st.state);
    if (!Number.isFinite(value)) return;
    const now = Date.now();
    const last = this._lastPowerSampleAt.get(printer.id) || 0;
    if (now - last < 15000) return;
    const arr = this._powerSamples.get(printer.id) || [];
    arr.push({ t: now, v: value });
    while (arr.length > 60) arr.shift();
    this._powerSamples.set(printer.id, arr);
    this._lastPowerSampleAt.set(printer.id, now);
  }

  _cameraUrl(printer, cameraReg = null) {
    const reg = cameraReg || this._findExactEntity(printer, "camera", ["camera"]) || this._entry(printer, "camera");
    const st = reg?.entity_id ? this._hass?.states?.[reg.entity_id] || null : null;
    if (!st) return null;
    const entityId = st.entity_id;
    const token = st.attributes?.access_token;
    // X2D and other RTSP cameras should be consumed through HA's stream proxy.
    if (entityId && token) return `/api/camera_proxy_stream/${entityId}?token=${encodeURIComponent(token)}&v=${this._cameraBust}`;
    const picture = st.attributes?.entity_picture;
    if (picture) return `${picture}${picture.includes("?") ? "&" : "?"}v=${this._cameraBust}`;
    if (entityId) return `/api/camera_proxy/${entityId}?v=${this._cameraBust}`;
    return null;
  }

  _imageUrl(printer) {
    const st = this._st(printer, "coverImage");
    if (!st) return null;
    const picture = st.attributes?.entity_picture;
    if (picture) return `${picture}${picture.includes("?") ? "&" : "?"}v=${this._cameraBust}`;
    return null;
  }

  _printerArtworkUrl(printer) {
    // Use the same model-art source as the Bambu cards bundled with greghesp/ha-bambulab.
    // Prefer exact upstream model art; A2L falls back to an official Bambu A2L product image because the cards repo currently has no dedicated A2L PNG.
    return printerArtworkUrl(printer?.device);
  }

  _captureScrollState() {
    const list = [];
    const seen = new Set();
    const add = (el) => { if (el && !seen.has(el)) { seen.add(el); list.push([el, el.scrollTop, el.scrollLeft]); } };
    add(document.scrollingElement);
    try { if (document.documentElement) add(document.documentElement); if (document.body) add(document.body); } catch (_) {}
    let node = this;
    for (let i=0; node && i<16; i++) {
      const root = node.getRootNode?.();
      const parent = node.parentElement || (root && root.host) || null;
      if (!parent || parent === node) break;
      try {
        const cs = getComputedStyle(parent);
        if ((/(auto|scroll|overlay)/).test(cs.overflowY) && parent.scrollHeight > parent.clientHeight) add(parent);
      } catch (_) {}
      node = parent;
    }
    return list;
  }

  _restoreScrollState(state) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      for (const [el, top, left] of state || []) { try { el.scrollTop = top; el.scrollLeft = left; } catch (_) {} }
      try { const doc = (state||[]).find(([el])=>el===document.scrollingElement); if(doc) window.scrollTo(doc[2], doc[1]); } catch (_) {}
    }));
  }

  _scheduleRender() {
    if (this._renderPending) return;
    this._renderPending = true;
    requestAnimationFrame(() => { this._renderPending = false; this._render(); });
  }

  _render() {
    if (!this.shadowRoot) return;
    const scrollState = this._captureScrollState();
    const body = this._renderBody();
    this.shadowRoot.innerHTML = `<style>${styles}</style>${body}<div class="overlay-theme ${this._themeClass()}">${this._renderMaintenanceModal()}${this._renderSelectedSpoolDetail()}</div>`;
    applyUiTranslations(this.shadowRoot,this._hass);
    this._bindEvents();
    this._restoreScrollState(scrollState);
  }

  _navItems() {
    return [
      ["overview", "mdi:view-dashboard-outline", "Übersicht"],
      ["detail", "mdi:printer-3d", "Drucker-Details"],
      ["energy", "mdi:flash-outline", "Energie"],
      ["maintenance", "mdi:tools", "Wartung"],
    ];
  }

  _renderNav(mobile = false) {
    return `<div class="${mobile ? "mobile-nav" : "nav"}">${this._navItems().map(([id,icon,label]) => `<button class="nav-btn ${this._activeView === id ? "active" : ""}" data-view="${id}"><ha-icon icon="${icon}"></ha-icon><span>${label}</span></button>`).join("")}</div>`;
  }

  _renderPrinterOverviewCard(printer) {
    const rawProgress = safePercent(this._num(printer, "progress", 0));
    const statusRaw = this._val(printer, "status", "unknown");
    const taskRaw = this._val(printer, "taskName", null);
    const remaining = this._num(printer, "remainingTime", null);
    const nozzle = this._st(printer, "nozzleTemp");
    const bed = this._st(printer, "bedTemp");
    const product = this._printerArtworkUrl(printer);
    const amsCount = this._collectAmsGroups(printer).length;
    const isPrinting = this._isPrinterActive(printer);
    const progress = isPrinting ? rawProgress : 0;
    const task = isPrinting ? (taskRaw || "Aktiver Druckauftrag") : "Kein aktiver Druckauftrag";
    const name = configuredPrinterName(this._config, printer);
    return `<article class="fleet-card" data-open-printer="${cssEscape(printer.id)}">
      <div class="fleet-top"><div><div class="eyebrow">${cssEscape(printer.device?.model || "Bambu Lab")}</div><div class="fleet-name">${cssEscape(name)}</div></div><div class="status-badge ${statusClass(statusRaw)}"><span class="dot"></span>${cssEscape(translateStatus(statusRaw))}</div></div>
      <div class="fleet-main">
        <div class="fleet-visual">${product ? `<img data-printer-image src="${cssEscape(product)}" alt="${cssEscape(printer.device?.model || name)}"><div class="fleet-fallback" style="display:none"><ha-icon icon="mdi:printer-3d"></ha-icon></div>` : `<div class="fleet-fallback"><ha-icon icon="mdi:printer-3d"></ha-icon></div>`}</div>
        <div class="fleet-progress"><div class="fleet-progress-number">${isPrinting ? `${formatNumber(progress)}<span>%</span>` : `<span class="fleet-idle-mark">–</span>`}</div><div class="fleet-bar"><span style="width:${isPrinting ? progress : 0}%"></span></div><div class="fleet-task">${cssEscape(task)}</div></div>
      </div>
      <div class="fleet-metrics">
        <div><span>Restzeit</span><strong>${!isPrinting || remaining === null ? "–" : formatDurationMinutes(remaining)}</strong></div>
        <div><span>Düse</span><strong>${this._formatStateWithUnit(nozzle)}</strong></div>
        <div><span>Bett</span><strong>${this._formatStateWithUnit(bed)}</strong></div>
        <div><span>AMS</span><strong>${amsCount || "–"}</strong></div><div><span>Laufzeit</span><strong>${this._formatDurationState(this._totalUsageState(printer).state)}</strong></div>
      </div>
      <button class="fleet-detail" data-open-printer="${cssEscape(printer.id)}">Details öffnen <ha-icon icon="mdi:arrow-right"></ha-icon></button>
    </article>`;
  }

  _renderFleetOverview() {
    const printers = this._visiblePrinters();
    const printing = printers.filter((p) => this._isPrinterActive(p)).length;
    return `<div class="fleet-page"><section class="fleet-summary"><div><div class="eyebrow">Control Center</div><h2>Alle Drucker</h2><p>${printers.length} ${printers.length === 1 ? "Drucker" : "Drucker"} erkannt · ${printing} aktiv</p></div><div class="fleet-summary-badges"><span class="pill ok"><span class="dot"></span>${printing} druckt</span><span class="pill">${printers.length} gesamt</span></div></section><div class="fleet-grid">${printers.map((p) => this._renderPrinterOverviewCard(p)).join("")}</div></div>`;
  }

  _renderView(printer) {
    if (this._activeView === "overview") return this._renderFleetOverview();
    if (!printer) return `<section class="panel"><div class="empty">Kein Drucker ausgewählt.</div></section>`;
    if (this._activeView === "energy") return `<div class="view-grid">${this._renderEnergy(printer)}</div>`;
    if (this._activeView === "maintenance") return `<div class="view-grid">${this._renderMaintenance(printer)}${this._renderInfo(printer)}</div>`;
    return `<div class="detail-layout"><div class="detail-main">${this._renderHero(printer)}${this._renderCurrentPrint(printer)}<div class="wide-grid">${this._renderTemperatures(printer)}${this._renderInfo(printer)}</div>${printerSectionEnabled(this._config, printer, "ams") ? this._renderAMS(printer) : ""}</div><div class="detail-side">${printerSectionEnabled(this._config, printer, "camera") ? this._renderCamera(printer) : ""}${this._renderControls(printer)}${printerSectionEnabled(this._config, printer, "energy") ? this._renderEnergy(printer) : ""}${printerSectionEnabled(this._config, printer, "maintenance") ? this._renderMaintenance(printer) : ""}</div></div>`;
  }

  _themeClass() {
    const configured = String(this._config.theme || "auto").toLowerCase();
    if (configured === "light") return "theme-light";
    if (configured === "dark") return "theme-dark";
    return this._hass?.themes?.darkMode === false ? "theme-light" : "theme-dark";
  }

  _isInCardPicker() {
    let node = this;
    for (let i=0; node && i<18; i++) {
      const tag = String(node.tagName || "").toLowerCase();
      const cls = String(node.className || "").toLowerCase();
      if (tag.includes("card-picker") || tag.includes("card-preview") || cls.includes("card-picker")) return true;
      const root = node.getRootNode?.();
      node = node.parentElement || (root && root.host) || null;
    }
    return false;
  }

  _renderBody() {
    if (this._isInCardPicker()) return `<div class="picker-preview"><div class="picker-preview-icon"><ha-icon icon="mdi:printer-3d"></ha-icon></div><div><h3>Bambu Lab Dashboard</h3><p>Mehrdrucker-Control-Center mit AMS, Kamera, Steuerung, Energie und Wartung.</p></div></div>`;
    if (!this._hass || (this._loading && !this._loaded)) {
      return `<div class="shell"><div class="panel"><div class="empty"><ha-icon icon="mdi:printer-3d"></ha-icon>Bambu-Geräte werden automatisch erkannt …</div></div></div>`;
    }
    if (this._loadError) return `<div class="shell"><div class="error-panel"><strong>Geräteerkennung fehlgeschlagen</strong><br>${cssEscape(this._loadError)}</div></div>`;
    const visiblePrinters = this._visiblePrinters();
    if (!visiblePrinters.length) return `<div class="shell"><div class="panel"><div class="empty"><ha-icon icon="mdi:printer-3d-off"></ha-icon>Kein sichtbarer Bambu-Lab-Drucker gefunden.<br><br>Installiere und konfiguriere zuerst <strong>greghesp/ha-bambulab</strong>. Zusätzliche Lovelace-Karten sind nicht erforderlich.</div></div></div>`;

    const printer = this._selectedPrinter();
    if (!this._selectedPrinterId || !visiblePrinters.some((p)=>p.id===this._selectedPrinterId)) this._selectedPrinterId = printer?.id || null;
    const isOnline = this._isPrinterOnline(printer);
    const viewLabel = this._navItems().find((x) => x[0] === this._activeView)?.[2] || "Übersicht";
    const printers = visiblePrinters.map((p) => `<button class="tab ${p.id === printer?.id ? "active" : ""}" data-open-printer="${cssEscape(p.id)}"><ha-icon icon="mdi:printer-3d"></ha-icon><span>${cssEscape(configuredPrinterName(this._config,p))}</span></button>`).join("");

    const themeClass = this._themeClass();
    return `<div class="shell ${themeClass}"><div class="app-grid">
      <aside class="sidebar">
        <div class="side-brand"><div class="side-brand-row"><div class="brand-mark"><ha-icon icon="mdi:printer-3d"></ha-icon></div><div><div class="side-title">BAMBU LAB</div><div class="side-sub">HA Control Center</div></div></div></div>
        ${this._renderNav(false)}
        <div class="side-printers"><div class="side-label">Drucker</div><div class="printer-switch">${printers}</div></div>
        <div class="side-footer">v${VERSION}<br>Datenquelle: greghesp/ha-bambulab</div>
      </aside>
      <main class="workspace">
        ${this._renderNav(true)}
        <div class="workspace-head"><div class="workspace-title"><h2>${viewLabel}</h2><p>${this._activeView === "overview" ? "Status aller Drucker auf einen Blick" : `${cssEscape(configuredPrinterName(this._config,printer))} · ${cssEscape(printer?.device?.model || "Bambu Lab")}`}</p></div><div class="header-meta">${this._activeView !== "overview" ? `<span class="pill ${isOnline ? "ok" : ""}"><span class="dot"></span>${isOnline ? "Online" : "Offline"}</span>` : ""}<span class="pill">v${VERSION}</span></div></div>
        ${this._renderView(printer)}
      </main>
    </div></div>`;
  }

  _renderHero(printer) {
    const statusRaw = this._val(printer, "status", "unknown");
    const status = translateStatus(statusRaw);
    const active = this._isPrinterActive(printer);
    const progress = active ? safePercent(this._num(printer, "progress", 0)) : 0;
    const task = active ? this._val(printer, "taskName", "Aktiver Druckauftrag") : (this._isPrinterOnline(printer) ? "Kein aktiver Druckauftrag" : "Drucker offline");
    const remaining = active ? this._num(printer, "remainingTime", null) : null;
    const currentLayer = this._num(printer, "currentLayer", null);
    const totalLayers = this._num(printer, "totalLayers", null);
    const speed = this._val(printer, "speed", null);
    const cover = this._imageUrl(printer);
    const product = this._printerArtworkUrl(printer);
    const model = printer.device?.model || "Bambu Lab";
    const productVisual = product
      ? `<img class="printer-product-image" data-printer-image src="${cssEscape(product)}" alt="${cssEscape(model)}"><div class="printer-product-fallback"><ha-icon icon="mdi:printer-3d"></ha-icon></div>`
      : `<div class="printer-product-fallback" style="display:grid"><ha-icon icon="mdi:printer-3d"></ha-icon></div>`;
    return `<section class="panel glow">
      <div class="panel-head"><div><div class="eyebrow">Printer Status</div><div class="panel-title">${cssEscape(configuredPrinterName(this._config, printer))}</div></div></div>
      <div class="hero-body">
        <div class="printer-visual">${productVisual}${cover ? `<img class="print-cover-mini" src="${cover}" alt="Aktueller Druck">` : ""}<div class="printer-model-chip"><ha-icon icon="mdi:printer-3d-nozzle"></ha-icon>${cssEscape(model)}</div></div>
        <div class="progress-wrap"><div class="progress-ring" style="--p:${progress}"><div class="progress-inner"><div class="progress-number">${formatNumber(progress, 0)}<span>%</span></div><div class="status-badge ${statusClass(statusRaw)}"><span class="dot"></span>${cssEscape(status)}</div></div></div></div>
        <div class="task"><div class="task-name">${cssEscape(task)}</div><div class="task-meta"><span>${cssEscape(this._val(printer, "currentStage", status))}</span></div>${this._renderActiveFilament(printer)}
          <div class="metric-grid">
            <div class="metric"><div class="label">Restzeit</div><div class="value">${remaining === null ? "–" : formatDurationMinutes(remaining)}</div></div>
            <div class="metric"><div class="label">Layer</div><div class="value">${currentLayer === null ? "–" : formatNumber(currentLayer)}${totalLayers === null ? "" : ` / ${formatNumber(totalLayers)}`}</div></div>
            <div class="metric"><div class="label">Geschwindigkeit</div><div class="value">${speed === null ? "–" : cssEscape(speed)}</div></div>
            <div class="metric"><div class="label">WLAN</div><div class="value">${this._formatStateWithUnit(this._st(printer, "wifi"))}</div></div>
          </div>
        </div>
      </div>
    </section>`;
  }

  _renderCurrentPrint(printer) {
    const image = this._imageUrl(printer);
    if (!image) return "";
    const task = this._val(printer, "taskName", "Aktueller Druck");
    const progress = this._isPrinterActive(printer) ? safePercent(this._num(printer, "progress", 0)) : 0;
    const currentLayer = this._num(printer, "currentLayer", null);
    const totalLayers = this._num(printer, "totalLayers", null);
    return `<section class="panel job-art-panel"><div class="panel-head"><div><div class="eyebrow">Aktueller Druck</div><div class="panel-title">Bauteil / Vorschau</div></div></div><div class="job-art-body"><div class="job-art-image"><img src="${cssEscape(image)}" alt="${cssEscape(task)}"></div><div class="job-art-info"><h3>${cssEscape(task)}</h3>${this._renderActiveFilament(printer)}<p>${formatNumber(progress,0)} % abgeschlossen${currentLayer === null ? "" : ` · Layer ${formatNumber(currentLayer)}${totalLayers === null ? "" : ` / ${formatNumber(totalLayers)}`}`}</p></div></div></section>`;
  }

  _durationToHours(st) {
    if (!st || !hasMeaningfulValue(st)) return null;
    const n = Number(st.state);
    if (!Number.isFinite(n)) return null;
    const u = String(unit(st) || "h").toLowerCase();
    if (["s","sec","second","seconds"].includes(u)) return n / 3600;
    if (["min","minute","minutes"].includes(u)) return n / 60;
    if (["d","day","days"].includes(u)) return n * 24;
    if (["ms"].includes(u)) return n / 3600000;
    return n;
  }

  _formatDurationState(st) {
    const hours = this._durationToHours(st);
    if (hours === null) return "–";
    if (hours >= 100) return `${formatNumber(hours, 0)} h`;
    const whole = Math.floor(hours);
    const mins = Math.round((hours - whole) * 60);
    return whole > 0 ? `${whole} h${mins ? ` ${mins} min` : ""}` : `${mins} min`;
  }

  _renderTemperatures(printer) {
    const rows = [];
    const add = (label, icon, nowKey, targetKey) => {
      const now = this._st(printer, nowKey);
      const target = this._st(printer, targetKey);
      if (!now && !target) return;
      const nv = this._formatStateWithUnit(now);
      const tv = target && hasMeaningfulValue(target) ? this._formatStateWithUnit(target) : null;
      rows.push(`<div class="temp-row"><div class="row-label"><ha-icon icon="${icon}"></ha-icon>${label}</div><div class="row-value">${nv}${tv ? ` <span class="muted">/ ${tv}</span>` : ""}</div></div>`);
    };
    add("Düse", "mdi:printer-3d-nozzle-heat", "nozzleTemp", "targetNozzleTemp");
    add("Düse links", "mdi:printer-3d-nozzle-heat", "leftNozzleTemp", "leftTargetNozzleTemp");
    add("Düse rechts", "mdi:printer-3d-nozzle-heat", "rightNozzleTemp", "rightTargetNozzleTemp");
    add("Druckbett", "mdi:radiator", "bedTemp", "targetBedTemp");
    add("Kammer", "mdi:home-thermometer", "chamberTemp", "targetChamberTemp");
    const fans = [["Bauteillüfter", "coolingFan"], ["Aux-Lüfter", "auxFan"], ["Kammerlüfter", "chamberFan"]];
    for (const [label, key] of fans) {
      const st = this._st(printer, key);
      if (st) rows.push(`<div class="temp-row"><div class="row-label"><ha-icon icon="mdi:fan"></ha-icon>${label}</div><div class="row-value">${this._formatStateWithUnit(st)}</div></div>`);
    }
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Live</div><div class="panel-title">Temperaturen & Lüfter</div></div></div>${rows.length ? `<div class="temperature-list">${rows.join("")}</div>` : `<div class="empty">Keine passenden Temperatur- oder Lüfter-Entitäten vorhanden.</div>`}</section>`;
  }

  _renderInfo(printer) {
    const specs = [
      ["Druckgewicht", "mdi:weight-gram", "printWeight"],
      ["Drucklänge", "mdi:ruler", "printLength"],
      ["Druckplatte", "mdi:rectangle-outline", "bedType"],
      ["Gesamtlaufzeit", "mdi:clock-outline", "totalUsage"],
      ["MQTT", "mdi:lan-connect", "mqttMode"],
    ];
    const rows = [];
    for (const [label, icon, key] of specs) {
      const st = this._st(printer, key);
      if (!st) continue;
      const value = key === "totalUsage" ? this._formatDurationState(st) : this._formatStateWithUnit(st);
      rows.push(`<div class="info-row"><div class="row-label"><ha-icon icon="${icon}"></ha-icon>${label}</div><div class="row-value">${value}</div></div>`);
    }
    const door = this._st(printer, "doorOpen");
    if (door) rows.push(`<div class="info-row"><div class="row-label"><ha-icon icon="mdi:door"></ha-icon>Tür</div><div class="row-value">${String(door.state).toLowerCase() === "on" ? "Offen" : "Geschlossen"}</div></div>`);
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Details</div><div class="panel-title">Druckerinformationen</div></div></div>${rows.length ? `<div class="info-list">${rows.join("")}</div>` : `<div class="empty">Keine zusätzlichen Druckerinformationen vorhanden.</div>`}</section>`;
  }

  _renderCamera(printer) {
    const reg=this._findExactEntity(printer,"camera",["camera"]);
    const st=reg?.entity_id?this._hass?.states?.[reg.entity_id]:null;
    const cameraUrl = reg ? this._cameraUrl(printer, reg) : null;
    const camSwitch=this._controlEntity(printer,"cameraSwitch");
    const imgSwitch=this._controlEntity(printer,"imageCameraSwitch");
    const diag=reg?`<div class="control-warning" style="margin-top:0"><strong>Kamera-Diagnose</strong><div class="capability-list"><div class="capability-row"><span>Entity</span><code>${cssEscape(reg.entity_id)}</code></div><div class="capability-row"><span>HA-Status</span><code>${cssEscape(st?.state||"unbekannt")}</code></div><div class="capability-row"><span>Access-Token</span><code>${st?.attributes?.access_token?"vorhanden":"fehlt"}</code></div></div><div style="margin-top:8px"><button class="maint-source-link" data-more-info="${cssEscape(reg.entity_id)}">In Home Assistant öffnen</button></div></div>`:"";
    return `<section class="panel camera-panel"><div class="panel-head"><div><div class="eyebrow">Live Camera</div><div class="panel-title">Kamera</div></div></div><div class="camera-wrap">${cameraUrl ? `<img src="${cameraUrl}" alt="Live-Kamera von ${cssEscape(displayName(printer.device))}">` : `<div class="camera-empty"><ha-icon icon="mdi:cctv-off"></ha-icon>Keine Kamera-Entität verfügbar oder Kamera nicht aktiviert.</div>`}<div class="camera-actions"><button class="icon-btn" data-action="refresh-camera" title="Kamera aktualisieren"><ha-icon icon="mdi:refresh"></ha-icon></button></div></div>${diag}${(camSwitch||imgSwitch)?`<div class="control-groups" style="padding-top:0">${camSwitch?`<button class="toggle-row ${normalize(this._hass?.states?.[camSwitch.entity_id]?.state)==="on"?"on":""}" data-entity-action="${cssEscape(camSwitch.entity_id)}"><span>Kamera aktiv</span><strong>${normalize(this._hass?.states?.[camSwitch.entity_id]?.state)==="on"?"EIN":"AUS"}</strong></button>`:""}${imgSwitch?`<button class="toggle-row ${normalize(this._hass?.states?.[imgSwitch.entity_id]?.state)==="on"?"on":""}" data-entity-action="${cssEscape(imgSwitch.entity_id)}"><span>Einzelbild-Modus</span><strong>${normalize(this._hass?.states?.[imgSwitch.entity_id]?.state)==="on"?"EIN":"AUS"}</strong></button>`:""}</div>`:""}</section>`;
  }

  _renderAMS(printer) {
    const groups = this._collectAmsGroups(printer);
    if (!groups.length) return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Material System</div><div class="panel-title">AMS</div></div></div><div class="empty"><ha-icon icon="mdi:printer-3d-nozzle-alert-outline"></ha-icon>Kein AMS für diesen Drucker erkannt.</div></section>`;
    return `<section class="panel glow"><div class="panel-head"><div><div class="eyebrow">Material System</div><div class="panel-title">AMS · ${groups.length} ${groups.length === 1 ? "Einheit" : "Einheiten"}</div></div></div><div class="ams-list">${groups.map((g) => this._renderAmsUnit(g)).join("")}</div></section>`;
  }

  _collectAmsGroups(printer) {
    const cfg = resolveConfiguredPrinter(this._config, printer.id);
    const manual = Array.isArray(cfg.ams_device_ids) ? new Set(cfg.ams_device_ids) : null;
    const autoIds = new Set((printer.childDevices || []).map((d)=>d.id));
    const allowedIds = manual && manual.size ? manual : autoIds;
    const allAmsMap = new Map();
    for (const e of this._entities.filter(isBambuRegistryEntry)) if (e?.entity_id) allAmsMap.set(e.entity_id,e);
    for (const e of Object.values(this._hass?.entities || {})) if (e?.entity_id && e.platform===DOMAIN) allAmsMap.set(e.entity_id,{...(allAmsMap.get(e.entity_id)||{}),...e});
    const allEntries = [...allAmsMap.values()].filter((e)=>allowedIds.has(e.device_id));
    const byDevice = new Map();
    for (const entry of allEntries) {
      const marker = `${entry.unique_id || ""} ${entry.translation_key || ""} ${entry.original_name || ""}`;
      if (!/tray[_ -]?\d/i.test(marker) && !/ams/i.test(marker)) continue;
      const key = entry.device_id || "ams";
      if (!byDevice.has(key)) byDevice.set(key, []);
      byDevice.get(key).push(entry);
    }
    const groups = [];
    for (const [deviceId, entries] of byDevice.entries()) {
      const device = this._devices.find((d) => d.id === deviceId);
      const slots = [1,2,3,4].map((n) => this._extractTray(entries, n)).filter(Boolean);
      if (slots.length) groups.push({ device, entries, slots });
    }
    return groups;
  }

  _extractTray(entries, n) {
    const matches = entries.filter((e) => {
      const uid = String(e.unique_id || "");
      if (new RegExp(`tray[_ -]?${n}(?:$|[_-])`, "i").test(uid)) return true;
      if (normalize(e.translation_key) === "tray") {
        const st = this._hass.states[e.entity_id];
        return String(st?.attributes?.slot ?? "") === String(n);
      }
      return normalize(e.translation_key) === `tray_${n}`;
    });
    if (!matches.length) return null;
    const primary = matches.find((e) => /^sensor\./.test(e.entity_id) && this._hass.states[e.entity_id]) || matches.find((e)=>this._hass.states[e.entity_id]) || matches[0];
    const st = this._hass.states[primary.entity_id];
    const attrs = { ...(st?.attributes || {}) };
    for (const e of matches) {
      const state = this._hass.states[e.entity_id];
      if (!state) continue;
      Object.assign(attrs, state.attributes || {});
      const key = normalize(e.translation_key || e.unique_id);
      if (key.includes("remaining")) attrs.remaining_filament = state.state;
      if (key.includes("active")) attrs.active = String(state.state).toLowerCase() === "on";
    }
    const remaining = [attrs.remaining_filament, attrs.remain, attrs.remaining, attrs.tray_weight].map(Number).find(Number.isFinite);
    const name = attrs.name || attrs.filament_name || attrs.tray_sub_brands || attrs.tray_type || attrs.type || (st && !["unknown","unavailable"].includes(normalize(st.state)) ? st.state : null);
    const type = attrs.type || attrs.tray_type || attrs.filament_type || null;
    const color = colorFromAttributes(attrs) || "#7b887f";
    const active = attrs.active === true || attrs.is_active === true || String(attrs.active).toLowerCase() === "true";
    return { n, name: name || `Slot ${n}`, type, remaining, color, active, entityId: primary.entity_id, attributes: attrs, state: st?.state };
  }

  _renderAmsUnit(group) {
    const name = displayName(group.device || { name: "AMS" });
    return `<div class="ams-unit"><div class="ams-unit-head"><div class="ams-name">${cssEscape(name)}</div><span class="pill">${group.slots.length} Slots</span></div><div class="spools">${group.slots.map((s) => `<button class="spool ${s.active ? "active" : ""}" data-spool-entity="${cssEscape(s.entityId || "")}" data-spool-slot="${s.n}" title="Slot ${s.n} Details öffnen"><div class="spool-disc" style="--filament:${cssEscape(s.color)}"></div><div class="spool-title">${cssEscape(s.name)}</div><div class="spool-meta">${s.type ? cssEscape(s.type) : `Slot ${s.n}`}${Number.isFinite(s.remaining) ? ` · ${formatNumber(s.remaining,0)}%` : ""}</div></button>`).join("")}</div></div>`;
  }

  _renderSelectedSpoolDetail() {
    const entityId = this._selectedSpoolEntityId;
    if (!entityId) return "";
    const st = this._hass?.states?.[entityId];
    if (!st) return "";
    const attrs = st.attributes || {};
    const preferred = ["friendly_name","slot","tray_type","type","filament_type","tray_sub_brands","filament_name","tray_color","color","remaining_filament","remaining","tray_weight","nozzle_temp_min","nozzle_temp_max","tag_uid","tray_uuid"];
    const keys = [...preferred.filter((k)=>attrs[k] !== undefined), ...Object.keys(attrs).filter((k)=>!preferred.includes(k) && !["icon","entity_picture"].includes(k))];
    const rows = keys.map((k)=>`<div class="spool-detail-row"><small>${cssEscape(k.replaceAll("_"," "))}</small><strong>${cssEscape(Array.isArray(attrs[k]) ? attrs[k].join(", ") : typeof attrs[k] === "object" ? JSON.stringify(attrs[k]) : attrs[k])}</strong></div>`).join("");
    return `<div class="spool-modal-backdrop" data-close-spool-backdrop><div class="spool-modal" data-spool-modal-box><div class="spool-dialog-head"><div><div class="eyebrow">AMS Slot Details</div><div class="panel-title">${cssEscape(attrs.friendly_name || entityId)}</div></div><button class="dialog-close" data-close-spool-inline aria-label="Schließen">×</button></div><div class="spool-dialog-grid"><div class="spool-detail-row"><small>Status</small><strong>${cssEscape(st.state)}</strong></div>${rows}</div><button class="fleet-detail" data-more-info="${cssEscape(entityId)}">Home-Assistant-Details öffnen <ha-icon icon="mdi:open-in-new"></ha-icon></button></div></div>`;
  }

  _showSpoolDetail(entityId) {
    if (!entityId) return;
    this._selectedSpoolEntityId = entityId;
    this._render();
  }

  _showMoreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail:{ entityId }, bubbles:true, composed:true }));
  }

  _activeFilament(printer) {
    const activeReg=this._findExactEntity(printer,"sensor",["active_tray"]);
    const active=activeReg?.entity_id?this._hass?.states?.[activeReg.entity_id]:null;
    if (active && hasMeaningfulValue(active) && normalize(active.state)!=="none") {
      const a=active.attributes||{};
      return {name:a.name||active.state||"Filament",type:a.type||a.tray_type||"",color:colorFromAttributes(a)||"#8e9a92",remain:a.remain,source:activeReg.entity_id};
    }
    for (const e of this._entityEntries(printer)) {
      if (!e?.entity_id || !["sensor","binary_sensor"].includes(e.entity_id.split(".")[0])) continue;
      const st=this._hass?.states?.[e.entity_id]; if(!st) continue; const a=st.attributes||{};
      const isTray=normalize(e.translation_key)==="tray" || normalize(e.translation_key)==="external_spool" || /tray|external_spool/.test(normalize(e.entity_id));
      if(isTray && (a.active===true || normalize(a.active)==="true" || normalize(st.state)==="active")) return {name:a.name||st.state||"Filament",type:a.type||a.tray_type||"",color:colorFromAttributes(a)||"#8e9a92",remain:a.remain,source:e.entity_id};
    }
    return null;
  }

  _renderActiveFilament(printer) {
    const f=this._activeFilament(printer);
    if (!f) return `<div class="active-filament muted"><span class="filament-dot"></span><span>Aktives Filament nicht gemeldet</span></div>`;
    return `<div class="active-filament"><span class="filament-dot" style="--filament:${cssEscape(f.color)}"></span><span><strong>${cssEscape(f.name)}</strong>${f.type && normalize(f.type)!==normalize(f.name) ? ` · ${cssEscape(f.type)}` : ""}${Number.isFinite(Number(f.remain)) ? ` · ${formatNumber(f.remain)}%` : ""}</span></div>`;
  }

  _renderControls(printer) {
    const ce=(key)=>this._controlEntity(printer,key);
    const state=(r)=>r?.entity_id?this._hass?.states?.[r.entity_id]:null;
    const buttons=[[ce("pause"),"mdi:pause","Pause",false],[ce("resume"),"mdi:play","Fortsetzen",false],[ce("stop"),"mdi:stop","Stop",true],[ce("chamberLight"),"mdi:lightbulb","Licht",false],[ce("buzzerSilence"),"mdi:alarm-light-off-outline","Alarm aus",false],[ce("buzzerBeep"),"mdi:alarm-light-outline","Signalton",false]].filter(([r])=>r?.entity_id);
    const switches=[[ce("cameraSwitch"),"Kamera aktiv"],[ce("imageCameraSwitch"),"Kamera Einzelbilder"],[ce("promptSound"),"Hinweistöne"]].filter(([r])=>r?.entity_id);
    const numbers=[[ce("targetNozzleControl"),"Düse Soll"],[ce("targetBedControl"),"Bett Soll"],[ce("targetChamberControl"),"Kammer Soll"]].filter(([r])=>r?.entity_id);
    const fans=[[ce("coolingFanControl"),"Bauteillüfter"],[ce("auxFanControl"),"Aux-Lüfter"],[ce("chamberFanControl"),"Kammerlüfter"],[ce("secondaryAuxFanControl"),"Aux-Lüfter 2"]].filter(([r])=>r?.entity_id);
    const selects=[[ce("speed"),"Druckgeschwindigkeit"],[ce("airductMode"),"Luftkanal-Modus"]].filter(([r])=>r?.entity_id);
    const restriction=this._writeRestriction(printer);
    const writableCount=buttons.filter(([r])=>r.entity_id.split(".")[0]!=="light").length+switches.length+numbers.length+fans.length+selects.length;
    const warning=(restriction.restricted || writableCount===0) ? `<div class="control-warning"><strong>Schreibzugriffe sind für diesen Drucker eingeschränkt.</strong>Die offizielle ha-bambulab-Integration dokumentiert, dass bei gesperrter Firmware bzw. Hybrid-/Cloud-Betrieb die meisten Schreibfunktionen nicht bereitgestellt werden; bei älteren Hybrid-Firmwares bleibt ausdrücklich nur das Licht steuerbar. Für volle Schreibzugriffe verlangt die Integration LAN Mode + Developer LAN Mode. <a href="https://github.com/greghesp/ha-bambulab/blob/main/docs/index.mdx" target="_blank" rel="noopener">Plugin-Hinweis öffnen</a><div class="capability-list"><div class="capability-row"><span>Hybrid blockiert</span><code>${cssEscape(restriction.hybridState||"nicht gemeldet")}</code></div><div class="capability-row"><span>Developer LAN Mode</span><code>${cssEscape(restriction.developerState||"nicht gemeldet")}</code></div><div class="capability-row"><span>MQTT-Verschlüsselung</span><code>${cssEscape(restriction.encryptionState||"nicht gemeldet")}</code></div></div></div>` : "";
    const buttonHtml=buttons.length?`<div class="control-group"><div class="control-group-title">Druck & Gerät</div><div class="controls">${buttons.map(([r,i,l,d])=>`<button class="control-btn ${d?"danger":""}" data-entity-action="${cssEscape(r.entity_id)}"><ha-icon icon="${i}"></ha-icon>${l}</button>`).join("")}</div></div>`:"";
    const switchHtml=switches.length?`<div class="control-group"><div class="control-group-title">Schalter</div><div class="control-grid">${switches.map(([r,l])=>{const st=state(r),on=normalize(st?.state)==="on";return `<button class="toggle-row ${on?"on":""}" data-entity-action="${cssEscape(r.entity_id)}"><span>${l}</span><strong>${on?"EIN":"AUS"}</strong></button>`}).join("")}</div></div>`:"";
    const numberHtml=numbers.length?`<div class="control-group"><div class="control-group-title">Temperaturen</div><div class="control-grid">${numbers.map(([r,l])=>{const st=state(r);return `<div class="control-field"><label>${l}</label><div class="number-set-row"><input type="number" data-number-input="${cssEscape(r.entity_id)}" value="${cssEscape(st?.state??"")}" min="${cssEscape(st?.attributes?.min??0)}" max="${cssEscape(st?.attributes?.max??350)}" step="${cssEscape(st?.attributes?.step??1)}" ${st?"":"disabled"}><button data-number-set="${cssEscape(r.entity_id)}" ${st?"":"disabled"}>Setzen</button></div><small>${cssEscape(r.entity_id)}</small></div>`}).join("")}</div></div>`:"";
    const fanHtml=fans.length?`<div class="control-group"><div class="control-group-title">Lüfter</div><div class="control-grid">${fans.map(([r,l])=>{const st=state(r);const pct=Number(st?.attributes?.percentage ?? 0);return `<div class="control-field"><label>${l}</label><div class="fan-control-row"><input type="range" min="0" max="100" step="5" value="${Number.isFinite(pct)?pct:0}" data-fan-entity="${cssEscape(r.entity_id)}" ${st?"":"disabled"}><strong data-fan-value>${Number.isFinite(pct)?Math.round(pct):0}%</strong></div><small>${cssEscape(r.entity_id)}</small></div>`}).join("")}</div></div>`:"";
    const selectHtml=selects.length?`<div class="control-group"><div class="control-group-title">Modi</div><div class="control-grid">${selects.map(([r,l])=>{const st=state(r),opts=st?.attributes?.options||[];return `<div class="control-field"><label>${l}</label><select data-select-entity="${cssEscape(r.entity_id)}" ${opts.length?"":"disabled"}>${opts.map(o=>`<option value="${cssEscape(o)}" ${st?.state===o?"selected":""}>${cssEscape(o)}</option>`).join("")}</select><small>${cssEscape(r.entity_id)}${opts.length?"":" · aktuell keine Optionen"}</small></div>`}).join("")}</div></div>`:"";
    const any=buttonHtml||switchHtml||numberHtml||fanHtml||selectHtml;
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Quick Controls</div><div class="panel-title">Steuerung</div></div></div>${warning}${any?`<div class="control-groups">${buttonHtml}${switchHtml}${numberHtml}${fanHtml}${selectHtml}</div>`:`<div class="empty">Die Bambu-Integration stellt für diesen Drucker aktuell keine steuerbaren Entities außer ggf. Licht bereit.</div>`}</section>`;
  }

  _controlButton(action, icon, label, danger = false) {
    return `<button class="control-btn ${danger ? "danger" : ""}" data-action="${action}"><ha-icon icon="${icon}"></ha-icon>${label}</button>`;
  }

  _renderEnergy(printer) {
    const cfg=resolveConfiguredPrinter(this._config,printer.id);
    const plugId=String(cfg.smart_plug_entity||"").trim();
    const plugState=plugId?this._hass.states[plugId]:null;
    const powerState=cfg.power_entity?this._hass.states[cfg.power_entity]:null;
    const energyState=cfg.energy_entity?this._hass.states[cfg.energy_entity]:null;
    if(!plugId && !cfg.power_entity && !cfg.energy_entity) return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Energy</div><div class="panel-title">Strom & Steckdose</div></div></div><div class="empty"><ha-icon icon="mdi:power-plug-off"></ha-icon>Keine Smart-Steckdose bzw. Messsensoren zugeordnet. Im Karteneditor kannst du eine switch.*-Entity sowie Leistung und Energie wählen.</div></section>`;
    const power=powerState&&hasMeaningfulValue(powerState)?Number(powerState.state):null; const energy=energyState&&hasMeaningfulValue(energyState)?Number(energyState.state):null;
    const price=Number(this._config.kwh_price); const cost=Number.isFinite(energy)&&Number.isFinite(price)?this._convertEnergyToKwh(energyState,energy)*price:null;
    const samples=this._powerSamples.get(printer.id)||[]; const on=normalize(plugState?.state)==="on";
    const plug=`${plugId?`<div class="smart-plug"><div><small>Smart-Steckdose</small><strong>${cssEscape(plugState?.attributes?.friendly_name||plugId)}</strong><span class="plug-state ${on?"on":""}">${on?"EIN":"AUS"}</span></div><button class="control-btn ${on?"danger":""}" data-smart-plug="${cssEscape(plugId)}">${on?"Ausschalten":"Einschalten"}</button></div>`:""}`;
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Energy</div><div class="panel-title">Strom & Steckdose</div></div></div><div class="energy-body">${plug}<div class="energy-stats"><div class="energy-stat"><small>Leistung</small><strong>${Number.isFinite(power)?formatWatt(this._convertPowerToW(powerState,power)):"–"}</strong></div><div class="energy-stat"><small>Energie</small><strong>${Number.isFinite(energy)?formatKwh(this._convertEnergyToKwh(energyState,energy)):"–"}</strong></div><div class="energy-stat"><small>Kosten</small><strong>${cost===null?"–":`${formatNumber(cost,2)} €`}</strong></div></div>${samples.length>1?this._sparkline(samples):""}</div></section>`;
  }

  _convertPowerToW(st, value) {
    const u = String(unit(st)).toLowerCase();
    if (u === "kw") return value * 1000;
    if (u === "mw") return value / 1000;
    return value;
  }

  _convertEnergyToKwh(st, value) {
    const u = String(unit(st)).toLowerCase();
    if (u === "wh") return value / 1000;
    if (u === "mwh") return value * 1000;
    return value;
  }

  _sparkline(samples) {
    const values = samples.map((s) => s.v);
    const min = Math.min(...values), max = Math.max(...values);
    const span = Math.max(1, max - min);
    const pts = samples.map((s, i) => `${(i / (samples.length - 1)) * 100},${68 - ((s.v - min) / span) * 56}`).join(" ");
    return `<svg class="spark" viewBox="0 0 100 76" preserveAspectRatio="none" aria-label="Live-Leistung"><line x1="0" y1="18" x2="100" y2="18"></line><line x1="0" y1="42" x2="100" y2="42"></line><line x1="0" y1="66" x2="100" y2="66"></line><polyline points="${pts}"></polyline></svg>`;
  }

  _maintenanceKey(printerId){ return `bambu-dashboard-maint-v1:${printerId}`; }
  _maintenanceState(printerId){
    let data;
    try{ data=JSON.parse(localStorage.getItem(this._maintenanceKey(printerId))||'{"history":[],"last":{}}'); }catch{ data={history:[],last:{}}; }
    data=data&&typeof data==="object"?data:{};
    data.history=Array.isArray(data.history)?data.history:[];
    data.last=data.last&&typeof data.last==="object"?data.last:{};
    if(!Number.isFinite(data.initializedAt)){
      data.initializedAt=Date.now();
      this._saveMaintenanceState(printerId,data);
    }
    return data;
  }
  _saveMaintenanceState(printerId,data){ try{localStorage.setItem(this._maintenanceKey(printerId),JSON.stringify(data))}catch{} }
  _maintenanceProfile(printer){
    const raw=normalizedPrinterModel(printer.device);
    const model=raw.replace(/[\s_-]+/g, "");
    const officialSupport="https://bambulab.com/en/support/maintenance";
    const regular=(id,name,note)=>({id,name,days:null,alwaysVisible:true,source:"Bambu Lab · Regular Maintenance",url:officialSupport,note});
    const families={
      A1:{models:["A1"],label:"A1",tasks:[regular("rails","X-/Y-Führungen reinigen & schmieren","Führungen sauber halten und mit dem von Bambu vorgesehenen Schmiermittel warten. Ein festes Kalenderintervall wird nur gesetzt, wenn Bambu es für dieses Modell ausdrücklich veröffentlicht."),regular("consumables","Cutter, Wiper und PTFE prüfen","Verschleißteile auf Abnutzung, Verformung und Alterung prüfen und bei Bedarf ersetzen."),regular("camera_fans","Kamera, Lüfter und Filamentsensor reinigen","Staub und Ablagerungen entfernen; Kameralinse vorsichtig reinigen.")]},
      A1MINI:{models:["A1MINI"],label:"A1 mini",tasks:[regular("rails","Führungen reinigen & schmieren","Bewegliche Führungen gemäß Bambu-Wartungsanleitung reinigen und schmieren."),regular("consumables","Cutter, Wiper und PTFE prüfen","Verschleißteile prüfen und bei Bedarf ersetzen."),regular("camera_fans","Kamera, Lüfter und Filamentsensor reinigen","Staub und Ablagerungen entfernen; Kameralinse vorsichtig reinigen.")]},
      A2L:{models:["A2L"],label:"A2L",tasks:[regular("moving_parts","Schienen / Führungen / Rollen / Lead Screws schmieren","X/Y und Umlenkrollen mit Öl; Lead Screws und Extruder-Zahnräder mit Fett. Bambu nennt im Quick Start kein fixes Kalenderintervall."),regular("consumables","Filament-Cutter, Wiper und PTFE prüfen","Auf Alterung, Verformung und Verschleiß prüfen; bei Bedarf ersetzen."),regular("camera_fans","Kamera, Lüfter und Filamentsensor reinigen","Staub und Schmutz entfernen; Kamera vorsichtig reinigen.")]},
      P1:{models:["P1P","P1S"],label:"P1 Series",tasks:[regular("xy_rods","X-/Y-Bewegungssystem reinigen / prüfen","Achsen, Carbonstäbe/Führungen und Umlenkrollen gemäß Bambu P1 Regular Maintenance reinigen und prüfen."),regular("z_leadscrews","Z-Gewindespindeln reinigen & schmieren","Z-Gewindespindeln reinigen und mit geeignetem Schmierfett warten."),regular("consumables","Cutter, Wiper und PTFE prüfen","Verschleißteile regelmäßig kontrollieren und bei Bedarf ersetzen."),regular("fans_camera","Lüfter und Kamera reinigen","Staub und Ablagerungen regelmäßig entfernen.")]},
      P2S:{models:["P2S"],label:"P2S",tasks:[regular("xy_axes","X-/Y-Achsen reinigen & schmieren","Den modellbezogenen HMS-/Wartungshinweisen des Druckers folgen. Das Dashboard erfindet ohne veröffentlichte Herstellerfrist kein Kalenderdatum."),regular("z_axis","Z-Achse / Lead Screws reinigen & schmieren","Den modellbezogenen HMS-/Wartungshinweisen des Druckers folgen."),regular("consumables","Cutter, Wiper und PTFE prüfen","Verschleißteile prüfen und bei Bedarf ersetzen."),regular("camera_fans","Kamera und Lüfter reinigen","Staub und Ablagerungen entfernen.")]},
      X1:{models:["X1","X1C","X1CARBON","X1E"],label:"X1 Series",tasks:[regular("carbon_rods","X-Carbonstäbe reinigen","Carbonstäbe gemäß Bambu X1 Regular Maintenance reinigen; keine ungeeigneten Schmierstoffe auftragen."),regular("z_leadscrews","Z-Gewindespindeln reinigen & schmieren","Z-Gewindespindeln reinigen und gemäß Bambu-Anleitung schmieren."),regular("rods_bearings","Y-/Z-Führungen und Lager prüfen","Führungen, Lager und Umlenkrollen auf Schmutz und Verschleiß prüfen."),regular("consumables","Cutter, Wiper und PTFE prüfen","Verschleißteile prüfen und bei Bedarf ersetzen."),regular("camera_fans","Kamera und Lüfter reinigen","Staub und Ablagerungen entfernen.")]},
      H2:{models:["H2C","H2D","H2DPRO"],label:"H2 Series",tasks:[regular("moving_parts","Führungen, Linearstäbe, Rollen und Lead Screws warten","Bambu: Führungen/Linearstäbe/Umlenkrollen mit Öl, Lead Screws und Extruder-Zahnräder mit Fett schmieren."),regular("consumables","Cutter, Wiper und PTFE prüfen","Kunststoff- und Gummiteile auf Verschleiß, Verformung oder Alterung prüfen und bei Bedarf ersetzen."),regular("camera_fans","Kameras, Lüfter und Filamentsensoren reinigen","Kameralinsen vorsichtig reinigen und Staub von Lüftern/Sensoren entfernen."),regular("chamber","Druckraum und Luftwege reinigen","Ablagerungen im Druckraum und an Luftwegen/Filtern entfernen.")]},
      H2S:{models:["H2S"],label:"H2S",tasks:[regular("xy_axes","X-/Y-Achsen reinigen & schmieren","Der H2S besitzt firmwareseitige Wartungserinnerungen für X/Y-Reinigung. Diese haben Vorrang vor Dashboard-Erinnerungen."),regular("z_axis","Lead Screws reinigen & schmieren","Der H2S besitzt firmwareseitige Wartungserinnerungen für Lead-Screw-Schmierung."),regular("consumables","Cutter, Wiper und PTFE prüfen","Verschleißteile prüfen und bei Bedarf ersetzen."),regular("camera_fans","Kameras, Lüfter und Filamentsensoren reinigen","Staub und Ablagerungen entfernen.")]}
    };
    for(const profile of Object.values(families)) if(profile.models.includes(model)) return {...profile,key:Object.keys(families).find(k=>families[k]===profile),model:raw,verified:true};
    if(model==="X2D") return {key:"X2D",label:"X2D",model:raw,verified:true,tasks:[
      {id:"build_plate",name:"Build Plate reinigen",days:7,alwaysVisible:true,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=137",note:"Mit warmem Wasser und Spülmittel reinigen und vollständig trocknen. Bambu nennt bei normaler Nutzung 1 Woche."},
      {id:"live_camera",name:"Live-View-Kamera reinigen",days:30,intensiveDays:7,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=137",note:"Kamerafläche vorsichtig reinigen. Normal: 1 Monat; bei intensiver Nutzung laut Bambu wöchentlich."},
      {id:"chamber",name:"Druckraum / Boden reinigen",days:30,intensiveDays:7,alwaysVisible:true,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=138",note:"Filamentreste und Fremdkörper entfernen. Normal: 1 Monat."},
      {id:"xy_axes",name:"X-/Y-Achsen reinigen & schmieren",days:30,intensiveDays:7,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=139",note:"X/Y-Linearführungen reinigen und mit Schmieröl ölen. Normal: 1 Monat."},
      {id:"z_axis",name:"Z-Achse reinigen & schmieren",days:90,intensiveDays:30,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=140",note:"Linearführungen mit Schmieröl, Gewindespindeln mit Schmierfett behandeln. Normal: 3 Monate."},
      {id:"air_filter",name:"Luftfilter prüfen / reinigen",days:90,intensiveDays:30,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=138",note:"Filter und Abdeckung reinigen; Filter bei Bedarf ersetzen. Normal: 3 Monate."},
      {id:"toolhead_camera",name:"Toolhead-Kamera reinigen",days:30,intensiveDays:7,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=143",note:"Kamerafläche vorsichtig reinigen. Normal: 1 Monat."},
      {id:"extruder",name:"Extruder reinigen & schmieren",days:30,intensiveDays:7,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=142",note:"Ablagerungen entfernen und vorgesehene Zahnräder mit Schmierfett schmieren. Normal: 1 Monat."},
      {id:"hotend",name:"Hotend reinigen",days:30,intensiveDays:7,source:"X2D User Manual · Kap. 11",url:"https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf#page=138",note:"Regelmäßige Hotend-Reinigung nach Herstelleranleitung. Normal: 1 Monat."}
    ]};
    return {key:"GENERIC",label:raw||"Bambu Lab",model:raw,verified:false,tasks:[regular("moving_parts","Bewegliche Teile reinigen / schmieren","Modell wurde von der installierten Integration erkannt, besitzt im Dashboard aber noch kein verifiziertes Herstellerprofil. Deshalb wird kein fremdes Modellintervall übernommen."),regular("consumables","Verschleißteile prüfen","Cutter, Wiper, PTFE und weitere Verschleißteile nach Zustand und Herstellerhinweisen prüfen."),regular("camera_fans","Kameras, Lüfter und Sensoren reinigen","Staub und Ablagerungen nach Herstellerhinweisen entfernen.")]};
  }
  _officialMaintenanceTasks(printer){ return this._maintenanceProfile(printer).tasks; }
  _maintenanceTiming(task,state,now=Date.now()){
    if(!task.days) return {due:false,nextTs:null,nextLabel:"regelmäßig / nach Zustand"};
    const base=Number.isFinite(state.last?.[task.id])?state.last[task.id]:state.initializedAt;
    const nextTs=base+task.days*86400000;
    return {due:now>=nextTs,nextTs,nextLabel:new Date(nextTs).toLocaleDateString(uiLocale(this._hass))};
  }

  _setMaintenanceToast(message){
    this._maintenanceToast=message;
    if(this._maintenanceToastTimer) clearTimeout(this._maintenanceToastTimer);
    this._maintenanceToastTimer=setTimeout(()=>{this._maintenanceToast="";this._render();},2600);
  }

  _recordMaintenance(printer,taskId,taskName){
    const data=this._maintenanceState(printer.id); data.last=data.last||{}; data.history=data.history||[];
    const ts=Date.now(); data.last[taskId]=ts;
    data.history.push({id:`${ts}-${Math.random().toString(36).slice(2,8)}`,ts,taskId,name:taskName});
    this._saveMaintenanceState(printer.id,data);
    this._maintenanceLogPage=1;
    this._setMaintenanceToast("Wartung als erledigt gespeichert.");
  }

  _maintenanceHistoryView(state,tasks){
    const taskById=new Map(tasks.map(t=>[t.id,t]));
    const taskByName=new Map(tasks.map(t=>[t.name,t]));
    let entries=(state.history||[]).map((h,index)=>({
      ...h,_index:index,
      taskId:h.taskId||taskByName.get(h.name)?.id||"legacy",
      name:h.name||taskById.get(h.taskId)?.name||"Wartung"
    }));
    if(this._maintenanceLogFilter!=="all") entries=entries.filter(h=>h.taskId===this._maintenanceLogFilter || h.name===this._maintenanceLogFilter);
    if(this._maintenanceLogRecentOnly){ const cutoff=Date.now()-30*86400000; entries=entries.filter(h=>Number(h.ts)>=cutoff); }
    entries.sort((a,b)=>Number(b.ts)-Number(a.ts));
    return entries;
  }

  _renderMaintenanceLog(printer,state,tasks){
    const all=(state.history||[]);
    const entries=this._maintenanceHistoryView(state,tasks);
    const pageSize=15;
    const totalPages=Math.max(1,Math.ceil(entries.length/pageSize));
    this._maintenanceLogPage=Math.min(Math.max(1,this._maintenanceLogPage||1),totalPages);
    const start=(this._maintenanceLogPage-1)*pageSize;
    const pageEntries=entries.slice(start,start+pageSize);
    const recentCount=all.filter(h=>Number(h.ts)>=Date.now()-30*86400000).length;
    const counts=new Map(); all.forEach(h=>{const k=h.taskId||h.name||"Wartung";counts.set(k,(counts.get(k)||0)+1)});
    const top=[...counts.entries()].sort((a,b)=>b[1]-a[1])[0];
    const taskMap=new Map(tasks.map(t=>[t.id,t.name]));
    const topLabel=top?`${taskMap.get(top[0])||top[0]} (${top[1]})`:"–";
    const filterOptions=[`<option value="all" ${this._maintenanceLogFilter==="all"?"selected":""}>Alle Arbeiten</option>`]
      .concat(tasks.map(t=>`<option value="${cssEscape(t.id)}" ${this._maintenanceLogFilter===t.id?"selected":""}>${cssEscape(t.name)}</option>`)).join("");
    const rows=pageEntries.map(h=>`<tr><td>${new Date(h.ts).toLocaleString(uiLocale(this._hass))}</td><td>${cssEscape(h.name)}</td><td><button class="danger" data-maint-log-delete="${h._index}" title="Eintrag löschen"><ha-icon icon="mdi:delete-outline"></ha-icon></button></td></tr>`).join("");
    return `<details class="maintenance-log" open><summary>Wartungsbuch (${all.length})</summary>
      <div class="maintenance-summary"><div><small>Einträge gesamt</small><strong>${all.length}</strong></div><div><small>Letzte 30 Tage</small><strong>${recentCount}</strong></div><div><small>Häufigste Wartung</small><strong>${cssEscape(topLabel)}</strong></div></div>
      <div class="maintenance-log-toolbar">
        <label>Filter<select data-maint-log-filter>${filterOptions}</select></label>
        <label><span>Nur letzte 30 Tage</span><input type="checkbox" data-maint-log-recent ${this._maintenanceLogRecentOnly?"checked":""}></label>
        <div class="maintenance-log-actions"><button class="danger" data-maint-log-clear ${all.length?"":"disabled"}><ha-icon icon="mdi:delete-sweep-outline"></ha-icon> Logbuch leeren</button></div>
      </div>
      ${rows?`<table><thead><tr><th>Zeitpunkt</th><th>Wartung</th><th></th></tr></thead><tbody>${rows}</tbody></table>`:`<div class="empty">Noch keine Wartung quittiert.</div>`}
      ${entries.length>pageSize?`<div class="maintenance-pager"><button data-maint-log-page="prev" ${this._maintenanceLogPage<=1?"disabled":""}>‹ Vorherige</button><strong>Seite ${this._maintenanceLogPage} von ${totalPages}</strong><button data-maint-log-page="next" ${this._maintenanceLogPage>=totalPages?"disabled":""}>Nächste ›</button></div>`:""}
    </details>`;
  }

  _renderMaintenance(printer) {
    const total=this._totalUsageState(printer); const totalState=total.state; const exactTotal=total.entity;
    const state=this._maintenanceState(printer.id); const now=Date.now(); const tasks=this._officialMaintenanceTasks(printer);
    const timed=tasks.map(t=>({task:t,timing:this._maintenanceTiming(t,state,now)}));
    const visible=timed.filter(({task,timing})=>task.alwaysVisible||!task.days||timing.due);
    const upcoming=timed.filter(({task,timing})=>task.days&&!task.alwaysVisible&&!timing.due&&timing.nextTs).sort((a,b)=>a.timing.nextTs-b.timing.nextTs);
    const rows=visible.map(({task:t,timing})=>{const status=t.days?(timing.due?"FÄLLIG":timing.nextLabel):timing.nextLabel;return `<div class="maint-item ${timing.due?"due":""}"><div class="maint-top"><strong>${cssEscape(t.name)}</strong><span>${cssEscape(status)}</span></div><small>${cssEscape(t.note)}</small><div class="maint-actions"><button class="maint-source-link" data-maint-source="${cssEscape(t.id)}" title="${cssEscape(t.source)}">${cssEscape(t.source)}</button><button data-maint-done="${cssEscape(t.id)}" data-maint-name="${cssEscape(t.name)}"><ha-icon icon="mdi:check-circle-outline"></ha-icon> Als erledigt quittieren</button></div></div>`}).join("");
    const upcomingHtml=upcoming.length?`<div class="maintenance-next"><strong>Nächste Wartungen</strong>${upcoming.map(({task,timing})=>`<div class="maintenance-next-row"><span>${cssEscape(task.name)}</span><span>${cssEscape(timing.nextLabel)}</span></div>`).join("")}</div>`:"";
    const profile=this._maintenanceProfile(printer); const hasFixed=tasks.some(t=>Number.isFinite(t.days));
    const profileNote=`<div class="maintenance-note"><strong>Bambu-Lab-Wartungsprofil: ${cssEscape(profile.label)}</strong> · automatisch aus dem von Home Assistant gemeldeten Druckermodell gewählt.<br>${hasFixed?"Kalenderintervalle werden nur dort berechnet, wo für dieses Modell ein verifiziertes Herstellerintervall hinterlegt ist.":"Für dieses Modell wird kein erfundenes Kalenderintervall verwendet. Aufgaben bleiben als regelmäßige bzw. zustandsabhängige Herstellerwartung sichtbar."} ${profile.verified?"":"Das Modell ist noch keinem verifizierten Profil zugeordnet; es wird bewusst nur ein sicherer allgemeiner Fallback gezeigt."} Hersteller-/HMS-Wartungshinweise sowie sichtbarer Verschleiß oder Verschmutzung haben immer Vorrang.</div>`;
    const totalHtml=totalState?`<div class="maint-item"><div class="maint-top"><strong>Gesamtlaufzeit laut Bambu-Integration</strong><span>${this._formatDurationState(totalState)}</span></div><small>Entity: ${cssEscape(exactTotal?.entity_id||"")}${total.cached?` · zuletzt gemeldet ${new Date(total.ts).toLocaleString(uiLocale(this._hass))}`:""}</small></div>`:`<div class="notice">Keine total_usage_hours-Entity bzw. kein letzter Gesamtwert verfügbar. Die letzte Druckdauer wird ausdrücklich nicht als Gesamtlaufzeit verwendet.</div>`;
    const toast=this._maintenanceToast?`<div class="maintenance-toast"><ha-icon icon="mdi:check-circle-outline"></ha-icon> ${cssEscape(this._maintenanceToast)}</div>`:"";
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Maintenance</div><div class="panel-title">Wartung · ${cssEscape(configuredPrinterName(this._config,printer))}</div></div></div><div class="maintenance">${toast}${totalHtml}${profileNote}${rows||`<div class="notice">Aktuell ist keine Wartung fällig. Noch nicht fällige Arbeiten erscheinen automatisch wieder zum nächsten Herstellerintervall.</div>`}${upcomingHtml}${this._renderMaintenanceLog(printer,state,tasks)}</div></section>`;
  }

  _renderMaintenanceModal() {
    const t=this._maintenanceModalTask; if(!t) return "";
    const interval=t.days?`${t.days} Tage (normale Nutzung)`:"regelmäßig / nach Zustand";
    const intensive=t.intensiveDays?`<br><strong>Intensive Nutzung:</strong> ${t.intensiveDays} Tage laut verkürztem Bambu-Intervall`:"";
    return `<div class="maintenance-modal-backdrop" data-close-maint-modal><div class="maintenance-modal" data-maint-modal-box><div class="maintenance-modal-head"><div><div class="eyebrow">Offizielle Wartungsanleitung</div><h3>${cssEscape(t.name)}</h3></div><button class="icon-btn" data-close-maint-modal title="Schließen"><ha-icon icon="mdi:close"></ha-icon></button></div><p>${cssEscape(t.note)}</p><p><strong>Intervall:</strong> ${cssEscape(interval)}${intensive}<br><strong>Quelle:</strong> ${cssEscape(t.source)}</p><div class="maintenance-modal-actions"><a href="${cssEscape(t.url)}" target="_blank" rel="noopener">Originalanleitung öffnen</a><button data-maint-modal-done="${cssEscape(t.id)}" data-maint-name="${cssEscape(t.name)}"><ha-icon icon="mdi:check-circle-outline"></ha-icon> Als erledigt quittieren</button></div></div></div>`;
  }

  _formatStateWithUnit(st) {
    if (!st || !hasMeaningfulValue(st)) return "–";
    const u = unit(st);
    const n = Number(st.state);
    const value = Number.isFinite(n) ? formatNumber(n, Math.abs(n) < 10 ? 1 : 0) : cssEscape(st.state);
    return `${value}${u ? ` ${cssEscape(u)}` : ""}`;
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll("[data-view]").forEach((btn) => btn.addEventListener("click", () => { this._activeView = btn.dataset.view; this._render(); }));
    this.shadowRoot.querySelectorAll("[data-printer-image]").forEach((img) => img.addEventListener("error", () => {
      img.style.display = "none";
      if (img.nextElementSibling) img.nextElementSibling.style.display = "grid";
    }, { once: true }));
    this.shadowRoot.querySelectorAll("[data-open-printer]").forEach((el) => el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this._selectedPrinterId = el.dataset.openPrinter;
      this._activeView = "detail";
      this._render();
    }));
    this.shadowRoot.querySelectorAll("[data-action]").forEach((btn) => btn.addEventListener("click", (ev) => this._handleAction(ev.currentTarget.dataset.action)));
    this.shadowRoot.querySelectorAll("[data-spool-entity]").forEach((el)=>el.addEventListener("click", (ev)=>this._showSpoolDetail(ev.currentTarget.dataset.spoolEntity)));
    this.shadowRoot.querySelector("[data-close-spool-inline]")?.addEventListener("click", (ev)=>{ ev.stopPropagation(); this._selectedSpoolEntityId=null; this._render(); });
    this.shadowRoot.querySelector("[data-close-spool-backdrop]")?.addEventListener("click", (ev)=>{ if (ev.target.closest?.("[data-spool-modal-box]")) return; this._selectedSpoolEntityId=null; this._render(); });
    this.shadowRoot.querySelectorAll("[data-more-info]").forEach((el)=>el.addEventListener("click", (ev)=>this._showMoreInfo(ev.currentTarget.dataset.moreInfo)));
    this.shadowRoot.querySelectorAll("[data-entity-action]").forEach((el)=>el.addEventListener("click", (ev)=>this._callEntity({entity_id:ev.currentTarget.dataset.entityAction})));
    this.shadowRoot.querySelectorAll("[data-number-set]").forEach((el)=>el.addEventListener("click", (ev)=>{ const id=ev.currentTarget.dataset.numberSet; const input=this.shadowRoot.querySelector(`[data-number-input="${CSS.escape(id)}"]`); if(input)this._setNumber(id,input.value); }));
    this.shadowRoot.querySelectorAll("[data-fan-entity]").forEach((el)=>{ el.addEventListener("input",(ev)=>{const v=ev.currentTarget.parentElement?.querySelector("[data-fan-value]");if(v)v.textContent=`${ev.currentTarget.value}%`;}); el.addEventListener("change", (ev)=>this._setFan(ev.currentTarget.dataset.fanEntity, ev.currentTarget.value)); });
    this.shadowRoot.querySelectorAll("[data-select-entity]").forEach((el)=>el.addEventListener("change", (ev)=>this._setSelect(ev.currentTarget.dataset.selectEntity, ev.currentTarget.value)));

    this.shadowRoot.querySelectorAll("[data-smart-plug]").forEach(el=>el.addEventListener("click",async ev=>{ const id=ev.currentTarget.dataset.smartPlug; const running=this._selectedPrinter() && ["running","printing","prepare","preparing"].includes(normalize(this._val(this._selectedPrinter(),"status",""))); const st=this._hass.states[id]; if(running && normalize(st?.state)==="on" && !confirm("Der Drucker druckt gerade. Smart-Steckdose wirklich ausschalten?")) return; await this._callEntity({entity_id:id}); }));
    this.shadowRoot.querySelectorAll("[data-maint-done]").forEach(el=>el.addEventListener("click",ev=>{ const printer=this._selectedPrinter(); if(!printer)return; this._recordMaintenance(printer,ev.currentTarget.dataset.maintDone,ev.currentTarget.dataset.maintName); this._render(); }));
    this.shadowRoot.querySelectorAll("[data-maint-source]").forEach(el=>el.addEventListener("click",ev=>{const printer=this._selectedPrinter();if(!printer)return;this._maintenanceModalTask=this._officialMaintenanceTasks(printer).find(t=>t.id===ev.currentTarget.dataset.maintSource)||null;this._render();}));
    this.shadowRoot.querySelectorAll("[data-close-maint-modal]").forEach(el=>el.addEventListener("click",ev=>{if(ev.target.closest?.("[data-maint-modal-box]") && !ev.target.closest?.("[data-close-maint-modal]:not(.maintenance-modal-backdrop)")) return; this._maintenanceModalTask=null;this._render();}));
    this.shadowRoot.querySelector("[data-maint-modal-done]")?.addEventListener("click",ev=>{const printer=this._selectedPrinter();if(!printer)return;this._recordMaintenance(printer,ev.currentTarget.dataset.maintModalDone,ev.currentTarget.dataset.maintName);this._maintenanceModalTask=null;this._render();});
    this.shadowRoot.querySelector("[data-maint-log-filter]")?.addEventListener("change",ev=>{this._maintenanceLogFilter=ev.currentTarget.value||"all";this._maintenanceLogPage=1;this._render();});
    this.shadowRoot.querySelector("[data-maint-log-recent]")?.addEventListener("change",ev=>{this._maintenanceLogRecentOnly=!!ev.currentTarget.checked;this._maintenanceLogPage=1;this._render();});
    this.shadowRoot.querySelectorAll("[data-maint-log-page]").forEach(el=>el.addEventListener("click",ev=>{this._maintenanceLogPage=Math.max(1,(this._maintenanceLogPage||1)+(ev.currentTarget.dataset.maintLogPage==="next"?1:-1));this._render();}));
    this.shadowRoot.querySelectorAll("[data-maint-log-delete]").forEach(el=>el.addEventListener("click",ev=>{const printer=this._selectedPrinter();if(!printer)return;if(!confirm(translateUiText("Diesen Wartungseintrag wirklich löschen?",this._hass)))return;const data=this._maintenanceState(printer.id);const idx=Number(ev.currentTarget.dataset.maintLogDelete);if(Number.isInteger(idx)&&idx>=0&&idx<data.history.length){data.history.splice(idx,1);this._saveMaintenanceState(printer.id,data);this._setMaintenanceToast("Wartungseintrag gelöscht.");this._render();}}));
    this.shadowRoot.querySelector("[data-maint-log-clear]")?.addEventListener("click",()=>{const printer=this._selectedPrinter();if(!printer)return;if(!confirm(translateUiText("Das komplette Wartungsbuch dieses Druckers wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",this._hass)))return;const data=this._maintenanceState(printer.id);data.history=[];this._saveMaintenanceState(printer.id,data);this._maintenanceLogPage=1;this._setMaintenanceToast("Wartungsbuch wurde geleert.");this._render();});
    const select = this.shadowRoot.querySelector("[data-speed-select]");
    if (select) select.addEventListener("change", (ev) => this._setSpeed(ev.target.value));
  }

  async _handleAction(action) {
    const printer = this._selectedPrinter();
    if (!printer) return;
    if (action === "refresh-camera") {
      const reg = this._entry(printer, "forceRefresh");
      if (reg) await this._callEntity(reg);
      this._cameraBust = Date.now();
    this._maintenanceModalTask = null;
      this._render();
      return;
    }
    const map = { pause: "pause", resume: "resume", stop: "stop", light: "chamberLight" };
    const reg = map[action] ? this._entry(printer, map[action]) : null;
    if (reg) await this._callEntity(reg);
  }

  async _callEntity(reg) {
    const [domain] = reg.entity_id.split(".");
    try {
      if (domain === "button") return await this._hass.callService("button", "press", { entity_id: reg.entity_id });
      if (domain === "light") return await this._hass.callService("light", "toggle", { entity_id: reg.entity_id });
      if (domain === "switch") return await this._hass.callService("switch", "toggle", { entity_id: reg.entity_id });
      if (domain === "input_button") return await this._hass.callService("input_button", "press", { entity_id: reg.entity_id });
    } catch (err) {
      console.error("[Bambu Lab Dashboard] Action failed", reg.entity_id, err);
    }
  }


  async _setNumber(entityId, value) {
    const n = Number(value); if (!entityId || !Number.isFinite(n)) return;
    try { await this._hass.callService("number", "set_value", { entity_id:entityId, value:n }); }
    catch (err) { console.error("[Bambu Lab Dashboard] Number control failed", entityId, err); }
  }
  async _setFan(entityId, value) {
    const n = Math.max(0, Math.min(100, Number(value))); if (!entityId || !Number.isFinite(n)) return;
    try { await this._hass.callService("fan", "set_percentage", { entity_id:entityId, percentage:n }); }
    catch (err) { console.error("[Bambu Lab Dashboard] Fan control failed", entityId, err); }
  }
  async _setSelect(entityId, option) {
    if (!entityId || !option) return;
    try { await this._hass.callService("select", "select_option", { entity_id:entityId, option }); }
    catch (err) { console.error("[Bambu Lab Dashboard] Select control failed", entityId, err); }
  }

  async _setSpeed(option) {
    if (!option) return;
    const printer = this._selectedPrinter();
    const override = this._configuredEntityId(printer, "speed");
    const reg = override ? { entity_id: override } : this._entry(printer, "speed");
    if (!reg) return;
    try { await this._hass.callService("select", "select_option", { entity_id: reg.entity_id, option }); }
    catch (err) { console.error("[Bambu Lab Dashboard] Speed change failed", err); }
  }
}

class BambuLabDashboardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._devices = [];
    this._entities = [];
    this._printers = [];
    this._loaded = false;
    this._openEditorDetails = new Set();
    this._editorScrollTop = 0;
  }
  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config || {}));
    this._renderPreservingEditorState();
  }
  set hass(hass) {
    this._hass = hass;
    if (!this._loaded) this._load();
    // Do not rebuild the whole editor for every live printer state update.
    // That was closing <details> sections and resetting the user's scroll position.
  }
  _captureEditorState() {
    const scroller = this.shadowRoot?.querySelector('.editor');
    if (scroller) this._editorScrollTop = scroller.scrollTop;
    this._openEditorDetails = new Set([...this.shadowRoot?.querySelectorAll('details[data-detail-key][open]') || []].map((d)=>d.dataset.detailKey));
  }
  _restoreEditorState() {
    for (const d of this.shadowRoot?.querySelectorAll('details[data-detail-key]') || []) d.open = this._openEditorDetails.has(d.dataset.detailKey);
    const scroller = this.shadowRoot?.querySelector('.editor');
    if (scroller) scroller.scrollTop = this._editorScrollTop || 0;
    this.shadowRoot?.querySelectorAll('details[data-detail-key]').forEach((d)=>d.addEventListener('toggle',()=>{ if(d.open)this._openEditorDetails.add(d.dataset.detailKey); else this._openEditorDetails.delete(d.dataset.detailKey); }));
  }
  _renderPreservingEditorState() { this._captureEditorState(); this._render(); this._restoreEditorState(); }
  async _load() {
    if (!this._hass) return;
    try {
      [this._devices, this._entities] = await Promise.all([
        this._hass.callWS({ type: "config/device_registry/list" }),
        this._hass.callWS({ type: "config/entity_registry/list" }),
      ]);
      this._printers = buildPrinterModels(this._devices, this._entities);
    } finally { this._loaded = true; this._renderPreservingEditorState(); }
  }
  _render() {
    if (!this.shadowRoot) return;
    const allEntities = Object.values(this._hass?.states || {}).filter((st) => !!st.entity_id).sort((a,b)=>(a.attributes?.friendly_name||a.entity_id).localeCompare(b.attributes?.friendly_name||b.entity_id,"de"));
    const allSensorEntities = allEntities.filter((st) => st.entity_id?.startsWith("sensor."));
    const allSwitchEntities = allEntities.filter((st)=>st.entity_id?.startsWith("switch.") || st.entity_id?.startsWith("input_boolean."));
    const unitOf = (st) => String(st.attributes?.unit_of_measurement || "").trim().toLowerCase();
    const searchable = (st) => `${st.entity_id} ${st.attributes?.friendly_name || ""}`.toLowerCase();
    const scorePower = (st) => (st.attributes?.device_class === "power" ? 100 : 0) + (["w","kw","mw"].includes(unitOf(st)) ? 50 : 0) + (/(^|[._ -])(power|leistung)([._ -]|$)/.test(searchable(st)) ? 20 : 0);
    const scoreEnergy = (st) => (st.attributes?.device_class === "energy" ? 100 : 0) + (["wh","kwh","mwh"].includes(unitOf(st)) ? 50 : 0) + (/(^|[._ -])(energy|energie|verbrauch|consumption)([._ -]|$)/.test(searchable(st)) ? 20 : 0);
    // Deliberately include every sensor. Recommended matches are sorted first, but no smart-plug sensor is hidden anymore.
    const powerEntities = [...allSensorEntities].sort((a,b)=>scorePower(b)-scorePower(a) || (a.attributes?.friendly_name||a.entity_id).localeCompare(b.attributes?.friendly_name||b.entity_id,"de"));
    const energyEntities = [...allSensorEntities].sort((a,b)=>scoreEnergy(b)-scoreEnergy(a) || (a.attributes?.friendly_name||a.entity_id).localeCompare(b.attributes?.friendly_name||b.entity_id,"de"));
    const bambuEntries = this._entities.filter(isBambuRegistryEntry);
    const amsCandidates = this._devices.filter((d) => {
      const entries = bambuEntries.filter((e)=>e.device_id===d.id);
      const text = `${d.name_by_user || ""} ${d.name || ""} ${d.model || ""} ${entries.map((e)=>`${e.unique_id||""} ${e.translation_key||""}`).join(" ")}`;
      const hasTrayEntity = entries.some((e)=>normalize(e.translation_key)==="tray" || /tray[_ -]?\d/i.test(`${e.unique_id||""} ${e.translation_key||""}`));
      const looksLikeAms = hasTrayEntity || /(^|\s|[_-])ams(\s|[_-]|$)|ams\s*2|ams\s*lite|ams\s*ht/i.test(text);
      const excluded = /external\s*spool|externalspool|cache[-_ ]?gerät/i.test(text) && !hasTrayEntity;
      return looksLikeAms && !excluded && !this._printers.some((p)=>p.id===d.id);
    });
    const sortedPrinters = [...this._printers].sort((a,b)=>configuredPrinterOrder(this._config,a,this._printers.indexOf(a))-configuredPrinterOrder(this._config,b,this._printers.indexOf(b)));
    const entityOptions = allEntities.map((st)=>`<option value="${cssEscape(st.entity_id)}">${cssEscape(st.attributes?.friendly_name || st.entity_id)}</option>`).join("");
    const sensorOptions = allSensorEntities.map((st)=>`<option value="${cssEscape(st.entity_id)}">${cssEscape(st.attributes?.friendly_name || st.entity_id)}</option>`).join("");
    const measurementCandidates = allEntities.filter((st) => st.entity_id.startsWith("sensor.") || ["W","kW","Wh","kWh","MWh"].includes(String(st.attributes?.unit_of_measurement || "")));
    const registryByEntity = new Map(this._entities.filter((e)=>e?.entity_id).map((e)=>[e.entity_id,e]));
    const deviceById = new Map(this._devices.filter((d)=>d?.id).map((d)=>[d.id,d]));
    const measurementOptionHtml = (selected, scorer) => {
      const ordered = [...measurementCandidates].sort((a,b)=>scorer(b)-scorer(a) || (a.attributes?.friendly_name||a.entity_id).localeCompare(b.attributes?.friendly_name||b.entity_id,"de"));
      return `<option value="">Nicht zugeordnet</option>` + ordered.map((st)=>{
        const label=st.attributes?.friendly_name||st.entity_id;
        const u=st.attributes?.unit_of_measurement||"";
        const reg=registryByEntity.get(st.entity_id); const dev=reg?.device_id ? deviceById.get(reg.device_id) : null;
        const devName=dev ? (dev.name_by_user||dev.name||dev.model||"") : "";
        return `<option value="${cssEscape(st.entity_id)}" ${selected===st.entity_id?"selected":""}>${devName?`${cssEscape(devName)} — `:""}${cssEscape(label)} · ${cssEscape(st.entity_id)}${u?` [${cssEscape(u)}]`:""}</option>`;
      }).join("");
    };
    const switchOptionHtml=(selected)=>`<option value="">Nicht zugeordnet</option>`+allSwitchEntities.map(st=>{const reg=registryByEntity.get(st.entity_id);const dev=reg?.device_id?deviceById.get(reg.device_id):null;const dn=dev?(dev.name_by_user||dev.name||dev.model||""):"";return `<option value="${cssEscape(st.entity_id)}" ${selected===st.entity_id?"selected":""}>${dn?`${cssEscape(dn)} — `:""}${cssEscape(st.attributes?.friendly_name||st.entity_id)} · ${cssEscape(st.entity_id)}</option>`}).join("");
    this.shadowRoot.innerHTML = `<style>${styles}</style><datalist id="all-entity-ids">${entityOptions}</datalist><datalist id="sensor-entity-ids">${sensorOptions}</datalist><div class="editor"><h3>Bambu Lab Dashboard</h3><div class="help">Die Bambu-Lab-Integration liefert die Druckerdaten. Hier kannst du Reihenfolge, Namen, AMS, Energie, Theme und bei Bedarf auch die automatisch erkannten Kern-Entitäten pro Drucker überschreiben. Die Drucker-Modellbilder werden automatisch aus derselben Upstream-Bildquelle wie die Bambu-Karten bezogen und sind nicht manuell konfigurierbar.<br><br><strong>Breite:</strong> Die Karte nutzt immer die komplette Breite, die Home Assistant ihrer Section gibt. Für mehr als eine normale Section-Breite musst du die <strong>Section selbst breiter</strong> machen (2–3 Sections) oder eine <strong>Panel-View</strong> verwenden. Eine Custom Card kann die Breite ihrer übergeordneten Section technisch nicht verändern.</div><div class="editor-section"><div class="editor-row"><div><label>Design</label><select data-theme><option value="auto" ${(this._config.theme||"auto")==="auto"?"selected":""}>Automatisch (Home Assistant)</option><option value="dark" ${this._config.theme==="dark"?"selected":""}>Dunkel</option><option value="light" ${this._config.theme==="light"?"selected":""}>Hell</option></select></div><div><label>Strompreis in €/kWh</label><input type="number" min="0" step="0.01" data-kwh-price value="${cssEscape(this._config.kwh_price ?? "")}" placeholder="optional"></div></div></div>${sortedPrinters.map((p,idx) => {
      const cfg = resolveConfiguredPrinter(this._config, p.id);
      const selectedAms = new Set(Array.isArray(cfg.ams_device_ids) ? cfg.ams_device_ids : []);
      const autoAms = new Set((p.childDevices || []).map((d)=>d.id));
      const overrideFields = [
        ["status_entity","Status"], ["progress_entity","Fortschritt"], ["task_entity","Druckauftrag"],
        ["remaining_time_entity","Restzeit"], ["nozzle_temp_entity","Düsentemperatur"], ["bed_temp_entity","Betttemperatur"],
        ["online_entity","Online-Status"], ["camera_entity","Kamera"], ["cover_image_entity","Druckbild / Cover"],
        ["current_layer_entity","Aktueller Layer"], ["total_layers_entity","Layer gesamt"], ["total_usage_entity","Gesamtlaufzeit"], ["speed_entity","Geschwindigkeit"],
        ["pause_entity","Pause-Button"], ["resume_entity","Fortsetzen-Button"], ["stop_entity","Stop-Button"], ["light_entity","Licht"],
        ["target_nozzle_control_entity","Düse Soll (number)"], ["target_bed_control_entity","Bett Soll (number)"], ["target_chamber_control_entity","Kammer Soll (number)"],
        ["cooling_fan_control_entity","Bauteillüfter (fan)"], ["aux_fan_control_entity","Aux-Lüfter (fan)"], ["chamber_fan_control_entity","Kammerlüfter (fan)"], ["airduct_mode_entity","Luftkanal-Modus (select)"]
      ];
      return `<div class="editor-section" data-editor-printer="${cssEscape(p.id)}">
        <div class="editor-title-row"><strong>${cssEscape(displayName(p.device))}</strong><label class="check"><input type="checkbox" data-field="visible" ${cfg.visible !== false ? "checked" : ""}> anzeigen</label></div>
        <div class="editor-row">
          <div><label>Anzeigename</label><input type="text" data-field="name" value="${cssEscape(cfg.name || "")}" placeholder="${cssEscape(displayName(p.device))}"></div>
          <div><label>Reihenfolge</label><input type="number" data-field="order" value="${cssEscape(cfg.order ?? idx+1)}" min="1" step="1"></div>
        </div>
        <div class="editor-sub"><label>Strom & Smart-Steckdose</label><div class="editor-row">
          <div class="entity-picker-wrap"><label>Smart-Steckdose (switch)</label><select data-field="smart_plug_entity">${switchOptionHtml(cfg.smart_plug_entity||"")}</select></div>
          <div class="entity-picker-wrap"><label>Leistungssensor</label><select data-field="power_entity">${measurementOptionHtml(cfg.power_entity || "", scorePower)}</select></div>
          <div class="entity-picker-wrap"><label>Energiesensor</label><select data-field="energy_entity">${measurementOptionHtml(cfg.energy_entity || "", scoreEnergy)}</select></div>
        </div><div class="custom-image-hint">Für die Steckdose werden alle <strong>switch.*</strong>-Entities angeboten; für Messwerte alle <strong>sensor.*</strong>-Entities. Dadurch werden Smart-Steckdosen-Sensoren nicht mehr durch einen zu engen Filter ausgeblendet.</div></div>
        <div class="editor-sub"><label>Bereiche im Detail</label><div class="editor-checks">${[["ams","AMS"],["camera","Kamera"],["energy","Energie"],["maintenance","Wartung"]].map(([key,label])=>`<label class="check"><input type="checkbox" data-field="show_${key}" ${cfg[`show_${key}`] !== false ? "checked" : ""}> ${label}</label>`).join("")}</div></div>
        <div class="editor-sub"><label>AMS-Zuordnung</label><div class="help">Leer lassen = automatische Zuordnung über die Home-Assistant-Gerätehierarchie. Nur echte AMS-Geräte werden angeboten; ExternalSpool-/Tray-/Cache-Hilfsgeräte sind hier ausgefiltert.</div><div class="ams-editor">${amsCandidates.length ? amsCandidates.map((d)=>`<label class="check ams-option"><input type="checkbox" data-ams-device="${cssEscape(d.id)}" ${(selectedAms.size ? selectedAms.has(d.id) : false) ? "checked" : ""}> ${cssEscape(d.name_by_user || d.name || d.model || "AMS")}${autoAms.has(d.id) ? " <small>(automatisch erkannt)</small>" : ""}</label>`).join("") : `<span class="help">Keine echten AMS-Geräte in der Bambu-Integration gefunden.</span>`}</div></div>
        <details class="editor-sub" data-detail-key="entities-${cssEscape(p.id)}"><summary>Erweiterte Entity-Zuordnung</summary><div class="help">Nur verwenden, wenn ein automatisch erkannter Wert falsch ist. Damit lassen sich z. B. Fortschritt, Status oder Auftrag eines Druckers eindeutig auf eine bestimmte Home-Assistant-Entity festlegen.</div><div class="entity-override-grid">${overrideFields.map(([field,label])=>`<label>${label}<input type="text" list="all-entity-ids" data-field="${field}" value="${cssEscape(cfg[field] || "")}" placeholder="automatisch"></label>`).join("")}</div></details>
      </div>`;
    }).join("")}</div>`;
    applyUiTranslations(this.shadowRoot,this._hass);
    this.shadowRoot.querySelector("[data-theme]")?.addEventListener("change", (ev) => { this._config.theme = ev.target.value; this._emit(); });
    this.shadowRoot.querySelector("[data-kwh-price]")?.addEventListener("change", (ev) => {
      const value = ev.target.value;
      if (value === "") delete this._config.kwh_price; else this._config.kwh_price = Number(value);
      this._emit();
    });
    const updateField = (root, field, target) => {
      const deviceId = root.dataset.editorPrinter;
      const printers = Array.isArray(this._config.printers) ? JSON.parse(JSON.stringify(this._config.printers)) : [];
      let item = printers.find((x) => x.device_id === deviceId);
      if (!item) { item = { device_id: deviceId }; printers.push(item); }
      if (target.type === "checkbox") item[field] = target.checked;
      else if (field === "order") { const n=Number(target.value); if (Number.isFinite(n)) item[field]=n; else delete item[field]; }
      else if (target.value) item[field] = target.value; else delete item[field];
      this._config.printers = printers;
      this._emit();
    };
    this.shadowRoot.querySelectorAll("[data-editor-printer] [data-field]").forEach((el) => el.addEventListener("change", (ev) => updateField(ev.target.closest("[data-editor-printer]"), ev.target.dataset.field, ev.target)));
    this.shadowRoot.querySelectorAll("[data-editor-printer] [data-ams-device]").forEach((el) => el.addEventListener("change", (ev) => {
      const root = ev.target.closest("[data-editor-printer]");
      const deviceId = root.dataset.editorPrinter;
      const printers = Array.isArray(this._config.printers) ? JSON.parse(JSON.stringify(this._config.printers)) : [];
      let item = printers.find((x) => x.device_id === deviceId);
      if (!item) { item = { device_id: deviceId }; printers.push(item); }
      const checked = [...root.querySelectorAll("[data-ams-device]:checked")].map((x)=>x.dataset.amsDevice);
      if (checked.length) item.ams_device_ids = checked; else delete item.ams_device_ids;
      this._config.printers = printers;
      this._emit();
    }));
  }
  _emit() {
    this._captureEditorState();
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }
}

if (!customElements.get("bambu-lab-dashboard")) customElements.define("bambu-lab-dashboard", BambuLabDashboard);
if (!customElements.get("bambu-lab-dashboard-editor")) customElements.define("bambu-lab-dashboard-editor", BambuLabDashboardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "bambu-lab-dashboard")) {
  window.customCards.push({ type: "bambu-lab-dashboard", name: "Bambu Lab Dashboard", description: "Auto-discovering Bambu Lab control center with AMS, camera, controls, energy and maintenance.", documentationURL: "https://github.com/theonix77/Bambulab-Dashboard#installation", preview: true });
}
console.info(`%c Bambu Lab Dashboard %c v${VERSION} `, "background:#50d926;color:#050907;font-weight:800;padding:3px 6px;border-radius:4px 0 0 4px", "background:#101713;color:#f4f7f5;padding:3px 6px;border-radius:0 4px 4px 0");
