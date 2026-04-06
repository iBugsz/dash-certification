"use client";

import { motion } from "framer-motion";
import { Folder } from "lucide-react";
import { BucketStat } from "@/hooks/useDashboardData";
import { formatBytes, pct } from "@/lib/dashboard/utils";

const BUCKET_COLORS: Record<string, string> = {
  templates: "#6366f1",
  logos: "#22d3ee",
  generated: "#a78bfa",
  catalogs: "#34d399",
};

interface BucketBarsProps {
  buckets: BucketStat[];
  totalLimit: number;
}

export function BucketBars({ buckets, totalLimit }: BucketBarsProps) {
  return (
    <div className="space-y-3">
      {buckets.map((b, i) => {
        const color = BUCKET_COLORS[b.bucket] ?? "#94a3b8";
        const percentage = pct(b.used_bytes, totalLimit);

        return (
          <motion.div
            key={b.bucket}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 + 0.3, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            {/* Ícono con color de acento pero fondo semi-transparente */}
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}18` }}
            >
              <Folder size={13} style={{ color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-mono font-semibold text-[var(--foreground)] opacity-70">
                  {b.bucket}
                </span>
                <span className="text-[10px] text-[var(--foreground)] opacity-40">
                  {b.file_count} archivo{b.file_count !== 1 ? "s" : ""} ·{" "}
                  {formatBytes(b.used_bytes)}
                </span>
              </div>

              {/* Track usa --border para adaptarse al tema */}
              <div className="w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      b.used_bytes === 0
                        ? "0%"
                        : `${Math.max(percentage, 0.5)}%`,
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.08 + 0.4,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
