# Installation

## Voraussetzung

Installiert und eingerichtet sein muss [greghesp/ha-bambulab](https://github.com/greghesp/ha-bambulab). Dieses Dashboard ersetzt diese Integration nicht.

## HACS

1. HACS öffnen.
2. Bereich **Dashboard** öffnen.
3. **Benutzerdefinierte Repositories** öffnen.
4. [https://github.com/theonix77/Bambulab-Dashboard](https://github.com/theonix77/Bambulab-Dashboard) als Typ **Dashboard** hinzufügen.
5. Bambu Lab Dashboard installieren.
6. Browser mit **Strg + F5** neu laden.

## Karte

```yaml
type: custom:bambu-lab-dashboard
```

## Breite

Bei einer Sections-View kann eine Karte ihre übergeordnete Section nicht selbst verbreitern. Für ein großes Control Center die Section im Section-Editor auf 2–3 Sections Breite stellen oder eine eigene **Panel-View** verwenden.

Dokumentation:

- [Sections](https://www.home-assistant.io/dashboards/sections/)
- [Dashboard Views / Panel](https://www.home-assistant.io/dashboards/views/)
- [Custom Card Grid Options](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/)

## Eigenes A2L-Bild

Beispiel:

```text
/config/www/bambu/a2l.png
```

im Karteneditor als:

```text
/local/bambu/a2l.png
```
