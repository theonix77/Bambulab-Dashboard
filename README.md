# Bambu Lab Dashboard for Home Assistant

![Bambu Lab Dashboard](docs/images/hero.svg)

Ein eigenständiges **Bambu Lab Control Center für Home Assistant**. Es zeigt alle über `greghesp/ha-bambulab` eingebundenen Drucker in einer gemeinsamen Übersicht und öffnet pro Drucker eine Detailansicht mit Status, Temperaturen, Kamera, Steuerung, AMS, Energie und Wartung.

> **Wichtig:** Dieses Projekt ist nur die Benutzeroberfläche. Die Verbindung zu Bambu Cloud/LAN und zum Drucker übernimmt weiterhin die Home-Assistant-Integration **`greghesp/ha-bambulab`**. Die zusätzlichen Bambu-Lovelace-Karten sind **nicht erforderlich**.

## Was ist neu in v1.1.0?

v1.1.0 ändert die Bedienlogik grundlegend:

- **Übersicht zeigt alle Drucker gleichzeitig** statt nur den gerade ausgewählten Drucker.
- Jeder Drucker hat eine kompakte Statuskarte mit Modell, Druckstatus, Fortschritt, Auftrag, Restzeit, Düse, Bett und AMS-Anzahl.
- Klick auf einen Drucker öffnet dessen **Drucker-Details**.
- **AMS wird innerhalb der Detailansicht des zugehörigen Druckers** angezeigt.
- Drucker können im visuellen Editor **umbenannt, sortiert und ausgeblendet** werden.
- AMS kann automatisch über Home Assistants Gerätehierarchie zugeordnet werden; falls das bei einer Installation nicht sauber ist, kann die Zuordnung **manuell pro Drucker** festgelegt werden.
- Kamera, AMS, Energie und Wartung können **pro Drucker ein-/ausgeblendet** werden.
- Leistungs- und Energiesensoren können **pro Drucker** zugeordnet werden.
- Die Bambu-Erkennung akzeptiert nur Entitäten mit Plattform `bambu_lab`. HACS-/Dashboard-Update-Geräte werden dadurch nicht mehr fälschlich als Drucker behandelt.
- Die Erkennung berücksichtigt zusätzlich `translation_key`, wodurch sie weniger von frei vergebenen Entity-Namen abhängig ist.

## Architektur

```text
Bambu Drucker / AMS
       │
       ▼
greghesp/ha-bambulab
       │
       ├─ Gerätekonfiguration
       ├─ Status / Fortschritt
       ├─ Temperaturen / Lüfter
       ├─ Kamera
       ├─ AMS / Filament
       └─ Steuerentitäten
       │
       ▼
Bambulab-Dashboard
       │
       ├─ Übersicht aller Drucker
       ├─ Detailansicht pro Drucker
       ├─ AMS-Zuordnung
       ├─ Energie-Zuordnung
       └─ Wartung
```

Das Dashboard meldet sich **nicht selbst bei Bambu Lab an**, öffnet keine eigene MQTT-Verbindung und speichert keine Bambu-Zugangsdaten.

## Voraussetzungen

Benötigt werden:

1. Home Assistant
2. HACS
3. `greghesp/ha-bambulab`
4. mindestens ein bereits in dieser Integration eingerichteter Drucker

Projekt der benötigten Integration:

`https://github.com/greghesp/ha-bambulab`

### Nicht erforderlich

Folgende Karten sind **keine Abhängigkeit** dieses Dashboards:

- Bambu Lab AMS Card
- Bambu Lab Print Control Card
- Bambu Lab Print Status Card
- Bambu Lab Spool Card
- separate Installation von `ha-bambulab-cards`

## Installation

### 1. Bambu-Lab-Integration installieren

Installiere und konfiguriere zuerst `greghesp/ha-bambulab`. Unter **Einstellungen → Geräte & Dienste → Bambu Lab** müssen deine Drucker und deren Entitäten sichtbar sein.

Wenn du mehrere Drucker hast, müssen alle dort eingerichtet sein. AMS und Kamera müssen ebenfalls von dieser Integration bereitgestellt werden, sofern dein Modell/Verbindungsmodus sie unterstützt.

### 2. Bambu Lab Dashboard über HACS installieren

1. **HACS → Dashboard** öffnen.
2. Oben rechts **⋮ → Benutzerdefinierte Repositories**.
3. Repository eintragen:
   `https://github.com/theonix77/Bambulab-Dashboard`
4. Typ **Dashboard** auswählen.
5. Repository hinzufügen und **Bambu Lab Dashboard** installieren.
6. Browser anschließend mit **Strg + F5** neu laden.

HACS sollte die JavaScript-Ressource automatisch registrieren. Unter **Einstellungen → Dashboards → Ressourcen** muss eine Ressource ähnlich dieser vorhanden sein:

```text
/hacsfiles/Bambulab-Dashboard/Bambulab-Dashboard.js
```

Typ: **JavaScript-Modul**.

### 3. Karte hinzufügen

Im gewünschten Dashboard:

**Dashboard bearbeiten → Karte hinzufügen → Bambu Lab Dashboard**

Oder manuell:

```yaml
type: custom:bambu-lab-dashboard
```

Für die Grundfunktion sind **keine Drucker- oder Entity-IDs im YAML** notwendig.

## Wie werden die Drucker erkannt?

Die Karte liest über Home Assistants WebSocket-API die Geräte- und Entitätsregistrierung.

Ein Gerät wird nur als Drucker akzeptiert, wenn:

- seine relevanten Entitäten von der Plattform **`bambu_lab`** stammen und
- typische Druckerinformationen wie Temperatur plus Druckstatus/Fortschritt vorhanden sind.

Dadurch werden HACS-Update-Geräte oder andere Geräte, deren Name zufällig „Bambu“ enthält, nicht mehr als Drucker behandelt.

Die Zuordnung der Sensoren verwendet nach Möglichkeit die stabilen Daten der Integration (`unique_id` und `translation_key`) und ist dadurch unabhängig davon, wie du eine Entity in Home Assistant umbenannt hast.

## Bedienung

### Übersicht

Die Startseite zeigt **alle sichtbaren Drucker in der von dir festgelegten Reihenfolge**. Jede Karte enthält nur die wichtigsten Informationen:

- Name und Modell
- Status
- Fortschritt
- aktueller Druckauftrag
- Restzeit
- Düsentemperatur
- Betttemperatur
- Anzahl der zugeordneten AMS-Einheiten

Ein Klick auf die Druckerkarte öffnet die Detailansicht dieses Druckers.

### Drucker-Details

Die Detailansicht enthält – soweit vom jeweiligen Drucker tatsächlich bereitgestellt –:

- Druckfortschritt und Auftrag
- Restzeit und Layer
- Geschwindigkeit und WLAN
- Temperaturen und Lüfter
- Druckinformationen
- Kamera
- Steuerung
- **AMS des gewählten Druckers**
- Energie
- Wartung

Es werden keine Dummywerte erzeugt. Nicht vorhandene Funktionen werden weggelassen oder als nicht verfügbar gekennzeichnet.

## Drucker bearbeiten

Öffne die Karte im **visuellen Karteneditor**. Pro Drucker kannst du festlegen:

- **Anzeigename**
- **Reihenfolge**
- **anzeigen / ausblenden**
- Leistungssensor
- Energiesensor
- AMS anzeigen / ausblenden
- Kamera anzeigen / ausblenden
- Energie anzeigen / ausblenden
- Wartung anzeigen / ausblenden
- **manuelle AMS-Zuordnung**

Die Reihenfolge `1, 2, 3 ...` bestimmt die Reihenfolge auf der Übersicht und im Druckerumschalter.

## AMS-Zuordnung

Standardmäßig versucht das Dashboard, AMS-Geräte über die Home-Assistant-Gerätehierarchie (`via_device_id`) automatisch dem richtigen Drucker zuzuordnen.

Wenn deine Installation die AMS-Geräte anders anlegt oder die automatische Zuordnung nicht stimmt, kannst du im Editor beim jeweiligen Drucker die AMS-Einheiten manuell anhaken.

**Wichtig:** Sobald für einen Drucker mindestens eine manuelle AMS-Zuordnung gewählt wurde, wird für diesen Drucker diese Zuordnung verwendet. Lässt du alle AMS-Häkchen leer, arbeitet das Dashboard wieder automatisch.

## Energie

Die Bambu-Integration kennt eine externe smarte Steckdose nicht automatisch. Deshalb kannst du pro Drucker einen Home-Assistant-Sensor mit `device_class: power` und einen Sensor mit `device_class: energy` zuordnen.

Optional lässt sich ein globaler Strompreis in €/kWh eintragen. Ohne Sensorzuordnung zeigt das Dashboard keine erfundenen Verbrauchswerte.

## Modellbilder

Das Druckermodell wird aus der Home-Assistant-Geräteregistrierung gelesen. Für bekannte Modelle verwendet die Karte vorhandene Modellgrafiken aus dem öffentlichen Projekt `greghesp/ha-bambulab-cards`.

`ha-bambulab-cards` muss dafür **nicht installiert** sein. Gibt es für ein Modell keine eindeutige Grafik oder kann sie nicht geladen werden, wird ein neutrales Druckersymbol gezeigt.

## Updates

Nach einem Update des GitHub-Repositories:

1. **HACS → Bambu Lab Dashboard**
2. **⋮ → Neu herunterladen**
3. anschließend **Strg + F5**

Damit wird verhindert, dass Home Assistant oder der Browser noch eine ältere JavaScript-Datei verwendet.

## Fehlerbehebung

### Falsche Geräte erscheinen als Drucker

Ab v1.1.0 werden nur noch Entitäten mit Plattform `bambu_lab` für die Druckererkennung verwendet. Falls trotzdem ein falsches Gerät erscheint, bitte die Geräte- und Entitätsstruktur der Bambu-Integration melden.

### Druckauftrag/Fortschritt ist falsch

Öffne zuerst den betroffenen Drucker unter **Einstellungen → Geräte & Dienste → Bambu Lab** und prüfe dort `Print progress`, `Print status` und den Auftragsnamen. Das Dashboard liest diese Werte direkt aus Home Assistant.

### AMS fehlt oder hängt am falschen Drucker

Öffne den Karteneditor und nutze die **manuelle AMS-Zuordnung** beim gewünschten Drucker.

### `Custom element doesn't exist: bambu-lab-dashboard`

In HACS **Neu herunterladen**, dann unter **Einstellungen → Dashboards → Ressourcen** prüfen, ob `Bambulab-Dashboard.js` als JavaScript-Modul vorhanden ist, danach **Strg + F5**.

Weitere Hilfe: [docs/HELP.md](docs/HELP.md)

## Datenschutz

Das Dashboard verarbeitet nur Daten, die das angemeldete Home-Assistant-Frontend bereits lesen darf. Es enthält keine Bambu-Zugangsdaten. Für die optionalen Modellbilder wird eine öffentliche GitHub-Raw-Quelle aufgerufen.

## Entwicklung und Validierung

```bash
npm run validate
```

führt Syntax-, Discovery- und Registrierungsprüfungen aus. Eine echte Ende-zu-Ende-Prüfung gegen alle Bambu-Modelle ist nur in realen Home-Assistant-Installationen möglich.

## Lizenz

MIT. Bambu Lab ist eine Marke des jeweiligen Rechteinhabers. Dieses Community-Projekt ist nicht offiziell mit Bambu Lab verbunden.
