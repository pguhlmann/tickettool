<table>
<tbody>
  <tr>
    <td>
        <a href='crc-{klassenname}.md'>
            ← {klassenname}
        </a>
    </td>
    <td>
        <a href='CRC_Key.md'>
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

# Key
## Verantwortlichkeiten
<!-- Wissen, welches verwaltet und angeboten wird, Aktion die angeboten werden, öffentliche Leistung -->
<!-- "Walkthrough" -> Szenarien zur Anwendung des Systems -->
<!-- Nichts, was eine andere Klasse machen könnte -->
<!-- Die Sachen die die Klasse macht -> keiner anderen Klasse geben -->
<!-- zentrale Verantwortlichkeiten vs verteilt -->
1. Key generieren
2. Key überprüfen
3. Key entwerten
4. weiter Keys generieren

## Kollaborationen
<!-- Kann die Klasse die Verantwortlichkeiten selbständig erfüllen? Was benötigt sie von welcher Klasse? -->
<!-- Was weiß die Klasse? Welche anderen Klassen benötigen die Informationen? -->
1. DB-Kommunikation
2. Frontend-Kommunikation

---
#### Notizen:
<!-- Hier Notizen zum Denkprozess, Hintergrundgedanken, Klarstellungen hinzufügen  -->
- Key Generierung muss starke Keys generieren um brutfocre zu erschweren
- Keys müssen in der DB überprüft werden das keine doppelten Keys existieren
- Abgefragte Keys müssen entwerten werden, um ein doppeltes Nutzen zu verhindern

#### Changelog:
erstellt: 04.09.2023
<!-- Hier eventuelle Abänderungen dokumentieren -->