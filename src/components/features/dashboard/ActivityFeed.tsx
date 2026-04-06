"use client";

import { motion } from "framer-motion";
import { FileCheck, Clock } from "lucide-react";

interface ActivityFeedProps {
  items: any[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--foreground)] opacity-30">
        <Clock size={28} className="mb-3" />
        <p className="text-sm">Sin actividad registrada</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--border)]">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 + 0.2, duration: 0.35 }}
          className="py-3.5 flex items-center gap-4 group"
        >
          <div className="h-9 w-9 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-ring)] flex items-center justify-center flex-shrink-0 group-hover:opacity-80 transition-opacity">
            <FileCheck size={16} className="text-[var(--accent)]" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)] truncate">
              {item.name}
            </p>
            <p className="text-xs text-[var(--foreground)] opacity-40 mt-0.5">
              {item.company?.name ?? "Sin empresa"} ·{" "}
              {new Date(item.created_at).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[var(--border)] text-[var(--foreground)] opacity-60 flex-shrink-0">
            DOCX
          </span>
        </motion.div>
      ))}
    </div>
  );
}
