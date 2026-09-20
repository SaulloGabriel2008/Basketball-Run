export interface LotterySeed {
  seed: number; // 1 = pior registro
  teamId: string;
  combinations: number;
}

export const OFFICIAL_LOTTERY_SEEDS: { seed: number; combinations: number; pick1Pct: number; top4Pct: number; worstPick: number }[] = [
  { seed: 1, combinations: 140, pick1Pct: 14.0, top4Pct: 52.1, worstPick: 5 },
  { seed: 2, combinations: 140, pick1Pct: 14.0, top4Pct: 52.1, worstPick: 6 },
  { seed: 3, combinations: 140, pick1Pct: 14.0, top4Pct: 52.1, worstPick: 7 },
  { seed: 4, combinations: 125, pick1Pct: 12.5, top4Pct: 48.1, worstPick: 8 },
  { seed: 5, combinations: 105, pick1Pct: 10.5, top4Pct: 42.1, worstPick: 9 },
  { seed: 6, combinations: 90, pick1Pct: 9.0, top4Pct: 37.2, worstPick: 10 },
  { seed: 7, combinations: 75, pick1Pct: 7.5, top4Pct: 31.9, worstPick: 11 },
  { seed: 8, combinations: 60, pick1Pct: 6.0, top4Pct: 26.3, worstPick: 12 },
  { seed: 9, combinations: 45, pick1Pct: 4.5, top4Pct: 20.3, worstPick: 13 },
  { seed: 10, combinations: 30, pick1Pct: 3.0, top4Pct: 13.9, worstPick: 14 },
  { seed: 11, combinations: 20, pick1Pct: 2.0, top4Pct: 9.4, worstPick: 14 },
  { seed: 12, combinations: 15, pick1Pct: 1.5, top4Pct: 7.1, worstPick: 14 },
  { seed: 13, combinations: 10, pick1Pct: 1.0, top4Pct: 4.7, worstPick: 14 },
  { seed: 14, combinations: 5, pick1Pct: 0.5, top4Pct: 2.4, worstPick: 14 },
];

export interface DraftPickOrder {
  pick: number;
  round: number;
  teamId: string;
  isLotteryWinner?: boolean;
}

/**
 * Simula o sorteio oficial da loteria do NBA Draft com base nas combinações das 14 equipes não-classificadas.
 * As primeiras 4 escolhas são sorteadas. As escolhas 5 a 14 seguem a ordem inversa original.
 */
export function simulateDraftLottery(nonPlayoffTeamIds: string[]): DraftPickOrder[] {
  // Garante 14 times
  const teams = nonPlayoffTeamIds.slice(0, 14);
  const pool: { teamId: string; weight: number; originalSeed: number }[] = [];

  OFFICIAL_LOTTERY_SEEDS.forEach((seedData, idx) => {
    const teamId = teams[idx] || `team-lottery-${idx + 1}`;
    pool.push({
      teamId,
      weight: seedData.combinations,
      originalSeed: seedData.seed,
    });
  });

  const selectedTop4: string[] = [];
  const remainingPool = [...pool];

  // Sorteia as primeiras 4 escolhas
  for (let pickNum = 1; pickNum <= 4; pickNum++) {
    const totalWeight = remainingPool.reduce((acc, cur) => acc + cur.weight, 0);
    let rand = Math.random() * totalWeight;

    let chosenIdx = 0;
    for (let i = 0; i < remainingPool.length; i++) {
      rand -= remainingPool[i].weight;
      if (rand <= 0) {
        chosenIdx = i;
        break;
      }
    }

    selectedTop4.push(remainingPool[chosenIdx].teamId);
    remainingPool.splice(chosenIdx, 1);
  }

  // Ordena os times restantes (5 a 14) pela ordem original do seed (inversa de vitórias)
  remainingPool.sort((a, b) => a.originalSeed - b.originalSeed);

  const lotteryResults: DraftPickOrder[] = [];

  // Top 4
  selectedTop4.forEach((teamId, idx) => {
    lotteryResults.push({
      pick: idx + 1,
      round: 1,
      teamId,
      isLotteryWinner: true,
    });
  });

  // 5 a 14
  remainingPool.forEach((item, idx) => {
    lotteryResults.push({
      pick: 5 + idx,
      round: 1,
      teamId: item.teamId,
      isLotteryWinner: false,
    });
  });

  return lotteryResults;
}

/**
 * Projeta a posição do jogador no Draft Combine com base em altura, atlética e produção universitária
 */
export function calculateDraftStock(player: {
  overall: number;
  potential: number;
  heightInches: number;
  collegeStats?: { pointsPerGame: number; reboundsPerGame: number; assistsPerGame: number; per: number };
}): {
  projectedPick: number;
  draftRound: number;
  combineScore: number;
} {
  const ovrWeight = player.overall * 0.45;
  const potWeight = player.potential * 0.40;
  const heightBonus = player.heightInches >= 78 ? 3 : 0;
  const collegePer = player.collegeStats ? player.collegeStats.per * 0.4 : 6;

  const totalScore = ovrWeight + potWeight + heightBonus + collegePer;

  // Pontuação típica: 70 a 95
  let projectedPick = 1;
  if (totalScore >= 88) {
    projectedPick = Math.floor(Math.random() * 3) + 1; // Top 3
  } else if (totalScore >= 84) {
    projectedPick = Math.floor(Math.random() * 7) + 4; // Top 10
  } else if (totalScore >= 80) {
    projectedPick = Math.floor(Math.random() * 10) + 11; // 11-20
  } else if (totalScore >= 76) {
    projectedPick = Math.floor(Math.random() * 10) + 21; // 21-30 (Fim 1ª rodada)
  } else if (totalScore >= 72) {
    projectedPick = Math.floor(Math.random() * 15) + 31; // Segunda rodada
  } else {
    projectedPick = Math.floor(Math.random() * 14) + 46; // Fim da 2ª rodada
  }

  const draftRound = projectedPick <= 30 ? 1 : 2;
  return {
    projectedPick,
    draftRound,
    combineScore: Math.round(totalScore),
  };
}
