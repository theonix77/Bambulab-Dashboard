# Hilfe und Fehlerbehebung

## Übersicht zeigt einen falschen Drucker

Ab v1.1.0 berücksichtigt die Discovery nur Entity-Registry-Einträge mit Plattform `bambu_lab`. Ein HACS-Update-Gerät darf deshalb nicht mehr als Drucker auftauchen.

Wenn trotzdem ein falsches Gerät erscheint, bitte die Geräteansicht unter **Einstellungen → Geräte & Dienste → Bambu Lab** und die betroffenen Entity-Namen dokumentieren.

## Drucker druckt, aber Fortschritt/Auftrag ist leer

Das Dashboard liest diese Werte direkt aus der Bambu-Lab-Integration. Prüfe am Druckergerät in Home Assistant insbesondere:

- Print progress
- Print status
- Remaining time
- Subtask/Task name
- Current layer / Total layers

Sind sie dort korrekt, aber im Dashboard falsch, ist das ein Mapping-Fehler im Dashboard.

## AMS fehlt

Standard ist automatische Zuordnung über die Gerätehierarchie. Falls diese nicht zur tatsächlichen Installation passt:

1. Dashboard-Karte bearbeiten.
2. Beim gewünschten Drucker **AMS-Zuordnung** öffnen.
3. Das richtige AMS bzw. mehrere AMS-Einheiten anhaken.
4. Speichern.

Keine Häkchen bedeutet: automatische Zuordnung.

## Reihenfolge ändern

Im visuellen Editor bei jedem Drucker eine Zahl bei **Reihenfolge** eintragen. Kleinere Zahlen erscheinen zuerst.

## Drucker umbenennen

Der Anzeigename im Dashboard kann im visuellen Editor geändert werden. Der eigentliche Home-Assistant-Gerätename bleibt unverändert.

## Energie fehlt

Leistungs- und Energiesensoren müssen pro Drucker im Karteneditor ausgewählt werden. Das Dashboard errät keine Zuordnung zu Smart Plugs.

## Kamera fehlt

Prüfe zuerst, ob die Bambu-Integration für diesen Drucker eine `camera.*`-Entity bereitstellt. Ohne Kamera-Entity kann das Dashboard keinen Stream anzeigen.

## Karte lädt nicht

Prüfe unter **Einstellungen → Dashboards → Ressourcen**:

```text
/hacsfiles/Bambulab-Dashboard/Bambulab-Dashboard.js
```

Typ muss **JavaScript-Modul** sein. Danach HACS **Neu herunterladen** und Browser mit **Strg + F5** neu laden.
