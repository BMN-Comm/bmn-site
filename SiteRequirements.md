# BMN site take 3

## Domein:

### Deelnemers:

Naam
Email
Wachtwoord
Muzieksmaak
Kleur tandenborstel

### DeelnemerSpeeltInstrument

DeelnemerId
Instrument - ENUM

### Commissies

Jaar
Naam
Kleur

### Deelnemer in commissie

DeelnemerId
CommissieId
Rol

### Edities

Jaar
Datum van optreden
Ticket link
Auditie link

### Nummers:

Naam
Artiest
Lengte
Link
Genre
DeelnemerId(Wie heeft het nummer ingestuurd)

### Nummer in editie (masterlist)

CombinatieId
NummerId
EditieIds

### CommissieVindNummerLeuk (DE lijst)

CommissieId
NummerId

### Deelnemer in editie

DeelnemerId
EditieId

### Deelnemer op nummer in editie

DeelnemerId
NummerInEditieId
Partij

### Repititiedagen

Datum
Begintijd
Eindtijd
Locatie
EditieId

### NummerOpRepititiedag

NummerInEditieId
RepetiedagId
Begintijd
Eindtijd

### BeschikbaarheidDeelnemerOpRepititiedag

DeelnemerId
RepetiedagId
Beschikbaar Ja/Nee
Begintijd
Eindtijd
Optioneel Reden

### NieuwsPosts

EditieId
DatumTijd
Text
DeelnemerId (Auteur)
Tech Stack:
DB: Firebase

Requirements:
