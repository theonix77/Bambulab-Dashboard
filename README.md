# Bambu Lab Dashboard for Home Assistant

Ein eigenständiges Mehrdrucker-Control-Center für Home Assistant. Die Karte nutzt die Daten und Steuer-Entitäten der Home-Assistant-Integration [greghesp/ha-bambulab](https://github.com/greghesp/ha-bambulab). Die zusätzlichen Bambu-Lovelace-Karten sind **keine Pflicht**.

## Voraussetzungen

- Home Assistant
- HACS
- [greghesp/ha-bambulab](https://github.com/greghesp/ha-bambulab)
- mindestens ein dort eingerichteter Bambu-Lab-Drucker

Das Dashboard stellt **keine eigene Verbindung zu Bambu Cloud/LAN oder MQTT her**. Verbindung, Sensoren, Kamera, AMS und Steuerbefehle kommen aus `greghesp/ha-bambulab`.

## Installation über HACS

1. HACS öffnen → **Dashboard**.
2. Oben rechts **⋮ → Benutzerdefinierte Repositories**.
3. Repository eintragen: [theonix77/Bambulab-Dashboard](https://github.com/theonix77/Bambulab-Dashboard)
4. Typ **Dashboard** wählen.
5. **Bambu Lab Dashboard** installieren.
6. Browser mit **Strg+F5** neu laden.

HACS registriert normalerweise automatisch:

```text
/hacsfiles/Bambulab-Dashboard/Bambulab-Dashboard.js
```

Typ: **JavaScript-Modul**.

Danach im Dashboard **Karte hinzufügen → Bambu Lab Dashboard** wählen oder manuell:

```yaml
type: custom:bambu-lab-dashboard
```

## Was v1.3.0 kann

- mehrere Drucker automatisch erkennen und gleichzeitig in einer Übersicht anzeigen
- Reihenfolge und Anzeigename pro Drucker ändern
- responsive Desktop-, Tablet- und Mobilansicht
- Dark, Light oder automatische Anpassung an das Home-Assistant-Theme
- Status, Fortschritt, Restzeit, Layer, Temperaturen, WLAN und Druckinformationen anzeigen
- aktuelles Druckbild/Cover in der Detailansicht groß darstellen, wenn die Bambu-Integration es bereitstellt
- Kamera anzeigen
- AMS dem jeweiligen Drucker automatisch oder manuell zuordnen
- AMS-Slots anklickbar machen und Slot-/Spulendetails anzeigen
- Pause, Fortsetzen, Stop, Licht und weitere von der Integration vorhandene Buttons nutzen
- Solltemperaturen über vorhandene `number`-Entitäten ändern
- Lüfter über vorhandene `fan`-Entitäten steuern
- Druckgeschwindigkeit und weitere vorhandene `select`-Entitäten bedienen
- externe Leistungs- und Energiesensoren frei aus allen `sensor.*`-Entitäten auswählen
- Strompreis/Kosten anzeigen
- Gesamtlaufzeit aus `total_usage_hours` unter Beachtung der von Home Assistant gelieferten Zeiteinheit darstellen
- optionale Wartungsintervalle pro Drucker anzeigen

## Druckerbilder

Die Karte verwendet für Modellbilder **dieselbe Upstream-Bildquelle wie die Bambu-Karten** aus [greghesp/ha-bambulab-cards](https://github.com/greghesp/ha-bambulab-cards). Bilder werden mit `object-fit: contain` dargestellt und dadurch nicht gestaucht.

Wichtig zum **A2L**: Das Upstream-Kartenprojekt führt den A2L als Modell, stellt derzeit aber kein eigenständiges korrektes `A2L.png` bereit. Das Dashboard ersetzt den A2L deshalb **nicht** durch ein falsches A1-Bild. Solange upstream kein korrektes A2L-Modellbild bereitstellt, erscheint der neutrale Drucker-Fallback.

## Steuerung

Das Dashboard steuert nur Entitäten, die `greghesp/ha-bambulab` tatsächlich in deiner Home-Assistant-Instanz bereitstellt. Die Integration erzeugt unter anderem je nach Drucker/Firmware:

- `button`: Pause, Resume, Stop, Refresh und teilweise Buzzer
- `select`: Druckgeschwindigkeit, teilweise Airduct-Modus
- `number`: Zieltemperatur Düse, Bett und bei unterstützten Geräten Kammer
- `fan`: Bauteil-, Aux-, Kammer- und weitere Lüfter
- `light`: Kammerlicht

Bei Firmware mit MQTT-Signatur oder blockiertem Hybrid-Modus kann die Bambu-Integration Schreibzugriffe absichtlich nicht anbieten. Das Dashboard umgeht diese Sperren nicht.

## AMS und Spulendetails

AMS-Geräte werden zuerst über Home Assistants Gerätehierarchie (`via_device_id`) dem Drucker zugeordnet. Falls das bei deiner Installation nicht eindeutig ist, lässt sich die AMS-Zuordnung im Karteneditor manuell setzen.

Die Slots werden anhand der Bambu-`tray`-Entitäten und deren `slot`-Attribut erkannt. Ein Klick auf einen Slot öffnet eine Detailansicht mit den von Home Assistant gelieferten Attributen und zusätzlich einen Link zur normalen Home-Assistant-Mehr-Info-Ansicht der Tray-Entity.

## Energie / Smart-Steckdose

Im Karteneditor werden **alle `sensor.*`-Entitäten** über den Home-Assistant-Entity-Picker angeboten. Damit kann auch eine Smart-Steckdose verwendet werden, deren Sensor nicht sauber als `device_class: power` oder `energy` klassifiziert ist.

Pro Drucker können zugeordnet werden:

- Leistungssensor, typischerweise W/kW
- Energiesensor, typischerweise Wh/kWh

Das Dashboard erfindet keine Verbrauchswerte.

## Design

Im visuellen Editor gibt es:

- **Automatisch** – folgt dem Home-Assistant-Theme
- **Dunkel**
- **Hell**

Die Karte nutzt die von Home Assistant zugewiesene Section-Breite vollständig. Die Section selbst wird weiterhin von Home Assistant konfiguriert.

## Mobil / Responsive

Die Druckerbilder behalten ihre Proportionen. Auf kleinen Breiten werden Kennzahlen und Navigation angepasst, ohne das Bild zu verzerren. v1.3.0 bewahrt außerdem die Scrollposition bei Live-Updates, damit Fortschrittsänderungen nicht mehr bei jedem Home-Assistant-State-Update nach oben springen sollen.

## Updates

Nach einem Commit/Push in dein Repository:

1. HACS → **Bambu Lab Dashboard**
2. **⋮ → Neu herunterladen**
3. anschließend **Strg+F5**

## Fehlerbehebung

Siehe [docs/HELP.md](docs/HELP.md) und [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Technische Validierung

```bash
npm run validate
```

Die mitgelieferten Tests prüfen Syntax, Custom-Element-Registrierung, Discovery und wichtige statische Features. Ein echter Ende-zu-Ende-Test mit allen Bambu-Firmwareständen ist nur in einer realen Home-Assistant-Installation möglich.

## Lizenz

MIT. Bambu Lab ist eine Marke des jeweiligen Rechteinhabers. Dieses Community-Projekt ist nicht offiziell mit Bambu Lab verbunden.
