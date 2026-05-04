export type SectionSimulation = 'mathematiques' | 'physique' | 'programmation-java';

export type EntreeSimulation = {
  description?: string;
  misEnAvant?: boolean;
  href: string;
  icon?: string;
  statut?: 'ferme' | 'pret' | 'bientot';
  tags?: string[];
  title: string;
};

function creerEntreesBientot(
  section: SectionSimulation,
  prefixe: string,
  debut: number,
  nombre: number
): EntreeSimulation[] {
  return Array.from({ length: nombre }, (_, index) => {
    const numero = debut + index;

    return {
      description: 'Nouvelle simulation en preparation.',
      href: `/(tabs)/${section}/${prefixe}-${numero}`,
      icon: 'progress-question',
      statut: 'bientot',
      tags: ['a-venir'],
      title: 'Bientot',
    };
  });
}

export const CATALOGUE_SIMULATIONS: Record<SectionSimulation, EntreeSimulation[]> = {
  mathematiques: [
    {
      description: "Observe la tangente et la pente en un point.",
      misEnAvant: true,
      href: '/(tabs)/mathematiques/derivees',
      icon: 'chart-line',
      statut: 'pret',
      tags: ['calcul', 'derivees', 'fonctions'],
      title: 'Derivees',
    },
    {
      description: 'Compare l aire et les sommes de Riemann.',
      href: '/(tabs)/mathematiques/integrales',
      icon: 'chart-bell-curve',
      statut: 'pret',
      tags: ['calcul', 'aires', 'riemann'],
      title: 'Integrales',
    },
    {
      description: 'Approche les fonctions par developpement local.',
      href: '/(tabs)/mathematiques/serie-taylor',
      icon: 'chart-timeline-variant',
      statut: 'pret',
      tags: ['analyse', 'series', 'approximations'],
      title: 'Serie de Taylor',
    },
    {
      description: 'Explore le comportement d une fonction aux bornes.',
      href: '/(tabs)/mathematiques/limites',
      icon: 'arrow-expand-horizontal',
      statut: 'pret',
      tags: ['analyse', 'fonctions', 'comportement'],
      title: 'Limites',
    },
    {
      description: 'Decompose un signal en frequences simples.',
      href: '/(tabs)/mathematiques/fourier',
      icon: 'sine-wave',
      statut: 'pret',
      tags: ['analyse', 'signaux', 'trigonometrie'],
      title: 'Fourier',
    },
    {
      description: 'Lis visuellement la direction des solutions.',
      href: '/(tabs)/mathematiques/champ-de-pentes',
      icon: 'arrow-decision',
      statut: 'pret',
      tags: ['equations diff', 'analyse', 'visualisation'],
      title: 'Champ de pentes',
    },
    {
      description: 'Observe norme et direction en chaque point.',
      href: '/(tabs)/mathematiques/champ-vectoriel',
      icon: 'vector-arrange-above',
      statut: 'ferme',
      tags: ['geometrie', 'vecteurs', 'visualisation'],
      title: 'Champ vectoriel',
    },
    {
      description: 'Etudie la convergence des suites de termes.',
      href: '/(tabs)/mathematiques/series',
      icon: 'sigma',
      statut: 'pret',
      tags: ['analyse', 'series', 'convergence'],
      title: 'Series',
    },
    {
      description: 'Nouvelle simulation en preparation.',
      href: '/(tabs)/mathematiques/mathematiques-9',
      icon: 'progress-question',
      statut: 'bientot',
      tags: ['a-venir'],
      title: 'Bientot',
    },
    {
      description: 'Autre simulation a venir bientot.',
      href: '/(tabs)/mathematiques/mathematiques-10',
      icon: 'progress-question',
      statut: 'bientot',
      tags: ['a-venir'],
      title: 'Bientot',
    },
    ...creerEntreesBientot('mathematiques', 'mathematiques', 11, 10),
  ],
  physique: [
    {
      description: 'Manipule masses et distance pour visualiser la loi de gravitation.',
      misEnAvant: true,
      href: '/(tabs)/physique/gravite',
      icon: 'orbit-variant',
      statut: 'pret',
      tags: ['mecanique', 'forces'],
      title: 'Gravite',
    },
    {
      description: 'Etudie les oscillations et la periode d un pendule.',
      href: '/(tabs)/physique/pendule',
      icon: 'metronome',
      statut: 'pret',
      tags: ['mecanique', 'energie', 'oscillations'],
      title: 'Pendule',
    },
    {
      description: 'Visualise les trajectoires balistiques et les lancers obliques.',
      href: '/(tabs)/physique/mouvement-projectile',
      icon: 'chart-timeline-variant',
      statut: 'pret',
      tags: ['mecanique', 'trajectoire', 'vecteurs'],
      title: 'Mouvement projectile',
    },
    {
      description: 'Lie deformation, rappel elastique et oscillations.',
      href: '/(tabs)/physique/ressort-loi-hooke',
      icon: 'source-branch',
      statut: 'pret',
      tags: ['mecanique', 'energie'],
      title: 'Ressort et loi de Hooke',
    },
    {
      description: 'Explore la rotation uniforme et les forces centripetes.',
      href: '/(tabs)/physique/mouvement-circulaire',
      icon: 'orbit-variant',
      statut: 'pret',
      tags: ['mecanique'],
      title: 'Mouvement circulaire',
    },
    {
      description: 'Represente les lignes de champ et les interactions magnetiques.',
      href: '/(tabs)/physique/champs-magnetiques',
      icon: 'magnet',
      statut: 'bientot',
      tags: ['electricite'],
      title: 'Champs magnetiques',
    },
    {
      description: 'Observe les charges, vecteurs et lignes de champ electrique.',
      href: '/(tabs)/physique/champs-electriques',
      icon: 'flash-outline',
      statut: 'bientot',
      tags: ['electricite'],
      title: 'Champs electriques',
    },
    {
      description: 'Visualise reflexion, refraction et parcours lumineux.',
      href: '/(tabs)/physique/optique-refraction',
      icon: 'glasses',
      statut: 'bientot',
      tags: ['ondes'],
      title: 'Optique et refraction',
    },
    {
      description: 'Etudie les orbites et les mouvements sous attraction centrale.',
      href: '/(tabs)/physique/mecanique-orbitale',
      icon: 'earth',
      statut: 'bientot',
      tags: ['mecanique'],
      title: 'Mecanique orbitale',
    },
    {
      description: 'Compare forces de contact et resistance au mouvement.',
      href: '/(tabs)/physique/frottement',
      icon: 'drag-variant',
      statut: 'bientot',
      tags: ['mecanique'],
      title: 'Frottement',
    },
    {
      description: 'Observe la conservation de l energie et de la quantite de mouvement.',
      href: '/(tabs)/physique/collisions-elastiques',
      icon: 'vector-intersection',
      statut: 'bientot',
      tags: ['mecanique', 'energie'],
      title: 'Collisions elastiques',
    },
    ...creerEntreesBientot('physique', 'physique', 12, 9),
  ],
  'programmation-java': [
    ...Array.from({ length: 20 }, (_, index) => ({
      description: 'Nouvelle simulation Java en preparation.',
      href: `/(tabs)/programmation-java/java-${index + 1}`,
      icon: 'code-braces',
      statut: 'bientot' as const,
      tags: ['a-venir'],
      title: 'Bientot',
    })),
  ],
};


