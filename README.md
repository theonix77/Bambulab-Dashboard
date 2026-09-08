# Bambu Lab Dashboard for Home Assistant

![Bambu Lab Dashboard](docs/images/hero.svg)

Ein eigenständiges, responsives Lovelace-Dashboard für Bambu-Lab-3D-Drucker in Home Assistant. Es erkennt unterstützte Drucker und AMS-Geräte automatisch über die Geräte- und Entitätsregistrierung von Home Assistant und benötigt für die Drucker selbst keine hart codierten Entity-IDs.

> **Wichtig:** Dieses Projekt erzeugt keine Messwerte, keine Sensoren und keine Dummy-Daten. Es visualisiert ausschließlich Entitäten, die in Home Assistant tatsächlich vorhanden sind. Nicht unterstützte Funktionen werden ausgeblendet oder als nicht verfügbar angezeigt.

## Funktionen

- automatische Erkennung mehrerer Bambu-Lab-Drucker
- automatische Zuordnung untergeordneter AMS-Geräte über die Home-Assistant-Gerätehierarchie
- Druckfortschritt, Status, Druckauftrag, Restzeit und Layer
- Düsen-, Bett- und Kammertemperaturen inklusive Sollwerten, sofern vorhanden
- Lüfterwerte, WLAN, Druckbett, Druckgewicht, Drucklänge und Gesamtlaufzeit, sofern vorhanden
- Live-Kamera über die vorhandene Kamera-Entität
- AMS-Übersicht mit bis zu vier Slots je erkanntem AMS und den realen Filamentinformationen aus Home Assistant
- Pause, Fortsetzen, Stop, Licht und Geschwindigkeitsprofil, sofern die Integration diese Steuerentitäten bereitstellt
- mehrere Drucker über Tabs
- optionale Zuordnung externer Leistungs- und Energiesensoren, z. B. einer smarten Steckdose
- optionale Energiekostenberechnung mit eigenem Strompreis
- optionale Wartungsintervalle ohne erfundene Herstellerwerte
- vollständig responsives Layout für Desktop, Tablet und Smartphone
- HACS-kompatible Dashboard-/Frontend-Struktur

## Voraussetzung

Das Dashboard setzt die Home-Assistant-Integration **Bambu Lab** von `greghesp/ha-bambulab` voraus:

https://github.com/greghesp/ha-bambulab

Die Drucker müssen dort bereits funktionieren. Dieses Repository ersetzt die Integration nicht, sondern stellt ihre vorhandenen Entitäten als eigenständiges Dashboard dar.

## Installation über HACS als benutzerdefiniertes Repository

1. HACS in Home Assistant öffnen.
2. Zu **Dashboard** wechseln.
3. Oben rechts das Drei-Punkte-Menü öffnen.
4. **Benutzerdefinierte Repositories** wählen.
5. Repository-URL eintragen:

   `https://github.com/theonix77/Bambulab-Dashboard`

6. Kategorie **Dashboard** auswählen.
7. Repository installieren.
8. Home Assistant beziehungsweise den Browser-Frontend-Cache aktualisieren, wenn HACS dazu auffordert.

Solange das Repository noch nicht im offiziellen HACS-Standardverzeichnis enthalten ist, erfolgt die Installation als benutzerdefiniertes Repository.

## Karte hinzufügen

Die Minimal-Konfiguration lautet:

```yaml
type: custom:bambu-lab-dashboard
```

Das reicht für die automatische Drucker- und AMS-Erkennung aus.

## Was wird automatisch erkannt?

Das Dashboard liest zur Laufzeit die Home-Assistant-Geräte- und Entitätsregistrierung. Relevant sind Geräte und Entitäten der Plattform `bambu_lab`. Drucker werden anhand ihrer Gerätezuordnung und typischen, stabilen Unique-ID-Suffixe der Bambu-Lab-Integration erkannt. Untergeordnete Geräte werden über `via_device_id` dem jeweiligen Drucker zugeordnet.

Dadurch muss bei einem neu hinzugefügten Drucker normalerweise keine Dashboard-YAML geändert werden. Nach dem Neuladen der Karte erscheint er automatisch als weiterer Drucker-Tab.

## Externe Strommessung

Ein Bambu-Drucker und eine smarte Steckdose sind in Home Assistant getrennte Geräte. Eine automatische Zuordnung wäre deshalb nicht zuverlässig. Aus diesem Grund wird Strommessung bewusst **nicht geraten**.

Im visuellen Karteneditor können pro Drucker optional zugeordnet werden:

- ein Sensor mit `device_class: power`
- ein Sensor mit `device_class: energy`
- optional ein globaler Preis in €/kWh

Fehlt die Zuordnung, zeigt das Dashboard keine erfundenen Leistungs- oder Energiewerte. Die kleine Leistungskurve entsteht ausschließlich aus echten Live-Werten während der geöffneten Dashboard-Sitzung.

## Wartung

Die Gesamtlaufzeit des Druckers wird angezeigt, sofern die Integration einen entsprechenden Sensor liefert. Eigene Wartungsintervalle können zusätzlich in YAML hinterlegt werden. Es gibt absichtlich keine eingebauten Fantasieintervalle.

Beispiel für ein selbst definiertes Intervall:

```yaml
type: custom:bambu-lab-dashboard
printers:
  - device_id: "DEINE_HOME_ASSISTANT_DEVICE_ID"
    maintenance:
      - name: "Eigene Wartungsaufgabe"
        interval_hours: 250
        last_service_hours: 0
```

Die `device_id` wird nur für solche optionalen, benutzerspezifischen Zuordnungen benötigt. Die Druckererkennung selbst bleibt automatisch.

## Firmware- und Steuerungsbeschränkungen

Welche Steuerbefehle verfügbar sind, bestimmt die Bambu-Lab-Integration zusammen mit Druckermodell, Firmware und Verbindungsmodus. Neuere Bambu-Firmware kann Schreib-/Steuerfunktionen je nach Betriebsart einschränken. Das Dashboard zeigt deshalb nur tatsächlich vorhandene Steuerentitäten an.

## Datenschutz und Sicherheit

- keine Cloud-Dienste dieses Dashboards
- keine Telemetrie
- keine externen Tracking-Skripte
- keine gespeicherten Bambu-Zugangsdaten
- Kamera- und Bildzugriffe laufen über die vorhandenen Home-Assistant-Proxy-Endpunkte und die aktive Home-Assistant-Sitzung

## Dokumentation

- [Installation](docs/INSTALLATION.md)
- [Hilfe und Fehlerbehebung](docs/HELP.md)
- [Technische Architektur](docs/ARCHITECTURE.md)
- [Minimales YAML-Beispiel](examples/dashboard-card.yaml)

## Entwicklung prüfen

Es gibt keine Laufzeitabhängigkeiten. Für einen Syntaxcheck reicht Node.js 20 oder neuer:

```bash
npm run check
```

## Lizenz und Markenhinweis

MIT License. Siehe [LICENSE](LICENSE).

Dieses Projekt ist ein unabhängiges Community-Projekt und steht in keiner offiziellen Verbindung zu Bambu Lab. „Bambu Lab“ und zugehörige Produktnamen/Marken gehören ihren jeweiligen Rechteinhabern. Das Repository enthält bewusst keine kopierten Produkt-Renderings.
