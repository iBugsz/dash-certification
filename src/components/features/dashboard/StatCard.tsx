"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent: string; // ej. "from-violet-500 to-indigo-600"
  delay?: number;
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      // bg-[var(--card)] + border-[var(--border)] → respeta light y dark
      className="relative overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 flex flex-col gap-4 group transition-colors"
    >
      {/* Glow de acento — solo decorativo, no afecta el fondo base */}
      <div
        className={`absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground)] opacity-40">
          {label}
        </span>
        <div
          className={`h-8 w-8 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-md`}
        >
          <Icon size={15} className="text-white" />
        </div>
      </div>

      <div>
        <p className="text-3xl font-black text-[var(--foreground)] tracking-tight leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-[var(--foreground)] opacity-40 mt-1.5">
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}
