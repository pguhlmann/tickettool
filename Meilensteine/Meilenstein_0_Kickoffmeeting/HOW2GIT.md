
Hallo,

da ihr noch nicht mit GIT gearbeitet habt, hier ein paar Basics:

## VISUAL STUDIO
1. Zuerst benötigt ihr Visual Studio Code falls ihr das noch nicht habt (https://code.visualstudio.com/).
    // Ohne das geht gar nichts, zumindest nicht wirklich schön ;)
## GIT FÜR WINDOWS
2. Ihr arbeitet mit Windows, daher benötigt ihr GIT für Windows: https://gitforwindows.org/
    -> Herunterladen und Installieren
    -> Bei der Installation könnt ihr auswählen, dass Visual Studio Code der Default-Editor für die         Git-Installation
       sein soll.
## VSC TERMINAL AUF GIT BASH EINSTELLEN
3. Normalerweise wird man jetzt beim öffnen von VSC gefragt, welches das Standard Terminal sein soll-
    -> BASH auswählen
    // Falls das nicht klappt, fragt mich danach.
## VSC GITLAB EXTENSION
4. Findet ihr unter Erweiterungen (in VSC) indem ihr nach "GitLAB Workflow" sucht. Anleitung: https://gitlab.com/fatihacet/gitlab-vscode-extension/blob/master/README.md

## VSC MIT GITLAB DER UNI VERBINDEN
5. Dieser Punkt hat mir ganz besonders viel Spaß gemacht. Die übliche Koppelung funktionierte bei mir nämlich absolut nicht und die Anleitungen die ich gefunden habe, haben mir nicht wirklich geholfen
    -> https://gitlab.hrz.tu-chemnitz.de/-/profile/personal_access_tokens
    -> Neuen TOKEN generieren (Ich hab alle Checkboxen geklickt, da eh kein sudo dabei war)
    -> Zeit nicht zu lange machen
    -> Unbedingt in KeePass o.ä. bekommt man nur einmal zu sehen
    -> SHIFT + STRG + P 
    -> Git: Clone
    -> Link einfügen
    -> Jetzt solltet ihr Dokumentation und Meilensteine sowie deren Inhalt sehen können
## BASIC BEFEHLE
6. https://thomas-leister.de/git-fuer-einsteiger/
    -> Bitte auch das GitFlow Chart ansehen
    -> Eigenen Branch aufmachen 
    -> Dinge tun 
    -> Nach Review der anderen beiden mergen

