# Changelog

## 1.3.0

- Dark/Light/Auto-Theme im visuellen Editor.
- Druckerbilder behalten auf Desktop und Mobil ihre Proportionen (`object-fit: contain`).
- Manuelle Druckerbild-Auswahl entfernt; Modellbilder folgen der Upstream-Bambu-Kartenquelle.
- Kein falscher A1-Ersatz für A2L; neutraler Fallback, solange upstream kein korrektes A2L-Bild anbietet.
- AMS-Tray-Erkennung um `translation_key: tray` + `slot` erweitert.
- AMS-Slots anklickbar; Detaildialog mit Tray-Attributen und Home-Assistant-More-Info.
- Steuerung erweitert: Buttons, Zieltemperaturen (`number`), Lüfter (`fan`) und Selects.
- Druckgeschwindigkeit erkennt `translation_key: printing_speed`.
- Großes aktuelles Druckbild/Cover in der Detailansicht.
- Gesamtlaufzeit wird über `total_usage_hours` mit Einheitenumrechnung formatiert.
- Smart-Steckdosen-Zuordnung nutzt Home-Assistant-Entity-Picker für alle `sensor.*`-Entities.
- Scrollposition wird bei Live-Updates gespeichert/restauriert, um Sprünge nach oben zu verhindern.
- Kompakte Karten-Picker-Vorschau statt Full-Dashboard-Preview.
- README/Installation/Hilfe neu geschrieben.
