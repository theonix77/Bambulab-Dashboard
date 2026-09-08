# Bambu Lab Dashboard for Home Assistant

Eigenständiges Mehrdrucker-Control-Center für Home Assistant. Die Karte nutzt ausschließlich die Geräte, Entitäten und Services der Home-Assistant-Integration [greghesp/ha-bambulab](https://github.com/greghesp/ha-bambulab). Zusätzliche Bambu-Lovelace-Karten sind nicht erforderlich.

<p align="center">
  <img src="docs/images/dashboard-overview.png" alt="Bambu Lab Dashboard – Übersicht" width="1000">
</p>


## Wichtig: Schreibzugriffe und „nur Licht geht“

`greghesp/ha-bambulab` dokumentiert selbst eine Firmware-/Autorisierungsbeschränkung von Bambu Lab: Lesefunktionen bleiben erhalten, aber im Cloud-/Hybrid-Betrieb können die meisten Schreibfunktionen fehlen. Für ältere Hybrid-Firmwares nennt die Integration ausdrücklich den Fall, dass **nur das Licht steuerbar bleibt**. Für volle Schreibzugriffe verlangt die Integration LAN Mode plus Developer LAN Mode. Das Dashboard kann diese Sperre nicht umgehen und zeigt sie ab v1.6.0 direkt im Steuerbereich an.

Plugin-Hinweis: https://github.com/greghesp/ha-bambulab/blob/main/docs/index.mdx


### Wartungslogik ab v1.6.3

Die X2D-Wartungsintervalle orientieren sich an Kapitel 11 des offiziellen Bambu-Lab-X2D-Handbuchs. Die Gesamtlaufzeit wird nur angezeigt und löst keine Wartung aus. Build Plate und Druckraum bleiben als laufende Pflege sichtbar; längerfristige Arbeiten werden nach dem Quittieren ausgeblendet und erscheinen automatisch wieder, wenn ihr nächstes Herstellerintervall erreicht ist. Eine kompakte Liste „Nächste Wartungen“ zeigt die kommenden Termine.

Beim ersten Start der neuen Logik beginnt für noch nie quittierte Arbeiten ein neuer lokaler Intervallzyklus, statt sie sofort als fällig zu markieren. Bereits im Wartungsbuch quittierte Arbeiten behalten ihr vorhandenes Datum. Für den X2D gelten bei normaler Nutzung u. a. 1 Woche für die Build Plate, 1 Monat für Kameras, Druckraumboden, X/Y, Extruder und Hotend sowie 3 Monate für Z-Achse und Luftfilter. Bei dauerhaftem Einsatz von Hochtemperatur-/Engineering-Filamenten oder durchschnittlich mehr als 8 Druckstunden pro Tag schreibt Bambu kürzere Intervalle vor.

## Installation

1. HACS → Dashboard → Benutzerdefinierte Repositories.
2. `https://github.com/theonix77/Bambulab-Dashboard` als Typ **Dashboard** hinzufügen.
3. Installieren und Browser mit `Strg+F5` neu laden.
4. Karte hinzufügen oder YAML verwenden:

```yaml
type: custom:bambu-lab-dashboard
```

## Funktionen in v1.6.3

- Mehrere Bambu-Drucker automatisch erkennen.
- Übersicht mit Status, Fortschritt, Restzeit, Temperaturen, AMS-Anzahl und Gesamtlaufzeit.
- Druckerbilder ausschließlich proportional skalieren (`object-fit: contain`, keine Verzerrung).
- Dark / Light / automatisch nach Home Assistant.
- Druckbild/Cover groß in der Detailansicht.
- Kamera mit Diagnose der tatsächlichen `camera.*`-Entity.
- AMS und einzelne Slots/Spulen mit Detailansicht.
- Aktives Filament aus `active_tray` bzw. aktivem Tray/ExternalSpool, inklusive Farbe und Restwert, sofern die Integration diese Daten meldet.
- Echte Steuerung über die von `ha-bambulab` bereitgestellten Domains:
  - `button`: Pause, Fortsetzen, Stop, Buzzer
  - `select`: Druckgeschwindigkeit (`printing_speed`), ggf. Airduct-Modus
  - `number`: Solltemperaturen Düse/Bett/Kammer
  - `fan`: Bauteil-, Aux-, Kammer- und weitere Lüfter
  - `light`: Kammerlicht
  - `switch`: Kamera-/Bildmodus und Hinweistöne, sofern vorhanden
- Externe Smart-Steckdose als `switch.*` pro Drucker, inklusive EIN/AUS und Sicherheitsabfrage beim Ausschalten während eines Drucks.
- Leistungs- und Energiesensoren frei zuordnen.
- Wartungsplan pro Drucker mit quittierbaren Aufgaben und Wartungsbuch.
- Offizielle Wartungsquelle pro Aufgabe anklickbar; responsive Popup-Ansicht mit direktem Original-Link.

## Steuerung: genaue Zuordnung zum offiziellen Plugin

v1.6.3 ordnet Steuerungen nicht mehr anhand beliebiger Namen zu, sondern nach **Domain + `translation_key`/Unique-ID** aus dem kompletten Gerätebaum des Druckers.

| Funktion | `ha-bambulab` Entity |
|---|---|
| Pause | `button` / `pause` |
| Fortsetzen | `button` / `resume` |
| Stop | `button` / `stop` |
| Druckgeschwindigkeit | `select` / `printing_speed` |
| Düse Soll | `number` / `target_nozzle_temperature` |
| Bett Soll | `number` / `target_bed_temperature` |
| Kammer Soll | `number` / `target_chamber_temperature` |
| Bauteillüfter | `fan` / `cooling_fan` |
| Aux-Lüfter | `fan` / `aux_fan` |
| Kammerlüfter | `fan` / `chamber_fan` |
| Licht | `light` / `chamber_light` |
| Airduct-Modus | `select` / `airduct_mode` |

Wenn diese Entities im Plugin wegen Firmware-/Hybrid-Beschränkung nicht erzeugt werden, kann das Dashboard sie nicht schalten. Stattdessen erscheint ein Diagnosehinweis mit `hybrid_mode_blocks_control`, `developer_lan_mode` und `mqtt_encryption`.

## Kamera / X2D

Die X2D-Kamera wird von `ha-bambulab` als RTSP-fähige `camera.*`-Entity bereitgestellt. Das Dashboard verwendet den Home-Assistant-Kamera-Proxy und zeigt zusätzlich Entity, HA-Status und Tokenstatus an. Das **schwarze Bild mit rotem Ausrufezeichen** stammt aus der Integration selbst: `ha-bambulab` erzeugt dieses Platzhalterbild, wenn kein nutzbarer RTSP-Endpunkt aufgebaut werden kann. In diesem Fall ist nicht die Dashboard-Darstellung die Ursache. Über „In Home Assistant öffnen“ lässt sich dieselbe Kameraentity direkt prüfen.

## Druckerbilder

Für Modelle mit Bild im Projekt `greghesp/ha-bambulab-cards` wird diese Upstream-Bildquelle verwendet. Die Darstellung erfolgt immer mit proportionaler Maximalgröße statt erzwungener Breite/Höhe.

Für den A2L existiert im aktuellen `ha-bambulab-cards`-Repository weiterhin kein eigenes korrektes A2L-PNG. Das Dashboard verwendet deshalb keinen falschen A1-Ersatz. Als Fallback wird ein A2L-Produktbild aus einer offiziellen Bambu-Lab-Veröffentlichung verwendet.

## Gesamtlaufzeit

Die Gesamtlaufzeit wird ausschließlich aus der Bambu-Entity `total_usage_hours` gelesen. Sie wird **nicht** aus der letzten Druckdauer berechnet. Wenn ein Drucker offline ist und die Entity `unavailable` wird, zeigt das Dashboard den zuletzt tatsächlich von `total_usage_hours` gemeldeten Wert aus dem lokalen Cache mit Kennzeichnung „zuletzt gemeldet“.

## Wartung

Für den X2D basiert der Plan auf dem offiziellen **Bambu Lab X2D 3D Printing User Manual, Kapitel 11**. Dort sind u. a. folgende Intervalle angegeben:

- Build Plate: 1 Woche
- Live-View-Kamera: 1 Monat
- Kammerboden/Innenraum: 1 Monat
- X-/Y-Achsen: 1 Monat
- Z-Achse: 3 Monate
- Luftfilter: 3 Monate
- Toolhead-Kamera / Extruder / Hotend: 1 Monat

Bei hoher Nutzung (>8 h/Tag im Mittel bzw. lange High-Temperature-/Engineering-Filament-Drucke) empfiehlt Bambu eine höhere Wartungsfrequenz.

Offizielles X2D-Handbuch: https://csm.bblcdn.com/hub/7c58718aaa2e40edab56efb87419a96a.pdf

Für A2L werden nur die Wartungsbereiche angezeigt, die im offiziellen Quick Start genannt werden. Wo Bambu dort kein fixes Kalenderintervall angibt, erfindet das Dashboard keines.

Offizieller A2L Quick Start: https://csm.bblcdn.com/hub/4efdb4e04ab34111a8da112e81028430.pdf

Quittierte Wartungen werden mit Zeitstempel im Wartungsbuch gespeichert. Das Wartungsbuch liegt aktuell im Browser-`localStorage` und ist damit browser-/gerätebezogen.

### Wartungsbuch ab v1.7.0

Das Wartungsbuch zeigt 15 Einträge pro Seite. Es kann nach Wartungsart gefiltert werden; zusätzlich lässt sich die Ansicht auf die letzten 30 Tage begrenzen. Eine kleine Auswertung zeigt Gesamtzahl, Wartungen der letzten 30 Tage und die am häufigsten quittierte Aufgabe. Einzelne Einträge sowie das komplette Logbuch können nach Sicherheitsabfrage gelöscht werden. Das Löschen des Logbuchs ändert bewusst nicht die separat gespeicherten letzten Wartungszeitpunkte und damit auch nicht die nächsten Fälligkeiten.

Nach dem Quittieren einer Wartung erscheint eine sichtbare Bestätigung. Die Wartungs- und Quellenbuttons besitzen Hover-, Active- und Tastatur-Fokuszustände, damit auf Desktop klar erkennbar ist, dass die Aktion ausgelöst werden kann.

## Sprache / Language

Die Dashboard-Oberfläche übernimmt automatisch die Sprache von Home Assistant. Deutsch wird als Deutsch dargestellt; Englisch sowie derzeit nicht separat übersetzte Home-Assistant-Sprachen verwenden Englisch als Fallback. Dazu gehören Navigation, Wartungsbereich, Logbuch, Hinweise und wesentliche Bedienelemente. Datumsangaben wechseln ebenfalls zwischen deutschem und englischem Format. Die Entity-Namen und bestimmte Zustände der Bambu-Integration selbst bleiben davon getrennt und richten sich nach Home Assistant bzw. der Integration.

## Smart-Steckdose / Energie

Pro Drucker können im Karteneditor zugeordnet werden:

- Smart-Steckdose: `switch.*`
- Leistung: beliebige `sensor.*`-Entity
- Energie: beliebige `sensor.*`-Entity

Beim Ausschalten der Steckdose während eines aktiven Drucks verlangt das Dashboard eine zusätzliche Bestätigung.

## Validierung

```bash
npm run validate
```

Die Tests prüfen Syntax, Discovery, Entity-Zuordnung, Steuerungs-Rendering, Hybrid-Warnung, aktives Filament und Custom-Element-Registrierung. Ein echter End-to-End-Schaltversuch am physischen Drucker kann nur in der jeweiligen Home-Assistant-Installation erfolgen.

## Lizenz

MIT. Bambu Lab ist eine Marke des jeweiligen Rechteinhabers. Dieses Community-Projekt ist nicht offiziell mit Bambu Lab verbunden.

### Mobile Bedienung

Ab v1.6.1 werden laufende Home-Assistant-Statusupdates während eines aktiven Touch-/Scroll-Vorgangs kurz zurückgestellt, damit die Ansicht auf iPhone/Android nicht springt. Die AMS-Slot-Details öffnen auf Mobilgeräten als vollflächiges responsives Fenster und nicht mehr inline unter der AMS-Liste.
