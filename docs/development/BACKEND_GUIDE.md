# Guide backend mock

## Rôle du serveur

Le backend local utilise `json-server` 0.17 et `json-server-auth` 2.1. Il permet
de développer le MVP ; il ne constitue pas une architecture de production.

```text
server.js
  → middleware JWT
  → route métier
  → service métier
  → app.db / db.json
  → gestionnaire d’erreur
```

## Répartition

- `server.js` construit l’application et enregistre les modules ;
- `server/middlewares/` authentifie ou enrichit la requête ;
- `server/routes/` extrait les paramètres HTTP et appelle un service ;
- `server/services/` applique les règles métier et écrit dans `app.db` ;
- `server/utils/` contient les erreurs et outils transversaux.

Une route doit rester fine :

```js
app.patch(
  '/api/appointments/:id/cancel',
  requireJwt,
  (request, response, next) => {
    try {
      const appointment = services.cancelAppointment(
        app.db,
        request.auth.userId,
        request.params.id,
      )
      return response.status(200).json(appointment)
    } catch (error) {
      return next(error)
    }
  },
)
```

## Contrat d’authentification

Le JWT de `json-server-auth` place l’identifiant dans `sub`. Le middleware le
normalise en nombre dans `request.auth.userId`. Ne jamais utiliser
`request.auth.id` ni attendre le rôle dans le JWT.

Le rôle est résolu depuis la collection `users`. Un médecin métier est ensuite
retrouvé via `doctors.userId`.

## Ajouter une action métier

1. définir les statuts d’entrée et de sortie ;
2. implémenter la règle dans un service ;
3. ajouter une route `/api/*` protégée ;
4. transformer les erreurs attendues en `ApiError` ;
5. écrire un test HTTP sur une copie temporaire de `db.json` ;
6. vérifier l’identité transmise au service, pas seulement le code HTTP ;
7. interdire l’écriture CRUD directe équivalente si elle contourne la règle.

## Tests attendus

Pour une route protégée, couvrir au minimum :

- JWT absent ou invalide → `401` ;
- rôle insuffisant → `403` ;
- ressource absente → `404` ;
- conflit métier → `409` si applicable ;
- identité propriétaire réellement transmise au service ;
- transition et persistance réussies.

Les tests utilisent une copie jetable de `db.json` et un port système libre. Ils
ne doivent jamais modifier les données de démonstration du dépôt.
