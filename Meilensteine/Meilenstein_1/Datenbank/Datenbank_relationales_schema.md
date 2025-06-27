# Relationale Datenbank Schema
- **VeranstaltungsID (INT) {PK}**,	Veranstaltungsname (STRING),	Datum (DATE),	Uhrzeit (TIME),	Ticketanzahl (INT),	Ort (STRING), Preis(FLOAT)
- **TicketID (INT) {PK}**,	_VeranstaltungsID (INT) {FK}_,	**Ticket-Key (STRING) {PK}**,	Ist-gültig-Flag (BOOL)
- **Nutzertoken (string) {PK}**,	**Nutzerid{PK}**, Name(String)
- _Nutzerid {FK}_, _VeranstaltungsID {FK}_, modifier (Bool)
