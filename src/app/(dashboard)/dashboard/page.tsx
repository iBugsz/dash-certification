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
import { ServiceGrid } from "@/components/features/dashboard/ServiceGrid";
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

  const stats = [
    {
      label: "Empresas",
      val: d.companies,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      trend: "+2",
    },
    {
      label: "Plantillas",
      val: d.templates,
      icon: FileCode2,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      trend: "4",
    },
    {
      label: "Generaciones",
      val: d.totalCertificates,
      icon: Zap,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      trend: "12",
    },
    {
      label: "Espacio Total",
      val: "1.5 GB",
      icon: HardDrive,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      trend: "Free",
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-400 mx-auto min-h-screen bg-[#fcfcfd] dark:bg-transparent text-slate-900 dark:text-white font-poppins">
      {/* ── HEADER ── */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <header>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              Sistema Operativo v2.1
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Panel de Control
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2">
            Gestión de recursos y métricas del sistema
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="group relative px-5 py-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-4xl shadow-sm transition-all min-w-40"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-2xl ${s.bg} ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center">
                  <ChevronUp size={10} className="mr-0.5" />
                  {s.trend}
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">
                {s.label}
              </p>
              <span className="text-2xl font-black tracking-tighter">
                {d.loading ? "..." : s.val}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Actividad del Sistema">
              <ActivityFeed items={d.recentActivity} />
            </Section>

            <Section title="Cuota de Adobe PDF">
              <AdobeQuotaCard used={d.adobeUsed} limit={d.adobeLimit} />
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                  <FileText size={16} />
                  <p className="text-[10px] font-bold uppercase">Sugerencia</p>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Has utilizado el **
                  {Math.round((d.adobeUsed / d.adobeLimit) * 100)}%** de tu
                  cuota mensual. Optimiza tus plantillas para reducir el peso de
                  los documentos.
                </p>
              </div>
            </Section>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Section title="Recursos Supabase">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-5 rounded-[2.5rem] bg-slate-50/50 dark:bg-white/2 border border-slate-100 dark:border-white/5">
                  <StorageDonut
                    usedBytes={d.dbUsedBytes}
                    limitBytes={d.dbLimitBytes}
                    color="#6366f1"
                    size={80}
                  />
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">
                    Database
                  </p>
                </div>
                <div className="flex flex-col items-center p-5 rounded-[2.5rem] bg-slate-50/50 dark:bg-white/2 border border-slate-100 dark:border-white/5">
                  <StorageDonut
                    usedBytes={d.storageUsedBytes}
                    limitBytes={d.storageLimitBytes}
                    color="#22d3ee"
                    size={80}
                  />
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">
                    Storage
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-4">
                  Desglose Buckets
                </p>
                <BucketBars buckets={d.buckets} />
              </div>
            </div>
          </Section>

          <Section title="Servicios de Infraestructura">
            <ServiceGrid />
          </Section>
        </div>
      </div>
    </div>
  );
}
