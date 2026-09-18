"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase/config";
import type { AuthUser } from "@/types";

const DEMO_USER_KEY = "dermasense-demo-user";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  demoMode: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined" || isFirebaseConfigured) return null;
    const saved = localStorage.getItem(DEMO_USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved) as AuthUser;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      void Promise.resolve().then(() => setLoading(false));
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(toAuthUser(firebaseUser));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      const demoUser = { uid: `demo-${Date.now()}`, email, displayName: displayName ?? "Demo User" };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return;
    }

    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    setUser(toAuthUser(credential.user));
  };

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      const demoUser = { uid: `demo-${Date.now()}`, email, displayName: email.split("@")[0] };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return;
    }

    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    setUser(toAuthUser(credential.user));
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      localStorage.removeItem(DEMO_USER_KEY);
      setUser(null);
      return;
    }

    await signOut(firebaseAuth);
    setUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, demoMode: !isFirebaseConfigured, signUp, login, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
