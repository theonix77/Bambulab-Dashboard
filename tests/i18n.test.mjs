import fs from "node:fs";
import assert from "node:assert/strict";

const code = fs.readFileSync(new URL("../Bambulab-Dashboard.js", import.meta.url), "utf8");
const marker = "const I18N_EN = Object.freeze(";
const start = code.indexOf(marker);
const end = code.indexOf("\n});\nfunction uiLanguage", start);
assert.ok(start >= 0 && end > start, "I18N_EN block not found");
const objectSource = code.slice(start + marker.length, end + 2);
const dict = Function(`"use strict"; return (${objectSource});`)();

function en(text) {
  let out = String(text ?? "");
  for (const [de, translated] of Object.entries(dict).sort((a,b)=>b[0].length-a[0].length)) {
    out = out.split(de).join(translated);
  }
  return out;
}

const required = [
  "Übersicht", "Drucker-Details", "Drucker offline", "Aktiver Druckauftrag", "Kein aktiver Druckauftrag",
  "Düse links", "Düse rechts", "Druckbett", "Bauteillüfter", "Aux-Lüfter", "Kammerlüfter",
  "Druckgewicht", "Drucklänge", "Druckplatte", "Gesamtlaufzeit", "Kamera aktualisieren",
  "Fortsetzen", "Kamera Einzelbilder", "Hinweistöne", "Düse Soll", "Bett Soll", "Druckgeschwindigkeit",
  "X-/Y-Bewegungssystem reinigen / prüfen", "Z-Gewindespindeln reinigen & schmieren", "Cutter, Wiper und PTFE prüfen",
  "Kameras, Lüfter und Filamentsensoren reinigen", "Druckraum und Luftwege reinigen", "Verschleißteile prüfen",
  "Kalenderintervalle werden nur dort berechnet, wo für dieses Modell ein verifiziertes Herstellerintervall hinterlegt ist.",
  "Für dieses Modell wird kein erfundenes Kalenderintervall verwendet. Aufgaben bleiben als regelmäßige bzw. zustandsabhängige Herstellerwartung sichtbar.",
  "Das Modell ist noch keinem verifizierten Profil zugeordnet; es wird bewusst nur ein sicherer allgemeiner Fallback gezeigt.",
  "Der Drucker druckt gerade. Smart-Steckdose wirklich ausschalten?",
  "Die Bambu-Lab-Integration liefert die Druckerdaten. Hier kannst du Reihenfolge, Namen, AMS, Energie, Theme und bei Bedarf auch die automatisch erkannten Kern-Entitäten pro Drucker überschreiben. Die Drucker-Modellbilder werden automatisch aus derselben Upstream-Bildquelle wie die Bambu-Karten bezogen und sind nicht manuell konfigurierbar.",
  "Leer lassen = automatische Zuordnung über die Home-Assistant-Gerätehierarchie. Nur echte AMS-Geräte werden angeboten; ExternalSpool-/Tray-/Cache-Hilfsgeräte sind hier ausgefiltert.",
  "Keine echten AMS-Geräte in der Bambu-Integration gefunden.",
  "Keine total_usage_hours-Entity bzw. kein letzter Gesamtwert verfügbar. Die letzte Druckdauer wird ausdrücklich nicht als Gesamtlaufzeit verwendet."
];
for (const text of required) {
  assert.notEqual(en(text), text, `missing English translation: ${text}`);
}

// Composite/dynamic UI strings must translate their German text fragments too.
for (const text of [
  "Live-Kamera von Demo Printer",
  "Slot 3 Details öffnen",
  " · aktuell keine Optionen",
  "A2L (automatisch erkannt)",
  "Bambu-Lab-Wartungsprofil: P1 Series · automatisch aus dem von Home Assistant gemeldeten Druckermodell gewählt."
]) {
  const translated = en(text);
  assert.ok(!/(Live-Kamera|Details öffnen|aktuell keine Optionen|automatisch erkannt|Wartungsprofil|gemeldeten Druckermodell|gewählt)/i.test(translated), `German fragment remains: ${translated}`);
}

// Non-German HA languages intentionally fall back to English.
assert.match(code, /uiLanguage\(hass\)==="de" \? "de-DE" : "en-US"/);
assert.match(code, /if\(uiLanguage\(hass\)==="de"\) return text/);
assert.match(code, /confirm\(translateUiText\("Der Drucker druckt gerade\. Smart-Steckdose wirklich ausschalten\?",this\._hass\)\)/);

console.log("i18n tests: ok");
