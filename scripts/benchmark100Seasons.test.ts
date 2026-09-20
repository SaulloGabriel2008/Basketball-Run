import { describe, it, expect } from 'vitest';
import { PlayerEntity, PlayerAttributes } from '../src/types';
import { NBA_TEAMS } from '../src/data/teamsRepository';
import { simulateMatch } from '../src/engine/simulationCore';
import { calculateTS, calculatePER, calculateWinShares } from '../src/engine/advancedMetrics';
import { round } from '../src/engine/mathUtils';

function createBenchmarkPlayer(id: string, name: string, archetype: any, position: any, ovr: number): PlayerEntity {
  const baseAttrs: PlayerAttributes = {
    speed: ovr,
    acceleration: ovr,
    vertical: ovr,
    stamina: 85,
    strength: ovr - 2,
    inside: ovr,
    midRange: ovr,
    threePoint: archetype === 'SHARPSHOOTER' ? ovr + 6 : ovr - 5,
    freeThrow: 82,
    slashing: ovr,
    passing: archetype === 'PLAYMAKER' ? ovr + 8 : ovr - 4,
    ballControl: ovr,
    offensiveIQ: ovr,
    defensiveIQ: ovr,
    clutch: ovr,
    perimeterDefense: archetype === 'LOCKDOWN_DEFENDER' ? ovr + 8 : ovr,
    interiorDefense: position === 'C' ? ovr + 8 : ovr - 10,
    steal: ovr - 2,
    block: position === 'C' ? ovr + 6 : ovr - 15,
    offensiveRebound: position === 'C' ? ovr + 4 : 55,
    defensiveRebound: position === 'C' ? ovr + 8 : 65,
  };

  return {
    id,
    firstName: name.split(' ')[0],
    lastName: name.split(' ')[1],
    fullName: name,
    age: 25,
    birthYear: 2001,
    heightInches: position === 'C' ? 83 : position === 'PG' ? 75 : 78,
    weightLbs: position === 'C' ? 260 : 210,
    wingspanInches: 82,
    position,
    archetype,
    attributes: baseAttrs,
    potential: 94,
    workEthic: 4.0,
    overall: ovr,
    moral: 90,
    chemistry: 85,
    energy: 100,
    injuryRisk: 5,
    isInjured: false,
    currentLeague: 'NBA',
    currentTeamId: 'bos-celtics',
    contract: {
      type: 'STANDARD_NBA',
      yearsTotal: 4,
      yearsRemaining: 3,
      salaryPerYear: 32000000,
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
      playerName: name,
      birthYear: 2001,
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
}

describe('ETAPA 5: Script de Balanceamento Estatístico (100 Temporadas)', () => {
  it('deve simular 100 temporadas completas com médias realistas e ausência de anomalias', () => {
    const archetypes = [
      { name: 'Stephen Vance', arch: 'SHARPSHOOTER', pos: 'PG', ovr: 88 },
      { name: 'Giannis Ford', arch: 'SLASHER', pos: 'PF', ovr: 91 },
      { name: 'Kobe Miller', arch: 'PLAYMAKER', pos: 'SG', ovr: 89 },
      { name: 'Kawhi Stone', arch: 'LOCKDOWN_DEFENDER', pos: 'SF', ovr: 87 },
      { name: 'Shaq Davis', arch: 'POST_SCORER', pos: 'C', ovr: 90 },
    ];

    const teamA = NBA_TEAMS[0];
    const teamB = NBA_TEAMS[1];

    const seasonResults: { ppg: number; rpg: number; apg: number; ts: number; per: number; ws: number }[] = [];

    // Executa 100 temporadas (20 por arquétipo)
    const SEASONS_COUNT = 100;

    for (let s = 0; s < SEASONS_COUNT; s++) {
      const archConfig = archetypes[s % archetypes.length];
      const player = createBenchmarkPlayer(`p-bench-${s}`, archConfig.name, archConfig.arch, archConfig.pos, archConfig.ovr);

      // Simula 82 jogos da temporada regular da NBA
      for (let g = 0; g < 82; g++) {
        const box = simulateMatch(teamA, teamB, 'NBA', player, `Game ${g + 1}`);
        const u = box.userPlayerGame!;
        const st = player.seasonStats;

        st.gamesPlayed += 1;
        st.totalMinutes += u.minutes;
        st.totalPoints += u.points;
        st.totalFgm += u.fgm;
        st.totalFga += u.fga;
        st.totalFg3m += u.fg3m;
        st.totalFg3a += u.fg3a;
        st.totalFtm += u.ftm;
        st.totalFta += u.fta;
        st.totalReb += u.reb;
        st.totalAst += u.ast;
        st.totalStl += u.stl;
        st.totalBlk += u.blk;
        st.totalTov += u.tov;
        st.totalPf += u.pf;
      }

      const st = player.seasonStats;
      const ppg = round(st.totalPoints / 82, 1);
      const rpg = round(st.totalReb / 82, 1);
      const apg = round(st.totalAst / 82, 1);
      const ts = calculateTS(st.totalPoints, st.totalFga, st.totalFta);
      const per = calculatePER({
        mp: st.totalMinutes,
        pts: st.totalPoints,
        reb: st.totalReb,
        ast: st.totalAst,
        stl: st.totalStl,
        blk: st.totalBlk,
        tov: st.totalTov,
        fgm: st.totalFgm,
        fga: st.totalFga,
        ftm: st.totalFtm,
        fta: st.totalFta,
        fg3m: st.totalFg3m,
        pf: st.totalPf,
      });
      const ws = calculateWinShares({
        mp: st.totalMinutes,
        pts: st.totalPoints,
        fga: st.totalFga,
        fta: st.totalFta,
        tov: st.totalTov,
        ast: st.totalAst,
        reb: st.totalReb,
        stl: st.totalStl,
        blk: st.totalBlk,
        gamesPlayed: 82,
      }).total;

      seasonResults.push({ ppg, rpg, apg, ts, per, ws });

      // Verificações estritas contra NaNs e valores anômalos
      expect(Number.isNaN(ppg)).toBe(false);
      expect(Number.isNaN(ts)).toBe(false);
      expect(Number.isNaN(per)).toBe(false);
      expect(Number.isNaN(ws)).toBe(false);
      expect(ppg).toBeGreaterThan(10);
      expect(ppg).toBeLessThan(45);
      expect(ts).toBeGreaterThan(45);
      expect(ts).toBeLessThan(75);
    }

    // Calcula médias globais das 100 temporadas
    const avgPpg = round(seasonResults.reduce((a, b) => a + b.ppg, 0) / SEASONS_COUNT, 1);
    const avgRpg = round(seasonResults.reduce((a, b) => a + b.rpg, 0) / SEASONS_COUNT, 1);
    const avgApg = round(seasonResults.reduce((a, b) => a + b.apg, 0) / SEASONS_COUNT, 1);
    const avgTs = round(seasonResults.reduce((a, b) => a + b.ts, 0) / SEASONS_COUNT, 1);
    const avgPer = round(seasonResults.reduce((a, b) => a + b.per, 0) / SEASONS_COUNT, 1);
    const avgWs = round(seasonResults.reduce((a, b) => a + b.ws, 0) / SEASONS_COUNT, 1);

    expect(avgPpg).toBeGreaterThan(15);
    expect(avgPpg).toBeLessThan(34);
    expect(avgTs).toBeGreaterThan(50);
    expect(avgTs).toBeLessThan(72);
    expect(avgPer).toBeGreaterThan(14);
    expect(avgPer).toBeLessThan(28);
    expect(avgWs).toBeGreaterThan(3.0);
  });
});
