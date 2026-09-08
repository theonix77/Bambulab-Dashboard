# Validation – v1.2.0

Automatisch geprüft:

- `node --check Bambulab-Dashboard.js`
- `node tests/discovery.test.mjs`
- `node tests/runtime.test.mjs`
- `node tests/features.test.mjs`
- `node tests/registration.test.mjs`
- `package.json` und `hacs.json` als valides JSON
- Runtime weiterhin als einzelne HACS-JavaScript-Datei ohne relative Runtime-Imports
- Kartenregistrierung `custom:bambu-lab-dashboard`
- Karten-Picker-Preview deaktiviert (`preview: false`)
- HACS-Datei `Bambulab-Dashboard.js` liegt im Repository-Root
- Druckererkennung ignoriert HACS-/Update-Geräte
- `translation_key`-Matching für Bambu-Entities
- A2L besitzt keinen falschen A1-Bild-Fallback
- benutzerdefiniertes Druckerbild pro Drucker
- direkte Navigation über `data-open-printer`
- Offline-Status verhindert, dass ein alter 100-%-Wert als aktiver Druck gezählt wird
- Druckerübersicht zeigt bei Offline-Druckern keinen aktiven 100-%-Fortschritt
- alle `sensor.*`-Entities sind für Leistung/Energie zulässig
- manuelle Entity-Overrides für zentrale Druckerdaten vorhanden
- AMS-Hilfsgeräte `ExternalSpool`/Tray/Cache werden aus der manuellen AMS-Auswahl herausgefiltert
- interne Karten-Maximalbreite entfernt (`max-width:none`)

Zusätzlich wurde die Dokumentation auf die technische Home-Assistant-Breitenbegrenzung geprüft: Eine Custom Card kann die Breite ihrer übergeordneten Section nicht ändern. Für eine breitere Darstellung muss die Section selbst breiter konfiguriert oder eine Panel-View verwendet werden.

Nicht vollständig automatisierbar ist die Ende-zu-Ende-Prüfung gegen jede reale Home-Assistant-/Bambu-Firmware-/Gerätekombination. Insbesondere Kamera-Streams, echte AMS-Gerätehierarchien und herstellerspezifische Smart-Plug-Entities müssen in einer realen Home-Assistant-Instanz final verifiziert werden.
