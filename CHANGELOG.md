## 1.8.1

- Light theme: maintenance and AMS detail popups now inherit the selected/automatic dashboard theme.
- Added explicit light-theme styling for popup surfaces, text, buttons, borders, links and backdrops.
- Added a defined `--bd-card` surface variable used by popup/control elements.
- No printer-specific behavior changed.

# Changelog

## 1.8.0

- Dashboard-Oberfläche automatisch zweisprachig: Deutsch bei deutscher Home-Assistant-Sprache, Englisch bei englischer bzw. sonstiger Sprache als Fallback. Datumsformat passt sich der Sprache an.
- Wartungsbuttons mit deutlich sichtbarem Hover-/Active-/Focus-Feedback; nach Quittierung erscheint eine Bestätigung direkt im Wartungsbereich.
- Wartungsbuch auf 15 Einträge pro Seite begrenzt und um Seitennavigation erweitert.
- Filter nach Wartungsart und optional nur letzte 30 Tage.
- Kleine Auswertung im Wartungsbuch: Gesamtzahl, Einträge der letzten 30 Tage und häufigste Wartung.
- Einzelne Logbucheinträge können mit Sicherheitsabfrage gelöscht werden; komplettes Wartungsbuch kann ebenfalls geleert werden. Das Löschen des Logs setzt die separat gespeicherten nächsten Wartungstermine nicht zurück.
- Wartungs-Hinweise erweitert: Dashboard-Termine sind Erinnerungen nach Bambu-Vorgaben; sichtbarer Verschleiß, Verschmutzung oder eine direkte Wartungsmeldung des Druckers haben Vorrang.
- Alle Wartungsintervall-Korrekturen aus v1.6.3 sowie sämtliche vorherigen Änderungen bleiben enthalten.

## 1.6.3

- Wartungslogik des X2D auf die offiziellen Zeitintervalle aus Kapitel 11 des Bambu-Lab-Handbuchs umgestellt; Gesamtbetriebsstunden lösen keine Wartung mehr aus.
- Neue Installation/noch nie quittierte Wartung wird nicht mehr sofort als fällig markiert. Der lokale Wartungszyklus startet beim ersten Laden der neuen Logik.
- Build Plate und Druckraum bleiben als laufende Pflege sichtbar. Längerfristige Wartungen werden nach Quittierung ausgeblendet und erscheinen automatisch zum nächsten Termin wieder.
- Neue kompakte Übersicht „Nächste Wartungen“ für ausgeblendete, noch nicht fällige Aufgaben.
- Hinweise zu Bambu-Labs verkürzten Intervallen bei Hochtemperatur-/Engineering-Filamenten oder durchschnittlich mehr als 8 Druckstunden pro Tag ergänzt.
- Wartungs-Infotexte und Quellen/Seitenverweise für X2D präzisiert; A2L erhält weiterhin keine erfundenen Zeitintervalle, wenn Bambu selbst keine nennt.

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
## 1.8.0
- Wartung vollständig modellabhängig: das Profil wird automatisch aus dem von `ha-bambulab` gemeldeten Druckermodell gewählt.
- Abdeckung aller aktuell von `ha-bambulab` gelisteten Druckermodelle: A1, A1 mini, A2L, P1P, P1S, P2S, H2C, H2D, H2D Pro, H2S, X1, X1C, X1E und X2D.
- Keine Übernahme von X2D-Intervallen auf andere Modelle. Kalendertermine werden nur berechnet, wenn ein verifiziertes Bambu-Intervall für genau dieses Modell/Profil hinterlegt ist.
- Unbekannte zukünftige Modelle erhalten einen sicheren allgemeinen Fallback ohne erfundene Fristen.
- Wartungsseite zeigt das automatisch gewählte Modell-/Familienprofil an.
