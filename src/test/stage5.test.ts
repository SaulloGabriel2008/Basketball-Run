import { describe, it, expect } from 'vitest';
import { exportSaveToJson, importSaveFromJson, FullSaveState } from '../services/db';

describe('ETAPA 5: Persistência, Integridade de Saves e Exportação', () => {
  const mockSaveState: FullSaveState = {
    saveName: 'Lucas Silva (NBA)',
    updatedAt: Date.now(),
    player: {
      id: 'p-save-1',
      firstName: 'Lucas',
      lastName: 'Silva',
      fullName: 'Lucas Silva',
      age: 23,
      birthYear: 2003,
      heightInches: 78,
      weightLbs: 215,
      wingspanInches: 82,
      position: 'SF',
      archetype: 'SLASHER',
      attributes: {
        speed: 85,
        acceleration: 85,
        vertical: 88,
        stamina: 82,
        strength: 80,
        inside: 84,
        midRange: 75,
        threePoint: 72,
        freeThrow: 78,
        slashing: 89,
        passing: 74,
        ballControl: 80,
        offensiveIQ: 78,
        defensiveIQ: 79,
        clutch: 77,
        perimeterDefense: 80,
        interiorDefense: 72,
        steal: 75,
        block: 68,
        offensiveRebound: 65,
        defensiveRebound: 72,
      },
      potential: 90,
      workEthic: 3.5,
      overall: 81,
      moral: 88,
      chemistry: 85,
      energy: 95,
      injuryRisk: 5,
      isInjured: false,
      currentLeague: 'NBA',
      currentTeamId: 'lal-lakers',
      contract: {
        type: 'ROOKIE_SCALE',
        yearsTotal: 4,
        yearsRemaining: 2,
        salaryPerYear: 7500000,
      },
      seasonStats: {
        careerId: 1,
        seasonYear: 2026,
        league: 'NBA',
        teamId: 'lal-lakers',
        gamesPlayed: 50,
        gamesStarted: 50,
        minutesPerGame: 32.5,
        pointsPerGame: 19.4,
        reboundsPerGame: 6.2,
        assistsPerGame: 4.1,
        stealsPerGame: 1.2,
        blocksPerGame: 0.8,
        turnoversPerGame: 2.1,
        foulsPerGame: 2.3,
        totalMinutes: 1625,
        totalPoints: 970,
        totalFgm: 380,
        totalFga: 760,
        totalFg3m: 55,
        totalFg3a: 165,
        totalFtm: 155,
        totalFta: 200,
        totalOreb: 70,
        totalDreb: 240,
        totalReb: 310,
        totalAst: 205,
        totalStl: 60,
        totalBlk: 40,
        totalTov: 105,
        totalPf: 115,
        fgPct: 50.0,
        fg3Pct: 33.3,
        ftPct: 77.5,
        tsPct: 57.2,
        efgPct: 53.6,
        usgPct: 24.5,
        per: 18.2,
        ows: 3.2,
        dws: 2.1,
        winShares: 5.3,
        trophies: [],
      },
      careerStats: [],
      careerRecord: {
        playerName: 'Lucas Silva',
        birthYear: 2003,
        currentYear: 2026,
        currentTeamId: 'lal-lakers',
        isRetired: false,
        hallOfFameProbability: 12.5,
        dateSaved: Date.now(),
        championships: 0,
        mvps: 0,
        finalsMvps: 0,
        dpoyAwards: 0,
        scoringTitles: 0,
        allStarSelections: 1,
        allNbaFirstTeam: 0,
        allNbaSecondTeam: 0,
        allNbaThirdTeam: 0,
        peakWinShares: 5.3,
        leaderboardPoints: 0,
      },
      trophyCase: [],
      isRetired: false,
    },
    recentGames: [],
  };

  it('deve serializar e desserializar o save completo em JSON sem perda de dados', () => {
    const json = exportSaveToJson(mockSaveState);
    expect(typeof json).toBe('string');
    expect(json).toContain('Lucas Silva');
    expect(json).toContain('lal-lakers');

    const imported = importSaveFromJson(json);
    expect(imported.player.fullName).toBe('Lucas Silva');
    expect(imported.player.currentTeamId).toBe('lal-lakers');
    expect(imported.player.seasonStats.pointsPerGame).toBe(19.4);
    expect(imported.player.seasonStats.tsPct).toBe(57.2);
  });

  it('deve lançar erro caso arquivo de save seja corrompido ou inválido', () => {
    expect(() => importSaveFromJson('{"invalid": true}')).toThrowError('Arquivo de save inválido');
  });
});
