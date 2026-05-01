"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import type { ArenaRun, GameState, Item, Mon } from "./types";
import { generateItem, generateMon, seedInitialInventory } from "./generators";
import { rollEvolutionBonus, resolveArenaRun } from "./battle";
import { dayIndex } from "./time";

const initialState: GameState = {
  walletKey: null,
  hydrated: false,
  mons: [],
  items: [],
  energy: 0,
  keys: 0,
  coupons: 0,
  arenaRuns: [],
  dailyLockedMonId: null,
  dailyLockedDay: null,
  prizeBalance: 0,
};

type Action =
  | { type: "DISCONNECT" }
  | { type: "HYDRATE"; payload: Partial<GameState> & { walletKey: string } }
  | { type: "MINT_MON"; payload: { mon: Mon; energyDrop: number; keyDrop: number } }
  | { type: "EVOLVE_MON"; payload: { monId: string; energy: number; bonusAtk: number; bonusDef: number } }
  | { type: "EQUIP"; payload: { monId: string; itemId: string } }
  | { type: "UNEQUIP"; payload: { monId: string } }
  | { type: "ADD_ITEM"; payload: { item: Item } }
  | { type: "SPEND_KEY" }
  | { type: "GAIN_ENERGY"; payload: number }
  | { type: "GAIN_KEYS"; payload: number }
  | { type: "LOCK_IN"; payload: { monId: string; day: number } }
  | { type: "ARENA_RESOLVE"; payload: { run: ArenaRun } }
  | { type: "RENAME_MON"; payload: { monId: string; name: string } };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "DISCONNECT":
      return { ...initialState };
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };
    case "MINT_MON":
      return {
        ...state,
        mons: [...state.mons, action.payload.mon],
        energy: state.energy + action.payload.energyDrop,
        keys: state.keys + action.payload.keyDrop,
      };
    case "EVOLVE_MON": {
      const mons = state.mons.map((m) =>
        m.id === action.payload.monId
          ? {
              ...m,
              evolved: true,
              evoBonusAtk: action.payload.bonusAtk,
              evoBonusDef: action.payload.bonusDef,
              energySpentOnEvo: action.payload.energy,
            }
          : m,
      );
      return {
        ...state,
        mons,
        energy: Math.max(0, state.energy - action.payload.energy),
      };
    }
    case "EQUIP": {
      // single equip slot per mon — also unequip the item from any other mon
      const mons = state.mons.map((m) => {
        if (m.id === action.payload.monId) return { ...m, equippedItemId: action.payload.itemId };
        if (m.equippedItemId === action.payload.itemId) return { ...m, equippedItemId: null };
        return m;
      });
      return { ...state, mons };
    }
    case "UNEQUIP": {
      const mons = state.mons.map((m) =>
        m.id === action.payload.monId ? { ...m, equippedItemId: null } : m,
      );
      return { ...state, mons };
    }
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload.item] };
    case "SPEND_KEY":
      return { ...state, keys: Math.max(0, state.keys - 1) };
    case "GAIN_ENERGY":
      return { ...state, energy: state.energy + action.payload };
    case "GAIN_KEYS":
      return { ...state, keys: state.keys + action.payload };
    case "LOCK_IN":
      return {
        ...state,
        dailyLockedMonId: action.payload.monId,
        dailyLockedDay: action.payload.day,
      };
    case "ARENA_RESOLVE":
      return {
        ...state,
        arenaRuns: [action.payload.run, ...state.arenaRuns].slice(0, 50),
        prizeBalance: state.prizeBalance + action.payload.run.result.prizeSol,
      };
    case "RENAME_MON": {
      const mons = state.mons.map((m) =>
        m.id === action.payload.monId ? { ...m, name: action.payload.name.slice(0, 24) } : m,
      );
      return { ...state, mons };
    }
    default:
      return state;
  }
}

type Store = {
  state: GameState;
  mintMon: () => Mon;
  evolveMon: (monId: string, energy: number) => void;
  equip: (monId: string, itemId: string) => void;
  unequip: (monId: string) => void;
  rollGacha: () => Item | null;
  lockIn: (monId: string) => void;
  resolveLockedArena: () => ArenaRun | null;
  renameMon: (monId: string, name: string) => void;
  itemById: (id: string) => Item | undefined;
  monById: (id: string) => Mon | undefined;
  todayDay: number;
};

const StoreCtx = createContext<Store | null>(null);

const STORAGE_PREFIX = "pixmon:state:";
const PERSIST_KEYS: Array<keyof GameState> = [
  "mons",
  "items",
  "energy",
  "keys",
  "coupons",
  "arenaRuns",
  "dailyLockedMonId",
  "dailyLockedDay",
  "prizeBalance",
];

function persist(walletKey: string, state: GameState) {
  if (typeof window === "undefined") return;
  const slim: Partial<GameState> = {};
  for (const k of PERSIST_KEYS) {
    (slim as Record<string, unknown>)[k] = state[k];
  }
  try {
    window.localStorage.setItem(STORAGE_PREFIX + walletKey, JSON.stringify(slim));
  } catch {
    /* quota / private mode */
  }
}

type Persisted = Omit<GameState, "walletKey" | "hydrated">;

function loadOrSeed(walletKey: string): Partial<Persisted> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + walletKey);
    if (raw) return JSON.parse(raw) as Partial<Persisted>;
  } catch {
    /* corrupted */
  }
  const seed = seedInitialInventory(walletKey);
  return {
    mons: seed.mons,
    items: seed.items,
    energy: seed.energy,
    keys: seed.keys,
    coupons: seed.coupons,
    arenaRuns: [],
    dailyLockedMonId: null,
    dailyLockedDay: null,
    prizeBalance: 0,
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected } = useWallet();
  const [state, dispatch] = useReducer(reducer, initialState);
  const lastWalletRef = useRef<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      const key = publicKey.toBase58();
      if (lastWalletRef.current === key) return;
      lastWalletRef.current = key;
      const loaded = loadOrSeed(key);
      dispatch({ type: "HYDRATE", payload: { walletKey: key, ...loaded } });
    } else if (!connected && lastWalletRef.current) {
      lastWalletRef.current = null;
      dispatch({ type: "DISCONNECT" });
    }
  }, [connected, publicKey]);

  useEffect(() => {
    if (state.hydrated && state.walletKey) {
      persist(state.walletKey, state);
    }
  }, [state]);

  const mintMon = useCallback(() => {
    const seed = `${state.walletKey ?? "anon"}-${Date.now()}-${Math.random()}`;
    const mon = generateMon(seed);
    dispatch({ type: "MINT_MON", payload: { mon, energyDrop: 4, keyDrop: 1 } });
    return mon;
  }, [state.walletKey]);

  const evolveMon = useCallback((monId: string, energy: number) => {
    const clamped = Math.max(1, Math.min(10, energy));
    const bonus = rollEvolutionBonus(monId, clamped);
    dispatch({
      type: "EVOLVE_MON",
      payload: { monId, energy: clamped, bonusAtk: bonus.atk, bonusDef: bonus.def },
    });
  }, []);

  const equip = useCallback((monId: string, itemId: string) => {
    dispatch({ type: "EQUIP", payload: { monId, itemId } });
  }, []);

  const unequip = useCallback((monId: string) => {
    dispatch({ type: "UNEQUIP", payload: { monId } });
  }, []);

  const rollGacha = useCallback((): Item | null => {
    if (state.keys <= 0) return null;
    const seed = `${state.walletKey ?? "anon"}-gacha-${Date.now()}-${Math.random()}`;
    const item = generateItem(seed);
    dispatch({ type: "SPEND_KEY" });
    dispatch({ type: "ADD_ITEM", payload: { item } });
    return item;
  }, [state.keys, state.walletKey]);

  const lockIn = useCallback(
    (monId: string) => {
      dispatch({ type: "LOCK_IN", payload: { monId, day: dayIndex() } });
    },
    [],
  );

  const resolveLockedArena = useCallback((): ArenaRun | null => {
    if (!state.dailyLockedMonId) return null;
    const mon = state.mons.find((m) => m.id === state.dailyLockedMonId);
    if (!mon) return null;
    const item = mon.equippedItemId
      ? state.items.find((i) => i.id === mon.equippedItemId) ?? null
      : null;
    const day = state.dailyLockedDay ?? dayIndex();
    const result = resolveArenaRun({ mon, item, day });
    const run: ArenaRun = { day, monId: mon.id, result, resolvedAt: Date.now() };
    dispatch({ type: "ARENA_RESOLVE", payload: { run } });
    return run;
  }, [state.dailyLockedMonId, state.dailyLockedDay, state.mons, state.items]);

  const renameMon = useCallback((monId: string, name: string) => {
    dispatch({ type: "RENAME_MON", payload: { monId, name } });
  }, []);

  const itemById = useCallback(
    (id: string) => state.items.find((i) => i.id === id),
    [state.items],
  );
  const monById = useCallback(
    (id: string) => state.mons.find((m) => m.id === id),
    [state.mons],
  );

  const value = useMemo<Store>(
    () => ({
      state,
      mintMon,
      evolveMon,
      equip,
      unequip,
      rollGacha,
      lockIn,
      resolveLockedArena,
      renameMon,
      itemById,
      monById,
      todayDay: dayIndex(),
    }),
    [state, mintMon, evolveMon, equip, unequip, rollGacha, lockIn, resolveLockedArena, renameMon, itemById, monById],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useGame() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
