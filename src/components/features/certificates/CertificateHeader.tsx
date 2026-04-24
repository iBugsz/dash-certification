// src/components/features/certificates/CertificateHeader.tsx
import {
  Loader2,
  FileSearch,
  FileCheck,
  RefreshCw,
  Download,
} from "lucide-react";

interface CertificateHeaderProps {
  isReady: boolean;
  isProcessing: boolean;
  isMapped: boolean;
  pdfUrl: string | null;
  hasMissingImages: boolean;
  hasImageTags: boolean;
  onAnalyze: () => void;
  onGenerate: () => void;
  onDownload: () => void;
}

export function CertificateHeader({
  isReady,
  isProcessing,
  isMapped,
  pdfUrl,
  hasMissingImages,
  hasImageTags,
  onAnalyze,
  onGenerate,
  onDownload,
}: CertificateHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
      {isReady && (
        <div className="flex gap-3 animate-in fade-in zoom-in duration-500">
          {!isMapped && !pdfUrl && (
            <button
              onClick={onAnalyze}
              disabled={isProcessing || hasMissingImages}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-60"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileSearch className="w-5 h-5" />
              )}
              {hasImageTags
                ? "Analizar Datos e Imágenes"
                : "Analizar Variables"}
            </button>
          )}

          {isMapped && !pdfUrl && (
            <button
              onClick={onGenerate}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileCheck className="w-5 h-5" />
              )}
              Generar PDF Final
            </button>
          )}

          {pdfUrl && (
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold shadow-xl transition-all active:scale-95"
              >
                <Download className="w-5 h-5" />
                Descargar Certificado
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
