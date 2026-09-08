# Validation v1.8.3

`npm run validate` prüft Syntax, Discovery, Runtime, Features und Custom-Element-Registrierung.

Zusätzlich wird für die Wartung statisch geprüft, dass alle aktuell von `ha-bambulab` gelisteten Druckermodelle im Modellrouting berücksichtigt werden und ein sicherer Fallback für unbekannte Modelle vorhanden ist.

Grundsatz: Wartungsintervalle werden nicht von einem Modell auf ein anderes übertragen. Kalenderfristen werden nur dort berechnet, wo im Profil ein verifiziertes Bambu-Lab-Intervall hinterlegt ist; andernfalls bleibt die Aufgabe regelmäßig/zustandsabhängig.
