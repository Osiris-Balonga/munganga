# Contribuer à Munganga

## Branches

- `main` contient uniquement une version stable et démontrable.
- `dev` reçoit les fonctionnalités validées du sprint.
- Chaque issue utilise une branche créée depuis `dev` : `feature/<issue>-<sujet>`, `fix/<issue>-<sujet>` ou `chore/<issue>-<sujet>`.
- Un hotfix exceptionnel part de `main`, cible `main`, puis `main` est resynchronisée vers `dev`.

## Pull requests

Une branche de travail cible toujours `dev`. Seules `dev` et les branches `hotfix/*` peuvent cibler `main`.

Avant d’ouvrir une pull request :

```bash
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

La description doit référencer l’issue avec `Closes #<numéro>`. Une autre personne relit la pull request. Les conversations doivent être résolues avant le squash merge.

## Commits

Utiliser un titre en anglais au format `type: description` ou `type(scope): description`. Exemples :

```text
feat(auth): add the patient login form
fix(booking): prevent duplicate slot requests
test(api): cover appointment cancellation
```
