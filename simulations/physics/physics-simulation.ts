import { Simulation } from '@/simulations/core/simulation';

export type PhysicsSimulationConfig = {
  scenario: string;
};

export class PhysicsSimulation extends Simulation<PhysicsSimulationConfig> {}
