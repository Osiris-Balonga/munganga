# Munganga

Socle du MVP académique de prise de rendez-vous médical à Brazzaville. Cette étape fournit une base exécutable et documentée, sans implémenter les écrans complets ni les transitions métier finales.

## Prérequis

- Node.js 20.19 ou plus récent
- pnpm 11

## Installation et lancement

```bash
pnpm install
Copy-Item .env.example .env
pnpm start
```

Le frontend est disponible sur le port indiqué par Vite (généralement
`http://localhost:5173`) et l'API mock sur `http://localhost:3001`. Il est aussi
possible de les lancer séparément avec `pnpm dev` et `pnpm api`.

Le catalogue des composants est disponible sur `/ui-kit`.

## Documentation développeur

- [Manuel développeur](docs/development/README.md)
- [Architecture](docs/development/ARCHITECTURE.md)
- [Guide frontend](docs/development/FRONTEND_GUIDE.md)
- [Guide backend](docs/development/BACKEND_GUIDE.md)
- [Traiter une issue](docs/development/DEVELOPMENT_WORKFLOW.md)
- [Règles de contribution](CONTRIBUTING.md)

## Versions imposées

- React en JavaScript uniquement
- TanStack Router `1.170.29`
- TanStack Router Plugin `1.168.0` pour la génération des routes
- TanStack Query `5.101.4`
- json-server `0.17.4` - toute version 1.x est interdite
- json-server-auth `2.1.0`

Le serveur est programmatique. Son ordre est `rewriter/règles -> auth -> router` et `app.db = router.db` est défini avant l'authentification.

## Structure

```text
src/
  app/                  création du router et styles globaux
  components/domain/    composants métier partagés
  components/navigation/navigation responsive
  design-system/        tokens et composants visuels génériques
  features/             logique et accès API par domaine
  lib/api/              client fetch centralisé
  lib/auth/             session, token et guards
  routes/               routes TanStack générées depuis les fichiers
server/                 routes, middlewares et services backend
server.js               assemblage du serveur json-server
db.json                 données de démonstration
routes.json             permissions json-server-auth
```

## Authentification et permissions

`/register` et `/login` restent fournis par json-server-auth. Toute inscription est forcée au rôle métier `patient` côté serveur. Le JWT est signé et vérifié côté serveur. Le frontend stocke la réponse de session, ajoute `Authorization: Bearer <token>` et purge la session lors d'une réponse `401`.

La version `2.1.0` de json-server-auth utilise la clé interne fixe `json-server-auth-123456` et l'algorithme HS256. Le middleware JWT des routes métier emploie exactement les mêmes paramètres. Cette clé est acceptable uniquement pour le mock local et devra disparaître lors du remplacement par un véritable backend.

| Ressource           | Règle | Justification                                                                                                               |
| ------------------- | ----: | --------------------------------------------------------------------------------------------------------------------------- |
| `users`             | `600` | Chaque compte est privé et lié à son propriétaire.                                                                          |
| `clinics`           | `444` | L'annuaire est public et sans écriture CRUD.                                                                                |
| `doctors`           | `644` | Lecture publique, écriture limitée au profil propriétaire via `userId`.                                                     |
| `availabilitySlots` | `644` | Lecture publique. Les écritures sont bloquées dans `server.js` et devront passer par des routes métier.                     |
| `appointments`      | `600` | Ownership patient reconnu par le champ obligatoire `userId`. Les écritures CRUD sont bloquées au profit des actions métier. |

Le rôle `patient` ou `doctor` reste un simple champ métier de `users`. Il n'est pas transformé en système de rôles json-server-auth.

## API

Lectures directes prévues :

- `GET /clinics`
- `GET /doctors`
- `GET /availabilitySlots?doctorId=1&status=available`
- `GET /appointments?userId=1` avec le JWT du patient propriétaire

Routes métier protégées :

- `POST /api/book`
- `PATCH /api/appointments/:id/confirm`
- `PATCH /api/appointments/:id/refuse`
- `PATCH /api/appointments/:id/cancel`
- `GET /api/doctor/appointments`

`POST /api/book` est implémentée. Les autres actions restent des points
d’extension et peuvent répondre `501 Not Implemented` tant que leur issue n’est
pas livrée. Les mutations directes de `/appointments` et
`/availabilitySlots` répondent `405` : une action métier doit vérifier
l’identité, les statuts, la date et l’unicité du créneau dans un service
utilisant `app.db`.

## État du socle

Déjà en place : routage TanStack basé sur les fichiers, QueryClientProvider,
client API avec Bearer token, gestion globale des `401`, stockage de session,
guards patient/médecin, design system documenté, serveur authentifié,
permissions et données cohérentes.

Restent volontairement à implémenter : formulaires d'authentification, écrans et requêtes TanStack Query, mutations métier atomiques, agenda Jour/Semaine/Mois, tests des parcours et design final.

## Comptes de démonstration

Après installation, les comptes préchargés utilisent le mot de passe `Munganga2026!` :

- patient : `alice.patient@munganga.cg`
- médecin : `dr.makaya@munganga.cg`

Ne réutilisez pas ce secret de démonstration dans un environnement partagé.

## Vérifications

```bash
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

Les règles de contribution, les branches et le parcours des pull requests sont décrits dans `CONTRIBUTING.md`.
