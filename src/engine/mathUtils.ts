/**
 * Utilitários matemáticos e distribuições estocásticas.
 */

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Gera um número com distribuição normal N(mean, stdev^2) usando a transformada Box-Muller.
 */
export function normalRandom(mean: number = 0, stdev: number = 1): number {
  let u1 = Math.random();
  let u2 = Math.random();
  while (u1 === 0) u1 = Math.random(); // Evita log(0)
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * stdev;
}

/**
 * Retorna true com probabilidade p (0 a 1).
 */
export function chance(probability: number): boolean {
  return Math.random() < probability;
}

/**
 * Arredonda para N casas decimais.
 */
export function round(value: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
