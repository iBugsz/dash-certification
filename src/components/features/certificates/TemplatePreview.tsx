import { FileText, Loader2 } from "lucide-react";
import type { Template } from "@/lib/certificates/types";

interface TemplatePreviewProps {
  template: Template | null;
  pdfUrl: string | null;
  isProcessing: boolean;
}

export function TemplatePreview({
  template,
  pdfUrl,
  isProcessing,
}: TemplatePreviewProps) {
  return (
    <div className="bg-[var(--card)] rounded-[32px] border border-[var(--border)] shadow-2xl dark:shadow-black/40 h-[calc(100vh-180px)] min-h-[650px] flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-700 ease-out transition-colors">
      {/* Top bar */}
      <div className="bg-slate-900 dark:bg-slate-950 px-8 py-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-accent rounded-md text-[10px] font-black text-white uppercase tracking-widest">
            {pdfUrl ? "PDF Generado" : "Preview Mode"}
          </div>
          <p className="text-xs font-medium text-slate-400">
            {pdfUrl ? "Resultado final" : "Certificado 1 de 24"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing ? (
            <>
              <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-tight">
                Generando PDF...
              </span>
            </>
          ) : pdfUrl ? (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">
                PDF listo
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">
                Cruce de datos exitoso
              </span>
            </>
          )}
        </div>
      </div>

      {/* Document area */}
      <div className="flex-1 bg-slate-200/50 dark:bg-black/35 p-4 md:p-8 overflow-hidden flex justify-center">
        <div className="bg-white shadow-2xl w-full max-w-[900px] h-full rounded-xl border border-slate-100 overflow-hidden relative">
          {/* Processing overlay */}
          {isProcessing && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
              <Loader2 className="w-10 h-10 text-accent animate-spin mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Generando certificados...
              </p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                Esto puede tardar unos segundos
              </p>
            </div>
          )}

          {/* PDF generado */}
          {pdfUrl && !isProcessing && (
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-full h-full border-none"
              title="Certificados generados"
            />
          )}

          {/* Vista previa plantilla — solo si aún no hay PDF */}
          {!pdfUrl && !isProcessing && (
            <>
              {template?.file_url ? (
                <>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-0">
                    <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Cargando documento original...
                    </p>
                  </div>
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(template.file_url)}&embedded=true`}
                    className="relative z-10 w-full h-full border-none"
                    title="Vista previa del certificado"
                    key={template.id}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-slate-200" />
                  </div>
                  <h3 className="text-slate-800 font-bold">
                    Sin plantilla seleccionada
                  </h3>
                  <p className="text-xs text-slate-400 max-w-[200px] mt-2 leading-relaxed">
                    Elige un documento maestro a la izquierda para ver el diseño
                    oficial.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
