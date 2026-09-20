import { describe, it, expect } from 'vitest';
import { COUNTRIES } from '../data/countries';
import { ARCHETYPES_CATALOG } from '../data/archetypes';
import { getGenerationalTalentsForSeason } from '../engine/generationalTalents';
import { 
  getTeamConferenceRank, 
  initializePlayoffBracket, 
  advancePlayoffBracket 
} from '../engine/playoffsEngine';
import { calculateSeasonAwards } from '../engine/awardsManager';
import { generateContractOffers, generateTradeOptions } from '../engine/freeAgency';
import { NBA_TEAMS } from '../data/teamsRepository';
import { StandingsEntry, PlayerEntity } from '../types';

describe('Playoffs, Gala de Prêmios TOP 3, Free Agency e Talentos Globais', () => {
  it('deve possuir catálogo mundial com mais de 200 países e territórios', () => {
    expect(COUNTRIES.length).toBeGreaterThanOrEqual(200);
    const angola = COUNTRIES.find(c => c.name === 'Angola');
    const japao = COUNTRIES.find(c => c.name === 'Japão');
    const brasil = COUNTRIES.find(c => c.name === 'Brasil');
    
    expect(angola).toBeDefined();
    expect(japao).toBeDefined();
    expect(brasil).toBeDefined();
    expect(brasil?.flag).toBe('🇧🇷');
  });

  it('todos os arquétipos devem conter emojis e gradientes arcade', () => {
    ARCHETYPES_CATALOG.forEach(arch => {
      expect(arch.emoji).toBeDefined();
      expect(arch.gradient).toBeDefined();
      expect(arch.playStyleHighlights.length).toBeGreaterThan(0);
    });
  });

  it('deve gerar novos talentos geracionais (Jogadores Jr) com o passar dos anos de carreira', () => {
    const rookieYear = getGenerationalTalentsForSeason(0);
    expect(rookieYear.length).toBe(0);

    const yearThree = getGenerationalTalentsForSeason(3);
    expect(yearThree.length).toBeGreaterThanOrEqual(1);

    const midCareer = getGenerationalTalentsForSeason(6);
    expect(midCareer.length).toBeGreaterThan(yearThree.length);

    const veteranEra = getGenerationalTalentsForSeason(10);
    expect(veteranEra.length).toBeGreaterThanOrEqual(5);

    const shaqJr = veteranEra.find(t => t.name.includes('O\'Neal'));
    expect(shaqJr).toBeDefined();
    expect(shaqJr?.position).toBe('C');
  });

  it('deve calcular corretamente a colocação oficial da conferência e status de playoffs', () => {
    const standings: StandingsEntry[] = NBA_TEAMS.map((t, i) => ({
      teamId: t.id,
      league: 'NBA' as const,
      conference: t.conference,
      division: t.division,
      wins: 60 - (i % 15) * 2,
      losses: 22 + (i % 15) * 2,
      winPct: 0.70,
      streak: 'W2',
      last10: '7-3',
      pointsFor: 8000,
      pointsAgainst: 7500,
    }));

    const topTeam = standings.find(s => s.conference === 'Eastern')!;
    const rankTop = getTeamConferenceRank(topTeam.teamId, standings);
    expect(rankTop.rank).toBe(1);
    expect(rankTop.conference).toBe('Eastern');
    expect(rankTop.madePlayoffs).toBe(true);
  });

  it('deve inicializar e simular os playoffs da NBA até a consagração do campeão', () => {
    const standings: StandingsEntry[] = NBA_TEAMS.map((t, i) => ({
      teamId: t.id,
      league: 'NBA' as const,
      conference: t.conference,
      division: t.division,
      wins: 60 - (i % 15) * 2,
      losses: 22 + (i % 15) * 2,
      winPct: 0.70,
      streak: 'W2',
      last10: '7-3',
      pointsFor: 8000,
      pointsAgainst: 7500,
    }));

    let bracket = initializePlayoffBracket(2026, standings, 'bos-celtics');
    expect(bracket.easternR1.length).toBe(4);
    expect(bracket.westernR1.length).toBe(4);
    expect(bracket.isCompleted).toBe(false);

    // Simula rodada a rodada
    while (!bracket.isCompleted) {
      bracket = advancePlayoffBracket(bracket);
    }

    expect(bracket.isCompleted).toBe(true);
    expect(bracket.championTeamId).toBeDefined();
    expect(bracket.finalsMvpName).toBeDefined();
    expect(bracket.nbaFinals.status).toBe('COMPLETED');
  });

  it('deve gerar a Gala de Prêmios com TOP 3 e suspense de revelação', () => {
    const mockPlayer: PlayerEntity = {
      id: 'athlete-test',
      firstName: 'Saullo',
      lastName: 'Gabriel',
      fullName: 'Saullo Gabriel',
      country: { code: 'BRA', name: 'Brasil', flag: '🇧🇷' },
      age: 22,
      birthYear: 2004,
      heightInches: 79,
      weightLbs: 220,
      wingspanInches: 84,
      position: 'SF',
      primaryArchetype: 'POINT_FORWARD',
      secondaryArchetype: 'SHARPSHOOTER',
      archetype: 'POINT_FORWARD',
      overall: 96,
      potential: 99,
      moral: 95,
      energy: 90,
      chemistry: 90,
      injuryRisk: 5,
      isInjured: false,
      bankBalance: 5000000,
      purchasedItemIds: [],
      currentLeague: 'NBA',
      currentTeamId: 'bos-celtics',
      contract: {
        type: 'STANDARD_NBA',
        yearsTotal: 4,
        yearsRemaining: 1,
        salaryPerYear: 35000000,
      },
      seasonStats: {
        careerId: 1,
        seasonYear: 2026,
        league: 'NBA',
        teamId: 'bos-celtics',
        gamesPlayed: 82,
        gamesStarted: 82,
        minutesPerGame: 36,
        pointsPerGame: 32.5,
        reboundsPerGame: 8.8,
        assistsPerGame: 9.4,
        stealsPerGame: 2.1,
        blocksPerGame: 1.2,
        turnoversPerGame: 2.5,
        foulsPerGame: 2.0,
        fgPct: 51.5,
        fg3Pct: 41.2,
        ftPct: 88.5,
        tsPct: 64.0,
        efgPct: 58.0,
        usgPct: 31.0,
        per: 29.5,
        winShares: 16.5,
        ows: 11.5,
        dws: 5.0,
        totalPoints: 2665,
        totalMinutes: 2952,
        totalFgm: 980,
        totalFga: 1900,
        totalFg3m: 250,
        totalFg3a: 606,
        totalFtm: 455,
        totalFta: 514,
        totalOreb: 100,
        totalDreb: 620,
        totalReb: 720,
        totalAst: 770,
        totalStl: 172,
        totalBlk: 98,
        totalTov: 205,
        totalPf: 164,
        trophies: [],
      },
      careerStats: [],
      careerRecord: {
        playerName: 'Saullo Gabriel',
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
        allStarSelections: 0,
        allNbaFirstTeam: 0,
        allNbaSecondTeam: 0,
        allNbaThirdTeam: 0,
        scoringTitles: 0,
        leaderboardPoints: 2665,
        peakWinShares: 16.5,
      },
      attributes: {
        speed: 89,
        acceleration: 88,
        vertical: 85,
        stamina: 95,
        strength: 84,
        inside: 92,
        midRange: 90,
        threePoint: 91,
        freeThrow: 88,
        slashing: 88,
        passing: 93,
        ballControl: 90,
        offensiveIQ: 94,
        defensiveIQ: 90,
        clutch: 95,
        perimeterDefense: 90,
        interiorDefense: 80,
        steal: 88,
        block: 78,
        offensiveRebound: 70,
        defensiveRebound: 82,
      },
      workEthic: 95,
      trophyCase: [],
      isRetired: false,
    };

    const teamWinsMap: Record<string, number> = { 'bos-celtics': 62 };
    const gala = calculateSeasonAwards(mockPlayer, teamWinsMap);

    expect(gala.seasonYear).toBe(2026);
    expect(gala.awards.MVP.top3.length).toBe(3);
    expect(gala.awards.DPOY.top3.length).toBe(3);

    // O jogador teve desempenho excepcional (32.5 PPG, 8.8 RPG, 9.4 APG, 16.5 WS), deve estar no TOP 3 de MVP
    expect(gala.awards.MVP.userWasTop3).toBe(true);
    expect(gala.awards.MVP.isRevealed).toBe(false); // Efeito de suspense inicial
    expect(gala.allStarEast.length).toBe(12);
    expect(gala.allStarWest.length).toBe(12);
    expect(gala.allNbaTeams.first.length).toBe(5);
  });

  it('deve gerar propostas contratuais de outras franquias na Free Agency e opções de troca', () => {
    const mockPlayer: PlayerEntity = {
      id: 'athlete-test-fa',
      firstName: 'Luka',
      lastName: 'Silva',
      fullName: 'Luka Silva',
      country: { code: 'BRA', name: 'Brasil', flag: '🇧🇷' },
      age: 25,
      birthYear: 2001,
      heightInches: 79,
      weightLbs: 230,
      wingspanInches: 82,
      position: 'PG',
      primaryArchetype: 'PLAYMAKER',
      secondaryArchetype: 'SHARPSHOOTER',
      archetype: 'PLAYMAKER',
      overall: 93,
      potential: 96,
      moral: 90,
      energy: 90,
      chemistry: 90,
      injuryRisk: 5,
      isInjured: false,
      bankBalance: 20000000,
      purchasedItemIds: [],
      currentLeague: 'NBA',
      currentTeamId: 'bos-celtics',
      contract: {
        type: 'STANDARD_NBA',
        yearsTotal: 4,
        yearsRemaining: 1,
        salaryPerYear: 30000000,
      },
      seasonStats: {
        careerId: 1,
        seasonYear: 2026,
        league: 'NBA',
        teamId: 'bos-celtics',
        gamesPlayed: 82,
        gamesStarted: 82,
        minutesPerGame: 35,
        pointsPerGame: 28,
        reboundsPerGame: 8,
        assistsPerGame: 10,
        stealsPerGame: 1.5,
        blocksPerGame: 0.5,
        turnoversPerGame: 3,
        foulsPerGame: 2,
        fgPct: 50,
        fg3Pct: 39,
        ftPct: 85,
        tsPct: 62,
        efgPct: 56,
        usgPct: 29,
        per: 26,
        winShares: 13,
        ows: 9,
        dws: 4,
        totalPoints: 2296,
        totalMinutes: 2870,
        totalFgm: 820,
        totalFga: 1640,
        totalFg3m: 220,
        totalFg3a: 564,
        totalFtm: 436,
        totalFta: 512,
        totalOreb: 80,
        totalDreb: 576,
        totalReb: 656,
        totalAst: 820,
        totalStl: 123,
        totalBlk: 41,
        totalTov: 246,
        totalPf: 164,
        trophies: [],
      },
      careerStats: [],
      careerRecord: {
        playerName: 'Luka Silva',
        birthYear: 2001,
        currentYear: 2026,
        currentTeamId: 'bos-celtics',
        isRetired: false,
        hallOfFameProbability: 0,
        dateSaved: Date.now(),
        championships: 1,
        mvps: 0,
        finalsMvps: 0,
        dpoyAwards: 0,
        allStarSelections: 3,
        allNbaFirstTeam: 2,
        allNbaSecondTeam: 1,
        allNbaThirdTeam: 0,
        scoringTitles: 0,
        leaderboardPoints: 2296,
        peakWinShares: 13,
      },
      attributes: {
        speed: 85,
        acceleration: 84,
        vertical: 80,
        stamina: 92,
        strength: 82,
        inside: 88,
        midRange: 90,
        threePoint: 91,
        freeThrow: 85,
        slashing: 85,
        passing: 95,
        ballControl: 94,
        offensiveIQ: 95,
        defensiveIQ: 80,
        clutch: 92,
        perimeterDefense: 78,
        interiorDefense: 65,
        steal: 78,
        block: 60,
        offensiveRebound: 65,
        defensiveRebound: 75,
      },
      workEthic: 90,
      trophyCase: [],
      isRetired: false,
    };

    const offers = generateContractOffers(mockPlayer);
    expect(offers.length).toBe(5); // 1 do time atual + 4 de franquias rivais
    
    const currentOffer = offers.find(o => o.teamId === 'bos-celtics');
    expect(currentOffer).toBeDefined();
    expect(currentOffer?.isExtension).toBe(true);

    const rivalOffers = offers.filter(o => o.teamId !== 'bos-celtics');
    expect(rivalOffers.length).toBe(4);
    rivalOffers.forEach(o => {
      expect(o.salaryPerYear).toBeGreaterThan(20000000);
      expect(o.yearsTotal).toBeGreaterThanOrEqual(3);
      expect(o.pitchMessage).toBeDefined();
    });

    const trades = generateTradeOptions(mockPlayer);
    expect(trades.length).toBe(3);
    trades.forEach(t => {
      expect(t.teamId).not.toBe(mockPlayer.currentTeamId);
      expect(t.pitch).toBeDefined();
    });
  });
});
