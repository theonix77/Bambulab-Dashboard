# Changelog

## 1.8.4

- Mobile Scroll-Stabilisierung überarbeitet: vollständige Shadow-DOM-Neuaufbauten werden während Touch-, Scroll- und Momentum-Scroll-Interaktionen blockiert und anschließend gebündelt nachgeholt.
- Die 60-Sekunden-Geräteerkennung verwendet jetzt denselben Render-Guard wie Live-State-Updates und kann beim Scrollen keinen ungeschützten Full-Render mehr auslösen.
- Alte Scrollpositions-Wiederherstellung per nachträglichem `scrollTo` entfernt, um sichtbare Sprünge auf mobilen Browsern/WebViews zu vermeiden.
- Home-Assistant-Karteneditor/Adminbereich bleibt von Live-State-Neuaufbauten getrennt und bewahrt geöffnete Bereiche sowie seine interne Scrollposition.
- Regressionstests für den neuen Mobile-/Admin-Render-Schutz ergänzt.

## 1.8.3

- Optionales zweites Licht pro Drucker ergänzt; frei zuordenbar und in den Quick Controls steuerbar.
- Druck-Endzeit in der Druckerübersicht ergänzt; automatische Erkennung über `end_time` bzw. manuelle Zuordnung möglich.
- Optionale Idle-/Leerlaufabschaltung über einen frei zuordenbaren `input_boolean` ergänzt.
- Licht und zweites Licht zeigen ihren aktuellen EIN/AUS-Status direkt in den Quick Controls und werden bei aktivem Zustand hervorgehoben.
- Runtime-Tests für Endzeit, zweites Licht, Idle-Shutdown und Lichtstatus erweitert.
- Endzeit-Test robust auf die deutsche Home-Assistant-Locale abgestimmt.
- Automatischer GitHub-Release-Workflow ergänzt: Änderungen aus diesem Changelog werden als Release Notes veröffentlicht, damit HACS Versionsupdates und Änderungsinformationen sauber anzeigen kann.
- Deutsch/Englisch vollständig gegen die tatsächlich sichtbaren Dashboard-, Editor-, Popup-, Wartungs- und Bestätigungstexte gegengeprüft und fehlende englische Übersetzungen ergänzt.
- Neue modellabhängige Wartungstexte für A1, A1 mini, A2L, P1/P2, X1, H2/H2S, X2D und den sicheren Generic-Fallback vollständig in die englische Oberfläche aufgenommen.
- Smart-Steckdosen-Sicherheitsabfrage folgt jetzt ebenfalls der Home-Assistant-Sprache.
- Zusätzlicher automatischer i18n-Test prüft Kerntexte, dynamisch zusammengesetzte Texte sowie den englischen Fallback.
- Konsistenztest erweitert: sichtbare Druckerauswahl wird geprüft; installationsspezifische Entity-IDs und persönliche Testumgebungsnamen dürfen nicht im öffentlichen Paket vorkommen.
- Light-/Dark-/Auto-Popup-Theming, automatische Druckererkennung, Benutzer-Auswahl der sichtbaren Drucker und modellabhängige Wartungsprofile unverändert erhalten.

## 1.8.2

- Repository-weite Versions- und Dokumentationskonsistenz bereinigt.
- README beschreibt ausschließlich den aktuellen Funktionsstand; historische Versionshinweise wurden aus der laufenden Dokumentation entfernt.
- Hilfetexte von alten Versionsbezügen bereinigt.
- Changelog chronologisch und ohne doppelte Versionsabschnitte konsolidiert.
- Light-/Dark-/Auto-Theme für Wartungs- und AMS-Popups aus 1.8.1 unverändert enthalten.
- Modellabhängige Wartungsprofile und sicherer Fallback für unbekannte Modelle unverändert enthalten.

## 1.8.1

- Wartungs- und AMS-Detail-Popups übernehmen das ausgewählte bzw. automatische Dashboard-Theme.
- Light-Theme-Stile für Popup-Flächen, Texte, Buttons, Rahmen, Links und Backdrops ergänzt.
- Verwendete Oberflächenvariable `--bd-card` explizit definiert.

## 1.8.0

- Dashboard-Oberfläche automatisch zweisprachig: Deutsch bei deutscher Home-Assistant-Sprache, Englisch bei englischer bzw. sonstiger Sprache als Fallback; Datumsformat passt sich an.
- Wartung vollständig modellabhängig: Profil wird automatisch aus dem von `ha-bambulab` gemeldeten Druckermodell gewählt.
- Abdeckung der aktuell von `ha-bambulab` gelisteten Modelle A1, A1 mini, A2L, P1P, P1S, P2S, H2C, H2D, H2D Pro, H2S, X1, X1C, X1E und X2D.
- Keine Übernahme von X2D-Intervallen auf andere Modelle; Kalendertermine nur bei verifiziertem modellbezogenen Herstellerintervall.
- Unbekannte zukünftige Modelle erhalten einen sicheren allgemeinen Fallback ohne erfundene Fristen.
- Wartungsseite zeigt das automatisch gewählte Modell-/Familienprofil an.
- Wartungsbuttons mit Hover-/Active-/Focus-Feedback und sichtbarer Bestätigung nach Quittierung.
- Wartungsbuch mit 15 Einträgen pro Seite, Seitennavigation, Filtern, 30-Tage-Ansicht, Auswertung sowie Einzel-/Gesamtlöschung mit Sicherheitsabfrage.

## 1.6.3

- Wartungslogik des X2D auf offizielle Zeitintervalle aus Kapitel 11 des Bambu-Lab-Handbuchs umgestellt; Gesamtbetriebsstunden lösen keine Wartung aus.
- Neue, noch nie quittierte Wartungen werden nicht sofort als fällig markiert.
- Kompakte Übersicht „Nächste Wartungen“ ergänzt.

## 1.6.2

- README um zentrierten Dashboard-Screenshot ergänzt.
- Sichtbare Dashboard-Versionsanzeige und Paketversion aktualisiert.

## 1.6.1

- Mobilansicht stabilisiert; Live-Updates lösen während aktiver Touch-/Scroll-Vorgänge keinen kompletten DOM-Neuaufbau aus.
- AMS-Slot-Details als responsives Modal umgesetzt.

## 1.6.0

- Entity-Erkennung der Steuerung auf Domain + `translation_key`/Unique-ID umgestellt.
- Schreibschutz/Hybrid-Modus diagnostiziert.
- Aktives Filament gerendert.
- Proportionale Druckerbilder, Kamera-Diagnose, Wartungsquellen-Popup und strikte `total_usage_hours`-Nutzung ergänzt.

## 1.5.0

- Steuer-Entity-Erkennung auf kompletten Printer-Gerätebaum erweitert.
- Smart-Steckdose, Energiezuordnung, Kamera-Proxy, aktives Filament und modellbezogene Wartung ergänzt.

## 1.4.0

- WebSocket Entity Registry und `hass.entities` zusammengeführt.
- AMS-Slot-Detailansicht und robuste Energiezuordnung ergänzt.
- Light-Theme-Kontraste überarbeitet.

## 1.3.0

- Dark/Light/Auto-Theme im visuellen Editor.
- Proportionale Druckerbilder, AMS-Tray-Erkennung, erweiterte Steuerung und kompakte Karten-Picker-Vorschau ergänzt.
