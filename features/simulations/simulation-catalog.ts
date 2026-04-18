export type SimulationSection = 'math' | 'physics' | 'java-programming';

export type SimulationEntry = {
  href: string;
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
      href: '/(tabs)/math/derivatives',
      title: 'Derivees',
    },
    {
      href: '/(tabs)/math/integrals',
      title: 'Integrales',
    },
    ...createEntries('math', 'Math').slice(2),
  ],
  physics: createEntries('physics', 'Physics'),
  'java-programming': createEntries('java-programming', 'Java'),
};
