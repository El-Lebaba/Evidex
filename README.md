# Evidex

Evidex est une application educative interactive construite avec Expo et React Native. Elle regroupe des cours, un suivi de progression et des simulations pour les mathematiques, la physique et la programmation Java.

## Fonctionnalites

- Accueil avec acces rapide aux cours, aux simulations et au profil.
- Cours organises par matiere avec progression locale.
- Simulations interactives de calcul, de mecanique et de programmation.
- Profil avec niveau, XP, cours recents et succes.
- Parametres locaux, dont le mode sombre.

## Structure

- `app/` : routes Expo Router et ecrans principaux.
- `components/` : composants reutilisables.
- `features/` : ecrans metier, simulations et logique de presentation.
- `data/` : catalogue des cours.
- `db/` : stockage local et progression utilisateur.
- `constantes/` : constantes visuelles partagees.
- `hooks/` : hooks React locaux.

## Installation

```bash
npm install
```

## Lancement

```bash
npm run startlocal
```

## Verification

```bash
npm run lint
npx tsc --noEmit
```

