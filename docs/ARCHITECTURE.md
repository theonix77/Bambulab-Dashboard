# Architektur

```text
Bambu Drucker / AMS
        │
        ▼
greghesp/ha-bambulab
        │
        ├─ Geräte-/Entitätsregistrierung
        ├─ MQTT/Cloud/LAN
        ├─ Sensoren / Kamera / AMS
        └─ Buttons / Select / Number / Fan / Light
        │
        ▼
Bambu Lab Dashboard
        │
        ├─ automatische Druckererkennung
        ├─ Mehrdrucker-Übersicht
        ├─ Detailansicht
        ├─ AMS-Slots + More-Info
        ├─ Steuerung vorhandener HA-Entitäten
        └─ optionale externe Energie-Sensoren
```

Das Dashboard enthält keine Bambu-Zugangsdaten und implementiert keinen eigenen Bambu/MQTT-Client.
