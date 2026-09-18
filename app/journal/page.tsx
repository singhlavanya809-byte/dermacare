"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { SiteShell } from "@/components/site-shell";
import {
  deleteJournalEntryForUser,
  getJournalForUser,
  saveJournalEntryForUser,
  updateJournalEntryForUser,
} from "@/lib/firebase/firestore";

type JournalRecord = {
  id: string;
  date: string;
  concern: string;
  notes: string;
  products: string;
  rating: number;
  createdAt?: { toDate?: () => Date } | string | null;
};

type JournalForm = Omit<JournalRecord, "id" | "createdAt">;

const emptyForm: JournalForm = { date: "", concern: "Dryness", notes: "", products: "", rating: 4 };

function formatDate(value: JournalRecord["createdAt"] | string | undefined, fallback?: string) {
  if (fallback) return fallback;
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value.toDate?.();
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : "";
}

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<JournalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<JournalForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadEntries(uid: string) {
    setLoading(true);
    setError("");
    try {
      const data = await getJournalForUser(uid);
      setEntries(data as JournalRecord[]);
    } catch {
      setError("Unable to load your journal entries. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      return;
    }
    void Promise.resolve().then(() => loadEntries(user.uid));
  }, [authLoading, user]);

  const filteredEntries = useMemo(() => entries.filter((entry) => {
    const term = query.toLowerCase().trim();
    if (!term) return true;
    return [entry.concern, entry.notes, entry.products].join(" ").toLowerCase().includes(term);
  }), [entries, query]);

  async function handleSaveEntry() {
    if (!user || saving) return;
    if (!form.notes.trim()) {
      setError("Add a short note before saving your check-in.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = { ...form, date: form.date || new Date().toISOString().slice(0, 10) };
      if (editingId) {
        const updated = await updateJournalEntryForUser(user.uid, editingId, payload);
        setEntries((current) => current.map((entry) => entry.id === editingId ? { ...entry, ...updated } as JournalRecord : entry));
      } else {
        const created = await saveJournalEntryForUser(user.uid, payload);
        setEntries((current) => [created as JournalRecord, ...current]);
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setError("Unable to save this journal entry. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEntry(id: string) {
    if (!user || saving) return;
    setSaving(true);
    setError("");
    try {
      await deleteJournalEntryForUser(user.uid, id);
      setEntries((current) => current.filter((entry) => entry.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch {
      setError("Unable to delete this journal entry. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(entry: JournalRecord) {
    setEditingId(entry.id);
    setForm({ date: entry.date || "", concern: entry.concern, notes: entry.notes, products: entry.products, rating: entry.rating });
  }

  if (authLoading || !user) {
    return <SiteShell><div className="container-shell py-16 text-center text-slate-500">{authLoading ? "Loading your account..." : "Please sign in to use your journal."}</div></SiteShell>;
  }

  return (
    <SiteShell>
      <div className="container-shell py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#2b8a6b]">Journal</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Track skin changes over time</h1>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3 size-4 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entries" className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          </div>
        </div>

        {error && <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="card-surface rounded-[2rem] p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3"><Plus className="size-5 text-[#2b8a6b]" /><h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{editingId ? "Edit entry" : "Add entry"}</h2></div>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} aria-label="Cancel editing" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="size-4" /></button>}
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date<input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" /></label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Concern<select value={form.concern} onChange={(event) => setForm((current) => ({ ...current, concern: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"><option>Dryness</option><option>Acne</option><option>Redness</option><option>Sensitivity</option><option>Texture</option><option>General check-in</option></select></label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notes<textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" placeholder="How did your skin feel today?" /></label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Products used<input value={form.products} onChange={(event) => setForm((current) => ({ ...current, products: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" placeholder="Gentle cleanser, moisturizer" /></label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Rating<input type="range" min={1} max={5} value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))} className="mt-2 w-full" /><span className="text-sm text-slate-500">{form.rating}/5</span></label>
            </div>
            <button type="button" onClick={handleSaveEntry} disabled={saving} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2b8a6b] px-5 py-3 font-semibold text-white disabled:opacity-70"><BookOpen className="size-4" />{saving ? "Saving..." : editingId ? "Update journal entry" : "Save journal entry"}</button>
          </div>

          <div className="card-surface rounded-[2rem] p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent entries</h2>
            {loading ? <div className="mt-6 flex items-center gap-3 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" /> Loading journal entries...</div> : filteredEntries.length === 0 ? <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900">No journal entries yet. Add your first check-in.</div> : <div className="mt-6 space-y-4">{filteredEntries.map((entry) => <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"><div className="flex items-center justify-between gap-2"><p className="font-semibold text-slate-900 dark:text-slate-100">{entry.concern}</p><div className="flex gap-2"><button type="button" onClick={() => startEditing(entry)} aria-label="Edit journal entry" className="rounded-full bg-white p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-200"><Pencil className="size-4" /></button><button type="button" onClick={() => handleDeleteEntry(entry.id)} aria-label="Delete journal entry" className="rounded-full bg-white p-2 text-red-500 dark:bg-slate-800"><Trash2 className="size-4" /></button></div></div><p className="mt-2 text-sm text-slate-500">{formatDate(entry.createdAt, entry.date)}</p><p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{entry.notes}</p><div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400"><span>{entry.products}</span><span>{entry.rating}/5</span></div></div>)}</div>}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
