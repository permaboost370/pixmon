import type {
  ArenaResult,
  BattleRound,
  EffectiveStats,
  Item,
  Mon,
} from "./types";
import { seededRng, type Rng } from "./rng";
import { generateOpponent } from "./generators";

export function effectiveStats(mon: Mon, item: Item | null): EffectiveStats {
  const baseAtk = mon.baseAtk + mon.evoBonusAtk;
  const baseDef = mon.baseDef + mon.evoBonusDef;
  const atk = baseAtk + (item?.atkFlat ?? 0) + Math.round(baseAtk * ((item?.atkPct ?? 0) / 100));
  const def = baseDef + (item?.defFlat ?? 0) + Math.round(baseDef * ((item?.defPct ?? 0) / 100));
  const hp = 60 + def * 2 + (item?.defFlat ?? 0);
  return { atk, def, hp };
}

function damage(attackerAtk: number, defenderDef: number, rng: Rng) {
  const variance = 0.85 + rng() * 0.3;
  const raw = attackerAtk - defenderDef * 0.5;
  return Math.max(1, Math.round(raw * variance));
}

function roundResult(
  yours: EffectiveStats,
  opp: { atk: number; def: number; hp: number },
  rng: Rng,
) {
  let yourHp = yours.hp;
  let oppHp = opp.hp;
  let safety = 30;
  while (yourHp > 0 && oppHp > 0 && safety-- > 0) {
    const youHit = damage(yours.atk, opp.def, rng);
    const oppHit = damage(opp.atk, yours.def, rng);
    oppHp -= youHit;
    if (oppHp <= 0) {
      return { won: true, yourDamage: youHit, opponentDamage: 0, yourHp, opponentHp: 0 };
    }
    yourHp -= oppHit;
    if (yourHp <= 0) {
      return { won: false, yourDamage: youHit, opponentDamage: oppHit, yourHp: 0, opponentHp: oppHp };
    }
  }
  return { won: yourHp >= oppHp, yourDamage: 0, opponentDamage: 0, yourHp, opponentHp: oppHp };
}

const ROUND_PRIZE_SOL: Record<number, number> = {
  1: 0,
  2: 0.01,
  3: 0.04,
  4: 0.12,
  5: 0.45, // jackpot
};

export function resolveArenaRun(args: {
  mon: Mon;
  item: Item | null;
  day: number;
  bracketSize?: number;
}): ArenaResult {
  const { mon, item, day, bracketSize = 5 } = args;
  const yours = effectiveStats(mon, item);
  const seed = `${mon.id}|${day}`;
  const rng = seededRng(seed);

  const rounds: BattleRound[] = [];

  for (let round = 1; round <= bracketSize; round++) {
    const opp = generateOpponent(`${seed}|r${round}`);
    const r = roundResult(yours, opp, rng);
    rounds.push({
      round,
      opponentName: opp.name,
      opponentSpecies: opp.species,
      opponentRarity: opp.rarity,
      yourHp: Math.max(0, r.yourHp),
      opponentHp: Math.max(0, r.opponentHp),
      yourDamage: r.yourDamage,
      opponentDamage: r.opponentDamage,
      outcome: r.won ? "win" : "lose",
    });
    if (!r.won) {
      return {
        finalRound: round,
        won: false,
        prizeSol: ROUND_PRIZE_SOL[round] ?? 0,
        rounds,
      };
    }
  }

  return {
    finalRound: bracketSize,
    won: true,
    prizeSol: ROUND_PRIZE_SOL[bracketSize] ?? 0,
    rounds,
  };
}

export function rollEvolutionBonus(monId: string, energy: number) {
  const rng = seededRng(`evo-${monId}-${energy}`);
  const ceiling = energy;
  const atk = Math.round(rng() * ceiling * 1.6);
  const def = Math.round(rng() * ceiling * 1.4);
  return { atk, def };
}
