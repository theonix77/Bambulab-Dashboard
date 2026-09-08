# Changelog

## 1.6.2

- README um einen verkleinerten, zentrierten Dashboard-Screenshot ergänzt (`docs/images/dashboard-overview.png`, 1000 px Darstellungsbreite).
- Alle Korrekturen aus v1.6.0 und v1.6.1 vollständig enthalten: Plugin-konforme Steuerung/Diagnose, aktives Filament, X2D-Kameradiagnose, Wartungs-Popups, proportionale Druckerbilder, Smart-Steckdose sowie mobile Scroll-/Touch-Stabilisierung und responsive AMS-Slot-Details.
- Sichtbare Dashboard-Versionsanzeige und Paketversion auf v1.6.2 aktualisiert.

## 1.6.1

- Mobilansicht stabilisiert: Live-Entity-Updates lösen während eines aktiven Touch-/Scroll-Vorgangs keinen kompletten DOM-Neuaufbau mehr aus.
- Horizontale mobile Navigation und Druckerumschaltung mit eigenem Touch-Scrolling und `touch-action` abgesichert.
- AMS-Slot-Details öffnen jetzt in einem responsiven Modal statt unterhalb der AMS-Liste. Auf Smartphones nutzt das Detailfenster die gesamte Bildschirmfläche.
- AMS-Detailfenster lässt sich über X oder den Hintergrund schließen; Home-Assistant-Details bleiben direkt erreichbar.
- Mobile Scroll-Anker werden unterdrückt, um Sprünge bei Live-Updates zu vermeiden.

## 1.6.0

- Entity-Erkennung der Steuerung gegen die aktuelle `greghesp/ha-bambulab`-Struktur neu aufgebaut: `button`, `select`, `number`, `fan`, `light` und `switch` werden domain- und translation-key-genau zugeordnet.
- Schreibschutz/Hybrid-Modus wird erkannt und mit der offiziellen Plugin-Erklärung angezeigt; wenn die Integration nur Licht freigibt, zeigt das Dashboard keine erfundenen Regler.
- Aktives Filament (`active_tray`, Tray/ExternalSpool-Fallback) wird jetzt tatsächlich im Druckstatus gerendert, inklusive Farbe und Restwert, sofern gemeldet.
- Druckerbilder verwenden ausschließlich proportionserhaltende `max-width/max-height`-Skalierung.
- X2D-Kamera erhält Diagnose mit Entity, HA-Status, Token und More-Info-Link; das rote Ausrufezeichen ist der Fallback der Integration bei fehlendem nutzbaren RTSP-Endpunkt.
- Wartungsquellen sind anklickbar und öffnen ein responsives Popup mit direktem Link auf die offiziellen Bambu-PDFs.
- Gesamtlaufzeit wird ausschließlich aus `total_usage_hours` gelesen; letzter gültiger Gesamtwert wird lokal zwischengespeichert, damit Offline-Drucker nicht auf die letzte Druckdauer zurückfallen.

## 1.5.0

- Steuer-Entity-Erkennung auf kompletten Printer-Gerätebaum erweitert.
- Druckgeschwindigkeit, Solltemperaturen, Lüfter, Kamera-/Sound-Schalter und Druckbuttons als echte Controls.
- Externe Smart-Steckdose (`switch.*`) pro Drucker inklusive Status, Schalten und Sicherheitsabfrage.
- X2D-Kamera nutzt bevorzugt Home-Assistant Stream-Proxy.
- Aktives Filament mit Farbe im Druckstatus.
- Druckerbilder strikt proportional (`object-fit: contain`); A2L nutzt offiziellen Bambu-A2L-Fallback statt falschem A1-Bild.
- Strikte `total_usage_hours`-Anzeige; keine Verwechslung mit letzter Druckdauer.
- Modellbezogene Wartung, Fälligkeitsanzeige, Quittierung und lokales Wartungsbuch.
- Weitere Light-Theme-Kontrastkorrekturen.

## 1.4.0

- Merge von WebSocket Entity Registry und `hass.entities` für robustere Erkennung von Buttons, Numbers, Fans und Selects.
- Editor verliert geöffnete Details/Scrollposition bei Live-Updates nicht mehr.
- Energiezuordnung über sichtbare Listen aller Mess-Sensoren statt fehleranfälligem HA Entity Picker.
- AMS-Slot-Detailansicht direkt im Dashboard.
- Striktes `total_usage_hours`-Mapping für Gesamtlaufzeit; manueller Override ergänzt.
- Helles Theme kontrastfest überarbeitet.
- Proportionale Druckerbilder und mobile Stabilitätskorrekturen.
- Kein falsches A1-Bild als A2L-Ersatz.

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