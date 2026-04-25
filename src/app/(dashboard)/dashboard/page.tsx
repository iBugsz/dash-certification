"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Building2,
  FileCode2,
  Zap,
  ChevronUp,
  HardDrive,
  FileText,
} from "lucide-react";

import { useDashboardData } from "@/hooks/useDashboardData";
import { StorageDonut } from "@/components/features/dashboard/StorageDonut";
import { BucketBars } from "@/components/features/dashboard/BucketBars";
import { ActivityFeed } from "@/components/features/dashboard/ActivityFeed";
import { AdobeQuotaCard } from "@/components/features/dashboard/AdobeQuotaCard";
// 1. Importa tu nuevo componente
import { GenerationChart } from "@/components/features/dashboard/GenerationChart";

function Section({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[2.5rem] bg-white dark:bg-[#0c0c0e] border border-slate-100 dark:border-white/5 p-7 shadow-sm ${className}`}
    >
      {title && (
        <h3 className="text-[11px] font-bold uppercase text-slate-400 mb-6">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
}

export default function DashboardPage() {
  const d = useDashboardData();
  const totalUsedBytes = d.dbUsedBytes + d.storageUsedBytes;
  const totalLimitBytes = d.dbLimitBytes + d.storageLimitBytes;
  const dbPct = d.dbLimitBytes
    ? Math.round((d.dbUsedBytes / d.dbLimitBytes) * 100)
    : 0;
  const storagePct = d.storageLimitBytes
    ? Math.round((d.storageUsedBytes / d.storageLimitBytes) * 100)
    : 0;
  const combinedPct = totalLimitBytes
    ? Math.round((totalUsedBytes / totalLimitBytes) * 100)
    : 0;

  const stats = [
    {
      label: "Empresas",
      val: d.companies,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      trend: "+2",
      detail: "Empresas activas",
      showBar: false,
    },
    {
      label: "Plantillas",
      val: d.templates,
      icon: FileCode2,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      trend: "4",
      detail: "Plantillas listas",
      showBar: false,
    },
    {
      label: "Generaciones",
      val: d.generationTotal,
      icon: Zap,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      trend: "12",
      detail: "Total generado",
      showBar: false,
    },
    {
      label: "Espacio Total",
      val: "1.5 GB",
      icon: HardDrive,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      trend: "Free",
      detail: `DB ${dbPct}% · Storage ${storagePct}%`,
      progress: combinedPct,
      showBar: true,
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-400 mx-auto min-h-screen bg-[#fcfcfd] dark:bg-transparent text-slate-900 dark:text-white font-poppins">
      <header className="space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Panel de Control</h1>
        <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-300">
          Reorganiza y visualiza la información clave del dashboard con un
          estilo más limpio y actual, manteniendo el gráfico de generación en su
          posición.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="group relative px-6 py-5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center">
                <ChevronUp size={10} className="mr-0.5" />
                {s.trend}
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">
              {s.label}
            </p>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                {d.loading ? "..." : s.val}
              </span>
              <span className="text-[10px] uppercase text-slate-400">
                {s.detail}
              </span>
            </div>
            <div className="mt-4">
              {s.showBar ? (
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-slate-900 to-slate-500 dark:from-slate-200 dark:to-slate-400"
                      style={{ width: `${s.progress ?? 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{s.detail}</p>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">{s.detail}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          {/* 2. INTEGRACIÓN DEL GRÁFICO REAL */}
          <Section
            title="Rendimiento de Generación"
            className="h-100 flex flex-col"
          >
            <div className="flex-1 w-full pt-4">
              {d.loading ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-white/2 rounded-4xl border border-dashed border-slate-200 dark:border-white/10">
                  <div className="flex flex-col items-center gap-3">
                    <Activity
                      size={32}
                      className="animate-pulse text-indigo-500 opacity-20"
                    />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Sincronizando datos...
                    </p>
                  </div>
                </div>
              ) : (
                <GenerationChart data={d.generationData} />
              )}
            </div>
          </Section>

          <Section title="Actividad del Sistema">
            <ActivityFeed items={d.recentActivity} />
          </Section>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <Section title="Cuota de Adobe PDF">
            <div className="rounded-[2rem] bg-amber-50/70 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/10 p-5 shadow-sm">
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-300">
                <FileText size={16} />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Uso actual
                </p>
              </div>
              <div className="mt-4">
                <AdobeQuotaCard used={d.adobeUsed} limit={d.adobeLimit} />
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  Has utilizado el{" "}
                  {Math.round((d.adobeUsed / d.adobeLimit) * 100)}% de tu cuota
                  mensual. Optimiza tus plantillas para reducir el peso de los
                  documentos.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Recursos Supabase" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-6 rounded-[2rem] bg-slate-50/90 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-sm">
                  <StorageDonut
                    usedBytes={d.dbUsedBytes}
                    limitBytes={d.dbLimitBytes}
                    color="#6366f1"
                    size={90}
                  />
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">
                    Database
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-[2rem] bg-slate-50/90 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-sm">
                  <StorageDonut
                    usedBytes={d.storageUsedBytes}
                    limitBytes={d.storageLimitBytes}
                    color="#22d3ee"
                    size={90}
                  />
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">
                    Storage
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] bg-slate-50/90 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-4">
                  Desglose Buckets
                </p>
                <BucketBars buckets={d.buckets} />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
