# Design system Munganga

Ce dossier contient la référence d’interface commune aux parcours visiteur, patient et médecin. La page locale `/ui-kit` permet de contrôler visuellement les composants et leurs états.

## Principes

- Utiliser les variables de `tokens.css`. Ne pas ajouter de couleur, rayon ou ombre directement dans un composant métier.
- Réutiliser les primitives exportées par `src/design-system/index.js` avant de créer un nouveau contrôle.
- Utiliser Base UI pour les interactions qui exigent une gestion du clavier, du focus ou des superpositions. Le style reste défini par Munganga en CSS.
- Conserver une cible interactive minimale de 44 × 44 px.
- Préférer une variante explicite à une copie du composant. Une nouvelle variante doit correspondre à un usage présent dans plusieurs écrans.

## Architecture

```text
src/
├── design-system/
│   ├── tokens.css            Couleurs, typographie, espaces et mouvements
│   ├── foundations.css       Normalisation et styles globaux
│   ├── components.css        Primitives visuelles et Base UI
│   └── components/           Boutons, champs, sélecteurs, onglets et états
└── components/
    ├── domain/               Médecins, cliniques et rendez-vous
    └── navigation/           En-têtes et navigation mobile par rôle
```

Les imports applicatifs doivent passer par les fichiers `index.js` quand ils existent :

```jsx
import { Button, SelectField, StatusBadge } from '../design-system'
import { DoctorCard, AppointmentCard } from '../components/domain'
```

## Composants unifiés

### Annuaire

- `DoctorCard` : `standard`, `compact`, `featured`.
- `ClinicCard` : `standard`, `compact`.
- `DoctorIdentity`, `InitialsAvatar`, `LocationMeta` : briques communes d’identité et de métadonnées.

Les cartes médecin et clinique partagent la même grammaire visuelle mais restent deux composants. Leurs données et leur évolution métier ne sont pas identiques.

### Rendez-vous

- `AppointmentCard` représente le rendez-vous vu par le patient.
- `RequestCard` représente une demande à traiter par le médecin.
- `ScheduleEvent` représente un événement dans l’agenda.
- `StatusBadge` constitue leur langage d’état commun.

Ces trois composants ne doivent pas être fusionnés : leurs actions, leur densité et leur intention sont différentes.

### Navigation

- `DesktopHeader` affiche une navigation horizontale adaptée au rôle.
- `MobileTopBar` et `MobileBottomNav` remplacent l’en-tête sur mobile.
- `AccountMenu` contient le changement de mode patient/médecin. Le parcours médecin n’utilise pas de barre latérale.

## Base UI

Base UI fournit uniquement les comportements accessibles des composants complexes. Le projet l’utilise actuellement pour les boutons, champs, menus, sélecteurs, onglets, cases à cocher, interrupteurs et boîtes de dialogue. Il ne faut pas ajouter Radix UI en parallèle : deux bibliothèques de primitives créeraient des conventions de focus, de portail et d’état concurrentes.

Un composant simple purement visuel, comme une carte ou un badge, reste un composant Munganga sans primitive externe.

## Ajouter un composant

1. Vérifier qu’aucun composant existant ne couvre l’usage avec une petite composition.
2. Identifier au moins trois occurrences ou un comportement accessible complexe qui justifie l’extraction.
3. Définir l’API avec des propriétés métier, pas avec une suite de drapeaux de présentation.
4. Ajouter tous les états pertinents à `/ui-kit` : normal, survol, focus, désactivé, chargement, vide ou erreur selon le cas.
5. Vérifier le clavier, le mobile et `prefers-reduced-motion`.
