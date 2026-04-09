"use client";

import { FileText, Settings2, ExternalLink, Trash2 } from "lucide-react";
import { Template } from "@/lib/templates/types";
import { formatDate } from "@/lib/templates/utils";

interface Props {
  template: Template;
  onDelete: (id: string, filePath: string) => void;
  // Esta es la pieza que falta: la fila avisa que quieren mapear esta plantilla
  onMappingClick: (template: Template) => void;
}

export default function TemplateRow({
  template,
  onDelete,
  onMappingClick,
}: Props) {
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
      {/* Nombre */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60 transition-colors">
            <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200 text-sm leading-tight">
              {template.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">.docx</p>
          </div>
        </div>
      </td>

      {/* Empresa */}
      <td className="px-6 py-4">
        {template.company ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
            {template.company.name}
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">Sin asignar</span>
        )}
      </td>

      {/* Fecha */}
      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
        {formatDate(template.updated_at)}
      </td>

      {/* Acciones */}
      <td className="px-6 py-4">
        <div className="flex justify-end gap-1">
          {/* CAMBIO AQUÍ: Usamos un button en lugar de Link */}
          <button
            onClick={() => onMappingClick(template)}
            title="Configurar Mapeo"
            className="p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-all cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <a
            href={template.file_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-all ${
              !template.file_url ? "pointer-events-none opacity-20" : ""
            }`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => onDelete(template.id, template.file_path)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
