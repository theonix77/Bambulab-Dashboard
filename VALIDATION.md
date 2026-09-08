# Validation – v1.1.1

Automatisch geprüft:

- `node --check Bambulab-Dashboard.js`
- `node tests/discovery.test.mjs`
- `node tests/registration.test.mjs`
- `package.json` und `hacs.json` als valides JSON
- Runtime weiterhin als einzelne HACS-JavaScript-Datei ohne relative Runtime-Imports
- Kartenregistrierung `custom:bambu-lab-dashboard`
- Picker-Preview deaktiviert (`preview: false`)
- Sections-Größe: 12 Spalten Standard, 6 Spalten Minimum, 12 Maximum
- A2L-Modellmapping vorhanden
- Drucker-Schalter wechselt in die Detailansicht

Nicht automatisiert möglich ist eine vollständige Ende-zu-Ende-Prüfung gegen jede reale Home-Assistant-/Bambu-Firmware-Kombination. Die reale Geräte- und AMS-Struktur muss deshalb zusätzlich in Home Assistant geprüft werden.
