import { create } from 'zustand';
import { 
  PlayerEntity, 
  GameBoxScore, 
  NewsItem, 
  CareerEvent, 
  LeagueId, 
  StandingsEntry, 
  Archetype, 
  Position, 
  PlayerAttributes,
  TeamEntity,
  CountryInfo,
  PlayoffBracket, 
  SeasonAwardsGala, 
  AwardType, 
  ContractOffer
} from '../types';
import { NBA_TEAMS, NCAA_TEAMS, G_LEAGUE_TEAMS, getTeamById, getGLeagueAffiliate, getParentNbaTeam } from '../data/teamsRepository';
import { CAREER_SHOP_ITEMS } from '../data/careerShop';
import { simulateMatch } from '../engine/simulationCore';
import { calculateOverall, evolveAttributes } from '../engine/biologicalAging';
import { createRookieScaleContract, createTwoWayContract } from '../engine/contracts';
import { calculateDraftStock, simulateDraftLottery } from '../engine/draftLottery';
import { calculateHallOfFameProbability } from '../engine/hallOfFame';
import { getRandomCareerEvent, applyEventChoice } from '../engine/eventsManager';
import { calculateTS, calculateEFG, calculateUSG, calculatePER, calculateWinShares } from '../engine/advancedMetrics';
import { calculateSeasonAwards } from '../engine/awardsManager';
import { initializePlayoffBracket, advancePlayoffBracket } from '../engine/playoffsEngine';
import { generateContractOffers, generateTradeOptions } from '../engine/freeAgency';
import { savePlayerCareer, loadLatestCareer, exportSaveToJson, importSaveFromJson } from '../services/db';
import { round } from '../engine/mathUtils';

export type ScreenType = 
  | 'CREATE_PLAYER' 
  | 'DASHBOARD' 
  | 'BOX_SCORE' 
  | 'CAREER_HISTORY' 
  | 'LEAGUE_STANDINGS' 
  | 'CAREER_SHOP'
  | 'DRAFT_CEREMONY' 
  | 'RETIREMENT';

interface GameState {
  player: PlayerEntity | null;
  currentScreen: ScreenType;
  selectedBoxScore: GameBoxScore | null;
  recentGames: GameBoxScore[];
  newsFeed: NewsItem[];
  activeEvent: CareerEvent | null;
  isSimulating: boolean;
  simProgress: { completed: number; total: number } | null;
  isSeasonEndModalOpen: boolean;
  playoffBracket: PlayoffBracket | null;
  isPlayoffsModalOpen: boolean;
  awardsGala: SeasonAwardsGala | null;
  isAwardsModalOpen: boolean;
  contractOffers: ContractOffer[];
  isContractModalOpen: boolean;
  nbaStandings: StandingsEntry[];
  ncaaStandings: StandingsEntry[];
  gleagueStandings: StandingsEntry[];
  draftProjectedPick: number | null;
  draftLotteryResults: { pick: number; teamId: string }[] | null;

  // Ações
  setScreen: (screen: ScreenType) => void;
  openSeasonEndModal: () => void;
  closeSeasonEndModal: () => void;
  openPlayoffsModal: () => void;
  closePlayoffsModal: () => void;
  advancePlayoffs: () => void;
  simulateEntirePlayoffs: () => void;
  openAwardsModal: () => void;
  closeAwardsModal: () => void;
  revealAward: (awardType: AwardType) => void;
  openContractModal: () => void;
  closeContractModal: () => void;
  acceptContractOffer: (offer: ContractOffer) => void;
  requestTrade: () => void;
  advanceToNextNbaSeason: () => void;
  buyShopItem: (itemId: string) => void;
  createNewPlayer: (data: {
    firstName: string;
    lastName: string;
    country: CountryInfo;
    position: Position;
    primaryArchetype: Archetype;
    secondaryArchetype: Archetype;
    heightInches: number;
    weightLbs: number;
    wingspanInches: number;
    initialAttributes: PlayerAttributes;
    collegeTeamId: string;
  }) => void;
  simulateNextGame: () => Promise<void>;
  simulateBatchGames: (numGames: number) => Promise<void>;
  simulateFullSeason: () => Promise<void>;
  handleEventDecision: (choiceId: string) => void;
  declareForNbaDraft: () => void;
  stayInCollegeAnotherYear: () => void;
  completeDraftSelection: () => void;
  assignToGLeagueAction: () => void;
  recallFromGLeagueAction: () => void;
  retireAndInduct: () => void;
  saveToIndexedDb: () => Promise<void>;
  loadFromIndexedDb: () => Promise<boolean>;
  exportSave: () => string;
  importSave: (json: string) => boolean;
  resetGame: () => void;
}

function createInitialStandings(league: LeagueId): StandingsEntry[] {
  const teams = league === 'NBA' ? NBA_TEAMS : league === 'G_LEAGUE' ? G_LEAGUE_TEAMS : NCAA_TEAMS;
  return teams.map(t => ({
    teamId: t.id,
    league: t.league,
    conference: t.conference,
    division: t.division || null,
    wins: 0,
    losses: 0,
    winPct: 0,
    streak: '-',
    last10: '0-0',
    pointsFor: 0,
    pointsAgainst: 0,
  }));
}

export const useGameStore = create<GameState>((set, get) => ({
  player: null,
  currentScreen: 'CREATE_PLAYER',
  selectedBoxScore: null,
  recentGames: [],
  newsFeed: [],
  activeEvent: null,
  isSimulating: false,
  simProgress: null,
  isSeasonEndModalOpen: false,
  playoffBracket: null,
  isPlayoffsModalOpen: false,
  awardsGala: null,
  isAwardsModalOpen: false,
  contractOffers: [],
  isContractModalOpen: false,
  nbaStandings: createInitialStandings('NBA'),
  ncaaStandings: createInitialStandings('NCAA'),
  gleagueStandings: createInitialStandings('G_LEAGUE'),
  draftProjectedPick: null,
  draftLotteryResults: null,

  setScreen: (screen) => set({ currentScreen: screen }),
  openSeasonEndModal: () => set({ isSeasonEndModalOpen: true }),
  closeSeasonEndModal: () => set({ isSeasonEndModalOpen: false }),

  openPlayoffsModal: () => set({ isPlayoffsModalOpen: true }),
  closePlayoffsModal: () => set({ isPlayoffsModalOpen: false }),
  advancePlayoffs: () => {
    const { playoffBracket, player } = get();
    if (!playoffBracket) return;
    const updated = advancePlayoffBracket(playoffBracket, player);
    
    if (updated.isCompleted && player && updated.championTeamId === player.currentTeamId) {
      const pCopy: PlayerEntity = JSON.parse(JSON.stringify(player));
      pCopy.careerRecord.championships += 1;
      if (!pCopy.trophyCase.includes(`Campeão da NBA (${updated.seasonYear})`)) {
        pCopy.trophyCase.push(`Campeão da NBA (${updated.seasonYear})`);
      }
      if (updated.finalsMvpName === player.fullName) {
        pCopy.careerRecord.finalsMvps += 1;
        pCopy.trophyCase.push(`MVP das Finais (${updated.seasonYear})`);
      }
      set({ player: pCopy });
    }

    set({ playoffBracket: updated });
  },

  simulateEntirePlayoffs: () => {
    const { playoffBracket, player } = get();
    if (!playoffBracket) return;
    let curr = playoffBracket;
    while (!curr.isCompleted) {
      curr = advancePlayoffBracket(curr, player);
    }
    
    if (player && curr.championTeamId === player.currentTeamId) {
      const pCopy: PlayerEntity = JSON.parse(JSON.stringify(player));
      pCopy.careerRecord.championships += 1;
      if (!pCopy.trophyCase.includes(`Campeão da NBA (${curr.seasonYear})`)) {
        pCopy.trophyCase.push(`Campeão da NBA (${curr.seasonYear})`);
      }
      if (curr.finalsMvpName === player.fullName) {
        pCopy.careerRecord.finalsMvps += 1;
        pCopy.trophyCase.push(`MVP das Finais (${curr.seasonYear})`);
      }
      set({ player: pCopy });
    }

    set({ playoffBracket: curr });
  },

  openAwardsModal: () => set({ isAwardsModalOpen: true }),
  closeAwardsModal: () => set({ isAwardsModalOpen: false }),
  revealAward: (awardType: AwardType) => {
    const { awardsGala, player } = get();
    if (!awardsGala || !player) return;
    const copy: SeasonAwardsGala = JSON.parse(JSON.stringify(awardsGala));
    if (copy.awards[awardType]) {
      copy.awards[awardType].isRevealed = true;
      if (copy.awards[awardType].userWon) {
        const pCopy: PlayerEntity = JSON.parse(JSON.stringify(player));
        if (awardType === 'MVP') {
          pCopy.careerRecord.mvps += 1;
          pCopy.trophyCase.push(`MVP da NBA (${copy.seasonYear})`);
        } else if (awardType === 'DPOY') {
          pCopy.careerRecord.dpoyAwards += 1;
          pCopy.trophyCase.push(`Defensor do Ano (${copy.seasonYear})`);
        } else {
          pCopy.trophyCase.push(`${copy.awards[awardType].name} (${copy.seasonYear})`);
        }
        set({ player: pCopy });
      }
    }
    set({ awardsGala: copy });
  },

  openContractModal: () => set({ isContractModalOpen: true }),
  closeContractModal: () => set({ isContractModalOpen: false }),
  acceptContractOffer: (offer: ContractOffer) => {
    const { player } = get();
    if (!player) return;
    const updated: PlayerEntity = JSON.parse(JSON.stringify(player));
    const isTrade = Boolean(player.contract && player.contract.yearsRemaining > 0 && !offer.isExtension);

    updated.currentTeamId = offer.teamId;
    if (isTrade && player.contract) {
      // Mantém os anos restantes do contrato atual na troca
      updated.contract = {
        type: 'STANDARD_NBA',
        yearsTotal: player.contract.yearsTotal,
        yearsRemaining: player.contract.yearsRemaining,
        salaryPerYear: offer.salaryPerYear || player.contract.salaryPerYear,
      };
    } else {
      updated.contract = {
        type: 'STANDARD_NBA',
        yearsTotal: offer.yearsTotal,
        yearsRemaining: offer.yearsTotal,
        salaryPerYear: offer.salaryPerYear,
      };
    }

    const newTeam = getTeamById(offer.teamId);
    if (newTeam) applyDynamicTheme(newTeam);

    const headline = isTrade
      ? `BOMBA: ${updated.fullName} é negociado com o ${offer.teamName}!`
      : offer.isExtension
      ? `${updated.fullName} renova com o ${offer.teamName}!`
      : `${updated.fullName} assina com o ${offer.teamName}!`;

    const content = isTrade
      ? `Após negociação direta, a franquia confirmou a aquisição de ${updated.fullName} para assumir o papel de ${offer.teamFit?.expectedRole.replace(/_/g, ' ') || offer.role}.`
      : `Contrato de ${offer.yearsTotal} temporadas no valor de ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(offer.salaryPerYear)} por ano. O jogador assume o papel de ${offer.teamFit?.expectedRole.replace(/_/g, ' ') || offer.role}.`;

    const news: NewsItem = {
      id: `contract-news-${Date.now()}`,
      date: isTrade ? `Trade Deadline` : `Intertemporada ${updated.seasonStats.seasonYear}`,
      headline,
      content,
      category: 'TRANSACTION',
      teamId: offer.teamId,
    };

    set(state => ({
      player: updated,
      isContractModalOpen: false,
      newsFeed: [news, ...state.newsFeed],
    }));
  },

  requestTrade: () => {
    const { player } = get();
    if (!player) return;
    const options = generateTradeOptions(player);
    if (options.length === 0) return;
    
    // Abre o modal de propostas para o usuário escolher conscientemente o destino
    set({
      contractOffers: options,
      isContractModalOpen: true,
    });
  },

  createNewPlayer: (data) => {
    const ovr = calculateOverall(data.initialAttributes, data.position);
    const collegeTeam = getTeamById(data.collegeTeamId);

    const newPlayer: PlayerEntity = {
      id: `athlete-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      country: data.country,
      age: 18,
      birthYear: new Date().getFullYear() - 18,
      heightInches: data.heightInches,
      weightLbs: data.weightLbs,
      wingspanInches: data.wingspanInches,
      position: data.position,
      archetype: data.primaryArchetype,
      primaryArchetype: data.primaryArchetype,
      secondaryArchetype: data.secondaryArchetype,
      attributes: data.initialAttributes,
      potential: Math.min(99, ovr + 14),
      workEthic: 3.5,
      overall: ovr,
      moral: 85,
      chemistry: 80,
      energy: 100,
      injuryRisk: 5,
      isInjured: false,
      bankBalance: 0,
      purchasedItemIds: [],
      currentLeague: 'NCAA',
      currentTeamId: data.collegeTeamId,
      collegeTeamId: data.collegeTeamId,
      contract: {
        type: 'COLLEGE_SCHOLARSHIP',
        yearsTotal: 4,
        yearsRemaining: 4,
        salaryPerYear: 0,
      },
      seasonStats: {
        careerId: 1,
        seasonYear: new Date().getFullYear(),
        league: 'NCAA',
        teamId: data.collegeTeamId,
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
        playerName: `${data.firstName} ${data.lastName}`,
        birthYear: new Date().getFullYear() - 18,
        currentYear: new Date().getFullYear(),
        currentTeamId: data.collegeTeamId,
        isRetired: false,
        hallOfFameProbability: 0,
        dateSaved: Date.now(),
        collegeName: collegeTeam?.name,
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

    const initialNews: NewsItem = {
      id: `news-${Date.now()}`,
      date: 'Pré-Temporada',
      headline: `${newPlayer.fullName} compromete-se com ${collegeTeam?.name}!`,
      content: `O prospecto de 5 estrelas escolheu defender as cores de ${collegeTeam?.name} na NCAA Division I Men's Basketball. Olheiros já monitoram sua envergadura e QI de jogo.`,
      category: 'COLLEGE',
      teamId: collegeTeam?.id,
    };

    set({
      player: newPlayer,
      currentScreen: 'DASHBOARD',
      newsFeed: [initialNews],
    });

    // Injeta cores do time no CSS Root
    if (collegeTeam) {
      applyDynamicTheme(collegeTeam);
    }
  },

  simulateNextGame: async () => {
    const { player } = get();
    if (!player) return;

    const userTeam = getTeamById(player.currentTeamId);
    if (!userTeam) return;

    const leagueTeams = player.currentLeague === 'NBA' 
      ? NBA_TEAMS 
      : player.currentLeague === 'G_LEAGUE' 
      ? G_LEAGUE_TEAMS 
      : NCAA_TEAMS;

    const possibleOpponents = leagueTeams.filter(t => t.id !== userTeam.id);
    const opponent = possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];

    const isHome = Math.random() > 0.5;
    const home = isHome ? userTeam : opponent;
    const away = isHome ? opponent : userTeam;

    const boxScore = simulateMatch(home, away, player.currentLeague, player, `Jogo ${player.seasonStats.gamesPlayed + 1}`);

    // Atualiza estatísticas da temporada
    const updatedPlayer: PlayerEntity = JSON.parse(JSON.stringify(player));
    const s = updatedPlayer.seasonStats;

    if (boxScore.userPlayerGame) {
      const u = boxScore.userPlayerGame;
      s.gamesPlayed += 1;
      s.gamesStarted += 1;
      s.totalMinutes += u.minutes;
      s.totalPoints += u.points;
      s.totalFgm += u.fgm;
      s.totalFga += u.fga;
      s.totalFg3m += u.fg3m;
      s.totalFg3a += u.fg3a;
      s.totalFtm += u.ftm;
      s.totalFta += u.fta;
      s.totalOreb += u.oreb;
      s.totalDreb += u.dreb;
      s.totalReb += u.reb;
      s.totalAst += u.ast;
      s.totalStl += u.stl;
      s.totalBlk += u.blk;
      s.totalTov += u.tov;
      s.totalPf += u.pf;

      s.minutesPerGame = round(s.totalMinutes / s.gamesPlayed, 1);
      s.pointsPerGame = round(s.totalPoints / s.gamesPlayed, 1);
      s.reboundsPerGame = round(s.totalReb / s.gamesPlayed, 1);
      s.assistsPerGame = round(s.totalAst / s.gamesPlayed, 1);
      s.stealsPerGame = round(s.totalStl / s.gamesPlayed, 1);
      s.blocksPerGame = round(s.totalBlk / s.gamesPlayed, 1);
      s.turnoversPerGame = round(s.totalTov / s.gamesPlayed, 1);
      s.foulsPerGame = round(s.totalPf / s.gamesPlayed, 1);

      s.fgPct = s.totalFga > 0 ? round((s.totalFgm / s.totalFga) * 100, 1) : 0;
      s.fg3Pct = s.totalFg3a > 0 ? round((s.totalFg3m / s.totalFg3a) * 100, 1) : 0;
      s.ftPct = s.totalFta > 0 ? round((s.totalFtm / s.totalFta) * 100, 1) : 0;

      s.tsPct = calculateTS(s.totalPoints, s.totalFga, s.totalFta);
      s.efgPct = calculateEFG(s.totalFgm, s.totalFg3m, s.totalFga);
      s.usgPct = calculateUSG({
        fga: s.totalFga,
        fta: s.totalFta,
        tov: s.totalTov,
        mp: s.totalMinutes,
        teamMp: s.gamesPlayed * 240,
        teamFga: s.gamesPlayed * 88,
        teamFta: s.gamesPlayed * 22,
        teamTov: s.gamesPlayed * 14,
      });
      s.per = calculatePER({
        mp: s.totalMinutes,
        pts: s.totalPoints,
        reb: s.totalReb,
        ast: s.totalAst,
        stl: s.totalStl,
        blk: s.totalBlk,
        tov: s.totalTov,
        fgm: s.totalFgm,
        fga: s.totalFga,
        ftm: s.totalFtm,
        fta: s.totalFta,
        fg3m: s.totalFg3m,
        pf: s.totalPf,
      });

      const ws = calculateWinShares({
        mp: s.totalMinutes,
        pts: s.totalPoints,
        fga: s.totalFga,
        fta: s.totalFta,
        tov: s.totalTov,
        ast: s.totalAst,
        reb: s.totalReb,
        stl: s.totalStl,
        blk: s.totalBlk,
        gamesPlayed: s.gamesPlayed,
      });
      s.ows = ws.ows;
      s.dws = ws.dws;
      s.winShares = ws.total;

      // Two-Way game tracker
      if (updatedPlayer.contract.type === 'TWO_WAY' && updatedPlayer.currentLeague === 'NBA') {
        updatedPlayer.contract.nbaGamesPlayedThisYear = (updatedPlayer.contract.nbaGamesPlayedThisYear || 0) + 1;
      }
    }

    // Chance de evento narrativo aleatório a cada poucos jogos
    let triggeredEvent: CareerEvent | null = null;
    if (Math.random() < 0.22 && !get().activeEvent) {
      triggeredEvent = getRandomCareerEvent();
    }

    // Notícia sobre o jogo
    const won = (isHome && boxScore.homeScore > boxScore.awayScore) || (!isHome && boxScore.awayScore > boxScore.homeScore);
    const gameNews: NewsItem = {
      id: `game-news-${Date.now()}`,
      date: `Jogo ${s.gamesPlayed}`,
      headline: `${won ? 'Vitória' : 'Derrota'}: ${userTeam.shortName} ${isHome ? boxScore.homeScore : boxScore.awayScore} x ${isHome ? boxScore.awayScore : boxScore.homeScore} ${opponent.shortName}`,
      content: `${updatedPlayer.fullName} registrou ${boxScore.userPlayerGame?.points} PTS, ${boxScore.userPlayerGame?.reb} REB e ${boxScore.userPlayerGame?.ast} AST em ${boxScore.userPlayerGame?.minutes} minutos.`,
      category: 'GAME',
      teamId: userTeam.id,
    };

    set(state => ({
      player: updatedPlayer,
      selectedBoxScore: boxScore,
      recentGames: [boxScore, ...state.recentGames.slice(0, 19)],
      newsFeed: [gameNews, ...state.newsFeed.slice(0, 29)],
      activeEvent: triggeredEvent || state.activeEvent,
    }));

    // Se simulação individual atingiu o fim da temporada
    if (!get().isSimulating) {
      const maxG = updatedPlayer.currentLeague === 'NCAA' ? 32 : updatedPlayer.currentLeague === 'G_LEAGUE' ? 50 : 82;
      if (updatedPlayer.seasonStats.gamesPlayed >= maxG) {
        const earnedSalary = updatedPlayer.contract.salaryPerYear || 0;
        const passiveIncome = CAREER_SHOP_ITEMS
          .filter(item => updatedPlayer.purchasedItemIds?.includes(item.id) && item.yearlyPassiveIncome)
          .reduce((acc, cur) => acc + (cur.yearlyPassiveIncome || 0), 0);

        const updated: PlayerEntity = JSON.parse(JSON.stringify(updatedPlayer));
        updated.bankBalance = (updated.bankBalance || 0) + earnedSalary + passiveIncome;

        let gala: SeasonAwardsGala | null = null;
        let bracket: PlayoffBracket | null = null;
        let offers: ContractOffer[] = [];

        if (updated.currentLeague === 'NBA') {
          const teamWinsMap: Record<string, number> = {};
          get().nbaStandings.forEach(st => {
            teamWinsMap[st.teamId] = st.wins;
          });
          gala = calculateSeasonAwards(updated, teamWinsMap);
          bracket = initializePlayoffBracket(updated.seasonStats.seasonYear, get().nbaStandings, updated.currentTeamId);
          offers = generateContractOffers(updated);
        }

        set({
          player: updated,
          isSeasonEndModalOpen: true,
          awardsGala: gala,
          playoffBracket: bracket,
          contractOffers: offers,
        });
      }
    }
  },

  simulateBatchGames: async (numGames: number) => {
    set({ isSimulating: true, simProgress: { completed: 0, total: numGames } });

    for (let i = 0; i < numGames; i++) {
      await get().simulateNextGame();
      set({ simProgress: { completed: i + 1, total: numGames } });
    }

    set({ isSimulating: false, simProgress: null });

    // Verifica se a temporada atingiu o limite de jogos
    const currentP = get().player;
    if (currentP) {
      const maxG = currentP.currentLeague === 'NCAA' ? 32 : currentP.currentLeague === 'G_LEAGUE' ? 50 : 82;
      if (currentP.seasonStats.gamesPlayed >= maxG) {
        // Deposita salário e rendimentos passivos
        const earnedSalary = currentP.contract.salaryPerYear || 0;
        const passiveIncome = CAREER_SHOP_ITEMS
          .filter(item => currentP.purchasedItemIds?.includes(item.id) && item.yearlyPassiveIncome)
          .reduce((acc, cur) => acc + (cur.yearlyPassiveIncome || 0), 0);

        const updated: PlayerEntity = JSON.parse(JSON.stringify(currentP));
        updated.bankBalance = (updated.bankBalance || 0) + earnedSalary + passiveIncome;

        let gala: SeasonAwardsGala | null = null;
        let bracket: PlayoffBracket | null = null;
        let offers: ContractOffer[] = [];

        if (updated.currentLeague === 'NBA') {
          const teamWinsMap: Record<string, number> = {};
          get().nbaStandings.forEach(st => {
            teamWinsMap[st.teamId] = st.wins;
          });
          gala = calculateSeasonAwards(updated, teamWinsMap);
          bracket = initializePlayoffBracket(updated.seasonStats.seasonYear, get().nbaStandings, updated.currentTeamId);
          offers = generateContractOffers(updated);
        }

        set({
          player: updated,
          isSeasonEndModalOpen: true,
          awardsGala: gala,
          playoffBracket: bracket,
          contractOffers: offers,
        });
      }
    }
  },

  simulateFullSeason: async () => {
    const { player } = get();
    if (!player) return;

    const totalGames = player.currentLeague === 'NCAA' ? 32 : player.currentLeague === 'G_LEAGUE' ? 50 : 82;
    const remaining = Math.max(1, totalGames - player.seasonStats.gamesPlayed);
    await get().simulateBatchGames(remaining);
  },

  handleEventDecision: (choiceId: string) => {
    const { player, activeEvent } = get();
    if (!player || !activeEvent) return;

    const updated = applyEventChoice(player, activeEvent, choiceId);
    set({
      player: updated,
      activeEvent: null,
    });
  },

  declareForNbaDraft: () => {
    const { player } = get();
    if (!player) return;

    // Converte season atual e adiciona ao histórico da carreira
    const updatedPlayer: PlayerEntity = JSON.parse(JSON.stringify(player));
    updatedPlayer.careerStats.push({ ...updatedPlayer.seasonStats });

    // Evolução de atributos entre temporadas
    updatedPlayer.age += 1;
    updatedPlayer.attributes = evolveAttributes(
      updatedPlayer.attributes,
      updatedPlayer.age,
      updatedPlayer.potential,
      updatedPlayer.workEthic
    );
    updatedPlayer.overall = calculateOverall(updatedPlayer.attributes, updatedPlayer.position);

    // Avaliação no Draft Combine
    const draftStock = calculateDraftStock({
      overall: updatedPlayer.overall,
      potential: updatedPlayer.potential,
      heightInches: updatedPlayer.heightInches,
      collegeStats: updatedPlayer.seasonStats,
    });

    // Simula Loteria com os 14 piores times da NBA
    const lotteryTeams = NBA_TEAMS.slice(16, 30).map(t => t.id);
    const lottery = simulateDraftLottery(lotteryTeams);

    set({
      player: updatedPlayer,
      draftProjectedPick: draftStock.projectedPick,
      draftLotteryResults: lottery,
      currentScreen: 'DRAFT_CEREMONY',
      isSeasonEndModalOpen: false,
    });
  },

  stayInCollegeAnotherYear: () => {
    const { player } = get();
    if (!player) return;

    const updatedPlayer: PlayerEntity = JSON.parse(JSON.stringify(player));
    updatedPlayer.careerStats.push({ ...updatedPlayer.seasonStats });
    updatedPlayer.age += 1;
    // Bônus adicional de treino sob tutela universitária
    updatedPlayer.attributes = evolveAttributes(
      updatedPlayer.attributes,
      updatedPlayer.age,
      updatedPlayer.potential,
      updatedPlayer.workEthic * 1.2
    );
    updatedPlayer.overall = calculateOverall(updatedPlayer.attributes, updatedPlayer.position);

    // Reseta estatísticas da temporada
    updatedPlayer.seasonStats = {
      ...updatedPlayer.seasonStats,
      seasonYear: updatedPlayer.seasonStats.seasonYear + 1,
      gamesPlayed: 0,
      gamesStarted: 0,
      totalMinutes: 0,
      totalPoints: 0,
      totalFgm: 0,
      totalFga: 0,
      totalFg3m: 0,
      totalFg3a: 0,
      totalFtm: 0,
      totalFta: 0,
      totalReb: 0,
      totalAst: 0,
      totalStl: 0,
      totalBlk: 0,
      totalTov: 0,
      totalPf: 0,
      pointsPerGame: 0,
      reboundsPerGame: 0,
      assistsPerGame: 0,
      winShares: 0,
      per: 0,
    };

    set({ 
      player: updatedPlayer, 
      ncaaStandings: createInitialStandings('NCAA'),
      currentScreen: 'DASHBOARD',
      isSeasonEndModalOpen: false 
    });
  },

  completeDraftSelection: () => {
    const { player, draftProjectedPick, draftLotteryResults } = get();
    if (!player) return;

    const pick = draftProjectedPick || 1;
    const isFirstRound = pick <= 30;

    // Encontra o time sorteado para essa escolha
    let draftingTeamId = 'bos-celtics';
    if (draftLotteryResults && pick <= draftLotteryResults.length) {
      draftingTeamId = draftLotteryResults[pick - 1].teamId;
    } else {
      const nbaTeam = NBA_TEAMS[(pick - 1) % NBA_TEAMS.length];
      draftingTeamId = nbaTeam.id;
    }

    const draftingTeam = getTeamById(draftingTeamId) || NBA_TEAMS[0];

    const updatedPlayer: PlayerEntity = JSON.parse(JSON.stringify(player));
    updatedPlayer.currentLeague = isFirstRound ? 'NBA' : 'G_LEAGUE';
    updatedPlayer.currentTeamId = isFirstRound ? draftingTeam.id : (getGLeagueAffiliate(draftingTeam.id)?.id || 'maine-celtics');
    updatedPlayer.draftInfo = {
      year: new Date().getFullYear(),
      round: isFirstRound ? 1 : 2,
      pick,
      originalTeamId: draftingTeam.id,
    };

    // Assina contrato CBA
    updatedPlayer.contract = isFirstRound 
      ? createRookieScaleContract(pick)
      : createTwoWayContract();

    // Reseta temporada para ano de estreia profissional
    updatedPlayer.seasonStats = {
      careerId: 1,
      seasonYear: new Date().getFullYear(),
      league: updatedPlayer.currentLeague,
      teamId: updatedPlayer.currentTeamId,
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
    };

    applyDynamicTheme(draftingTeam);

    const draftNews: NewsItem = {
      id: `draft-news-${Date.now()}`,
      date: 'Noite do Draft',
      headline: `${updatedPlayer.fullName} é selecionado na escolha #${pick} pelo ${draftingTeam.name}!`,
      content: `O comissário anunciou a escolha no palco do Barclays Center. O jogador assinou o seu vínculo oficial sob as regras do CBA da NBA.`,
      category: 'TRANSACTION',
      teamId: draftingTeam.id,
    };

    set(state => ({
      player: updatedPlayer,
      nbaStandings: createInitialStandings('NBA'),
      currentScreen: 'DASHBOARD',
      newsFeed: [draftNews, ...state.newsFeed],
    }));
  },

  assignToGLeagueAction: () => {
    const { player } = get();
    if (!player || player.currentLeague !== 'NBA') return;

    const affiliate = getGLeagueAffiliate(player.currentTeamId);
    if (!affiliate) return;

    const updated = { ...player, currentLeague: 'G_LEAGUE' as LeagueId, currentTeamId: affiliate.id };
    applyDynamicTheme(affiliate);
    set({ player: updated });
  },

  recallFromGLeagueAction: () => {
    const { player } = get();
    if (!player || player.currentLeague !== 'G_LEAGUE') return;

    const parentNba = getParentNbaTeam(player.currentTeamId);
    if (!parentNba) return;

    const updated = { ...player, currentLeague: 'NBA' as LeagueId, currentTeamId: parentNba.id };
    applyDynamicTheme(parentNba);
    set({ player: updated });
  },

  advanceToNextNbaSeason: () => {
    const { player } = get();
    if (!player) return;

    const updatedPlayer: PlayerEntity = JSON.parse(JSON.stringify(player));
    updatedPlayer.careerStats.push({ ...updatedPlayer.seasonStats });
    updatedPlayer.age += 1;
    updatedPlayer.attributes = evolveAttributes(
      updatedPlayer.attributes,
      updatedPlayer.age,
      updatedPlayer.potential,
      updatedPlayer.workEthic
    );
    updatedPlayer.overall = calculateOverall(updatedPlayer.attributes, updatedPlayer.position);

    if (updatedPlayer.contract.yearsRemaining > 1) {
      updatedPlayer.contract.yearsRemaining -= 1;
    } else {
      updatedPlayer.contract.yearsRemaining = 3;
      updatedPlayer.contract.yearsTotal = 3;
      updatedPlayer.contract.salaryPerYear = Math.round(updatedPlayer.contract.salaryPerYear * 1.15);
    }

    const nextYear = updatedPlayer.seasonStats.seasonYear + 1;
    updatedPlayer.seasonStats = {
      careerId: 1,
      seasonYear: nextYear,
      league: updatedPlayer.currentLeague,
      teamId: updatedPlayer.currentTeamId,
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
    };

    const team = getTeamById(updatedPlayer.currentTeamId);
    const startNews: NewsItem = {
      id: `season-start-${Date.now()}`,
      date: `Pré-Temporada ${nextYear}`,
      headline: `Abertura Oficial da Temporada ${nextYear}!`,
      content: `${updatedPlayer.fullName} inicia seu ${updatedPlayer.careerStats.length + 1}º ano profissional atuando pelo ${team?.name}. O elenco está pronto para a disputa!`,
      category: 'GAME',
      teamId: updatedPlayer.currentTeamId,
    };

    set(state => ({
      player: updatedPlayer,
      isSeasonEndModalOpen: false,
      isPlayoffsModalOpen: false,
      isAwardsModalOpen: false,
      isContractModalOpen: false,
      awardsGala: null,
      playoffBracket: null,
      contractOffers: [],
      nbaStandings: createInitialStandings('NBA'),
      currentScreen: 'DASHBOARD',
      newsFeed: [startNews, ...state.newsFeed],
    }));
  },

  buyShopItem: (itemId: string) => {
    const { player } = get();
    if (!player) return;

    const item = CAREER_SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (player.bankBalance < item.price) return;
    if (player.purchasedItemIds?.includes(itemId)) return;

    const updated: PlayerEntity = JSON.parse(JSON.stringify(player));
    updated.bankBalance -= item.price;
    updated.purchasedItemIds = [...(updated.purchasedItemIds || []), itemId];

    if (item.attributeBonuses) {
      for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
        const key = attr as keyof PlayerAttributes;
        if (typeof bonus === 'number') {
          updated.attributes[key] = Math.min(99, updated.attributes[key] + bonus);
        }
      }
      updated.overall = calculateOverall(updated.attributes, updated.position);
    }

    if (item.moralBonus) {
      updated.moral = Math.min(100, updated.moral + item.moralBonus);
    }
    if (item.energyBonus) {
      updated.energy = Math.min(100, updated.energy + item.energyBonus);
    }
    if (item.injuryRiskReduction) {
      updated.injuryRisk = Math.max(1, updated.injuryRisk - item.injuryRiskReduction);
    }

    set({ player: updated });
  },

  retireAndInduct: () => {
    const { player } = get();
    if (!player) return;

    // Calcula probabilidade de entrada no Hall da Fama
    const peakWS = Math.max(0, ...player.careerStats.map(s => s.winShares));
    const hofResult = calculateHallOfFameProbability({
      heightInches: player.heightInches,
      championships: player.careerRecord.championships,
      leaderboardPts: player.careerRecord.leaderboardPoints,
      peakWS,
      allStarSelections: player.careerRecord.allStarSelections,
    });

    const updated: PlayerEntity = JSON.parse(JSON.stringify(player));
    updated.isRetired = true;
    updated.careerRecord.isRetired = true;
    updated.careerRecord.hallOfFameProbability = hofResult.probability;
    updated.careerRecord.peakWinShares = peakWS;

    set({
      player: updated,
      currentScreen: 'RETIREMENT',
    });
  },

  saveToIndexedDb: async () => {
    const { player, recentGames } = get();
    if (!player) return;
    await savePlayerCareer(player, recentGames);
  },

  loadFromIndexedDb: async () => {
    const loaded = await loadLatestCareer();
    if (loaded && loaded.player) {
      set({
        player: loaded.player,
        recentGames: loaded.recentGames || [],
        currentScreen: 'DASHBOARD',
      });
      const team = getTeamById(loaded.player.currentTeamId);
      if (team) applyDynamicTheme(team);
      return true;
    }
    return false;
  },

  exportSave: () => {
    const { player, recentGames } = get();
    if (!player) return '';
    return exportSaveToJson({
      saveName: `${player.fullName} (${player.currentLeague})`,
      updatedAt: Date.now(),
      player,
      recentGames,
    });
  },

  importSave: (jsonString: string) => {
    try {
      const parsed = importSaveFromJson(jsonString);
      set({
        player: parsed.player,
        recentGames: parsed.recentGames || [],
        currentScreen: 'DASHBOARD',
      });
      const team = getTeamById(parsed.player.currentTeamId);
      if (team) applyDynamicTheme(team);
      return true;
    } catch {
      return false;
    }
  },

  resetGame: () => {
    set({
      player: null,
      currentScreen: 'CREATE_PLAYER',
      selectedBoxScore: null,
      recentGames: [],
      newsFeed: [],
      activeEvent: null,
    });
  },
}));

/**
 * Injeta dinamicamente as variáveis CSS da equipe atual no :root da página
 */
export function applyDynamicTheme(team: TeamEntity) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--team-primary', team.colors.primary);
  root.style.setProperty('--team-secondary', team.colors.secondary);
  root.style.setProperty('--team-contrast', team.colors.text);

  // Hex para RGBA para brilho (glow)
  const hex = team.colors.primary.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 122;
  const b = parseInt(hex.substring(4, 6), 16) || 51;
  root.style.setProperty('--team-glow', `rgba(${r}, ${g}, ${b}, 0.28)`);
}
