"use client";

import { useState, useMemo } from "react";
import { ActivityLogList } from "./ActivityLogList";
import { ActivityFilter } from "./ActivityFilter";
import {
  ActivityLog,
  ActivityAction,
  ActivityEntity,
} from "@/lib/activity/types";

interface Filters {
  action?: ActivityAction;
  entity?: ActivityEntity;
}

export function ActivityPageClient({
  initialLogs,
}: {
  initialLogs: ActivityLog[];
}) {
  // Estado para controlar los filtros seleccionados
  const [filters, setFilters] = useState<Filters>({});

  // Filtrado reactivo: useMemo asegura que solo se recalcule si cambian los filtros o los logs
  const filteredLogs = useMemo(() => {
    return initialLogs.filter((log) => {
      const matchAction = filters.action
        ? log.action_type === filters.action
        : true;
      const matchEntity = filters.entity
        ? log.entity_type === filters.entity
        : true;
      return matchAction && matchEntity;
    });
  }, [filters, initialLogs]);

  return (
    <div className="bg-white dark:bg-[#0c0c0e]/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden">
      {/* Componente de Filtros (superior) */}
      <ActivityFilter activeFilters={filters} onFilterChange={setFilters} />

      {/* Barra de estado de resultados */}
      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/1">
        <div className="flex items-center gap-2 ml-2">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {filteredLogs.length} Movimientos encontrados
          </h2>
        </div>

        {/* Badge indicador si hay filtros activos */}
        {(filters.action || filters.entity) && (
          <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md font-bold border border-amber-500/20">
            FILTRADO ACTIVO
          </span>
        )}
      </div>

      {/* Lista de Logs (cuerpo) */}
      <div className="min-h-112.5">
        {filteredLogs.length > 0 ? (
          <ActivityLogList items={filteredLogs} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <p className="text-sm font-medium font-poppins">
              No se encontraron registros con estos filtros
            </p>
            <button
              onClick={() => setFilters({})}
              className="mt-4 text-xs font-bold text-indigo-500 hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Footer informativo interno */}
      <div className="p-4 bg-slate-50/30 dark:bg-white/1 border-t border-slate-100 dark:border-white/5">
        <p className="text-[10px] text-slate-400 text-center font-medium">
          Los datos mostrados corresponden al historial completo almacenado en
          Supabase
        </p>
      </div>
    </div>
  );
}
