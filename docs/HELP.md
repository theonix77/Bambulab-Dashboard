# Hilfe und Fehlerbehebung

## Karte erscheint nicht

Unter **Einstellungen → Dashboards → Ressourcen** prüfen, ob `Bambulab-Dashboard.js` als JavaScript-Modul registriert ist. Danach HACS → Bambu Lab Dashboard → **Neu herunterladen** und **Strg + F5**.

## Karte bleibt schmal

Die Karte kann ihre Home-Assistant-Section nicht selbst verbreitern. Entweder die Section auf 2–3 Sections Breite stellen oder eine Panel-View verwenden.

## Druckerbutton reagiert nicht

Ab v1.2.0 verwenden Druckerkarten und Druckerumschalter dieselbe direkte Navigation zur Detailansicht. Wenn nach einem Update noch das alte Verhalten sichtbar ist, HACS neu herunterladen und den Browser-Cache hart aktualisieren.

## Falscher Fortschritt / falscher Auftrag

Im Karteneditor beim betroffenen Drucker **Erweiterte Entity-Zuordnung** öffnen und bei Bedarf `Status`, `Fortschritt` oder `Druckauftrag` auf die korrekte Home-Assistant-Entity legen.

## A2L-Bild fehlt

Es wird bewusst kein falsches A1-Bild mehr eingesetzt. Hinterlege im Karteneditor ein eigenes Bild, z. B. `/local/bambu/a2l.png`.

## Smart-Steckdose fehlt

Ab v1.2.0 werden alle `sensor.*`-Entities akzeptiert. Trage den Leistungssensor und Energiesensor direkt per Entity-ID ein, z. B. `sensor.steckdose_power` und `sensor.steckdose_energy`.

## AMS fehlt oder ist falsch zugeordnet

Im Karteneditor unter dem Drucker die AMS-Zuordnung prüfen. Ohne Haken wird automatisch über die Gerätehierarchie zugeordnet. Mit Haken wird die manuelle Zuordnung erzwungen.
