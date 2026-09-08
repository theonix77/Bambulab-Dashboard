# Validierung v1.6.1

Statisch/automatisiert geprüft:

- JavaScript-Syntax (`node --check`)
- Custom-Element-Registrierung
- Discovery-Tests
- Controls im kompletten Printer-Gerätebaum
- Smart-Plug-Konfiguration und Service-Pfad
- X2D-Kamera Stream-Proxy-Fallback
- AMS-Tray/aktive-Filament-Logik
- `total_usage_hours` wird strikt verwendet
- Wartungsmodell, Quittierung und Wartungsbuch-Codepfad
- ZIP-Integrität

Eine vollständige Ende-zu-Ende-Prüfung aller Serviceaufrufe ist nur in einer realen Home-Assistant-Instanz mit den konkreten Druckern/Entities möglich.

- X2D-Wartungslogik: Herstellerintervalle, Wiederholung, Ausblenden nicht fälliger Aufgaben und Vorschau geprüft.
