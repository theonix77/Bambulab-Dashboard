# Validation v1.8.4

`npm run validate` prüft Syntax, Discovery, Runtime, Features und Custom-Element-Registrierung.

Zusätzlich wird für die Wartung statisch geprüft, dass alle aktuell von `ha-bambulab` gelisteten Druckermodelle im Modellrouting berücksichtigt werden und ein sicherer Fallback für unbekannte Modelle vorhanden ist.

Grundsatz: Wartungsintervalle werden nicht von einem Modell auf ein anderes übertragen. Kalenderfristen werden nur dort berechnet, wo im Profil ein verifiziertes Bambu-Lab-Intervall hinterlegt ist; andernfalls bleibt die Aufgabe regelmäßig/zustandsabhängig.

## Mobile-/Admin-Rendering

Die Hauptkarte blockiert vollständige Shadow-DOM-Neuaufbauten während Touch-, Scroll- und Momentum-Scroll-Interaktionen. Live-State-Updates und die 60-Sekunden-Geräteerkennung verwenden denselben Render-Guard; ein ausstehendes Update wird erst nach Ende der Interaktion ausgeführt. Die frühere nachträgliche Scrollpositions-Wiederherstellung wurde entfernt, weil sie auf mobilen WebViews selbst sichtbare Positionssprünge verursachen kann.

Der Home-Assistant-Karteneditor (Admin) bleibt von Live-State-Neuaufbauten getrennt und bewahrt beim konfigurationsbedingten Neuaufbau geöffnete Detailbereiche sowie seine interne Scrollposition. Die statischen Regressionstests prüfen zusätzlich, dass der alte Mobile-Touch-/Scroll-Restore-Code nicht wieder eingeführt wird.
