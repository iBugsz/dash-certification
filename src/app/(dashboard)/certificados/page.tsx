"use client";

import { useState } from "react"; // Necesario para manejar las imágenes
import {
  Download,
  Loader2,
  AlertTriangle,
  FileSearch,
  FileCheck,
  RefreshCw,
  ImagePlus,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { useCertificates } from "@/hooks/useCertificates";
import { CertificateSelectors } from "@/components/features/certificates/CertificateSelectors";
import { CompanyBadge } from "@/components/features/certificates/CompanyBadge";
import { ExcelDropzone } from "@/components/features/certificates/ExcelDropzone";
import { FeatureTips } from "@/components/features/certificates/FeatureTips";
import { EmptyPreview } from "@/components/features/certificates/EmptyPreview";
import { TemplatePreview } from "@/components/features/certificates/TemplatePreview";

export default function CertificatesPage() {
  const {
    excelFile,
    setExcelFile,
    companies,
    selectedCompany,
    setSelectedCompany,
    loadingCompanies,
    templates,
    selectedTemplate,
    setSelectedTemplate,
    loadingTemplates,
    isProcessing,
    isMapped,
    pdfUrl,
    processError,
    processWarning,
    isReady,
    handleAnalyze,
    handleGenerate,
    handleDownload,
  } = useCertificates();

  // --- LÓGICA DE IMÁGENES ---
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});

  // Detectamos etiquetas de tipo "image" en el mapeo de Supabase
  const imageTags = selectedTemplate?.mapping
    ? Object.entries(selectedTemplate.mapping)
        .filter(([_, value]: any) => value.type === "image")
        .map(([key, value]: any) => ({ tag: key, label: value.label }))
    : [];

  const handleImageUpload = (tag: string, file: File) => {
    setImageFiles((prev) => ({ ...prev, [tag]: file }));
  };

  // Validar si faltan imágenes antes de analizar
  const missingImages = imageTags.some((img) => !imageFiles[img.tag]);

  return (
    <div className="w-full max-w-(--breakpoint-2xl) mx-auto p-4 md:p-8 space-y-6 font-poppins text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-[var(--border)] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Certificación Masiva
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Automatización de homologación vehicular v2.4
          </p>
        </div>

        {/* Acciones principales */}
        {isReady && (
          <div className="flex gap-3 animate-in fade-in zoom-in duration-500">
            {!isMapped && !pdfUrl && (
              <button
                onClick={() => handleAnalyze(imageFiles)} // Pasamos las imágenes al análisis
                disabled={
                  isProcessing || (imageTags.length > 0 && missingImages)
                }
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-60"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileSearch className="w-5 h-5" />
                )}
                {imageTags.length > 0
                  ? "Analizar Datos e Imágenes"
                  : "Analizar Variables"}
              </button>
            )}

            {isMapped && !pdfUrl && (
              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 animate-pulse-subtle"
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
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold shadow-xl transition-all active:scale-95 hover:opacity-90"
                >
                  <Download className="w-5 h-5" />
                  Descargar Certificado
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Alertas */}
      {processWarning && (
        <div
          className={`flex items-start gap-3 px-5 py-4 border-l-4 rounded-r-2xl animate-in slide-in-from-left-2 duration-300 ${
            processWarning.includes("✅")
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500"
              : "bg-amber-50 dark:bg-amber-950/20 border-amber-400"
          }`}
        >
          {/* ... contenido de alerta ... */}
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-tight">
              {processWarning.includes("✅") ? "Datos Vinculados" : "Atención"}
            </p>
            <p className="text-xs mt-1">{processWarning}</p>
          </div>
        </div>
      )}

      {/* Cuerpo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          className={`${excelFile ? "lg:col-span-4" : "lg:col-span-6"} space-y-6 transition-all duration-700`}
        >
          <div className="bg-white dark:bg-slate-900/50 p-1 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <CertificateSelectors
              companies={companies}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              loadingCompanies={loadingCompanies}
              templates={templates}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              loadingTemplates={loadingTemplates}
            />
          </div>

          {selectedCompany && <CompanyBadge company={selectedCompany} />}

          <ExcelDropzone onFileSelect={setExcelFile} currentFile={excelFile} />

          {/* --- SECCIÓN DINÁMICA DE IMÁGENES --- */}
          {excelFile && imageTags.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 px-2">
                <ImagePlus className="w-4 h-4 text-blue-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Multimedia Requerida
                </h3>
              </div>

              <div className="grid gap-3">
                {imageTags.map(({ tag, label }) => (
                  <div
                    key={tag}
                    className={`relative flex flex-col p-4 rounded-2xl border-2 border-dashed transition-all ${
                      imageFiles[tag]
                        ? "bg-emerald-50/50 border-emerald-500/50 dark:bg-emerald-950/10"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 pr-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                          {tag}
                        </p>
                        <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200 truncate">
                          {label}
                        </p>
                      </div>
                      {imageFiles[tag] ? (
                        <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                      ) : (
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                          <ImageIcon className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(tag, file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {imageFiles[tag] && (
                      <p className="mt-2 text-[10px] font-medium text-emerald-600 truncate italic">
                        ✓ {imageFiles[tag].name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!excelFile && <FeatureTips />}
        </div>

        {/* Panel de Vista Previa */}
        <div
          className={`${excelFile ? "lg:col-span-8" : "lg:col-span-6"} transition-all duration-700 h-full min-h-[500px]`}
        >
          {!isMapped ? (
            <EmptyPreview />
          ) : (
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl animate-in fade-in duration-1000">
              <TemplatePreview
                template={selectedTemplate}
                pdfUrl={pdfUrl}
                isProcessing={isProcessing}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
