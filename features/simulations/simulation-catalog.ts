export type SimulationSection = 'math' | 'physics' | 'java-programming';

export type SimulationEntry = {
  description?: string;
  featured?: boolean;
  href: string;
  icon?: string;
  status?: 'closed' | 'ready' | 'soon';
  tags?: string[];
  title: string;
};

function createSoonEntries(
  section: SimulationSection,
  prefix: string,
  start: number,
  count: number
): SimulationEntry[] {
  return Array.from({ length: count }, (_, index) => {
    const number = start + index;

    return {
      description: 'Nouvelle simulation en preparation.',
      href: `/(tabs)/${section}/${prefix}-${number}`,
      icon: 'progress-question',
      status: 'soon',
      tags: ['a-venir'],
      title: 'Bientot',
    };
  });
}

export const SIMULATION_CATALOG: Record<SimulationSection, SimulationEntry[]> = {
  math: [
    {
      description: "Observe la tangente et la pente en un point.",
      featured: true,
      href: '/(tabs)/math/derivatives',
      icon: 'chart-line',
      status: 'ready',
      tags: ['calcul', 'derivees', 'fonctions'],
      title: 'Derivees',
    },
    {
      description: 'Compare l aire et les sommes de Riemann.',
      href: '/(tabs)/math/integrals',
      icon: 'chart-bell-curve',
      status: 'ready',
      tags: ['calcul', 'aires', 'riemann'],
      title: 'Integrales',
    },
    {
      description: 'Approche les fonctions par developpement local.',
      href: '/(tabs)/math/serie-taylor',
      icon: 'chart-timeline-variant',
      status: 'ready',
      tags: ['analyse', 'series', 'approximations'],
      title: 'Serie de Taylor',
    },
    {
      description: 'Explore le comportement d une fonction aux bornes.',
      href: '/(tabs)/math/limites',
      icon: 'arrow-expand-horizontal',
      status: 'ready',
      tags: ['analyse', 'fonctions', 'comportement'],
      title: 'Limites',
    },
    {
      description: 'Decompose un signal en frequences simples.',
      href: '/(tabs)/math/fourier',
      icon: 'sine-wave',
      status: 'ready',
      tags: ['analyse', 'signaux', 'trigonometrie'],
      title: 'Fourier',
    },
    {
      description: 'Lis visuellement la direction des solutions.',
      href: '/(tabs)/math/champ-de-pentes',
      icon: 'arrow-decision',
      status: 'ready',
      tags: ['equations diff', 'analyse', 'visualisation'],
      title: 'Champ de pentes',
    },
    {
      description: 'Observe norme et direction en chaque point.',
      href: '/(tabs)/math/champ-vectoriel',
      icon: 'vector-arrange-above',
      status: 'closed',
      tags: ['geometrie', 'vecteurs', 'visualisation'],
      title: 'Champ vectoriel',
    },
    {
      description: 'Etudie la convergence des suites de termes.',
      href: '/(tabs)/math/series',
      icon: 'sigma',
      status: 'ready',
      tags: ['analyse', 'series', 'convergence'],
      title: 'Series',
    },
    {
      description: 'Nouvelle simulation en preparation.',
      href: '/(tabs)/math/math-9',
      icon: 'progress-question',
      status: 'soon',
      tags: ['a-venir'],
      title: 'Bientot',
    },
    {
      description: 'Autre simulation a venir bientot.',
      href: '/(tabs)/math/math-10',
      icon: 'progress-question',
      status: 'soon',
      tags: ['a-venir'],
      title: 'Bientot',
    },
    ...createSoonEntries('math', 'math', 11, 10),
  ],
  physics: [
    {
      description: 'Manipule masses et distance pour visualiser la loi de gravitation.',
      featured: true,
      href: '/(tabs)/physics/gravity',
      icon: 'orbit-variant',
      status: 'ready',
      tags: ['mecanique', 'forces'],
      title: 'Gravite',
    },
    {
      description: 'Etudie les oscillations et la periode d un pendule.',
      href: '/(tabs)/physics/pendulum',
      icon: 'metronome',
      status: 'ready',
      tags: ['mecanique', 'energie', 'oscillations'],
      title: 'Pendule',
    },
    {
      description: 'Visualise les trajectoires balistiques et les lancers obliques.',
      href: '/(tabs)/physics/projectile-motion',
      icon: 'chart-timeline-variant',
      status: 'ready',
      tags: ['mecanique', 'trajectoire', 'vecteurs'],
      title: 'Mouvement projectile',
    },
    {
      description: 'Lie deformation, rappel elastique et oscillations.',
      href: '/(tabs)/physics/spring-hookes-law',
      icon: 'source-branch',
      status: 'ready',
      tags: ['mecanique', 'energie'],
      title: 'Ressort et loi de Hooke',
    },
    {
      description: 'Explore la rotation uniforme et les forces centripetes.',
      href: '/(tabs)/physics/circular-motion',
      icon: 'orbit-variant',
      status: 'ready',
      tags: ['mecanique'],
      title: 'Mouvement circulaire',
    },
    {
      description: 'Represente les lignes de champ et les interactions magnetiques.',
      href: '/(tabs)/physics/magnetic-fields',
      icon: 'magnet',
      status: 'soon',
      tags: ['electricite'],
      title: 'Champs magnetiques',
    },
    {
      description: 'Observe les charges, vecteurs et lignes de champ electrique.',
      href: '/(tabs)/physics/electric-fields',
      icon: 'flash-outline',
      status: 'soon',
      tags: ['electricite'],
      title: 'Champs electriques',
    },
    {
      description: 'Visualise reflexion, refraction et parcours lumineux.',
      href: '/(tabs)/physics/optics-refraction',
      icon: 'glasses',
      status: 'soon',
      tags: ['ondes'],
      title: 'Optique et refraction',
    },
    {
      description: 'Etudie les orbites et les mouvements sous attraction centrale.',
      href: '/(tabs)/physics/orbital-mechanics',
      icon: 'earth',
      status: 'soon',
      tags: ['mecanique'],
      title: 'Mecanique orbitale',
    },
    {
      description: 'Compare forces de contact et resistance au mouvement.',
      href: '/(tabs)/physics/friction',
      icon: 'drag-variant',
      status: 'soon',
      tags: ['mecanique'],
      title: 'Frottement',
    },
    {
      description: 'Observe la conservation de l energie et de la quantite de mouvement.',
      href: '/(tabs)/physics/elastic-collisions',
      icon: 'vector-intersection',
      status: 'soon',
      tags: ['mecanique', 'energie'],
      title: 'Collisions elastiques',
    },
    ...createSoonEntries('physics', 'physics', 12, 9),
  ],
  'java-programming': [
    ...Array.from({ length: 20 }, (_, index) => ({
      description: 'Nouvelle simulation Java en preparation.',
      href: `/(tabs)/java-programming/java-${index + 1}`,
      icon: 'code-braces',
      status: 'soon' as const,
      tags: ['a-venir'],
      title: 'Bientot',
    })),
  ],
};
