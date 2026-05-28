import { FileText, Settings2, Trash2, Pencil, Download, Eye, Loader2, CheckCircle2 } from "lucide-react";
import { Template } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { BaseCard, IconButton } from "@/components/ui/BaseCard";

interface Props {
  template: Template;
  onDelete: (id: string, filePath: string) => void;
  onMappingClick: (template: Template) => void;
  onEditClick: (template: Template) => void;
  onPreviewClick: (url: string) => void;
}

function CompanyInitials({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[4px] bg-blue-600 text-white text-[9px] font-bold flex-shrink-0">
      {initials}
    </span>
  );
}

export default function TemplateRow({ template, onDelete, onMappingClick, onEditClick, onPreviewClick }: Props) {
  return (
    <BaseCard
      header={
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
            <FileText className="w-[17px] h-[17px] text-blue-500 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <button
              onClick={() => template.has_preview && onPreviewClick(template.preview_url!)}
              className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left leading-snug w-full"
            >
              {template.name}
            </button>
            <p className="text-[11px] text-slate-400 mt-0.5">.docx</p>
          </div>
        </div>
      }
      footerLeft={formatDate(template.updated_at)}
      footerRight={
        <>
          {template.has_preview && <IconButton icon={Eye} onClick={() => onPreviewClick(template.preview_url!)} title="Ver" color="text-blue-500" />}
          <IconButton icon={Pencil} onClick={() => onEditClick(template)} title="Editar" />
          <IconButton icon={Settings2} onClick={() => onMappingClick(template)} title="Mapear" color="text-violet-500" />
          <a href={template.file_url ?? "#"} download className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all" title="Descargar">
            <Download className="w-3.5 h-3.5" />
          </a>
          <IconButton icon={Trash2} onClick={() => onDelete(template.id, template.file_path)} title="Eliminar" color="text-red-500" />
        </>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {template.company ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[11px] font-medium text-blue-800 dark:text-blue-300">
            <CompanyInitials name={template.company.name} />
            {template.company.name}
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400">Sin empresa</span>
        )}
        {template.homologation_type && (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-[11px] font-medium text-indigo-800 dark:text-indigo-300">
            {template.homologation_type.name}
          </span>
        )}
        {template.has_preview ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Vista disponible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400">
            <Loader2 className="w-3 h-3 animate-spin" /> Preparando...
          </span>
        )}
      </div>
    </BaseCard>
  );
}