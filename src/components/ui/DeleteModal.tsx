import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  // Mantenemos variant por si alguna vez quieres cambiar el color, 
  // pero por defecto es 'danger'
  variant?: "danger" | "warning";
}

export function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Eliminar",
  variant = "danger"
}: DeleteModalProps) {
  if (!isOpen) return null;

  const isWarning = variant === "warning";
  const bgClass = isWarning ? "bg-amber-50 dark:bg-amber-950/30" : "bg-red-50 dark:bg-red-950/30";
  const iconClass = isWarning ? "text-amber-500" : "text-red-500";
  const btnClass = isWarning ? "bg-amber-500 hover:bg-amber-600" : "bg-red-500 hover:bg-red-600";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95">
        <div className="p-6 text-center">
          <div className={`mx-auto w-14 h-14 ${bgClass} rounded-full flex items-center justify-center mb-4`}>
            <AlertTriangle className={`w-7 h-7 ${iconClass}`} />
          </div>
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm">
            Cancelar
          </button>
          <button 
        onClick={async () => { 
            // Usamos 'await' para esperar a que termine la eliminación
            await onConfirm(); 
            onClose(); 
        }} 
        className={`cursor-pointer flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all text-sm text-white ${btnClass} flex items-center justify-center gap-2`}
        >
        <Trash2 className="w-4 h-4" /> {confirmText}
        </button>
        </div>
      </div>
    </div>
  );
}