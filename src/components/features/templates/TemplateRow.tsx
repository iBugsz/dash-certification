"use client";

import {
  FileText,
  Settings2,
  Trash2,
  Pencil,
  Download,
  Eye,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Template } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";

interface Props {
  template: Template;
  onDelete: (id: string, filePath: string) => void;
  onMappingClick: (template: Template) => void;
  onEditClick: (template: Template) => void;
  onPreviewClick: (url: string) => void;
}

function CompanyInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[4px] bg-blue-600 text-white text-[9px] font-bold flex-shrink-0">
      {initials}
    </span>
  );
}

export default function TemplateRow({
  template,
  onDelete,
  onMappingClick,
  onEditClick,
  onPreviewClick,
}: Props) {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-200 dark:hover:border-slate-700 transition-all">
      {/* Contenido principal */}
      <div className="flex-1 p-4">
        {/* Header: icono + nombre */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-[10px] bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
            <FileText className="w-[17px] h-[17px] text-blue-500 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <button
              onClick={() =>
                template.has_preview && onPreviewClick(template.preview_url!)
              }
              className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left leading-snug w-full"
            >
              {template.name}
            </button>
            <p className="text-[11px] text-slate-400 mt-0.5">.docx</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {template.company ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[11px] font-medium text-blue-800 dark:text-blue-300">
              <CompanyInitials name={template.company.name} />
              {template.company.name}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400">
              Sin empresa
            </span>
          )}

          {template.homologation_type && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-[11px] font-medium text-indigo-800 dark:text-indigo-300">
              {template.homologation_type.name}
            </span>
          )}

          {template.has_preview ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              Vista disponible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Preparando vista...
            </span>
          )}
        </div>
      </div>

      {/* Footer: fecha + acciones */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-400">{formatDate(template.updated_at)}</span>
        <div className="flex items-center gap-0.5">
          {template.has_preview && (
            <button
              onClick={() => onPreviewClick(template.preview_url!)}
              className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all"
              title="Ver"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onEditClick(template)}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Editar"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMappingClick(template)}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-all"
            title="Mapear campos"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
          <a
            href={template.file_url ?? "#"}
            download={true}
            className={`cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all ${
              !template.file_url ? "pointer-events-none opacity-30" : ""
            }`}
            title="Descargar"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onDelete(template.id, template.file_path)}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
            title="Eliminar"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}