"use client";

import { motion } from "framer-motion";
import { Building2, FileText, Zap, ChevronRight } from "lucide-react";

interface StatsOverviewProps {
  companies: number;
  templates: number;
  generations: number;
}

export function StatsOverviewCard({
  companies,
  templates,
  generations,
}: StatsOverviewProps) {
  const stats = [
    {
      label: "Empresas",
      value: companies,
      icon: Building2,
      color: "#6366f1",
      light: "rgba(99, 102, 241, 0.1)",
    },
    {
      label: "Plantillas",
      value: templates,
      icon: FileText,
      color: "#10b981",
      light: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Generaciones",
      value: generations,
      icon: Zap,
      color: "#f59e0b",
      light: "rgba(245, 158, 11, 0.1)",
    },
  ];

  const total = companies + templates + generations;

  return (
    <motion.div className="stats-card-minimal">
      <div className="flex justify-between items-center mb-6">
        <span className="stats-title-light">Resumen de Activos</span>
        <ChevronRight size={14} className="text-slate-300" />
      </div>

      <div className="space-y-5">
        {stats.map((stat, index) => {
          const pct = total > 0 ? Math.round((stat.value / total) * 100) : 0;

          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Icono pequeño y sobrio */}
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: stat.light, color: stat.color }}
                >
                  <stat.icon size={14} strokeWidth={2} />
                </div>

                <div>
                  <p className="stat-label-clean">{stat.label}</p>
                  <p className="stat-value-clean">{stat.value}</p>
                </div>
              </div>

              {/* Badge de porcentaje minimalista */}
              <span
                className="stat-pct-minimal"
                style={{ backgroundColor: stat.light, color: stat.color }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Barra de progreso inferior muy delgada */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold uppercase">Productividad</span>
        </div>
        <div className="h-1 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden flex gap-0.5">
          <div
            className="h-full bg-indigo-500"
            style={{ width: `${(companies / total) * 100}%` }}
          />
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${(templates / total) * 100}%` }}
          />
          <div
            className="h-full bg-amber-500"
            style={{ width: `${(generations / total) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
