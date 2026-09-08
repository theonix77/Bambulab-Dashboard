# Validation – v1.1.0

Ausgeführt vor dem Paketbau:

```text
node --check Bambulab-Dashboard.js
node tests/discovery.test.mjs
node tests/registration.test.mjs
```

Zusätzlich geprüft:

- `hacs.json` valides JSON
- `package.json` valides JSON und Version 1.1.0
- keine relativen Runtime-Imports
- Custom Element `bambu-lab-dashboard` wird registriert
- Editor `bambu-lab-dashboard-editor` wird registriert
- Discovery ignoriert HACS-Entitäten, auch wenn deren Unique-ID `bambu` enthält
- Discovery erkennt einen echten Drucker über `bambu_lab`-Entitäten
- `translation_key` wird bei Entity-Matching berücksichtigt
- Modellbild-Mapping besitzt einen neutralen Fallback
- ZIP wird ohne zusätzliche Top-Level-Verzeichnisebene gebaut

## Grenze der Validierung

Eine vollständige Ende-zu-Ende-Prüfung mit echten Bambu-Druckern kann nur in einer realen Home-Assistant-Instanz erfolgen. Unterschiedliche Druckermodelle, Firmwarestände und Versionen von `greghesp/ha-bambulab` können unterschiedliche Entitäten bereitstellen. Deshalb zeigt die Karte ausschließlich Funktionen an, für die Home Assistant tatsächlich Daten liefert.
