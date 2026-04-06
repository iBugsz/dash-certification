"use client";

import { motion } from "framer-motion";
import { formatBytes, pct } from "@/lib/dashboard/utils";

interface DonutProps {
  label: string;
  usedBytes: number;
  limitBytes: number;
  color: string;
  delay?: number;
}

const R = 44;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function StorageDonut({
  label,
  usedBytes,
  limitBytes,
  color,
  delay = 0,
}: DonutProps) {
  const percentage = pct(usedBytes, limitBytes);
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
  const freeBytes = limitBytes - usedBytes;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative">
        {/* El track usa currentColor para adaptarse al tema via CSS */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="-rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            className="stroke-[var(--border)]"
            strokeWidth="10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: delay + 0.1, ease: "easeOut" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-[var(--foreground)] leading-none">
            {percentage}%
          </span>
          <span className="text-[9px] text-[var(--foreground)] opacity-40 uppercase tracking-wider mt-0.5">
            usado
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-bold text-[var(--foreground)] opacity-70">
          {label}
        </p>
        <p className="text-[11px] text-[var(--foreground)] opacity-40 mt-0.5">
          {formatBytes(usedBytes)} / {formatBytes(limitBytes)}
        </p>
        <p className="text-[10px] text-[var(--foreground)] opacity-30 mt-0.5">
          {formatBytes(freeBytes)} libres
        </p>
      </div>
    </motion.div>
  );
}
