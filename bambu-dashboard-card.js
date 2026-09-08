import {
  VERSION, DOMAIN, ENTITY_KEYS, buildPrinterModels, displayName, findRegistryEntry,
  findState, stateValue, numericState, formatNumber, formatDurationMinutes,
  translateStatus, statusClass, safePercent, cssEscape, colorFromAttributes,
  unit, resolveConfiguredPrinter, formatKwh, formatWatt, hasMeaningfulValue,
  entitySuffixMatches
} from "./bambu-dashboard-utils.js";
import { styles } from "./bambu-dashboard-styles.js";

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

  async _discover() {
    if (!this._hass) return;
    this._loading = true;
    this._loadError = null;
    this._render();
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

  _selectedPrinter() {
    return this._printers.find((p) => p.id === this._selectedPrinterId) || this._printers[0] || null;
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

  _render() {
    if (!this.shadowRoot) return;
    const body = this._renderBody();
    this.shadowRoot.innerHTML = `<style>${styles}</style>${body}`;
    this._bindEvents();
  }

  _renderBody() {
    if (!this._hass || this._loading) {
      return `<div class="shell"><div class="panel"><div class="empty"><ha-icon icon="mdi:printer-3d"></ha-icon>Bambu-Geräte werden automatisch erkannt …</div></div></div>`;
    }
    if (this._loadError) {
      return `<div class="shell"><div class="error-panel"><strong>Geräteerkennung fehlgeschlagen</strong><br>${cssEscape(this._loadError)}</div></div>`;
    }
    if (!this._printers.length) {
      return `<div class="shell"><div class="panel"><div class="empty"><ha-icon icon="mdi:printer-3d-off"></ha-icon>Kein Bambu-Lab-Drucker gefunden.<br><br>Voraussetzung ist die Home-Assistant-Integration <strong>Bambu Lab</strong> von greghesp. Sobald ein Drucker dort angelegt ist, erscheint er hier automatisch.</div></div></div>`;
    }

    const printer = this._selectedPrinter();
    const name = displayName(printer.device);
    const online = this._st(printer, "online");
    const isOnline = online ? String(online.state).toLowerCase() === "on" : true;

    return `
      <div class="shell">
        <div class="header">
          <div class="brand">
            <div class="brand-mark"><ha-icon icon="mdi:printer-3d"></ha-icon></div>
            <div><h1>BAMBU LAB</h1><small>Home Assistant Dashboard</small></div>
          </div>
          <div class="header-meta">
            <span class="pill ${isOnline ? "ok" : ""}"><span class="dot"></span>${isOnline ? "Online" : "Offline"}</span>
            <span class="pill">v${VERSION}</span>
          </div>
        </div>
        <div class="tabs">${this._printers.map((p) => `<button class="tab ${p.id === printer.id ? "active" : ""}" data-printer="${cssEscape(p.id)}"><ha-icon icon="mdi:printer-3d"></ha-icon><span>${cssEscape(displayName(p.device))}</span></button>`).join("")}</div>
        <div class="layout">
          <div class="left">
            ${this._renderHero(printer)}
            <div class="grid-2">
              ${this._renderTemperatures(printer)}
              ${this._renderInfo(printer)}
            </div>
            ${this._renderAMS(printer)}
            ${this._renderEnergy(printer)}
          </div>
          <div class="right">
            ${this._renderCamera(printer)}
            ${this._renderControls(printer)}
            ${this._renderMaintenance(printer)}
          </div>
        </div>
      </div>`;
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
    return `<section class="panel glow">
      <div class="panel-head"><div><div class="eyebrow">Printer Status</div><div class="panel-title">${cssEscape(displayName(printer.device))}</div></div>${cover ? `<img alt="" src="${cover}" style="width:42px;height:42px;object-fit:cover;border-radius:10px;border:1px solid var(--bd-border)">` : ""}</div>
      <div class="hero-body">
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
    const byDevice = new Map();
    for (const entry of printer.childEntries || []) {
      const uid = String(entry.unique_id || "");
      if (!/tray[_ -]?\d/i.test(uid) && !/ams/i.test(uid)) continue;
      const key = entry.device_id || "ams";
      if (!byDevice.has(key)) byDevice.set(key, []);
      byDevice.get(key).push(entry);
    }
    const groups = [];
    for (const [deviceId, entries] of byDevice.entries()) {
      const device = printer.childDevices.find((d) => d.id === deviceId);
      const trayEntries = entries.filter((e) => /tray[_ -]?[1-4](?:$|[_-])/i.test(String(e.unique_id || "")) || /tray[_ -]?[1-4]$/i.test(String(e.unique_id || "")));
      if (!trayEntries.length) continue;
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
    this.shadowRoot.querySelectorAll("[data-printer]").forEach((btn) => btn.addEventListener("click", () => {
      this._selectedPrinterId = btn.dataset.printer;
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
    this.shadowRoot.innerHTML = `<style>${styles}</style><div class="editor"><h3>Bambu Lab Dashboard</h3><div class="help">Drucker und AMS werden automatisch erkannt. Nur externe Energie-Sensoren und optionale Wartungsintervalle müssen manuell zugeordnet werden.</div><div class="editor-section"><label>Strompreis in €/kWh</label><input type="number" min="0" step="0.01" data-kwh-price value="${cssEscape(this._config.kwh_price ?? "")}" placeholder="optional"></div>${this._printers.map((p) => {
      const cfg = resolveConfiguredPrinter(this._config, p.id);
      return `<div class="editor-section" data-editor-printer="${cssEscape(p.id)}"><strong>${cssEscape(displayName(p.device))}</strong><div class="editor-row"><div><label>Leistungssensor</label><select data-field="power_entity"><option value="">Nicht zugeordnet</option>${powerEntities.map((s) => `<option value="${cssEscape(s.entity_id)}" ${cfg.power_entity === s.entity_id ? "selected" : ""}>${cssEscape(s.attributes.friendly_name || s.entity_id)}</option>`).join("")}</select></div><div><label>Energiesensor</label><select data-field="energy_entity"><option value="">Nicht zugeordnet</option>${energyEntities.map((s) => `<option value="${cssEscape(s.entity_id)}" ${cfg.energy_entity === s.entity_id ? "selected" : ""}>${cssEscape(s.attributes.friendly_name || s.entity_id)}</option>`).join("")}</select></div></div></div>`;
    }).join("")}</div>`;
    this.shadowRoot.querySelector("[data-kwh-price]")?.addEventListener("change", (ev) => {
      const value = ev.target.value;
      if (value === "") delete this._config.kwh_price; else this._config.kwh_price = Number(value);
      this._emit();
    });
    this.shadowRoot.querySelectorAll("[data-editor-printer] select").forEach((sel) => sel.addEventListener("change", (ev) => {
      const root = ev.target.closest("[data-editor-printer]");
      const deviceId = root.dataset.editorPrinter;
      const field = ev.target.dataset.field;
      const printers = Array.isArray(this._config.printers) ? [...this._config.printers] : [];
      let item = printers.find((x) => x.device_id === deviceId);
      if (!item) { item = { device_id: deviceId }; printers.push(item); }
      if (ev.target.value) item[field] = ev.target.value; else delete item[field];
      this._config.printers = printers.filter((x) => Object.keys(x).length > 1);
      this._emit();
    }));
  }
  _emit() { this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true })); }
}

if (!customElements.get("bambu-lab-dashboard")) customElements.define("bambu-lab-dashboard", BambuLabDashboard);
if (!customElements.get("bambu-lab-dashboard-editor")) customElements.define("bambu-lab-dashboard-editor", BambuLabDashboardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "bambu-lab-dashboard")) {
  window.customCards.push({ type: "bambu-lab-dashboard", name: "Bambu Lab Dashboard", description: "Auto-discovering Bambu Lab printer dashboard with AMS, camera, controls and energy support.", preview: true });
}
console.info(`%c Bambu Lab Dashboard %c v${VERSION} `, "background:#50d926;color:#050907;font-weight:800;padding:3px 6px;border-radius:4px 0 0 4px", "background:#101713;color:#f4f7f5;padding:3px 6px;border-radius:0 4px 4px 0");
