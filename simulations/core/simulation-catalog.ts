import { Simulation } from '@/simulations/core/simulation';

export abstract class SimulationCatalog<TSimulation extends Simulation<unknown>> {
  protected readonly simulations: TSimulation[] = [];

  getAll() {
    return this.simulations;
  }

  register(simulation: TSimulation) {
    this.simulations.push(simulation);
  }
}
