export const GRAVITATIONAL_CONSTANT = 6.67430e-11;
export const EARTH_GRAVITY = 9.81;

export function calculateGravitationalForce(mass1Kg: number, mass2Kg: number, distanceM: number) {
  if (distanceM <= 0) {
    return 0;
  }

  return (GRAVITATIONAL_CONSTANT * mass1Kg * mass2Kg) / (distanceM * distanceM);
}

export function formatForceNewtons(force: number) {
  if (!Number.isFinite(force)) {
    return '--';
  }

  if (force !== 0 && Math.abs(force) < 0.001) {
    return `${force.toExponential(2).replace('e', ' x 10^')} N`;
  }

  return `${force.toFixed(3)} N`;
}

export function formatForceNewtonsLatex(force: number) {
  if (!Number.isFinite(force)) {
    return '--';
  }

  if (force !== 0 && Math.abs(force) < 0.001) {
    const [mantissa, exponent] = force.toExponential(2).split('e');

    return `${mantissa}\\times10^{${Number(exponent)}}\\ \\text{N}`;
  }

  return `${force.toFixed(3)}\\ \\text{N}`;
}

export function formatScientificLatex(value: number, unit: string) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  if (value !== 0 && (Math.abs(value) >= 10000 || Math.abs(value) < 0.001)) {
    const [mantissa, exponent] = value.toExponential(2).split('e');

    return `${mantissa}\\times10^{${Number(exponent)}}\\ ${unit}`;
  }

  return `${value.toFixed(3)}\\ ${unit}`;
}

export function formatScientificLatexNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  if (value !== 0 && (Math.abs(value) >= 10000 || Math.abs(value) < 0.001)) {
    const [mantissa, exponent] = value.toExponential(2).split('e');

    return `${mantissa}\\times10^{${Number(exponent)}}`;
  }

  return value.toFixed(3);
}

export function formatScientificNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  if (value !== 0 && (Math.abs(value) >= 10000 || Math.abs(value) < 0.001)) {
    return value.toExponential(2).replace('e', ' x 10^');
  }

  return value.toFixed(1);
}

export function formatCompactScientific(value: number) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  if (value !== 0 && (Math.abs(value) >= 10000 || Math.abs(value) < 0.001)) {
    const [mantissa, exponent] = value.toExponential(2).split('e');

    return `${mantissa}e${Number(exponent)}`;
  }

  return value.toFixed(3);
}

export function formatBodyWeightRatio(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return 'N/A';
  }

  if (value !== 0 && (Math.abs(value) >= 10000 || Math.abs(value) < 0.001)) {
    const [mantissa, exponent] = value.toExponential(2).split('e');

    return `${mantissa} x 10^${Number(exponent)} x body weight`;
  }

  return `${value.toFixed(3)} x body weight`;
}

export function formatBodyWeightRatioLatex(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return '\\text{N/A}';
  }

  if (value !== 0 && (Math.abs(value) >= 10000 || Math.abs(value) < 0.001)) {
    const [mantissa, exponent] = value.toExponential(2).split('e');

    return `${mantissa}\\times10^{${Number(exponent)}}\\times\\text{ poids}`;
  }

  return `${value.toFixed(3)}\\times\\text{ poids}`;
}
