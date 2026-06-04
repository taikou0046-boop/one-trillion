export const DAILY_MISSION_GOALS = [10, 50, 100] as const;
export const DAILY_MISSION_MAX = 100;

const STORAGE_KEY = "dailyMission";

type DailyMissionState = {
  dateKey: string;
  taps: number;
};

function getDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function readState(): DailyMissionState {
  if (typeof window === "undefined") {
    return { dateKey: getDateKey(), taps: 0 };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dateKey: getDateKey(), taps: 0 };
    const parsed = JSON.parse(raw) as DailyMissionState;
    if (parsed.dateKey !== getDateKey()) {
      return { dateKey: getDateKey(), taps: 0 };
    }
    return {
      dateKey: parsed.dateKey,
      taps: Number(parsed.taps) || 0,
    };
  } catch {
    return { dateKey: getDateKey(), taps: 0 };
  }
}

function writeState(state: DailyMissionState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getDailyTaps(): number {
  return readState().taps;
}

export function saveDailyTaps(taps: number): number {
  const state = { dateKey: getDateKey(), taps };
  writeState(state);
  return taps;
}

export function bumpDailyTaps(): number {
  const state = readState();
  const nextTaps = state.taps + 1;
  return saveDailyTaps(nextTaps);
}

export function isMissionComplete(taps: number, goal: number): boolean {
  return taps >= goal;
}

export function getMsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}
