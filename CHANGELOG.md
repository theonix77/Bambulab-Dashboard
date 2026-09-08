# Changelog

## 1.2.0

- Übersichtskarten für schmale Home-Assistant-Sections neu abgesichert; Bild und Kennzahlen überlagern sich nicht mehr.
- Drucker-Umschalter verwendet dieselbe direkte Detail-Navigation wie die Druckerkarten.
- Offline-Status hat Vorrang vor alten Fortschrittswerten; veraltete 100-%-Werte zählen nicht als aktiver Druck.
- A2L verwendet nicht mehr das falsche A1-Modellbild.
- Eigene Druckerbilder pro Drucker konfigurierbar.
- Leistung und Energie akzeptieren alle `sensor.*`-Entities statt nur eng gefilterter Kandidaten.
- Erweiterte Entity-Overrides für Status, Fortschritt, Auftrag, Restzeit, Temperatur, Online, Kamera, Cover, Layer und Geschwindigkeit.
- Manuelle AMS-Auswahl auf echte AMS-Geräte eingeschränkt; ExternalSpool-/Tray-/Cache-Hilfsgeräte werden herausgefiltert.
- Interne Maximalbreite der Karte entfernt.
- README und Installationsanleitung vollständig auf Sections-/Panel-Breite, Smart-Steckdosen, eigene Bilder und Entity-Overrides angepasst.
- Preview im Home-Assistant-Karten-Picker bleibt deaktiviert.

## 1.1.1

- Responsive Mehrdrucker-Übersicht und Energie-/AMS-Korrekturen.

## 1.1.0

- Mehrdrucker-Übersicht, Druckerreihenfolge und manuelle AMS-Zuordnung.
