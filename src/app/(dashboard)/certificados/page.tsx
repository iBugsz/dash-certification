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
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";
import { CertificateSelectors } from "@/components/features/certificates/CertificateSelectors";
import { ExcelDropzone } from "@/components/features/certificates/ExcelDropzone";
import { ImageUploadSection } from "@/components/features/certificates/ImageUploadSection";
import { PreviewButton } from "@/components/features/certificates/PreviewButton";
import { PreviewDrawer } from "@/components/features/certificates/PreviewDrawer";
import { Button } from "@/components/ui/button";

const STEPS = [{ id: 1 }, { id: 2 }, { id: 3 }];

export default function CertificatesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [processingProgress, setProcessingProgress] = useState(0);
  const isAutoExecuting = useRef(false);

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
  } = useCertificates();

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
  }, [isMapped, pdfUrl, isProcessing]);

  useEffect(() => {
    if (pdfUrl && currentStep === 2) {
      setCurrentStep(3);
      isAutoExecuting.current = false;
    }
  }, [pdfUrl, currentStep]);

  const handleFullProcess = async () => {
    if (isProcessing) return;
    isAutoExecuting.current = true;
    try {
      await handleAnalyze(imageFiles);
      await handleGenerate();
    } catch (error) {
      console.error("Error:", error);
      isAutoExecuting.current = false;
    }
  };

  const getStepperWidth = () => {
    if (currentStep === 1) return "0%";
    if (currentStep === 3) return "100%";
    return isProcessing ? `${50 + processingProgress / 2.5}%` : "50%";
  };

  return (
    <div className="p-4 md:p-8 space-y-10 bg-[#f4f7fe] min-h-screen font-sans">
      {/* STEPPER */}
      <div className="relative flex justify-between max-w-xs mx-auto items-center mb-12">
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#e9edf7] -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-[3px] bg-[#4318ff] -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{ width: getStepperWidth() }}
        />
        {STEPS.map((step) => (
          <div key={step.id} className="relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 transition-all ${currentStep >= step.id ? "bg-[#4318ff] text-white border-white shadow-lg" : "bg-white text-[#a3aed0] border-[#e9edf7]"}`}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </div>
          </div>
        ))}
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-[#e9edf7]/50 border border-[#e9edf7] min-h-[500px] max-w-4xl mx-auto relative overflow-hidden">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <Loader2 className="w-16 h-16 text-[#4318ff] animate-spin mb-4" />
            <h3 className="text-2xl font-black text-[#1b2559]">
              Procesando Certificados
            </h3>
            <p className="text-[#a3aed0] font-medium">
              {processingProgress}% completado
            </p>
          </div>
        )}

        {currentStep === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#1b2559]">
                Configurar Plantilla
              </h2>
              <p className="text-[#a3aed0]">
                Selecciona los parámetros básicos para iniciar.
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
                // PASA ESTA LÍNEA AQUÍ:
                onViewTemplate: () => setShowPreview(true),
              }}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-in fade-in duration-500 space-y-10">
            {/* SECCIÓN EXCEL SIEMPRE ARRIBA */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#1b2559]">
                  Carga de Datos
                </h2>
                <p className="text-[#a3aed0] text-sm">
                  Sube tu archivo .xlsx con la información de los vehículos.
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <ExcelDropzone
                  onFileSelect={setExcelFile}
                  currentFile={excelFile}
                />
              </div>
            </div>

            {/* SECCIÓN IMÁGENES SOLO SI EXISTEN */}
            {hasImages && (
              <div className="pt-10 border-t border-[#e9edf7] space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#1b2559]">
                    Fotografías Requeridas
                  </h2>
                  <p className="text-[#a3aed0] text-sm">
                    Esta plantilla necesita las siguientes imágenes para
                    completarse.
                  </p>
                </div>
                <div className="max-w-2xl mx-auto">
                  <ImageUploadSection
                    imageTags={imageTags}
                    imageFiles={imageFiles}
                    onImageUpload={(tag, file) =>
                      setImageFiles((p) => ({ ...p, [tag]: file }))
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-[#05cd9915] rounded-full flex items-center justify-center mb-6 border border-[#05cd9930]">
              <FileCheck className="w-12 h-12 text-[#05cd99]" />
            </div>
            <h2 className="text-3xl font-black text-[#1b2559] mb-2">
              ¡Todo listo!
            </h2>
            <p className="text-[#a3aed0] mb-10">
              Tus documentos PDF han sido generados correctamente.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={handleDownload}
                className="bg-[#1b2559] text-white px-12 py-8 rounded-[24px] font-bold shadow-xl active:scale-95 transition-all"
              >
                <Download className="mr-3" /> DESCARGAR DOCUMENTOS
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                  setExcelFile(null);
                  setSelectedTemplate(null);
                }}
                className="px-12 py-8 rounded-[24px] font-bold border-[#e9edf7]"
              >
                NUEVA CARGA
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* NAVEGACIÓN INFERIOR (SE OCULTA EN CARGA) */}
      {!isProcessing && currentStep < 3 && (
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="ghost"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((p) => p - 1)}
            className="rounded-2xl font-bold text-[#a3aed0]"
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
            className="px-12 py-7 rounded-[22px] font-black bg-[#4318ff] hover:bg-[#3a10e5] text-white shadow-xl shadow-[#4318ff20] active:scale-95 transition-all"
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
        {...{ selectedTemplate, pdfUrl, isProcessing, isMapped }}
      />
    </div>
  );
}
