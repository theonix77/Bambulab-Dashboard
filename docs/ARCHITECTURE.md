# Architektur

## Datenquelle

Das Dashboard besitzt keine eigene Bambu-Cloud-, MQTT- oder LAN-Verbindung. Sämtliche Daten kommen aus Home Assistant und werden von `greghesp/ha-bambulab` bereitgestellt.

## Discovery

Beim Laden werden über die Home-Assistant-WebSocket-API folgende Registrierungen gelesen:

- `config/device_registry/list`
- `config/entity_registry/list`

Für die Bambu-Discovery werden ausschließlich Entity-Registry-Einträge mit `platform === "bambu_lab"` verwendet.

Ein Root-Gerät gilt als Drucker, wenn es typische Druckerentitäten aus den Bereichen Temperatur und Druckstatus/-fortschritt besitzt. Entity-Zuordnungen berücksichtigen `unique_id` und `translation_key`.

## AMS

Automatisch werden untergeordnete Geräte über `via_device_id` gesammelt. Entitäten mit AMS-/Tray-Merkmalen werden zu AMS-Einheiten gruppiert.

Optional kann pro Drucker `ams_device_ids` konfiguriert werden. Diese manuelle Auswahl ersetzt für diesen Drucker die automatische AMS-Zuordnung.

## Konfiguration

Die Card-Konfiguration kann pro Drucker enthalten:

```yaml
printers:
  - device_id: abc123
    name: X2D Werkstatt
    order: 1
    visible: true
    power_entity: sensor.x2d_power
    energy_entity: sensor.x2d_energy
    ams_device_ids:
      - ams_device_1
    show_ams: true
    show_camera: true
    show_energy: true
    show_maintenance: true
```

Diese IDs werden normalerweise über den visuellen Editor gesetzt; manuelles YAML ist nicht erforderlich.
