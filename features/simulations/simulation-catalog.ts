export type SimulationSection = 'math' | 'physics' | 'java-programming';

export type SimulationEntry = {
  category?: 'calcul' | 'algebre' | 'analyse' | 'a-venir';
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
      description: "Observe la pente locale, la tangente et l evolution de f'(x0).",
      featured: true,
      href: '/(tabs)/math/derivatives',
      icon: 'chart-bell-curve-cumulative',
      status: 'ready',
      title: 'Derivees',
    },
    {
      category: 'calcul',
      description: "Compare l aire sous la courbe avec les approximations de Riemann.",
      href: '/(tabs)/math/integrals',
      icon: 'chart-areaspline',
      status: 'ready',
      title: 'Integrales',
    },
    {
      category: 'analyse',
      description: 'Simulation en preparation pour approfondir les fonctions et leurs variations.',
      href: '/(tabs)/math/math-3',
      icon: 'function-variant',
      status: 'soon',
      title: 'Math 3',
    },
    {
      category: 'algebre',
      description: 'Module a venir pour explorer les transformations et les structures algebriques.',
      href: '/(tabs)/math/math-4',
      icon: 'vector-polyline',
      status: 'soon',
      title: 'Math 4',
    },
    {
      category: 'analyse',
      description: 'Simulation a venir avec une approche visuelle orientee etude et intuition.',
      href: '/(tabs)/math/math-5',
      icon: 'chart-timeline-variant',
      status: 'soon',
      title: 'Math 5',
    },
    {
      category: 'calcul',
      description: 'Espace reserve pour une future activite de calcul interactif.',
      href: '/(tabs)/math/math-6',
      icon: 'calculator-variant-outline',
      status: 'soon',
      title: 'Math 6',
    },
    {
      category: 'algebre',
      description: 'Simulation a venir pour travailler des notions cles avec support visuel.',
      href: '/(tabs)/math/math-7',
      icon: 'sigma',
      status: 'soon',
      title: 'Math 7',
    },
    {
      category: 'analyse',
      description: 'Module en attente de contenu, pense pour un apprentissage progressif.',
      href: '/(tabs)/math/math-8',
      icon: 'chart-line-variant',
      status: 'soon',
      title: 'Math 8',
    },
    {
      category: 'algebre',
      description: 'Future simulation pour manipuler des objets mathematiques pas a pas.',
      href: '/(tabs)/math/math-9',
      icon: 'shape-outline',
      status: 'soon',
      title: 'Math 9',
    },
    {
      category: 'a-venir',
      description: 'Dernier emplacement reserve pour completer la collection de simulations.',
      href: '/(tabs)/math/math-10',
      icon: 'dots-grid',
      status: 'soon',
      title: 'Math 10',
    },
  ],
  physics: createEntries('physics', 'Physics'),
  'java-programming': createEntries('java-programming', 'Java'),
};
