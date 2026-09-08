# Validierung v1.0.1

Stand: 2026-09-08

Diese Version wurde vor dem Verpacken mit folgenden Prüfungen kontrolliert:

- `Bambulab-Dashboard.js` ist die einzige JavaScript-Laufzeitdatei und enthält keine relativen `import`-Abhängigkeiten.
- `node --check Bambulab-Dashboard.js` erfolgreich.
- Custom-Element-Smoke-Test mit gemocktem Browser-Kontext erfolgreich: `bambu-lab-dashboard` und `bambu-lab-dashboard-editor` werden registriert.
- `window.customCards` enthält den Card-Picker-Eintrag `bambu-lab-dashboard`.
- Discovery-Test mit Drucker + AMS-Gerätehierarchie erfolgreich.
- Stable-Unique-ID-Suffix-Test erfolgreich.
- Modellabbildung für P1S und A1 Mini erfolgreich.
- `hacs.json` und `package.json` sind gültiges JSON.
- ZIP-Integrität mit `unzip -t` erfolgreich.
- Im ZIP liegen `hacs.json`, `README.md` und `Bambulab-Dashboard.js` direkt im Root; es gibt keinen zusätzlichen Verpackungsordner.
- Keine leeren Projektdateien im Paket.

## Geprüfte Upstream-Druckergrafiken

Die aktuelle Quelle `greghesp/ha-bambulab-cards/src/images` enthält Modellgrafiken für A1, A1 Mini, H2C, H2D, H2D Pro, H2S, P1P, P1S, P2S, X1C, X1E und X2D. Das Dashboard ordnet diese automatisch anhand von `device.model` zu. Für unbekannte/neue Modelle wird bewusst kein falsches Bild geraten; stattdessen erscheint ein neutrales Druckersymbol.

## Was hier nicht simuliert werden kann

Ein vollständiger End-to-End-Test gegen eine echte Home-Assistant-Instanz mit deinem konkreten Drucker, deiner Firmware und deinen realen Entitäten ist außerhalb dieser Home-Assistant-Instanz nicht möglich. Deshalb werden nicht unterstützte Entitäten capability-basiert ausgeblendet und es gibt keine erfundenen Werte.
