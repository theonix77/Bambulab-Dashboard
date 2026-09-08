# Abgleich mit greghesp/ha-bambulab

Stand der Prüfung: 2026-09-08, Branch `main`.

Das Dashboard verwendet keine eigenen MQTT-Kommandos. Alle Schreiboperationen gehen über Home-Assistant-Entities, die `greghesp/ha-bambulab` erzeugt.

## Schreibbare Entities

| HA-Domain | translation_key / key | Dashboard |
|---|---|---|
| button | pause | Pause |
| button | resume | Fortsetzen |
| button | stop | Stop |
| button | refresh | Refresh |
| button | buzzer_silence | Alarm aus |
| button | buzzer_fire_alarm | Feueralarm |
| button | buzzer_beeping | Signalton |
| select | printing_speed | Druckgeschwindigkeit |
| select | airduct_mode | Luftkanal-Modus |
| number | target_nozzle_temperature | Solltemperatur Düse |
| number | target_bed_temperature | Solltemperatur Bett |
| number | target_chamber_temperature | Solltemperatur Kammer |
| fan | cooling_fan | Bauteillüfter |
| fan | aux_fan | Aux-Lüfter |
| fan | chamber_fan | Kammerlüfter |
| fan | secondary_aux_fan | zweiter Aux-Lüfter |
| light | chamber_light | Kammerlicht |
| switch | camera | Kamera aktiv |
| switch | imagecamera | Kamera-Einzelbildmodus |
| switch | prompt_sound | Hinweistöne |

## Bambu-Autorisierung / Hybrid-Modus

Die Integration dokumentiert, dass bei neueren gesperrten Firmwareständen die Lesefunktionen erhalten bleiben, aber die Mehrheit der Schreibfunktionen im Cloud-Betrieb nicht verfügbar ist. Für volle Schreibzugriffe nennt die Integration LAN Mode + Developer LAN Mode. Für ältere Hybrid-Firmwares nennt sie ausdrücklich den Zustand, dass nur das Licht steuerbar bleibt.

Quelle im Plugin: `docs/index.mdx`.

Das Dashboard prüft deshalb `hybrid_mode_blocks_control`, `developer_lan_mode` und `mqtt_encryption` und zeigt eine Warnung, statt nicht vorhandene Controls vorzutäuschen.

## Kamera

`camera.py` registriert bei RTSP-fähigen Modellen eine `camera`-Entity. Wenn kein nutzbarer RTSP-Endpunkt vorliegt, liefert `BambuLabRtspCamera.camera_image()` ein schwarzes JPEG mit rotem Ausrufezeichen. Wenn dieses Bild im Dashboard erscheint, stammt es daher bereits aus der Integration.

## Aktives Filament

`definitions.py` stellt `active_tray` bereit. Der State ist der Name des aktiven Filaments; Attribute enthalten u. a. `color`, `type`, `remain`, `tray_index`, `ams_index`, Temperaturgrenzen und UUID. Tray-Entities besitzen zusätzlich `slot` und `active`.

## Gesamtlaufzeit

`total_usage_hours` ist die vom Plugin vorgesehene Gesamtnutzungszeit. Das Dashboard verwendet ausschließlich diese Entity und niemals die Dauer des letzten Druckjobs als Ersatz.
