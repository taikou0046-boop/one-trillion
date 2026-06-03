export type CountryInfo = {
  code: string;
  flag: string;
};

export const COUNTRIES: Record<string, CountryInfo> = {
  JP: { code: "JP", flag: "🇯🇵" },
  US: { code: "US", flag: "🇺🇸" },
  CN: { code: "CN", flag: "🇨🇳" },
  KR: { code: "KR", flag: "🇰🇷" },
  BR: { code: "BR", flag: "🇧🇷" },
  ES: { code: "ES", flag: "🇪🇸" },
  IN: { code: "IN", flag: "🇮🇳" },
  ID: { code: "ID", flag: "🇮🇩" },
  DE: { code: "DE", flag: "🇩🇪" },
  FR: { code: "FR", flag: "🇫🇷" },
  GB: { code: "GB", flag: "🇬🇧" },
  MX: { code: "MX", flag: "🇲🇽" },
  PH: { code: "PH", flag: "🇵🇭" },
  VN: { code: "VN", flag: "🇻🇳" },
  TH: { code: "TH", flag: "🇹🇭" },
};

export const DEFAULT_COUNTRY: CountryInfo = COUNTRIES.US;

const LANG_TO_COUNTRY: Record<string, string> = {
  ja: "JP",
  ko: "KR",
  zh: "CN",
  pt: "BR",
  es: "ES",
  hi: "IN",
  id: "ID",
  de: "DE",
  fr: "FR",
};

export function getCountryByCode(code: string): CountryInfo {
  return COUNTRIES[code] ?? DEFAULT_COUNTRY;
}

export function detectCountryFromLocale(): CountryInfo {
  if (typeof navigator === "undefined") return DEFAULT_COUNTRY;

  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const langTag of languages) {
    const tag = langTag.toLowerCase();
    const parts = tag.split("-");
    if (parts.length >= 2) {
      const region = parts[parts.length - 1].toUpperCase();
      if (COUNTRIES[region]) return COUNTRIES[region];
    }
    const lang = parts[0];
    const mapped = LANG_TO_COUNTRY[lang];
    if (mapped) return COUNTRIES[mapped];
  }

  return DEFAULT_COUNTRY;
}

export async function detectCountryFromIp(): Promise<CountryInfo | null> {
  try {
    const res = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
    if (!res.ok) return null;
    const text = await res.text();
    const locLine = text.split("\n").find((line) => line.startsWith("loc="));
    const code = locLine?.slice(4).trim().toUpperCase();
    if (code && COUNTRIES[code]) return COUNTRIES[code];
    return null;
  } catch {
    return null;
  }
}

let cachedCountry: CountryInfo | null = null;
const countryListeners = new Set<() => void>();
let ipLookupStarted = false;

function emitCountryChange() {
  countryListeners.forEach((listener) => listener());
}

function startIpCountryLookup() {
  if (ipLookupStarted || typeof window === "undefined") return;
  ipLookupStarted = true;

  detectCountryFromIp().then((detected) => {
    if (!detected || detected.code === getCountrySnapshot().code) return;
    cachedCountry = detected;
    emitCountryChange();
  });
}

export function subscribeCountry(onStoreChange: () => void) {
  countryListeners.add(onStoreChange);
  startIpCountryLookup();
  return () => {
    countryListeners.delete(onStoreChange);
  };
}

export function getCountrySnapshot(): CountryInfo {
  if (cachedCountry === null) {
    cachedCountry = detectCountryFromLocale();
  }
  return cachedCountry;
}

export function getCountryServerSnapshot(): CountryInfo {
  return DEFAULT_COUNTRY;
}

export const LEADERBOARD_LIMIT = 10;
