import Dexie, { Table } from 'dexie';
import { PlayerCareerRecord, PlayerSeasonStats, PlayerEntity, GameBoxScore } from '../types';

export interface SavedCareerGame {
  id?: number;
  careerId: number;
  gameData: GameBoxScore;
}

export interface FullSaveState {
  id?: number;
  saveName: string;
  updatedAt: number;
  player: PlayerEntity;
  recentGames: GameBoxScore[];
}

export class SimulationDatabase extends Dexie {
  careers!: Table<PlayerCareerRecord, number>;
  seasonHistories!: Table<PlayerSeasonStats, number>;
  games!: Table<SavedCareerGame, number>;
  fullSaves!: Table<FullSaveState, number>;

  constructor() {
    super('BasketballSimDatabase');
    this.version(1).stores({
      careers: '++id, playerName, currentYear, isRetired, dateSaved',
      seasonHistories: '++id, careerId, [careerId+seasonYear], league, teamId',
      games: '++id, careerId, gameData.date',
      fullSaves: '++id, saveName, updatedAt',
    });
  }
}

export const db = new SimulationDatabase();

/**
 * Salva ou atualiza a carreira atual no IndexedDB
 */
export async function savePlayerCareer(player: PlayerEntity, recentGames: GameBoxScore[] = []): Promise<number> {
  const saveRecord: FullSaveState = {
    saveName: `${player.fullName} (${player.currentLeague})`,
    updatedAt: Date.now(),
    player,
    recentGames: recentGames.slice(-20), // Guarda os últimos 20 jogos detalhados
  };

  const existing = await db.fullSaves.orderBy('updatedAt').reverse().first();
  if (existing && existing.player.id === player.id && existing.id) {
    saveRecord.id = existing.id;
    await db.fullSaves.put(saveRecord);
    return existing.id;
  } else {
    return await db.fullSaves.add(saveRecord);
  }
}

/**
 * Carrega a carreira mais recente salva no IndexedDB
 */
export async function loadLatestCareer(): Promise<FullSaveState | undefined> {
  return await db.fullSaves.orderBy('updatedAt').reverse().first();
}

/**
 * Exporta o save atual como string JSON
 */
export function exportSaveToJson(saveState: FullSaveState): string {
  return JSON.stringify(saveState, null, 2);
}

/**
 * Importa o save a partir de string JSON
 */
export function importSaveFromJson(jsonString: string): FullSaveState {
  const parsed = JSON.parse(jsonString);
  if (!parsed.player || !parsed.player.fullName) {
    throw new Error('Arquivo de save inválido');
  }
  return parsed as FullSaveState;
}
