"use client";

import { motion } from "framer-motion";

const WEEKLY_DATA = [
  { day: "L", value: 45 },
  { day: "M", value: 78 },
  { day: "X", value: 32 },
  { day: "J", value: 91 },
  { day: "V", value: 64 },
  { day: "S", value: 18 },
  { day: "D", value: 27 },
];

const MAX_VALUE = Math.max(...WEEKLY_DATA.map((d) => d.value));

interface MiniBarChartProps {
  color?: string;
}

export function MiniBarChart({ color = "#6366f1" }: MiniBarChartProps) {
  return (
    <div className="flex items-end justify-between gap-1.5 h-16 px-1">
      {WEEKLY_DATA.map((d, i) => {
        const heightPct = (d.value / MAX_VALUE) * 100;
        return (
          <div
            key={d.day}
            className="flex-1 flex flex-col items-center gap-1.5 group"
          >
            <div className="relative w-full flex items-end justify-center h-12">
              {/* Track de fondo usa --border */}
              <div className="absolute inset-x-0 bottom-0 top-0 bg-[var(--border)] rounded-t-md" />
              <motion.div
                className="relative w-full rounded-t-md z-10"
                style={{ backgroundColor: color }}
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
              />
              {/* Tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--card)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[9px] text-[var(--foreground)] font-bold whitespace-nowrap z-20 shadow-sm">
                {d.value}
              </div>
            </div>
            <span className="text-[9px] text-[var(--foreground)] opacity-30 font-medium">
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
