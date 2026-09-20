import { 
  PlayoffBracket, 
  PlayoffMatchup, 
  StandingsEntry, 
  PlayerEntity 
} from '../types';
import { NBA_TEAMS, getTeamById } from '../data/teamsRepository';

/**
 * Retorna a posição oficial e registro de uma equipe na sua conferência
 */
export function getTeamConferenceRank(
  teamId: string, 
  standings: StandingsEntry[]
): { rank: number; conference: string; wins: number; losses: number; madePlayoffs: boolean } {
  const team = getTeamById(teamId);
  const conference = team?.conference || 'Eastern';

  const confStandings = standings
    .filter(s => s.conference === conference)
    .sort((a, b) => b.wins - a.wins || a.losses - b.losses);

  const idx = confStandings.findIndex(s => s.teamId === teamId);
  const rank = idx >= 0 ? idx + 1 : 8;
  const entry = confStandings[idx];

  return {
    rank,
    conference,
    wins: entry?.wins || 41,
    losses: entry?.losses || 41,
    madePlayoffs: rank <= 8,
  };
}

/**
 * Cria a árvore oficial de Playoffs da NBA com os 8 melhores do Leste e Oeste
 */
export function initializePlayoffBracket(
  seasonYear: number,
  standings: StandingsEntry[],
  userTeamId: string
): PlayoffBracket {
  const eastRanked = standings
    .filter(s => s.conference === 'Eastern')
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 8)
    .map(s => s.teamId);

  const westRanked = standings
    .filter(s => s.conference === 'Western')
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 8)
    .map(s => s.teamId);

  // Garante preenchimento caso standings ainda estejam zeradas
  const fallbackEast = NBA_TEAMS.filter(t => t.conference === 'Eastern').map(t => t.id).slice(0, 8);
  const fallbackWest = NBA_TEAMS.filter(t => t.conference === 'Western').map(t => t.id).slice(0, 8);

  const eSeeds = eastRanked.length === 8 ? eastRanked : fallbackEast;
  const wSeeds = westRanked.length === 8 ? westRanked : fallbackWest;

  // Confrontos 1v8, 4v5, 3v6, 2v7
  const createR1Matchup = (highSeed: string, lowSeed: string, conf: 'Eastern' | 'Western', idSuffix: string): PlayoffMatchup => ({
    id: `r1-${conf.toLowerCase()}-${idSuffix}`,
    round: 1,
    conference: conf,
    highSeedTeamId: highSeed,
    lowSeedTeamId: lowSeed,
    highSeedWins: 0,
    lowSeedWins: 0,
    isUserInvolved: highSeed === userTeamId || lowSeed === userTeamId,
    status: 'IN_PROGRESS',
  });

  const easternR1: PlayoffMatchup[] = [
    createR1Matchup(eSeeds[0], eSeeds[7], 'Eastern', '1v8'),
    createR1Matchup(eSeeds[3], eSeeds[4], 'Eastern', '4v5'),
    createR1Matchup(eSeeds[2], eSeeds[5], 'Eastern', '3v6'),
    createR1Matchup(eSeeds[1], eSeeds[6], 'Eastern', '2v7'),
  ];

  const westernR1: PlayoffMatchup[] = [
    createR1Matchup(wSeeds[0], wSeeds[7], 'Western', '1v8'),
    createR1Matchup(wSeeds[3], wSeeds[4], 'Western', '4v5'),
    createR1Matchup(wSeeds[2], wSeeds[5], 'Western', '3v6'),
    createR1Matchup(wSeeds[1], wSeeds[6], 'Western', '2v7'),
  ];

  // Estruturas vazias para as próximas fases
  const createEmptyMatchup = (id: string, round: 1 | 2 | 3 | 4, conf: 'Eastern' | 'Western' | 'Finals'): PlayoffMatchup => ({
    id,
    round,
    conference: conf,
    highSeedTeamId: '',
    lowSeedTeamId: '',
    highSeedWins: 0,
    lowSeedWins: 0,
    isUserInvolved: false,
    status: 'PENDING',
  });

  return {
    seasonYear,
    easternR1,
    westernR1,
    easternSemis: [
      createEmptyMatchup('semis-east-1', 2, 'Eastern'),
      createEmptyMatchup('semis-east-2', 2, 'Eastern'),
    ],
    westernSemis: [
      createEmptyMatchup('semis-west-1', 2, 'Western'),
      createEmptyMatchup('semis-west-2', 2, 'Western'),
    ],
    easternConfFinals: createEmptyMatchup('cf-east', 3, 'Eastern'),
    westernConfFinals: createEmptyMatchup('cf-west', 3, 'Western'),
    nbaFinals: createEmptyMatchup('nba-finals', 4, 'Finals'),
    isCompleted: false,
  };
}

/**
 * Simula uma série completa de playoffs (melhor de 7)
 */
export function resolvePlayoffSeries(
  matchup: PlayoffMatchup,
  userPlayer: PlayerEntity | null = null
): PlayoffMatchup {
  if (matchup.status === 'COMPLETED' || !matchup.highSeedTeamId || !matchup.lowSeedTeamId) {
    return matchup;
  }

  const highTeam = getTeamById(matchup.highSeedTeamId);
  const lowTeam = getTeamById(matchup.lowSeedTeamId);

  let highRating = (highTeam?.ratingOffense || 80) + (highTeam?.ratingDefense || 80);
  let lowRating = (lowTeam?.ratingOffense || 80) + (lowTeam?.ratingDefense || 80);

  // Impacto do jogador se estiver na série
  if (userPlayer) {
    const userBonus = (userPlayer.overall - 75) * 0.4;
    if (matchup.highSeedTeamId === userPlayer.currentTeamId) highRating += userBonus;
    if (matchup.lowSeedTeamId === userPlayer.currentTeamId) lowRating += userBonus;
  }

  let highWins = matchup.highSeedWins;
  let lowWins = matchup.lowSeedWins;

  while (highWins < 4 && lowWins < 4) {
    const homeAdvantage = (highWins + lowWins) % 2 === 0 ? 3 : -3;
    const diff = (highRating - lowRating) + homeAdvantage;
    const highWinProb = 1 / (1 + Math.pow(10, -diff / 25));
    if (Math.random() < highWinProb) {
      highWins++;
    } else {
      lowWins++;
    }
  }

  const winnerTeamId = highWins >= 4 ? matchup.highSeedTeamId : matchup.lowSeedTeamId;

  return {
    ...matchup,
    highSeedWins: highWins,
    lowSeedWins: lowWins,
    winnerTeamId,
    status: 'COMPLETED',
  };
}

/**
 * Avança o chaveamento dos playoffs resolvendo a fase atual e gerando os próximos confrontos
 */
export function advancePlayoffBracket(
  bracket: PlayoffBracket,
  userPlayer: PlayerEntity | null = null
): PlayoffBracket {
  const updated: PlayoffBracket = JSON.parse(JSON.stringify(bracket));
  const userTeamId = userPlayer?.currentTeamId || '';

  // 1. Resolve Rodada 1
  if (updated.easternR1.some(m => m.status !== 'COMPLETED')) {
    updated.easternR1 = updated.easternR1.map(m => resolvePlayoffSeries(m, userPlayer));
    updated.westernR1 = updated.westernR1.map(m => resolvePlayoffSeries(m, userPlayer));

    // Monta Semifinais
    const eW = updated.easternR1.map(m => m.winnerTeamId || m.highSeedTeamId);
    const wW = updated.westernR1.map(m => m.winnerTeamId || m.highSeedTeamId);

    updated.easternSemis = [
      {
        id: 'semis-east-1',
        round: 2,
        conference: 'Eastern',
        highSeedTeamId: eW[0],
        lowSeedTeamId: eW[1],
        highSeedWins: 0,
        lowSeedWins: 0,
        isUserInvolved: eW[0] === userTeamId || eW[1] === userTeamId,
        status: 'IN_PROGRESS',
      },
      {
        id: 'semis-east-2',
        round: 2,
        conference: 'Eastern',
        highSeedTeamId: eW[2],
        lowSeedTeamId: eW[3],
        highSeedWins: 0,
        lowSeedWins: 0,
        isUserInvolved: eW[2] === userTeamId || eW[3] === userTeamId,
        status: 'IN_PROGRESS',
      }
    ];

    updated.westernSemis = [
      {
        id: 'semis-west-1',
        round: 2,
        conference: 'Western',
        highSeedTeamId: wW[0],
        lowSeedTeamId: wW[1],
        highSeedWins: 0,
        lowSeedWins: 0,
        isUserInvolved: wW[0] === userTeamId || wW[1] === userTeamId,
        status: 'IN_PROGRESS',
      },
      {
        id: 'semis-west-2',
        round: 2,
        conference: 'Western',
        highSeedTeamId: wW[2],
        lowSeedTeamId: wW[3],
        highSeedWins: 0,
        lowSeedWins: 0,
        isUserInvolved: wW[2] === userTeamId || wW[3] === userTeamId,
        status: 'IN_PROGRESS',
      }
    ];

    return updated;
  }

  // 2. Resolve Semifinais
  if (updated.easternSemis.some(m => m.status !== 'COMPLETED')) {
    updated.easternSemis = updated.easternSemis.map(m => resolvePlayoffSeries(m, userPlayer));
    updated.westernSemis = updated.westernSemis.map(m => resolvePlayoffSeries(m, userPlayer));

    const eF = updated.easternSemis.map(m => m.winnerTeamId || m.highSeedTeamId);
    const wF = updated.westernSemis.map(m => m.winnerTeamId || m.highSeedTeamId);

    updated.easternConfFinals = {
      id: 'cf-east',
      round: 3,
      conference: 'Eastern',
      highSeedTeamId: eF[0],
      lowSeedTeamId: eF[1],
      highSeedWins: 0,
      lowSeedWins: 0,
      isUserInvolved: eF[0] === userTeamId || eF[1] === userTeamId,
      status: 'IN_PROGRESS',
    };

    updated.westernConfFinals = {
      id: 'cf-west',
      round: 3,
      conference: 'Western',
      highSeedTeamId: wF[0],
      lowSeedTeamId: wF[1],
      highSeedWins: 0,
      lowSeedWins: 0,
      isUserInvolved: wF[0] === userTeamId || wF[1] === userTeamId,
      status: 'IN_PROGRESS',
    };

    return updated;
  }

  // 3. Resolve Finais de Conferência
  if (updated.easternConfFinals.status !== 'COMPLETED' || updated.westernConfFinals.status !== 'COMPLETED') {
    updated.easternConfFinals = resolvePlayoffSeries(updated.easternConfFinals, userPlayer);
    updated.westernConfFinals = resolvePlayoffSeries(updated.westernConfFinals, userPlayer);

    const eastChampion = updated.easternConfFinals.winnerTeamId || updated.easternConfFinals.highSeedTeamId;
    const westChampion = updated.westernConfFinals.winnerTeamId || updated.westernConfFinals.highSeedTeamId;

    updated.nbaFinals = {
      id: 'nba-finals',
      round: 4,
      conference: 'Finals',
      highSeedTeamId: eastChampion,
      lowSeedTeamId: westChampion,
      highSeedWins: 0,
      lowSeedWins: 0,
      isUserInvolved: eastChampion === userTeamId || westChampion === userTeamId,
      status: 'IN_PROGRESS',
    };

    return updated;
  }

  // 4. Resolve Finais da NBA e Coroa Campeão
  if (updated.nbaFinals.status !== 'COMPLETED') {
    updated.nbaFinals = resolvePlayoffSeries(updated.nbaFinals, userPlayer);
    const championId = updated.nbaFinals.winnerTeamId || updated.nbaFinals.highSeedTeamId;
    updated.championTeamId = championId;
    updated.isCompleted = true;

    // Determina Finals MVP
    if (userPlayer && championId === userPlayer.currentTeamId) {
      updated.finalsMvpName = userPlayer.fullName;
    } else {
      const champTeam = getTeamById(championId);
      updated.finalsMvpName = `Estrela do ${champTeam?.shortName || 'Campeão'}`;
    }

    return updated;
  }

  return updated;
}
