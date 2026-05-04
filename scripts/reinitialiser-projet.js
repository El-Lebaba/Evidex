#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const racine = process.cwd();
const dossiersExistants = ['app', 'components', 'hooks', 'constantes', 'scripts'];
const dossierExemple = 'app-exemple';
const nouveauDossierApp = 'app';
const cheminDossierExemple = path.join(racine, dossierExemple);

const contenuIndex = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Modifie app/index.tsx pour changer cet ecran.</Text>
    </View>
  );
}
`;

const contenuDisposition = `import { Stack } from "expo-router";

export default function DispositionRacine() {
  return <Stack />;
}
`;

const lecteur = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const deplacerDossiers = async (reponseUtilisateur) => {
  try {
    if (reponseUtilisateur === 'o') {
      await fs.promises.mkdir(cheminDossierExemple, { recursive: true });
      console.log(`Dossier /${dossierExemple} cree.`);
    }

    for (const dossier of dossiersExistants) {
      const cheminActuel = path.join(racine, dossier);
      if (fs.existsSync(cheminActuel)) {
        if (reponseUtilisateur === 'o') {
          const nouveauChemin = path.join(racine, dossierExemple, dossier);
          await fs.promises.rename(cheminActuel, nouveauChemin);
          console.log(`/${dossier} deplace vers /${dossierExemple}/${dossier}.`);
        } else {
          await fs.promises.rm(cheminActuel, { recursive: true, force: true });
          console.log(`/${dossier} supprime.`);
        }
      } else {
        console.log(`/${dossier} introuvable, passage au suivant.`);
      }
    }

    const cheminNouvelleApp = path.join(racine, nouveauDossierApp);
    await fs.promises.mkdir(cheminNouvelleApp, { recursive: true });
    console.log('\nNouveau dossier /app cree.');

    const cheminIndex = path.join(cheminNouvelleApp, 'index.tsx');
    await fs.promises.writeFile(cheminIndex, contenuIndex);
    console.log('app/index.tsx cree.');

    const cheminDisposition = path.join(cheminNouvelleApp, '_layout.tsx');
    await fs.promises.writeFile(cheminDisposition, contenuDisposition);
    console.log('app/_layout.tsx cree.');

    console.log('\nReinitialisation terminee. Prochaines etapes :');
    console.log(
      `1. Lance \`npx expo start\` pour demarrer le serveur de developpement.\n2. Modifie app/index.tsx pour changer l'ecran principal.${
        reponseUtilisateur === 'o'
          ? `\n3. Supprime /${dossierExemple} quand tu n'en as plus besoin.`
          : ''
      }`,
    );
  } catch (erreur) {
    console.error(`Erreur pendant l'execution du script : ${erreur.message}`);
  }
};

lecteur.question(
  'Veux-tu deplacer les fichiers existants vers /app-exemple au lieu de les supprimer ? (O/n) : ',
  (reponse) => {
    const reponseUtilisateur = reponse.trim().toLowerCase() || 'o';
    if (reponseUtilisateur === 'o' || reponseUtilisateur === 'n') {
      deplacerDossiers(reponseUtilisateur).finally(() => lecteur.close());
    } else {
      console.log("Reponse invalide. Entre 'O' ou 'N'.");
      lecteur.close();
    }
  },
);
