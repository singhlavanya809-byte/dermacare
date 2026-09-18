import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firebaseAuth, firebaseDb, isFirebaseConfigured } from "@/lib/firebase/config";

const DEMO_ANALYSES_KEY = "dermasense-demo-analyses";
const DEMO_JOURNAL_KEY = "dermasense-demo-journal";

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function requireUserUid(uid: string | undefined) {
  if (!uid) {
    throw new Error("You must be signed in to save this information.");
  }

  if (isFirebaseConfigured) {
    const authenticatedUid = firebaseAuth?.currentUser?.uid;
    if (!authenticatedUid) {
      throw new Error("Your Firebase session is still loading. Please try again in a moment.");
    }
    if (authenticatedUid !== uid) {
      throw new Error("Your signed-in account does not match this analysis.");
    }
  }
}

export async function saveAnalysisRecord(uid: string, payload: Record<string, unknown>) {
  requireUserUid(uid);
  const demoRecord = { ...payload, createdAt: new Date().toISOString() };

  if (!isFirebaseConfigured || !firebaseDb) {
    const entries = safeRead<Record<string, unknown>[]>(DEMO_ANALYSES_KEY, []);
    const next = [{ id: `analysis-${Date.now()}`, ...demoRecord }, ...entries];
    safeWrite(DEMO_ANALYSES_KEY, next);
    return next[0];
  }

  const ref = await addDoc(collection(firebaseDb, "users", uid, "analyses"), { ...payload, createdAt: serverTimestamp() });
  return { id: ref.id, ...demoRecord };
}

export async function getAnalysesForUser(uid: string) {
  requireUserUid(uid);
  if (!isFirebaseConfigured || !firebaseDb) {
    return safeRead<Record<string, unknown>[]>(DEMO_ANALYSES_KEY, []);
  }

  const q = query(collection(firebaseDb, "users", uid, "analyses"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
}

export async function saveJournalEntryForUser(uid: string, payload: Record<string, unknown>) {
  requireUserUid(uid);
  const demoRecord = { ...payload, createdAt: new Date().toISOString() };

  if (!isFirebaseConfigured || !firebaseDb) {
    const entries = safeRead<Record<string, unknown>[]>(DEMO_JOURNAL_KEY, []);
    const next = [{ id: `entry-${Date.now()}`, ...demoRecord }, ...entries];
    safeWrite(DEMO_JOURNAL_KEY, next);
    return next[0];
  }

  const ref = await addDoc(collection(firebaseDb, "users", uid, "journal"), { ...payload, createdAt: serverTimestamp() });
  return { id: ref.id, ...demoRecord };
}

export async function getJournalForUser(uid: string) {
  requireUserUid(uid);
  if (!isFirebaseConfigured || !firebaseDb) {
    return safeRead<Record<string, unknown>[]>(DEMO_JOURNAL_KEY, []);
  }

  const q = query(collection(firebaseDb, "users", uid, "journal"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
}

export async function updateJournalEntryForUser(uid: string, id: string, payload: Record<string, unknown>) {
  requireUserUid(uid);
  if (!isFirebaseConfigured || !firebaseDb) {
    const entries = safeRead<Record<string, unknown>[]>(DEMO_JOURNAL_KEY, []);
    const next = entries.map((entry) => (entry.id === id ? { ...entry, ...payload, updatedAt: new Date().toISOString() } : entry));
    safeWrite(DEMO_JOURNAL_KEY, next);
    return next.find((entry) => entry.id === id);
  }

  const ref = doc(firebaseDb, "users", uid, "journal", id);
  await updateDoc(ref, payload);
  return { id, ...payload };
}

export async function deleteJournalEntryForUser(uid: string, id: string) {
  requireUserUid(uid);
  if (!isFirebaseConfigured || !firebaseDb) {
    const entries = safeRead<Record<string, unknown>[]>(DEMO_JOURNAL_KEY, []);
    const next = entries.filter((entry) => entry.id !== id);
    safeWrite(DEMO_JOURNAL_KEY, next);
    return { success: true };
  }

  const ref = doc(firebaseDb, "users", uid, "journal", id);
  await deleteDoc(ref);
  return { success: true };
}
