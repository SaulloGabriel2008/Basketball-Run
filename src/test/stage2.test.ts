import { describe, it, expect } from 'vitest';
import { calculateTS, calculateEFG, calculateUSG, calculatePER, calculateWinShares } from '../engine/advancedMetrics';
import { fAgePhys, gAgePhys, fAgeMent, gAgeMent, evolveAttributes } from '../engine/biologicalAging';
import { simulateMatch } from '../engine/simulationCore';
import { NBA_TEAMS } from '../data/teamsRepository';
import { PlayerEntity, PlayerAttributes } from '../types';

const defaultAttrs: PlayerAttributes = {
  speed: 80,
  acceleration: 80,
  vertical: 80,
  stamina: 80,
  strength: 75,
  inside: 78,
  midRange: 82,
  threePoint: 85,
  freeThrow: 88,
  slashing: 76,
  passing: 84,
  ballControl: 85,
  offensiveIQ: 82,
  defensiveIQ: 78,
  clutch: 80,
  perimeterDefense: 80,
  interiorDefense: 65,
  steal: 75,
  block: 55,
  offensiveRebound: 50,
  defensiveRebound: 65,
};

const mockPlayer: PlayerEntity = {
  id: 'player-test-1',
  firstName: 'Marcus',
  lastName: 'Carter',
  fullName: 'Marcus Carter',
  age: 22,
  birthYear: 2004,
  heightInches: 77, // 6'5"
  weightLbs: 205,
  wingspanInches: 81,
  position: 'SG',
  archetype: 'SHARPSHOOTER',
  attributes: { ...defaultAttrs },
  potential: 92,
  workEthic: 4.2,
  overall: 83,
  moral: 85,
  chemistry: 80,
  energy: 100,
  injuryRisk: 10,
  isInjured: false,
  currentLeague: 'NBA',
  currentTeamId: 'bos-celtics',
  contract: {
    type: 'ROOKIE_SCALE',
    yearsTotal: 4,
    yearsRemaining: 3,
    salaryPerYear: 8500000,
    teamOptionYears: [3, 4],
  },
  seasonStats: {
    careerId: 1,
    seasonYear: 2026,
    league: 'NBA',
    teamId: 'bos-celtics',
    gamesPlayed: 0,
    gamesStarted: 0,
    minutesPerGame: 0,
    pointsPerGame: 0,
    reboundsPerGame: 0,
    assistsPerGame: 0,
    stealsPerGame: 0,
    blocksPerGame: 0,
    turnoversPerGame: 0,
    foulsPerGame: 0,
    totalMinutes: 0,
    totalPoints: 0,
    totalFgm: 0,
    totalFga: 0,
    totalFg3m: 0,
    totalFg3a: 0,
    totalFtm: 0,
    totalFta: 0,
    totalOreb: 0,
    totalDreb: 0,
    totalReb: 0,
    totalAst: 0,
    totalStl: 0,
    totalBlk: 0,
    totalTov: 0,
    totalPf: 0,
    fgPct: 0,
    fg3Pct: 0,
    ftPct: 0,
    tsPct: 0,
    efgPct: 0,
    usgPct: 0,
    per: 0,
    ows: 0,
    dws: 0,
    winShares: 0,
    trophies: [],
  },
  careerStats: [],
  careerRecord: {
    playerName: 'Marcus Carter',
    birthYear: 2004,
    currentYear: 2026,
    currentTeamId: 'bos-celtics',
    isRetired: false,
    hallOfFameProbability: 0,
    dateSaved: Date.now(),
    championships: 0,
    mvps: 0,
    finalsMvps: 0,
    dpoyAwards: 0,
    scoringTitles: 0,
    allStarSelections: 0,
    allNbaFirstTeam: 0,
    allNbaSecondTeam: 0,
    allNbaThirdTeam: 0,
    peakWinShares: 0,
    leaderboardPoints: 0,
  },
  trophyCase: [],
  isRetired: false,
};

describe('ETAPA 2: Motor Matemático e Métricas Avançadas', () => {
  it('deve calcular corretamente TS% (True Shooting Percentage)', () => {
    // 25 pontos em 15 FGA e 6 FTA -> 25 / (2 * (15 + 0.44 * 6)) = 25 / (2 * 17.64) = 25 / 35.28 = ~70.9%
    const ts = calculateTS(25, 15, 6);
    expect(ts).toBeCloseTo(70.9, 1);
  });

  it('deve calcular corretamente eFG% (Effective Field Goal Percentage)', () => {
    // 8 FGM, 4 3PM, em 16 FGA -> (8 + 0.5 * 4) / 16 = 10 / 16 = 62.5%
    const efg = calculateEFG(8, 4, 16);
    expect(efg).toBe(62.5);
  });

  it('deve calcular USG% dentro dos parâmetros da NBA (15% a 35%)', () => {
    const usg = calculateUSG({
      fga: 18,
      fta: 6,
      tov: 3,
      mp: 35,
      teamMp: 240,
      teamFga: 88,
      teamFta: 22,
      teamTov: 14,
    });
    expect(usg).toBeGreaterThanOrEqual(20);
    expect(usg).toBeLessThanOrEqual(35);
  });

  it('deve calcular uPER calibrado com produção de titular girando em torno de 15 a 25', () => {
    const per = calculatePER({
      mp: 34,
      pts: 24,
      reb: 6,
      ast: 5,
      stl: 1,
      blk: 1,
      tov: 2,
      fgm: 9,
      fga: 18,
      ftm: 4,
      fta: 5,
      fg3m: 2,
      pf: 2,
    });
    expect(per).toBeGreaterThan(16);
    expect(per).toBeLessThan(28);
  });

  it('deve calcular Win Shares positivo para temporada produtiva', () => {
    const ws = calculateWinShares({
      mp: 2800,
      pts: 1800,
      fga: 1400,
      fta: 450,
      tov: 180,
      ast: 400,
      reb: 500,
      stl: 90,
      blk: 40,
      gamesPlayed: 80,
    });
    expect(ws.total).toBeGreaterThan(5.0);
    expect(ws.ows).toBeGreaterThan(2.0);
    expect(ws.dws).toBeGreaterThan(1.0);
  });

  it('deve respeitar a curva biológica: pico atlético jovem e declínio físico pós-29', () => {
    expect(fAgePhys(19)).toBeGreaterThan(0.8);
    expect(fAgePhys(20)).toBeGreaterThan(0.5);
    // Aos 26 anos, o jogador atingiu o ápice fisiológico: progressão física encerrou (0) e regressão ainda não iniciou (0)
    expect(fAgePhys(26)).toBe(0);
    expect(gAgePhys(26)).toBe(0);

    expect(fAgePhys(28)).toBe(0); // Passou dos 27

    expect(gAgePhys(25)).toBe(0);
    expect(gAgePhys(30)).toBeGreaterThan(0);
    expect(gAgePhys(35)).toBeGreaterThan(gAgePhys(30)); // Declínio acelerado

    // Atributos mentais continuam evoluindo até 33
    expect(fAgeMent(30)).toBeGreaterThan(0.4);
    expect(gAgeMent(32)).toBe(0);
    expect(gAgeMent(36)).toBeGreaterThan(0);
  });

  it('deve evoluir atributos ao longo do tempo respeitando potencial e idade', () => {
    const youngAttrs = evolveAttributes(defaultAttrs, 20, 95, 4.0);
    // Jogador jovem com alto potencial e ética deve evoluir
    expect(youngAttrs.threePoint).toBeGreaterThanOrEqual(defaultAttrs.threePoint);

    const oldAttrs = evolveAttributes(defaultAttrs, 36, 85, 3.0);
    // Jogador veterano deve sofrer queda física
    expect(oldAttrs.speed).toBeLessThan(defaultAttrs.speed);
    expect(oldAttrs.vertical).toBeLessThan(defaultAttrs.vertical);
  });

  it('deve simular partida completa com box score consistente e minutos regulamentares', () => {
    const celtics = NBA_TEAMS.find(t => t.id === 'bos-celtics')!;
    const lakers = NBA_TEAMS.find(t => t.id === 'lal-lakers')!;

    const boxScore = simulateMatch(celtics, lakers, 'NBA', mockPlayer);

    expect(boxScore.homeScore).toBeGreaterThan(70);
    expect(boxScore.awayScore).toBeGreaterThan(70);
    expect(boxScore.homePeriods.q1).toBeGreaterThan(10);
    expect(boxScore.userPlayerGame).toBeDefined();
    expect(boxScore.userPlayerGame?.minutes).toBeGreaterThan(10);
    expect(boxScore.userPlayerGame?.fga).toBeGreaterThanOrEqual(boxScore.userPlayerGame?.fgm || 0);
  });
});
