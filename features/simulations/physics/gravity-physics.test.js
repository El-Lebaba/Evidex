import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateGravitationalForce } from './gravity-physics.ts';

test('calculates Newtonian gravitational force in SI units', () => {
  const force = calculateGravitationalForce(80, 80, 182);

  assert.ok(Math.abs(force - 1.29e-11) < 0.01e-11);
});
