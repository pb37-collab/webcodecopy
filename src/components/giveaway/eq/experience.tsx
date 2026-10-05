"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { eqGiveaway, type Colorway, type ColorwayId } from "@/data/giveaways/davinci-eq-jacuzzi";

type EntryState = { refCode: string; email: string; demo: boolean } | null;

type ExperienceValue = {
  colorway: Colorway;
  setColorway: (id: ColorwayId) => void;
  entry: EntryState;
  setEntry: (entry: EntryState) => void;
};

const ExperienceContext = createContext<ExperienceValue | null>(null);

const STORAGE_KEY = `giveaway:${eqGiveaway.slug}`;
const END = Date.parse(eqGiveaway.endsAt);

function subscribeClock(cb: () => void) {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
}
const readClock = () => Math.floor(Date.now() / 1000) * 1000;
const readServerClock = () => null;

/**
 * Page-wide state for the giveaway: the colorway the visitor picked (which
 * re-tints the whole page) and their entry.
 */
export function EqExperience({ children }: { children: React.ReactNode }) {
  const [colorwayId, setColorwayId] = useState<ColorwayId>(eqGiveaway.colorways[0].id);
  const [entry, setEntryState] = useState<EntryState>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { colorway?: ColorwayId; entry?: EntryState };
        // Restoring a returning visitor's saved state after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.entry) setEntryState(parsed.entry);
        if (parsed.colorway && eqGiveaway.colorways.some((c) => c.id === parsed.colorway)) {
          setColorwayId(parsed.colorway);
        }
      }
      const fromUrl = new URLSearchParams(window.location.search).get("color");
      const match = eqGiveaway.colorways.find((c) => c.id === fromUrl);
      if (match) setColorwayId(match.id);
    } catch {
      // Storage blocked (private mode): the page still works, it just forgets.
    }
  }, []);

  const value = useMemo<ExperienceValue>(() => {
    const colorway = eqGiveaway.colorways.find((c) => c.id === colorwayId) ?? eqGiveaway.colorways[0];
    const persist = (next: { colorway: ColorwayId; entry: EntryState }) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
    };
    return {
      colorway,
      setColorway: (id) => {
        setColorwayId(id);
        persist({ colorway: id, entry });
      },
      entry,
      setEntry: (next) => {
        setEntryState(next);
        persist({ colorway: colorwayId, entry: next });
      },
    };
  }, [colorwayId, entry]);

  return (
    <ExperienceContext.Provider value={value}>
      <div
        data-colorway={value.colorway.id}
        className="eq-root relative min-h-screen overflow-x-clip bg-[#07070a] text-ink"
        style={{ "--eq": value.colorway.accent, "--eq-deep": value.colorway.deep } as React.CSSProperties}
      >
        {children}
      </div>
    </ExperienceContext.Provider>
  );
}

export function useEq(): ExperienceValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useEq must be used inside <EqExperience>");
  return ctx;
}

/** Shared 1 Hz clock. null until mounted, so server HTML and hydration agree. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribeClock, readClock, readServerClock);
}

/** True once the giveaway has closed (false during SSR). */
export function useEnded(): boolean {
  const now = useNow();
  return now !== null && now >= END;
}

export const giveawayEnd = END;
