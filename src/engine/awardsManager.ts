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
  isStarter: boolean;
  improvementScore: number;
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

  // Calcula taxa de evolução do usuário para MIP
  let userImprovementScore = 0;
  if (player.careerStats.length > 0) {
    const lastSeason = player.careerStats[player.careerStats.length - 1];
    const ppgDelta = Math.max(0, player.seasonStats.pointsPerGame - (lastSeason.pointsPerGame || 0));
    const perDelta = Math.max(0, player.seasonStats.per - (lastSeason.per || 15));
    userImprovementScore = (ppgDelta * 2.5) + (perDelta * 2.0) + Math.max(0, player.overall - 74) * 1.5;
  }

  const isUserStarter = player.seasonStats.gamesStarted > (player.seasonStats.gamesPlayed * 0.5);

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
    isStarter: isUserStarter,
    improvementScore: userImprovementScore,
  };

  const candidates: CandidateProfile[] = [
    userProfile,
    ...allNbaStars.map(star => {
      // Variação orgânica na temporada do rival
      const variance = (Math.random() - 0.5) * 0.1;
      const teamWins = teamWinsMap[star.teamId] || Math.round(35 + (star.overall - 80) * 1.5);

      const isStarter = star.isStarter !== false;
      const gamesPlayed = Math.round(70 + Math.random() * 12); // 70 a 82 jogos
      // Se for reserva legítimo (ex: Naz Reid, Monk), tem poucos jogos como titular
      const gamesStarted = isStarter 
        ? Math.max(55, Math.round(gamesPlayed - Math.random() * 5))
        : Math.round(2 + Math.random() * 10);

      // Calcula salto de evolução (MIP) para estrelas com dados históricos
      let improvementScore = 0;
      if (star.previousStats) {
        const ppgDelta = Math.max(0, star.baseStats.ppg - star.previousStats.ppg);
        const perDelta = Math.max(0, star.baseStats.per - star.previousStats.per);
        const ovrDelta = Math.max(0, star.overall - star.previousStats.overall);
        improvementScore = (ppgDelta * 2.4) + (perDelta * 2.0) + (ovrDelta * 2.5);
      }

      return {
        id: star.id,
        name: star.name,
        teamId: star.teamId,
        position: star.position,
        overall: star.overall,
        isUser: false,
        gamesPlayed,
        gamesStarted,
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
        isRookie: Boolean(star.isRookie),
        isStarter,
        improvementScore,
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
      const filtered = candidates.filter(filterFn);
      if (filtered.length >= 3) {
        pool = filtered;
      } else if (filtered.length > 0) {
        pool = filtered;
      } else {
        // Fallback inteligente para garantir coerência de cada categoria
        if (type === 'SIXTH_MAN') {
          pool = [...candidates].sort((a, b) => (a.gamesStarted / (a.gamesPlayed || 1)) - (b.gamesStarted / (b.gamesPlayed || 1))).slice(0, 10);
        } else if (type === 'ROTY') {
          pool = candidates.filter(c => c.isRookie);
          if (pool.length === 0) pool = [...candidates].sort((a, b) => a.overall - b.overall).slice(0, 5);
        } else if (type === 'MIP') {
          pool = [...candidates].sort((a, b) => b.improvementScore - a.improvementScore).slice(0, 10);
        } else {
          pool = candidates;
        }
      }
    }

    const scored = pool.map(c => {
      const rawScore = scoreFn(c);
      // Adiciona ruído leve de votação da imprensa
      const noise = (Math.random() - 0.5) * 3;
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

  // 1. MVP (Michael Jordan Trophy) - Mínimo de 65 jogos (Regra Oficial da NBA)
  const mvp = buildAward(
    'MVP',
    'Jogador Mais Valioso (MVP)',
    'Troféu Michael Jordan',
    '🏆',
    c => {
      const winBonus = c.teamWins >= 55 ? 16 : c.teamWins >= 50 ? 10 : c.teamWins >= 45 ? 5 : 0;
      return (c.winShares * 4.2) + (c.per * 2.2) + (c.ppg * 1.1) + (c.teamWins * 0.55) + winBonus;
    },
    c => c.gamesPlayed >= 65
  );

  // 2. DPOY (Hakeem Olajuwon Trophy) - Mínimo de 65 jogos
  const dpoy = buildAward(
    'DPOY',
    'Melhor Defensor do Ano (DPOY)',
    'Troféu Hakeem Olajuwon',
    '🛡️',
    c => (c.dws * 10.0) + (c.bpg * 8.5) + (c.spg * 8.5) + (c.rpg * 0.6) + (c.teamWins * 0.25),
    c => c.gamesPlayed >= 65
  );

  // 3. ROTY (Wilt Chamberlain Trophy) - Calouros oficiais
  const roty = buildAward(
    'ROTY',
    'Calouro do Ano (ROTY)',
    'Troféu Wilt Chamberlain',
    '⭐',
    c => (c.ppg * 1.6) + (c.rpg * 0.9) + (c.apg * 0.9) + (c.winShares * 2.6) + (c.per * 1.3),
    c => c.isRookie && c.gamesPlayed >= 45
  );

  // 4. Sexto Homem do Ano (John Havlicek Trophy) - Mais jogos vindo do banco
  const sixthMan = buildAward(
    'SIXTH_MAN',
    'Sexto Homem do Ano (6MOY)',
    'Troféu John Havlicek',
    '⚡',
    c => (c.ppg * 2.2) + (c.apg * 1.2) + (c.rpg * 0.8) + (c.per * 1.5) + (c.teamWins * 0.25),
    c => c.gamesPlayed >= 50 && c.gamesStarted <= (c.gamesPlayed * 0.35)
  );

  // 5. Jogador Que Mais Evoluiu (George Mikan Trophy) - Salto estatístico real
  const mip = buildAward(
    'MIP',
    'Jogador Que Mais Evoluiu (MIP)',
    'Troféu George Mikan',
    '📈',
    c => (c.improvementScore * 3.5) + (c.ppg * 0.9) + (c.per * 0.9),
    c => c.gamesPlayed >= 50 && c.improvementScore >= 4 && !c.isRookie
  );

  // 6. Jogador Mais Decisivo no Clutch (Jerry West Trophy)
  const clutch = buildAward(
    'CLUTCH',
    'Jogador Mais Decisivo (Clutch Player)',
    'Troféu Jerry West',
    '⏱️',
    c => (c.clutch * 0.85) + (c.ppg * 0.95) + (c.teamWins * 0.4),
    c => c.gamesPlayed >= 55
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
      return team?.conference === 'Eastern' && c.gamesPlayed >= 40;
    })
    .sort((a, b) => {
      const scoreA = (a.ppg * 1.2) + (a.per * 1.5) + (a.winShares * 1.6) + (a.teamWins * 0.3);
      const scoreB = (b.ppg * 1.2) + (b.per * 1.5) + (b.winShares * 1.6) + (b.teamWins * 0.3);
      return scoreB - scoreA;
    });

  const westernCandidates = candidates
    .filter(c => {
      const team = getTeamById(c.teamId);
      return team?.conference === 'Western' && c.gamesPlayed >= 40;
    })
    .sort((a, b) => {
      const scoreA = (a.ppg * 1.2) + (a.per * 1.5) + (a.winShares * 1.6) + (a.teamWins * 0.3);
      const scoreB = (b.ppg * 1.2) + (b.per * 1.5) + (b.winShares * 1.6) + (b.teamWins * 0.3);
      return scoreB - scoreA;
    });

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
      isStarter: true,
      improvementScore: 0,
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
      isStarter: true,
      improvementScore: 0,
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
  // All-NBA Teams (1st, 2nd, 3rd) - Mínimo 65 jogos
  // ----------------------------------------------------
  const allNbaEligible = candidates.filter(c => c.gamesPlayed >= 65);
  const allNbaPool = allNbaEligible.length >= 15 ? allNbaEligible : candidates;
  const allNbaRanked = [...allNbaPool].sort((a, b) => 
    (b.winShares * 3.5 + b.per * 2.2 + b.ppg * 1.0 + b.teamWins * 0.4) - 
    (a.winShares * 3.5 + a.per * 2.2 + a.ppg * 1.0 + a.teamWins * 0.4)
  );

  const allNbaTeams = {
    first: allNbaRanked.slice(0, 5).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'FIRST' as const, isUser: c.isUser })),
    second: allNbaRanked.slice(5, 10).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'SECOND' as const, isUser: c.isUser })),
    third: allNbaRanked.slice(10, 15).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'THIRD' as const, isUser: c.isUser })),
  };

  // All-Defensive Teams - Mínimo 60 jogos
  const allDefEligible = candidates.filter(c => c.gamesPlayed >= 60);
  const allDefPool = allDefEligible.length >= 10 ? allDefEligible : candidates;
  const allDefRanked = [...allDefPool].sort((a, b) => 
    (b.dws * 4.5 + b.spg * 3.5 + b.bpg * 3.5 + b.rpg * 0.6) - 
    (a.dws * 4.5 + a.spg * 3.5 + a.bpg * 3.5 + a.rpg * 0.6)
  );

  const allDefensiveTeams = {
    first: allDefRanked.slice(0, 5).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'FIRST' as const, isUser: c.isUser })),
    second: allDefRanked.slice(5, 10).map(c => ({ playerId: c.id, playerName: c.name, teamId: c.teamId, position: c.position, teamGrade: 'SECOND' as const, isUser: c.isUser })),
  };

  // All-Rookie Team - Calouros com pelo menos 35 jogos
  const rookieRanked = candidates
    .filter(c => c.isRookie && c.gamesPlayed >= 35)
    .sort((a, b) => (b.ppg * 1.5 + b.per + b.winShares * 2) - (a.ppg * 1.5 + a.per + a.winShares * 2));

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
