"use client";

import { motion } from "framer-motion";
import { Zap, AlertTriangle } from "lucide-react";

interface Props {
  used: number;
  limit: number;
}

export function AdobeQuotaCard({ used, limit }: Props) {
  const remaining = limit - used;
  const percentage = Math.min((used / limit) * 100, 100);

  const color =
    percentage >= 90 ? "#ef4444" : percentage >= 70 ? "#f59e0b" : "#6366f1";

  const statusLabel =
    percentage >= 90 ? "Crítico" : percentage >= 70 ? "Elevado" : "Normal";

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center"
            style={{ background: `${color}20` }}
          >
            <Zap size={14} style={{ color }} />
          </div>
          <span className="text-sm font-semibold text-[var(--foreground)]">
            Adobe PDF Services
          </span>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: `${color}15`, color }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Números grandes */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-4xl font-black tracking-tight text-[var(--foreground)]">
            {used}
          </span>
          <span className="text-sm text-[var(--foreground)] opacity-40 ml-1">
            / {limit}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-[var(--foreground)] opacity-60">
            {remaining} restantes
          </p>
          <p className="text-[10px] text-[var(--foreground)] opacity-30">
            1 PDF = 1 crédito
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="h-2.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <motion.div
          className="h-2.5 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      {/* Porcentaje */}
      <div className="flex justify-between items-center -mt-2">
        <span className="text-[10px] text-[var(--foreground)] opacity-30">
          0
        </span>
        <span className="text-[10px] font-bold" style={{ color }}>
          {percentage.toFixed(1)}% usado
        </span>
        <span className="text-[10px] text-[var(--foreground)] opacity-30">
          {limit}
        </span>
      </div>

      {/* Alerta si supera 70% */}
      {percentage >= 70 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium"
          style={{ background: `${color}12`, color }}
        >
          <AlertTriangle size={11} />
          {percentage >= 90
            ? `¡Solo quedan ${remaining} créditos! Considera renovar.`
            : `Llevas el ${percentage.toFixed(0)}% de tu cuota total.`}
        </motion.div>
      )}
    </div>
  );
}
