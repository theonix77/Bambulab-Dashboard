# Architektur

Das Projekt besteht zur Laufzeit aus einer einzigen HACS-Ressource: `Bambulab-Dashboard.js`.

Die Karte liest Home Assistants Device Registry und Entity Registry per WebSocket und verwendet nur Bambu-Entities der Plattform `bambu_lab` für die automatische Druckererkennung.

## Datenfluss

```text
Bambu Drucker -> greghesp/ha-bambulab -> Home Assistant Entities -> Bambu Lab Dashboard
```

## Mehrdrucker

Jeder erkannte Drucker wird als Root-Gerät behandelt. Untergeordnete Geräte werden über `via_device_id` rekursiv zugeordnet. AMS kann automatisch aus dieser Hierarchie oder manuell über die Kartenkonfiguration zugewiesen werden.

## Overrides

Die automatische Entity-Erkennung kann pro Drucker durch konkrete Entity-IDs überschrieben werden. Dadurch bleibt die Karte auch bei ungewöhnlichen Registry-Strukturen oder Modellunterschieden nutzbar.

## Breite

Die Karte hat kein internes `max-width`. Die tatsächliche Obergrenze wird vom Home-Assistant-View bzw. der Section bestimmt.
