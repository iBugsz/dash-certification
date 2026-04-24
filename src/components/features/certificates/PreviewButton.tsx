import { Eye, FileText } from "lucide-react";

interface Props {
  onClick: () => void;
  isMapped: boolean;
}

export function PreviewButton({ onClick, isMapped }: Props) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-xs transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:px-6 px-4 py-3 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-blue-500/50 overflow-hidden"
      style={{
        animation:
          "super-slide 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      {/* 1. ANIMACIÓN DE BRILLO TIPO RAYO */}
      <div className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]" />

      {/* Inyección de Keyframes Pro */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes super-slide {
            0% { transform: translateX(200%) scale(0.5); opacity: 0; filter: blur(10px); }
            60% { transform: translateX(-10%) scale(1.05); opacity: 1; filter: blur(0px); }
            100% { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes shimmer {
            0% { transform: translateX(-150%) skewX(-25deg); }
            100% { transform: translateX(150%) skewX(-25deg); }
          }
          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
        `,
        }}
      />

      {/* Indicador de Notificación con Pulso */}
      {isMapped && (
        <span className="absolute top-1.5 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}

      <div className="relative flex items-center gap-0 group-hover:gap-3">
        {/* Iconos con rotación rápida en hover */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Eye className="w-5 h-5 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-0 group-hover:opacity-0" />
          <FileText className="w-5 h-5 absolute opacity-0 scale-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-0" />
        </div>

        {/* Texto que se expande */}
        <span className="max-w-0 group-hover:max-w-[150px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap uppercase tracking-[0.2em] text-[10px]">
          {isMapped ? "Ver Resultados" : "Preview Plantilla"}
        </span>
      </div>
    </button>
  );
}
