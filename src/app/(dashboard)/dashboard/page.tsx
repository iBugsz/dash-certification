"use client";

import { Database, HardDrive } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { StorageCard } from "@/components/features/dashboard/StorageMetrics";
import { GenerationChart } from "@/components/features/dashboard/GenerationChart";
import { ActivityFeed } from "@/components/features/dashboard/ActivityFeed";
import { AdobeQuotaCard } from "@/components/features/dashboard/AdobeQuotaCard";
import { StatsOverviewCard } from "@/components/features/dashboard/StatsOverviewCard";
import { CalendarWidget } from "@/components/features/dashboard/CalendarWidget";
// Importamos el nuevo componente del asistente
import { GeminiAssistantCard } from "@/components/features/dashboard/GeminiAssistantCard";

export default function DashboardPage() {
  const d = useDashboardData();

  return (
    <div className="p-6 lg:p-10 space-y-8 dark:bg-transparent min-h-screen font-poppins">
      {/* GRID MAESTRO DE 12 COLUMNAS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LADO IZQUIERDO (8 COLUMNAS) - FLUJO TÉCNICO */}
        <div className="xl:col-span-8 space-y-6">
          {/* 1. Almacenamiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StorageCard
              label="Uso de Base de Datos"
              title="Base de Datos"
              used={d.dbUsedBytes}
              limit={d.dbLimitBytes}
              color="#6366f1"
              icon={Database}
            />
            <StorageCard
              label="Almacenamiento Cloud"
              title="Archivos"
              used={d.storageUsedBytes}
              limit={d.storageLimitBytes}
              color="#ff7782"
              icon={HardDrive}
            />
          </div>

          {/* 2. Gráfica de Rendimiento */}
          <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-8 shadow-sm card-premium">
            <h3 className="text-[11px] font-bold uppercase mb-8 tracking-[0.2em]">
              Rendimiento de Generación
            </h3>
            <div className="h-[300px] w-full">
              {!d.loading && <GenerationChart data={d.generationData} />}
            </div>
          </div>

          {/* 3. Actividad Reciente */}
          <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-8 shadow-sm card-premium">
            <h3 className="text-[11px] font-bold uppercase text-[var(--sidebar-fg-muted)] mb-6 tracking-widest">
              Actividad Reciente
            </h3>
            <ActivityFeed items={d.recentActivity} />
          </div>
        </div>

        {/* LADO DERECHO (4 COLUMNAS) - FLUJO ADMINISTRATIVO Y AI */}
        <div className="xl:col-span-4 space-y-6">
          {/* 1. Calendario */}
          <CalendarWidget />

          {/* 2. Asistente Gemini (Nuevo) */}
          <GeminiAssistantCard />

          {/* 3. Resumen de Activos */}
          <StatsOverviewCard
            companies={d.companies}
            templates={d.templates}
            generations={d.generationTotal}
          />

          {/* 4. Adobe Quota */}
          <div className="stats-card-minimal text-center">
            <AdobeQuotaCard used={d.adobeUsed} limit={d.adobeLimit} />
          </div>
        </div>
      </div>
    </div>
  );
}
