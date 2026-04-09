"use client";

import {
  Download,
  Loader2,
  AlertTriangle,
  FileSearch,
  FileCheck,
  RefreshCw,
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

        {/* Acciones principales - Flujo Lineal */}
        {isReady && (
          <div className="flex gap-3 animate-in fade-in zoom-in duration-500">
            {/* PASO 1: Analizar (Visible solo si no se ha mapeado y no hay PDF) */}
            {!isMapped && !pdfUrl && (
              <button
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-60"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileSearch className="w-5 h-5" />
                )}
                Analizar Variables
              </button>
            )}

            {/* PASO 2: Generar PDF (Visible solo después de un análisis exitoso) */}
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

            {/* PASO 3: Resultado y Descarga */}
            {pdfUrl && (
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                  title="Nuevo proceso"
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

      {/* Alertas de Inconsistencias (Mapeo Supabase vs Excel) */}
      {/* ... resto del código anterior ... */}
      {processWarning && (
        <div
          className={`flex items-start gap-3 px-5 py-4 border-l-4 rounded-r-2xl animate-in slide-in-from-left-2 duration-300 ${
            processWarning.includes("✅")
              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 shadow-sm shadow-emerald-100/50"
              : "bg-amber-50 dark:bg-amber-950/20 border-amber-400"
          }`}
        >
          {processWarning.includes("✅") ? (
            <div className="bg-emerald-500 p-1 rounded-lg">
              <FileCheck className="w-5 h-5 text-white shrink-0" />
            </div>
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            <p
              className={`text-sm font-bold uppercase tracking-tight ${
                processWarning.includes("✅")
                  ? "text-emerald-800 dark:text-emerald-400"
                  : "text-amber-800 dark:text-amber-400"
              }`}
            >
              {processWarning.includes("✅")
                ? "Datos Vinculados Correctamente"
                : "Atención con el Excel"}
            </p>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                processWarning.includes("✅")
                  ? "text-emerald-700/90 dark:text-emerald-300/80"
                  : "text-amber-700/80 dark:text-amber-300/80"
              }`}
            >
              {processWarning}
            </p>
          </div>
        </div>
      )}
      {/* ... resto del código ... */}
      {/* Banner de Error Crítico (Falta de mapeo en Supabase, etc) */}
      {processError && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-2xl animate-in shake duration-500">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <div>
            <p className="text-sm font-bold text-red-800 dark:text-red-400 uppercase tracking-tight">
              Error de Configuración
            </p>
            <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-1">
              {processError}
            </p>
          </div>
        </div>
      )}

      {/* Cuerpo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Panel de Selección (Izquierda) */}
        <div
          className={`${
            excelFile ? "lg:col-span-4" : "lg:col-span-6"
          } space-y-6 transition-all duration-700 ease-in-out`}
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

          {selectedCompany && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <CompanyBadge company={selectedCompany} />
            </div>
          )}

          <ExcelDropzone onFileSelect={setExcelFile} currentFile={excelFile} />

          {!excelFile && <FeatureTips />}
        </div>

        {/* Panel de Vista Previa (Derecha) */}
        <div
          className={`${
            excelFile ? "lg:col-span-8" : "lg:col-span-6"
          } transition-all duration-700 ease-in-out h-full min-h-[500px]`}
        >
          {/* MODIFICACIÓN: 
              Incluso si hay excelFile, si NO ha sido analizado exitosamente (isMapped),
              mantenemos el EmptyPreview para evitar que se vea el Word base sin datos.
          */}
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
