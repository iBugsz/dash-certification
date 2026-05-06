"use client";

import { useState, useMemo, useEffect } from "react";
import { ActivityLogList } from "./ActivityLogList";
import { ActivityFilter } from "./ActivityFilter";
import { supabase } from "@/lib/supabase";
import {
  ActivityLog,
  ActivityAction,
  ActivityEntity,
} from "@/lib/types/activity";

interface Filters {
  action?: ActivityAction;
  entity?: ActivityEntity;
}

export function ActivityPageClient({
  initialLogs,
}: {
  initialLogs: ActivityLog[];
}) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    const channel = supabase
      .channel("activity_page_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_logs" },
        async () => {
          const { data } = await supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false });

          if (data) setLogs(data as ActivityLog[]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchAction = filters.action
        ? log.action_type === filters.action
        : true;
      const matchEntity = filters.entity
        ? log.entity_type === filters.entity
        : true;
      return matchAction && matchEntity;
    });
  }, [filters, logs]);

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

        {(filters.action || filters.entity) && (
          <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md font-bold border border-amber-500/20">
            FILTRADO ACTIVO
          </span>
        )}
      </div>

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

      <div className="p-4 bg-slate-50/30 dark:bg-white/1 border-t border-slate-100 dark:border-white/5">
        <p className="text-[10px] text-slate-400 text-center font-medium">
          Los datos mostrados corresponden al historial completo almacenado en
          Supabase
        </p>
      </div>
    </div>
  );
}
