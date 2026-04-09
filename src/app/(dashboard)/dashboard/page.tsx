"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Layout,
  FileCheck,
  HardDrive,
  TrendingUp,
} from "lucide-react";

import { useDashboardData } from "@/hooks/useDashboardData";
import { formatBytes } from "@/lib/dashboard/utils";
import { StatCard } from "@/components/features/dashboard/StatCard";
import { StorageDonut } from "@/components/features/dashboard/StorageDonut";
import { BucketBars } from "@/components/features/dashboard/BucketBars";
import { ActivityFeed } from "@/components/features/dashboard/ActivityFeed";
import { ServiceGrid } from "@/components/features/dashboard/ServiceGrid";
import { MiniBarChart } from "@/components/features/dashboard/MiniBarChart";
import { AdobeQuotaCard } from "@/components/features/dashboard/AdobeQuotaCard";

function Section({
  title,
  children,
  className = "",
  delay = 0,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={`rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 ${className}`}
    >
      {title && (
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--foreground)] opacity-40 mb-4">
          {title}
        </p>
      )}
      {children}
    </motion.div>
  );
}

export default function DashboardPage() {
  const d = useDashboardData();

  const totalUsedBytes = d.dbUsedBytes + d.storageUsedBytes;
  const totalLimitBytes = d.dbLimitBytes + d.storageLimitBytes;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-[var(--foreground)]">
            Panel de Control
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase">
            Sistema Operativo
          </span>
        </div>
      </motion.header>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Empresas"
          value={d.loading ? "—" : d.companies}
          sub="registradas"
          icon={Building2}
          accent="from-blue-500 to-cyan-500"
          delay={0.05}
        />
        <StatCard
          label="Plantillas"
          value={d.loading ? "—" : d.templates}
          sub="activas"
          icon={Layout}
          accent="from-indigo-500 to-violet-500"
          delay={0.1}
        />
        <StatCard
          label="Generaciones"
          value={d.loading ? "—" : d.totalCertificates.toLocaleString()}
          sub="certificados"
          icon={FileCheck}
          accent="from-emerald-500 to-teal-500"
          delay={0.15}
        />
        <StatCard
          label="Espacio Total"
          value={d.loading ? "—" : formatBytes(totalUsedBytes)}
          sub={`de ${formatBytes(totalLimitBytes)} · Free`}
          icon={HardDrive}
          accent="from-amber-500 to-orange-500"
          delay={0.2}
        />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section
          title="Almacenamiento · Supabase"
          className="lg:col-span-2"
          delay={0.25}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-around flex-wrap gap-8 py-2">
              <StorageDonut
                label="Base de Datos"
                usedBytes={d.dbUsedBytes}
                limitBytes={d.dbLimitBytes}
                color="#6366f1"
                delay={0.3}
              />
              <StorageDonut
                label="Object Storage"
                usedBytes={d.storageUsedBytes}
                limitBytes={d.storageLimitBytes}
                color="#22d3ee"
                delay={0.4}
              />
              <StorageDonut
                label="Total Combinado"
                usedBytes={totalUsedBytes}
                limitBytes={totalLimitBytes}
                color="#a78bfa"
                delay={0.5}
              />
            </div>

            <div className="border-t border-[var(--border)]" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] opacity-30 mb-3">
                Desglose por bucket
              </p>
              <BucketBars
                buckets={d.buckets}
                totalLimit={d.storageLimitBytes}
              />
            </div>
          </div>
        </Section>

        <Section title="Servicios Supabase" delay={0.3}>
          <ServiceGrid />
          <div className="border-t border-[var(--border)] my-4" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] opacity-30 mb-3">
            DB Schemas
          </p>
          {[
            { label: "auth.*", bytes: 385_024 },
            { label: "storage.*", bytes: 147_456 },
            { label: "public.*", bytes: 98_304 },
          ].map((row, i) => (
            <div key={row.label} className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-[var(--foreground)] opacity-50 w-20">
                {row.label}
              </span>
              <div className="flex-1 bg-[var(--border)] rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-1 rounded-full bg-violet-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.round((row.bytes / 630_784) * 100)}%`,
                  }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.4 }}
                />
              </div>
              <span className="text-[10px] font-mono text-[var(--foreground)] opacity-40 w-14 text-right">
                {formatBytes(row.bytes)}
              </span>
            </div>
          ))}
        </Section>
      </div>

      {/* ── Bottom grid — 3 columnas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico semanal */}
        <Section delay={0.35}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--foreground)] opacity-40">
              Generaciones · Últimos 7 días
            </p>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={13} />
              <span className="text-[10px] font-bold">+12% vs semana ant.</span>
            </div>
          </div>
          <MiniBarChart color="#6366f1" />
        </Section>

        {/* Actividad reciente */}
        <Section title="Actividad Reciente" delay={0.4}>
          <ActivityFeed items={d.recentTemplates} />
        </Section>

        {/* Cuota Adobe ← NUEVO */}
        <Section title="Cuota · Adobe PDF" delay={0.45}>
          <AdobeQuotaCard
            used={d.loading ? 0 : d.adobeUsed}
            limit={d.loading ? 500 : d.adobeLimit}
          />
        </Section>
      </div>
    </div>
  );
}
