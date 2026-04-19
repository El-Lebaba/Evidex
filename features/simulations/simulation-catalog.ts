export type SimulationSection = 'math' | 'physics' | 'java-programming';

export type SimulationEntry = {
  category?: string;
  description?: string;
  featured?: boolean;
  href: string;
  icon?: string;
  status?: 'ready' | 'soon';
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
      category: 'calcul',
      description: "Observe la tangente et la pente en un point.",
      featured: true,
      href: '/(tabs)/math/derivatives',
      icon: 'chart-line',
      status: 'ready',
      title: 'Derivees',
    },
    {
      category: 'calcul',
      description: 'Compare l aire et les sommes de Riemann.',
      href: '/(tabs)/math/integrals',
      icon: 'chart-bell-curve',
      status: 'ready',
      title: 'Integrales',
    },
    {
      category: 'analyse',
      description: 'Approche les fonctions par developpement local.',
      href: '/(tabs)/math/serie-taylor',
      icon: 'chart-timeline-variant',
      status: 'soon',
      title: 'Serie de Taylor',
    },
    {
      category: 'algebre',
      description: 'Explore le comportement d une fonction aux bornes.',
      href: '/(tabs)/math/limites',
      icon: 'arrow-expand-horizontal',
      status: 'soon',
      title: 'Limites',
    },
    {
      category: 'analyse',
      description: 'Decompose un signal en frequences simples.',
      href: '/(tabs)/math/fourier',
      icon: 'sine-wave',
      status: 'soon',
      title: 'Fourier',
    },
    {
      category: 'calcul',
      description: 'Lis visuellement la direction des solutions.',
      href: '/(tabs)/math/champ-de-pentes',
      icon: 'arrow-decision',
      status: 'soon',
      title: 'Champ de pentes',
    },
    {
      category: 'algebre',
      description: 'Observe norme et direction en chaque point.',
      href: '/(tabs)/math/champ-vectoriel',
      icon: 'vector-arrange-above',
      status: 'soon',
      title: 'Champ vectoriel',
    },
    {
      category: 'analyse',
      description: 'Etudie la convergence des suites de termes.',
      href: '/(tabs)/math/series',
      icon: 'sigma',
      status: 'soon',
      title: 'Series',
    },
    {
      category: 'algebre',
      description: 'Nouvelle simulation en preparation.',
      href: '/(tabs)/math/math-9',
      icon: 'progress-question',
      status: 'soon',
      title: 'Bientot',
    },
    {
      category: 'a-venir',
      description: 'Autre simulation a venir bientot.',
      href: '/(tabs)/math/math-10',
      icon: 'progress-question',
      status: 'soon',
      title: 'Bientot',
    },
  ],
  physics: [
    {
      category: 'mecanique',
      description: 'Simulation de physique en preparation.',
      featured: true,
      href: '/(tabs)/physics/physics-1',
      icon: 'orbit-variant',
      status: 'soon',
      title: 'Physique 1',
    },
    {
      category: 'mecanique',
      description: 'Explore mouvements, forces et trajectoires.',
      href: '/(tabs)/physics/physics-2',
      icon: 'axis-arrow',
      status: 'soon',
      title: 'Physique 2',
    },
    {
      category: 'energie',
      description: 'Visualise energie, travail et transferts.',
      href: '/(tabs)/physics/physics-3',
      icon: 'lightning-bolt-outline',
      status: 'soon',
      title: 'Physique 3',
    },
    {
      category: 'ondes',
      description: 'Observe ondes, periodes et vibrations.',
      href: '/(tabs)/physics/physics-4',
      icon: 'sine-wave',
      status: 'soon',
      title: 'Physique 4',
    },
    {
      category: 'electricite',
      description: 'Manipule courant, tension et circuits.',
      href: '/(tabs)/physics/physics-5',
      icon: 'flash-outline',
      status: 'soon',
      title: 'Physique 5',
    },
    {
      category: 'mecanique',
      description: 'Module de physique appliquee a venir.',
      href: '/(tabs)/physics/physics-6',
      icon: 'vector-line',
      status: 'soon',
      title: 'Physique 6',
    },
    {
      category: 'ondes',
      description: 'Approfondis la propagation des ondes.',
      href: '/(tabs)/physics/physics-7',
      icon: 'waveform',
      status: 'soon',
      title: 'Physique 7',
    },
    {
      category: 'electricite',
      description: 'Represente champs et interactions electriques.',
      href: '/(tabs)/physics/physics-8',
      icon: 'magnet',
      status: 'soon',
      title: 'Physique 8',
    },
    {
      category: 'a-venir',
      description: 'Nouvelle simulation de physique a venir.',
      href: '/(tabs)/physics/physics-9',
      icon: 'atom-variant',
      status: 'soon',
      title: 'Bientot',
    },
    {
      category: 'a-venir',
      description: 'Autre simulation de physique a venir.',
      href: '/(tabs)/physics/physics-10',
      icon: 'molecule',
      status: 'soon',
      title: 'Bientot',
    },
  ],
  'java-programming': createEntries('java-programming', 'Java'),
};
