# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Sessiegeschiedenis

Lees `docs/SESSION_LOG.md` voor context over eerdere werksessies aan dit project (wat is gebouwd, welke keuzes zijn gemaakt, wat nog openstaat). Voeg na een sessie met noemenswaardige wijzigingen een nieuwe sectie bovenaan dat bestand toe.

# eas update commando's

Geef na elke codewijziging die de gebruiker lokaal moet uitrollen altijd een `git pull` mee vóór het `eas update`-commando, bijvoorbeeld:

```
git pull
eas update --branch production --message "..."
```

Dit voorkomt dat een oude bundel (zonder de nieuwste commit) per ongeluk opnieuw gepubliceerd wordt.
