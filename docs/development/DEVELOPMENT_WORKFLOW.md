# Traiter une issue

## 1. Comprendre le périmètre

- lire les critères d’acceptation ;
- identifier les routes, features et services concernés ;
- vérifier le UI kit et les composants existants ;
- demander une clarification avant de modifier un contrat non mentionné.

## 2. Créer la branche

```bash
git switch dev
git pull --ff-only origin dev
git switch -c feature/<issue>-<sujet>
```

Utiliser `fix/` pour une correction et `chore/` pour une tâche de documentation
ou de maintenance sans fonctionnalité utilisateur.

## 3. Implémenter verticalement

Préférer une tranche complète et testable :

```text
route → feature → API → service → test
```

Éviter de créer toutes les pages, puis tous les appels API, puis tous les tests
dans des PR séparées sans résultat démontrable.

## 4. Vérifier localement

```bash
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

Pour une interface, vérifier aussi :

- navigation clavier ;
- largeur mobile et bureau ;
- états chargement, vide, erreur et succès ;
- absence d’erreur dans la console ;
- réutilisation du design system.

## 5. Commits

Les titres sont en anglais et suivent Conventional Commits :

```text
feat(auth): add patient login form
fix(booking): preserve patient identity
test(appointments): cover cancellation ownership
docs: explain frontend feature boundaries
```

## 6. Pull request

La PR cible `dev`, référence l’issue avec `Closes #<numéro>` et explique :

- ce qui change ;
- comment tester ;
- les décisions ou limites ;
- les captures utiles pour une interface.

Checklist avant review :

- [ ] la route reste légère ;
- [ ] la logique est placée dans la bonne feature ou le bon service ;
- [ ] aucun composant du UI kit n’a été dupliqué ;
- [ ] les états et permissions sont couverts ;
- [ ] les tests détectent réellement la régression visée ;
- [ ] les cinq commandes de vérification passent ;
- [ ] la documentation est mise à jour si une convention change.

Une autre personne approuve la PR. Les conversations sont résolues avant le
squash merge.
