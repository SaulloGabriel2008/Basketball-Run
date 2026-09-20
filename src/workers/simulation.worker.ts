import { PlayerEntity, TeamEntity, GameBoxScore } from '../types';
import { simulateMatch } from '../engine/simulationCore';
import { calculateTS, calculateEFG, calculateUSG, calculatePER, calculateWinShares } from '../engine/advancedMetrics';
import { round } from '../engine/mathUtils';

export interface WorkerBatchPayload {
  gamesToSimulate: number;
  player: PlayerEntity;
  opponents: TeamEntity[];
  userTeam: TeamEntity;
}

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'RUN_BATCH_SIMULATION') {
    const { gamesToSimulate, player, opponents, userTeam } = payload as WorkerBatchPayload;
    const simulatedGames: GameBoxScore[] = [];

    // Clone do jogador para acumular estatísticas
    const updatedPlayer: PlayerEntity = JSON.parse(JSON.stringify(player));
    const s = updatedPlayer.seasonStats;

    for (let i = 0; i < gamesToSimulate; i++) {
      const opp = opponents[i % opponents.length];
      const isHome = i % 2 === 0;
      const homeTeam = isHome ? userTeam : opp;
      const awayTeam = isHome ? opp : userTeam;

      const dateStr = `Game ${s.gamesPlayed + i + 1}`;
      const box = simulateMatch(homeTeam, awayTeam, updatedPlayer.currentLeague, updatedPlayer, dateStr);
      simulatedGames.push(box);

      if (box.userPlayerGame) {
        const u = box.userPlayerGame;
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

        // Recalcula médias por jogo
        s.minutesPerGame = round(s.totalMinutes / s.gamesPlayed, 1);
        s.pointsPerGame = round(s.totalPoints / s.gamesPlayed, 1);
        s.reboundsPerGame = round(s.totalReb / s.gamesPlayed, 1);
        s.assistsPerGame = round(s.totalAst / s.gamesPlayed, 1);
        s.stealsPerGame = round(s.totalStl / s.gamesPlayed, 1);
        s.blocksPerGame = round(s.totalBlk / s.gamesPlayed, 1);
        s.turnoversPerGame = round(s.totalTov / s.gamesPlayed, 1);
        s.foulsPerGame = round(s.totalPf / s.gamesPlayed, 1);

        // Porcentagens
        s.fgPct = s.totalFga > 0 ? round((s.totalFgm / s.totalFga) * 100, 1) : 0;
        s.fg3Pct = s.totalFg3a > 0 ? round((s.totalFg3m / s.totalFg3a) * 100, 1) : 0;
        s.ftPct = s.totalFta > 0 ? round((s.totalFtm / s.totalFta) * 100, 1) : 0;

        // Métricas avançadas
        s.tsPct = calculateTS(s.totalPoints, s.totalFga, s.totalFta);
        s.efgPct = calculateEFG(s.totalFgm, s.totalFg3m, s.totalFga);
        s.usgPct = calculateUSG({
          fga: s.totalFga,
          fta: s.totalFta,
          tov: s.totalTov,
          mp: s.totalMinutes,
          teamMp: s.gamesPlayed * (updatedPlayer.currentLeague === 'NCAA' ? 200 : 240),
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
      }

      // Envia notificação de progresso a cada jogo ou bloco
      self.postMessage({
        type: 'PROGRESS_UPDATE',
        completed: i + 1,
        total: gamesToSimulate,
      });
    }

    self.postMessage({
      type: 'SIMULATION_FINISHED',
      updatedPlayer,
      simulatedGames,
    });
  }
};
