"use client";

import { useState, useEffect, useRef } from "react";
import { useCertificates } from "@/hooks/useCertificates";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  FileCheck,
  Loader2,
  Download,
  FileText,
  FileSearch,
  RotateCcw,
} from "lucide-react";
import { CertificateSelectors } from "@/components/features/certificates/CertificateSelectors";
import { ExcelDropzone } from "@/components/features/certificates/ExcelDropzone";
import { ImageUploadSection } from "@/components/features/certificates/ImageUploadSection";
import { PreviewDrawer } from "@/components/features/certificates/PreviewDrawer";
import { Button } from "@/components/ui/button";

const STEPS = [{ id: 1 }, { id: 2 }, { id: 3 }];

export default function CertificatesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [processingProgress, setProcessingProgress] = useState(0);
  const [step3Revealed, setStep3Revealed] = useState(false);
  const isAutoExecuting = useRef(false);
  const getStepperWidth = () => {
    if (currentStep === 1) return "0%";
    if (currentStep === 3) return "100%";
    return isProcessing ? `${50 + processingProgress / 2.5}%` : "50%";
  };

  // Desestructuramos el hook completo; sacamos wordUrl/setWordUrl con cast seguro
  const hookData = useCertificates();
  const {
    excelFile,
    setExcelFile,
    companies,
    selectedCompany,
    setSelectedCompany,
    templates,
    selectedTemplate,
    setSelectedTemplate,
    isProcessing,
    isMapped,
    pdfUrl,
    handleAnalyze,
    handleGenerate,
    handleDownload,
    setPdfUrl,
  } = hookData;

  const wordUrl: string | null = (hookData as any).wordUrl ?? null;
  const setWordUrl: ((v: string | null) => void) | null =
    (hookData as any).setWordUrl ?? null;
  const handleDownloadWordFromHook: (() => void) | null =
    (hookData as any).handleDownloadWord ?? null;

  // ─── REINICIO TOTAL CORREGIDO ──────────────────────────────────────────────
  const handleResetAll = () => {
    // 1. Estados Locales de la UI
    setCurrentStep(1);
    setShowPreview(false);
    setImageFiles({});
    setProcessingProgress(0);
    setStep3Revealed(false);
    isAutoExecuting.current = false;

    // 2. Estados del Hook (Limpieza profunda)
    // Usamos los setters que vienen del hook para poner todo en blanco
    if (hookData.setExcelFile) hookData.setExcelFile(null);
    if (hookData.setSelectedTemplate) hookData.setSelectedTemplate(null);
    if (hookData.setSelectedCompany) hookData.setSelectedCompany(null);

    // ESTO ES LO MÁS IMPORTANTE:
    if (hookData.setPdfUrl) hookData.setPdfUrl(null);
    if (hookData.setIsMapped) hookData.setIsMapped(false); // Evita que salte al paso 3
    if (hookData.setWordGenerated) hookData.setWordGenerated(null); // Limpia el Word anterior

    // Si usabas wordUrl localmente:
    if (setWordUrl) setWordUrl(null);
  };

  // ─── DESCARGA WORD ─────────────────────────────────────────────────────────
  const handleDownloadWordLocal = () => {
    // 1. Verificamos que el Word realmente exista en el hook
    if (!hookData.wordGenerated) {
      console.error("No hay ningún archivo Word generado.");
      return;
    }

    // 2. Creamos una URL temporal para el Blob
    const url = window.URL.createObjectURL(hookData.wordGenerated);

    // 3. Creamos el link de descarga
    const link = document.createElement("a");
    link.href = url;

    // Le ponemos un nombre bonito al archivo
    const fileName = `Certificado_${selectedCompany?.name.replace(/\s+/g, "_") || "Documento"}.docx`;
    link.download = fileName;

    // 4. Simulamos el click y limpiamos
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Importante: Liberar la memoria de la URL creada
    window.URL.revokeObjectURL(url);
  };

  const imageTags = selectedTemplate?.mapping
    ? Object.entries(selectedTemplate.mapping)
        .filter(([_, value]: any) => value.type === "image")
        .map(([key, value]: any) => ({ tag: key, label: value.label }))
    : [];

  const hasImages = imageTags.length > 0;

  // ─── PROGRESO FALSO ────────────────────────────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setProcessingProgress((prev) => (prev < 95 ? prev + 1 : prev));
      }, 150);
    } else {
      setProcessingProgress(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // ─── AUTO-GENERATE ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isMapped && !pdfUrl && isAutoExecuting.current && !isProcessing) {
      handleGenerate();
    }
  }, [isMapped, pdfUrl, isProcessing, handleGenerate]);

  // ─── IR AL PASO 3 solo cuando tengamos pdfUrl Y estemos en paso 2 ──────────
  useEffect(() => {
    if (pdfUrl && currentStep === 2) {
      setStep3Revealed(false);
      setCurrentStep(3);
      isAutoExecuting.current = false;
      setTimeout(() => setStep3Revealed(true), 50);
    }
  }, [pdfUrl, currentStep]);

  // ─── PROCESO COMPLETO ──────────────────────────────────────────────────────
  const handleFullProcess = async () => {
    if (isProcessing) return;
    isAutoExecuting.current = true;
    try {
      await handleAnalyze(imageFiles);
    } catch (error) {
      console.error("Error:", error);
      isAutoExecuting.current = false;
    }
  };

  return (
    <div
      className="p-4 md:p-8 space-y-10 min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Keyframe: la línea del stepper "late" entre 50% y ~82% mientras procesa */}
      <style>{`
        @keyframes stepperPulse {
          0%   { width: 50%; }
          50%  { width: 82%; }
          100% { width: 50%; }
        }
        .stepper-pulse {
          animation: stepperPulse 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* ── STEPPER ── */}
      <div className="relative flex justify-between max-w-xs mx-auto items-center mb-12">
        {/* Línea base */}
        <div
          className="absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2 z-0"
          style={{ backgroundColor: "var(--border)" }}
        />

        {/* Línea de progreso animada */}
        <div
          className="absolute top-1/2 left-0 h-[3px] transition-all duration-300 ease-out z-0"
          style={{ width: getStepperWidth(), backgroundColor: "var(--accent)" }}
        />

        {STEPS.map((step) => (
          <div key={step.id} className="relative z-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 transition-all"
              style={{
                backgroundColor:
                  currentStep >= step.id ? "var(--accent)" : "var(--card)",
                borderColor:
                  currentStep >= step.id ? "var(--card)" : "var(--border)",
                color:
                  currentStep >= step.id ? "white" : "var(--sidebar-fg-muted)",
              }}
            >
              {step.id === 3 && isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── CONTENEDOR PRINCIPAL ── */}
      <div
        className="rounded-[40px] p-8 md:p-12 shadow-2xl min-h-[520px] max-w-4xl mx-auto relative overflow-hidden transition-colors duration-300 border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Overlay de carga */}
        {isProcessing && (
          <div
            className="absolute inset-0 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          >
            <Loader2
              className="w-16 h-16 animate-spin mb-4"
              style={{ color: "var(--accent)" }}
            />
            <h3 className="text-2xl font-black">Procesando Certificados</h3>
            <p className="font-medium opacity-60">
              {processingProgress}% completado
            </p>
          </div>
        )}

        {/* ── PASO 1 ── */}
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10">
              <h2 className="text-2xl font-bold">Configurar Plantilla</h2>
              <p className="opacity-70 text-sm">
                Selecciona los parámetros para iniciar.
              </p>
            </div>
            <CertificateSelectors
              {...{
                companies,
                selectedCompany,
                setSelectedCompany,
                templates,
                selectedTemplate,
                setSelectedTemplate,
                onViewTemplate: () => setShowPreview(true),
              }}
            />
          </div>
        )}

        {/* ── PASO 2 ── */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-500 space-y-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Carga de Datos</h2>
              <p className="text-sm opacity-60">
                Sube tu archivo .xlsx y fotografías.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <ExcelDropzone
                onFileSelect={setExcelFile}
                currentFile={excelFile}
              />
            </div>
            {hasImages && (
              <div
                className="pt-10 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <ImageUploadSection
                  imageTags={imageTags}
                  imageFiles={imageFiles}
                  onImageUpload={(tag, file) =>
                    setImageFiles((p) => ({ ...p, [tag]: file }))
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* ── PASO 3 ── */}
        {currentStep === 3 && (
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

            {/* Título — aparece primero (delay 0ms) */}
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
                Los archivos se han generado correctamente. Utiliza las opciones
                de abajo para gestionarlos.
              </p>
            </div>

            {/* Botones — aparecen después (delay 140ms) */}
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
                onClick={() => setShowPreview(true)}
                title="Vista previa del PDF"
                variant="ghost"
                className="w-12 h-12 rounded-2xl hover:bg-white transition-all cursor-pointer"
              >
                <FileSearch className="w-5 h-5 text-slate-600" />
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <Button
                onClick={handleDownload}
                title="Descargar en PDF"
                variant="ghost"
                className="w-12 h-12 rounded-2xl hover:bg-red-50 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 text-red-500" />
              </Button>

              <Button
                onClick={handleDownloadWordLocal}
                title="Descargar en Word"
                variant="ghost"
                className="w-12 h-12 rounded-2xl hover:bg-blue-50 transition-all cursor-pointer"
              >
                <FileText className="w-5 h-5 text-blue-600" />
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <Button
                onClick={handleResetAll}
                title="Reiniciar todo el proceso"
                variant="ghost"
                className="w-12 h-12 rounded-2xl hover:bg-slate-200 transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 text-slate-700" />
              </Button>
            </div>

            {/* Label — aparece al final (delay 260ms) */}
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
        )}
      </div>

      {/* ── NAVEGACIÓN INFERIOR ── */}
      {!isProcessing && currentStep < 3 && (
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="ghost"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((p) => p - 1)}
            className="rounded-xl font-bold opacity-60 cursor-pointer"
          >
            <ChevronLeft className="mr-2 w-4 h-4" /> Atrás
          </Button>

          <Button
            onClick={
              currentStep === 2 ? handleFullProcess : () => setCurrentStep(2)
            }
            disabled={
              (currentStep === 1 && !selectedTemplate) ||
              (currentStep === 2 && (!excelFile || isProcessing))
            }
            className="px-10 py-6 rounded-2xl font-black text-white shadow-xl active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <div className="flex items-center gap-2">
              <span>
                {currentStep === 2 ? "Generar Documentos" : "Siguiente"}
              </span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </Button>
        </div>
      )}

      <PreviewDrawer
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        {...{ selectedTemplate, pdfUrl, isProcessing, isMapped }}
      />
    </div>
  );
}
