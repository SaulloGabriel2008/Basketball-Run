import { clamp, round } from './mathUtils';

export interface BoxScoreTotals {
  pts: number;
  fga: number;
  fgm: number;
  fg3a: number;
  fg3m: number;
  fta: number;
  ftm: number;
  tov: number;
  minutes: number;
  teamMinutes?: number;
  teamFga?: number;
  teamFta?: number;
  teamTov?: number;
  ast?: number;
  reb?: number;
  oreb?: number;
  dreb?: number;
  stl?: number;
  blk?: number;
  pf?: number;
}

/**
 * True Shooting Percentage:
 * TS% = PTS / (2 * (FGA + 0.44 * FTA))
 */
export function calculateTS(pts: number, fga: number, fta: number): number {
  const attempts = 2 * (fga + 0.44 * fta);
  if (attempts <= 0) return 0;
  return round((pts / attempts) * 100, 1);
}

/**
 * Effective Field Goal Percentage:
 * eFG% = (FGM + 0.5 * 3PM) / FGA
 */
export function calculateEFG(fgm: number, fg3m: number, fga: number): number {
  if (fga <= 0) return 0;
  return round(((fgm + 0.5 * fg3m) / fga) * 100, 1);
}

/**
 * Usage Rate:
 * USG% = 100 * ((FGA + 0.44 * FTA + TOV) * (Team_MP / 5)) / (MP * (Team_FGA + 0.44 * Team_FTA + Team_TOV))
 */
export function calculateUSG(stats: {
  fga: number;
  fta: number;
  tov: number;
  mp: number;
  teamMp?: number;
  teamFga?: number;
  teamFta?: number;
  teamTov?: number;
}): number {
  const { fga, fta, tov, mp } = stats;
  if (mp <= 0) return 0;

  const teamMp = stats.teamMp ?? 240;
  const teamFga = stats.teamFga ?? 88;
  const teamFta = stats.teamFta ?? 22;
  const teamTov = stats.teamTov ?? 14;

  const playerPoss = fga + 0.44 * fta + tov;
  const teamPoss = teamFga + 0.44 * teamFta + teamTov;

  if (teamPoss <= 0) return 0;

  const usg = 100 * ((playerPoss * (teamMp / 5)) / (mp * teamPoss));
  return round(clamp(usg, 5, 45), 1);
}

/**
 * Player Efficiency Rating (uPER linearizado, calibrado para média da liga = 15.00)
 */
export function calculatePER(stats: {
  mp: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fgm: number;
  fga: number;
  ftm: number;
  fta: number;
  fg3m: number;
  pf: number;
}): number {
  if (stats.mp <= 0) return 0;

  // Valor de produção ponderada por minuto ajustada ao padrão da NBA
  const missedFg = stats.fga - stats.fgm;
  const missedFt = stats.fta - stats.ftm;

  const production =
    stats.pts +
    stats.reb * 1.15 +
    stats.ast * 1.45 +
    stats.stl * 1.75 +
    stats.blk * 1.65 +
    stats.fg3m * 0.5 -
    stats.tov * 1.4 -
    missedFg * 0.75 -
    missedFt * 0.45 -
    stats.pf * 0.4;

  // Normalização para 36 minutos mantendo a média de um jogador de rotação regular (~15.0)
  const per36 = (production / stats.mp) * 36;
  const rawPer = per36 * 0.68;
  return round(clamp(rawPer, 2.0, 38.0), 1);
}

/**
 * Win Shares (OWS e DWS)
 */
export function calculateWinShares(stats: {
  mp: number;
  pts: number;
  fga: number;
  fta: number;
  tov: number;
  ast: number;
  reb: number;
  stl: number;
  blk: number;
  teamOffensiveRating?: number;
  teamDefensiveRating?: number;
  leaguePace?: number;
  gamesPlayed?: number;
}): { ows: number; dws: number; total: number } {
  if (stats.mp <= 0) return { ows: 0, dws: 0, total: 0 };

  // stats.mp é o total de minutos jogados na temporada. (mp / 48) dá o equivalente a jogos completos de 48 min
  const fullGameEquivalents = stats.mp / 48;

  // Pontos produzidos: pontos anotados + criação via assistências
  const pointsProduced = stats.pts + stats.ast * 1.5;
  // Média de referência que um jogador comum produziria no mesmo tempo de quadra
  const baselinePoints = fullGameEquivalents * 14.5;
  const marginalOffense = Math.max(0, pointsProduced - baselinePoints);
  const ows = round(marginalOffense / 32, 1);

  // Contribuição defensiva baseada em impacto defensivo por tempo
  const defImpact = stats.reb * 0.8 + stats.stl * 2.0 + stats.blk * 1.8;
  const baselineDef = fullGameEquivalents * 4.5;
  const marginalDefense = Math.max(0, defImpact - baselineDef);
  const dws = round(marginalDefense / 30, 1);

  const total = round(ows + dws, 1);
  return { ows, dws, total };
}
