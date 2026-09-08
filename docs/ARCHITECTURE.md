# Technische Architektur

## Ziel

Die Karte soll ohne hart codierte Entity-IDs auf unterschiedlichen Home-Assistant-Installationen funktionieren. Namen wie `sensor.mein_x1c_bed_temperature` sind nicht stabil genug, weil Benutzer Entitäten umbenennen können und Home Assistant lokalisierte Namen erzeugt.

## Geräte- und Entitätsregistrierung

Die Karte ruft über die bestehende Home-Assistant-WebSocket-Verbindung auf:

- `config/device_registry/list`
- `config/entity_registry/list`

Anschließend werden Bambu-Lab-Entitäten anhand ihrer Plattform und stabiler Unique-ID-Muster gruppiert.

## Druckererkennung

Ein Root-Gerät wird als Drucker gewertet, wenn es Bambu-Lab-Bezug besitzt und mehrere typische Druckerentitäten wie Düsen-/Betttemperatur, Druckfortschritt, Status oder Restzeit besitzt.

Das reduziert das Risiko, ein AMS oder ein anderes untergeordnetes Gerät als Drucker-Tab zu behandeln.

## AMS-Zuordnung

Untergeordnete Geräte werden rekursiv über `via_device_id` dem Drucker zugeordnet. Tray-Entitäten werden über ihre Unique-ID-Suffixe erkannt. Dadurch unterstützt die Karte auch mehrere AMS-Einheiten, sofern Home Assistant sie als untergeordnete Geräte bereitstellt.

## Feature Detection

Jedes Modul ist fähigkeitsbasiert:

- existiert eine Kamera-Entität → Kamera anzeigen
- existiert Kammertemperatur → Kammerwert anzeigen
- existieren linke/rechte Düsenwerte → Dual-Nozzle-Werte anzeigen
- existiert Pause/Resume/Stop → entsprechende Buttons anzeigen
- existiert ein Speed-Select → Geschwindigkeitsauswahl anzeigen

Nicht vorhandene Funktionen werden nicht durch Platzhalter-Sensoren ersetzt.

## Externe Energie-Messung

Externe Strommessgeräte gehören nicht zur Bambu-Lab-Gerätehierarchie. Deshalb kann die Karte keine sichere automatische Zuordnung vornehmen. Pro Drucker können im Karteneditor explizit `power_entity` und `energy_entity` hinterlegt werden.

Die Live-Leistungskurve speichert nur kurzfristige echte Werte im Browser-Speicher der Karteninstanz. Sie simuliert keine Historie und schreibt nichts in Home Assistant zurück.

## Steuerung

Die Karte sendet keine freien G-Code-Kommandos. Verwendet werden ausschließlich vorhandene Home-Assistant-Entitäten und Services:

- `button.press`
- `light.toggle`
- `switch.toggle`
- `select.select_option`

Damit übernimmt die Bambu-Lab-Integration weiterhin die eigentliche Gerätekommunikation und deren Sicherheits-/Firmwarebeschränkungen.

## Kamera und Cover

Bilder werden über Home Assistant geladen:

- `/api/camera_proxy/<entity_id>`
- `/api/image_proxy/<entity_id>`

Der Zugriff nutzt die laufende Home-Assistant-Sitzung. Das Dashboard enthält keine Bambu-Zugangsdaten.


## Standalone-Build

Die HACS-Ressource enthält sämtliche Runtime-Logik und Styles in `Bambulab-Dashboard.js`. Es gibt zur Laufzeit keine relativen Modulimporte. Modellgrafiken werden anhand von `device.model` auf die vorhandenen Upstream-Bilder des Bambu-Lab-Cards-Projekts abgebildet.
