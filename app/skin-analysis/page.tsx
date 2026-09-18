"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, CheckCircle2, ChevronRight, Loader2, RefreshCcw, Save, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { SiteShell } from "@/components/site-shell";
import { analyzeSkin } from "@/lib/api/services";
import { saveAnalysisRecord } from "@/lib/firebase/firestore";
import { getRemedyById } from "@/lib/knowledge/dermaCare";
import type { AnalysisResult } from "@/types";

const formDefaults = {
  ageRange: "18-24",
  skinType: "Combination",
  mainConcern: "Dryness",
  duration: "2-4 weeks",
  routine: "Gentle cleanser, moisturizer, sunscreen",
  sensitivities: "Fragrance",
  products: "Ceramide moisturizer, niacinamide serums",
};

export default function SkinAnalysisPage() {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [form, setForm] = useState(formDefaults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [savingAnalysis, setSavingAnalysis] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [analysisSaved, setAnalysisSaved] = useState(false);

  function updateForm(key: keyof typeof formDefaults, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onImageChange(file: File | null) {
    if (!file) {
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Please upload an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
    setImageError("");
  }

  function continueFromImageStep() {
    if (!imagePreview) {
      setImageError("Upload a face or skin image before continuing.");
      return;
    }
    setStep(2);
  }

  function continueFromQuestionnaire() {
    const requiredFields: Array<keyof typeof formDefaults> = ["ageRange", "skinType", "mainConcern", "duration", "routine", "sensitivities", "products"];
    if (requiredFields.some((field) => !form[field].trim())) {
      setError("Complete every questionnaire field before continuing.");
      return;
    }
    setError("");
    setStep(3);
  }

  function startNewAnalysis() {
    setStep(1);
    setImagePreview(null);
    setImageError("");
    setError("");
    setResult(null);
    setSaveError("");
    setSaveSuccess("");
    setAnalysisSaved(false);
  }

  async function onSubmit() {
    setLoading(true);
    setError("");
    try {
      const payload = {
        uid: user?.uid,
        imageDataUrl: imagePreview ?? undefined,
        ...form,
      };
      const response = await analyzeSkin(payload);
      setResult(response.analysis);
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze your skin.");
    } finally {
      setLoading(false);
    }
  }

  const currentReference = result?.selectedReferences?.[0] ? getRemedyById(result.selectedReferences[0].id) : null;

  async function handleSaveAnalysis() {
    if (authLoading) {
      setSaveError("Waiting for Firebase authentication to finish loading. Please try again shortly.");
      return;
    }

    if (!user) {
      setSaveError("Please sign in before saving an analysis.");
      return;
    }

    if (!result) {
      setSaveError("Run an analysis before saving your results.");
      return;
    }

    if (savingAnalysis || analysisSaved) {
      return;
    }

    setSavingAnalysis(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const payload = {
        userId: user.uid,
        analysisResult: result,
        skinConcerns: result.possibleCategories ?? [form.mainConcern],
        recommendations: result.generalCareConsiderations ?? [],
        questionnaire: form,
      };

      if (imagePreview) {
        Object.assign(payload, { hasImage: true });
      }

      await saveAnalysisRecord(user.uid, payload);
      setSaveSuccess("Analysis saved to your account.");
      setAnalysisSaved(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save analysis.";
      setSaveError(message);
    } finally {
      setSavingAnalysis(false);
    }
  }

  return (
    <SiteShell>
      <div className="container-shell py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#2b8a6b]">Skin Analysis</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Evaluate your skin with context</h1>
          </div>
          <Link href="/dashboard" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${step === item ? "bg-[#2b8a6b] text-white" : "bg-slate-100 text-slate-500"}`}>
              {item}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card-surface rounded-[2rem] p-8">
            <div className="mb-6 flex items-center gap-3 text-[#2b8a6b]">
              <Camera className="size-5" />
              <h2 className="text-2xl font-bold text-slate-900">Step 1: Upload skin image</h2>
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Camera className="mb-4 size-10 text-slate-400" />
              <span className="text-lg font-semibold text-slate-700">Choose image</span>
              <span className="mt-2 text-sm text-slate-500">PNG, JPG, or WEBP up to 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImageChange(e.target.files?.[0] ?? null)} />
            </label>
            {imageError && <p className="mt-4 text-sm font-medium text-red-600">{imageError}</p>}
            {imagePreview && (
              <div className="mt-6">
                <Image src={imagePreview} alt="Skin preview" width={640} height={480} unoptimized className="max-h-72 rounded-2xl object-cover" />
                <button onClick={() => setImagePreview(null)} className="mt-3 text-sm font-medium text-red-600">Remove image</button>
              </div>
            )}
            <div className="mt-8 flex justify-end">
              <button onClick={continueFromImageStep} className="inline-flex items-center gap-2 rounded-full bg-[#2b8a6b] px-5 py-3 font-semibold text-white">
                Next <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card-surface rounded-[2rem] p-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Step 2: Complete the questionnaire</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Age range
                <select value={form.ageRange} onChange={(e) => updateForm("ageRange", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55+</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Skin type
                <select value={form.skinType} onChange={(e) => updateForm("skinType", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <option>Combination</option>
                  <option>Dry</option>
                  <option>Oily</option>
                  <option>Normal</option>
                  <option>Sensitive</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Main concern
                <select value={form.mainConcern} onChange={(e) => updateForm("mainConcern", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <option>Dryness</option>
                  <option>Acne</option>
                  <option>Sensitivity</option>
                  <option>Redness</option>
                  <option>Texture</option>
                  <option>Pigmentation</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Duration
                <select value={form.duration} onChange={(e) => updateForm("duration", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <option>Less than 2 weeks</option>
                  <option>2-4 weeks</option>
                  <option>1-3 months</option>
                  <option>3+ months</option>
                </select>
              </label>
              <label className="md:col-span-2 text-sm font-medium text-slate-700">
                Current skincare routine
                <input value={form.routine} onChange={(e) => updateForm("routine", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
              <label className="md:col-span-2 text-sm font-medium text-slate-700">
                Known sensitivities or allergies
                <input value={form.sensitivities} onChange={(e) => updateForm("sensitivities", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
              <label className="md:col-span-2 text-sm font-medium text-slate-700">
                Products currently used
                <input value={form.products} onChange={(e) => updateForm("products", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">Back</button>
              <button onClick={continueFromQuestionnaire} className="inline-flex items-center gap-2 rounded-full bg-[#2b8a6b] px-5 py-3 font-semibold text-white">Review <ChevronRight className="size-4" /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card-surface rounded-[2rem] p-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Step 3: Review information</h2>
            <div className="rounded-3xl bg-slate-50 p-5">
              <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-slate-700">{JSON.stringify({ imagePreview: !!imagePreview, ...form }, null, 2)}</pre>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">Back</button>
              <button onClick={() => setStep(4)} className="inline-flex items-center gap-2 rounded-full bg-[#2b8a6b] px-5 py-3 font-semibold text-white">Analyze <ChevronRight className="size-4" /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card-surface rounded-[2rem] p-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Step 4: Begin analysis</h2>
            <div className="rounded-3xl bg-[#f5faf8] p-6 text-slate-700">
              <p className="text-lg font-medium">DermaSense will combine your image, questionnaire context, and a safety-aware knowledge layer to provide educational observations.</p>
            </div>
            {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(3)} className="rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">Back</button>
              <button onClick={onSubmit} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-[#2b8a6b] px-5 py-3 font-semibold text-white disabled:opacity-70">
                {loading ? <><Loader2 className="size-4 animate-spin" /> Processing...</> : <>Analyze skin <ChevronRight className="size-4" /></>}
              </button>
            </div>
          </div>
        )}

        {step === 5 && result && (
          <div className="space-y-6">
            <div className="card-surface rounded-[2rem] p-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-900">Step 5: Results</h2>
                <div className="rounded-full bg-[#dff6ee] px-3 py-1 text-xs font-medium text-[#1f5d49]">{result.confidence?.toUpperCase() || "Moderate"} confidence</div>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Preliminary observation</p>
                  <ul className="mt-4 space-y-3">
                    {result.observations?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-slate-700"><CheckCircle2 className="mt-0.5 size-4 text-[#2b8a6b]" /> {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Possible categories</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.possibleCategories?.map((item: string) => (
                      <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card-surface rounded-[2rem] p-8">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Educational explanation</p>
                <p className="mt-4 text-slate-700">{result.educationalExplanation}</p>

                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">General care considerations</p>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {result.generalCareConsiderations?.map((item: string) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="card-surface rounded-[2rem] p-8">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Professional-care indicators</p>
                <ul className="mt-4 space-y-2 text-slate-700">
                  {result.professionalCareIndicators?.map((item: string) => <li key={item}>• {item}</li>)}
                </ul>
                <div className="mt-6 rounded-2xl bg-[#fff0e9] p-4 text-sm text-[#8c4d2f]">
                  <p className="flex items-start gap-2"><ShieldAlert className="mt-0.5 size-4" /> DermaSense provides educational skin observations and general wellness information. It does not provide a medical diagnosis or replace professional medical advice.</p>
                </div>
              </div>
            </div>

            <div className="card-surface rounded-[2rem] p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Relevant Derma Care references</p>
              <div className="mt-5 space-y-4">
                {result.selectedReferences?.map((ref) => {
                  const remedy = getRemedyById(ref.id);
                  return (
                    <div key={ref.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-900">{ref.name}</p>
                      <p className="mt-2 text-sm text-slate-600">{ref.reason}</p>
                      {remedy && <p className="mt-2 text-sm text-slate-500">{remedy.safety}</p>}
                    </div>
                  );
                })}
              </div>
              {currentReference && (
                <div className="mt-6 rounded-2xl bg-[#f4f7f6] p-4">
                  <p className="font-semibold text-slate-900">Safety note</p>
                  <p className="mt-2 text-sm text-slate-600">{currentReference.safety}</p>
                </div>
              )}
            </div>

            <div className="card-surface rounded-[2rem] p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button onClick={startNewAnalysis} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">
                  <RefreshCcw className="size-4" /> Analyze Again
                </button>
                <button
                  onClick={handleSaveAnalysis}
                  disabled={authLoading || savingAnalysis || analysisSaved}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2b8a6b] px-5 py-3 font-semibold text-white disabled:opacity-70"
                >
                  <Save className="size-4" /> {savingAnalysis ? "Saving..." : analysisSaved ? "Saved" : "Save Analysis"}
                </button>
              </div>
              {saveSuccess && <p className="mt-3 text-sm font-medium text-[#1f5d49]">{saveSuccess}</p>}
              {saveError && <p className="mt-3 text-sm font-medium text-red-600">{saveError}</p>}
              <div className="mt-4 flex justify-end">
                <button onClick={() => setStep(6)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2b8a6b] px-5 py-3 font-semibold text-white">
                  Continue <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 6 && result && (
          <div className="card-surface rounded-[2rem] p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Step 6: Follow-up plan</h2>
              <div className="rounded-full bg-[#dff6ee] px-3 py-1 text-xs font-medium text-[#1f5d49]">Ready</div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Suggested next steps</p>
                <ul className="mt-4 space-y-3 text-slate-700">
                  {result.generalCareConsiderations?.slice(0, 3).map((item: string) => <li key={item}>• {item}</li>)}
                  <li>• Reassess after 2–4 weeks and document changes in your journal.</li>
                  <li>• Book a dermatologist consult if redness, irritation, or discomfort persists.</li>
                </ul>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Session summary</p>
                <dl className="mt-4 space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between gap-3"><dt>Skin type</dt><dd className="font-semibold text-slate-900">{form.skinType}</dd></div>
                  <div className="flex justify-between gap-3"><dt>Main concern</dt><dd className="font-semibold text-slate-900">{form.mainConcern}</dd></div>
                  <div className="flex justify-between gap-3"><dt>Confidence</dt><dd className="font-semibold text-slate-900">{result.confidence || "Moderate"}</dd></div>
                </dl>
              </div>
            </div>

            <div className="mt-8 flex justify-between gap-3">
              <button onClick={() => setStep(5)} className="rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">Back</button>
              <div className="flex gap-3">
                <Link href="/dashboard" className="rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">Dashboard</Link>
                <button onClick={() => setStep(1)} className="rounded-full bg-[#2b8a6b] px-5 py-3 font-semibold text-white">Start another check</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
