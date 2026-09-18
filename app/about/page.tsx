import { SiteShell } from "@/components/site-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="container-shell py-10">
        <div className="card-surface rounded-[2rem] p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#2b8a6b]">How it works</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">A step-by-step educational wellness flow</h1>
          <div className="mt-8 space-y-5 text-slate-700">
            <p>User → skin image + questionnaire</p>
            <p>AI observation → structured, cautious analysis</p>
            <p>Safety & knowledge layer → deterministic filtering and contextual education</p>
            <p>Guidance → results, journal, product education, and professional referrals when needed</p>
          </div>
          <p className="mt-6 text-slate-600">
            DermaSense keeps AI and deterministic safety rules separate. The AI suggests preliminary observations, while the structured knowledge layer and safety rules help filter recommendations and emphasize educational guidance.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
