<table>
<tbody>
  <tr>
    <td>
        <a href='crc-{klassenname}.md'>
            ← {klassenname}
        </a>
    </td>
    <td>
        <a href='CRC_Start_Condig.md'>
            Analyse
        </a>
    </td>
    <td>
        <a href='crc-{klassenname}.md'>
            {klassenname} →
        </a>
    </td>
  </tr>
</tbody>
</table>

# Start Config
## Verantwortlichkeiten
<!-- Wissen, welches verwaltet und angeboten wird, Aktion die angeboten werden, öffentliche Leistung -->
<!-- "Walkthrough" -> Szenarien zur Anwendung des Systems -->
<!-- Nichts, was eine andere Klasse machen könnte -->
<!-- Die Sachen die die Klasse macht -> keiner anderen Klasse geben -->
<!-- zentrale Verantwortlichkeiten vs verteilt -->
1. System Admin erstellen
2. Datenbanktabellen erstelle
3. Überprüfung ob API neustartet oder Erststart ist 

## Kollaborationen
<!-- Kann die Klasse die Verantwortlichkeiten selbständig erfüllen? Was benötigt sie von welcher Klasse? -->
<!-- Was weiß die Klasse? Welche anderen Klassen benötigen die Informationen? -->
1. DB-Kommunikation
2. Frontend-Kommunikation
3. Admin-Erstellung

---
#### Notizen:
<!-- Hier Notizen zum Denkprozess, Hintergrundgedanken, Klarstellungen hinzufügen  -->
- beim Starten der API muss der nutzer angeben ob eine neue API aufgesetzt wird oder eine ältere API neustartet
- Tabellen in der Datenbank erstellen die bei späteren Nutzung verwendet werden 

#### Changelog:
erstellt: 04.09.2023
<!-- Hier eventuelle Abänderungen dokumentieren -->