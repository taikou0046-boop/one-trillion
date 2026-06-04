export function getSeniorityBadge(joinTapNumber: number): string {
  if (joinTapNumber <= 100) return "FOUNDER";
  if (joinTapNumber <= 1000) return "PIONEER";
  if (joinTapNumber <= 10000) return "EARLY MEMBER";
  return "CHALLENGER";
}

export function readJoinTapNumber(): number | null {
  if (typeof window === "undefined") return null;
  const saved =
    localStorage.getItem("joinTapNumber") ?? localStorage.getItem("humanRank");
  return saved ? Number(saved) : null;
}

export function buildShareCardMessage(joinTapNumber: number): string {
  return `I joined ONE TRILLION when there were only ${joinTapNumber.toLocaleString()} taps.\n\nCan humanity reach 1,000,000,000,000?`;
}
