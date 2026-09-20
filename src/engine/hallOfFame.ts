import { round } from './mathUtils';

export interface HallOfFameInputs {
  heightInches: number;
  championships: number;
  leaderboardPts: number;
  peakWS: number;
  allStarSelections: number;
}

/**
 * Modelo oficial de regressão logística do Basketball Reference para probabilidade de entrada no Hall da Fama.
 *
 * z = -0.20303 - (0.14203 * Height) + (0.80573 * Championships) + (0.01594 * LeaderboardPts) + (0.41568 * PeakWS) + (1.02443 * AllStarSelections)
 * P(HoF) = 1 / (1 + exp(-z))
 */
export function calculateHallOfFameProbability(inputs: HallOfFameInputs): {
  probability: number;
  isInducted: boolean;
  zScore: number;
} {
  const { heightInches, championships, leaderboardPts, peakWS, allStarSelections } = inputs;

  const z =
    -0.20303 -
    0.14203 * heightInches +
    0.80573 * championships +
    0.01594 * leaderboardPts +
    0.41568 * peakWS +
    1.02443 * allStarSelections;

  const probability = 1 / (1 + Math.exp(-z));
  const roundedProb = round(probability * 100, 1);

  return {
    probability: roundedProb,
    isInducted: probability >= 0.50,
    zScore: round(z, 4),
  };
}
