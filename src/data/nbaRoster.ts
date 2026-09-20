import { Position, Archetype } from '../types';

export interface NbaStarPlayer {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  overall: number;
  archetype: Archetype;
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
  {
    id: 'star-jokic',
    name: 'Nikola Jokić',
    teamId: 'den-nuggets',
    position: 'C',
    overall: 98,
    archetype: 'POST_SCORER',
    baseStats: { ppg: 26.4, rpg: 12.4, apg: 9.0, spg: 1.4, bpg: 0.9, fgPct: 58.3, fg3Pct: 35.9, ftPct: 81.7, tsPct: 65.0, usgPct: 29.5, per: 31.0, winShares: 17.0, dws: 4.8 }
  },
  {
    id: 'star-doncic',
    name: 'Luka Dončić',
    teamId: 'dal-mavericks',
    position: 'PG',
    overall: 97,
    archetype: 'PLAYMAKER',
    baseStats: { ppg: 33.9, rpg: 9.2, apg: 9.8, spg: 1.4, bpg: 0.5, fgPct: 48.7, fg3Pct: 38.2, ftPct: 78.6, tsPct: 61.7, usgPct: 36.0, per: 28.5, winShares: 13.5, dws: 3.2 }
  },
  {
    id: 'star-giannis',
    name: 'Giannis Antetokounmpo',
    teamId: 'mil-bucks',
    position: 'PF',
    overall: 97,
    archetype: 'SLASHER',
    baseStats: { ppg: 30.4, rpg: 11.5, apg: 6.5, spg: 1.2, bpg: 1.1, fgPct: 61.1, fg3Pct: 27.4, ftPct: 65.7, tsPct: 64.9, usgPct: 33.0, per: 29.8, winShares: 14.5, dws: 4.5 }
  },
  {
    id: 'star-shai',
    name: 'Shai Gilgeous-Alexander',
    teamId: 'okc-thunder',
    position: 'PG',
    overall: 96,
    archetype: 'TWO_WAY_SPECIALIST',
    baseStats: { ppg: 30.1, rpg: 5.5, apg: 6.2, spg: 2.0, bpg: 0.9, fgPct: 53.5, fg3Pct: 35.3, ftPct: 87.4, tsPct: 63.6, usgPct: 32.5, per: 28.0, winShares: 15.0, dws: 4.2 }
  },
  {
    id: 'star-tatum',
    name: 'Jayson Tatum',
    teamId: 'bos-celtics',
    position: 'SF',
    overall: 95,
    archetype: 'TWO_WAY_SPECIALIST',
    baseStats: { ppg: 26.9, rpg: 8.1, apg: 4.9, spg: 1.0, bpg: 0.6, fgPct: 47.1, fg3Pct: 37.6, ftPct: 83.3, tsPct: 60.7, usgPct: 30.0, per: 23.5, winShares: 12.0, dws: 4.0 }
  },
  {
    id: 'star-wembanyama',
    name: 'Victor Wembanyama',
    teamId: 'sas-spurs',
    position: 'C',
    overall: 93,
    archetype: 'PAINT_PROTECTOR',
    baseStats: { ppg: 24.5, rpg: 11.2, apg: 4.1, spg: 1.3, bpg: 3.8, fgPct: 47.5, fg3Pct: 33.5, ftPct: 81.0, tsPct: 57.5, usgPct: 30.0, per: 24.5, winShares: 9.5, dws: 5.8 }
  },
  {
    id: 'star-edwards',
    name: 'Anthony Edwards',
    teamId: 'min-timberwolves',
    position: 'SG',
    overall: 94,
    archetype: 'SLASHER',
    baseStats: { ppg: 27.2, rpg: 5.5, apg: 5.1, spg: 1.4, bpg: 0.6, fgPct: 46.8, fg3Pct: 36.5, ftPct: 84.0, tsPct: 58.5, usgPct: 32.0, per: 22.5, winShares: 10.5, dws: 3.8 }
  },
  {
    id: 'star-embiid',
    name: 'Joel Embiid',
    teamId: 'phi-76ers',
    position: 'C',
    overall: 96,
    archetype: 'POST_SCORER',
    baseStats: { ppg: 32.5, rpg: 11.0, apg: 5.0, spg: 1.1, bpg: 1.7, fgPct: 52.0, fg3Pct: 38.0, ftPct: 88.0, tsPct: 64.0, usgPct: 37.0, per: 31.5, winShares: 12.5, dws: 4.2 }
  },
  {
    id: 'star-curry',
    name: 'Stephen Curry',
    teamId: 'gsw-warriors',
    position: 'PG',
    overall: 94,
    archetype: 'SHARPSHOOTER',
    baseStats: { ppg: 26.4, rpg: 4.5, apg: 5.1, spg: 0.7, bpg: 0.4, fgPct: 45.0, fg3Pct: 40.8, ftPct: 92.3, tsPct: 62.6, usgPct: 30.5, per: 22.0, winShares: 8.5, dws: 2.1 }
  },
  {
    id: 'star-lebron',
    name: 'LeBron James',
    teamId: 'lal-lakers',
    position: 'PF',
    overall: 94,
    archetype: 'POINT_FORWARD',
    baseStats: { ppg: 25.7, rpg: 7.3, apg: 8.3, spg: 1.3, bpg: 0.5, fgPct: 54.0, fg3Pct: 41.0, ftPct: 75.0, tsPct: 63.0, usgPct: 29.5, per: 24.0, winShares: 10.0, dws: 3.0 }
  },
  {
    id: 'star-durant',
    name: 'Kevin Durant',
    teamId: 'phx-suns',
    position: 'SF',
    overall: 94,
    archetype: 'MID_RANGE_MAESTRO',
    baseStats: { ppg: 27.1, rpg: 6.6, apg: 5.0, spg: 0.9, bpg: 1.2, fgPct: 52.3, fg3Pct: 41.3, ftPct: 85.6, tsPct: 62.6, usgPct: 29.0, per: 23.0, winShares: 9.8, dws: 3.1 }
  },
  {
    id: 'star-davis',
    name: 'Anthony Davis',
    teamId: 'lal-lakers',
    position: 'C',
    overall: 94,
    archetype: 'PAINT_PROTECTOR',
    baseStats: { ppg: 24.7, rpg: 12.6, apg: 3.5, spg: 1.2, bpg: 2.3, fgPct: 55.6, fg3Pct: 27.1, ftPct: 81.6, tsPct: 61.2, usgPct: 27.0, per: 26.8, winShares: 12.0, dws: 5.5 }
  },
  {
    id: 'star-brunson',
    name: 'Jalen Brunson',
    teamId: 'nyk-knicks',
    position: 'PG',
    overall: 93,
    archetype: 'MID_RANGE_MAESTRO',
    baseStats: { ppg: 28.7, rpg: 3.6, apg: 6.7, spg: 0.9, bpg: 0.2, fgPct: 47.9, fg3Pct: 40.1, ftPct: 84.7, tsPct: 59.2, usgPct: 32.0, per: 23.4, winShares: 11.2, dws: 2.5 }
  },
  {
    id: 'star-mitchell',
    name: 'Donovan Mitchell',
    teamId: 'cle-cavaliers',
    position: 'SG',
    overall: 92,
    archetype: 'SLASHER',
    baseStats: { ppg: 26.6, rpg: 5.1, apg: 6.1, spg: 1.8, bpg: 0.5, fgPct: 46.2, fg3Pct: 36.8, ftPct: 86.5, tsPct: 59.5, usgPct: 31.0, per: 22.0, winShares: 9.5, dws: 3.4 }
  },
  {
    id: 'star-booker',
    name: 'Devin Booker',
    teamId: 'phx-suns',
    position: 'SG',
    overall: 92,
    archetype: 'MID_RANGE_MAESTRO',
    baseStats: { ppg: 27.1, rpg: 4.5, apg: 6.9, spg: 0.9, bpg: 0.4, fgPct: 49.2, fg3Pct: 36.4, ftPct: 88.6, tsPct: 61.1, usgPct: 30.0, per: 22.1, winShares: 9.1, dws: 2.2 }
  },
  {
    id: 'star-gobert',
    name: 'Rudy Gobert',
    teamId: 'min-timberwolves',
    position: 'C',
    overall: 89,
    archetype: 'PAINT_PROTECTOR',
    baseStats: { ppg: 14.0, rpg: 12.9, apg: 1.3, spg: 0.7, bpg: 2.1, fgPct: 66.1, fg3Pct: 0.0, ftPct: 63.8, tsPct: 67.0, usgPct: 15.0, per: 20.0, winShares: 11.5, dws: 5.9 }
  },
  {
    id: 'star-monk',
    name: 'Malik Monk',
    teamId: 'sac-kings',
    position: 'SG',
    overall: 83,
    archetype: 'SLASHER',
    baseStats: { ppg: 16.5, rpg: 3.0, apg: 5.2, spg: 0.8, bpg: 0.4, fgPct: 44.5, fg3Pct: 36.0, ftPct: 82.0, tsPct: 56.5, usgPct: 25.0, per: 17.5, winShares: 4.5, dws: 1.5 }
  },
  {
    id: 'star-reid',
    name: 'Naz Reid',
    teamId: 'min-timberwolves',
    position: 'C',
    overall: 83,
    archetype: 'STRETCH_BIG',
    baseStats: { ppg: 15.2, rpg: 5.8, apg: 1.8, spg: 0.8, bpg: 0.9, fgPct: 47.7, fg3Pct: 41.4, ftPct: 73.6, tsPct: 59.0, usgPct: 23.0, per: 18.0, winShares: 5.2, dws: 2.4 }
  },
  {
    id: 'star-white',
    name: 'Coby White',
    teamId: 'chi-bulls',
    position: 'PG',
    overall: 84,
    archetype: 'PLAYMAKER',
    baseStats: { ppg: 19.1, rpg: 4.5, apg: 5.1, spg: 0.7, bpg: 0.2, fgPct: 44.7, fg3Pct: 37.6, ftPct: 83.8, tsPct: 57.0, usgPct: 23.5, per: 16.5, winShares: 5.8, dws: 1.8 }
  },
  {
    id: 'star-maxey',
    name: 'Tyrese Maxey',
    teamId: 'phi-76ers',
    position: 'PG',
    overall: 90,
    archetype: 'SLASHER',
    baseStats: { ppg: 25.9, rpg: 3.7, apg: 6.2, spg: 1.0, bpg: 0.5, fgPct: 45.0, fg3Pct: 37.3, ftPct: 86.8, tsPct: 57.3, usgPct: 28.0, per: 20.0, winShares: 8.5, dws: 2.2 }
  },
  {
    id: 'star-chet',
    name: 'Chet Holmgren',
    teamId: 'okc-thunder',
    position: 'C',
    overall: 88,
    archetype: 'STRETCH_BIG',
    baseStats: { ppg: 16.5, rpg: 7.9, apg: 2.4, spg: 0.6, bpg: 2.3, fgPct: 53.0, fg3Pct: 37.0, ftPct: 79.3, tsPct: 63.2, usgPct: 21.0, per: 20.0, winShares: 8.0, dws: 4.3 }
  }
];
