import { Simulation } from '@/simulations/core/simulation';

export type MathSimulationConfig = {
  equation: string;
};

export class MathSimulation extends Simulation<MathSimulationConfig> {}
