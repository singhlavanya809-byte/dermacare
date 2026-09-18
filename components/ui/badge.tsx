export function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "success" | "warn" | "muted" }) {
  const tones = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-[#dff6ee] text-[#1f5d49]",
    warn: "bg-[#fff0e9] text-[#8c4d2f]",
    muted: "bg-slate-50 text-slate-500",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
