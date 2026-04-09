import { FileStack } from "lucide-react";

export function EmptyPreview() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/35 border-2 border-slate-100 dark:border-[var(--border)] border-dashed rounded-[32px] h-full min-h-[550px] flex flex-col items-center justify-center p-12 text-center group transition-colors">
      <div className="w-20 h-20 bg-[var(--card)] border border-[var(--border)] rounded-3xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
        <FileStack className="w-10 h-10 text-slate-200 dark:text-slate-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-poppins">
        Esperando Datos
      </h2>
      <p className="text-slate-400 dark:text-slate-500 text-sm max-w-[320px] leading-relaxed">
        Carga un archivo Excel a la izquierda para generar la vista previa
        interactiva de tus certificados.
      </p>
    </div>
  );
}
