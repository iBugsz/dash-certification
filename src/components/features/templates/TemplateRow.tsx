"use client";

import {
  FileText,
  Settings2,
  Trash2,
  Pencil,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import { Template } from "@/lib/templates/types";
import { formatDate } from "@/lib/templates/utils";

interface Props {
  template: Template;
  onDelete: (id: string, filePath: string) => void;
  onMappingClick: (template: Template) => void;
  onEditClick: (template: Template) => void;
}

export default function TemplateRow({
  template,
  onDelete,
  onMappingClick,
  onEditClick,
}: Props) {
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/60 transition-colors">
            <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div
            className="cursor-pointer"
            onClick={() =>
              template.has_preview &&
              window.open(template.preview_url!, "_blank")
            }
          >
            <p className="font-medium text-slate-700 dark:text-slate-200 text-sm leading-tight hover:text-accent transition-colors">
              {template.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[11px] text-slate-400">.docx</p>
              {template.has_preview && (
                <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
                  <div className="w-1 h-1 rounded-full bg-green-500" />
                  Vista previa lista
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        {template.company ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
            {template.company.name}
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">Sin asignar</span>
        )}
      </td>

      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
        {formatDate(template.updated_at)}
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-1">
          {/* VISTA PREVIA */}
          {template.has_preview ? (
            <a
              href={template.preview_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-all"
              title="Ver PDF"
            >
              <Eye className="w-4 h-4" />
            </a>
          ) : (
            <div className="p-2 text-slate-300" title="Generando preview...">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}

          <button
            onClick={() => onEditClick(template)}
            title="Editar Información"
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-all cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => onMappingClick(template)}
            className="p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-all cursor-pointer"
            title="Mapear"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          <a
            href={template.file_url ?? "#"}
            download
            className={`p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/40 rounded-xl transition-all ${
              !template.file_url ? "pointer-events-none opacity-20" : ""
            }`}
            title="Descargar Word"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={() => onDelete(template.id, template.file_path)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer transition-all"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
