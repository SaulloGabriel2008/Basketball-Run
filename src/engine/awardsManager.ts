import { 
  PlayerEntity, 
  SeasonAwardsGala, 
  AwardType, 
  AwardResult, 
  AwardNominee, 
  AllStarSelection, 
  Position 
} from '../types';
import { NBA_ACTIVE_STARS } from '../data/nbaRoster';
import { getGenerationalTalentsForSeason } from './generationalTalents';
import { NBA_TEAMS, getTeamById } from '../data/teamsRepository';

interface CandidateProfile {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  overall: number;
  isUser: boolean;
  gamesPlayed: number;
  gamesStarted: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  fgPct: number;
  fg3Pct: number;
  per: number;
  winShares: number;
  dws: number;
  clutch: number;
  teamWins: number;
  isRookie: boolean;
}

/**
 * Calcula os prêmios oficiais da temporada da NBA, estruturando os TOP 3 de cada categoria
 */
export function calculateSeasonAwards(
  player: PlayerEntity,
  teamWinsMap: Record<string, number>
): SeasonAwardsGala {
  const yearsInLeague = player.careerStats.filter(s => s.league === 'NBA').length + 1;
  const isUserRookie = yearsInLeague === 1;

  // 1. Reúne candidatos (Estrelas da NBA + Talentos Jr + Jogador do Usuário)
  const jrLegends = getGenerationalTalentsForSeason(player.careerStats.length);
  const allNbaStars = [...NBA_ACTIVE_STARS, ...jrLegends];

  const userProfile: CandidateProfile = {
    id: player.id,
    name: player.fullName,
    teamId: player.currentTeamId,
    position: player.position,
    overall: player.overall,
    isUser: true,
    gamesPlayed: player.seasonStats.gamesPlayed,
    gamesStarted: player.seasonStats.gamesStarted,
    ppg: player.seasonStats.pointsPerGame,
    rpg: player.seasonStats.reboundsPerGame,
    apg: player.seasonStats.assistsPerGame,
    spg: player.seasonStats.stealsPerGame,
    bpg: player.seasonStats.blocksPerGame,
    fgPct: player.seasonStats.fgPct,
    fg3Pct: player.seasonStats.fg3Pct,
    per: player.seasonStats.per,
    winShares: player.seasonStats.winShares,
    dws: player.seasonStats.dws,
    clutch: player.attributes.clutch,
    teamWins: teamWinsMap[player.currentTeamId] || 41,
    isRookie: isUserRookie,
  };

  const candidates: CandidateProfile[] = [
    userProfile,
    ...allNbaStars.map(star => {
      // Variação orgânica na temporada do rival
      const variance = (Math.random() - 0.5) * 0.1;
      const teamWins = teamWinsMap[star.teamId] || Math.round(35 + (star.overall - 80) * 1.5);

      return {
        id: star.id,
        name: star.name,
        teamId: star.teamId,
        position: star.position,
        overall: star.overall,
        isUser: false,
        gamesPlayed: Math.round(72 + Math.random() * 8),
        gamesStarted: Math.round(72 + Math.random() * 8),
        ppg: Math.round((star.baseStats.ppg * (1 + variance)) * 10) / 10,
        rpg: Math.round((star.baseStats.rpg * (1 + variance)) * 10) / 10,
        apg: Math.round((star.baseStats.apg * (1 + variance)) * 10) / 10,
        spg: Math.round((star.baseStats.spg * (1 + variance)) * 10) / 10,
        bpg: Math.round((star.baseStats.bpg * (1 + variance)) * 10) / 10,
        fgPct: star.baseStats.fgPct,
        fg3Pct: star.baseStats.fg3Pct,
        per: Math.round((star.baseStats.per * (1 + variance)) * 10) / 10,
        winShares: Math.round((star.baseStats.winShares * (1 + variance)) * 10) / 10,
        dws: Math.round((star.baseStats.dws * (1 + variance)) * 10) / 10,
        clutch: Math.round(75 + (star.overall - 80)),
        teamWins,
        isRookie: star.id.includes('chet') || star.id.includes('wembanyama'),
      };
    })
  ];

  // ----------------------------------------------------
  // Helper: Gera TOP 3 e calcula votação
  // ----------------------------------------------------
  function buildAward(
    type: AwardType,
    name: string,
    trophyName: string,
    emoji: string,
    scoreFn: (c: CandidateProfile) => number,
    filterFn?: (c: CandidateProfile) => boolean
  ): AwardResult {
    let pool = candidates;
    if (filterFn) {
      pool = candidates.filter(filterFn);
      if (pool.length === 0) pool = candidates;
    }

    const scored = pool.map(c => {
      const rawScore = scoreFn(c);
      // Adiciona ruído leve de votação da imprensa
      const noise = (Math.random() - 0.5) * 4;
      return { candidate: c, score: Math.max(1, rawScore + noise) };
    }).sort((a, b) => b.score - a.score);

    const top3Candidates = scored.slice(0, 3);
    const totalPointsSum = top3Candidates.reduce((acc, cur) => acc + cur.score, 0);

    const top3: AwardNominee[] = top3Candidates.map((item, idx) => {
      const pct = item.score / (totalPointsSum || 1);
      const firstPlaceVotes = idx === 0 ? Math.round(65 + Math.random() * 30) : idx === 1 ? Math.round(15 + Math.random() * 20) : Math.round(5 + Math.random() * 10);
      const totalPoints = Math.round(pct * 990);

      return {
        playerId: item.candidate.id,
        playerName: item.candidate.name,
        teamId: item.candidate.teamId,
        position: item.candidate.position,
        statsSummary: `${item.candidate.ppg} PTS, ${item.candidate.rpg} REB, ${item.candidate.apg} AST`,
        totalPoints,
        firstPlaceVotes,
        rank: idx + 1,
        isUser: item.candidate.isUser,
      };
    });

    const userInScoredIndex = scored.findIndex(s => s.candidate.isUser);
    const userRank = userInScoredIndex >= 0 ? userInScoredIndex + 1 : undefined;
    const userWasTop3 = userRank !== undefined && userRank <= 3;
    const userWon = userRank === 1;

    return {
      type,
      name,
      trophyName,
      emoji,
      winner: top3[0],
      top3,
      userRank,
      userWasTop3,
      userWon,
      isRevealed: false,
    };
  }

  // ----------------------------------------------------
  // Categorias de Prêmios Individuais
  // ----------------------------------------------------

  // 1. MVP (Michael Jordan Trophy)
  const mvp = buildAward(
    'MVP',
    'Jogador Mais Valioso (MVP)',
    'Troféu Michael Jordan',
    '🏆',
    c => (c.winShares * 3.5) + (c.per * 1.8) + (c.ppg * 0.8) + (c.teamWins * 0.4)
  );

  // 2. DPOY (Hakeem Olajuwon Trophy)
  const dpoy = buildAward(
    'DPOY',
    'Melhor Defensor do Ano (DPOY)',
    'Troféu Hakeem Olajuwon',
    '🛡️',
    c => (c.dws * 9.0) + (c.bpg * 8.0) + (c.spg * 8.0) + (c.rpg * 0.5)
  );

  // 3. ROTY (Wilt Chamberlain Trophy)
  const roty = buildAward(
    'ROTY',
    'Calouro do Ano (ROTY)',
    'Troféu Wilt Chamberlain',
    '⭐',
    c => (c.ppg * 1.5) + (c.rpg * 0.8) + (c.apg * 0.8) + c.winShares * 2.0,
    c => c.isRookie
  );

  // 4. Sexto Homem do Ano (John Havlicek Trophy)
  const sixthMan = buildAward(
    'SIXTH_MAN',
    'Sexto Homem do Ano (6MOY)',
    'Troféu John Havlicek',
    '⚡',
    c => (c.ppg * 1.8) + (c.apg * 1.0) + (c.per * 1.2),
    c => c.gamesStarted <= (c.gamesPlayed * 0.5) || c.isUser && c.gamesStarted < 40
  );

  // 5. Jogador Que Mais Evoluiu (George Mikan Trophy)
  const mip = buildAward(
    'MIP',
    'Jogador Que Mais Evoluiu (MIP)',
    'Troféu George Mikan',
    '📈',
    c => (c.ppg * 1.2) + (c.per * 1.5) + (c.overall - 75) * 2.0
  );

  // 6. Jogador Mais Decisivo no Clutch (Jerry West Trophy)
  const clutch = buildAward(
    'CLUTCH',
    'Jogador Mais Decisivo (Clutch Player)',
    'Troféu Jerry West',
    '⏱️',
    c => (c.clutch * 0.8) + (c.ppg * 0.9) + (c.teamWins * 0.3)
  );

  // 7. Finals MVP (Placeholder que será preenchido após os playoffs)
  const finalsMvp: AwardResult = {
    type: 'FINALS_MVP',
    name: 'MVP das Finais da NBA',
    trophyName: 'Troféu Bill Russell',
    emoji: '👑',
    winner: {
      playerId: 'pending',
      playerName: 'A Definir nas Finais',
      teamId: 'pending',
      position: 'PG',
      statsSummary: 'Série Final em Disputa',
      totalPoints: 100,
      firstPlaceVotes: 11,
      rank: 1,
      isUser: false,
    },
    top3: [],
    userWasTop3: false,
    userWon: false,
    isRevealed: true,
  };

  // ----------------------------------------------------
  // Seleção All-Star Game (Leste e Oeste)
  // ----------------------------------------------------
  const easternCandidates = candidates
    .filter(c => {
      const team = getTeamById(c.teamId);
      return team?.conference === 'Eastern';
    })
    .sort((a, b) => (b.ppg + b.per + b.teamWins * 0.2) - (a.ppg + a.per + a.teamWins * 0.2));

  const westernCandidates = candidates
    .filter(c => {
      const team = getTeamById(c.teamId);
      return team?.conference === 'Western';
    })
    .sort((a, b) => (b.ppg + b.per + b.teamWins * 0.2) - (a.ppg + a.per + a.teamWins * 0.2));

  // Garante 12 All-Stars completos no Leste
  const eastTeams = NBA_TEAMS.filter(t => t.conference === 'Eastern');
  while (easternCandidates.length < 12) {
    const t = eastTeams[easternCandidates.length % eastTeams.length];
    easternCandidates.push({
      id: `allstar-east-gen-${easternCandidates.length}`,
      name: `Estrela do ${t.shortName}`,
      teamId: t.id,
      position: 'SF',
      overall: 86,
      isUser: false,
      gamesPlayed: 76,
      gamesStarted: 76,
      ppg: 22.0,
      rpg: 5.5,
      apg: 4.5,
      spg: 1.1,
      bpg: 0.6,
      fgPct: 47.0,
      fg3Pct: 36.5,
      per: 19.5,
      winShares: 7.8,
      dws: 2.8,
      clutch: 80,
      teamWins: teamWinsMap[t.id] || 42,
      isRookie: false,
    });
  }

  // Garante 12 All-Stars completos no Oeste
  const westTeams = NBA_TEAMS.filter(t => t.conference === 'Western');
  while (westernCandidates.length < 12) {
    const t = westTeams[westernCandidates.length % westTeams.length];
    westernCandidates.push({
      id: `allstar-west-gen-${westernCandidates.length}`,
      name: `Estrela do ${t.shortName}`,
      teamId: t.id,
      position: 'SG',
      overall: 86,
      isUser: false,
      gamesPlayed: 76,
      gamesStarted: 76,
      ppg: 22.0,
      rpg: 5.5,
      apg: 4.5,
      spg: 1.1,
      bpg: 0.6,
      fgPct: 47.0,
      fg3Pct: 36.5,
      per: 19.5,
      winShares: 7.8,
      dws: 2.8,
      clutch: 80,
      teamWins: teamWinsMap[t.id] || 42,
      isRookie: false,
    });
  }

  const allStarEast: AllStarSelection[] = easternCandidates.slice(0, 12).map((c, idx) => ({
    playerId: c.id,
    playerName: c.name,
    teamId: c.teamId,
    position: c.position,
    isStarter: idx < 5,
    isUser: c.isUser,
  }));

  const allStarWest: AllStarSelection[] = westernCandidates.slice(0, 12).map((c, idx) => ({
    playerId: c.id,
    playerName: c.name,
    teamId: c.teamId,
    position: c.position,
    isStarter: idx < 5,
    isUser: c.isUser,
  }));

  // ----------------------------------------------------
  // All-NBA Teams (1st, 2nd, 3rd)
  // ----------------------------------------------------
  const allNbaRanked = [...candidates].sort((a, b) => (b.winShares * 2 + b.per + b.ppg * 0.5) - (a.winShares * 2 + a.per + a.ppg * 0.5));

  const allNbaTeams = {
    first: allNbaRanked.slice(0, 5).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'FIRST' as const, isUser: c.isUser })),
    second: allNbaRanked.slice(5, 10).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'SECOND' as const, isUser: c.isUser })),
    third: allNbaRanked.slice(10, 15).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'THIRD' as const, isUser: c.isUser })),
  };

  // All-Defensive Teams
  const allDefRanked = [...candidates].sort((a, b) => (b.dws * 3 + b.spg * 2 + b.bpg * 2) - (a.dws * 3 + a.spg * 2 + a.bpg * 2));
  const allDefensiveTeams = {
    first: allDefRanked.slice(0, 5).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'FIRST' as const, isUser: c.isUser })),
    second: allDefRanked.slice(5, 10).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'SECOND' as const, isUser: c.isUser })),
  };

  // All-Rookie Team
  const rookieRanked = candidates.filter(c => c.isRookie).sort((a, b) => (b.ppg + b.winShares) - (a.ppg + a.winShares));
  const allRookieTeam = rookieRanked.slice(0, 5).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'FIRST' as const, isUser: c.isUser }));

  return {
    seasonYear: player.seasonStats.seasonYear,
    awards: {
      MVP: mvp,
      DPOY: dpoy,
      ROTY: roty,
      SIXTH_MAN: sixthMan,
      MIP: mip,
      CLUTCH: clutch,
      FINALS_MVP: finalsMvp,
    },
    allStarEast,
    allStarWest,
    allNbaTeams,
    allDefensiveTeams,
    allRookieTeam,
  };
}
