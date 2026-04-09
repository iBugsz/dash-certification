"use client";

import { Bell } from "lucide-react";
import { Section } from "./Section";

interface Props {
  notifEmail: boolean;
  setNotifEmail: (v: boolean) => void;
  notifGeneracion: boolean;
  setNotifGeneracion: (v: boolean) => void;
  notifErrores: boolean;
  setNotifErrores: (v: boolean) => void;
}

export function NotificationsSection({
  notifEmail,
  setNotifEmail,
  notifGeneracion,
  setNotifGeneracion,
  notifErrores,
  setNotifErrores,
}: Props) {
  const items = [
    {
      label: "Notificaciones por email",
      sub: "Recibe alertas importantes en tu correo",
      val: notifEmail,
      set: setNotifEmail,
    },
    {
      label: "Generación de certificados",
      sub: "Aviso cuando un lote termine de generarse",
      val: notifGeneracion,
      set: setNotifGeneracion,
    },
    {
      label: "Alertas de errores",
      sub: "Notificación cuando hay fallos en el proceso",
      val: notifErrores,
      set: setNotifErrores,
    },
  ];

  return (
    <Section
      icon={<Bell size={17} />}
      iconBg="bg-pink-100 dark:bg-pink-950/40"
      iconColor="text-pink-500 dark:text-pink-400"
      title="Notificaciones"
    >
      <div className="space-y-3">
        {items.map(({ label, sub, val, set }) => (
          <div
            key={label}
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border)]"
          >
            <div>
              <p className="text-[13px] font-medium text-slate-700 dark:text-slate-200">
                {label}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {sub}
              </p>
            </div>

            {/* Switch corregido */}
            <button
              onClick={() => set(!val)}
              className={`relative flex items-center w-10 h-5.5 rounded-full px-1 transition-colors duration-200 outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                val ? "bg-[var(--accent)]" : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                  val ? "translate-x-4.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}
