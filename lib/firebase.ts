import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebasePublicConfig = {
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

function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp;

  const config = readFirebaseConfig();
  const missing = getMissingEnvKeys(config);
  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missing.join(", ")}`
    );
  }

  firebaseApp = getApps().length ? getApp() : initializeApp(config);
  return firebaseApp;
}

export function getDb(): Firestore {
  if (typeof window === "undefined") {
    throw new Error("Firestore is only available in the browser.");
  }

  if (!firestoreDb) {
    firestoreDb = getFirestore(getFirebaseApp());
  }

  return firestoreDb;
}
