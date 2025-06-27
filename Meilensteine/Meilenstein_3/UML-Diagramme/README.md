# How to: PlantUML in VSCode
1. Extension installieren
2. Settings der Extension öffnen
   1. `Render` auf `PlantUMLServer` wechseln
   2. Bist du damit einverstanden, deine Diagramme an den öffentlichen Server zu senden?
      1. Wenn ja, dann bei `Server` `https://www.plantuml.com/plantuml` eintragen.
      2. Sonst eigenen Server angeben oder lokalen Renderer benutzen.
   3. Wenn die Diagramme in den gleichen Ordner wie die Quelldatei abgelegt werden sollen, dann `Export Out Dir` auf `.` setzen. Zusätzlich habe ich `Export Sub Dir` auf false gesetzt, weiß aber nicht ob oder was das bewirkt hat.
3. Dann sind wir bereit: .puml Datei anlegen und mit `Alt + D` Preview öffnen, wenn Fertig mit dem VSC Befehl `PlantUML: Export Current Diagram` exportieren lassen.
4. Profit