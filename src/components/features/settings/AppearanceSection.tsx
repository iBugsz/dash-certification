"use client";

import { Palette } from "lucide-react";
import { Section } from "./Section";

interface Props {
  theme: string | undefined;
  setTheme: (v: string) => void;
  mounted: boolean;
}

const THEMES = [
  {
    key: "light",
    label: "Claro",
    themeCls: "bg-slate-50 text-slate-900",
  },
  {
    key: "dark",
    label: "Oscuro",
    themeCls: "bg-slate-900 text-slate-100",
  },
  {
    key: "system",
    label: "Sistema",
    themeCls:
      "bg-gradient-to-r from-slate-100 via-slate-100 to-slate-800 text-slate-900",
  },
] as const;

export function AppearanceSection({ theme, setTheme, mounted }: Props) {
  return (
    <Section
      icon={<Palette size={17} />}
      iconBg="bg-amber-100 dark:bg-amber-950/40"
      iconColor="text-amber-500 dark:text-amber-400"
      title="Apariencia"
    >
      <p className="text-[12px] text-slate-400 dark:text-slate-500 mb-6">
        Personaliza el estilo visual de tu panel de control.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {THEMES.map(({ key, label, themeCls }) => {
          const active = mounted && theme === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setTheme(key)}
              className="group flex flex-col gap-3 outline-none cursor-pointer"
            >
              <div
                className={`relative w-full aspect-[16/10] rounded-2xl border-2 transition-all duration-200 overflow-hidden p-3 flex flex-col gap-2
                  ${
                    active
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20 shadow-md scale-[1.02]"
                      : "border-[var(--border)] hover:border-slate-300 dark:hover:border-slate-600 bg-[var(--card)]"
                  } ${themeCls}`}
              >
                <div className="flex items-center gap-2 opacity-20">
                  <div className="h-2 w-2 rounded-full bg-current" />
                  <div className="h-1.5 w-12 rounded-full bg-current" />
                </div>
                <div className="flex gap-2 h-full mt-1">
                  <div className="w-4 h-full border-r border-current/5 flex flex-col gap-1.5 opacity-10">
                    <div className="h-1 w-full bg-current rounded-full" />
                    <div className="h-1 w-full bg-current rounded-full" />
                    <div className="h-1 w-full bg-current rounded-full" />
                  </div>
                  <div className="flex-1 flex flex-col gap-2 opacity-10">
                    <div className="h-1.5 w-2/3 bg-current rounded-full" />
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-6 w-full bg-current rounded-lg" />
                      <div className="h-6 w-full bg-current rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>

              <span
                className={`text-[13px] font-medium text-center transition-colors ${
                  active
                    ? "text-[var(--accent)]"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}
