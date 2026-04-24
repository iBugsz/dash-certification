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
  const [filters, setFilters] = useState<Filters>({});

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
      <ActivityFilter activeFilters={filters} onFilterChange={setFilters} />

      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/1">
        <div className="flex items-center gap-2 ml-2">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {filteredLogs.length} Movimientos encontrados
          </h2>
        </div>
      </div>

      <div className="min-h-[450px]">
        {filteredLogs.length > 0 ? (
          <ActivityLogList items={filteredLogs} />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <p className="text-sm font-medium">No se encontraron registros</p>
            <button
              onClick={() => setFilters({})}
              className="mt-4 text-xs font-bold text-indigo-500 hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityPageClient;
