# Installation

## 1. Bambu-Integration

Installiere zuerst [greghesp/ha-bambulab](https://github.com/greghesp/ha-bambulab) über HACS und richte deine Drucker unter **Einstellungen → Geräte & Dienste → Bambu Lab** ein.

Prüfe dort, dass Status-/Temperatur-Entitäten vorhanden sind. AMS, Kamera und Steuerungen erscheinen nur, wenn Modell, Firmware und Verbindungsmodus sie bereitstellen.

## 2. Dashboard-Repository

HACS → Dashboard → ⋮ → Benutzerdefinierte Repositories → `https://github.com/theonix77/Bambulab-Dashboard` → Typ **Dashboard**.

Danach installieren und Browser mit **Strg+F5** neu laden.

## 3. Karte

```yaml
type: custom:bambu-lab-dashboard
```

Für die Druckererkennung sind keine Entity-IDs nötig.

## 4. Karteneditor

Im visuellen Editor können Theme, Reihenfolge, Name, AMS-Zuordnung, Leistungs-/Energiesensoren und optionale Entity-Overrides konfiguriert werden.

## 5. Breite

Die Karte nutzt 100 % ihrer von Home Assistant zugewiesenen Section-Breite. Soll sie breiter sein, muss die Section/View entsprechend breit eingestellt werden.
