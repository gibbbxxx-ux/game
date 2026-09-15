export type EnemyType = 'minion' | 'elite' | 'boss';

export interface WordItem {
  word: string;
  meaning: string;
  category: 'hardware' | 'networking' | 'security' | 'programming' | 'system' | 'general';
  difficulty: EnemyType;
}

export interface Enemy {
  id: string;
  word: string;
  meaning: string;
  category: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number; // percentage moved per second
  x: number; // percentage from left (spawn at 94%, travels left to 12%)
  lane: number; // 0, 1, 2, 3
  typedIndex: number; // how many characters match currently
  isTargeted: boolean;
  damage: number;
  scoreValue: number;
  color: string;
}

export interface GameStats {
  score: number;
  floor: number;
  wpm: number;
  accuracy: number;
  totalCharsTyped: number;
  correctCharsTyped: number;
  combo: number;
  maxCombo: number;
  enemiesDefeated: number;
  minionsDefeated: number;
  elitesDefeated: number;
  bossesDefeated: number;
}

export interface DefeatedWordLog {
  id: string;
  word: string;
  meaning: string;
  category: string;
  type: EnemyType;
  timestamp: number;
}

export interface Skill {
  id: 'freeze' | 'emp' | 'heal';
  name: string;
  hotkey: string;
  energyCost: number;
  cooldownSeconds: number;
  currentCooldown: number;
  description: string;
}

export type GameStatus = 'menu' | 'playing' | 'paused' | 'floor_clear' | 'game_over' | 'victory';
