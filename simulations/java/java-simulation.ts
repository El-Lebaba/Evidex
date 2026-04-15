import { Simulation } from '@/simulations/core/simulation';

export type JavaSimulationConfig = {
  exercise: string;
};

export class JavaSimulation extends Simulation<JavaSimulationConfig> {}
