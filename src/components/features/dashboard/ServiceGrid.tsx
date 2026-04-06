"use client";

import { motion } from "framer-motion";

interface Service {
  label: string;
  status: "online" | "degraded" | "offline";
  latency?: string;
}

const SERVICES: Service[] = [
  { label: "PostgreSQL", status: "online", latency: "~12ms" },
  { label: "Auth", status: "online", latency: "~8ms" },
  { label: "Storage", status: "online", latency: "~20ms" },
  { label: "Realtime", status: "online", latency: "~5ms" },
];

const STATUS_CONFIG = {
  online: {
    dot: "bg-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "Online",
  },
  degraded: {
    dot: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    label: "Degraded",
  },
  offline: {
    dot: "bg-red-400",
    text: "text-red-600 dark:text-red-400",
    label: "Offline",
  },
};

export function ServiceGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SERVICES.map((svc, i) => {
        const cfg = STATUS_CONFIG[svc.status];
        return (
          <motion.div
            key={svc.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            // Usa --border como fondo de track y borde
            className="rounded-xl bg-[var(--border)] border border-[var(--border)] p-3.5 flex flex-col gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--foreground)] opacity-50 uppercase tracking-wider">
                {svc.label}
              </span>
              <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
            </div>
            <div>
              <span className={`text-xs font-semibold ${cfg.text}`}>
                {cfg.label}
              </span>
              {svc.latency && (
                <p className="text-[10px] text-[var(--foreground)] opacity-30 mt-0.5">
                  {svc.latency}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
