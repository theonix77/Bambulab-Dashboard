# Hilfe / Fehlerbehebung

## Karte fehlt im Karten-Picker

HACS neu herunterladen, anschließend `Strg+F5`. Unter **Einstellungen → Dashboards → Ressourcen** muss `/hacsfiles/Bambulab-Dashboard/Bambulab-Dashboard.js` als JavaScript-Modul vorhanden sein.

## Smart-Steckdose fehlt

Das Dashboard verwendet den Home-Assistant-Entity-Picker und erlaubt alle `sensor.*`-Entities. Suche nach dem Friendly Name oder der Entity-ID des Leistungs-/Energiesensors der Steckdose. Die Steckdose selbst als `switch.*` ist kein Leistungssensor; benötigt wird der zugehörige `sensor.*`-Messwert.

## Nur Licht steuerbar

Prüfe beim Drucker unter **Einstellungen → Geräte & Dienste → Bambu Lab → Entitäten**, ob `button.pause`, `button.resume`, `button.stop`, `number.*`, `fan.*` bzw. `select.*` für diesen Drucker tatsächlich existieren. Bei MQTT-Signatur/gesperrtem Hybrid-Modus erzeugt die Integration bestimmte Schreib-Entitäten absichtlich nicht.

## A2L ohne Modellbild

Das Upstream-Projekt `greghesp/ha-bambulab-cards` besitzt derzeit kein eigenständiges korrektes A2L-Modellbild. Das Dashboard zeigt deshalb bewusst keinen falschen A1-Drucker.

## AMS-Slot öffnet keine Details

Prüfe, ob das AMS `tray`-Entities besitzt. Das Dashboard erkennt sowohl ältere Unique-IDs wie `..._tray_1` als auch neuere `translation_key: tray` plus `slot`-Attribut.

## Seite springt beim Drucken nach oben

Das Dashboard speichert und restauriert Scrollpositionen um Live-Renderings herum. Falls eine spezielle Custom-View trotzdem springt, bitte Browser, HA-Version und View-Typ im Issue angeben.
