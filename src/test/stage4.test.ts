import { describe, it, expect } from 'vitest';
import { simulateDraftLottery, calculateDraftStock } from '../engine/draftLottery';
import { createRookieScaleContract, createTwoWayContract } from '../engine/contracts';
import { calculateHallOfFameProbability } from '../engine/hallOfFame';
import { getRandomCareerEvent, applyEventChoice } from '../engine/eventsManager';

describe('ETAPA 4: Regras de Negócio, Draft, Contratos e Hall da Fama', () => {
  it('deve simular a Loteria do NBA Draft com 14 equipes e ordenar escolhas 1 a 14', () => {
    const mockTeams = Array.from({ length: 14 }, (_, i) => `team-${i + 1}`);
    const lottery = simulateDraftLottery(mockTeams);

    expect(lottery.length).toBe(14);
    const picks = lottery.map(l => l.pick);
    expect(picks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

    const uniqueTeams = new Set(lottery.map(l => l.teamId));
    expect(uniqueTeams.size).toBe(14);

    const winners = lottery.filter(l => l.isLotteryWinner);
    expect(winners.length).toBe(4);
  });

  it('deve projetar posição no Mock Draft baseada na pontuação do Combine', () => {
    const eliteProspect = calculateDraftStock({
      overall: 85,
      potential: 94,
      heightInches: 79,
      collegeStats: { pointsPerGame: 22, reboundsPerGame: 7, assistsPerGame: 5, per: 26 },
    });
    expect(eliteProspect.projectedPick).toBeLessThanOrEqual(10);
    expect(eliteProspect.draftRound).toBe(1);

    const secondRoundProspect = calculateDraftStock({
      overall: 68,
      potential: 74,
      heightInches: 74,
      collegeStats: { pointsPerGame: 9, reboundsPerGame: 2, assistsPerGame: 2, per: 13 },
    });
    expect(secondRoundProspect.projectedPick).toBeGreaterThan(20);
  });

  it('deve criar contrato Rookie Scale no modelo 2+2 anos com opções de equipe', () => {
    const contract = createRookieScaleContract(1);
    expect(contract.type).toBe('ROOKIE_SCALE');
    expect(contract.yearsTotal).toBe(4);
    expect(contract.teamOptionYears).toEqual([3, 4]);
    expect(contract.salaryPerYear).toBeGreaterThan(8000000);
  });

  it('deve criar contrato Two-Way limitado a 50 partidas na NBA', () => {
    const twoWay = createTwoWayContract();
    expect(twoWay.type).toBe('TWO_WAY');
    expect(twoWay.maxGamesInNBA).toBe(50);
  });

  it('deve calcular a probabilidade do Hall da Fama conforme a regressão logística oficial do Basketball Reference', () => {
    // Superstar com carreira gloriosa
    const legend = calculateHallOfFameProbability({
      heightInches: 78, // 6'6"
      championships: 3,
      leaderboardPts: 50,
      peakWS: 16.2,
      allStarSelections: 10,
    });

    expect(legend.probability).toBeGreaterThan(95.0);
    expect(legend.isInducted).toBe(true);

    // Jogador de rotação sem honras individuais
    const rolePlayer = calculateHallOfFameProbability({
      heightInches: 75,
      championships: 0,
      leaderboardPts: 0,
      peakWS: 4.1,
      allStarSelections: 0,
    });

    expect(rolePlayer.probability).toBeLessThan(10.0);
    expect(rolePlayer.isInducted).toBe(false);
  });

  it('deve sortear e aplicar escolhas de eventos de carreira modificando atributos e moral', () => {
    const event = getRandomCareerEvent();
    expect(event.choices.length).toBeGreaterThanOrEqual(2);

    const dummyPlayer: any = {
      moral: 70,
      chemistry: 70,
      energy: 80,
      attributes: { clutch: 75, threePoint: 80, strength: 70 },
    };

    const updated = applyEventChoice(dummyPlayer, event, event.choices[0].id);
    expect(updated).toBeDefined();
  });
});
