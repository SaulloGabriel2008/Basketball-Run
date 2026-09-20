export type LeagueId = 'NBA' | 'G_LEAGUE' | 'NCAA';

export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

export type Archetype = 
  | 'SHARPSHOOTER' 
  | 'LOCKDOWN_DEFENDER' 
  | 'PLAYMAKER' 
  | 'SLASHER' 
  | 'POST_SCORER'
  | 'PAINT_PROTECTOR'
  | 'MID_RANGE_MAESTRO'
  | 'STRETCH_BIG'
  | 'POINT_FORWARD'
  | 'TWO_WAY_SPECIALIST';

export type ShopCategory = 'GEAR_TRAINING' | 'LIFESTYLE_LUXURY' | 'BUSINESS_INVESTMENT';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  price: number;
  iconName: string;
  attributeBonuses?: Partial<PlayerAttributes>;
  energyBonus?: number;
  moralBonus?: number;
  injuryRiskReduction?: number;
  yearlyPassiveIncome?: number;
}

export interface PlayerAttributes {
  // Físicos
  speed: number;
  acceleration: number;
  vertical: number;
  stamina: number;
  strength: number;

  // Técnicos Ofensivos
  inside: number;
  midRange: number;
  threePoint: number;
  freeThrow: number;
  slashing: number;
  passing: number;
  ballControl: number;

  // Cognitivos / Táticos
  offensiveIQ: number;
  defensiveIQ: number;
  clutch: number;

  // Defensivos & Rebotes
  perimeterDefense: number;
  interiorDefense: number;
  steal: number;
  block: number;
  offensiveRebound: number;
  defensiveRebound: number;
}

export type ContractType = 
  | 'COLLEGE_SCHOLARSHIP'
  | 'ROOKIE_SCALE'       // 2+2 anos
  | 'TWO_WAY'            // Max 50 jogos NBA
  | 'DESIGNATED_ROOKIE'  // 5 anos (25-30% teto)
  | 'SUPERMAX'           // 35% teto
  | 'VETERAN_MINIMUM'
  | 'STANDARD_NBA';

export interface Contract {
  type: ContractType;
  yearsTotal: number;
  yearsRemaining: number;
  salaryPerYear: number;
  teamOptionYears?: number[]; // Anos com opção do time (ex: [3, 4] no Rookie Scale)
  isTeamOptionActive?: boolean;
  maxGamesInNBA?: number;     // 50 para Two-Way
  nbaGamesPlayedThisYear?: number;
}

export interface TeamColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface TeamEntity {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  league: LeagueId;
  conference: string;
  division?: string | null;
  parentAffiliateId?: string | null;
  arena: string;
  colors: TeamColors;
  logoUrl: string;
  prestige: number; // 1-100
  ratingOffense?: number;
  ratingDefense?: number;
  ratingPace?: number;
}

export interface PlayerGameStats {
  playerId: string;
  playerName: string;
  teamId: string;
  minutes: number;
  points: number;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  pf: number;
  plusMinus: number;
  gameRating?: number;
}

export interface PeriodScore {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  ot?: number[];
}

export interface GameBoxScore {
  id: string;
  date: string;
  seasonYear: number;
  league: LeagueId;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  homePeriods: PeriodScore;
  awayPeriods: PeriodScore;
  homePace: number;
  awayPace: number;
  totalPossessions: number;
  playerStats: PlayerGameStats[];
  userPlayerGame?: PlayerGameStats;
  isPlayoff?: boolean;
  notes?: string;
}

export interface PlayerSeasonStats {
  id?: number;
  careerId: number;
  seasonYear: number;
  league: LeagueId;
  teamId: string;
  gamesPlayed: number;
  gamesStarted: number;
  minutesPerGame: number;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  stealsPerGame: number;
  blocksPerGame: number;
  turnoversPerGame: number;
  foulsPerGame: number;

  // Totais brutos
  totalMinutes: number;
  totalPoints: number;
  totalFgm: number;
  totalFga: number;
  totalFg3m: number;
  totalFg3a: number;
  totalFtm: number;
  totalFta: number;
  totalOreb: number;
  totalDreb: number;
  totalReb: number;
  totalAst: number;
  totalStl: number;
  totalBlk: number;
  totalTov: number;
  totalPf: number;

  // Eficiências e porcentagens
  fgPct: number;
  fg3Pct: number;
  ftPct: number;

  // Métricas analíticas avançadas
  tsPct: number;     // True Shooting %
  efgPct: number;    // Effective FG %
  usgPct: number;    // Usage Rate %
  per: number;       // Player Efficiency Rating
  ows: number;       // Offensive Win Shares
  dws: number;       // Defensive Win Shares
  winShares: number; // Total Win Shares

  // Conquistas e premiações da temporada
  trophies: string[];
}

export interface PlayerCareerRecord {
  id?: number;
  playerName: string;
  birthYear: number;
  currentYear: number;
  currentTeamId: string;
  isRetired: boolean;
  hallOfFameProbability: number;
  dateSaved: number;
  collegeName?: string;
  draftYear?: number;
  draftRound?: number;
  draftPick?: number;
  draftTeamId?: string;
  championships: number;
  mvps: number;
  finalsMvps: number;
  dpoyAwards: number;
  scoringTitles: number;
  allStarSelections: number;
  allNbaFirstTeam: number;
  allNbaSecondTeam: number;
  allNbaThirdTeam: number;
  peakWinShares: number;
  leaderboardPoints: number;
}

export interface PlayerEntity {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  country: CountryInfo;
  age: number;
  birthYear: number;
  heightInches: number; // Para fórmula do HoF e simulação física
  weightLbs: number;
  wingspanInches: number;
  position: Position;
  archetype: Archetype;
  primaryArchetype: Archetype;
  secondaryArchetype: Archetype;
  attributes: PlayerAttributes;
  potential: number;     // 60-99
  workEthic: number;     // 1-5 (3.0 base)
  overall: number;       // Calculado
  moral: number;         // 0-100
  chemistry: number;     // 0-100
  energy: number;        // 0-100
  injuryRisk: number;    // 0-100
  isInjured: boolean;
  bankBalance: number;   // Saldo bancário em conta
  purchasedItemIds: string[]; // Itens adquiridos na loja de luxo
  injuryDetails?: {
    type: string;
    gamesRemaining: number;
  };

  currentLeague: LeagueId;
  currentTeamId: string;
  collegeTeamId?: string;
  contract: Contract;

  draftInfo?: {
    year: number;
    round: number;
    pick: number;
    originalTeamId: string;
  };

  seasonStats: PlayerSeasonStats;
  careerStats: PlayerSeasonStats[];
  careerRecord: PlayerCareerRecord;
  trophyCase: string[];
  isRetired: boolean;
}

export interface NewsItem {
  id: string;
  date: string;
  headline: string;
  content: string;
  category: 'GAME' | 'TRANSACTION' | 'INJURY' | 'AWARD' | 'MILESTONE' | 'COLLEGE';
  teamId?: string;
}

export interface DecisionChoice {
  id: string;
  text: string;
  impactDescription: string;
  effect: {
    moral?: number;
    chemistry?: number;
    energy?: number;
    workEthic?: number;
    attributes?: Partial<PlayerAttributes>;
  };
}

export interface CareerEvent {
  id: string;
  title: string;
  description: string;
  category: 'MEDIA' | 'LOCKER_ROOM' | 'TRAINING' | 'CONTRACT' | 'FAMILY';
  choices: DecisionChoice[];
}

export interface StandingsEntry {
  teamId: string;
  league: LeagueId;
  conference: string;
  division?: string | null;
  wins: number;
  losses: number;
  winPct: number;
  streak: string;
  last10: string;
  pointsFor: number;
  pointsAgainst: number;
}
