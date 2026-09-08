# Validation v1.3.0

Statisch/automatisiert geprüft:

- `node --check Bambulab-Dashboard.js`
- Custom Element `bambu-lab-dashboard`
- Editor `bambu-lab-dashboard-editor`
- Drucker-Discovery nur aus `platform: bambu_lab`
- Theme-Konfiguration Dark/Light/Auto vorhanden
- AMS-Tray-Erkennung für Unique-ID und Slot-Attribut vorhanden
- anklickbare AMS-Slots / `hass-more-info`
- Buttons, `number`, `fan`, `select`, `light` Service-Pfade vorhanden
- `printing_speed`-Select-Mapping vorhanden
- großes Print-Cover vorhanden
- Zeiteinheiten-Konvertierung für Gesamtlaufzeit vorhanden
- Home-Assistant `ha-entity-picker` für Leistungs-/Energiesensoren vorhanden
- responsive Bilddarstellung mit `object-fit: contain`
- Scroll-State-Preservation vorhanden
- HACS-Metadaten und ZIP-Struktur

Nicht vollständig außerhalb einer realen Home-Assistant-Instanz prüfbar:

- welche Schreib-Entitäten ein konkreter Drucker/Firmwarestand tatsächlich bereitstellt
- reale AMS-Attribute jedes AMS-Modells
- Kamera-/Cover-Verfügbarkeit
- Verhalten jeder HA-Frontend-Version und jedes View-Typs
