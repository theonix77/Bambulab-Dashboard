# Installation und Einrichtung

## 1. Was ist Pflicht?

Das **Bambu Lab Dashboard** stellt nur die Oberfläche bereit. Für die eigentliche Kommunikation mit Drucker, Cloud/LAN, Kamera und AMS wird zwingend die Home-Assistant-Integration **`greghesp/ha-bambulab`** benötigt.

Zusätzliche Bambu-Lovelace-Karten sind nicht erforderlich.

## 2. Bambu-Lab-Integration prüfen

Vor der Dashboard-Installation:

1. `greghesp/ha-bambulab` installieren.
2. Jeden gewünschten Bambu-Drucker dort hinzufügen.
3. **Einstellungen → Geräte & Dienste → Bambu Lab** öffnen.
4. Prüfen, ob pro Drucker Sensoren wie Druckstatus, Fortschritt und Temperaturen vorhanden sind.
5. Falls vorhanden, AMS und Kamera ebenfalls dort prüfen.

Wenn die Integration einen Wert nicht liefert, kann das Dashboard ihn nicht selbst erzeugen.

## 3. Dashboard über HACS installieren

1. **HACS → Dashboard** öffnen.
2. **⋮ → Benutzerdefinierte Repositories**.
3. Repository eintragen: `https://github.com/theonix77/Bambulab-Dashboard`
4. Kategorie **Dashboard** wählen.
5. Repository hinzufügen.
6. **Bambu Lab Dashboard** installieren.
7. Browser mit **Strg + F5** neu laden.

Unter **Einstellungen → Dashboards → Ressourcen** sollte anschließend folgende JavaScript-Ressource existieren:

```text
/hacsfiles/Bambulab-Dashboard/Bambulab-Dashboard.js
```

## 4. Karte hinzufügen

Im Home-Assistant-Dashboard:

**Bearbeiten → Karte hinzufügen → Bambu Lab Dashboard**

Alternativ als manuelle Karte:

```yaml
type: custom:bambu-lab-dashboard
```

Die Drucker werden automatisch aus Home Assistant gelesen.

## 5. Reihenfolge und Namen festlegen

Karte bearbeiten und den visuellen Editor öffnen.

Bei jedem erkannten Drucker kannst du einstellen:

- Anzeigename
- Reihenfolge
- sichtbar / ausgeblendet
- Leistungs- und Energiesensor
- sichtbare Detailbereiche
- AMS-Zuordnung

Beispiel für die Reihenfolge:

```text
1  X2D
2  A2L
3  P1S
```

Die Übersicht verwendet genau diese Reihenfolge.

## 6. AMS automatisch oder manuell zuordnen

Standardmäßig folgt das Dashboard der Home-Assistant-Gerätehierarchie und ordnet untergeordnete AMS-Geräte automatisch dem Drucker zu.

Falls das nicht korrekt ist:

1. Karte bearbeiten.
2. Gewünschten Drucker suchen.
3. Unter **AMS-Zuordnung** das passende AMS bzw. die passenden AMS-Einheiten anhaken.
4. Speichern.

Wenn keine AMS-Einheit angehakt ist, wird wieder die automatische Zuordnung benutzt.

## 7. Energie zuordnen

Eine smarte Steckdose ist normalerweise ein separates Home-Assistant-Gerät. Ordne deshalb pro Drucker optional zu:

- Leistungssensor (`device_class: power`)
- Energiesensor (`device_class: energy`)

Zusätzlich kann ein globaler Strompreis in €/kWh eingetragen werden.

## 8. Updates

Nach einer neuen Version:

1. **HACS → Bambu Lab Dashboard**
2. **⋮ → Neu herunterladen**
3. **Strg + F5**

Wenn weiterhin eine alte Version angezeigt wird, unter **Einstellungen → Dashboards → Ressourcen** prüfen, ob weiterhin dieselbe `Bambulab-Dashboard.js` geladen wird.
