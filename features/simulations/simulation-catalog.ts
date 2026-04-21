export type SimulationSection = 'math' | 'physics' | 'java-programming';

export type SimulationEntry = {
  description?: string;
  featured?: boolean;
  href: string;
  icon?: string;
  status?: 'ready' | 'soon';
  tags?: string[];
  title: string;
};

function createEntries(section: SimulationSection, prefix: string): SimulationEntry[] {
  return Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;

    return {
      href: `/(tabs)/${section}/${prefix.toLowerCase()}-${number}`,
      title: `${prefix} ${number}`,
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
      status: 'ready',
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
  ],
  physics: [
    {
      description: 'Simulation de physique en preparation.',
      featured: true,
      href: '/(tabs)/physics/physics-1',
      icon: 'orbit-variant',
      status: 'soon',
      tags: ['mecanique'],
      title: 'Physique 1',
    },
    {
      description: 'Explore mouvements, forces et trajectoires.',
      href: '/(tabs)/physics/physics-2',
      icon: 'axis-arrow',
      status: 'soon',
      tags: ['mecanique'],
      title: 'Physique 2',
    },
    {
      description: 'Visualise energie, travail et transferts.',
      href: '/(tabs)/physics/physics-3',
      icon: 'lightning-bolt-outline',
      status: 'soon',
      tags: ['energie'],
      title: 'Physique 3',
    },
    {
      description: 'Observe ondes, periodes et vibrations.',
      href: '/(tabs)/physics/physics-4',
      icon: 'sine-wave',
      status: 'soon',
      tags: ['ondes'],
      title: 'Physique 4',
    },
    {
      description: 'Manipule courant, tension et circuits.',
      href: '/(tabs)/physics/physics-5',
      icon: 'flash-outline',
      status: 'soon',
      tags: ['electricite'],
      title: 'Physique 5',
    },
    {
      description: 'Module de physique appliquee a venir.',
      href: '/(tabs)/physics/physics-6',
      icon: 'vector-line',
      status: 'soon',
      tags: ['mecanique'],
      title: 'Physique 6',
    },
    {
      description: 'Approfondis la propagation des ondes.',
      href: '/(tabs)/physics/physics-7',
      icon: 'waveform',
      status: 'soon',
      tags: ['ondes'],
      title: 'Physique 7',
    },
    {
      description: 'Represente champs et interactions electriques.',
      href: '/(tabs)/physics/physics-8',
      icon: 'magnet',
      status: 'soon',
      tags: ['electricite'],
      title: 'Physique 8',
    },
    {
      description: 'Nouvelle simulation de physique a venir.',
      href: '/(tabs)/physics/physics-9',
      icon: 'atom-variant',
      status: 'soon',
      tags: ['a-venir'],
      title: 'Bientot',
    },
    {
      description: 'Autre simulation de physique a venir.',
      href: '/(tabs)/physics/physics-10',
      icon: 'molecule',
      status: 'soon',
      tags: ['a-venir'],
      title: 'Bientot',
    },
  ],
  'java-programming': createEntries('java-programming', 'Java'),
};
