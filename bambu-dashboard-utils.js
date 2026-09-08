export const VERSION = "1.0.0";
export const DOMAIN = "bambu_lab";

export const ENTITY_KEYS = {
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

export const STATUS_TRANSLATIONS = {
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

export const KNOWN_PRINTER_SUFFIXES = [
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

export function normalize(v) {
  return String(v ?? "").trim().toLowerCase();
}

export function isUnavailableState(stateObj) {
  if (!stateObj) return true;
  const s = normalize(stateObj.state);
  return s === "unknown" || s === "unavailable" || s === "none" || s === "";
}

export function entitySuffixMatches(uniqueId, alias) {
  const uid = String(uniqueId ?? "");
  const a = String(alias ?? "");
  return uid === a || uid.endsWith(`_${a}`) || uid.endsWith(`-${a}`) || uid.toLowerCase().endsWith(`_${a.toLowerCase()}`);
}

export function findRegistryEntry(entries, aliases) {
  for (const alias of aliases || []) {
    const match = entries.find((e) => entitySuffixMatches(e.unique_id, alias));
    if (match) return match;
  }
  return null;
}

export function findState(hass, entries, aliases) {
  const reg = findRegistryEntry(entries, aliases);
  return reg ? hass?.states?.[reg.entity_id] ?? null : null;
}

export function stateValue(hass, entries, aliases, fallback = null) {
  const st = findState(hass, entries, aliases);
  if (!st || isUnavailableState(st)) return fallback;
  return st.state;
}

export function numericState(hass, entries, aliases, fallback = null) {
  const value = stateValue(hass, entries, aliases, null);
  if (value === null) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function formatNumber(value, digits = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "–";
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(n);
}

export function formatDurationMinutes(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "–";
  const minutes = Math.max(0, Math.round(n));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h} h ${m.toString().padStart(2, "0")} min`;
  return `${m} min`;
}

export function translateStatus(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "Unbekannt";
  const upper = raw.toUpperCase();
  return STATUS_TRANSLATIONS[upper] || raw.replaceAll("_", " ");
}

export function statusClass(value) {
  const s = normalize(value);
  if (["running", "printing", "prepare", "preparing"].includes(s)) return "ok";
  if (["pause", "paused"].includes(s)) return "warn";
  if (["failed", "error"].includes(s)) return "bad";
  if (["offline", "unavailable"].includes(s)) return "muted";
  return "idle";
}

export function safePercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export function isBambuRegistryEntry(entry) {
  return entry?.platform === DOMAIN || normalize(entry?.unique_id).includes("bambu");
}

export function isBambuDevice(device) {
  const manufacturer = normalize(device?.manufacturer);
  const model = normalize(device?.model);
  const name = normalize(device?.name_by_user || device?.name);
  const identifiers = (device?.identifiers || []).flat().map(normalize).join(" ");
  return manufacturer.includes("bambu") || model.includes("bambu") || name.includes("bambu") || identifiers.includes(DOMAIN);
}

export function printerConfidence(device, entries) {
  let score = 0;
  const text = normalize(`${device?.manufacturer || ""} ${device?.model || ""} ${device?.name_by_user || device?.name || ""}`);
  if (text.includes("bambu")) score += 2;
  for (const suffix of KNOWN_PRINTER_SUFFIXES) {
    if (entries.some((e) => entitySuffixMatches(e.unique_id, suffix))) score += 1;
  }
  return score;
}

export function getDescendantDeviceIds(rootId, devices) {
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

export function cssEscape(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[ch]);
}

export function colorFromAttributes(attrs = {}) {
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

export function displayName(device) {
  return device?.name_by_user || device?.name || device?.model || "Bambu Lab Drucker";
}

export function unit(stateObj) {
  return stateObj?.attributes?.unit_of_measurement || "";
}

export function hasMeaningfulValue(stateObj) {
  return !!stateObj && !isUnavailableState(stateObj);
}

export function buildPrinterModels(devices, entities) {
  const bambuEntityDeviceIds = new Set(entities.filter(isBambuRegistryEntry).map((e) => e.device_id).filter(Boolean));
  const candidates = devices.filter((d) => bambuEntityDeviceIds.has(d.id) || isBambuDevice(d));
  const candidateIds = new Set(candidates.map((d) => d.id));

  const roots = candidates.filter((d) => {
    const ownEntries = entities.filter((e) => e.device_id === d.id && isBambuRegistryEntry(e));
    const parentIsBambu = d.via_device_id && candidateIds.has(d.via_device_id);
    return !parentIsBambu && printerConfidence(d, ownEntries) >= 2;
  });

  return roots.map((root) => {
    const descendants = getDescendantDeviceIds(root.id, devices);
    const rootEntries = entities.filter((e) => e.device_id === root.id && isBambuRegistryEntry(e));
    const childEntries = entities.filter((e) => descendants.has(e.device_id) && isBambuRegistryEntry(e));
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

export function resolveConfiguredPrinter(config, printerId) {
  const list = config?.printers || [];
  return list.find((p) => p.device_id === printerId) || {};
}

export function formatKwh(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${formatNumber(n, 2)} kWh` : "–";
}

export function formatWatt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${formatNumber(n, n < 100 ? 1 : 0)} W` : "–";
}
