# Changelog

## 1.1.1

- Home-Assistant-Sections: Karte ist wieder zwischen 6 und 12 Spalten skalierbar; `columns: full` wurde entfernt.
- Drucker-Schalter oben/seitlich öffnen jetzt direkt die Detailansicht des gewählten Druckers.
- Fleet-Karten auf schmalen Breiten robuster: kein Überdecken von Bild, Fortschritt oder Kennzahlen.
- A2L zeigt nun das vom Upstream-Projekt derzeit ebenfalls verwendete A1-Modellbild als Übergang, bis ein eigenes A2L-Bild verfügbar ist.
- Offline/idle Geräte mit altem 100%-Fortschrittswert werden nicht mehr als aktiver Druck gezählt.
- Leistung/Energie im Editor erkennen zusätzlich Einheiten und übliche Namen, nicht nur `device_class`.
- Live-Vorschau im Karten-Picker deaktiviert, damit dort nicht das komplette Control Center gequetscht gerendert wird.
- README-Links korrigiert und Hinweise zu Breite, Pflicht-Integration und optionalen Karten präzisiert.

## 1.1.0

- neue Fleet-Übersicht: alle Drucker gleichzeitig sichtbar
- kompakte Statuskarten mit Fortschritt, Auftrag, Restzeit und Temperaturen
- Klick auf Drucker öffnet dessen Detailansicht
- AMS direkt dem jeweiligen Drucker zugeordnet und in dessen Detailansicht angezeigt
- manuelle AMS-Zuordnung als Fallback im visuellen Editor
- Drucker umbenennen, sortieren, ein-/ausblenden
- Kamera, AMS, Energie und Wartung pro Drucker ein-/ausblendbar
- Energie-/Leistungssensoren weiterhin pro Drucker konfigurierbar
- Discovery verwendet strikt `platform === "bambu_lab"`
- Entity-Erkennung berücksichtigt `translation_key` zusätzlich zu `unique_id`
- HACS-/Dashboard-Update-Geräte werden nicht mehr durch ihren Namen oder ihre Unique-ID als Bambu-Drucker klassifiziert
- README und Installationsdokumentation grundlegend überarbeitet

## 1.0.3

- Cockpit-Navigation und responsive Grundstruktur
- automatische Druckererkennung und Modellgrafiken

## 1.0.2

- Container-Responsive-Layout und Discovery-Korrekturen

## 1.0.1

- Standalone-HACS-Runtime in einer JavaScript-Datei
