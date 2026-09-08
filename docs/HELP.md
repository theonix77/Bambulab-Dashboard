# Hilfe und Fehlerbehebung

## Kein Drucker wird angezeigt

Prüfe zuerst, ob der Drucker in Home Assistant über die Bambu-Lab-Integration vorhanden ist und seine normalen Sensoren sichtbar sind. Das Dashboard erzeugt selbst keine Druckerentitäten.

Danach:

1. Home Assistant neu laden beziehungsweise die Seite vollständig aktualisieren.
2. Prüfen, ob die Integration tatsächlich die Plattform `bambu_lab` verwendet.
3. Browser-Konsole auf Meldungen mit `Bambu Lab Dashboard` prüfen.

## Ein bestimmter Wert fehlt

Das Dashboard rendert nur Funktionen, für die eine passende Entität vorhanden ist. Unterschiede zwischen Druckermodellen und Firmware sind daher normal.

Beispiele:

- keine Kammertemperatur bei Modellen ohne entsprechenden Sensor
- keine zweite Düse bei Ein-Düsen-Modellen
- keine Türanzeige ohne Türsensor
- keine Steuerbuttons, wenn die Integration sie im aktuellen Verbindungsmodus nicht bereitstellt

## Kamera bleibt leer

Prüfe:

- Kamera in der Bambu-Lab-Integration aktiviert
- Kamera-Entität in Home Assistant verfügbar
- Kamera funktioniert direkt in Home Assistant
- Browser hat keine alte Frontend-Version im Cache

Das Dashboard verwendet den Home-Assistant-Kamera-Proxy und speichert keine Kamera-Zugangsdaten.

## AMS fehlt

AMS-Geräte werden über die Home-Assistant-Gerätehierarchie dem Drucker zugeordnet. Prüfe in Home Assistant unter **Geräte & Dienste**, ob das AMS als untergeordnetes Gerät des Druckers vorhanden ist und Tray-Entitäten liefert.

## Stromverbrauch fehlt

Das ist beabsichtigt, solange keine externe Strommessung zugeordnet wurde. Eine smarte Steckdose kann nicht zuverlässig automatisch einem bestimmten Drucker zugeordnet werden.

Öffne den visuellen Karteneditor und ordne den passenden Leistungs-/Energiesensor manuell zu.

## Steuerung reagiert nicht

Die Karte ruft nur vorhandene Home-Assistant-Services der bereitgestellten Entitäten auf. Wenn Bambu-Firmware oder Verbindungsmodus Steuerbefehle sperren, kann die Karte diese Einschränkung nicht umgehen.

## Nach Update sehe ich noch die alte Version

1. HACS-Update vollständig installieren.
2. Home Assistant Frontend neu laden.
3. Browser/App komplett neu starten.
4. Falls nötig Browser-Cache leeren.

In der Browser-Konsole wird beim Laden die Dashboard-Version ausgegeben.
