# Guide frontend

## Créer une route

Le chemin du fichier représente l’URL. Le plugin TanStack Router génère ensuite
`src/routeTree.gen.js`.

| Fichier                              | URL                       |
| ------------------------------------ | ------------------------- |
| `routes/index.jsx`                   | `/`                       |
| `routes/login.jsx`                   | `/login`                  |
| `routes/doctors/index.jsx`           | `/doctors`                |
| `routes/doctors/$doctorId/index.jsx` | `/doctors/:doctorId`      |
| `routes/doctors/$doctorId/book.jsx`  | `/doctors/:doctorId/book` |
| `routes/-shared/Example.jsx`         | aucune route              |

Une route reste légère :

```jsx
import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '../features/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return <LoginForm />
}
```

Pour protéger un groupe de pages, placer `beforeLoad` sur son `route.jsx` :

```jsx
export const Route = createFileRoute('/doctor')({
  beforeLoad: () => requireRole('doctor'),
  component: Outlet,
})
```

## Créer une feature

Structure cible :

```text
src/features/appointments/
├── appointmentsApi.js
├── appointmentQueries.js
├── AppointmentList.jsx
├── AppointmentList.test.jsx
└── index.js
```

- `*Api.js` décrit les appels HTTP du domaine ;
- `*Queries.js` contient les hooks TanStack Query ;
- les formulaires et comportements propres au domaine restent dans la feature ;
- `index.js` expose uniquement l’API publique de la feature.

Ne pas importer un fichier interne d’une autre feature. Importer depuis son
`index.js`.

## Choisir le bon composant

Avant de coder une interface :

1. ouvrir `/ui-kit` ;
2. chercher le composant et ses variantes ;
3. importer depuis `src/design-system/index.js` ou
   `src/components/domain/index.js` ;
4. créer un nouveau composant uniquement si aucune composition existante ne
   couvre le besoin.

| Besoin                                 | Emplacement                |
| -------------------------------------- | -------------------------- |
| Bouton, champ, dialogue, onglets       | `design-system`            |
| Carte médecin, clinique ou rendez-vous | `components/domain`        |
| Formulaire de connexion                | `features/auth`            |
| Liste et filtres de médecins           | `features/doctors`         |
| Assemblage de la page `/doctors`       | `routes/doctors/index.jsx` |

## Requêtes et états

- utiliser `apiClient` pour les appels HTTP ;
- utiliser TanStack Query pour le cache serveur ;
- gérer explicitement `loading`, `empty`, `error` et `success` ;
- utiliser `Skeleton`, `EmptyState` et `ErrorState` du design system ;
- invalider les clés de requête concernées après une mutation réussie.

## Accessibilité et responsive

- conserver les labels visibles des champs ;
- utiliser les primitives Base UI présentes plutôt que recréer un dialogue,
  menu ou select ;
- utiliser Lucide React pour les icônes décoratives avec `aria-hidden="true"` ;
- tester clavier, mobile étroit et bureau ;
- ne pas remplacer du texte important par une icône seule sans nom accessible.

## Vérification frontend

```bash
pnpm exec eslint src
pnpm format:check
pnpm build
```

Le build régénère l’arbre des routes et détecte les chemins ou imports invalides.
