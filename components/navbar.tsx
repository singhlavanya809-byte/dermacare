"use client";

import Link from "next/link";
import { Menu, MoonStar, Sparkles, SunMedium, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/skin-analysis", label: "Skin Analysis" },
  { href: "/journal", label: "Journal" },
  { href: "/products", label: "Products" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/dermatologists", label: "Dermatologists" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, demoMode } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold text-slate-900 dark:text-slate-100">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-[#dff6ee] text-[#2b8a6b] shadow-sm dark:bg-[#12321f] dark:text-[#b8f0d0]">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-lg">DermaSense</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Skin wellness</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isDark ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
          </button>
          {user ? (
            <>
              <span className="rounded-full bg-[#dff6ee] px-3 py-1 text-xs font-medium text-[#205b4d] dark:bg-[#12321f] dark:text-[#b8f0d0]">
                {user.displayName ?? user.email.split("@")[0]}
              </span>
              <button
                onClick={() => logout()}
                className="rounded-full bg-[#12271f] px-4 py-2 text-sm font-medium text-white dark:bg-[#dff6ee] dark:text-[#12271f]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                Login
              </Link>
              <Link href="/signup" className="rounded-full bg-[#2b8a6b] px-4 py-2 text-sm font-medium text-white dark:bg-[#3ec49a] dark:text-slate-950">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="container-shell flex flex-col gap-3 py-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="mt-1 flex items-center justify-between rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <span>{isDark ? "Light mode" : "Dark mode"}</span>
              {isDark ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
            </button>
            {user ? (
              <button onClick={() => logout()} className="mt-2 rounded-full bg-[#12271f] px-4 py-2 text-sm font-medium text-white dark:bg-[#dff6ee] dark:text-[#12271f]">
                Logout
              </button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link href="/login" className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
                  Login
                </Link>
                <Link href="/signup" className="flex-1 rounded-full bg-[#2b8a6b] px-4 py-2 text-center text-sm font-medium text-white dark:bg-[#3ec49a] dark:text-slate-950">
                  Sign up
                </Link>
              </div>
            )}
            {demoMode && (
              <span className="rounded-full bg-[#fff0e9] px-3 py-2 text-xs font-medium text-[#9a5639] dark:bg-[#2b1d12] dark:text-[#f9c8a2]">
                Demo Mode active
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
