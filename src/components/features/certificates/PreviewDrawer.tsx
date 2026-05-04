"use client";

import { useEffect } from "react";
import { X, LayoutPanelLeft } from "lucide-react";
import { TemplatePreview } from "./TemplatePreview";

export function PreviewDrawer({
  isOpen,
  onClose,
  selectedTemplate,
  pdfUrl,
  isProcessing,
}: any) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* OVERLAY: Fondo semi-transparente sin desenfoque (blur) para limpieza total */}
      <div
        className={`fixed inset-0 w-screen h-screen z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} // Fondo más suave
      />

      {/* MODAL: Se eliminó la sombra pesada shadow-[-25px_...] */}
      <div
        className={`fixed inset-y-0 right-0 h-full w-full md:w-[650px] lg:w-[700px] z-[110] transform transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] border-l ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)", // Usamos borde en lugar de sombra difuminada
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header Superior */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{
              borderBottomColor: "var(--border)",
              borderBottomWidth: "1px",
              backgroundColor: "var(--card)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 flex items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "var(--accent)",
                }}
              >
                <LayoutPanelLeft className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h2
                  className="text-[13px] font-black uppercase tracking-tight truncate max-w-[300px]"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedTemplate?.name}
                </h2>
                <p
                  className="text-[9px] font-bold uppercase tracking-widest leading-none"
                  style={{ color: "var(--sidebar-fg-muted)" }}
                >
                  Vista Previa • AutoCert Pro
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Cerrar <X className="w-4 h-4" />
            </button>
          </div>

          {/* Área del Visor */}
          <div
            className="flex-1 overflow-hidden"
            style={{ backgroundColor: "var(--input-bg)" }}
          >
            <TemplatePreview
              template={selectedTemplate}
              pdfUrl={pdfUrl}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </>
  );
}
