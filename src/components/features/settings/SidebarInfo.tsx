"use client";

import { Database, ShieldCheck } from "lucide-react";
import { Section } from "./Section";

interface Props {
  userId: string;
}

const SERVICES = [
  { name: "Supabase Auth", ok: true },
  { name: "PostgreSQL DB", ok: true },
  { name: "Storage", ok: true },
];

export function SidebarInfo({ userId }: Props) {
  return (
    <div className="space-y-6">
      {/* Servicios */}
      <Section
        icon={<Database size={17} />}
        iconBg="bg-emerald-100 dark:bg-emerald-950/40"
        iconColor="text-emerald-600 dark:text-emerald-400"
        title="Servicios"
      >
        <div className="space-y-3">
          {SERVICES.map(({ name, ok }) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck
                  size={14}
                  className={
                    ok
                      ? "text-emerald-500"
                      : "text-slate-300 dark:text-slate-600"
                  }
                />
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200">
                  {name}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  ok
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {ok ? "Online" : "Offline"}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Info de cuenta */}
      <section className="bg-[var(--card)] p-6 rounded-[24px] border border-[var(--border)] space-y-3">
        <h3 className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Información de cuenta
        </h3>
        <div className="space-y-2 text-[12px]">
          <div className="flex justify-between">
            <span className="text-slate-400">ID de usuario</span>
            <span
              className="text-slate-600 dark:text-slate-400 font-mono truncate max-w-[120px]"
              title={userId}
            >
              {userId.slice(0, 8)}…
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Plan</span>
            <span className="text-[var(--accent)] font-semibold">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Región DB</span>
            <span className="text-slate-600 dark:text-slate-400">
              sa-east-1
            </span>
          </div>
        </div>
      </section>

      {/* Zona de peligro */}
      <section className="bg-red-50 dark:bg-red-950/20 p-5 rounded-[24px] border border-red-200 dark:border-red-900/40">
        <h3 className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-2">
          Zona de peligro
        </h3>
        <p className="text-[11px] text-red-400 dark:text-red-500 mb-4">
          Esta acción es irreversible. Se eliminarán todos tus datos.
        </p>
        <button className="w-full py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 text-[12px] font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
          Eliminar cuenta
        </button>
      </section>
    </div>
  );
}
