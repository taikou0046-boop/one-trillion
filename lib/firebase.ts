import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const ENV_KEYS = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
} as const;

function readFirebaseConfig(): FirebasePublicConfig {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };
}

function getMissingEnvKeys(config: FirebasePublicConfig): string[] {
  return (Object.keys(ENV_KEYS) as (keyof FirebasePublicConfig)[])
    .filter((key) => !config[key])
    .map((key) => ENV_KEYS[key]);
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let initPromise: Promise<Firestore> | null = null;
let lastInitError: string | null = null;

async function loadFirebaseConfig(): Promise<FirebasePublicConfig> {
  const localConfig = readFirebaseConfig();
  const missingLocal = getMissingEnvKeys(localConfig);
  if (missingLocal.length === 0) return localConfig;

  const res = await fetch("/api/firebase-config");
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const missing = Array.isArray(body.missing)
      ? body.missing.join(", ")
      : body.error ?? res.statusText;
    throw new Error(`Firebase config unavailable: ${missing}`);
  }

  const missingRemote = getMissingEnvKeys(body);
  if (missingRemote.length > 0) {
    throw new Error(
      `Firebase config incomplete: ${missingRemote.join(", ")}`
    );
  }

  return body as FirebasePublicConfig;
}

function createFirebaseApp(config: FirebasePublicConfig): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(config);
}

export function getFirebaseStatus(): {
  ready: boolean;
  missing: string[];
  error: string | null;
} {
  if (firestoreDb) {
    return { ready: true, missing: [], error: null };
  }

  const missing = getMissingEnvKeys(readFirebaseConfig());
  return {
    ready: false,
    missing,
    error: lastInitError,
  };
}

export function initDb(): Promise<Firestore> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Firestore is only available in the browser.")
    );
  }

  if (firestoreDb) return Promise.resolve(firestoreDb);

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const config = await loadFirebaseConfig();
        firebaseApp = createFirebaseApp(config);
        firestoreDb = getFirestore(firebaseApp);
        lastInitError = null;
        return firestoreDb;
      } catch (error) {
        lastInitError =
          error instanceof Error ? error.message : "Firebase init failed";
        initPromise = null;
        throw error;
      }
    })();
  }

  return initPromise;
}

export function getDb(): Firestore {
  if (!firestoreDb) {
    throw new Error("Firebase not initialized. Call initDb() first.");
  }
  return firestoreDb;
}

export function isDbReady(): boolean {
  return firestoreDb !== null;
}
