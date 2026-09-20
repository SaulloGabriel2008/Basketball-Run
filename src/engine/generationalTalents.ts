import { Position, Archetype } from '../types';
import { NbaStarPlayer } from '../data/nbaRoster';

export interface GenerationalProspect {
  name: string;
  position: Position;
  archetype: Archetype;
  baseOvr: number;
  potential: number;
  tagline: string;
  baseStats: NbaStarPlayer['baseStats'];
}

export const HISTORICAL_JR_LEGENDS: GenerationalProspect[] = [
  {
    name: "Shaquille O'Neal Jr.",
    position: 'C',
    archetype: 'PAINT_PROTECTOR',
    baseOvr: 95,
    potential: 99,
    tagline: 'A Reencarnação da Força Bruta no Garrafão',
    baseStats: { ppg: 28.5, rpg: 13.8, apg: 3.2, spg: 0.6, bpg: 2.8, fgPct: 62.0, fg3Pct: 0.0, ftPct: 58.0, tsPct: 63.0, usgPct: 32.0, per: 29.5, winShares: 15.0, dws: 5.5 }
  },
  {
    name: 'Jayson Tatum Jr.',
    position: 'SF',
    archetype: 'TWO_WAY_SPECIALIST',
    baseOvr: 94,
    potential: 98,
    tagline: 'Pontuador Completo de 3 Níveis & Defesa de Elite',
    baseStats: { ppg: 29.0, rpg: 8.5, apg: 5.5, spg: 1.3, bpg: 0.8, fgPct: 48.5, fg3Pct: 39.0, ftPct: 86.5, tsPct: 62.0, usgPct: 31.5, per: 26.0, winShares: 14.0, dws: 4.2 }
  },
  {
    name: 'LeBron James Jr.',
    position: 'PF',
    archetype: 'POINT_FORWARD',
    baseOvr: 96,
    potential: 99,
    tagline: 'QI de Basquete Geracional & Físico Sobre-Humano',
    baseStats: { ppg: 27.5, rpg: 8.0, apg: 8.8, spg: 1.5, bpg: 0.9, fgPct: 55.0, fg3Pct: 38.0, ftPct: 76.0, tsPct: 63.5, usgPct: 30.0, per: 28.0, winShares: 15.5, dws: 4.6 }
  },
  {
    name: 'Stephen Curry Jr.',
    position: 'PG',
    archetype: 'SHARPSHOOTER',
    baseOvr: 94,
    potential: 98,
    tagline: 'Gatilho Ilimitado do Logotipo da Quadra',
    baseStats: { ppg: 30.2, rpg: 5.0, apg: 6.8, spg: 1.2, bpg: 0.3, fgPct: 47.0, fg3Pct: 43.5, ftPct: 93.0, tsPct: 66.0, usgPct: 31.0, per: 26.5, winShares: 14.2, dws: 2.5 }
  },
  {
    name: 'Kobe Bryant Jr.',
    position: 'SG',
    archetype: 'MID_RANGE_MAESTRO',
    baseOvr: 95,
    potential: 99,
    tagline: 'Mamba Mentality & Fadeaway Cirúrgico no Clutch',
    baseStats: { ppg: 31.5, rpg: 5.8, apg: 5.2, spg: 1.7, bpg: 0.6, fgPct: 47.5, fg3Pct: 36.0, ftPct: 87.0, tsPct: 59.0, usgPct: 34.0, per: 27.0, winShares: 13.8, dws: 4.1 }
  },
  {
    name: 'Giannis Antetokounmpo Jr.',
    position: 'PF',
    archetype: 'SLASHER',
    baseOvr: 95,
    potential: 99,
    tagline: 'Monstro das Passadas Longas & Eurostep Imparável',
    baseStats: { ppg: 31.0, rpg: 12.0, apg: 6.0, spg: 1.3, bpg: 1.5, fgPct: 62.5, fg3Pct: 28.0, ftPct: 68.0, tsPct: 65.5, usgPct: 33.5, per: 30.2, winShares: 16.0, dws: 5.2 }
  },
  {
    name: 'Nikola Jokić Jr.',
    position: 'C',
    archetype: 'POST_SCORER',
    baseOvr: 96,
    potential: 99,
    tagline: 'Mágico das Assistências & Sombor Shuffle',
    baseStats: { ppg: 27.0, rpg: 13.0, apg: 10.2, spg: 1.4, bpg: 1.0, fgPct: 59.0, fg3Pct: 37.0, ftPct: 83.0, tsPct: 66.2, usgPct: 29.0, per: 32.0, winShares: 17.5, dws: 4.9 }
  },
  {
    name: 'Victor Wembanyama Jr.',
    position: 'C',
    archetype: 'PAINT_PROTECTOR',
    baseOvr: 95,
    potential: 99,
    tagline: 'Guardião de 7 pés e 5 polegadas que Chuta de 3',
    baseStats: { ppg: 26.5, rpg: 12.5, apg: 4.5, spg: 1.5, bpg: 4.2, fgPct: 49.5, fg3Pct: 36.5, ftPct: 83.5, tsPct: 60.5, usgPct: 30.5, per: 27.5, winShares: 13.0, dws: 6.5 }
  },
  {
    name: 'Michael Jordan Jr.',
    position: 'SG',
    archetype: 'SLASHER',
    baseOvr: 97,
    potential: 99,
    tagline: 'Hangar no Ar & Competitividade Implacável',
    baseStats: { ppg: 33.5, rpg: 6.2, apg: 5.8, spg: 2.3, bpg: 0.9, fgPct: 51.5, fg3Pct: 34.0, ftPct: 86.0, tsPct: 60.0, usgPct: 35.0, per: 31.0, winShares: 16.8, dws: 5.0 }
  }
];

/**
 * Retorna talentos geracionais "Jr" para injetar na liga dependendo da longevidade da carreira
 */
export function getGenerationalTalentsForSeason(yearsPlayed: number): NbaStarPlayer[] {
  // A partir do ano 3, começa a introduzir lendas "Jr" gradualmente
  if (yearsPlayed < 3) return [];

  const countToInject = Math.min(HISTORICAL_JR_LEGENDS.length, Math.floor(yearsPlayed / 2));
  const teamPool = [
    'lal-lakers', 'bos-celtics', 'gsw-warriors', 'mia-heat', 'nyk-knicks',
    'chi-bulls', 'sas-spurs', 'phi-76ers', 'hou-rockets', 'dal-mavericks'
  ];

  return HISTORICAL_JR_LEGENDS.slice(0, countToInject).map((legend, idx) => ({
    id: `jr-legend-${idx}`,
    name: legend.name,
    teamId: teamPool[idx % teamPool.length],
    position: legend.position,
    overall: legend.baseOvr,
    archetype: legend.archetype,
    baseStats: { ...legend.baseStats }
  }));
}
