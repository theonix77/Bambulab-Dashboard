# Installation

## 1. Voraussetzungen

Vor der Installation des Dashboards muss die Bambu-Lab-Integration für Home Assistant eingerichtet sein und der Drucker dort bereits Entitäten liefern.

Empfohlene Integration:

`greghesp/ha-bambulab`

Repository: https://github.com/greghesp/ha-bambulab

## 2. Installation mit HACS

Solange das Projekt nicht im offiziellen HACS-Verzeichnis gelistet ist:

1. HACS öffnen.
2. **Dashboard** öffnen.
3. Drei-Punkte-Menü → **Benutzerdefinierte Repositories**.
4. `https://github.com/theonix77/Bambulab-Dashboard` eintragen.
5. Typ **Dashboard** wählen.
6. Installieren.

HACS lädt `Bambulab-Dashboard.js` sowie die zugehörigen JavaScript-Module aus dem Repository.

## 3. Dashboard-Karte anlegen

In einer Lovelace-Ansicht eine manuelle Karte hinzufügen:

```yaml
type: custom:bambu-lab-dashboard
```

Weitere Drucker-IDs sind nicht erforderlich.

## 4. Externe Energie-Sensoren optional zuordnen

Öffne den visuellen Editor der Karte. Dort werden erkannte Bambu-Drucker sowie in Home Assistant vorhandene Sensoren mit `device_class: power` und `device_class: energy` angezeigt.

Die Zuordnung ist optional. Wenn sie fehlt, wird der Energie-Bereich ohne Messwerte angezeigt und weist darauf hin, dass kein Sensor zugeordnet ist.

## 5. Strompreis optional hinterlegen

Im Karteneditor kann ein Preis in Euro pro kWh eingetragen werden. Kosten werden nur berechnet, wenn gleichzeitig ein echter Energie-Sensor vorhanden ist.

## 6. Aktualisierung

Updates erfolgen über HACS. Nach einem Frontend-Update kann ein vollständiges Neuladen des Browser-Caches nötig sein.

Auf iOS/Safari hilft bei hartnäckigem Cache gegebenenfalls ein erneutes Laden der Home-Assistant-App beziehungsweise der WebView.


### Technischer Check

Unter **Einstellungen → Dashboards → Ressourcen** muss eine Ressource ähnlich `/hacsfiles/Bambulab-Dashboard/Bambulab-Dashboard.js` als JavaScript-Modul stehen. Die Datei ist ab v1.0.1 vollständig standalone; zusätzliche JS-Ressourcen sind nicht erforderlich.
