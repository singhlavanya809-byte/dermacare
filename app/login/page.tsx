"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { SiteShell } from "@/components/site-shell";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    router.replace("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <div className="container-shell py-16">
        <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-slate-600">Log in to continue your skin wellness routine.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-[#2b8a6b]" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#2b8a6b]" placeholder="••••••••" />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button disabled={loading} className="w-full rounded-full bg-[#2b8a6b] px-4 py-3 font-semibold text-white disabled:opacity-70">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Need an account? <Link href="/signup" className="font-semibold text-[#2b8a6b]">Sign up</Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
