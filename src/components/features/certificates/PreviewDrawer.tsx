import { X } from "lucide-react";
import { TemplatePreview } from "./TemplatePreview";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: any;
  pdfUrl: string | null;
  isProcessing: boolean;
  isMapped: boolean;
}

export function PreviewDrawer({
  isOpen,
  onClose,
  selectedTemplate,
  pdfUrl,
  isProcessing,
  isMapped,
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[700px] bg-white dark:bg-slate-950 shadow-[-30px_0_60px_rgba(0,0,0,0.2)] z-50 transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border-l border-slate-200 dark:border-slate-800 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white rounded-2xl transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-10 pb-6">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
              Inspección de Documento
            </span>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">
              {isMapped ? "Datos Mapeados" : "Pre-visualización"}
            </h2>
            <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-0 bg-transparent">
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl h-[85%] bg-slate-50 dark:bg-slate-900">
              <TemplatePreview
                template={selectedTemplate}
                pdfUrl={pdfUrl}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 transition-opacity duration-700"
          onClick={onClose}
        />
      )}
    </>
  );
}
