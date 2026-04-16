export type SimulationSection = 'math' | 'physics' | 'java-programming';

export type SimulationEntry = {
  title: string;
  href: string;
};

function createEntries(section: SimulationSection, prefix: string): SimulationEntry[] {
  return Array.from({ length: 10 }, (_, index) => {
    const number = index + 1;

    return {
      title: `${prefix} ${number}`,
      href: `/(tabs)/${section}/${prefix.toLowerCase()}-${number}`,
    };
  });
}

export const SIMULATION_CATALOG: Record<SimulationSection, SimulationEntry[]> = {
  math: [
    {
      title: 'Dérivées',
      href: '/(tabs)/math/derivatives',
    },
    ...createEntries('math', 'Math').slice(1),
  ],
  physics: createEntries('physics', 'Physics'),
  'java-programming': createEntries('java-programming', 'Java'),
};
