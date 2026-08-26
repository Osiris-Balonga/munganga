# Architecture du projet

## Objectif

Munganga sépare les URL, les comportements métier, les composants partagés et
l’infrastructure. Une page doit rester lisible sans connaître les détails de
l’API ou du stockage de session.

```text
route → feature → lib
      ↘ composant métier → design system
API route → middleware → service → db.json
```

## Responsabilité des dossiers

| Dossier                  | Responsabilité                                                        | Ne doit pas contenir                    |
| ------------------------ | --------------------------------------------------------------------- | --------------------------------------- |
| `src/routes/`            | URL, layout, guard, loader et assemblage de page                      | logique métier volumineuse, client HTTP |
| `src/features/`          | comportement d’un domaine : hooks, formulaires, requêtes et mutations | primitives graphiques génériques        |
| `src/components/domain/` | cartes et présentations métier partagées par plusieurs features       | appels HTTP, gestion de route           |
| `src/design-system/`     | tokens et composants visuels génériques                               | règles patient, médecin ou rendez-vous  |
| `src/lib/`               | infrastructure partagée : API client, session, Query Client           | interface propre à une feature          |
| `server/routes/`         | adaptation HTTP et validation de l’identité                           | logique métier détaillée                |
| `server/services/`       | règles métier et accès à `app.db`                                     | objets `request` ou `response`          |
| `tests/`                 | contrats, parcours HTTP et non-régressions                            | données modifiant le vrai `db.json`     |

## Sens des dépendances

Les dépendances vont du spécifique vers le générique :

```text
routes ────────→ features ────────→ lib
  │                  │
  └──────────────→ components/domain ─────→ design-system
```

Règles :

- `design-system` ne dépend d’aucune feature ;
- une feature ne dépend jamais d’une route ;
- une route peut assembler plusieurs features ;
- les composants métier reçoivent leurs données par propriétés ;
- tous les appels HTTP frontend passent par `src/lib/api/apiClient.js` ;
- les routes backend appellent un service au lieu de modifier directement la
  base.

## Routage

TanStack Router génère l’arbre depuis `src/routes`. Le fichier
`src/routeTree.gen.js` est généré automatiquement : il ne doit jamais être
modifié à la main.

```text
src/routes/
├── __root.jsx
├── index.jsx
├── login.jsx
├── ui-kit.jsx
├── doctors/
│   ├── route.jsx
│   ├── index.jsx
│   └── $doctorId/
│       ├── route.jsx
│       ├── index.jsx
│       └── book.jsx
└── -ui-kit/              # fichiers colocaux exclus de l’arbre des routes
```

Le préfixe `-` exclut un fichier ou dossier de la génération. Il sert à
colocaliser les éléments qui appartiennent à une route sans créer une URL.

## Frontend et API

Exemple de parcours :

```text
src/routes/login.jsx
  → src/features/auth/LoginForm.jsx
  → src/features/auth/authApi.js
  → src/lib/api/apiClient.js
  → POST /login
```

L’authentification conserve le token dans `src/lib/auth`. Les pages protégées
déclarent leur guard dans une route layout afin de protéger tous leurs enfants.

## Décisions à ne pas contourner

- JavaScript et JSX uniquement ; ne pas introduire TypeScript isolément.
- `pnpm` est le gestionnaire de paquets du dépôt.
- Base UI fournit les comportements accessibles ; il reste encapsulé par le
  design system.
- Lucide React est la bibliothèque d’icônes ; ne pas utiliser d’émojis comme
  icônes d’interface.
- Les mutations de rendez-vous et de créneaux passent par `/api/*`, jamais par
  une écriture CRUD directe.
