import { Position, Archetype } from '../types';

export interface NbaStarPlayer {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  overall: number;
  archetype: Archetype;
  isStarter?: boolean; // false para especialistas de banco / 6th Man
  isRookie?: boolean;  // para calouros
  previousStats?: {
    ppg: number;
    per: number;
    overall: number;
  };
  baseStats: {
    ppg: number;
    rpg: number;
    apg: number;
    spg: number;
    bpg: number;
    fgPct: number;
    fg3Pct: number;
    ftPct: number;
    tsPct: number;
    usgPct: number;
    per: number;
    winShares: number;
    dws: number;
  };
}

export const NBA_ACTIVE_STARS: NbaStarPlayer[] = [
  // ==========================================
  // BOSTON CELTICS
  // ==========================================
  {
    id: 'star-tatum',
    name: 'Jayson Tatum',
    teamId: 'bos-celtics',
    position: 'SF',
    overall: 95,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 26.9, rpg: 8.1, apg: 4.9, spg: 1.0, bpg: 0.6, fgPct: 47.1, fg3Pct: 37.6, ftPct: 83.3, tsPct: 60.7, usgPct: 30.0, per: 23.5, winShares: 12.0, dws: 4.0 }
  },
  {
    id: 'star-brown',
    name: 'Jaylen Brown',
    teamId: 'bos-celtics',
    position: 'SG',
    overall: 90,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 23.0, rpg: 5.5, apg: 3.6, spg: 1.2, bpg: 0.5, fgPct: 49.9, fg3Pct: 35.4, ftPct: 70.3, tsPct: 56.8, usgPct: 28.5, per: 20.2, winShares: 8.8, dws: 3.6 }
  },
  {
    id: 'star-porzingis',
    name: 'Kristaps Porziņģis',
    teamId: 'bos-celtics',
    position: 'C',
    overall: 88,
    archetype: 'STRETCH_BIG',
    isStarter: true,
    baseStats: { ppg: 20.1, rpg: 7.2, apg: 2.0, spg: 0.7, bpg: 1.9, fgPct: 51.6, fg3Pct: 37.5, ftPct: 85.8, tsPct: 64.7, usgPct: 24.5, per: 22.0, winShares: 9.0, dws: 3.8 }
  },
  {
    id: 'star-holiday',
    name: 'Jrue Holiday',
    teamId: 'bos-celtics',
    position: 'PG',
    overall: 87,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    baseStats: { ppg: 12.5, rpg: 5.4, apg: 4.8, spg: 0.9, bpg: 0.8, fgPct: 48.0, fg3Pct: 42.9, ftPct: 83.3, tsPct: 59.5, usgPct: 16.0, per: 16.5, winShares: 7.5, dws: 3.9 }
  },
  {
    id: 'star-dwhite',
    name: 'Derrick White',
    teamId: 'bos-celtics',
    position: 'PG',
    overall: 86,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    baseStats: { ppg: 15.2, rpg: 4.2, apg: 5.2, spg: 1.0, bpg: 1.2, fgPct: 46.1, fg3Pct: 39.6, ftPct: 90.1, tsPct: 61.0, usgPct: 18.5, per: 17.8, winShares: 8.5, dws: 3.7 }
  },

  // ==========================================
  // BROOKLYN NETS
  // ==========================================
  {
    id: 'star-cthomas',
    name: 'Cam Thomas',
    teamId: 'bkn-nets',
    position: 'SG',
    overall: 84,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    previousStats: { ppg: 10.6, per: 14.0, overall: 78 },
    baseStats: { ppg: 22.5, rpg: 3.2, apg: 2.9, spg: 0.7, bpg: 0.2, fgPct: 44.2, fg3Pct: 36.4, ftPct: 85.6, tsPct: 55.8, usgPct: 29.5, per: 18.2, winShares: 4.2, dws: 1.2 }
  },
  {
    id: 'star-claxton',
    name: 'Nicolas Claxton',
    teamId: 'bkn-nets',
    position: 'C',
    overall: 82,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 11.8, rpg: 9.9, apg: 2.1, spg: 0.6, bpg: 2.1, fgPct: 62.9, fg3Pct: 20.0, ftPct: 55.1, tsPct: 61.2, usgPct: 15.0, per: 18.0, winShares: 6.5, dws: 3.4 }
  },
  {
    id: 'star-schroder',
    name: 'Dennis Schröder',
    teamId: 'bkn-nets',
    position: 'PG',
    overall: 81,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 14.0, rpg: 3.0, apg: 6.1, spg: 0.9, bpg: 0.2, fgPct: 43.5, fg3Pct: 37.5, ftPct: 83.6, tsPct: 54.0, usgPct: 21.0, per: 15.0, winShares: 4.0, dws: 1.5 }
  },
  {
    id: 'star-camjohnson',
    name: 'Cameron Johnson',
    teamId: 'bkn-nets',
    position: 'SF',
    overall: 81,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 13.4, rpg: 4.3, apg: 2.4, spg: 0.8, bpg: 0.3, fgPct: 44.6, fg3Pct: 39.1, ftPct: 78.9, tsPct: 57.0, usgPct: 18.0, per: 14.5, winShares: 4.5, dws: 1.6 }
  },

  // ==========================================
  // NEW YORK KNICKS
  // ==========================================
  {
    id: 'star-brunson',
    name: 'Jalen Brunson',
    teamId: 'nyk-knicks',
    position: 'PG',
    overall: 93,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 28.7, rpg: 3.6, apg: 6.7, spg: 0.9, bpg: 0.2, fgPct: 47.9, fg3Pct: 40.1, ftPct: 84.7, tsPct: 59.2, usgPct: 32.0, per: 23.4, winShares: 11.2, dws: 2.5 }
  },
  {
    id: 'star-kat',
    name: 'Karl-Anthony Towns',
    teamId: 'nyk-knicks',
    position: 'C',
    overall: 90,
    archetype: 'STRETCH_BIG',
    isStarter: true,
    baseStats: { ppg: 22.8, rpg: 9.5, apg: 3.0, spg: 0.7, bpg: 0.8, fgPct: 50.4, fg3Pct: 41.6, ftPct: 87.3, tsPct: 62.5, usgPct: 26.5, per: 22.0, winShares: 9.5, dws: 3.2 }
  },
  {
    id: 'star-bridges',
    name: 'Mikal Bridges',
    teamId: 'nyk-knicks',
    position: 'SF',
    overall: 86,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 19.6, rpg: 4.5, apg: 3.6, spg: 1.0, bpg: 0.4, fgPct: 43.6, fg3Pct: 37.2, ftPct: 81.4, tsPct: 56.0, usgPct: 25.0, per: 16.5, winShares: 6.5, dws: 2.8 }
  },
  {
    id: 'star-anunoby',
    name: 'OG Anunoby',
    teamId: 'nyk-knicks',
    position: 'PF',
    overall: 86,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    baseStats: { ppg: 14.7, rpg: 4.2, apg: 2.1, spg: 1.7, bpg: 0.9, fgPct: 48.9, fg3Pct: 38.2, ftPct: 75.3, tsPct: 59.0, usgPct: 18.0, per: 16.0, winShares: 6.8, dws: 3.9 }
  },
  {
    id: 'star-jhart',
    name: 'Josh Hart',
    teamId: 'nyk-knicks',
    position: 'SG',
    overall: 82,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 9.4, rpg: 8.3, apg: 4.1, spg: 0.9, bpg: 0.3, fgPct: 43.4, fg3Pct: 31.0, ftPct: 79.1, tsPct: 53.5, usgPct: 14.0, per: 14.0, winShares: 5.5, dws: 3.2 }
  },

  // ==========================================
  // PHILADELPHIA 76ERS
  // ==========================================
  {
    id: 'star-embiid',
    name: 'Joel Embiid',
    teamId: 'phi-76ers',
    position: 'C',
    overall: 96,
    archetype: 'POST_SCORER',
    isStarter: true,
    baseStats: { ppg: 32.5, rpg: 11.0, apg: 5.0, spg: 1.1, bpg: 1.7, fgPct: 52.0, fg3Pct: 38.0, ftPct: 88.0, tsPct: 64.0, usgPct: 37.0, per: 31.5, winShares: 12.5, dws: 4.2 }
  },
  {
    id: 'star-maxey',
    name: 'Tyrese Maxey',
    teamId: 'phi-76ers',
    position: 'PG',
    overall: 90,
    archetype: 'SLASHER',
    isStarter: true,
    previousStats: { ppg: 20.3, per: 17.5, overall: 84 },
    baseStats: { ppg: 25.9, rpg: 3.7, apg: 6.2, spg: 1.0, bpg: 0.5, fgPct: 45.0, fg3Pct: 37.3, ftPct: 86.8, tsPct: 57.3, usgPct: 28.0, per: 20.0, winShares: 8.5, dws: 2.2 }
  },
  {
    id: 'star-pg13',
    name: 'Paul George',
    teamId: 'phi-76ers',
    position: 'SF',
    overall: 89,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 22.6, rpg: 5.2, apg: 3.5, spg: 1.5, bpg: 0.5, fgPct: 47.1, fg3Pct: 41.3, ftPct: 90.7, tsPct: 61.3, usgPct: 27.0, per: 20.5, winShares: 8.8, dws: 3.5 }
  },
  {
    id: 'star-oubre',
    name: 'Kelly Oubre Jr.',
    teamId: 'phi-76ers',
    position: 'SG',
    overall: 80,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 15.4, rpg: 5.0, apg: 1.5, spg: 1.1, bpg: 0.7, fgPct: 44.1, fg3Pct: 31.1, ftPct: 75.0, tsPct: 53.0, usgPct: 22.0, per: 14.5, winShares: 3.8, dws: 2.1 }
  },

  // ==========================================
  // TORONTO RAPTORS
  // ==========================================
  {
    id: 'star-sbarnes',
    name: 'Scottie Barnes',
    teamId: 'tor-raptors',
    position: 'PF',
    overall: 88,
    archetype: 'POINT_FORWARD',
    isStarter: true,
    previousStats: { ppg: 15.3, per: 16.0, overall: 82 },
    baseStats: { ppg: 19.9, rpg: 8.2, apg: 6.1, spg: 1.3, bpg: 1.5, fgPct: 47.5, fg3Pct: 34.1, ftPct: 78.1, tsPct: 56.5, usgPct: 25.0, per: 20.0, winShares: 7.8, dws: 3.6 }
  },
  {
    id: 'star-rjbarrett',
    name: 'RJ Barrett',
    teamId: 'tor-raptors',
    position: 'SG',
    overall: 84,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 20.2, rpg: 5.4, apg: 3.8, spg: 0.6, bpg: 0.4, fgPct: 49.5, fg3Pct: 36.0, ftPct: 71.0, tsPct: 57.0, usgPct: 26.0, per: 17.5, winShares: 5.2, dws: 1.8 }
  },
  {
    id: 'star-quickley',
    name: 'Immanuel Quickley',
    teamId: 'tor-raptors',
    position: 'PG',
    overall: 83,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 17.0, rpg: 3.8, apg: 5.8, spg: 0.8, bpg: 0.2, fgPct: 43.4, fg3Pct: 39.5, ftPct: 85.3, tsPct: 58.0, usgPct: 23.0, per: 17.0, winShares: 5.8, dws: 2.0 }
  },
  {
    id: 'star-poeltl',
    name: 'Jakob Pöltl',
    teamId: 'tor-raptors',
    position: 'C',
    overall: 81,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 11.1, rpg: 8.6, apg: 2.5, spg: 0.7, bpg: 1.5, fgPct: 65.6, fg3Pct: 0.0, ftPct: 55.1, tsPct: 64.0, usgPct: 14.5, per: 19.0, winShares: 5.5, dws: 2.8 }
  },

  // ==========================================
  // CHICAGO BULLS
  // ==========================================
  {
    id: 'star-cobywhite',
    name: 'Coby White',
    teamId: 'chi-bulls',
    position: 'PG',
    overall: 84,
    archetype: 'PLAYMAKER',
    isStarter: true,
    previousStats: { ppg: 9.7, per: 12.0, overall: 76 },
    baseStats: { ppg: 19.1, rpg: 4.5, apg: 5.1, spg: 0.7, bpg: 0.2, fgPct: 44.7, fg3Pct: 37.6, ftPct: 83.8, tsPct: 57.0, usgPct: 23.5, per: 16.5, winShares: 5.8, dws: 1.8 }
  },
  {
    id: 'star-lavine',
    name: 'Zach LaVine',
    teamId: 'chi-bulls',
    position: 'SG',
    overall: 85,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 21.5, rpg: 4.8, apg: 4.0, spg: 0.8, bpg: 0.3, fgPct: 47.0, fg3Pct: 38.0, ftPct: 85.0, tsPct: 59.0, usgPct: 27.0, per: 18.5, winShares: 6.0, dws: 1.8 }
  },
  {
    id: 'star-vucevic',
    name: 'Nikola Vučević',
    teamId: 'chi-bulls',
    position: 'C',
    overall: 82,
    archetype: 'POST_SCORER',
    isStarter: true,
    baseStats: { ppg: 18.0, rpg: 10.5, apg: 3.3, spg: 0.7, bpg: 0.8, fgPct: 48.4, fg3Pct: 29.4, ftPct: 82.2, tsPct: 54.0, usgPct: 24.0, per: 19.0, winShares: 5.2, dws: 3.0 }
  },
  {
    id: 'star-dosunmu',
    name: 'Ayo Dosunmu',
    teamId: 'chi-bulls',
    position: 'SG',
    overall: 80,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    previousStats: { ppg: 8.6, per: 11.2, overall: 75 },
    baseStats: { ppg: 12.2, rpg: 2.8, apg: 3.2, spg: 0.9, bpg: 0.5, fgPct: 50.1, fg3Pct: 40.3, ftPct: 81.0, tsPct: 60.0, usgPct: 16.5, per: 14.5, winShares: 4.5, dws: 2.0 }
  },

  // ==========================================
  // CLEVELAND CAVALIERS
  // ==========================================
  {
    id: 'star-mitchell',
    name: 'Donovan Mitchell',
    teamId: 'cle-cavaliers',
    position: 'SG',
    overall: 92,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 26.6, rpg: 5.1, apg: 6.1, spg: 1.8, bpg: 0.5, fgPct: 46.2, fg3Pct: 36.8, ftPct: 86.5, tsPct: 59.5, usgPct: 31.0, per: 22.0, winShares: 9.5, dws: 3.4 }
  },
  {
    id: 'star-mobley',
    name: 'Evan Mobley',
    teamId: 'cle-cavaliers',
    position: 'PF',
    overall: 88,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 16.5, rpg: 9.4, apg: 3.2, spg: 0.9, bpg: 1.5, fgPct: 58.0, fg3Pct: 37.3, ftPct: 71.9, tsPct: 62.0, usgPct: 20.0, per: 19.5, winShares: 8.0, dws: 4.4 }
  },
  {
    id: 'star-garland',
    name: 'Darius Garland',
    teamId: 'cle-cavaliers',
    position: 'PG',
    overall: 87,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 18.0, rpg: 2.7, apg: 6.5, spg: 1.3, bpg: 0.1, fgPct: 44.6, fg3Pct: 37.1, ftPct: 83.4, tsPct: 56.0, usgPct: 24.0, per: 16.8, winShares: 5.5, dws: 2.5 }
  },
  {
    id: 'star-jallen',
    name: 'Jarrett Allen',
    teamId: 'cle-cavaliers',
    position: 'C',
    overall: 86,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 16.5, rpg: 10.5, apg: 2.7, spg: 0.7, bpg: 1.1, fgPct: 63.4, fg3Pct: 0.0, ftPct: 74.2, tsPct: 65.5, usgPct: 18.0, per: 22.0, winShares: 9.8, dws: 4.2 }
  },
  {
    id: 'star-levert',
    name: 'Caris LeVert',
    teamId: 'cle-cavaliers',
    position: 'SG',
    overall: 81,
    archetype: 'SLASHER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 14.0, rpg: 4.1, apg: 5.1, spg: 1.1, bpg: 0.5, fgPct: 42.1, fg3Pct: 32.5, ftPct: 76.6, tsPct: 53.0, usgPct: 22.5, per: 15.2, winShares: 4.2, dws: 2.3 }
  },

  // ==========================================
  // DETROIT PISTONS
  // ==========================================
  {
    id: 'star-cade',
    name: 'Cade Cunningham',
    teamId: 'det-pistons',
    position: 'PG',
    overall: 87,
    archetype: 'POINT_FORWARD',
    isStarter: true,
    baseStats: { ppg: 22.7, rpg: 4.3, apg: 7.5, spg: 0.9, bpg: 0.4, fgPct: 44.9, fg3Pct: 35.5, ftPct: 86.0, tsPct: 54.6, usgPct: 29.5, per: 18.5, winShares: 4.8, dws: 1.8 }
  },
  {
    id: 'star-ivey',
    name: 'Jaden Ivey',
    teamId: 'det-pistons',
    position: 'SG',
    overall: 82,
    archetype: 'SLASHER',
    isStarter: true,
    previousStats: { ppg: 15.4, per: 13.5, overall: 78 },
    baseStats: { ppg: 17.5, rpg: 3.8, apg: 4.0, spg: 0.9, bpg: 0.3, fgPct: 44.5, fg3Pct: 35.0, ftPct: 75.5, tsPct: 54.0, usgPct: 25.0, per: 15.5, winShares: 3.5, dws: 1.4 }
  },
  {
    id: 'star-duren',
    name: 'Jalen Duren',
    teamId: 'det-pistons',
    position: 'C',
    overall: 82,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 13.8, rpg: 11.6, apg: 2.4, spg: 0.5, bpg: 0.8, fgPct: 61.9, fg3Pct: 0.0, ftPct: 79.0, tsPct: 64.0, usgPct: 17.0, per: 19.5, winShares: 5.5, dws: 2.2 }
  },
  {
    id: 'star-ausar',
    name: 'Ausar Thompson',
    teamId: 'det-pistons',
    position: 'SF',
    overall: 80,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    baseStats: { ppg: 8.8, rpg: 6.4, apg: 1.9, spg: 1.1, bpg: 0.9, fgPct: 48.3, fg3Pct: 18.6, ftPct: 59.7, tsPct: 51.0, usgPct: 15.0, per: 14.0, winShares: 3.2, dws: 2.5 }
  },

  // ==========================================
  // INDIANA PACERS
  // ==========================================
  {
    id: 'star-haliburton',
    name: 'Tyrese Haliburton',
    teamId: 'ind-pacers',
    position: 'PG',
    overall: 91,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 20.1, rpg: 3.9, apg: 10.9, spg: 1.2, bpg: 0.7, fgPct: 47.7, fg3Pct: 36.4, ftPct: 85.5, tsPct: 60.5, usgPct: 24.5, per: 22.0, winShares: 9.8, dws: 2.2 }
  },
  {
    id: 'star-siakam',
    name: 'Pascal Siakam',
    teamId: 'ind-pacers',
    position: 'PF',
    overall: 88,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 21.3, rpg: 7.8, apg: 3.7, spg: 0.8, bpg: 0.4, fgPct: 53.6, fg3Pct: 38.6, ftPct: 70.0, tsPct: 60.2, usgPct: 25.0, per: 20.5, winShares: 8.2, dws: 2.8 }
  },
  {
    id: 'star-mturner',
    name: 'Myles Turner',
    teamId: 'ind-pacers',
    position: 'C',
    overall: 84,
    archetype: 'STRETCH_BIG',
    isStarter: true,
    baseStats: { ppg: 17.1, rpg: 6.9, apg: 1.3, spg: 0.5, bpg: 1.9, fgPct: 52.4, fg3Pct: 35.8, ftPct: 77.3, tsPct: 62.0, usgPct: 21.0, per: 20.0, winShares: 7.0, dws: 3.2 }
  },
  {
    id: 'star-mcconnell',
    name: 'T.J. McConnell',
    teamId: 'ind-pacers',
    position: 'PG',
    overall: 80,
    archetype: 'PLAYMAKER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 10.2, rpg: 2.7, apg: 5.5, spg: 1.0, bpg: 0.1, fgPct: 55.6, fg3Pct: 31.0, ftPct: 79.0, tsPct: 58.0, usgPct: 21.0, per: 19.2, winShares: 4.5, dws: 1.8 }
  },

  // ==========================================
  // MILWAUKEE BUCKS
  // ==========================================
  {
    id: 'star-giannis',
    name: 'Giannis Antetokounmpo',
    teamId: 'mil-bucks',
    position: 'PF',
    overall: 97,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 30.4, rpg: 11.5, apg: 6.5, spg: 1.2, bpg: 1.1, fgPct: 61.1, fg3Pct: 27.4, ftPct: 65.7, tsPct: 64.9, usgPct: 33.0, per: 29.8, winShares: 14.5, dws: 4.5 }
  },
  {
    id: 'star-lillard',
    name: 'Damian Lillard',
    teamId: 'mil-bucks',
    position: 'PG',
    overall: 91,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 24.3, rpg: 4.4, apg: 7.0, spg: 1.0, bpg: 0.2, fgPct: 42.4, fg3Pct: 35.4, ftPct: 92.0, tsPct: 59.0, usgPct: 28.0, per: 21.0, winShares: 9.0, dws: 2.1 }
  },
  {
    id: 'star-middleton',
    name: 'Khris Middleton',
    teamId: 'mil-bucks',
    position: 'SF',
    overall: 85,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 15.1, rpg: 4.7, apg: 5.3, spg: 0.9, bpg: 0.3, fgPct: 49.3, fg3Pct: 38.1, ftPct: 83.3, tsPct: 59.0, usgPct: 22.0, per: 17.5, winShares: 5.0, dws: 2.2 }
  },
  {
    id: 'star-bportis',
    name: 'Bobby Portis',
    teamId: 'mil-bucks',
    position: 'PF',
    overall: 82,
    archetype: 'POST_SCORER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 13.8, rpg: 7.4, apg: 1.3, spg: 0.8, bpg: 0.4, fgPct: 50.8, fg3Pct: 40.7, ftPct: 79.0, tsPct: 57.5, usgPct: 22.0, per: 18.0, winShares: 5.2, dws: 2.3 }
  },
  {
    id: 'star-blopez',
    name: 'Brook Lopez',
    teamId: 'mil-bucks',
    position: 'C',
    overall: 82,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 12.5, rpg: 5.2, apg: 1.6, spg: 0.5, bpg: 2.4, fgPct: 48.5, fg3Pct: 36.6, ftPct: 82.1, tsPct: 59.5, usgPct: 16.0, per: 16.5, winShares: 5.8, dws: 3.8 }
  },

  // ==========================================
  // ATLANTA HAWKS
  // ==========================================
  {
    id: 'star-trae',
    name: 'Trae Young',
    teamId: 'atl-hawks',
    position: 'PG',
    overall: 89,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 25.7, rpg: 2.8, apg: 10.8, spg: 1.3, bpg: 0.2, fgPct: 43.0, fg3Pct: 37.3, ftPct: 85.5, tsPct: 58.5, usgPct: 30.5, per: 20.5, winShares: 7.5, dws: 1.8 }
  },
  {
    id: 'star-jjohnson',
    name: 'Jalen Johnson',
    teamId: 'atl-hawks',
    position: 'PF',
    overall: 85,
    archetype: 'POINT_FORWARD',
    isStarter: true,
    previousStats: { ppg: 5.6, per: 12.5, overall: 75 },
    baseStats: { ppg: 16.0, rpg: 8.7, apg: 3.6, spg: 1.2, bpg: 0.8, fgPct: 51.1, fg3Pct: 35.5, ftPct: 72.8, tsPct: 57.5, usgPct: 20.5, per: 17.5, winShares: 5.2, dws: 2.8 }
  },
  {
    id: 'star-bogdan',
    name: 'Bogdan Bogdanović',
    teamId: 'atl-hawks',
    position: 'SG',
    overall: 82,
    archetype: 'SHARPSHOOTER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 16.9, rpg: 3.4, apg: 3.1, spg: 1.2, bpg: 0.3, fgPct: 42.8, fg3Pct: 37.4, ftPct: 92.1, tsPct: 57.0, usgPct: 24.0, per: 16.0, winShares: 4.8, dws: 1.8 }
  },
  {
    id: 'star-daniels',
    name: 'Dyson Daniels',
    teamId: 'atl-hawks',
    position: 'SG',
    overall: 81,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    previousStats: { ppg: 5.8, per: 11.5, overall: 74 },
    baseStats: { ppg: 14.5, rpg: 4.8, apg: 3.5, spg: 3.2, bpg: 0.9, fgPct: 48.0, fg3Pct: 34.0, ftPct: 74.0, tsPct: 55.0, usgPct: 18.0, per: 16.5, winShares: 5.0, dws: 4.0 }
  },

  // ==========================================
  // CHARLOTTE HORNETS
  // ==========================================
  {
    id: 'star-lamelo',
    name: 'LaMelo Ball',
    teamId: 'cha-hornets',
    position: 'PG',
    overall: 87,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 23.9, rpg: 5.1, apg: 8.0, spg: 1.8, bpg: 0.2, fgPct: 43.3, fg3Pct: 35.5, ftPct: 86.5, tsPct: 55.0, usgPct: 31.0, per: 19.5, winShares: 5.5, dws: 2.1 }
  },
  {
    id: 'star-bmiller',
    name: 'Brandon Miller',
    teamId: 'cha-hornets',
    position: 'SF',
    overall: 83,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    previousStats: { ppg: 17.3, per: 14.0, overall: 79 },
    baseStats: { ppg: 19.5, rpg: 4.8, apg: 3.5, spg: 1.1, bpg: 0.6, fgPct: 44.5, fg3Pct: 37.5, ftPct: 82.0, tsPct: 56.0, usgPct: 24.5, per: 16.5, winShares: 4.5, dws: 2.0 }
  },
  {
    id: 'star-mbridges',
    name: 'Miles Bridges',
    teamId: 'cha-hornets',
    position: 'PF',
    overall: 82,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 21.0, rpg: 7.3, apg: 3.3, spg: 0.9, bpg: 0.5, fgPct: 46.2, fg3Pct: 34.9, ftPct: 82.5, tsPct: 55.5, usgPct: 26.0, per: 17.0, winShares: 4.2, dws: 2.0 }
  },

  // ==========================================
  // MIAMI HEAT
  // ==========================================
  {
    id: 'star-jbutler',
    name: 'Jimmy Butler',
    teamId: 'mia-heat',
    position: 'SF',
    overall: 89,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 20.8, rpg: 5.3, apg: 5.0, spg: 1.3, bpg: 0.3, fgPct: 49.9, fg3Pct: 41.4, ftPct: 85.8, tsPct: 62.6, usgPct: 25.0, per: 23.5, winShares: 9.0, dws: 3.5 }
  },
  {
    id: 'star-bam',
    name: 'Bam Adebayo',
    teamId: 'mia-heat',
    position: 'C',
    overall: 89,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 19.3, rpg: 10.4, apg: 3.9, spg: 1.1, bpg: 0.9, fgPct: 52.1, fg3Pct: 35.7, ftPct: 75.5, tsPct: 57.5, usgPct: 25.0, per: 20.0, winShares: 8.5, dws: 4.8 }
  },
  {
    id: 'star-herro',
    name: 'Tyler Herro',
    teamId: 'mia-heat',
    position: 'SG',
    overall: 84,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 20.8, rpg: 5.3, apg: 4.5, spg: 0.8, bpg: 0.1, fgPct: 44.1, fg3Pct: 39.6, ftPct: 85.6, tsPct: 56.5, usgPct: 27.0, per: 17.5, winShares: 5.0, dws: 2.1 }
  },
  {
    id: 'star-jaquez',
    name: 'Jaime Jaquez Jr.',
    teamId: 'mia-heat',
    position: 'SF',
    overall: 80,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 12.5, rpg: 4.0, apg: 2.8, spg: 1.0, bpg: 0.3, fgPct: 48.9, fg3Pct: 32.2, ftPct: 81.1, tsPct: 55.5, usgPct: 18.0, per: 14.5, winShares: 4.0, dws: 2.2 }
  },

  // ==========================================
  // ORLANDO MAGIC
  // ==========================================
  {
    id: 'star-banchero',
    name: 'Paolo Banchero',
    teamId: 'orl-magic',
    position: 'PF',
    overall: 89,
    archetype: 'POINT_FORWARD',
    isStarter: true,
    baseStats: { ppg: 24.5, rpg: 7.2, apg: 5.5, spg: 0.9, bpg: 0.6, fgPct: 46.5, fg3Pct: 35.0, ftPct: 74.0, tsPct: 56.5, usgPct: 30.0, per: 21.0, winShares: 7.8, dws: 3.5 }
  },
  {
    id: 'star-fwagner',
    name: 'Franz Wagner',
    teamId: 'orl-magic',
    position: 'SF',
    overall: 87,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 21.5, rpg: 5.5, apg: 4.2, spg: 1.2, bpg: 0.5, fgPct: 48.5, fg3Pct: 34.0, ftPct: 85.0, tsPct: 58.0, usgPct: 26.5, per: 19.0, winShares: 7.5, dws: 3.5 }
  },
  {
    id: 'star-suggs',
    name: 'Jalen Suggs',
    teamId: 'orl-magic',
    position: 'PG',
    overall: 83,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    baseStats: { ppg: 14.5, rpg: 3.5, apg: 3.8, spg: 1.6, bpg: 0.7, fgPct: 46.0, fg3Pct: 38.0, ftPct: 78.0, tsPct: 58.0, usgPct: 19.5, per: 15.5, winShares: 5.5, dws: 3.8 }
  },

  // ==========================================
  // WASHINGTON WIZARDS
  // ==========================================
  {
    id: 'star-kuzma',
    name: 'Kyle Kuzma',
    teamId: 'was-wizards',
    position: 'PF',
    overall: 83,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 22.2, rpg: 6.6, apg: 4.2, spg: 0.5, bpg: 0.7, fgPct: 46.3, fg3Pct: 33.6, ftPct: 77.5, tsPct: 54.5, usgPct: 30.0, per: 17.0, winShares: 4.0, dws: 1.5 }
  },
  {
    id: 'star-poole',
    name: 'Jordan Poole',
    teamId: 'was-wizards',
    position: 'SG',
    overall: 82,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 19.5, rpg: 2.8, apg: 4.8, spg: 1.1, bpg: 0.3, fgPct: 42.5, fg3Pct: 35.0, ftPct: 87.0, tsPct: 54.0, usgPct: 27.5, per: 15.0, winShares: 3.5, dws: 1.2 }
  },
  {
    id: 'star-sarr',
    name: 'Alexandre Sarr',
    teamId: 'was-wizards',
    position: 'C',
    overall: 78,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    isRookie: true, // ROTY candidate
    baseStats: { ppg: 12.0, rpg: 7.2, apg: 2.1, spg: 0.6, bpg: 2.2, fgPct: 44.0, fg3Pct: 28.5, ftPct: 68.0, tsPct: 49.0, usgPct: 20.0, per: 14.0, winShares: 3.0, dws: 2.8 }
  },

  // ==========================================
  // DENVER NUGGETS
  // ==========================================
  {
    id: 'star-jokic',
    name: 'Nikola Jokić',
    teamId: 'den-nuggets',
    position: 'C',
    overall: 98,
    archetype: 'POST_SCORER',
    isStarter: true,
    baseStats: { ppg: 29.5, rpg: 13.0, apg: 10.2, spg: 1.5, bpg: 0.9, fgPct: 58.3, fg3Pct: 36.5, ftPct: 82.5, tsPct: 65.5, usgPct: 30.0, per: 32.0, winShares: 17.5, dws: 5.0 }
  },
  {
    id: 'star-jmurray',
    name: 'Jamal Murray',
    teamId: 'den-nuggets',
    position: 'PG',
    overall: 88,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 21.2, rpg: 4.1, apg: 6.5, spg: 1.0, bpg: 0.7, fgPct: 48.1, fg3Pct: 42.5, ftPct: 85.3, tsPct: 59.0, usgPct: 25.5, per: 20.0, winShares: 7.8, dws: 2.5 }
  },
  {
    id: 'star-mpj',
    name: 'Michael Porter Jr.',
    teamId: 'den-nuggets',
    position: 'SF',
    overall: 85,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 17.5, rpg: 7.2, apg: 1.8, spg: 0.7, bpg: 0.7, fgPct: 49.0, fg3Pct: 40.0, ftPct: 80.0, tsPct: 60.5, usgPct: 20.5, per: 18.0, winShares: 7.0, dws: 2.8 }
  },
  {
    id: 'star-agordon',
    name: 'Aaron Gordon',
    teamId: 'den-nuggets',
    position: 'PF',
    overall: 84,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 14.5, rpg: 6.8, apg: 3.5, spg: 0.8, bpg: 0.6, fgPct: 56.0, fg3Pct: 30.0, ftPct: 66.0, tsPct: 60.0, usgPct: 18.0, per: 17.5, winShares: 6.5, dws: 3.0 }
  },
  {
    id: 'star-westbrook',
    name: 'Russell Westbrook',
    teamId: 'den-nuggets',
    position: 'PG',
    overall: 81,
    archetype: 'SLASHER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 13.0, rpg: 5.2, apg: 5.5, spg: 1.2, bpg: 0.4, fgPct: 44.0, fg3Pct: 30.0, ftPct: 70.0, tsPct: 51.5, usgPct: 24.0, per: 16.0, winShares: 4.0, dws: 2.4 }
  },

  // ==========================================
  // MINNESOTA TIMBERWOLVES
  // ==========================================
  {
    id: 'star-edwards',
    name: 'Anthony Edwards',
    teamId: 'min-timberwolves',
    position: 'SG',
    overall: 94,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 27.5, rpg: 5.6, apg: 5.2, spg: 1.4, bpg: 0.6, fgPct: 46.8, fg3Pct: 38.0, ftPct: 84.0, tsPct: 59.0, usgPct: 32.0, per: 23.0, winShares: 11.0, dws: 4.0 }
  },
  {
    id: 'star-gobert',
    name: 'Rudy Gobert',
    teamId: 'min-timberwolves',
    position: 'C',
    overall: 89,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 14.0, rpg: 12.9, apg: 1.3, spg: 0.7, bpg: 2.1, fgPct: 66.1, fg3Pct: 0.0, ftPct: 63.8, tsPct: 67.0, usgPct: 15.0, per: 20.0, winShares: 11.5, dws: 5.9 }
  },
  {
    id: 'star-randle',
    name: 'Julius Randle',
    teamId: 'min-timberwolves',
    position: 'PF',
    overall: 86,
    archetype: 'POINT_FORWARD',
    isStarter: true,
    baseStats: { ppg: 22.5, rpg: 8.5, apg: 4.5, spg: 0.6, bpg: 0.3, fgPct: 48.0, fg3Pct: 34.0, ftPct: 79.0, tsPct: 57.5, usgPct: 28.0, per: 19.5, winShares: 7.2, dws: 2.8 }
  },
  {
    id: 'star-nazreid',
    name: 'Naz Reid',
    teamId: 'min-timberwolves',
    position: 'C',
    overall: 84,
    archetype: 'STRETCH_BIG',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 15.5, rpg: 6.0, apg: 1.9, spg: 0.8, bpg: 1.0, fgPct: 48.0, fg3Pct: 41.5, ftPct: 74.0, tsPct: 59.5, usgPct: 23.5, per: 18.5, winShares: 5.5, dws: 2.6 }
  },
  {
    id: 'star-jmcdaniels',
    name: 'Jaden McDaniels',
    teamId: 'min-timberwolves',
    position: 'SF',
    overall: 82,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    baseStats: { ppg: 11.0, rpg: 3.5, apg: 1.5, spg: 1.0, bpg: 0.9, fgPct: 49.0, fg3Pct: 34.5, ftPct: 73.0, tsPct: 57.0, usgPct: 14.5, per: 13.5, winShares: 4.5, dws: 3.8 }
  },

  // ==========================================
  // OKLAHOMA CITY THUNDER
  // ==========================================
  {
    id: 'star-shai',
    name: 'Shai Gilgeous-Alexander',
    teamId: 'okc-thunder',
    position: 'PG',
    overall: 96,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 30.5, rpg: 5.5, apg: 6.5, spg: 2.1, bpg: 1.0, fgPct: 54.0, fg3Pct: 36.0, ftPct: 88.0, tsPct: 64.0, usgPct: 32.5, per: 28.5, winShares: 15.5, dws: 4.5 }
  },
  {
    id: 'star-chet',
    name: 'Chet Holmgren',
    teamId: 'okc-thunder',
    position: 'C',
    overall: 88,
    archetype: 'STRETCH_BIG',
    isStarter: true,
    baseStats: { ppg: 17.5, rpg: 8.5, apg: 2.5, spg: 0.7, bpg: 2.5, fgPct: 53.5, fg3Pct: 38.0, ftPct: 80.0, tsPct: 64.0, usgPct: 22.0, per: 21.0, winShares: 8.5, dws: 4.6 }
  },
  {
    id: 'star-jwill',
    name: 'Jalen Williams',
    teamId: 'okc-thunder',
    position: 'SF',
    overall: 87,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    previousStats: { ppg: 14.1, per: 15.0, overall: 81 },
    baseStats: { ppg: 19.5, rpg: 4.5, apg: 4.8, spg: 1.2, bpg: 0.6, fgPct: 53.0, fg3Pct: 40.0, ftPct: 82.0, tsPct: 61.5, usgPct: 23.5, per: 19.0, winShares: 8.0, dws: 3.2 }
  },
  {
    id: 'star-caruso',
    name: 'Alex Caruso',
    teamId: 'okc-thunder',
    position: 'SG',
    overall: 84,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 10.5, rpg: 3.8, apg: 3.5, spg: 1.8, bpg: 1.0, fgPct: 47.0, fg3Pct: 40.0, ftPct: 76.0, tsPct: 61.0, usgPct: 15.0, per: 15.5, winShares: 5.5, dws: 3.8 }
  },

  // ==========================================
  // PORTLAND TRAIL BLAZERS
  // ==========================================
  {
    id: 'star-asimons',
    name: 'Anfernee Simons',
    teamId: 'por-trail-blazers',
    position: 'SG',
    overall: 83,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 22.6, rpg: 3.6, apg: 5.5, spg: 0.5, bpg: 0.1, fgPct: 43.0, fg3Pct: 38.5, ftPct: 91.5, tsPct: 56.5, usgPct: 28.5, per: 17.0, winShares: 4.5, dws: 1.2 }
  },
  {
    id: 'star-jgrant',
    name: 'Jerami Grant',
    teamId: 'por-trail-blazers',
    position: 'PF',
    overall: 82,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 21.0, rpg: 3.5, apg: 2.8, spg: 0.8, bpg: 0.6, fgPct: 45.1, fg3Pct: 40.2, ftPct: 81.7, tsPct: 57.5, usgPct: 26.0, per: 16.5, winShares: 4.2, dws: 1.5 }
  },
  {
    id: 'star-ayton',
    name: 'Deandre Ayton',
    teamId: 'por-trail-blazers',
    position: 'C',
    overall: 82,
    archetype: 'POST_SCORER',
    isStarter: true,
    baseStats: { ppg: 16.7, rpg: 11.1, apg: 1.6, spg: 1.0, bpg: 0.8, fgPct: 57.0, fg3Pct: 10.0, ftPct: 82.3, tsPct: 59.5, usgPct: 21.5, per: 19.0, winShares: 5.2, dws: 2.5 }
  },

  // ==========================================
  // UTAH JAZZ
  // ==========================================
  {
    id: 'star-markkanen',
    name: 'Lauri Markkanen',
    teamId: 'uta-jazz',
    position: 'PF',
    overall: 87,
    archetype: 'STRETCH_BIG',
    isStarter: true,
    baseStats: { ppg: 23.2, rpg: 8.2, apg: 2.0, spg: 0.9, bpg: 0.5, fgPct: 48.0, fg3Pct: 40.0, ftPct: 90.0, tsPct: 63.0, usgPct: 25.5, per: 21.5, winShares: 7.5, dws: 2.4 }
  },
  {
    id: 'star-sexton',
    name: 'Collin Sexton',
    teamId: 'uta-jazz',
    position: 'SG',
    overall: 82,
    archetype: 'SLASHER',
    isStarter: true,
    previousStats: { ppg: 14.3, per: 15.5, overall: 78 },
    baseStats: { ppg: 18.7, rpg: 2.6, apg: 4.9, spg: 0.8, bpg: 0.2, fgPct: 49.3, fg3Pct: 39.4, ftPct: 86.0, tsPct: 61.0, usgPct: 26.0, per: 18.5, winShares: 5.0, dws: 1.5 }
  },
  {
    id: 'star-wkessler',
    name: 'Walker Kessler',
    teamId: 'uta-jazz',
    position: 'C',
    overall: 81,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 9.5, rpg: 9.8, apg: 1.1, spg: 0.5, bpg: 2.6, fgPct: 65.5, fg3Pct: 20.0, ftPct: 60.0, tsPct: 65.0, usgPct: 14.0, per: 18.0, winShares: 5.5, dws: 3.5 }
  },

  // ==========================================
  // GOLDEN STATE WARRIORS
  // ==========================================
  {
    id: 'star-curry',
    name: 'Stephen Curry',
    teamId: 'gsw-warriors',
    position: 'PG',
    overall: 94,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 26.4, rpg: 4.5, apg: 5.1, spg: 0.7, bpg: 0.4, fgPct: 45.0, fg3Pct: 40.8, ftPct: 92.3, tsPct: 62.6, usgPct: 30.5, per: 22.0, winShares: 8.5, dws: 2.1 }
  },
  {
    id: 'star-dgreen',
    name: 'Draymond Green',
    teamId: 'gsw-warriors',
    position: 'PF',
    overall: 85,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    baseStats: { ppg: 8.6, rpg: 7.2, apg: 6.0, spg: 1.0, bpg: 0.9, fgPct: 49.7, fg3Pct: 39.5, ftPct: 73.0, tsPct: 59.0, usgPct: 15.0, per: 15.0, winShares: 5.5, dws: 3.9 }
  },
  {
    id: 'star-kuminga',
    name: 'Jonathan Kuminga',
    teamId: 'gsw-warriors',
    position: 'SF',
    overall: 83,
    archetype: 'SLASHER',
    isStarter: true,
    previousStats: { ppg: 9.9, per: 14.0, overall: 77 },
    baseStats: { ppg: 17.5, rpg: 5.0, apg: 2.4, spg: 0.8, bpg: 0.5, fgPct: 52.9, fg3Pct: 32.1, ftPct: 74.6, tsPct: 59.5, usgPct: 24.5, per: 17.8, winShares: 5.2, dws: 2.2 }
  },
  {
    id: 'star-hield',
    name: 'Buddy Hield',
    teamId: 'gsw-warriors',
    position: 'SG',
    overall: 81,
    archetype: 'SHARPSHOOTER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 14.8, rpg: 3.5, apg: 2.2, spg: 0.9, bpg: 0.4, fgPct: 46.0, fg3Pct: 41.5, ftPct: 86.0, tsPct: 62.0, usgPct: 21.0, per: 16.5, winShares: 4.8, dws: 1.8 }
  },

  // ==========================================
  // LA CLIPPERS
  // ==========================================
  {
    id: 'star-kawhi',
    name: 'Kawhi Leonard',
    teamId: 'lac-clippers',
    position: 'SF',
    overall: 91,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 23.7, rpg: 6.1, apg: 3.6, spg: 1.6, bpg: 0.9, fgPct: 52.5, fg3Pct: 41.7, ftPct: 88.5, tsPct: 62.5, usgPct: 26.0, per: 24.0, winShares: 9.5, dws: 3.8 }
  },
  {
    id: 'star-harden',
    name: 'James Harden',
    teamId: 'lac-clippers',
    position: 'PG',
    overall: 88,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 19.5, rpg: 5.5, apg: 8.8, spg: 1.2, bpg: 0.6, fgPct: 43.5, fg3Pct: 37.0, ftPct: 87.5, tsPct: 61.0, usgPct: 25.0, per: 20.5, winShares: 8.5, dws: 2.8 }
  },
  {
    id: 'star-npowell',
    name: 'Norman Powell',
    teamId: 'lac-clippers',
    position: 'SG',
    overall: 84,
    archetype: 'SHARPSHOOTER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 17.5, rpg: 3.2, apg: 2.0, spg: 0.9, bpg: 0.3, fgPct: 48.6, fg3Pct: 43.5, ftPct: 83.1, tsPct: 63.0, usgPct: 23.0, per: 17.5, winShares: 5.8, dws: 1.9 }
  },
  {
    id: 'star-zubac',
    name: 'Ivica Zubac',
    teamId: 'lac-clippers',
    position: 'C',
    overall: 83,
    archetype: 'POST_SCORER',
    isStarter: true,
    baseStats: { ppg: 13.5, rpg: 10.2, apg: 1.5, spg: 0.4, bpg: 1.3, fgPct: 64.9, fg3Pct: 0.0, ftPct: 72.0, tsPct: 66.0, usgPct: 16.0, per: 20.0, winShares: 7.0, dws: 3.2 }
  },

  // ==========================================
  // LA LAKERS
  // ==========================================
  {
    id: 'star-lebron',
    name: 'LeBron James',
    teamId: 'lal-lakers',
    position: 'PF',
    overall: 94,
    archetype: 'POINT_FORWARD',
    isStarter: true,
    baseStats: { ppg: 25.7, rpg: 7.3, apg: 8.3, spg: 1.3, bpg: 0.5, fgPct: 54.0, fg3Pct: 41.0, ftPct: 75.0, tsPct: 63.0, usgPct: 29.5, per: 24.0, winShares: 10.0, dws: 3.0 }
  },
  {
    id: 'star-davis',
    name: 'Anthony Davis',
    teamId: 'lal-lakers',
    position: 'C',
    overall: 94,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 25.5, rpg: 12.6, apg: 3.5, spg: 1.2, bpg: 2.3, fgPct: 55.6, fg3Pct: 27.1, ftPct: 81.6, tsPct: 61.2, usgPct: 27.0, per: 26.8, winShares: 12.0, dws: 5.5 }
  },
  {
    id: 'star-reaves',
    name: 'Austin Reaves',
    teamId: 'lal-lakers',
    position: 'SG',
    overall: 83,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 16.5, rpg: 4.3, apg: 5.5, spg: 0.8, bpg: 0.3, fgPct: 48.6, fg3Pct: 37.0, ftPct: 85.5, tsPct: 61.5, usgPct: 21.0, per: 16.8, winShares: 6.2, dws: 2.0 }
  },
  {
    id: 'star-drussell',
    name: "D'Angelo Russell",
    teamId: 'lal-lakers',
    position: 'PG',
    overall: 82,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 17.5, rpg: 3.0, apg: 6.2, spg: 0.9, bpg: 0.4, fgPct: 45.6, fg3Pct: 41.5, ftPct: 82.5, tsPct: 58.5, usgPct: 23.5, per: 17.0, winShares: 5.5, dws: 1.8 }
  },

  // ==========================================
  // PHOENIX SUNS
  // ==========================================
  {
    id: 'star-durant',
    name: 'Kevin Durant',
    teamId: 'phx-suns',
    position: 'SF',
    overall: 94,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 27.1, rpg: 6.6, apg: 5.0, spg: 0.9, bpg: 1.2, fgPct: 52.3, fg3Pct: 41.3, ftPct: 85.6, tsPct: 62.6, usgPct: 29.0, per: 23.0, winShares: 9.8, dws: 3.1 }
  },
  {
    id: 'star-booker',
    name: 'Devin Booker',
    teamId: 'phx-suns',
    position: 'SG',
    overall: 92,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 27.1, rpg: 4.5, apg: 6.9, spg: 0.9, bpg: 0.4, fgPct: 49.2, fg3Pct: 36.4, ftPct: 88.6, tsPct: 61.1, usgPct: 30.0, per: 22.1, winShares: 9.1, dws: 2.2 }
  },
  {
    id: 'star-beal',
    name: 'Bradley Beal',
    teamId: 'phx-suns',
    position: 'SG',
    overall: 86,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 18.2, rpg: 4.4, apg: 5.0, spg: 1.0, bpg: 0.5, fgPct: 51.3, fg3Pct: 43.0, ftPct: 81.3, tsPct: 61.0, usgPct: 22.5, per: 18.0, winShares: 5.5, dws: 2.0 }
  },
  {
    id: 'star-gallen',
    name: 'Grayson Allen',
    teamId: 'phx-suns',
    position: 'SG',
    overall: 81,
    archetype: 'SHARPSHOOTER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 13.5, rpg: 3.9, apg: 3.0, spg: 0.9, bpg: 0.6, fgPct: 49.9, fg3Pct: 46.1, ftPct: 87.8, tsPct: 67.5, usgPct: 16.0, per: 16.0, winShares: 6.0, dws: 2.2 }
  },

  // ==========================================
  // SACRAMENTO KINGS
  // ==========================================
  {
    id: 'star-dfox',
    name: "De'Aaron Fox",
    teamId: 'sac-kings',
    position: 'PG',
    overall: 89,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 26.6, rpg: 4.6, apg: 5.6, spg: 2.0, bpg: 0.4, fgPct: 46.5, fg3Pct: 36.9, ftPct: 73.8, tsPct: 56.5, usgPct: 30.0, per: 21.0, winShares: 8.0, dws: 3.2 }
  },
  {
    id: 'star-sabonis',
    name: 'Domantas Sabonis',
    teamId: 'sac-kings',
    position: 'C',
    overall: 89,
    archetype: 'POST_SCORER',
    isStarter: true,
    baseStats: { ppg: 19.4, rpg: 13.7, apg: 8.2, spg: 0.8, bpg: 0.6, fgPct: 59.4, fg3Pct: 37.9, ftPct: 70.4, tsPct: 63.5, usgPct: 22.5, per: 23.0, winShares: 12.0, dws: 4.2 }
  },
  {
    id: 'star-derozan',
    name: 'DeMar DeRozan',
    teamId: 'sac-kings',
    position: 'SF',
    overall: 86,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 23.5, rpg: 4.3, apg: 5.0, spg: 1.1, bpg: 0.6, fgPct: 48.0, fg3Pct: 33.3, ftPct: 85.5, tsPct: 58.5, usgPct: 26.5, per: 20.0, winShares: 8.0, dws: 2.4 }
  },
  {
    id: 'star-monk',
    name: 'Malik Monk',
    teamId: 'sac-kings',
    position: 'SG',
    overall: 84,
    archetype: 'SLASHER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 16.5, rpg: 3.0, apg: 5.2, spg: 0.8, bpg: 0.4, fgPct: 44.5, fg3Pct: 36.0, ftPct: 82.0, tsPct: 56.5, usgPct: 25.0, per: 17.5, winShares: 4.5, dws: 1.5 }
  },

  // ==========================================
  // DALLAS MAVERICKS
  // ==========================================
  {
    id: 'star-doncic',
    name: 'Luka Dončić',
    teamId: 'dal-mavericks',
    position: 'PG',
    overall: 97,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 33.9, rpg: 9.2, apg: 9.8, spg: 1.4, bpg: 0.5, fgPct: 48.7, fg3Pct: 38.2, ftPct: 78.6, tsPct: 61.7, usgPct: 36.0, per: 28.5, winShares: 13.5, dws: 3.2 }
  },
  {
    id: 'star-kyrie',
    name: 'Kyrie Irving',
    teamId: 'dal-mavericks',
    position: 'SG',
    overall: 91,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 25.6, rpg: 5.0, apg: 5.2, spg: 1.3, bpg: 0.5, fgPct: 49.7, fg3Pct: 41.1, ftPct: 90.5, tsPct: 60.8, usgPct: 27.5, per: 22.0, winShares: 8.5, dws: 2.8 }
  },
  {
    id: 'star-kthompson',
    name: 'Klay Thompson',
    teamId: 'dal-mavericks',
    position: 'SG',
    overall: 83,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 17.0, rpg: 3.3, apg: 2.3, spg: 0.6, bpg: 0.5, fgPct: 43.2, fg3Pct: 38.7, ftPct: 92.7, tsPct: 57.0, usgPct: 22.0, per: 15.0, winShares: 4.5, dws: 1.8 }
  },
  {
    id: 'star-lively',
    name: 'Dereck Lively II',
    teamId: 'dal-mavericks',
    position: 'C',
    overall: 82,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 9.5, rpg: 7.8, apg: 1.4, spg: 0.7, bpg: 1.5, fgPct: 74.0, fg3Pct: 0.0, ftPct: 60.0, tsPct: 73.0, usgPct: 11.5, per: 18.5, winShares: 5.8, dws: 3.0 }
  },

  // ==========================================
  // HOUSTON ROCKETS
  // ==========================================
  {
    id: 'star-sengun',
    name: 'Alperen Şengün',
    teamId: 'hou-rockets',
    position: 'C',
    overall: 87,
    archetype: 'POST_SCORER',
    isStarter: true,
    previousStats: { ppg: 14.8, per: 19.0, overall: 81 },
    baseStats: { ppg: 21.1, rpg: 9.3, apg: 5.0, spg: 1.2, bpg: 0.7, fgPct: 53.7, fg3Pct: 29.7, ftPct: 69.3, tsPct: 58.5, usgPct: 27.0, per: 22.5, winShares: 8.0, dws: 3.5 }
  },
  {
    id: 'star-jgreen',
    name: 'Jalen Green',
    teamId: 'hou-rockets',
    position: 'SG',
    overall: 84,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 20.0, rpg: 5.2, apg: 3.5, spg: 0.8, bpg: 0.3, fgPct: 42.5, fg3Pct: 33.5, ftPct: 80.5, tsPct: 54.0, usgPct: 26.5, per: 16.0, winShares: 4.5, dws: 2.2 }
  },
  {
    id: 'star-vanvleet',
    name: 'Fred VanVleet',
    teamId: 'hou-rockets',
    position: 'PG',
    overall: 83,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 16.5, rpg: 3.8, apg: 8.1, spg: 1.4, bpg: 0.8, fgPct: 41.6, fg3Pct: 38.7, ftPct: 86.0, tsPct: 56.5, usgPct: 20.5, per: 18.0, winShares: 7.2, dws: 3.2 }
  },
  {
    id: 'star-amenthompson',
    name: 'Amen Thompson',
    teamId: 'hou-rockets',
    position: 'SF',
    overall: 82,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    previousStats: { ppg: 9.5, per: 15.0, overall: 77 },
    baseStats: { ppg: 13.5, rpg: 7.8, apg: 3.5, spg: 1.4, bpg: 0.9, fgPct: 54.0, fg3Pct: 20.0, ftPct: 68.0, tsPct: 57.0, usgPct: 18.0, per: 17.5, winShares: 5.5, dws: 3.6 }
  },

  // ==========================================
  // MEMPHIS GRIZZLIES
  // ==========================================
  {
    id: 'star-jamorant',
    name: 'Ja Morant',
    teamId: 'mem-grizzlies',
    position: 'PG',
    overall: 91,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 25.1, rpg: 5.6, apg: 8.1, spg: 1.1, bpg: 0.6, fgPct: 47.1, fg3Pct: 31.5, ftPct: 81.0, tsPct: 56.5, usgPct: 32.0, per: 23.5, winShares: 7.0, dws: 2.5 }
  },
  {
    id: 'star-jjj',
    name: 'Jaren Jackson Jr.',
    teamId: 'mem-grizzlies',
    position: 'PF',
    overall: 87,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    baseStats: { ppg: 22.5, rpg: 5.5, apg: 2.3, spg: 1.2, bpg: 1.6, fgPct: 44.4, fg3Pct: 32.0, ftPct: 80.8, tsPct: 55.5, usgPct: 29.0, per: 19.5, winShares: 6.0, dws: 4.2 }
  },
  {
    id: 'star-bane',
    name: 'Desmond Bane',
    teamId: 'mem-grizzlies',
    position: 'SG',
    overall: 85,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 23.7, rpg: 4.4, apg: 5.5, spg: 1.0, bpg: 0.5, fgPct: 46.4, fg3Pct: 38.1, ftPct: 87.0, tsPct: 59.0, usgPct: 27.5, per: 20.0, winShares: 6.5, dws: 2.2 }
  },
  {
    id: 'star-edey',
    name: 'Zach Edey',
    teamId: 'mem-grizzlies',
    position: 'C',
    overall: 79,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    isRookie: true, // ROTY candidate
    baseStats: { ppg: 13.5, rpg: 9.0, apg: 1.0, spg: 0.4, bpg: 1.5, fgPct: 62.0, fg3Pct: 0.0, ftPct: 70.0, tsPct: 63.0, usgPct: 18.0, per: 17.5, winShares: 4.5, dws: 2.4 }
  },

  // ==========================================
  // NEW ORLEANS PELICANS
  // ==========================================
  {
    id: 'star-zion',
    name: 'Zion Williamson',
    teamId: 'nop-pelicans',
    position: 'PF',
    overall: 89,
    archetype: 'SLASHER',
    isStarter: true,
    baseStats: { ppg: 24.0, rpg: 6.5, apg: 5.5, spg: 1.1, bpg: 0.7, fgPct: 57.0, fg3Pct: 33.3, ftPct: 70.2, tsPct: 61.0, usgPct: 29.5, per: 23.0, winShares: 8.5, dws: 3.0 }
  },
  {
    id: 'star-ingram',
    name: 'Brandon Ingram',
    teamId: 'nop-pelicans',
    position: 'SF',
    overall: 86,
    archetype: 'MID_RANGE_MAESTRO',
    isStarter: true,
    baseStats: { ppg: 22.5, rpg: 5.5, apg: 5.7, spg: 0.8, bpg: 0.5, fgPct: 49.2, fg3Pct: 35.5, ftPct: 81.0, tsPct: 58.0, usgPct: 27.0, per: 19.5, winShares: 6.5, dws: 2.5 }
  },
  {
    id: 'star-herbjones',
    name: 'Herbert Jones',
    teamId: 'nop-pelicans',
    position: 'SF',
    overall: 82,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    baseStats: { ppg: 11.0, rpg: 3.6, apg: 2.6, spg: 1.4, bpg: 0.8, fgPct: 49.8, fg3Pct: 41.8, ftPct: 86.7, tsPct: 63.0, usgPct: 14.0, per: 14.5, winShares: 6.2, dws: 3.9 }
  },
  {
    id: 'star-mccollum',
    name: 'CJ McCollum',
    teamId: 'nop-pelicans',
    position: 'SG',
    overall: 84,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 20.0, rpg: 4.3, apg: 4.6, spg: 0.9, bpg: 0.6, fgPct: 45.9, fg3Pct: 42.9, ftPct: 82.7, tsPct: 58.5, usgPct: 24.5, per: 18.0, winShares: 5.5, dws: 2.2 }
  },

  // ==========================================
  // SAN ANTONIO SPURS
  // ==========================================
  {
    id: 'star-wembanyama',
    name: 'Victor Wembanyama',
    teamId: 'sas-spurs',
    position: 'C',
    overall: 93,
    archetype: 'PAINT_PROTECTOR',
    isStarter: true,
    previousStats: { ppg: 21.4, per: 23.1, overall: 87 },
    baseStats: { ppg: 25.0, rpg: 11.5, apg: 4.2, spg: 1.3, bpg: 3.9, fgPct: 48.5, fg3Pct: 34.5, ftPct: 82.0, tsPct: 59.0, usgPct: 31.0, per: 26.5, winShares: 11.5, dws: 6.2 }
  },
  {
    id: 'star-cpaul',
    name: 'Chris Paul',
    teamId: 'sas-spurs',
    position: 'PG',
    overall: 82,
    archetype: 'PLAYMAKER',
    isStarter: true,
    baseStats: { ppg: 10.5, rpg: 3.8, apg: 8.5, spg: 1.3, bpg: 0.2, fgPct: 44.5, fg3Pct: 37.5, ftPct: 88.0, tsPct: 56.5, usgPct: 16.0, per: 16.5, winShares: 5.5, dws: 2.5 }
  },
  {
    id: 'star-vassell',
    name: 'Devin Vassell',
    teamId: 'sas-spurs',
    position: 'SG',
    overall: 83,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 19.5, rpg: 3.8, apg: 4.1, spg: 1.1, bpg: 0.3, fgPct: 47.2, fg3Pct: 37.2, ftPct: 80.1, tsPct: 57.0, usgPct: 24.0, per: 17.0, winShares: 4.5, dws: 1.8 }
  },
  {
    id: 'star-castle',
    name: 'Stephon Castle',
    teamId: 'sas-spurs',
    position: 'PG',
    overall: 78,
    archetype: 'LOCKDOWN_DEFENDER',
    isStarter: true,
    isRookie: true, // ROTY candidate
    baseStats: { ppg: 11.5, rpg: 3.5, apg: 4.0, spg: 1.0, bpg: 0.4, fgPct: 43.5, fg3Pct: 31.0, ftPct: 75.0, tsPct: 52.0, usgPct: 18.0, per: 13.5, winShares: 3.2, dws: 2.2 }
  },

  // ==========================================
  // PORTLAND TRAIL BLAZERS
  // ==========================================
  {
    id: 'star-simons',
    name: 'Anfernee Simons',
    teamId: 'por-trailblazers',
    position: 'SG',
    overall: 84,
    archetype: 'SHARPSHOOTER',
    isStarter: true,
    baseStats: { ppg: 22.6, rpg: 3.6, apg: 5.5, spg: 0.5, bpg: 0.1, fgPct: 43.0, fg3Pct: 38.5, ftPct: 91.6, tsPct: 56.8, usgPct: 27.5, per: 17.5, winShares: 4.8, dws: 1.5 }
  },
  {
    id: 'star-grant',
    name: 'Jerami Grant',
    teamId: 'por-trailblazers',
    position: 'PF',
    overall: 82,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: true,
    baseStats: { ppg: 21.0, rpg: 3.5, apg: 2.8, spg: 0.8, bpg: 0.6, fgPct: 45.2, fg3Pct: 40.2, ftPct: 81.7, tsPct: 57.5, usgPct: 25.5, per: 16.5, winShares: 4.5, dws: 1.8 }
  },
  {
    id: 'star-ayton',
    name: 'Deandre Ayton',
    teamId: 'por-trailblazers',
    position: 'C',
    overall: 83,
    archetype: 'POST_SCORER',
    isStarter: true,
    baseStats: { ppg: 16.7, rpg: 11.1, apg: 1.6, spg: 1.0, bpg: 0.8, fgPct: 57.0, fg3Pct: 10.0, ftPct: 82.3, tsPct: 59.5, usgPct: 21.0, per: 19.0, winShares: 6.2, dws: 2.9 }
  },
  {
    id: 'star-scoot',
    name: 'Scoot Henderson',
    teamId: 'por-trailblazers',
    position: 'PG',
    overall: 79,
    archetype: 'PLAYMAKER',
    isStarter: false, // 6MOY candidate
    baseStats: { ppg: 14.0, rpg: 3.1, apg: 5.4, spg: 0.8, bpg: 0.2, fgPct: 38.5, fg3Pct: 32.5, ftPct: 81.9, tsPct: 48.9, usgPct: 24.5, per: 12.0, winShares: 2.0, dws: 1.5 }
  },
  {
    id: 'star-clingan',
    name: 'Donovan Clingan',
    teamId: 'por-trailblazers',
    position: 'C',
    overall: 77,
    archetype: 'PAINT_PROTECTOR',
    isStarter: false,
    isRookie: true,
    baseStats: { ppg: 9.0, rpg: 7.5, apg: 1.2, spg: 0.5, bpg: 1.8, fgPct: 54.0, fg3Pct: 25.0, ftPct: 65.0, tsPct: 56.0, usgPct: 15.0, per: 15.0, winShares: 3.5, dws: 2.2 }
  },

  // ==========================================
  // CALOUROS DESTAQUE 2024-25 (ROTY CLASS)
  // ==========================================
  {
    id: 'star-sheppard',
    name: 'Reed Sheppard',
    teamId: 'hou-rockets',
    position: 'SG',
    overall: 78,
    archetype: 'SHARPSHOOTER',
    isStarter: false,
    isRookie: true,
    baseStats: { ppg: 11.2, rpg: 2.8, apg: 3.2, spg: 1.2, bpg: 0.4, fgPct: 45.0, fg3Pct: 41.5, ftPct: 86.0, tsPct: 58.0, usgPct: 17.5, per: 14.2, winShares: 3.4, dws: 1.8 }
  },
  {
    id: 'star-knecht',
    name: 'Dalton Knecht',
    teamId: 'lal-lakers',
    position: 'SF',
    overall: 78,
    archetype: 'SHARPSHOOTER',
    isStarter: false,
    isRookie: true,
    baseStats: { ppg: 12.8, rpg: 3.2, apg: 1.8, spg: 0.6, bpg: 0.2, fgPct: 46.5, fg3Pct: 40.0, ftPct: 83.5, tsPct: 59.0, usgPct: 19.0, per: 14.8, winShares: 3.6, dws: 1.6 }
  },
  {
    id: 'star-buzelis',
    name: 'Matas Buzelis',
    teamId: 'chi-bulls',
    position: 'SF',
    overall: 77,
    archetype: 'TWO_WAY_SPECIALIST',
    isStarter: false,
    isRookie: true,
    baseStats: { ppg: 10.5, rpg: 4.5, apg: 2.0, spg: 0.8, bpg: 1.1, fgPct: 44.0, fg3Pct: 33.5, ftPct: 78.0, tsPct: 53.0, usgPct: 17.0, per: 13.5, winShares: 2.8, dws: 2.1 }
  },
  {
    id: 'star-holland',
    name: 'Ron Holland',
    teamId: 'det-pistons',
    position: 'SF',
    overall: 76,
    archetype: 'SLASHER',
    isStarter: false,
    isRookie: true,
    baseStats: { ppg: 9.8, rpg: 4.0, apg: 2.1, spg: 1.1, bpg: 0.5, fgPct: 43.5, fg3Pct: 29.0, ftPct: 74.0, tsPct: 51.5, usgPct: 18.0, per: 12.5, winShares: 2.2, dws: 1.9 }
  },
  {
    id: 'star-carrington',
    name: 'Bub Carrington',
    teamId: 'was-wizards',
    position: 'PG',
    overall: 77,
    archetype: 'PLAYMAKER',
    isStarter: true,
    isRookie: true,
    baseStats: { ppg: 11.0, rpg: 4.2, apg: 4.8, spg: 0.9, bpg: 0.3, fgPct: 42.0, fg3Pct: 35.0, ftPct: 82.0, tsPct: 53.5, usgPct: 18.5, per: 13.8, winShares: 2.9, dws: 1.7 }
  }
];
