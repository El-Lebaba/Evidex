import { useEffect, useState } from 'react';
import { useColorScheme as useSchemaCouleurRN } from 'react-native';

/**
 * Pour le rendu statique, cette valeur doit etre recalculee cote client sur le web.
 */
export function useSchemaCouleur() {
  const [estHydrate, definirEstHydrate] = useState(false);

  useEffect(() => {
    definirEstHydrate(true);
  }, []);

  const schemaCouleur = useSchemaCouleurRN();

  if (estHydrate) {
    return schemaCouleur;
  }

  return 'light';
}
