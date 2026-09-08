/* Bambu Lab Dashboard v1.1.0 | standalone HACS resource */

const VERSION = "1.1.0";
const DOMAIN = "bambu_lab";


// Printer artwork is provided by the existing greghesp/ha-bambulab-cards project,
// which is also the source of the cards bundled with the Bambu Lab integration.
// We reference the upstream PNGs rather than shipping copied artwork.
const PRINTER_ART_BASE = "https://raw.githubusercontent.com/greghesp/ha-bambulab-cards/main/src/images";
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
  return filename ? `${PRINTER_ART_BASE}/${filename}` : null;
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
  totalUsage: ["total_usage", "total_usage_hours"],
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
  speed: ["Speed", "speed", "speed_profile"],
  chamberLight: ["chamber_light", "camera_light", "light"],
  camera: ["camera"],
  coverImage: ["cover_image"],
  pause: ["pause"],
  resume: ["resume"],
  stop: ["stop"],
  forceRefresh: ["force_refresh"],
};

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
  "total_usage",
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


const styles = `
  :host {
    --bd-bg: #050907;
    --bd-panel: #0c1210;
    --bd-panel-2: #111a16;
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
  .printer-product-image { position:relative; z-index:1; width:92%; height:225px; object-fit:contain; filter:drop-shadow(0 22px 28px rgba(0,0,0,.58)); }
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
  .nav-btn { width:100%; cursor:pointer; border:1px solid transparent; background:transparent; border-radius:13px; padding:11px 12px; display:flex; align-items:center; gap:10px; text-align:left; color:var(--bd-muted); transition:.16s ease; }
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
  .shell { max-width:1600px; margin:0 auto; }
  @container (max-width: 1050px) {
    .app-grid { grid-template-columns:170px minmax(0,1fr); gap:12px; }
    .overview-grid { grid-template-columns:1fr; }
    .hero-body { grid-template-columns:minmax(160px,.9fr) minmax(160px,.75fr); }
    .hero-body .task { grid-column:1/-1; }
  }
  @container (max-width: 760px) {
    .shell { padding:12px; border-radius:20px; }
    .app-grid { display:block; }
    .sidebar { position:static; }
    .side-brand,.sidebar > .nav,.side-footer { display:none; }
    .side-printers { padding:8px; margin-bottom:8px; overflow:auto; }
    .side-printers .side-label { display:none; }
    .printer-switch { display:flex; min-width:max-content; }
    .printer-switch .tab { width:auto; }
    .mobile-nav { display:flex; overflow:auto; gap:6px; padding:3px 0 10px; scrollbar-width:none; }
    .mobile-nav .nav-btn { width:auto; flex:0 0 auto; padding:8px 10px; }
    .workspace-head { align-items:flex-start; }
    .workspace-title p { display:none; }
    .wide-grid { grid-template-columns:1fr; }
    .hero-body { grid-template-columns:1fr; }
    .hero-body .task { grid-column:auto; }
    .printer-visual { min-height:210px; }
    .printer-product-image { height:190px; }
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
  .fleet-card { min-width:0; border:1px solid var(--bd-border); border-radius:18px; background:linear-gradient(180deg,rgba(17,26,22,.96),rgba(8,13,11,.98)); padding:16px; box-shadow:inset 0 1px 0 rgba(255,255,255,.025); cursor:pointer; transition:.18s ease; }
  .fleet-card:hover { border-color:rgba(80,217,38,.46); transform:translateY(-1px); }
  .fleet-top { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .fleet-name { font-size:20px; font-weight:800; margin-top:2px; }
  .fleet-main { display:grid; grid-template-columns:128px minmax(0,1fr); gap:14px; align-items:center; margin:12px 0; }
  .fleet-visual { height:128px; display:grid; place-items:center; position:relative; border-radius:14px; background:rgba(0,0,0,.2); overflow:hidden; }
  .fleet-visual img { max-width:94%; max-height:118px; object-fit:contain; }
  .fleet-visual .printer-product-fallback { position:absolute; inset:0; place-items:center; display:none; font-size:48px; color:var(--bd-accent); }
  .fleet-progress-number { font-size:38px; line-height:1; font-weight:900; letter-spacing:-.03em; }
  .fleet-progress-number span { font-size:18px; color:var(--bd-muted); margin-left:2px; }
  .fleet-bar { height:8px; border-radius:999px; overflow:hidden; margin:10px 0; background:#17231d; }
  .fleet-bar span { display:block; height:100%; background:linear-gradient(90deg,var(--bd-accent),var(--bd-accent-2)); border-radius:inherit; }
  .fleet-task { font-size:13px; color:var(--bd-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
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
  @container (max-width:460px) { .fleet-main { grid-template-columns:96px minmax(0,1fr); } .fleet-visual { height:96px; } .fleet-visual img { max-height:90px; } .fleet-metrics { grid-template-columns:1fr 1fr; } }

  .editor-title-row { display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .editor-sub { margin-top:13px; padding-top:11px; border-top:1px solid var(--divider-color); }
  .editor-checks { display:flex; gap:14px; flex-wrap:wrap; margin-top:7px; }
  .check { display:flex !important; align-items:center; gap:6px; font-size:12px !important; margin:0 !important; cursor:pointer; }
  .check input { width:auto !important; min-height:0 !important; }
  .ams-editor { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; margin-top:8px; }
  .ams-option { padding:8px 9px; border:1px solid var(--divider-color); border-radius:9px; }
  .ams-option small { color:var(--secondary-text-color); }
  @container (max-width:600px) { .ams-editor { grid-template-columns:1fr; } }

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
    this._powerSamples = new Map();
    this._lastPowerSampleAt = new Map();
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
      if (previous !== hass) this._render();
    }
  }

  getCardSize() { return 12; }
  getGridOptions() {
    return { columns: "full", min_columns: 6 };
  }

  connectedCallback() {
    if (!this._rediscoverTimer) this._rediscoverTimer = setInterval(() => this._discover(false), 60000);
  }

  disconnectedCallback() {
    if (this._rediscoverTimer) clearInterval(this._rediscoverTimer);
    this._rediscoverTimer = null;
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

  _entityEntries(printer) { return printer?.entries || []; }
  _st(printer, key) { return findState(this._hass, this._entityEntries(printer), ENTITY_KEYS[key] || []); }
  _val(printer, key, fallback = null) { return stateValue(this._hass, this._entityEntries(printer), ENTITY_KEYS[key] || [], fallback); }
  _num(printer, key, fallback = null) { return numericState(this._hass, this._entityEntries(printer), ENTITY_KEYS[key] || [], fallback); }

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

  _cameraUrl(printer) {
    const st = this._st(printer, "camera");
    if (!st) return null;
    const picture = st.attributes?.entity_picture;
    if (picture) return `${picture}${picture.includes("?") ? "&" : "?"}v=${this._cameraBust}`;
    const token = st.attributes?.access_token;
    if (st.entity_id && token) return `/api/camera_proxy/${st.entity_id}?token=${encodeURIComponent(token)}&v=${this._cameraBust}`;
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
    return printerArtworkUrl(printer?.device);
  }

  _render() {
    if (!this.shadowRoot) return;
    const body = this._renderBody();
    this.shadowRoot.innerHTML = `<style>${styles}</style>${body}`;
    this._bindEvents();
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
    const progress = safePercent(this._num(printer, "progress", 0));
    const statusRaw = this._val(printer, "status", "unknown");
    const taskRaw = this._val(printer, "taskName", null);
    const remaining = this._num(printer, "remainingTime", null);
    const nozzle = this._st(printer, "nozzleTemp");
    const bed = this._st(printer, "bedTemp");
    const product = this._printerArtworkUrl(printer);
    const amsCount = this._collectAmsGroups(printer).length;
    const isPrinting = ["running","printing","prepare","preparing","pause","paused"].includes(normalize(statusRaw)) || progress > 0;
    const task = taskRaw || (isPrinting ? "Aktiver Druckauftrag" : "Kein aktiver Druckauftrag");
    const name = configuredPrinterName(this._config, printer);
    return `<article class="fleet-card" data-open-printer="${cssEscape(printer.id)}">
      <div class="fleet-top"><div><div class="eyebrow">${cssEscape(printer.device?.model || "Bambu Lab")}</div><div class="fleet-name">${cssEscape(name)}</div></div><div class="status-badge ${statusClass(statusRaw)}"><span class="dot"></span>${cssEscape(translateStatus(statusRaw))}</div></div>
      <div class="fleet-main">
        <div class="fleet-visual">${product ? `<img data-printer-image src="${cssEscape(product)}" alt="${cssEscape(printer.device?.model || name)}"><div class="printer-product-fallback"><ha-icon icon="mdi:printer-3d"></ha-icon></div>` : `<div class="printer-product-fallback" style="display:grid"><ha-icon icon="mdi:printer-3d"></ha-icon></div>`}</div>
        <div class="fleet-progress"><div class="fleet-progress-number">${formatNumber(progress)}<span>%</span></div><div class="fleet-bar"><span style="width:${progress}%"></span></div><div class="fleet-task">${cssEscape(task)}</div></div>
      </div>
      <div class="fleet-metrics">
        <div><span>Restzeit</span><strong>${remaining === null ? "–" : formatDurationMinutes(remaining)}</strong></div>
        <div><span>Düse</span><strong>${this._formatStateWithUnit(nozzle)}</strong></div>
        <div><span>Bett</span><strong>${this._formatStateWithUnit(bed)}</strong></div>
        <div><span>AMS</span><strong>${amsCount || "–"}</strong></div>
      </div>
      <button class="fleet-detail" data-open-printer="${cssEscape(printer.id)}">Details öffnen <ha-icon icon="mdi:arrow-right"></ha-icon></button>
    </article>`;
  }

  _renderFleetOverview() {
    const printers = this._visiblePrinters();
    const printing = printers.filter((p) => { const st=this._val(p,"status",""); return ["running","printing","prepare","preparing","pause","paused"].includes(normalize(st)) || safePercent(this._num(p,"progress",0)) > 0; }).length;
    return `<div class="fleet-page"><section class="fleet-summary"><div><div class="eyebrow">Control Center</div><h2>Alle Drucker</h2><p>${printers.length} ${printers.length === 1 ? "Drucker" : "Drucker"} erkannt · ${printing} aktiv</p></div><div class="fleet-summary-badges"><span class="pill ok"><span class="dot"></span>${printing} druckt</span><span class="pill">${printers.length} gesamt</span></div></section><div class="fleet-grid">${printers.map((p) => this._renderPrinterOverviewCard(p)).join("")}</div></div>`;
  }

  _renderView(printer) {
    if (this._activeView === "overview") return this._renderFleetOverview();
    if (!printer) return `<section class="panel"><div class="empty">Kein Drucker ausgewählt.</div></section>`;
    if (this._activeView === "energy") return `<div class="view-grid">${this._renderEnergy(printer)}</div>`;
    if (this._activeView === "maintenance") return `<div class="view-grid">${this._renderMaintenance(printer)}${this._renderInfo(printer)}</div>`;
    return `<div class="detail-layout"><div class="detail-main">${this._renderHero(printer)}<div class="wide-grid">${this._renderTemperatures(printer)}${this._renderInfo(printer)}</div>${printerSectionEnabled(this._config, printer, "ams") ? this._renderAMS(printer) : ""}</div><div class="detail-side">${printerSectionEnabled(this._config, printer, "camera") ? this._renderCamera(printer) : ""}${this._renderControls(printer)}${printerSectionEnabled(this._config, printer, "energy") ? this._renderEnergy(printer) : ""}${printerSectionEnabled(this._config, printer, "maintenance") ? this._renderMaintenance(printer) : ""}</div></div>`;
  }

  _renderBody() {
    if (!this._hass || (this._loading && !this._loaded)) {
      return `<div class="shell"><div class="panel"><div class="empty"><ha-icon icon="mdi:printer-3d"></ha-icon>Bambu-Geräte werden automatisch erkannt …</div></div></div>`;
    }
    if (this._loadError) return `<div class="shell"><div class="error-panel"><strong>Geräteerkennung fehlgeschlagen</strong><br>${cssEscape(this._loadError)}</div></div>`;
    const visiblePrinters = this._visiblePrinters();
    if (!visiblePrinters.length) return `<div class="shell"><div class="panel"><div class="empty"><ha-icon icon="mdi:printer-3d-off"></ha-icon>Kein sichtbarer Bambu-Lab-Drucker gefunden.<br><br>Installiere und konfiguriere zuerst <strong>greghesp/ha-bambulab</strong>. Zusätzliche Lovelace-Karten sind nicht erforderlich.</div></div></div>`;

    const printer = this._selectedPrinter();
    if (!this._selectedPrinterId || !visiblePrinters.some((p)=>p.id===this._selectedPrinterId)) this._selectedPrinterId = printer?.id || null;
    const online = printer ? this._st(printer, "online") : null;
    const isOnline = printer ? (online ? String(online.state).toLowerCase() === "on" : !this._entityEntries(printer).every((e) => isUnavailableState(this._hass.states[e.entity_id]))) : false;
    const viewLabel = this._navItems().find((x) => x[0] === this._activeView)?.[2] || "Übersicht";
    const printers = visiblePrinters.map((p) => `<button class="tab ${p.id === printer?.id ? "active" : ""}" data-printer="${cssEscape(p.id)}"><ha-icon icon="mdi:printer-3d"></ha-icon><span>${cssEscape(configuredPrinterName(this._config,p))}</span></button>`).join("");

    return `<div class="shell"><div class="app-grid">
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
    const progress = safePercent(this._num(printer, "progress", 0));
    const statusRaw = this._val(printer, "status", "unknown");
    const status = translateStatus(statusRaw);
    const task = this._val(printer, "taskName", "Kein aktiver Druckauftrag");
    const remaining = this._num(printer, "remainingTime", null);
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
        <div class="task"><div class="task-name">${cssEscape(task)}</div><div class="task-meta"><span>${cssEscape(this._val(printer, "currentStage", status))}</span></div>
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
      rows.push(`<div class="info-row"><div class="row-label"><ha-icon icon="${icon}"></ha-icon>${label}</div><div class="row-value">${this._formatStateWithUnit(st)}</div></div>`);
    }
    const door = this._st(printer, "doorOpen");
    if (door) rows.push(`<div class="info-row"><div class="row-label"><ha-icon icon="mdi:door"></ha-icon>Tür</div><div class="row-value">${String(door.state).toLowerCase() === "on" ? "Offen" : "Geschlossen"}</div></div>`);
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Details</div><div class="panel-title">Druckerinformationen</div></div></div>${rows.length ? `<div class="info-list">${rows.join("")}</div>` : `<div class="empty">Keine zusätzlichen Druckerinformationen vorhanden.</div>`}</section>`;
  }

  _renderCamera(printer) {
    const cameraUrl = this._cameraUrl(printer);
    return `<section class="panel camera-panel"><div class="panel-head"><div><div class="eyebrow">Live Camera</div><div class="panel-title">Kamera</div></div></div><div class="camera-wrap">${cameraUrl ? `<img src="${cameraUrl}" alt="Live-Kamera von ${cssEscape(displayName(printer.device))}">` : `<div class="camera-empty"><ha-icon icon="mdi:cctv-off"></ha-icon>Keine Kamera-Entität verfügbar oder Kamera nicht aktiviert.</div>`}<div class="camera-actions"><button class="icon-btn" data-action="refresh-camera" title="Kamera aktualisieren"><ha-icon icon="mdi:refresh"></ha-icon></button></div></div></section>`;
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
    const allEntries = this._entities.filter(isBambuRegistryEntry).filter((e)=>allowedIds.has(e.device_id));
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
    const re = new RegExp(`tray[_ -]?${n}(?:$|[_-])`, "i");
    const matches = entries.filter((e) => re.test(String(e.unique_id || "")));
    if (!matches.length) return null;
    let primary = matches.find((e) => /^sensor\./.test(e.entity_id) && this._hass.states[e.entity_id]) || matches[0];
    const st = this._hass.states[primary.entity_id];
    const attrs = { ...(st?.attributes || {}) };
    for (const e of matches) {
      const s = this._hass.states[e.entity_id];
      if (!s) continue;
      Object.assign(attrs, s.attributes || {});
      const uid = String(e.unique_id || "").toLowerCase();
      if (uid.includes("remaining")) attrs.remaining_filament = s.state;
      if (uid.includes("active")) attrs.active = String(s.state).toLowerCase() === "on";
    }
    const remainingCandidates = [attrs.remaining_filament, attrs.remain, attrs.remaining, attrs.tray_weight];
    const remaining = remainingCandidates.map(Number).find(Number.isFinite);
    const name = attrs.name || attrs.filament_name || attrs.tray_sub_brands || attrs.tray_type || attrs.type || (st && !["unknown","unavailable"].includes(String(st.state).toLowerCase()) ? st.state : null);
    const type = attrs.type || attrs.tray_type || attrs.filament_type || null;
    const color = colorFromAttributes(attrs) || "#7b887f";
    const active = attrs.active === true || attrs.is_active === true || String(attrs.active).toLowerCase() === "true";
    return { n, name: name || `Slot ${n}`, type, remaining, color, active };
  }

  _renderAmsUnit(group) {
    const name = displayName(group.device || { name: "AMS" });
    return `<div class="ams-unit"><div class="ams-unit-head"><div class="ams-name">${cssEscape(name)}</div><span class="pill">${group.slots.length} Slots</span></div><div class="spools">${group.slots.map((s) => `<div class="spool ${s.active ? "active" : ""}"><div class="spool-disc" style="--filament:${cssEscape(s.color)}"></div><div class="spool-title">${cssEscape(s.name)}</div><div class="spool-meta">${s.type ? cssEscape(s.type) : `Slot ${s.n}`}${Number.isFinite(s.remaining) ? ` · ${formatNumber(s.remaining,0)}%` : ""}</div></div>`).join("")}</div></div>`;
  }

  _renderControls(printer) {
    const pause = findRegistryEntry(printer.entries, ENTITY_KEYS.pause);
    const resume = findRegistryEntry(printer.entries, ENTITY_KEYS.resume);
    const stop = findRegistryEntry(printer.entries, ENTITY_KEYS.stop);
    const light = findRegistryEntry(printer.entries, ENTITY_KEYS.chamberLight);
    const speed = findRegistryEntry(printer.entries, ENTITY_KEYS.speed);
    const controls = [];
    if (pause) controls.push(this._controlButton("pause", "mdi:pause", "Pause"));
    if (resume) controls.push(this._controlButton("resume", "mdi:play", "Fortsetzen"));
    if (stop) controls.push(this._controlButton("stop", "mdi:stop", "Stop", true));
    if (light) controls.push(this._controlButton("light", "mdi:lightbulb", "Licht"));
    const speedState = speed ? this._hass.states[speed.entity_id] : null;
    const options = speedState?.attributes?.options || [];
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Quick Controls</div><div class="panel-title">Steuerung</div></div></div>${controls.length ? `<div class="controls">${controls.join("")}</div>` : `<div class="empty">Keine steuerbaren Entitäten vorhanden. Das kann je nach Bambu-Firmware und Verbindungsmodus normal sein.</div>`}${speed && options.length ? `<div class="select-wrap"><select data-speed-select><option value="">Geschwindigkeit auswählen …</option>${options.map((o) => `<option value="${cssEscape(o)}" ${speedState.state === o ? "selected" : ""}>${cssEscape(o)}</option>`).join("")}</select></div>` : ""}</section>`;
  }

  _controlButton(action, icon, label, danger = false) {
    return `<button class="control-btn ${danger ? "danger" : ""}" data-action="${action}"><ha-icon icon="${icon}"></ha-icon>${label}</button>`;
  }

  _renderEnergy(printer) {
    const cfg = resolveConfiguredPrinter(this._config, printer.id);
    const powerState = cfg.power_entity ? this._hass.states[cfg.power_entity] : null;
    const energyState = cfg.energy_entity ? this._hass.states[cfg.energy_entity] : null;
    if (!cfg.power_entity && !cfg.energy_entity) {
      return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Energy</div><div class="panel-title">Stromverbrauch</div></div></div><div class="empty"><ha-icon icon="mdi:flash-off"></ha-icon>Kein externer Stromsensor zugeordnet. Öffne den visuellen Karteneditor und ordne diesem Drucker optional Leistungs- und Energie-Sensoren zu. Es werden keine Werte erfunden.</div></section>`;
    }
    const power = powerState && hasMeaningfulValue(powerState) ? Number(powerState.state) : null;
    const energy = energyState && hasMeaningfulValue(energyState) ? Number(energyState.state) : null;
    const price = Number(this._config.kwh_price);
    const cost = Number.isFinite(energy) && Number.isFinite(price) ? energy * price : null;
    const samples = this._powerSamples.get(printer.id) || [];
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Energy</div><div class="panel-title">Stromverbrauch</div></div></div><div class="energy-body"><div class="energy-stats"><div class="energy-stat"><small>Leistung</small><strong>${Number.isFinite(power) ? formatWatt(this._convertPowerToW(powerState, power)) : "–"}</strong></div><div class="energy-stat"><small>Energie</small><strong>${Number.isFinite(energy) ? formatKwh(this._convertEnergyToKwh(energyState, energy)) : "–"}</strong></div><div class="energy-stat"><small>Kosten</small><strong>${cost === null ? "–" : `${formatNumber(this._convertEnergyToKwh(energyState, energy) * price, 2)} €`}</strong></div></div>${samples.length > 1 ? this._sparkline(samples) : `<div class="notice" style="margin-top:12px">Die Leistungskurve wird aus echten Live-Werten während der geöffneten Dashboard-Sitzung aufgebaut. Historische Messwerte werden nicht simuliert.</div>`}</div></section>`;
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

  _renderMaintenance(printer) {
    const total = this._num(printer, "totalUsage", null);
    const cfg = resolveConfiguredPrinter(this._config, printer.id);
    const items = Array.isArray(cfg.maintenance) ? cfg.maintenance : [];
    let content = "";
    if (total !== null) content += `<div class="maint-item"><div class="maint-top"><strong>Gesamtlaufzeit</strong><span>${formatNumber(total, 1)} ${unit(this._st(printer, "totalUsage")) || "h"}</span></div></div>`;
    for (const item of items) {
      const interval = Number(item.interval_hours);
      const last = Number(item.last_service_hours || 0);
      if (!Number.isFinite(interval) || interval <= 0 || total === null) continue;
      const used = Math.max(0, total - last);
      const pct = Math.min(100, (used / interval) * 100);
      const remaining = Math.max(0, interval - used);
      content += `<div class="maint-item"><div class="maint-top"><strong>${cssEscape(item.name || "Wartung")}</strong><span>${formatNumber(remaining, 0)} h verbleibend</span></div><div class="bar"><span style="width:${pct}%"></span></div></div>`;
    }
    if (!content) content = `<div class="empty">Keine Wartungsintervalle konfiguriert. Es werden bewusst keine Herstellerintervalle erfunden.</div>`;
    return `<section class="panel"><div class="panel-head"><div><div class="eyebrow">Maintenance</div><div class="panel-title">Wartung</div></div></div><div class="maintenance">${content}</div></section>`;
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
    this.shadowRoot.querySelectorAll("[data-printer]").forEach((btn) => btn.addEventListener("click", () => {
      this._selectedPrinterId = btn.dataset.printer;
      this._render();
    }));
    this.shadowRoot.querySelectorAll("[data-open-printer]").forEach((el) => el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this._selectedPrinterId = el.dataset.openPrinter;
      this._activeView = "detail";
      this._render();
    }));
    this.shadowRoot.querySelectorAll("[data-action]").forEach((btn) => btn.addEventListener("click", (ev) => this._handleAction(ev.currentTarget.dataset.action)));
    const select = this.shadowRoot.querySelector("[data-speed-select]");
    if (select) select.addEventListener("change", (ev) => this._setSpeed(ev.target.value));
  }

  async _handleAction(action) {
    const printer = this._selectedPrinter();
    if (!printer) return;
    if (action === "refresh-camera") {
      const reg = findRegistryEntry(printer.entries, ENTITY_KEYS.forceRefresh);
      if (reg) await this._callEntity(reg);
      this._cameraBust = Date.now();
      this._render();
      return;
    }
    const map = { pause: ENTITY_KEYS.pause, resume: ENTITY_KEYS.resume, stop: ENTITY_KEYS.stop, light: ENTITY_KEYS.chamberLight };
    const reg = findRegistryEntry(printer.entries, map[action] || []);
    if (reg) await this._callEntity(reg);
  }

  async _callEntity(reg) {
    const [domain] = reg.entity_id.split(".");
    try {
      if (domain === "button") return await this._hass.callService("button", "press", { entity_id: reg.entity_id });
      if (domain === "light") return await this._hass.callService("light", "toggle", { entity_id: reg.entity_id });
      if (domain === "switch") return await this._hass.callService("switch", "toggle", { entity_id: reg.entity_id });
    } catch (err) {
      console.error("[Bambu Lab Dashboard] Action failed", reg.entity_id, err);
    }
  }

  async _setSpeed(option) {
    if (!option) return;
    const printer = this._selectedPrinter();
    const reg = findRegistryEntry(printer.entries, ENTITY_KEYS.speed);
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
  }
  setConfig(config) { this._config = JSON.parse(JSON.stringify(config || {})); this._render(); }
  set hass(hass) { this._hass = hass; if (!this._loaded) this._load(); else this._render(); }
  async _load() {
    if (!this._hass) return;
    try {
      [this._devices, this._entities] = await Promise.all([
        this._hass.callWS({ type: "config/device_registry/list" }),
        this._hass.callWS({ type: "config/entity_registry/list" }),
      ]);
      this._printers = buildPrinterModels(this._devices, this._entities);
    } finally { this._loaded = true; this._render(); }
  }
  _render() {
    if (!this.shadowRoot) return;
    const powerEntities = Object.values(this._hass?.states || {}).filter((s) => s.attributes?.device_class === "power");
    const energyEntities = Object.values(this._hass?.states || {}).filter((s) => s.attributes?.device_class === "energy");
    const bambuEntries = this._entities.filter(isBambuRegistryEntry);
    const amsCandidates = this._devices.filter((d) => {
      const entries = bambuEntries.filter((e)=>e.device_id===d.id);
      const text = `${d.name_by_user || ""} ${d.name || ""} ${d.model || ""} ${entries.map((e)=>`${e.unique_id||""} ${e.translation_key||""}`).join(" ")}`;
      return /ams|tray[_ -]?\d/i.test(text) && !this._printers.some((p)=>p.id===d.id);
    });
    const sortedPrinters = [...this._printers].sort((a,b)=>configuredPrinterOrder(this._config,a,this._printers.indexOf(a))-configuredPrinterOrder(this._config,b,this._printers.indexOf(b)));
    this.shadowRoot.innerHTML = `<style>${styles}</style><div class="editor"><h3>Bambu Lab Dashboard</h3><div class="help">Die Bambu-Lab-Integration liefert die Daten. Hier legst du Darstellung, Reihenfolge und optionale Zuordnungen fest. Ohne manuelle AMS-Zuordnung wird die Gerätehierarchie von Home Assistant verwendet.</div><div class="editor-section"><label>Strompreis in €/kWh</label><input type="number" min="0" step="0.01" data-kwh-price value="${cssEscape(this._config.kwh_price ?? "")}" placeholder="optional"></div>${sortedPrinters.map((p,idx) => {
      const cfg = resolveConfiguredPrinter(this._config, p.id);
      const selectedAms = new Set(Array.isArray(cfg.ams_device_ids) ? cfg.ams_device_ids : []);
      const autoAms = new Set((p.childDevices || []).map((d)=>d.id));
      return `<div class="editor-section" data-editor-printer="${cssEscape(p.id)}"><div class="editor-title-row"><strong>${cssEscape(displayName(p.device))}</strong><label class="check"><input type="checkbox" data-field="visible" ${cfg.visible !== false ? "checked" : ""}> anzeigen</label></div><div class="editor-row"><div><label>Anzeigename</label><input type="text" data-field="name" value="${cssEscape(cfg.name || "")}" placeholder="${cssEscape(displayName(p.device))}"></div><div><label>Reihenfolge</label><input type="number" data-field="order" value="${cssEscape(cfg.order ?? idx+1)}" min="1" step="1"></div><div><label>Leistungssensor</label><select data-field="power_entity"><option value="">Nicht zugeordnet</option>${powerEntities.map((st) => `<option value="${cssEscape(st.entity_id)}" ${cfg.power_entity === st.entity_id ? "selected" : ""}>${cssEscape(st.attributes.friendly_name || st.entity_id)}</option>`).join("")}</select></div><div><label>Energiesensor</label><select data-field="energy_entity"><option value="">Nicht zugeordnet</option>${energyEntities.map((st) => `<option value="${cssEscape(st.entity_id)}" ${cfg.energy_entity === st.entity_id ? "selected" : ""}>${cssEscape(st.attributes.friendly_name || st.entity_id)}</option>`).join("")}</select></div></div><div class="editor-sub"><label>Bereiche im Detail</label><div class="editor-checks">${[["ams","AMS"],["camera","Kamera"],["energy","Energie"],["maintenance","Wartung"]].map(([key,label])=>`<label class="check"><input type="checkbox" data-field="show_${key}" ${cfg[`show_${key}`] !== false ? "checked" : ""}> ${label}</label>`).join("")}</div></div><div class="editor-sub"><label>AMS-Zuordnung</label><div class="help">Leer lassen = automatisch. Hake nur dann Einheiten an, wenn du die Zuordnung manuell erzwingen willst.</div><div class="ams-editor">${amsCandidates.length ? amsCandidates.map((d)=>`<label class="check ams-option"><input type="checkbox" data-ams-device="${cssEscape(d.id)}" ${(selectedAms.size ? selectedAms.has(d.id) : false) ? "checked" : ""}> ${cssEscape(d.name_by_user || d.name || d.model || "AMS")}${autoAms.has(d.id) ? " <small>(automatisch erkannt)</small>" : ""}</label>`).join("") : `<span class="help">Keine AMS-Geräte in der Bambu-Integration gefunden.</span>`}</div></div></div>`;
    }).join("")}</div>`;
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
  _emit() { this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true })); }
}

if (!customElements.get("bambu-lab-dashboard")) customElements.define("bambu-lab-dashboard", BambuLabDashboard);
if (!customElements.get("bambu-lab-dashboard-editor")) customElements.define("bambu-lab-dashboard-editor", BambuLabDashboardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "bambu-lab-dashboard")) {
  window.customCards.push({ type: "bambu-lab-dashboard", name: "Bambu Lab Dashboard", description: "Auto-discovering Bambu Lab control center with AMS, camera, controls, energy and maintenance.", documentationURL: "https://github.com/theonix77/Bambulab-Dashboard#installation", preview: true });
}
console.info(`%c Bambu Lab Dashboard %c v${VERSION} `, "background:#50d926;color:#050907;font-weight:800;padding:3px 6px;border-radius:4px 0 0 4px", "background:#101713;color:#f4f7f5;padding:3px 6px;border-radius:0 4px 4px 0");
