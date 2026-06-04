const PENDING_INVITE_KEY = "pendingInvite";
const INVITE_CREDITED_KEY = "inviteCredited";

function countKey(joinNumber: number): string {
  return `invitedCount_${joinNumber}`;
}

export function parseAndStoreInviteFromUrl(): number | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const invite = params.get("invite");

  if (invite) {
    const n = Number(invite);
    if (Number.isFinite(n) && n >= 1) {
      localStorage.setItem(PENDING_INVITE_KEY, String(Math.floor(n)));
    }
  }

  return readPendingInvite();
}

export function readPendingInvite(): number | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(PENDING_INVITE_KEY);
  if (!saved) return null;
  const n = Number(saved);
  return Number.isFinite(n) && n >= 1 ? n : null;
}

export function hasInviteBeenCredited(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(INVITE_CREDITED_KEY) === "1";
}

export function creditInviteOnTap(): void {
  if (typeof window === "undefined" || hasInviteBeenCredited()) return;

  const inviter = readPendingInvite();
  if (!inviter) return;

  const key = countKey(inviter);
  const current = Number(localStorage.getItem(key) || 0);
  localStorage.setItem(key, String(current + 1));
  localStorage.setItem(INVITE_CREDITED_KEY, "1");
}

export function getInvitedFriendsCount(joinNumber: number | null): number {
  if (typeof window === "undefined" || !joinNumber) return 0;
  return Number(localStorage.getItem(countKey(joinNumber)) || 0);
}

export function buildShareUrl(joinNumber: number): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.pathname, window.location.origin);
  url.searchParams.set("invite", String(joinNumber));
  return url.toString();
}
