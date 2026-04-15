export type SectionKey = 'home' | 'math' | 'physics' | 'java-programming';

export type SectionContent = {
  title: string;
  description: string;
};

export const SECTION_CONTENT: Record<SectionKey, SectionContent> = {
  home: {
    title: 'Home',
    description: 'Select a section below to start building a simulation space.',
  },
  math: {
    title: 'Math',
    description: 'This page is ready for your mathematics equations and simulation work.',
  },
  physics: {
    title: 'Physiques',
    description: 'This page is ready for your physics simulations and related experiments.',
  },
  'java-programming': {
    title: 'Programmation Java',
    description: 'This page is ready for your Java programming simulations and exercises.',
  },
};
