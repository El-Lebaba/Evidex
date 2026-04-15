export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed';

export abstract class Simulation<TConfig> {
  protected status: SimulationStatus = 'idle';

  protected constructor(
    public readonly id: string,
    public readonly name: string,
    protected config: TConfig
  ) {}

  getStatus(): SimulationStatus {
    return this.status;
  }

  getConfig(): TConfig {
    return this.config;
  }

  updateConfig(config: Partial<TConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  start() {
    this.status = 'running';
  }

  pause() {
    this.status = 'paused';
  }

  complete() {
    this.status = 'completed';
  }
}
