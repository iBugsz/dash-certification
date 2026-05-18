"use client";

import { Tag, Pencil, Trash2 } from "lucide-react";
import { HomologationType } from "@/lib/types/database";

interface Props {
  homologationType: HomologationType;
  onEdit: (h: HomologationType) => void;
  onDelete: (id: string) => void;
}

export default function HomologationTypeCard({
  homologationType,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="relative flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Indicador activo */}
      <span
        className={`absolute top-4 right-4 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          homologationType.active
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
        }`}
      >
        {homologationType.active ? "Activo" : "Inactivo"}
      </span>

      {/* Icono + nombre */}
      <div className="flex items-center gap-3 pr-16">
        <div className="flex-shrink-0 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 p-2">
          <Tag size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">
            {homologationType.name}
          </h3>
          {homologationType.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              {homologationType.description}
            </p>
          )}
        </div>
      </div>

      {/* Fecha */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Creado el{" "}
        {new Date(homologationType.created_at).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>

      {/* Acciones */}
      <div className="flex gap-2 border-t border-slate-100 dark:border-slate-700 pt-4">
        <button
          onClick={() => onEdit(homologationType)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Pencil size={14} />
          Editar
        </button>
        <button
          onClick={() => onDelete(homologationType.id)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </div>
    </div>
  );
}
