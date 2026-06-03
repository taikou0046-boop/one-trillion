"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  doc,
  onSnapshot,
  runTransaction,
  collection,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import {
  formatNumber,
  getBadgeFraction,
  getBadgeLabel,
  getLocaleServerSnapshot,
  getLocaleSnapshot,
  getLocalizedCountryName,
  getTranslations,
  subscribeNoop,
} from "@/lib/i18n";

type CountryInfo = {
  code: string;
  name: string;
  flag: string;
};

type CountryRow = {
  id: string;
  code?: string;
  name?: string;
  flag?: string;
  totalTaps?: number;
};

const ONLINE_BASE = 4281;
const COUNTRIES_LIVE = 52;

function getCountry(): CountryInfo {
  if (typeof navigator === "undefined")
    return { code: "US", name: "United States", flag: "🇺🇸" };

  const lang = navigator.language.toLowerCase();
  if (lang.includes("ja")) return { code: "JP", name: "Japan", flag: "🇯🇵" };
  if (lang.includes("ko")) return { code: "KR", name: "Korea", flag: "🇰🇷" };
  if (lang.includes("zh")) return { code: "CN", name: "China", flag: "🇨🇳" };
  if (lang.includes("pt")) return { code: "BR", name: "Brazil", flag: "🇧🇷" };
  if (lang.includes("es")) return { code: "ES", name: "Spain", flag: "🇪🇸" };
  return { code: "US", name: "United States", flag: "🇺🇸" };
}

const DEFAULT_COUNTRY: CountryInfo = {
  code: "US",
  name: "United States",
  flag: "🇺🇸",
};

let cachedCountry: CountryInfo | null = null;

function getCountrySnapshot(): CountryInfo {
  if (cachedCountry === null) {
    cachedCountry = getCountry();
  }
  return cachedCountry;
}

function getCountryServerSnapshot(): CountryInfo {
  return DEFAULT_COUNTRY;
}

function readStoredMyTaps(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("myTaps") || 0);
}

function readStoredRank(): number | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("humanRank");
  return saved ? Number(saved) : null;
}

export default function Home() {
  const locale = useSyncExternalStore(
    subscribeNoop,
    getLocaleSnapshot,
    getLocaleServerSnapshot
  );
  const t = useMemo(() => getTranslations(locale), [locale]);
  const country = useSyncExternalStore(
    subscribeNoop,
    getCountrySnapshot,
    getCountryServerSnapshot
  );
  const localizedCountryName = useMemo(
    () => getLocalizedCountryName(country.code, t),
    [country.code, t]
  );

  const [total, setTotal] = useState(0);
  const [rank, setRank] = useState<number | null>(readStoredRank);
  const [myTaps, setMyTaps] = useState(readStoredMyTaps);
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [showPlus, setShowPlus] = useState(false);
  const [copied, setCopied] = useState(false);

  const badgeLabel = useMemo(
    () => (rank ? getBadgeLabel(rank, t) : null),
    [rank, t]
  );

  const badgeFraction = useMemo(
    () => (rank ? getBadgeFraction(rank) : ""),
    [rank]
  );

  const countryRank = useMemo(() => {
    const idx = countries.findIndex(
      (c) => c.id === country.code || c.code === country.code
    );
    return idx >= 0 ? idx + 1 : null;
  }, [countries, country.code]);

  const onlineNow = useMemo(
    () => ONLINE_BASE + Math.floor(total / 137),
    [total]
  );

  const formattedTotal = useMemo(
    () => formatNumber(total, locale),
    [total, locale]
  );

  const shareBody = useMemo(() => {
    let text = `${t.shareMessageIntro(formattedTotal)}\n\n${t.shareQuestion}`;
    if (rank) {
      text = `${t.shareMessageIntro(formattedTotal)}\n\n${t.shareGlobalRank(formatNumber(rank, locale))}`;
      if (badgeLabel) {
        text += `\n${t.shareBadge(badgeLabel, badgeFraction)}`;
      }
      if (countryRank) {
        text += `\n${t.shareCountryRank(countryRank, localizedCountryName)}`;
      }
      text += `\n\n${t.shareQuestion}`;
    }
    return text;
  }, [
    t,
    formattedTotal,
    rank,
    badgeLabel,
    badgeFraction,
    countryRank,
    localizedCountryName,
    locale,
  ]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const db = getDb();
    const globalRef = doc(db, "counters", "global");
    const unsubGlobal = onSnapshot(globalRef, (snap) => {
      if (snap.exists()) setTotal(snap.data().totalTaps || 0);
    });

    const q = query(
      collection(db, "countries"),
      orderBy("totalTaps", "desc"),
      limit(5)
    );
    const unsubCountries = onSnapshot(q, (snap) => {
      setCountries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubGlobal();
      unsubCountries();
    };
  }, []);

  const tap = async () => {
    setShowPlus(true);
    setTimeout(() => setShowPlus(false), 700);

    const db = getDb();
    const globalRef = doc(db, "counters", "global");
    const countryRef = doc(db, "countries", country.code);
    let newRank: number | null = null;

    await runTransaction(db, async (tx) => {
      const globalSnap = await tx.get(globalRef);
      const current = globalSnap.exists()
        ? globalSnap.data().totalTaps || 0
        : 0;
      const nextTotal = current + 1;

      if (!localStorage.getItem("humanRank")) {
        newRank = nextTotal;
      }

      tx.set(globalRef, { totalTaps: nextTotal }, { merge: true });

      const countrySnap = await tx.get(countryRef);
      const countryCurrent = countrySnap.exists()
        ? countrySnap.data().totalTaps || 0
        : 0;
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

    const newMyTaps = myTaps + 1;
    setMyTaps(newMyTaps);
    localStorage.setItem("myTaps", String(newMyTaps));

    if (newRank !== null) {
      setRank(newRank);
      localStorage.setItem("humanRank", String(newRank));
    }
  };

  const shareNow = async () => {
    if (navigator.share) {
      await navigator.share({
        title: t.shareTitle,
        text: shareBody,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(`${shareBody}\n\n${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${shareBody}\n\n${window.location.href}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
          </div>
        </section>

        {/* ── LEFT: personal cards ── */}
        <aside className="col-left">
          <div className="glass-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.yourGlobalRank}</h2>
            <p className="card-stat blue-glow">
              {rank ? `#${formatNumber(rank, locale)}` : "—"}
            </p>
            {!rank && <p className="card-hint">{t.tapToClaimRank}</p>}
          </div>

          <div className="glass-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.yourCountryRank}</h2>
            <p className="card-stat blue-glow">
              {countryRank ? `#${countryRank}` : "—"}
            </p>
            <p className="card-hint">
              {country.flag} {localizedCountryName}
              {!countryRank && rank ? t.outsideTop5 : ""}
              {!rank ? t.tapToCompete : ""}
            </p>
          </div>

          <div className={`glass-card founder-card ${rank && rank <= 10000 ? "founder-active" : ""}`}>
            <div className="card-shine gold-shine" aria-hidden />
            <h2 className="card-label">{t.founderBadge}</h2>
            {rank && rank <= 10000 ? (
              <div className="founder-medal">
                <div className="founder-seal">★</div>
                <div>
                  <p className="founder-tier">{badgeLabel}</p>
                  <p className="founder-stat">
                    #{formatNumber(rank, locale)}
                    <span className="founder-of">{badgeFraction}</span>
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
            <h2 className="card-label">{t.yourTaps}</h2>
            <p className="card-stat blue-glow">{formatNumber(myTaps, locale)}</p>
          </div>
        </aside>

        {/* ── RIGHT: leaderboard ── */}
        <aside className="col-right">
          <div className="glass-card leaderboard-card">
            <div className="card-shine" aria-hidden />
            <h2 className="card-label">{t.countryRanking}</h2>
            {countries.length === 0 ? (
              <p className="card-hint center">{t.noDataYet}</p>
            ) : (
              <ol className="leaderboard">
                {countries.map((c, i) => (
                  <li key={c.id} className="lb-row">
                    <span className="lb-num">{i + 1}</span>
                    <span className="lb-flag">{c.flag}</span>
                    <span className="lb-country">{c.name}</span>
                    <span className="lb-taps">
                      {formatNumber(Number(c.totalTaps || 0), locale)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </aside>

        {/* ── SHARE PROOF ── */}
        <section className="share-card">
          <div className="share-glow" aria-hidden />
          <p className="share-lead">
            {t.shareJoined} <strong>{t.shareProjectName}</strong>
          </p>
          <p className="share-body">
            {t.shareWhenBefore}
            <strong className="share-count">{formattedTotal}</strong>
            {t.shareWhenAfter}
          </p>
          <p className="share-question">{t.shareQuestion}</p>
          <div className="share-proof-row">
            <div className="proof-chip">
              <span>{t.proofGlobalRank}</span>
              <b>{rank ? `#${formatNumber(rank, locale)}` : "—"}</b>
            </div>
            <div className="proof-chip">
              <span>{t.proofCountryRank}</span>
              <b>{countryRank ? `#${countryRank}` : "—"}</b>
            </div>
            <div className="proof-chip">
              <span>{t.proofFounderBadge}</span>
              <b>{rank && rank <= 10000 ? badgeLabel : "—"}</b>
            </div>
            <div className="proof-chip">
              <span>{t.proofGlobalTaps}</span>
              <b>{formattedTotal}</b>
            </div>
          </div>
          <div className="share-btns">
            <button type="button" onClick={shareNow} className="btn-share">
              {t.shareNow}
            </button>
            <button type="button" onClick={copyLink} className="btn-copy">
              {copied ? t.copied : t.copyLink}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
