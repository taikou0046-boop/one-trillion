import { initializeApp } from "firebase/app";
import {
  doc,
  getDoc,
  getFirestore,
  runTransaction,
} from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(config);
const db = getFirestore(app);
const globalRef = doc(db, "counters", "global");

const beforeSnap = await getDoc(globalRef);
const before = beforeSnap.exists() ? beforeSnap.data().totalTaps || 0 : 0;

await runTransaction(db, async (tx) => {
  const snap = await tx.get(globalRef);
  const current = snap.exists() ? snap.data().totalTaps || 0 : 0;
  tx.set(globalRef, { totalTaps: current + 1 }, { merge: true });
});

const afterSnap = await getDoc(globalRef);
const after = afterSnap.data()?.totalTaps ?? 0;

if (after !== before + 1) {
  console.error(`Write failed: expected ${before + 1}, got ${after}`);
  process.exit(1);
}

console.log(`Firestore OK: counters/global read ${before}, wrote ${after}`);
