Von Anfang an war klar dass eine App zum scannen und entwerten der Tickets benutzt werden soll.
Die erste Idee war eine native Android App mittels Kotlin und Jetpack Compose.\
Allerdings müsste diese dann bei den Nutzern mittels Sideloading installiert werden.
Das ist prinzipiell kein Problem, jedoch umgehen Nutzer damit einen Sicherheitsmechanismus ihres Telefons.
Wenn Sideloading nach der Installation nicht wieder deaktiviert werden kann bleiben unwissende oder unerfahrene Nutzer offen gegenüber möglichen bösartigen Installationen.\
Außerdem gestaltet sich so das Updaten der App umständlich.\
Somit ist Sideloading eigentlich zu vermeiden. App-Store lizenzen sind allerdings Teuer(?).\
Als Alternative bieten sich hier Progressive Web Apps an.\
Nach kurzer Recherche ergab sich Folgendes:

- Native App
    - Pro
        - Konzept klar --> für mich besser approachable
        - ((marginal bessere Geschwindigkeit als PWAs))
    - Contra
        - plattformgebunden
        - umständlich zu verbreiten: hier via Sideloading, sonst App-Stores (einmalig 25$?)
- PWA
    - Pro
        - leichte distribution
        - plattformunabhängig
        - geringer Wartungsaufwand, immer up-to-date
    - Contra
        - Konzept & Sprache (Web-Techstack: JS, Node.js, React, SASS) neu für mich --> höherer Aufwand
        - benötigen Server --> URZ
          - gewünschte dezentralisierung umsetzbar?
        - Google's Material 3 nicht umsetzbar
        - unser Projekt benötigt (bislang) keine *Background*-Tasks

Für beide Varianten existieren QRCode-Scanner als Bibliotheken, somit gibt es da keine Unterschiede.

[08.08.2023]\
Bei meinen Recherchen bin ich über Material3 auf Flutter und dann auf Dart gestoßen.\
Dart scheint eine Programmiersprache mit Fokus auf UI und plattformunabhängigkeit zu sein.
Sie kompiliert in alle plattformen und auch in JS.\
Eine Umsetzung in Dart, die ich dann zu JS kompilieren und in eine PWA verpacken kann wäre ideal.\
Jedoch ist mir noch nicht ganz klar was nun Flutter genau ist und wie das mit Dart zusammenhängt.\
Weitere Recherche ist hier notwendig.