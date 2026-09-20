import { 
  TeamEntity, 
  PlayerEntity, 
  GameBoxScore, 
  PlayerGameStats, 
  PeriodScore, 
  LeagueId 
} from '../types';
import { clamp, normalRandom, chance } from './mathUtils';

/**
 * Simula uma posse individual do atleta criado pelo jogador.
 */
export function resolveUserPossession(
  player: PlayerEntity,
  oppDefPerim: number,
  oppDefPaint: number,
  teamORtg: number
): {
  action: '3PT_MAKE' | '3PT_MISS' | '2PT_MAKE' | '2PT_MISS' | 'AST' | 'TOV' | 'FOUL_DRAWN';
  points: number;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
  ast: number;
  tov: number;
} {
  const attrs = player.attributes;

  // 1. Probabilidade de Turnover
  const pTov = clamp(
    0.22 - ((attrs.ballControl * 0.6 + attrs.offensiveIQ * 0.4) / 100) * 0.15 + (oppDefPerim - 50) / 300,
    0.04,
    0.25
  );

  if (chance(pTov)) {
    return {
      action: 'TOV',
      points: 0,
      fgm: 0,
      fga: 0,
      fg3m: 0,
      fg3a: 0,
      ftm: 0,
      fta: 0,
      ast: 0,
      tov: 1,
    };
  }

  // 2. Probabilidade de Assistência (passe produtivo)
  const pAst = clamp(
    ((attrs.passing * 0.7 + attrs.offensiveIQ * 0.3) / 100) * 0.38 * (teamORtg / 110),
    0.02,
    0.45
  );

  if (chance(pAst)) {
    return {
      action: 'AST',
      points: 0,
      fgm: 0,
      fga: 0,
      fg3m: 0,
      fg3a: 0,
      ftm: 0,
      fta: 0,
      ast: 1,
      tov: 0,
    };
  }

  // 3. Faltas sofridas e lances livres
  const pFta = clamp(
    0.10 + ((attrs.strength * 0.5 + attrs.slashing * 0.5) / 100) * 0.35,
    0.05,
    0.50
  );

  if (chance(pFta)) {
    const shotNoise = normalRandom(0, 0.02);
    const ftPct = clamp(0.45 + (attrs.freeThrow / 100) * 0.48 + shotNoise, 0.40, 0.95);
    const attempts = chance(0.12) ? 3 : 2; // se cavou falta de 3pts
    let ftm = 0;
    for (let f = 0; f < attempts; f++) {
      if (chance(ftPct)) ftm++;
    }
    return {
      action: 'FOUL_DRAWN',
      points: ftm,
      fgm: 0,
      fga: 0,
      fg3m: 0,
      fg3a: 0,
      ftm,
      fta: attempts,
      ast: 0,
      tov: 0,
    };
  }

  // 4. Arremesso de 3 pontos vs 2 pontos
  const p3pa = clamp(0.05 + (attrs.threePoint / 100) * 0.45, 0.05, 0.65);
  const shotNoise = normalRandom(0, 0.02);

  if (chance(p3pa)) {
    const pct3p = clamp(
      0.22 + (attrs.threePoint / 100) * 0.22 - (oppDefPerim - 50) / 250 + shotNoise,
      0.15,
      0.48
    );
    const make = chance(pct3p);
    return {
      action: make ? '3PT_MAKE' : '3PT_MISS',
      points: make ? 3 : 0,
      fgm: make ? 1 : 0,
      fga: 1,
      fg3m: make ? 1 : 0,
      fg3a: 1,
      ftm: 0,
      fta: 0,
      ast: 0,
      tov: 0,
    };
  } else {
    // 2 pontos
    const pct2p = clamp(
      0.38 + ((attrs.inside * 0.6 + attrs.midRange * 0.4) / 100) * 0.26 - (oppDefPaint - 50) / 250 + shotNoise,
      0.25,
      0.70
    );
    const make = chance(pct2p);
    return {
      action: make ? '2PT_MAKE' : '2PT_MISS',
      points: make ? 2 : 0,
      fgm: make ? 1 : 0,
      fga: 1,
      fg3m: 0,
      fg3a: 0,
      ftm: 0,
      fta: 0,
      ast: 0,
      tov: 0,
    };
  }
}

/**
 * Simula a linha estatística de uma partida para o jogador humano.
 */
export function simulateUserPlayerGame(
  player: PlayerEntity,
  oppTeam: TeamEntity,
  myTeam: TeamEntity,
  pace: number,
  regulationMinutes: number = 48
): PlayerGameStats {
  const attrs = player.attributes;

  // Minutos calculados com base no OVR e stamina (calouros têm menos minutos, estrelas jogam 34-38 min)
  const isCollege = player.currentLeague === 'NCAA';
  const maxMins = isCollege ? 36 : 40;
  const baseMins = (player.overall / 99) * (maxMins - 14) + 14;
  const minutes = Math.round(clamp(normalRandom(baseMins, 2.5), 8, maxMins));

  // Taxa de uso (Usage Rate) estimada para o jogador (20% é a média)
  const usg = clamp(16 + ((attrs.offensiveIQ + attrs.threePoint + attrs.inside) / 300) * 16, 14, 34);

  // Posses em que o atleta intervém diretamente (fatia de USG% das posses em quadra)
  const rawPoss = (minutes / regulationMinutes) * pace * (usg / 100);
  const playerPossessions = Math.max(4, Math.round(rawPoss));

  let points = 0;
  let fgm = 0;
  let fga = 0;
  let fg3m = 0;
  let fg3a = 0;
  let ftm = 0;
  let fta = 0;
  let ast = 0;
  let tov = 0;

  const oppDefPerim = oppTeam.ratingDefense ?? 75;
  const oppDefPaint = oppTeam.ratingDefense ?? 75;
  const teamORtg = myTeam.ratingOffense ?? 80;

  for (let p = 0; p < playerPossessions; p++) {
    const res = resolveUserPossession(player, oppDefPerim, oppDefPaint, teamORtg);
    points += res.points;
    fgm += res.fgm;
    fga += res.fga;
    fg3m += res.fg3m;
    fg3a += res.fg3a;
    ftm += res.ftm;
    fta += res.fta;
    ast += res.ast;
    tov += res.tov;
  }

  // Rebotes: dependem da posição, altura e atributos
  const posRebWeight = player.position === 'C' ? 1.8 : player.position === 'PF' ? 1.4 : player.position === 'SF' ? 0.9 : 0.5;
  const baseDReb = ((attrs.defensiveRebound * 0.7 + attrs.strength * 0.3) / 100) * 7.5 * posRebWeight * (minutes / 36);
  const baseOReb = ((attrs.offensiveRebound * 0.8 + attrs.vertical * 0.2) / 100) * 3.0 * posRebWeight * (minutes / 36);
  const dreb = Math.max(0, Math.round(clamp(normalRandom(baseDReb, 1.8), 0, 22)));
  const oreb = Math.max(0, Math.round(clamp(normalRandom(baseOReb, 1.2), 0, 10)));
  const reb = dreb + oreb;

  // Roubos de bola
  const baseStl = ((attrs.steal * 0.7 + attrs.perimeterDefense * 0.3) / 100) * 1.8 * (minutes / 36);
  const stl = Math.max(0, Math.round(clamp(normalRandom(baseStl, 0.9), 0, 6)));

  // Tocos
  const posBlkWeight = player.position === 'C' ? 2.0 : player.position === 'PF' ? 1.4 : 0.4;
  const baseBlk = ((attrs.block * 0.7 + attrs.vertical * 0.3) / 100) * 1.6 * posBlkWeight * (minutes / 36);
  const blk = Math.max(0, Math.round(clamp(normalRandom(baseBlk, 0.8), 0, 7)));

  // Faltas
  const fouls = Math.max(0, Math.round(clamp(normalRandom(2.4, 1.1), 0, 5)));

  return {
    playerId: player.id,
    playerName: player.fullName,
    teamId: myTeam.id,
    minutes,
    points,
    fgm,
    fga,
    fg3m,
    fg3a,
    ftm,
    fta,
    oreb,
    dreb,
    reb,
    ast,
    stl,
    blk,
    tov,
    pf: fouls,
    plusMinus: 0, // calculado no contexto do placar final
  };
}

/**
 * Gera os nomes dos companheiros ou adversários simulados.
 */
function generateRosterNames(team: TeamEntity): string[] {
  const prefix = team.shortName.slice(0, 4);
  return [
    `${prefix} Starter 1`,
    `${prefix} Starter 2`,
    `${prefix} Starter 3`,
    `${prefix} Starter 4`,
    `${prefix} 6th Man`,
    `${prefix} Role Player`,
  ];
}

/**
 * Simula uma partida completa entre duas equipes com box score completo.
 */
export function simulateMatch(
  homeTeam: TeamEntity,
  awayTeam: TeamEntity,
  league: LeagueId,
  userPlayer?: PlayerEntity,
  date: string = new Date().toISOString().split('T')[0]
): GameBoxScore {
  const isNCAA = league === 'NCAA';
  const regulationMinutes = isNCAA ? 40 : 48;

  // Ritmo do jogo (Pace)
  const homePace = homeTeam.ratingPace ?? (isNCAA ? 71 : 99);
  const awayPace = awayTeam.ratingPace ?? (isNCAA ? 71 : 99);
  const paceNoise = normalRandom(0, 2.5);
  const totalPace = clamp(Math.round((homePace + awayPace) / 2 + paceNoise), isNCAA ? 60 : 88, isNCAA ? 85 : 118);

  // Vantagem de jogar em casa (~3.0 pontos)
  const homeAdvantage = 3.0;

  // Simulação do jogador humano se estiver em uma das equipes
  let userStats: PlayerGameStats | undefined;
  const isUserHome = userPlayer && userPlayer.currentTeamId === homeTeam.id;
  const isUserAway = userPlayer && userPlayer.currentTeamId === awayTeam.id;

  if (isUserHome && userPlayer) {
    userStats = simulateUserPlayerGame(userPlayer, awayTeam, homeTeam, totalPace, regulationMinutes);
  } else if (isUserAway && userPlayer) {
    userStats = simulateUserPlayerGame(userPlayer, homeTeam, awayTeam, totalPace, regulationMinutes);
  }

  // Pontuação base esperada
  const leagueBaseScore = isNCAA ? 72 : 112;
  const homeOff = homeTeam.ratingOffense ?? 80;
  const homeDef = homeTeam.ratingDefense ?? 80;
  const awayOff = awayTeam.ratingOffense ?? 80;
  const awayDef = awayTeam.ratingDefense ?? 80;

  let expectedHome = leagueBaseScore + (homeOff - awayDef) * 0.45 + homeAdvantage + normalRandom(0, 6.5);
  let expectedAway = leagueBaseScore + (awayOff - homeDef) * 0.45 + normalRandom(0, 6.5);

  let homeTotal = Math.max(50, Math.round(expectedHome));
  let awayTotal = Math.max(50, Math.round(awayAwayTotalAdjusted(expectedAway, homeTotal)));

  // Distribuição por quartos (Q1, Q2, Q3, Q4)
  const homePeriods = distributeQuarterScores(homeTotal);
  const awayPeriods = distributeQuarterScores(awayTotal);

  // Se houver empate no final do Q4, adiciona Overtime (OT)
  if (homeTotal === awayTotal) {
    const otHome = Math.round(clamp(normalRandom(10, 3), 4, 18));
    let otAway = Math.round(clamp(normalRandom(10, 3), 4, 18));
    if (otHome === otAway) otAway += Math.random() > 0.5 ? 2 : -2;
    homeTotal += otHome;
    awayTotal += otAway;
    homePeriods.ot = [otHome];
    awayPeriods.ot = [otAway];
  }

  // Cálculo de +/- do jogador criado
  if (userStats) {
    const diff = isUserHome ? homeTotal - awayTotal : awayTotal - homeTotal;
    const shareOfMinutes = userStats.minutes / regulationMinutes;
    userStats.plusMinus = Math.round(diff * shareOfMinutes + normalRandom(0, 3));
  }

  // Montagem de estatísticas do elenco para Home e Away
  const playerStatsList: PlayerGameStats[] = [];
  if (userStats) {
    playerStatsList.push(userStats);
  }

  // Gera companheiros e adversários genéricos com estatísticas coerentes
  generateTeamSimulatedStats(homeTeam, homeTotal, isUserHome ? userStats : undefined, playerStatsList);
  generateTeamSimulatedStats(awayTeam, awayTotal, isUserAway ? userStats : undefined, playerStatsList);

  return {
    id: `game-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date,
    seasonYear: new Date().getFullYear(),
    league,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    homeScore: homeTotal,
    awayScore: awayTotal,
    homePeriods,
    awayPeriods,
    homePace: totalPace,
    awayPace: totalPace,
    totalPossessions: totalPace,
    playerStats: playerStatsList,
    userPlayerGame: userStats,
  };
}

function awayAwayTotalAdjusted(expected: number, homeTotal: number): number {
  let away = Math.round(expected);
  // Evita empates na maioria dos casos normais
  if (away === homeTotal) {
    away += Math.random() > 0.5 ? 1 : -1;
  }
  return away;
}

function distributeQuarterScores(total: number): PeriodScore {
  const p1 = Math.round(total * 0.25 + normalRandom(0, 2.5));
  const p2 = Math.round(total * 0.25 + normalRandom(0, 2.5));
  const p3 = Math.round(total * 0.25 + normalRandom(0, 2.5));
  const p4 = total - (p1 + p2 + p3);
  return { q1: Math.max(12, p1), q2: Math.max(12, p2), q3: Math.max(12, p3), q4: Math.max(12, p4) };
}

function generateTeamSimulatedStats(
  team: TeamEntity,
  teamTotalPoints: number,
  userStats: PlayerGameStats | undefined,
  targetList: PlayerGameStats[]
) {
  const rosterNames = generateRosterNames(team);
  const pointsToDistribute = Math.max(0, teamTotalPoints - (userStats ? userStats.points : 0));
  const count = rosterNames.length;
  const weights = [0.32, 0.25, 0.18, 0.13, 0.08, 0.04];

  for (let i = 0; i < count; i++) {
    const pts = Math.round(pointsToDistribute * weights[i] + normalRandom(0, 1.5));
    const fgm = Math.round(pts * 0.42);
    const fga = Math.round(fgm * 2.1);
    const reb = Math.round(normalRandom(5, 2.2));
    const ast = Math.round(normalRandom(4, 2.0));
    const minutes = Math.round(clamp(34 - i * 4, 12, 38));

    targetList.push({
      playerId: `bot-${team.id}-${i}`,
      playerName: rosterNames[i],
      teamId: team.id,
      minutes,
      points: Math.max(0, pts),
      fgm: Math.max(0, fgm),
      fga: Math.max(fgm, fga),
      fg3m: Math.round(fgm * 0.35),
      fg3a: Math.round(fga * 0.38),
      ftm: Math.round(pts * 0.15),
      fta: Math.round(pts * 0.2),
      oreb: Math.round(reb * 0.25),
      dreb: Math.round(reb * 0.75),
      reb: Math.max(0, reb),
      ast: Math.max(0, ast),
      stl: Math.max(0, Math.round(normalRandom(1.0, 0.6))),
      blk: Math.max(0, Math.round(normalRandom(0.7, 0.5))),
      tov: Math.max(0, Math.round(normalRandom(1.8, 0.8))),
      pf: Math.max(0, Math.round(normalRandom(2.2, 0.9))),
      plusMinus: 0,
    });
  }
}
