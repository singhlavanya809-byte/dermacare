"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, HeartPulse, ShieldCheck, Sparkles, Stethoscope, SunMedium } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site-shell";

const features = [
  "AI-powered visual observations with questionnaire context",
  "Deterministic skincare safety layer and educational references",
  "Journal tracking, environment context, and progress insights",
];

const steps = [
  { title: "1. Upload + questionnaire", text: "Add a photo and details about your skin type and concerns." },
  { title: "2. Guided analysis", text: "DermaSense combines image context with your care history and routine." },
  { title: "3. Education + safety", text: "Get structured notes, references, and warnings before exploring remedies." },
];

export default function HomePage() {
  return (
    <SiteShell>
      <div className="container-shell pb-16 pt-10">
        <section className="grid items-center gap-12 py-8 md:grid-cols-[1.2fr_0.8fr] md:py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cfeadf] bg-[#f2fbf7] px-3 py-2 text-sm font-medium text-[#215845]">
              <Sparkles className="size-4" />
              DermaSense — Understand your skin. Care for it better.
            </div>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
                AI-powered skincare guidance built for everyday confidence.
              </h1>
              <p className="max-w-lg text-lg text-slate-600">
                DermaSense combines a skin image, personal questionnaire context, educational skincare knowledge, and safety filtering so you can explore patterns with clarity and caution.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/skin-analysis" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2b8a6b] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-[#236d58]">
                Analyze My Skin <ArrowRight className="size-4" />
              </Link>
              <Link href="/derma-care" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700">
                Explore Derma Care
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-[#2b8a6b]" /> Educational only</span>
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#2b8a6b]" /> Safety filtered</span>
              <span className="flex items-center gap-2"><HeartPulse className="size-4 text-[#2b8a6b]" /> Personalized tracking</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="soft-gradient card-surface rounded-[2rem] p-6">
            <div className="rounded-[1.5rem] bg-white/80 p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Skin wellness snapshot</p>
                  <h2 className="text-2xl font-bold">Illustrative score</h2>
                </div>
                <div className="rounded-full bg-[#dff6ee] px-3 py-1 text-sm font-semibold text-[#1c5c4b]">82/100</div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-600"><span>Hydration</span><span>84%</span></div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-[84%] rounded-full bg-[#2b8a6b]" /></div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-600"><span>Barrier comfort</span><span>75%</span></div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-[75%] rounded-full bg-[#8ac7af]" /></div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm text-slate-600"><span>Consistency</span><span>90%</span></div>
                  <div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-[90%] rounded-full bg-[#ffb38d]" /></div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-[#f8faf9] p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Educational note</p>
                <p className="mt-2">This score is illustrative and not a clinical measurement.</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="card-surface rounded-3xl p-5 text-slate-700">
              <div className="mb-3 inline-flex rounded-full bg-[#ecf9f4] p-2 text-[#2b8a6b]"><BrainCircuit className="size-4" /></div>
              <p>{feature}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 py-12 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.title} className="card-surface rounded-3xl p-6">
              <p className="text-sm font-semibold text-[#2b8a6b]">{item.title}</p>
              <p className="mt-3 text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-10 py-12 md:grid-cols-2">
          <div className="card-surface rounded-[2rem] p-8">
            <div className="flex items-center gap-3 text-[#2b8a6b]"><Stethoscope className="size-5" /> <span className="font-semibold">Safety-first approach</span></div>
            <h3 className="mt-5 text-2xl font-bold">Educational guidance with protective rules</h3>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>• Structured reminders for when to seek a dermatologist.</li>
              <li>• Safety filtering for ingredients, irritation, open wounds, and more.</li>
              <li>• No diagnosis claims or prescription recommendations.</li>
            </ul>
          </div>
          <div className="card-surface rounded-[2rem] p-8">
            <div className="flex items-center gap-3 text-[#2b8a6b]"><SunMedium className="size-5" /> <span className="font-semibold">Why DermaSense</span></div>
            <h3 className="mt-5 text-2xl font-bold">Realistic wellness support for the everyday user</h3>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>• Journal for patterns across weeks and seasons.</li>
              <li>• Weather/environment prompts that explain skin-feeling changes.</li>
              <li>• Dermatologist finder and ingredient education for informed decisions.</li>
            </ul>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
