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
    <header
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6"
      style={{ borderBottomColor: "var(--border)", borderBottomWidth: "1px" }}
    >
      {isReady && (
        <div className="flex gap-3 animate-in fade-in zoom-in duration-500">
          {!isMapped && !pdfUrl && (
            <button
              onClick={onAnalyze}
              disabled={isProcessing || hasMissingImages}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: "var(--accent)" }}
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
              className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
              style={{ backgroundColor: "#05cd99" }}
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
                className="p-3 rounded-xl transition-all"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--foreground)",
                }}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold shadow-xl transition-all active:scale-95"
                style={{ backgroundColor: "var(--foreground)" }}
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
