export type Rarity = "common" | "rare" | "epic" | "legendary";

export type GearSlot = "sword" | "shield" | "boot" | "spark";

export type Mon = {
  id: string;
  number: number;
  species: number;
  name: string;
  rarity: Rarity;
  baseAtk: number;
  baseDef: number;
  evolved: boolean;
  evoBonusAtk: number;
  evoBonusDef: number;
  energySpentOnEvo: number;
  equippedItemId: string | null;
  hatchedAt: number;
};

export type Item = {
  id: string;
  slot: GearSlot;
  name: string;
  rarity: Rarity;
  atkFlat: number;
  atkPct: number;
  defFlat: number;
  defPct: number;
  obtainedAt: number;
};

export type ArenaResult = {
  finalRound: number;
  won: boolean;
  prizeSol: number;
  rounds: BattleRound[];
};

export type ArenaRun = {
  day: number;
  monId: string;
  result: ArenaResult;
  resolvedAt: number;
};

export type BattleRound = {
  round: number;
  opponentName: string;
  opponentSpecies: number;
  opponentRarity: Rarity;
  yourHp: number;
  opponentHp: number;
  yourDamage: number;
  opponentDamage: number;
  outcome: "win" | "lose";
};

export type EffectiveStats = {
  atk: number;
  def: number;
  hp: number;
};

export type GameState = {
  walletKey: string | null;
  hydrated: boolean;
  mons: Mon[];
  items: Item[];
  energy: number;
  keys: number;
  coupons: number;
  arenaRuns: ArenaRun[];
  dailyLockedMonId: string | null;
  dailyLockedDay: number | null;
  prizeBalance: number;
};

export const RARITY_ORDER: Rarity[] = ["common", "rare", "epic", "legendary"];

export const RARITY_FACTOR: Record<Rarity, number> = {
  common: 1,
  rare: 1.2,
  epic: 1.5,
  legendary: 2,
};
