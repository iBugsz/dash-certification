"use client";

import { useState } from "react";
import { useCertificates } from "@/hooks/useCertificates";
import { FileSpreadsheet, Image as ImageIcon } from "lucide-react";
import { CertificateSelectors } from "@/components/features/certificates/CertificateSelectors";
import { ExcelDropzone } from "@/components/features/certificates/ExcelDropzone";
import { FeatureTips } from "@/components/features/certificates/FeatureTips";
import { ImageUploadSection } from "@/components/features/certificates/ImageUploadSection";
import { CertificateHeader } from "@/components/features/certificates/CertificateHeader";
import { PreviewButton } from "@/components/features/certificates/PreviewButton";
import { PreviewDrawer } from "@/components/features/certificates/PreviewDrawer";

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
    processWarning,
    handleAnalyze,
    handleGenerate,
    handleDownload,
  } = useCertificates();

  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [showPreview, setShowPreview] = useState(false);

  const imageTags = selectedTemplate?.mapping
    ? Object.entries(selectedTemplate.mapping)
        .filter(([_, value]: any) => value.type === "image")
        .map(([key, value]: any) => ({ tag: key, label: value.label }))
    : [];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 space-y-10 font-poppins relative">
      {/* HEADER PRINCIPAL: Este es el único que debe tener el título */}
      <div className="flex flex-row items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-950 dark:text-white">
            Certificación Masiva
          </h1>
          <p className="text-xs text-slate-500 font-medium italic">
            Automatización de homologación vehicular v2.4
          </p>
        </div>

        {selectedTemplate && (
          <PreviewButton
            onClick={() => setShowPreview(true)}
            isMapped={isMapped}
          />
        )}
      </div>

      <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

      <div className="grid grid-cols-1 gap-10">
        {/* SECCIÓN 1: CONFIGURACIÓN */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
              Configuración de Plantilla
            </h2>
          </div>
          <div className="bg-white dark:bg-slate-900/40 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50">
            <CertificateSelectors
              {...{
                companies,
                selectedCompany,
                setSelectedCompany,
                loadingCompanies,
                templates,
                selectedTemplate,
                setSelectedTemplate,
                loadingTemplates,
              }}
            />
          </div>
        </section>

        {/* SECCIÓN 2: CARGA */}
        {selectedTemplate && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                  Carga de Datos
                </h2>
              </div>

              {/* AQUÍ ESTÁ EL CAMBIO: CertificateHeader debe renderizar SOLO los botones */}
              <div className="flex items-center gap-2">
                <CertificateHeader
                  isReady={!!excelFile}
                  isProcessing={isProcessing}
                  isMapped={isMapped}
                  pdfUrl={pdfUrl}
                  hasImageTags={imageTags.length > 0}
                  hasMissingImages={imageTags.some(
                    (img) => !imageFiles[img.tag],
                  )}
                  onAnalyze={() => handleAnalyze(imageFiles)}
                  onGenerate={handleGenerate}
                  onDownload={handleDownload}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExcelDropzone
                onFileSelect={setExcelFile}
                currentFile={excelFile}
              />
              {imageTags.length > 0 && (
                <ImageUploadSection
                  imageTags={imageTags}
                  imageFiles={imageFiles}
                  onImageUpload={(tag, file) =>
                    setImageFiles((p) => ({ ...p, [tag]: file }))
                  }
                />
              )}
            </div>
          </section>
        )}

        {/* Alertas */}
        {processWarning && (
          <div
            className={`p-4 rounded-2xl border-l-4 animate-pulse-subtle ${processWarning.includes("✅") ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "bg-amber-50 border-amber-400 text-amber-900"}`}
          >
            <p className="text-sm font-bold">{processWarning}</p>
          </div>
        )}

        {!selectedTemplate && !excelFile && (
          <div className="pt-10">
            <FeatureTips />
          </div>
        )}
      </div>

      <PreviewDrawer
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        {...{ selectedTemplate, pdfUrl, isProcessing, isMapped }}
      />
    </div>
  );
}
