import { Zap, ShieldCheck } from "lucide-react";

export function FeatureTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <div className="group p-5 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-[var(--card)] rounded-[24px] border border-blue-100/50 dark:border-blue-900/30 flex gap-4 transition-all hover:shadow-md hover:border-blue-200">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Zap className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
            Mapeo Inteligente
          </p>
          <p className="text-[11px] text-blue-700/70 dark:text-blue-300/60 leading-relaxed mt-1">
            Detectamos automáticamente etiquetas como{" "}
            <strong>placa, chasis y marca</strong> dentro de tu archivo Excel
            sin configurar nada.
          </p>
        </div>
      </div>

      <div className="group p-5 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-[var(--card)] rounded-[24px] border border-emerald-100/50 dark:border-emerald-900/30 flex gap-4 transition-all hover:shadow-md hover:border-emerald-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
            Seguridad Total
          </p>
          <p className="text-[11px] text-emerald-700/70 dark:text-emerald-300/60 leading-relaxed mt-1">
            Procesamiento local seguro. Tus datos sensibles{" "}
            <strong>no se almacenan</strong> permanentemente en nuestros
            servidores.
          </p>
        </div>
      </div>
    </div>
  );
}
