"use client";

import { motion } from "framer-motion";
import { Activity, Database, ShieldCheck, Zap, HardDrive } from "lucide-react";

interface Service {
  label: string;
  status: "online" | "degraded" | "offline";
  latency?: string;
  icon: any;
}

const SERVICES: Service[] = [
  { label: "PostgreSQL", status: "online", latency: "12ms", icon: Database },
  { label: "Auth", status: "online", latency: "8ms", icon: ShieldCheck },
  { label: "Storage", status: "online", latency: "20ms", icon: HardDrive },
  { label: "Realtime", status: "online", latency: "5ms", icon: Zap },
];

const STATUS_CONFIG = {
  online: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "Operativo",
  },
  degraded: {
    dot: "bg-amber-500",
    bg: "bg-amber-500/5",
    border: "border-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    label: "Lento",
  },
  offline: {
    dot: "bg-red-500",
    bg: "bg-red-500/5",
    border: "border-red-500/10",
    text: "text-red-600 dark:text-red-400",
    label: "Caído",
  },
};

export function ServiceGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {SERVICES.map((svc, i) => {
        const cfg = STATUS_CONFIG[svc.status];
        const Icon = svc.icon;

        return (
          <motion.div
            key={svc.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl border ${cfg.border} ${cfg.bg} p-4 transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`p-2 rounded-lg bg-white dark:bg-slate-900 border ${cfg.border} shadow-sm`}
              >
                <Icon size={14} className={cfg.text} />
              </div>
              <div className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.dot}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`}
                ></span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">
                {svc.label}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black ${cfg.text}`}>
                  {cfg.label}
                </span>
                <span className="text-[10px] font-mono font-medium text-slate-400">
                  {svc.latency}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
