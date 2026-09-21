import { describe, it, expect } from 'vitest';
import { NBA_ACTIVE_STARS } from '../data/nbaRoster';
import { NBA_TEAMS } from '../data/teamsRepository';
import { evaluateTeamFit } from '../engine/teamFitEngine';
import { calculateSeasonAwards } from '../engine/awardsManager';
import { generateContractOffers, generateTradeOptions } from '../engine/freeAgency';
import { PlayerEntity } from '../types';

describe('Bateria de Testes & Benchmark: Roster Massivo, Team Fit e Premiações NBA', () => {

  // =========================================================================
  // 1. ROSTER MASSIVO DA NBA (115+ JOGADORES REAIS)
  // =========================================================================
  describe('Roster Massivo da NBA e Categorização Realista', () => {
    it('deve possuir mais de 100 jogadores reais distribuídos em todas as 30 franquias', () => {
      expect(NBA_ACTIVE_STARS.length).toBeGreaterThanOrEqual(100);

      // Todas as 30 franquias devem estar representadas
      const coveredTeams = new Set(NBA_ACTIVE_STARS.map(s => s.teamId));
      NBA_TEAMS.forEach(team => {
        expect(coveredTeams.has(team.id)).toBe(true);
        const playersInTeam = NBA_ACTIVE_STARS.filter(s => s.teamId === team.id);
        // Cada franquia tem ao menos 3 jogadores cadastrados (titulares e reservas)
        expect(playersInTeam.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('deve possuir reservas legítimos com isStarter: false para o 6MOY', () => {
      const reserves = NBA_ACTIVE_STARS.filter(s => s.isStarter === false);
      expect(reserves.length).toBeGreaterThanOrEqual(10);

      const nazReid = reserves.find(s => s.name.includes('Naz Reid'));
      const malikMonk = reserves.find(s => s.name.includes('Malik Monk'));
      const bobbyPortis = reserves.find(s => s.name.includes('Bobby Portis'));

      expect(nazReid).toBeDefined();
      expect(malikMonk).toBeDefined();
      expect(bobbyPortis).toBeDefined();
    });

    it('deve possuir calouros reais marcados com isRookie: true para o ROTY', () => {
      const rookies = NBA_ACTIVE_STARS.filter(s => s.isRookie === true);
      expect(rookies.length).toBeGreaterThanOrEqual(5);

      const sarr = rookies.find(s => s.name.includes('Alexandre Sarr'));
      const edey = rookies.find(s => s.name.includes('Zach Edey'));
      const castle = rookies.find(s => s.name.includes('Stephon Castle'));

      expect(sarr).toBeDefined();
      expect(edey).toBeDefined();
      expect(castle).toBeDefined();
    });

    it('deve possuir atletas com previousStats para a disputa orgânica do MIP', () => {
      const mipCandidates = NBA_ACTIVE_STARS.filter(s => s.previousStats !== undefined);
      expect(mipCandidates.length).toBeGreaterThanOrEqual(5);

      const cobyWhite = mipCandidates.find(s => s.name.includes('Coby White'));
      expect(cobyWhite).toBeDefined();
      expect(cobyWhite?.previousStats?.ppg).toBeLessThan(cobyWhite!.baseStats.ppg);
    });
  });

  // =========================================================================
  // 2. ENCAIXE TÁTICO (TEAM FIT & ROLES)
  // =========================================================================
  describe('Motor de Avaliação de Encaixe Tático (Team Fit)', () => {
    const createTestPlayer = (position: 'PG' | 'SG' | 'SF' | 'PF' | 'C', overall: number): PlayerEntity => ({
      id: 'test-player',
      firstName: 'Atleta',
      lastName: 'Teste',
      fullName: 'Atleta Teste',
      age: 23,
      position,
      heightInches: 79,
      weightLbs: 220,
      wingspanInches: 84,
      overall,
      potential: 92,
      currentTeamId: 'bos-celtics',
      attributes: {
        clutch: 80,
      },
      careerStats: [
        {
          seasonYear: 2024,
          teamId: 'bos-celtics',
          teamName: 'Boston Celtics',
          league: 'NBA',
          gamesPlayed: 75,
          gamesStarted: 40,
          pointsPerGame: 16.5,
          reboundsPerGame: 5.0,
          assistsPerGame: 4.0,
          stealsPerGame: 1.0,
          blocksPerGame: 0.5,
          fieldGoalPct: 46.0,
          threePointPct: 35.0,
          freeThrowPct: 80.0,
          turnoversPerGame: 1.8,
          minutesPerGame: 28.0,
          per: 16.8,
          winShares: 5.5,
        }
      ],
      seasonStats: {
        seasonYear: 2025,
        gamesPlayed: 78,
        gamesStarted: 78,
        pointsPerGame: 26.2,
        reboundsPerGame: 6.5,
        assistsPerGame: 5.2,
        stealsPerGame: 1.5,
        blocksPerGame: 0.8,
        fgPct: 49.5,
        fg3Pct: 38.2,
        ftPct: 85.0,
        per: 24.5,
        winShares: 11.2,
        dws: 3.8,
      },
      trophyCase: [],
    } as unknown as PlayerEntity);

    it('deve avaliar um SF 76 OVR indo para os Celtics (com Jayson Tatum 96 OVR) como desfavorável/banco', () => {
      const benchPlayer = createTestPlayer('SF', 76);
      const report = evaluateTeamFit(benchPlayer, 'bos-celtics');

      expect(['SIXTH_MAN', 'ROTATION', 'BENCHWARMER', 'POSITION_BATTLE']).toContain(report.expectedRole);
      expect(report.directRivalName).toBe('Jayson Tatum');
      expect(report.directRivalOvr).toBeGreaterThanOrEqual(95);
      expect(report.isWorthIt).toBe(false); // Não vale a pena disputar minutagem com Tatum
      expect(report.fitStars).toBeLessThanOrEqual(2);
      expect(report.consPtBr.length).toBeGreaterThan(0);
    });

    it('deve avaliar um SF 88 OVR indo para uma equipe sem ala de elite (ex: Wizards ou Blazers) como Dono da Franquia ou Titular Indiscutível', () => {
      const starPlayer = createTestPlayer('SF', 88);
      const reportWizards = evaluateTeamFit(starPlayer, 'was-wizards');

      expect(['FRANCHISE_CORNERSTONE', 'STARTER']).toContain(reportWizards.expectedRole);
      expect(reportWizards.isWorthIt).toBe(true);
      expect(reportWizards.fitStars).toBeGreaterThanOrEqual(4);
      expect(['REBUILD', 'REBUILDING']).toContain(reportWizards.projectType);
      expect(reportWizards.prosPtBr.length).toBeGreaterThan(0);
    });

    it('deve avaliar um PG 94 OVR como FRANCHISE_CORNERSTONE com 5 estrelas', () => {
      const superstar = createTestPlayer('PG', 94);
      const report = evaluateTeamFit(superstar, 'sas-spurs');

      expect(report.expectedRole).toBe('FRANCHISE_CORNERSTONE');
      expect(report.fitStars).toBe(5);
      expect(report.isWorthIt).toBe(true);
    });
  });

  // =========================================================================
  // 3. BATERIA DE TESTES DE PREMIAÇÕES (50 TEMPORADAS SIMULADAS)
  // =========================================================================
  describe('Bateria de 50 Temporadas de Prêmios Individuais Rebalanceados', () => {
    const mockTeamWins: Record<string, number> = {
      'bos-celtics': 60,
      'okc-thunder': 57,
      'den-nuggets': 55,
      'min-timberwolves': 54,
      'mil-bucks': 49,
      'dal-mavericks': 50,
      'phi-76ers': 47,
      'lal-lakers': 45,
      'was-wizards': 22,
      'det-pistons': 20,
    };

    it('6MOY NUNCA deve premiar jogadores titulares (Jokic, Luka, Giannis, etc.)', () => {
      // Cria jogador do usuário como titular absoluto (82 jogos iniciados)
      const userStarterPlayer = {
        id: 'user-starter',
        firstName: 'Titular',
        lastName: 'Estrela',
        fullName: 'Titular Estrela',
        age: 25,
        position: 'PG',
        heightInches: 75,
        weightLbs: 200,
        wingspanInches: 80,
        overall: 92,
        potential: 95,
        currentTeamId: 'den-nuggets',
        attributes: {
          clutch: 90,
        },
        careerStats: [
          { seasonYear: 2024, teamId: 'den-nuggets', teamName: 'Denver Nuggets', league: 'NBA', gamesPlayed: 80, gamesStarted: 80, pointsPerGame: 25, reboundsPerGame: 5, assistsPerGame: 9, stealsPerGame: 1.2, blocksPerGame: 0.3, fieldGoalPct: 48, threePointPct: 39, freeThrowPct: 90, turnoversPerGame: 2.2, minutesPerGame: 35, per: 23, winShares: 10 },
        ],
        seasonStats: {
          seasonYear: 2025,
          gamesPlayed: 82,
          gamesStarted: 82,
          pointsPerGame: 28.5,
          reboundsPerGame: 6.0,
          assistsPerGame: 10.5,
          stealsPerGame: 1.6,
          blocksPerGame: 0.4,
          fgPct: 50.2,
          fg3Pct: 41.0,
          ftPct: 91.0,
          per: 26.8,
          winShares: 14.5,
          dws: 3.2,
        },
        trophyCase: [],
      } as unknown as PlayerEntity;

      // Executa 50 temporadas para testar estabilidade estocástica
      for (let season = 1; season <= 50; season++) {
        const gala = calculateSeasonAwards(userStarterPlayer, mockTeamWins);
        const sixthManWinner = gala.awards.SIXTH_MAN.winner;

        // O vencedor NÃO PODE ser um superstar titular
        expect(sixthManWinner.playerName).not.toBe('Nikola Jokic');
        expect(sixthManWinner.playerName).not.toBe('Luka Doncic');
        expect(sixthManWinner.playerName).not.toBe('Giannis Antetokounmpo');
        expect(sixthManWinner.playerName).not.toBe('Jayson Tatum');
        expect(sixthManWinner.playerName).not.toBe('Joel Embiid');
        expect(sixthManWinner.playerName).not.toBe('Stephen Curry');
        expect(sixthManWinner.playerName).not.toBe('Titular Estrela'); // O usuário é titular, não pode vencer!

        // Deve ser um reserva legítimo (Naz Reid, Malik Monk, Powell, Portis, Bogdanovic, etc.)
        const starProfile = NBA_ACTIVE_STARS.find(s => s.id === sixthManWinner.playerId);
        if (starProfile) {
          expect(starProfile.isStarter).toBe(false);
        }
      }
    });

    it('ROTY deve premiar apenas calouros reais (isRookie: true)', () => {
      const veteranUser = {
        id: 'veteran-user',
        firstName: 'Veterano',
        lastName: 'NBA',
        fullName: 'Veterano NBA',
        age: 28,
        position: 'SF',
        heightInches: 80,
        weightLbs: 230,
        wingspanInches: 84,
        overall: 90,
        potential: 90,
        currentTeamId: 'bos-celtics',
        attributes: { clutch: 85 },
        careerStats: [
          { seasonYear: 2023, teamId: 'bos-celtics', teamName: 'Boston Celtics', league: 'NBA', gamesPlayed: 75, gamesStarted: 75, pointsPerGame: 20, reboundsPerGame: 6, assistsPerGame: 4, stealsPerGame: 1, blocksPerGame: 0.5, fieldGoalPct: 47, threePointPct: 37, freeThrowPct: 85, turnoversPerGame: 1.5, minutesPerGame: 32, per: 20, winShares: 8 },
          { seasonYear: 2024, teamId: 'bos-celtics', teamName: 'Boston Celtics', league: 'NBA', gamesPlayed: 78, gamesStarted: 78, pointsPerGame: 22, reboundsPerGame: 7, assistsPerGame: 5, stealsPerGame: 1.2, blocksPerGame: 0.6, fieldGoalPct: 48, threePointPct: 38, freeThrowPct: 86, turnoversPerGame: 1.6, minutesPerGame: 33, per: 21, winShares: 9 },
        ],
        seasonStats: { seasonYear: 2025, gamesPlayed: 80, gamesStarted: 80, pointsPerGame: 25, reboundsPerGame: 8, assistsPerGame: 6, stealsPerGame: 1.5, blocksPerGame: 0.8, fgPct: 49, fg3Pct: 39, ftPct: 87, per: 23, winShares: 11, dws: 3.5 },
        trophyCase: [],
      } as unknown as PlayerEntity;

      for (let i = 0; i < 20; i++) {
        const gala = calculateSeasonAwards(veteranUser, mockTeamWins);
        const rotyWinner = gala.awards.ROTY.winner;
        // O veterano não pode vencer o ROTY
        expect(rotyWinner.playerId).not.toBe('veteran-user');

        const rookieStar = NBA_ACTIVE_STARS.find(s => s.id === rotyWinner.playerId);
        expect(rookieStar?.isRookie).toBe(true);
      }
    });

    it('All-Star Game deve conter exatamente 12 atletas no Leste e 12 no Oeste com 5 titulares cada', () => {
      const userPlayer = {
        id: 'test-user',
        firstName: 'Estrela',
        lastName: 'Brasil',
        fullName: 'Estrela Brasil',
        age: 22,
        position: 'SG',
        heightInches: 77,
        weightLbs: 205,
        wingspanInches: 81,
        overall: 95,
        potential: 99,
        currentTeamId: 'okc-thunder', // Oeste
        attributes: { clutch: 95 },
        careerStats: [],
        seasonStats: { seasonYear: 2025, gamesPlayed: 82, gamesStarted: 82, pointsPerGame: 32.5, reboundsPerGame: 6.2, assistsPerGame: 7.8, stealsPerGame: 1.8, blocksPerGame: 0.6, fgPct: 51.5, fg3Pct: 43.2, ftPct: 92.0, per: 29.5, winShares: 16.8, dws: 4.1 },
        trophyCase: [],
      } as unknown as PlayerEntity;

      const gala = calculateSeasonAwards(userPlayer, mockTeamWins);

      expect(gala.allStarEast.length).toBe(12);
      expect(gala.allStarWest.length).toBe(12);

      const eastStarters = gala.allStarEast.filter(p => p.isStarter);
      const westStarters = gala.allStarWest.filter(p => p.isStarter);

      expect(eastStarters.length).toBe(5);
      expect(westStarters.length).toBe(5);

      // Usuário com 32.5 PPG e 95 OVR no Thunder deve ser All-Star Starter no Oeste
      const userInWest = gala.allStarWest.find(p => p.isUser);
      expect(userInWest).toBeDefined();
      expect(userInWest?.isStarter).toBe(true);
    });

    it('All-NBA Teams deve estruturar 1st, 2nd e 3rd teams com 5 atletas cada', () => {
      const userPlayer = {
        id: 'test-user',
        firstName: 'Estrela',
        lastName: 'Brasil',
        fullName: 'Estrela Brasil',
        age: 22,
        position: 'SG',
        heightInches: 77,
        weightLbs: 205,
        wingspanInches: 81,
        overall: 95,
        potential: 99,
        currentTeamId: 'okc-thunder',
        attributes: { clutch: 95 },
        careerStats: [],
        seasonStats: { seasonYear: 2025, gamesPlayed: 82, gamesStarted: 82, pointsPerGame: 32.5, reboundsPerGame: 6.2, assistsPerGame: 7.8, stealsPerGame: 1.8, blocksPerGame: 0.6, fgPct: 51.5, fg3Pct: 43.2, ftPct: 92.0, per: 29.5, winShares: 16.8, dws: 4.1 },
        trophyCase: [],
      } as unknown as PlayerEntity;

      const gala = calculateSeasonAwards(userPlayer, mockTeamWins);

      expect(gala.allNbaTeams.first.length).toBe(5);
      expect(gala.allNbaTeams.second.length).toBe(5);
      expect(gala.allNbaTeams.third.length).toBe(5);
      expect(gala.allDefensiveTeams.first.length).toBe(5);
      expect(gala.allDefensiveTeams.second.length).toBe(5);
      expect(gala.allRookieTeam.length).toBe(5);
    });
  });

  // =========================================================================
  // 4. FREE AGENCY E PROPOSTAS COM TEAM FIT
  // =========================================================================
  describe('Free Agency e Opções de Troca Enriquecidas com Team Fit', () => {
    const mockPlayer = {
      id: 'fa-player',
      firstName: 'Free',
      lastName: 'Agent',
      fullName: 'Free Agent',
      age: 26,
      position: 'PG',
      heightInches: 75,
      weightLbs: 195,
      wingspanInches: 80,
      overall: 87,
      potential: 90,
      currentTeamId: 'mia-heat',
      attributes: { clutch: 88 },
      careerStats: [],
      seasonStats: { seasonYear: 2025, gamesPlayed: 76, gamesStarted: 76, pointsPerGame: 22.4, reboundsPerGame: 4.8, assistsPerGame: 8.5, stealsPerGame: 1.4, blocksPerGame: 0.3, fgPct: 48.0, fg3Pct: 39.5, ftPct: 89.0, per: 22.0, winShares: 9.5, dws: 2.8 },
      trophyCase: [],
    } as unknown as PlayerEntity;

    it('generateContractOffers deve incluir relatório completo de teamFit em todas as ofertas', () => {
      const offers = generateContractOffers(mockPlayer);
      expect(offers.length).toBeGreaterThanOrEqual(3);

      offers.forEach(offer => {
        expect(offer.teamFit).toBeDefined();
        expect(offer.teamFit?.fitStars).toBeGreaterThanOrEqual(1);
        expect(offer.teamFit?.fitStars).toBeLessThanOrEqual(5);
        expect(offer.teamFit?.verdictPtBr).toBeDefined();
        expect(typeof offer.teamFit?.isWorthIt).toBe('boolean');
        expect(offer.teamFit?.prosPtBr.length).toBeGreaterThan(0);
      });
    });

    it('generateTradeOptions deve gerar opções de troca com teamFit acoplado', () => {
      const trades = generateTradeOptions(mockPlayer);
      expect(trades.length).toBeGreaterThanOrEqual(2);

      trades.forEach(trade => {
        expect(trade.teamFit).toBeDefined();
        expect(trade.teamFit?.expectedRole).toBeDefined();
      });
    });
  });
});
