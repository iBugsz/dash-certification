"use client";

import { Filter, X } from "lucide-react";
import { ActivityAction, ActivityEntity } from "@/lib/types/activity";

interface ActivityFilterProps {
  onFilterChange: (filters: {
    action?: ActivityAction;
    entity?: ActivityEntity;
  }) => void;
  activeFilters: { action?: ActivityAction; entity?: ActivityEntity };
}

export function ActivityFilter({
  onFilterChange,
  activeFilters,
}: ActivityFilterProps) {
  const actions: ActivityAction[] = ["CREATE", "UPDATE", "DELETE", "GENERATE"];
  const entities: ActivityEntity[] = ["TEMPLATE", "COMPANY", "CERTIFICATE"];

  const clearFilters = () => onFilterChange({});

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-50/50 dark:bg-white/2 border-b border-slate-100 dark:border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Filtros de búsqueda
          </span>
        </div>
        {(activeFilters.action || activeFilters.entity) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
          >
            <X size={12} />
            LIMPIAR
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        {/* Filtro por Acción */}
        <div className="space-y-2">
          <p className="text-[10px] font-medium text-slate-400 uppercase ml-1">
            Por Acción
          </p>
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action}
                onClick={() =>
                  onFilterChange({
                    ...activeFilters,
                    action:
                      activeFilters.action === action ? undefined : action,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeFilters.action === action
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-sm shadow-indigo-200 dark:shadow-none"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-indigo-300"
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por Entidad */}
        <div className="space-y-2">
          <p className="text-[10px] font-medium text-slate-400 uppercase ml-1">
            Por Módulo
          </p>
          <div className="flex flex-wrap gap-2">
            {entities.map((entity) => (
              <button
                key={entity}
                onClick={() =>
                  onFilterChange({
                    ...activeFilters,
                    entity:
                      activeFilters.entity === entity ? undefined : entity,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeFilters.entity === entity
                    ? "bg-slate-800 dark:bg-slate-200 border-slate-800 dark:border-slate-200 text-white dark:text-slate-900 shadow-sm"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                }`}
              >
                {entity === "TEMPLATE"
                  ? "Plantillas"
                  : entity === "COMPANY"
                    ? "Empresas"
                    : "Certificados"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
