"use client";

import { FileText, Loader2 } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export function TemplatePreview({ template, pdfUrl, isProcessing }: any) {
  const currentFile = pdfUrl || template?.preview_url;

  return (
    <div className="w-full h-full custom-pdf-viewer">
      {isProcessing && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <Loader2
            className="w-10 h-10 animate-spin mb-4"
            style={{ color: "var(--accent)" }}
          />
          <p
            className="text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: "var(--foreground)" }}
          >
            Cargando...
          </p>
        </div>
      )}

      {currentFile ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={currentFile}
            theme={
              typeof window !== "undefined" &&
              document.documentElement.classList.contains("dark")
                ? "dark"
                : "light"
            }
          />
        </Worker>
      ) : (
        <div className="flex flex-col items-center justify-center h-full opacity-30">
          <FileText
            className="w-16 h-16 mb-4"
            style={{ color: "var(--sidebar-fg-muted)" }}
          />
        </div>
      )}
    </div>
  );
}
