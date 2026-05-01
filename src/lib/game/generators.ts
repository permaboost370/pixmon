import type { Item, Mon, Rarity, GearSlot } from "./types";
import { RARITY_FACTOR } from "./types";
import { pick, rollInt, seededRng, weightedPick, type Rng } from "./rng";

const MON_NAMES = [
  "Glommer", "Sprigly", "Volti", "Mogworm", "Pixet", "Crysto", "Hexbun", "Drifo",
  "Lumix", "Boxlet", "Vyrr", "Embo", "Klink", "Snip", "Borb", "Fizzle",
  "Mossic", "Tikko", "Zibb", "Flux", "Quark", "Munchy", "Pebble", "Glow",
] as const;

const ITEM_PREFIX: Record<GearSlot, readonly string[]> = {
  sword:  ["Ember", "Tide", "Quark", "Bolt", "Hex", "Verdant", "Astral", "Shard"],
  shield: ["Bulwark", "Pixel", "Aegis", "Mossy", "Iron", "Glass", "Coral", "Echo"],
  boot:   ["Sprint", "Drift", "Quick", "Featherlight", "Lunar", "Glide", "Scout", "Bound"],
  spark:  ["Glow", "Flicker", "Pulse", "Ember", "Beacon", "Charge", "Spark", "Hum"],
};

const ITEM_SUFFIX: Record<GearSlot, string> = {
  sword: "Blade",
  shield: "Guard",
  boot: "Sprinters",
  spark: "Charm",
};

const SLOT_BIAS: GearSlot[] = ["sword", "shield", "boot", "spark"];

function rollRarity(rng: Rng): Rarity {
  return weightedPick(rng, [
    ["common", 60],
    ["rare", 28],
    ["epic", 10],
    ["legendary", 2],
  ]);
}

function rollMonStats(rng: Rng, rarity: Rarity) {
  const f = RARITY_FACTOR[rarity];
  return {
    baseAtk: Math.round(rollInt(rng, 8, 18) * f),
    baseDef: Math.round(rollInt(rng, 6, 14) * f),
  };
}

let monCounter = 1;
let itemCounter = 1;

export function generateMon(seed: string, opts?: { number?: number }): Mon {
  const rng = seededRng(seed);
  const rarity = rollRarity(rng);
  const stats = rollMonStats(rng, rarity);
  const id = `mon-${seed}-${monCounter++}`;
  return {
    id,
    number: opts?.number ?? rollInt(rng, 1, 9999),
    species: Math.floor(rng() * 4),
    name: pick(rng, MON_NAMES),
    rarity,
    baseAtk: stats.baseAtk,
    baseDef: stats.baseDef,
    evolved: false,
    evoBonusAtk: 0,
    evoBonusDef: 0,
    energySpentOnEvo: 0,
    equippedItemId: null,
    hatchedAt: Date.now(),
  };
}

export function generateItem(seed: string): Item {
  const rng = seededRng(seed);
  const slot = pick(rng, SLOT_BIAS);
  const rarity = rollRarity(rng);
  const f = RARITY_FACTOR[rarity];
  const id = `item-${seed}-${itemCounter++}`;
  const baseAtk = slot === "sword" ? rollInt(rng, 3, 7) : rollInt(rng, 0, 2);
  const baseDef = slot === "shield" ? rollInt(rng, 3, 7) : rollInt(rng, 0, 2);
  return {
    id,
    slot,
    name: `${pick(rng, ITEM_PREFIX[slot])} ${ITEM_SUFFIX[slot]}`,
    rarity,
    atkFlat: Math.round(baseAtk * f),
    atkPct: slot === "sword" ? Math.round(rollInt(rng, 5, 15) * f) : 0,
    defFlat: Math.round(baseDef * f),
    defPct: slot === "shield" ? Math.round(rollInt(rng, 5, 15) * f) : 0,
    obtainedAt: Date.now(),
  };
}

export function seedInitialInventory(walletKey: string) {
  const rng = seededRng(walletKey);
  const mons: Mon[] = [];
  const monCount = rollInt(rng, 2, 4);
  for (let i = 0; i < monCount; i++) {
    mons.push(generateMon(`${walletKey}-init-${i}`));
  }
  const items: Item[] = [];
  const itemCount = rollInt(rng, 1, 3);
  for (let i = 0; i < itemCount; i++) {
    items.push(generateItem(`${walletKey}-item-${i}`));
  }
  return {
    mons,
    items,
    energy: 4 * monCount + rollInt(rng, 0, 4),
    keys: monCount + rollInt(rng, 0, 2),
    coupons: rng() < 0.2 ? 1 : 0,
  };
}

export function generateOpponent(seed: string) {
  const rng = seededRng(`opp-${seed}`);
  const rarity = rollRarity(rng);
  const stats = rollMonStats(rng, rarity);
  return {
    id: `opp-${seed}`,
    name: pick(rng, MON_NAMES),
    species: Math.floor(rng() * 4),
    rarity,
    atk: stats.baseAtk + (rng() < 0.5 ? rollInt(rng, 0, 6) : 0),
    def: stats.baseDef + (rng() < 0.5 ? rollInt(rng, 0, 4) : 0),
    hp: 50 + stats.baseDef * 2 + rollInt(rng, 0, 20),
  };
}
