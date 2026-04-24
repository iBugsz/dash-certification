"use client";

import { motion } from "framer-motion";
import { Folder } from "lucide-react";
import { BucketStat } from "@/hooks/useDashboardData";
import { formatBytes } from "@/lib/dashboard/utils";

const BUCKET_COLORS: Record<string, string> = {
  templates: "#6366f1",
  logos: "#22d3ee",
  generated: "#a78bfa",
  catalogs: "#34d399",
};

export function BucketBars({ buckets }: { buckets: BucketStat[] }) {
  return (
    <div className="space-y-2">
      {buckets.map((b, i) => {
        const color = BUCKET_COLORS[b.bucket] ?? "#94a3b8";
        return (
          <motion.div
            key={b.bucket}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 shadow-sm hover:border-slate-200 dark:hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
              >
                <Folder size={14} style={{ color }} fill={`${color}20`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                  {b.bucket}
                </p>
                <p className="text-[9px] font-bold text-slate-400">
                  {b.file_count} archivos
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">
              {formatBytes(b.used_bytes)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
