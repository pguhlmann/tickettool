CRC-Karte - {Klassenname}
<table>
<tbody>
  <tr>
    <td>
        <a href='crc-{klassenname}.md'>
            ← {klassenname}
        </a>
    </td>
    <td>
        <a href='README.md'>
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

# App/UI
## Verantwortlichkeiten
<!-- Wissen, welches verwaltet und angeboten wird, Aktion die angeboten werden, öffentliche Leistung -->
<!-- "Walkthrough" -> Szenarien zur Anwendung des Systems -->
<!-- Nichts, was eine andere Klasse machen könnte -->
<!-- Die Sachen die die Klasse macht -> keiner anderen Klasse geben -->
<!-- zentrale Verantwortlichkeiten vs verteilt -->
1. Hauptmenü anzeigen
2. DB-QR-Code-Scan aufrufen
3. Karten-QR-Code-Scanner aufrufen
4. Scanergebnis mit DB prüfen
5. Ticket-Ergebnis anzeigen

## Kollaborationen
<!-- Kann die Klasse die Verantwortlichkeiten selbständig erfüllen? Was benötigt sie von welcher Klasse? -->
<!-- Was weiß die Klasse? Welche anderen Klassen benötigen die Informationen? -->
1. DB-Kommunikation
2. QR-Code Scanner

---
#### Notizen:
<!-- Hier Notizen zum Denkprozess, Hintergrundgedanken, Klarstellungen hinzufügen  -->
Lassen wir die manuelle Eingabe der DB-Token/URLs aufgrund von Unhandlichkeit zwecks Sicherheit komplett weg?
Sonst müsste das hier auch noch rein.

#### Changelog:
<!-- Hier eventuelle Abänderungen dokumentieren -->