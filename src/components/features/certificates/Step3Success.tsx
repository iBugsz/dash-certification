"use client";

import {
  FileCheck,
  FileSearch,
  Download,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  step3Revealed: boolean;
  onPreview: () => void;
  onDownloadPdf: () => void;
  onDownloadWord: () => void;
  onReset: () => void;
}

export function Step3Success({
  step3Revealed,
  onPreview,
  onDownloadPdf,
  onDownloadWord,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-300">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
        style={{
          backgroundColor: "rgba(5, 205, 153, 0.1)",
          border: "1px solid rgba(5, 205, 153, 0.3)",
        }}
      >
        <FileCheck className="w-10 h-10" style={{ color: "#05cd99" }} />
      </div>

      <div
        className="space-y-2 mb-10"
        style={{
          transition: "opacity 300ms ease, transform 300ms ease",
          transitionDelay: "0ms",
          opacity: step3Revealed ? 1 : 0,
          transform: step3Revealed ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <h2 className="text-3xl font-black tracking-tight">
          ¡Documento Listo!
        </h2>
        <p className="text-sm opacity-60 max-w-xs mx-auto">
          Los archivos se han generado correctamente. Utiliza las opciones de
          abajo para gestionarlos.
        </p>
      </div>

      <div
        className="flex items-center bg-secondary/10 p-2 rounded-3xl border shadow-sm"
        style={{
          borderColor: "var(--border)",
          transition: "opacity 300ms ease, transform 300ms ease",
          transitionDelay: "140ms",
          opacity: step3Revealed ? 1 : 0,
          transform: step3Revealed ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <Button
          onClick={onPreview}
          title="Vista previa del PDF"
          variant="ghost"
          className="w-12 h-12 rounded-2xl hover:bg-white transition-all cursor-pointer"
        >
          <FileSearch className="w-5 h-5 text-slate-600" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          onClick={onDownloadPdf}
          title="Descargar en PDF"
          variant="ghost"
          className="w-12 h-12 rounded-2xl hover:bg-red-50 transition-all cursor-pointer"
        >
          <Download className="w-5 h-5 text-red-500" />
        </Button>

        <Button
          onClick={onDownloadWord}
          title="Descargar en Word"
          variant="ghost"
          className="w-12 h-12 rounded-2xl hover:bg-blue-50 transition-all cursor-pointer"
        >
          <FileText className="w-5 h-5 text-blue-600" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          onClick={onReset}
          title="Reiniciar todo el proceso"
          variant="ghost"
          className="w-12 h-12 rounded-2xl hover:bg-slate-200 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 text-slate-700" />
        </Button>
      </div>

      <p
        className="mt-4 text-[9px] font-bold uppercase tracking-widest"
        style={{
          transition: "opacity 300ms ease",
          transitionDelay: "260ms",
          opacity: step3Revealed ? 0.3 : 0,
        }}
      >
        Opciones de archivo
      </p>
    </div>
  );
}
