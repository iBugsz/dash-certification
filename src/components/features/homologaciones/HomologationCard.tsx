import { Calendar, Check, Edit2, Trash2 } from "lucide-react";
import { BaseCard, IconButton } from "@/components/ui/BaseCard";

export default function HomologationCard({ item, onToggle, onEdit, onDelete }: any) {
  return (
    <BaseCard
      header={
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-[17px] h-[17px] text-indigo-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-snug">
              {item.name}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Homologación</p>
          </div>
        </div>
      }
      footerLeft={new Date(item.start_date).toLocaleDateString()}
      footerRight={
        <>
          <IconButton 
            icon={Check} 
            onClick={() => onToggle(item.id, item.is_completed)} 
            color={item.is_completed ? "text-emerald-500" : "text-slate-400"} 
            title="Cambiar estado"
          />
          <IconButton icon={Edit2} onClick={() => onEdit(item)} title="Editar" />
          <IconButton icon={Trash2} onClick={() => onDelete()} color="text-red-500" title="Eliminar" />
        </>
      }
    >
      {/* Contenido (Badges) que se inyectan en el body de la BaseCard */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium ${
          item.is_completed 
            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" 
            : "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
        }`}>
          {item.is_completed ? "Completado" : "Pendiente"}
        </span>
        
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500">
          {item.company?.name || "Sin empresa"}
        </span>
      </div>
    </BaseCard>
  );
}