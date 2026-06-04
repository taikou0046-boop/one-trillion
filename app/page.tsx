"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  doc,
  onSnapshot,
  runTransaction,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { initDb } from "@/lib/firebase";
import {
  getCountryByCode,
  getCountryServerSnapshot,
  getCountrySnapshot,
  LEADERBOARD_LIMIT,
  subscribeCountry,
} from "@/lib/countries";
import {
  formatNumber,
  getBadgeFraction,
  getLocaleServerSnapshot,
  getLocaleSnapshot,
  getLocalizedCountryName,
  getTranslations,
  subscribeNoop,
} from "@/lib/i18n";
import {
  buildShareCardMessage,
  getSeniorityBadge,
  isLegendFounder,
  readJoinTapNumber,
} from "@/lib/seniority";
import {
  buildShareUrl,
  creditInviteOnTap,
  getInvitedFriendsCount,
  parseAndStoreInviteFromUrl,
} from "@/lib/invite";
import {
  DAILY_MISSION_GOALS,
  DAILY_MISSION_MAX,
  getDailyTaps,
  getMsUntilMidnight,
  isMissionComplete,
  saveDailyTaps,
} from "@/lib/dailyMission";

type CountryRow = {
  id: string;
  code?: string;
  name?: string;
  flag?: string;
  totalTaps?: number;
};

const ONLINE_BASE = 4281;
const COUNTRIES_LIVE = 52;

function readStoredMyTaps(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("myTaps") || 0);
}

function readStoredRank(): number | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("humanRank");
  return saved ? Number(saved) : null;
}

function getCountryCode(row: CountryRow): string {
  return row.code ?? row.id;
}

function bumpCountryRow(
  rows: CountryRow[],
  countryCode: string,
  flag: string,
  name: string
): CountryRow[] {
  const idx = rows.findIndex((row) => getCountryCode(row) === countryCode);
  let next: CountryRow[];

  if (idx >= 0) {
    next = rows.map((row, i) =>
      i === idx
        ? { ...row, totalTaps: Number(row.totalTaps || 0) + 1 }
        : row
    );
  } else {
    next = [
      ...rows,
      {
        id: countryCode,
        code: countryCode,
        flag,
        name,
        totalTaps: 1,
      },
    ];
  }

  return next
    .sort((a, b) => Number(b.totalTaps || 0) - Number(a.totalTaps || 0))
    .slice(0, LEADERBOARD_LIMIT);
}

export default function Home() {
  const locale = useSyncExternalStore(
    subscribeNoop,
    getLocaleSnapshot,
    getLocaleServerSnapshot
  );
  const t = useMemo(() => getTranslations(locale), [locale]);
  const country = useSyncExternalStore(
    subscribeCountry,
    getCountrySnapshot,
    getCountryServerSnapshot
  );
  const localizedCountryName = useMemo(
    () => getLocalizedCountryName(country.code, t),
    [country.code, t]
  );

  const [total, setTotal] = useState(0);
  const [rank, setRank] = useState<number | null>(() =>
    readStoredRank() ?? readJoinTapNumber()
  );
  const [myTaps, setMyTaps] = useState(readStoredMyTaps);
  const [dailyTaps, setDailyTaps] = useState(getDailyTaps);
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [showPlus, setShowPlus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [tapError, setTapError] = useState<string | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState(() =>
    getInvitedFriendsCount(readJoinTapNumber() ?? readStoredRank())
  );

  const seniorityBadge = useMemo(
    () => (rank ? getSeniorityBadge(rank) : null),
    [rank]
  );

  const badgeFraction = useMemo(
    () => (rank ? getBadgeFraction(rank) : ""),
    [rank]
  );

  const countryRank = useMemo(() => {
    const idx = countries.findIndex(
      (c) => getCountryCode(c) === country.code
    );
    return idx >= 0 ? idx + 1 : null;
  }, [countries, country.code]);

  const japanTaps = useMemo(() => {
    const jp = countries.find((c) => getCountryCode(c) === "JP");
    return Number(jp?.totalTaps || 0);
  }, [countries]);

  const japanShare = useMemo(() => {
    if (total <= 0) return 50;
    return Math.min(100, Math.max(0, (japanTaps / total) * 100));
  }, [japanTaps, total]);

  const onlineNow = useMemo(
    () => ONLINE_BASE + Math.floor(total / 137),
    [total]
  );

  const formattedTotal = useMemo(
    () => formatNumber(total, locale),
    [total, locale]
  );

  const shareBody = useMemo(() => {
    if (!rank) return "";
    return buildShareCardMessage(Number(rank));
  }, [rank]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    parseAndStoreInviteFromUrl();
  }, []);

  useEffect(() => {
    const onStorage = () => {
      setInvitedFriends(
        getInvitedFriendsCount(readJoinTapNumber() ?? readStoredRank())
      );
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleMidnightReset = () => {
      timer = setTimeout(() => {
        saveDailyTaps(0);
        setDailyTaps(0);
        scheduleMidnightReset();
      }, getMsUntilMidnight());
    };

    scheduleMidnightReset();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        setDailyTaps(getDailyTaps());
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const unsubs: Array<() => void> = [];

    initDb()
      .then((db) => {
        if (cancelled) return;
        setFirebaseReady(true);
        setSyncError(null);

        const globalRef = doc(db, "counters", "global");
        unsubs.push(
          onSnapshot(
            globalRef,
            (snap) => {
              if (snap.exists()) setTotal(snap.data().totalTaps || 0);
            },
            (error) => {
              setSyncError(`Global counter sync failed: ${error.message}`);
            }
          )
        );

        const q = query(
          collection(db, "countries"),
          orderBy("totalTaps", "desc"),
          limit(LEADERBOARD_LIMIT)
        );
        unsubs.push(
          onSnapshot(
            q,
            (snap) => {
              setCountries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            },
            (error) => {
              setSyncError(`Country ranking sync failed: ${error.message}`);
            }
          )
        );
      })
      .catch((error) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Firebase init failed";
        setSyncError(message);
        setFirebaseReady(false);
      });

    return () => {
      cancelled = true;
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const tap = useCallback(async () => {
    setShowPlus(true);
    setTimeout(() => setShowPlus(false), 700);
    setTapError(null);

    const prevDailyTaps = dailyTaps;
    const nextDailyTaps = dailyTaps + 1;
    const prevTotal = total;
    const prevMyTaps = myTaps;
    const prevRank = rank;
    const prevCountries = countries;
    const nextTotal = total + 1;
    const nextMyTaps = myTaps + 1;
    const shouldClaimRank = !localStorage.getItem("humanRank");
    const optimisticRank = shouldClaimRank ? nextTotal : rank;

    setTotal(nextTotal);
    setMyTaps(nextMyTaps);
    setDailyTaps(nextDailyTaps);
    setCountries((rows) =>
      bumpCountryRow(rows, country.code, country.flag, localizedCountryName)
    );
    if (shouldClaimRank && optimisticRank !== null) {
      setRank(optimisticRank);
    }

    try {
      const db = await initDb();
      const globalRef = doc(db, "counters", "global");
      const countryRef = doc(db, "countries", country.code);
      let newRank: number | null = null;

      await runTransaction(db, async (tx) => {
        const globalSnap = await tx.get(globalRef);
        const countrySnap = await tx.get(countryRef);

        const current = globalSnap.exists()
          ? globalSnap.data().totalTaps || 0
          : 0;
        const transactionTotal = current + 1;

        if (shouldClaimRank) {
          newRank = transactionTotal;
        }

        const countryCurrent = countrySnap.exists()
          ? countrySnap.data().totalTaps || 0
          : 0;

        tx.set(
          globalRef,
          { totalTaps: transactionTotal },
          { merge: true }
        );
        tx.set(
          countryRef,
          {
            code: country.code,
            name: localizedCountryName,
            flag: country.flag,
            totalTaps: countryCurrent + 1,
          },
          { merge: true }
        );
      });

      localStorage.setItem("myTaps", String(nextMyTaps));
      saveDailyTaps(nextDailyTaps);
      if (newRank !== null) {
        localStorage.setItem("humanRank", String(newRank));
        localStorage.setItem("joinTapNumber", String(newRank));
        setRank(newRank);
      }
      creditInviteOnTap();
      setInvitedFriends(getInvitedFriendsCount(newRank ?? rank));
      setSyncError(null);
    } catch (error) {
      setTotal(prevTotal);
      setMyTaps(prevMyTaps);
      setDailyTaps(prevDailyTaps);
      setRank(prevRank);
      setCountries(prevCountries);
      const message =
        error instanceof Error ? error.message : "Tap failed to save";
      setTapError(message);
    }
  }, [
    total,
    myTaps,
    dailyTaps,
    rank,
    countries,
    country.code,
    country.flag,
    localizedCountryName,
  ]);

  const shareUrl = useMemo(
    () => (rank ? buildShareUrl(rank) : ""),
    [rank]
  );

  const shareNow = async () => {
    if (navigator.share) {
      await navigator.share({
        title: t.shareTitle,
        text: shareBody,
        url: shareUrl || window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(
        `${shareBody}\n\n${shareUrl || window.location.href}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `${shareBody}\n\n${shareUrl || window.location.href}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeError = tapError ?? syncError;

  return (
    <main className="app">
      <div className="app-bg" aria-hidden />
      <div className="app-nebula" aria-hidden />

      <div className="app-grid">
        {/* ── CENTER HERO ── */}
        <section className="hero">
          <header className="masthead">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="title">{t.title}</h1>
            <p className="subtitle">
              {t.subtitleBefore}
              <span className="subtitle-num">1,000,000,000,000</span>
              {t.subtitleAfter}
            </p>
          </header>

          {activeError && (
            <p className="firebase-error" role="alert">
              {activeError}
            </p>
          )}

          <div className="counter-block">
            <p className="counter-label">{t.globalTaps}</p>
            <p className="counter-value">{formattedTotal}</p>
          </div>

          <div className="tap-wrap">
            {showPlus && <span className="float-plus">+1</span>}
            <button type="button" onClick={tap} className="tap-btn">
              {t.tap}
            </button>
          </div>

          <div className="live-stats">
            <span>{t.online(formatNumber(onlineNow, locale))}</span>
            <span>{t.countriesLive(COUNTRIES_LIVE)}</span>
            {!firebaseReady && !activeError && (
              <span className="live-stats-hint">Connecting…</span>
            )}
          </div>
        </section>

        {/* ── LEFT: personal cards ── */}
        <aside className="col-left">
          <div className="glass-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.yourGlobalRank}</h2>
            {rank ? (
              <>
                <p className="card-stat blue-glow world-rank-stat">
                  {t.worldRankPosition(formatNumber(rank, locale))}
                </p>
                {rank > 1 && (
                  <p className="card-hint rank-next-hint">
                    {t.worldRankNext(1, formatNumber(rank - 1, locale))}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="card-stat blue-glow">—</p>
                <p className="card-hint">{t.tapToClaimRank}</p>
              </>
            )}
          </div>

          <div className="glass-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.yourCountryRank}</h2>
            <p className="card-stat blue-glow">
              {countryRank ? `#${countryRank}` : "—"}
            </p>
            <p className="card-hint">
              {country.flag} {localizedCountryName}
              {!countryRank && rank ? t.outsideRanking : ""}
              {!rank ? t.tapToCompete : ""}
            </p>
          </div>

          <div
            className={`glass-card founder-card${
              rank && rank <= 10000 ? " founder-active" : ""
            }${rank && isLegendFounder(rank) ? " legend-founder" : ""}`}
          >
            <div className="card-shine gold-shine" aria-hidden />
            <h2 className="card-label">{t.founderBadge}</h2>
            {rank ? (
              <div className="founder-medal">
                <div className="founder-seal">★</div>
                <div>
                  <p className="founder-tier">{seniorityBadge}</p>
                  <p className="founder-stat">
                    #{formatNumber(rank, locale)}
                    {rank <= 10000 ? (
                      <span className="founder-of">{badgeFraction}</span>
                    ) : null}
                  </p>
                </div>
              </div>
            ) : (
              <div className="founder-locked">
                <div className="founder-seal locked">☆</div>
                <p className="card-hint">{t.joinEarlyToUnlock}</p>
              </div>
            )}
          </div>

          <div className="glass-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.invitedFriends}</h2>
            <p className="card-stat blue-glow invite-stat">
              {t.invitedFriendsCount(formatNumber(invitedFriends, locale))}
            </p>
          </div>

          <div className="glass-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.yourTaps}</h2>
            <p className="card-stat blue-glow">{formatNumber(myTaps, locale)}</p>
          </div>

          <div className="glass-card mission-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.dailyMission}</h2>
            <ul className="mission-list">
              {DAILY_MISSION_GOALS.map((goal) => {
                const done = isMissionComplete(dailyTaps, goal);
                return (
                  <li
                    key={goal}
                    className={`mission-row${done ? " mission-row-done" : ""}`}
                  >
                    <span>{t.dailyGoal(goal)}</span>
                    {done && (
                      <span className="mission-complete">{t.missionComplete}</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mission-progress">
              {t.dailyProgress(
                formatNumber(dailyTaps, locale),
                formatNumber(DAILY_MISSION_MAX, locale)
              )}
            </p>
          </div>
        </aside>

        {/* ── RIGHT: country ranking ── */}
        <aside className="col-right">
          <div className="glass-card vs-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.japanVsWorld}</h2>
            <div className="vs-rows">
              <div className="vs-row">
                <span className="vs-label">{t.japanLabel}</span>
                <span className="vs-value">
                  {formatNumber(japanTaps, locale)}
                </span>
              </div>
              <div className="vs-row">
                <span className="vs-label">{t.worldLabel}</span>
                <span className="vs-value">
                  {formatNumber(total, locale)}
                </span>
              </div>
            </div>
            <div className="vs-bar" role="img" aria-label={`Japan ${Math.round(japanShare)}% of world taps`}>
              <div className="vs-bar-japan" style={{ width: `${japanShare}%` }} />
              <div className="vs-bar-world" />
            </div>
          </div>

          <div className="glass-card leaderboard-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.countryRankingTop10}</h2>
            {countries.length === 0 ? (
              <p className="card-hint center">{t.noDataYet}</p>
            ) : (
              <ol className="leaderboard">
                {countries.map((c, i) => {
                  const code = getCountryCode(c);
                  const info = getCountryByCode(code);
                  const isYou = code === country.code;
                  return (
                    <li
                      key={c.id}
                      className={`lb-row${isYou ? " lb-row-you" : ""}`}
                    >
                      <span className="lb-num">{i + 1}</span>
                      <span className="lb-flag">{c.flag ?? info.flag}</span>
                      <span className="lb-country">
                        {getLocalizedCountryName(code, t)}
                      </span>
                      <span className="lb-taps">
                        {formatNumber(Number(c.totalTaps || 0), locale)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </aside>

        {/* ── SHARE PROOF (after first tap) ── */}
        {myTaps > 0 && rank !== null && (
          <section className="share-card">
            <div className="share-glow" aria-hidden />
            <p className="share-lead">
              I joined <strong>ONE TRILLION</strong> when there were only{" "}
              <strong className="share-count">
                {formatNumber(rank, locale)}
              </strong>{" "}
              taps.
            </p>
            <p className="share-question">
              Can humanity reach 1,000,000,000,000?
            </p>
            <div className="share-btns">
              <button type="button" onClick={shareNow} className="btn-share">
                {t.shareNow}
              </button>
              <button type="button" onClick={copyLink} className="btn-copy">
                {copied ? t.copied : t.copyLink}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
