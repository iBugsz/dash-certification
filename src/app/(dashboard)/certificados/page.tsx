"use client";

import { useState, useEffect, useRef } from "react";
import { useCertificates } from "@/hooks/useCertificates";
import { ChevronRight, ChevronLeft, Tag } from "lucide-react";
import { CertificateSelectors } from "@/components/features/certificates/CertificateSelectors";
import { ExcelDropzone } from "@/components/features/certificates/ExcelDropzone";
import { ImageUploadSection } from "@/components/features/certificates/ImageUploadSection";
import { PreviewDrawer } from "@/components/features/certificates/PreviewDrawer";
import { CertificateStepper } from "@/components/features/certificates/CertificateStepper";
import { ProcessingOverlay } from "@/components/features/certificates/ProcessingOverlay";
import { Step3Success } from "@/components/features/certificates/Step3Success";
import { PresetManager } from "@/components/features/templates/PresetManager";
import { Button } from "@/components/ui/button";

export default function CertificatesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [processingProgress, setProcessingProgress] = useState(0);
  const [step3Revealed, setStep3Revealed] = useState(false);
  const isAutoExecuting = useRef(false);

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
    setIsMapped,
    setWordGenerated,
    wordGenerated,
  } = hookData;

  const getStepperWidth = () => {
    if (currentStep === 1) return "0%";
    if (currentStep === 3) return "100%";
    return isProcessing ? `${50 + processingProgress / 2.5}%` : "50%";
  };

  const handleResetAll = () => {
    setCurrentStep(1);
    setShowPreview(false);
    setImageFiles({});
    setProcessingProgress(0);
    setStep3Revealed(false);
    isAutoExecuting.current = false;
    setExcelFile(null);
    setSelectedTemplate(null);
    setSelectedCompany(null);
    setPdfUrl(null);
    setIsMapped(false);
    setWordGenerated(null);
  };

  const handleDownloadWordLocal = () => {
    if (!wordGenerated) {
      console.error("No hay ningún archivo Word generado.");
      return;
    }
    const url = window.URL.createObjectURL(wordGenerated);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Certificado_${selectedCompany?.name.replace(/\s+/g, "_") || "Documento"}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

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

  const imageTags = selectedTemplate?.mapping
    ? Object.entries(selectedTemplate.mapping)
        .filter(([_, value]: any) => value.type === "image")
        .map(([key, value]: any) => ({ tag: key, label: value.label }))
    : [];

  const hasImages = imageTags.length > 0;

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

  useEffect(() => {
    if (isMapped && !pdfUrl && isAutoExecuting.current && !isProcessing) {
      handleGenerate();
    }
  }, [isMapped, pdfUrl, isProcessing, handleGenerate]);

  useEffect(() => {
    if (pdfUrl && currentStep === 2) {
      setStep3Revealed(false);
      setCurrentStep(3);
      isAutoExecuting.current = false;
      setTimeout(() => setStep3Revealed(true), 50);
    }
  }, [pdfUrl, currentStep]);

  return (
    <div
      className="p-4 md:p-8 space-y-10 min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
     <div className="flex justify-center items-center max-w-4xl mx-auto px-4">
        {/* Ajustamos el ancho para que el stepper pueda expandir sus líneas */}
        <div className="w-full max-w-sm">
          <CertificateStepper
            currentStep={currentStep}
            isProcessing={isProcessing}
            getStepperWidth={getStepperWidth}
          />
        </div>
      </div>

      <div
        className="rounded-[40px] p-8 md:p-12 shadow-2xl min-h-[520px] max-w-4xl mx-auto relative overflow-hidden transition-colors duration-300 border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        {isProcessing && <ProcessingOverlay progress={processingProgress} />}

        {currentStep === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10">
              <h2 className="text-2xl font-bold">Configurar Plantilla Prueba</h2>
              <p className="opacity-70 text-sm">
                Selecciona los parámetros para iniciar.
              </p>
            </div>
            <CertificateSelectors
              companies={companies}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              templates={templates}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              onViewTemplate={() => setShowPreview(true)}
            />
          </div>
        )}

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

        {currentStep === 3 && (
          <Step3Success
            step3Revealed={step3Revealed}
            onPreview={() => setShowPreview(true)}
            onDownloadPdf={handleDownload}
            onDownloadWord={handleDownloadWordLocal}
            onReset={handleResetAll}
          />
        )}
      </div>

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
              <span>Siguiente</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </Button>
        </div>
      )}

      <PreviewDrawer
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        selectedTemplate={selectedTemplate}
        pdfUrl={pdfUrl}
        isProcessing={isProcessing}
        isMapped={isMapped}
      />

      {showPresetManager && (
        <PresetManager onClose={() => setShowPresetManager(false)} />
      )}
    </div>
  );
}