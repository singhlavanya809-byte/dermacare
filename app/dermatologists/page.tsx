import { AlertTriangle, CalendarCheck, CheckCircle2, ShieldAlert } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

const careSignals = [
  "A spot, rash, or change is persistent, spreading, painful, or repeatedly irritated.",
  "You notice bleeding, a non-healing area, sudden changes, or signs of infection.",
  "Over-the-counter products have not helped, or a reaction is severe or worsening.",
];

export default function DermatologistsPage() {
  return (
    <SiteShell>
      <div className="container-shell py-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#2b8a6b]">Professional care</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Know when to involve a dermatologist</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            DermaSense provides educational skin wellness insights. It does not diagnose conditions or replace a qualified healthcare professional.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="card-surface rounded-[2rem] p-6" aria-labelledby="signals-heading">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-[#b45b2b]" />
              <h2 id="signals-heading" className="text-xl font-bold text-slate-900 dark:text-slate-100">Consider professional care when</h2>
            </div>
            <ul className="mt-6 space-y-4">
              {careSignals.map((signal) => (
                <li key={signal} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#2b8a6b]" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-surface rounded-[2rem] p-6" aria-labelledby="find-heading">
            <div className="flex items-center gap-3">
              <CalendarCheck className="size-5 text-[#2b8a6b]" />
              <h2 id="find-heading" className="text-xl font-bold text-slate-900 dark:text-slate-100">Finding a provider</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Live provider search is not configured in this application. To find care, use your insurance directory, a local hospital or health-system directory, or a licensed professional referral service.
            </p>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              No doctors, clinics, addresses, phone numbers, or map locations are fabricated here. Verify licensing, availability, and emergency instructions through the provider’s official source.
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[2rem] border border-amber-200 bg-[#fff9eb] p-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100" aria-label="Safety guidance">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0" />
            <div>
              <h2 className="font-bold">Urgent symptoms need urgent care</h2>
              <p className="mt-2 text-sm leading-6">For severe allergic reactions, breathing difficulty, rapidly worsening swelling, or other emergencies, contact local emergency services rather than relying on this app.</p>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
