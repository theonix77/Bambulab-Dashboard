# Validation v1.4.0

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
- Direkte Auswahl für Leistungs-/Energiesensoren vorhanden; Geräte-/Entity-Namen und Einheiten werden sichtbar angeboten
- responsive Bilddarstellung mit `object-fit: contain`
- Scroll-State-Preservation vorhanden
- HACS-Metadaten und ZIP-Struktur

Nicht vollständig außerhalb einer realen Home-Assistant-Instanz prüfbar:

- welche Schreib-Entitäten ein konkreter Drucker/Firmwarestand tatsächlich bereitstellt
- reale AMS-Attribute jedes AMS-Modells
- Kamera-/Cover-Verfügbarkeit
- Verhalten jeder HA-Frontend-Version und jedes View-Typs


## v1.4.0 zusätzliche Prüfziele

- Editor-Zustand bleibt über Config-Re-Renders erhalten.
- Control-Discovery berücksichtigt `hass.entities`.
- Energie-Auswahl ist nicht mehr vom `ha-entity-picker` abhängig.
- A2L verweist nicht auf ein nicht existentes oder falsches Modellbild.
- `total_usage_hours` wird strikt gemappt.
