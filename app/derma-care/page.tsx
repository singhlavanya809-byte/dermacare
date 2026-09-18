"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { filterByConcern, filterBySkinType, getAllRemedies, getSafetyWarnings, searchRemedies } from "@/lib/knowledge/dermaCare";

export default function DermaCarePage() {
  const [query, setQuery] = useState("");
  const [skinType, setSkinType] = useState("All");
  const [concern, setConcern] = useState("All");

  const remedies = useMemo(() => {
    let list = getAllRemedies();
    if (query) list = searchRemedies(query);
    if (skinType !== "All") list = filterBySkinType(skinType);
    if (concern !== "All") list = filterByConcern(concern);
    return list;
  }, [query, skinType, concern]);

  return (
    <SiteShell>
      <div className="container-shell py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#2b8a6b]">Derma Care</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Educational remedies and skin safety references</h1>
        </div>

        <div className="card-surface mb-6 rounded-[2rem] p-5">
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.5fr_0.5fr]">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search remedies" className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4" />
            </div>
            <select value={skinType} onChange={(e) => setSkinType(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-3">
              <option>All</option>
              <option>Dry</option>
              <option>Oily</option>
              <option>Combination</option>
              <option>Sensitive</option>
              <option>Normal</option>
            </select>
            <select value={concern} onChange={(e) => setConcern(e.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-3">
              <option>All</option>
              <option>Dryness</option>
              <option>Acne</option>
              <option>Texture</option>
              <option>Redness</option>
              <option>Pigmentation</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {remedies.map((remedy) => {
            const warnings = getSafetyWarnings(remedy);
            return (
              <div key={remedy.id} className="card-surface rounded-[2rem] p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{remedy.name}</h2>
                  <span className="rounded-full bg-[#eaf7f2] px-2.5 py-1 text-xs font-medium text-[#205b4d]">{remedy.evidenceLevel}</span>
                </div>
                <p className="mt-4 text-sm text-slate-500">{remedy.category}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {remedy.skinTypes.map((skin) => <span key={skin} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{skin}</span>)}
                </div>
                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-800">Traditional use:</span> {remedy.traditionalUses.join(", ")}</p>
                  <p><span className="font-semibold text-slate-800">Best for:</span> {remedy.bestFor.join(", ")}</p>
                  <p><span className="font-semibold text-slate-800">Avoid if:</span> {remedy.avoidIf.join(", ")}</p>
                  <p><span className="font-semibold text-slate-800">Method:</span> {remedy.method}</p>
                  <p><span className="font-semibold text-slate-800">Frequency:</span> {remedy.frequency}</p>
                  <p><span className="font-semibold text-slate-800">Safety:</span> {remedy.safety}</p>
                </div>
                <div className="mt-5 text-xs text-amber-700">
                  {warnings.map((warning) => <p key={warning}>⚠ {warning}</p>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
