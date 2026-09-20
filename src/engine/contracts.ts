import { Contract, PlayerEntity } from '../types';

export const SALARY_CAP_2026 = 141000000; // $141M teto salarial NBA

/**
 * Cria o contrato de calouro conforme a escala salarial oficial (Rookie Scale 2+2).
 */
export function createRookieScaleContract(pickNumber: number): Contract {
  // Escala decrescente baseada na posição do draft
  let baseSalary = 11500000; // Escolha #1 ~ $11.5M
  if (pickNumber <= 3) {
    baseSalary = 10000000 - (pickNumber - 1) * 800000;
  } else if (pickNumber <= 10) {
    baseSalary = 7500000 - (pickNumber - 4) * 400000;
  } else if (pickNumber <= 20) {
    baseSalary = 4500000 - (pickNumber - 11) * 200000;
  } else if (pickNumber <= 30) {
    baseSalary = 2600000 - (pickNumber - 21) * 70000;
  } else {
    baseSalary = 1800000;
  }

  return {
    type: 'ROOKIE_SCALE',
    yearsTotal: 4,
    yearsRemaining: 4,
    salaryPerYear: Math.round(baseSalary),
    teamOptionYears: [3, 4],
    isTeamOptionActive: true,
  };
}

/**
 * Cria um contrato de Dupla Via (Two-Way Contract):
 * Destinado a escolhas de 2ª rodada ou undrafted, limite de 50 partidas na NBA.
 */
export function createTwoWayContract(): Contract {
  return {
    type: 'TWO_WAY',
    yearsTotal: 1,
    yearsRemaining: 1,
    salaryPerYear: 580000,
    maxGamesInNBA: 50,
    nbaGamesPlayedThisYear: 0,
  };
}

/**
 * Cria um contrato de Extensão Designada de Calouro (Designated Rookie Extension):
 * 5 anos, entre 25% e 30% do teto salarial.
 */
export function createDesignatedRookieExtension(isSuperMaxEligible: boolean = false): Contract {
  const capPct = isSuperMaxEligible ? 0.30 : 0.25;
  const salary = Math.round(SALARY_CAP_2026 * capPct);

  return {
    type: 'DESIGNATED_ROOKIE',
    yearsTotal: 5,
    yearsRemaining: 5,
    salaryPerYear: salary,
  };
}

/**
 * Cria contrato de veterano máximo (Supermax - 35% do teto salarial)
 */
export function createSupermaxContract(): Contract {
  return {
    type: 'SUPERMAX',
    yearsTotal: 5,
    yearsRemaining: 5,
    salaryPerYear: Math.round(SALARY_CAP_2026 * 0.35),
  };
}

/**
 * Cria contrato mínimo de veterano
 */
export function createVeteranMinimumContract(yearsOfService: number): Contract {
  const minSalary = Math.min(3300000, 1900000 + yearsOfService * 150000);
  return {
    type: 'VETERAN_MINIMUM',
    yearsTotal: 1,
    yearsRemaining: 1,
    salaryPerYear: minSalary,
  };
}

/**
 * Avalia elegibilidade para Assignment na G-League (até 3 anos de experiência na NBA).
 */
export function canAssignToGLeague(player: PlayerEntity): boolean {
  const yearsInNba = player.careerStats.filter(s => s.league === 'NBA').length;
  return yearsInNba < 3;
}
