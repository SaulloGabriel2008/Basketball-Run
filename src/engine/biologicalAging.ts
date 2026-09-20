import { PlayerAttributes } from '../types';
import { clamp } from './mathUtils';

const PHYSICAL_KEYS: (keyof PlayerAttributes)[] = [
  'speed',
  'acceleration',
  'vertical',
  'stamina',
  'strength',
];

const MENTAL_AND_SKILL_KEYS: (keyof PlayerAttributes)[] = [
  'offensiveIQ',
  'defensiveIQ',
  'clutch',
  'passing',
  'ballControl',
  'threePoint',
  'midRange',
  'inside',
  'freeThrow',
  'perimeterDefense',
  'interiorDefense',
  'steal',
  'block',
  'offensiveRebound',
  'defensiveRebound',
  'slashing',
];

/**
 * Fator de progressão para atributos físicos (idade 18 a 27 anos)
 */
export function fAgePhys(age: number): number {
  if (age > 27) return 0;
  return Math.max(0, 1.0 - Math.pow(Math.max(0, age - 18), 1.8) / 12);
}

/**
 * Fator de declínio para atributos físicos (idade > 29 anos)
 */
export function gAgePhys(age: number): number {
  if (age <= 29) return 0;
  return Math.max(0, Math.pow(age - 29, 2.2) / 15);
}

/**
 * Fator de progressão para atributos mentais/cognitivos (estável até 33 anos)
 */
export function fAgeMent(age: number): number {
  if (age > 33) return 0;
  return Math.max(0.2, 1.0 - (age - 18) / 25);
}

/**
 * Fator de declínio para atributos mentais (idade > 34 anos)
 */
export function gAgeMent(age: number): number {
  if (age <= 34) return 0;
  return Math.max(0, Math.pow(age - 34, 1.5) / 25);
}

/**
 * Aplica a transição biológica anual a todos os atributos do jogador.
 * kProg = 0.25, kReg = 0.35
 */
export function evolveAttributes(
  currentAttrs: PlayerAttributes,
  age: number,
  potential: number,
  workEthic: number = 3.0
): PlayerAttributes {
  const kProg = 0.28;
  const kReg = 0.40;
  const ethicFactor = clamp(workEthic / 3.0, 0.5, 1.6);

  const updated: PlayerAttributes = { ...currentAttrs };

  // Evolução física
  const fPhys = fAgePhys(age);
  const gPhys = gAgePhys(age);

  for (const key of PHYSICAL_KEYS) {
    const val = currentAttrs[key];
    const prog = kProg * (potential - val) * fPhys * ethicFactor;
    const reg = kReg * gPhys * 3.5;
    const delta = prog - reg;
    updated[key] = Math.round(clamp(val + delta, 40, 99));
  }

  // Evolução cognitiva e técnica
  const fMent = fAgeMent(age);
  const gMent = gAgeMent(age);

  for (const key of MENTAL_AND_SKILL_KEYS) {
    const val = currentAttrs[key];
    const prog = kProg * (potential - val) * fMent * ethicFactor;
    const reg = kReg * gMent * 1.8;
    const delta = prog - reg;
    updated[key] = Math.round(clamp(val + delta, 40, 99));
  }

  return updated;
}

/**
 * Calcula a classificação geral (Overall Rating - OVR) ponderada
 */
export function calculateOverall(attrs: PlayerAttributes, position: string): number {
  let ovr = 0;
  switch (position) {
    case 'PG':
      ovr =
        attrs.ballControl * 0.18 +
        attrs.passing * 0.18 +
        attrs.offensiveIQ * 0.14 +
        attrs.speed * 0.12 +
        attrs.threePoint * 0.14 +
        attrs.perimeterDefense * 0.12 +
        attrs.steal * 0.07 +
        attrs.slashing * 0.05;
      break;
    case 'SG':
      ovr =
        attrs.threePoint * 0.20 +
        attrs.midRange * 0.15 +
        attrs.slashing * 0.15 +
        attrs.perimeterDefense * 0.15 +
        attrs.speed * 0.12 +
        attrs.offensiveIQ * 0.12 +
        attrs.ballControl * 0.11;
      break;
    case 'SF':
      ovr =
        attrs.threePoint * 0.16 +
        attrs.slashing * 0.16 +
        attrs.perimeterDefense * 0.16 +
        attrs.midRange * 0.12 +
        attrs.strength * 0.12 +
        attrs.speed * 0.10 +
        attrs.defensiveRebound * 0.09 +
        attrs.offensiveIQ * 0.09;
      break;
    case 'PF':
      ovr =
        attrs.interiorDefense * 0.18 +
        attrs.defensiveRebound * 0.18 +
        attrs.strength * 0.15 +
        attrs.inside * 0.14 +
        attrs.block * 0.12 +
        attrs.midRange * 0.09 +
        attrs.offensiveRebound * 0.09 +
        attrs.vertical * 0.05;
      break;
    case 'C':
      ovr =
        attrs.interiorDefense * 0.22 +
        attrs.defensiveRebound * 0.20 +
        attrs.block * 0.16 +
        attrs.inside * 0.15 +
        attrs.strength * 0.15 +
        attrs.offensiveRebound * 0.12;
      break;
    default:
      ovr = 75;
  }
  return Math.round(clamp(ovr, 45, 99));
}
