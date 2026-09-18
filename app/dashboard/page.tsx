"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookHeart, CloudSun, FileText, HeartPulse, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { SiteShell } from "@/components/site-shell";
import { getWeather } from "@/lib/api/services";
import { getAnalysesForUser } from "@/lib/firebase/firestore";

type AnalysisRecord = {
  id: string;
  userId?: string;
  createdAt?: { toDate?: () => Date } | string | null;
  analysisResult?: { possibleCategories?: string[]; generalCareConsiderations?: string[]; confidence?: string; educationalExplanation?: string };
  skinConcerns?: string[];
  recommendations?: string[];
  questionnaire?: { skinType?: string; mainConcern?: string };
};

type Weather = { temperature?: number; humidity?: number; weather?: string; source?: "api" | "demo" };

function formatDate(value: AnalysisRecord["createdAt"]) {
  if (!value) return "Date pending";
  const date = typeof value === "string" ? new Date(value) : value.toDate?.();
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : "Date pending";
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, demoMode } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboardData(uid: string) {
    setLoading(true);
    setError("");
    try {
      const [analysisData, weatherData] = await Promise.all([getAnalysesForUser(uid), getWeather()]);
      setAnalyses(analysisData as AnalysisRecord[]);
      setWeather(weatherData.weather as Weather);
    } catch {
      setError("Some dashboard data could not be loaded. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    void Promise.resolve().then(() => loadDashboardData(user.uid));
  }, [authLoading, router, user]);

  if (authLoading || !user) {
    return <SiteShell><div className="container-shell py-16 text-center text-slate-500">{authLoading ? "Loading your account..." : "Redirecting to login..."}</div></SiteShell>;
  }

  const latest = analyses[0];
  const latestResult = latest?.analysisResult;
  const concerns = latest?.skinConcerns?.length ? latest.skinConcerns : latestResult?.possibleCategories ?? [];
  const recommendations = latest?.recommendations?.length ? latest.recommendations : latestResult?.generalCareConsiderations ?? [];

  return (
    <SiteShell>
      <div className="container-shell py-10">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div><p className="text-sm font-medium uppercase tracking-[0.2em] text-[#2b8a6b]">Dashboard</p><h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Hello, {user.displayName ?? user.email.split("@")[0]}</h1></div>
          {demoMode && <span className="inline-flex rounded-full bg-[#fff7d6] px-3 py-1 text-xs font-medium text-[#7e5a00]">Demo Mode active</span>}
        </div>

        {error && <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card-surface rounded-[2rem] p-6"><div className="flex items-center justify-between"><div className="rounded-2xl bg-[#dff6ee] p-3 text-[#2b8a6b]"><HeartPulse className="size-5" /></div><span className="text-sm text-slate-500">Personal</span></div><p className="mt-5 text-sm text-slate-500">Saved analyses</p><h2 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">{loading ? "-" : analyses.length}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Only analyses saved to your account are shown.</p></div>
          <div className="card-surface rounded-[2rem] p-6"><div className="flex items-center justify-between"><div className="rounded-2xl bg-[#eff6ff] p-3 text-[#2361a8]"><FileText className="size-5" /></div><span className="text-sm text-slate-500">Latest</span></div><p className="mt-5 text-sm text-slate-500">Most recent concern</p><h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{latest ? concerns[0] || latest.questionnaire?.mainConcern || "Review complete" : "No analysis yet"}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{latest ? formatDate(latest.createdAt) : "Start your first skin analysis."}</p></div>
          <div className="card-surface rounded-[2rem] p-6"><div className="flex items-center justify-between"><div className="rounded-2xl bg-[#fff0e9] p-3 text-[#a65d30]"><ShieldCheck className="size-5" /></div><span className="text-sm text-slate-500">Safety</span></div><p className="mt-5 text-sm text-slate-500">Care reminder</p><h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Patch test new products</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Stop if irritation worsens and seek professional advice for persistent concerns.</p></div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="card-surface rounded-[2rem] p-6" aria-labelledby="history-heading">
            <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><FileText className="size-5 text-[#2b8a6b]" /><h2 id="history-heading" className="text-xl font-bold text-slate-900 dark:text-slate-100">Analysis history</h2></div><Link href="/skin-analysis" className="text-sm font-semibold text-[#2b8a6b]">Start new</Link></div>
            {loading ? <div className="flex items-center gap-3 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" /> Loading your analyses...</div> : analyses.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900"><p className="font-semibold text-slate-800 dark:text-slate-100">No saved analyses yet.</p><p className="mt-2 text-sm text-slate-500">Start your first skin analysis to build your private history.</p><Link href="/skin-analysis" className="mt-5 inline-flex rounded-full bg-[#2b8a6b] px-4 py-2 text-sm font-semibold text-white">Start skin analysis</Link></div> : <div className="space-y-3">{analyses.map((analysis) => { const result = analysis.analysisResult; const categories = analysis.skinConcerns?.length ? analysis.skinConcerns : result?.possibleCategories ?? []; return <details key={analysis.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"><summary className="cursor-pointer list-none"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-slate-900 dark:text-slate-100">{categories[0] || analysis.questionnaire?.mainConcern || "Skin wellness analysis"}</p><p className="mt-1 text-sm text-slate-500">{formatDate(analysis.createdAt)}{result?.confidence ? ` • ${result.confidence} confidence` : ""}</p></div><ArrowRight className="size-4 text-slate-400" /></div></summary><div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"><p>{result?.educationalExplanation || "Educational analysis saved to your account."}</p>{categories.length > 0 && <p className="mt-3"><span className="font-semibold">Possible concerns:</span> {categories.join(", ")}</p>}</div></details>; })}</div>}
          </section>

          <section className="card-surface rounded-[2rem] p-6" aria-labelledby="environment-heading"><div className="mb-4 flex items-center gap-3"><CloudSun className="size-5 text-[#2b8a6b]" /><h2 id="environment-heading" className="text-xl font-bold text-slate-900 dark:text-slate-100">Environment</h2></div>{loading ? <p className="text-sm text-slate-500">Loading environment notes...</p> : <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300"><p><span className="font-semibold text-slate-800 dark:text-slate-100">Weather:</span> {weather?.weather || "Unavailable"}</p><p><span className="font-semibold text-slate-800 dark:text-slate-100">Temperature:</span> {weather?.temperature ?? "-"}°C</p><p><span className="font-semibold text-slate-800 dark:text-slate-100">Humidity:</span> {weather?.humidity ?? "-"}%</p><p className="mt-3 rounded-2xl bg-[#f5faf8] p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300">Environmental conditions may affect how your skin feels. This is educational context, not medical advice.</p>{weather?.source === "demo" && <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#8c4d2f]">Demo weather data</p>}</div>}</section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2"><div className="card-surface rounded-[2rem] p-6"><div className="mb-4 flex items-center gap-3"><BookHeart className="size-5 text-[#2b8a6b]" /><h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Latest recommendations</h2></div>{recommendations.length ? <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">{recommendations.slice(0, 4).map((recommendation) => <li key={recommendation}>• {recommendation}</li>)}</ul> : <p className="text-sm text-slate-500">Complete an analysis to see personalized educational recommendations.</p>}</div><div className="card-surface rounded-[2rem] p-6"><div className="mb-4 flex items-center gap-3"><Sparkles className="size-5 text-[#2b8a6b]" /><h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quick actions</h2></div><div className="space-y-3"><Link href="/skin-analysis" className="flex items-center justify-between rounded-2xl bg-[#ecf9f4] px-4 py-3 text-sm font-medium text-slate-800">Start new analysis <ArrowRight className="size-4" /></Link><Link href="/journal" className="flex items-center justify-between rounded-2xl bg-[#f4f7f6] px-4 py-3 text-sm font-medium text-slate-800">Update journal <ArrowRight className="size-4" /></Link><Link href="/derma-care" className="flex items-center justify-between rounded-2xl bg-[#fff0e9] px-4 py-3 text-sm font-medium text-slate-800">Explore Derma Care <ArrowRight className="size-4" /></Link></div></div></div>
      </div>
    </SiteShell>
  );
}
