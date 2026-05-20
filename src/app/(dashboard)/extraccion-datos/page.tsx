"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, UploadCloud, FileSpreadsheet, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DataExtractionPage() {
  // Se usa useState para que TypeScript entienda que el valor puede cambiar
  const [currentStep, setCurrentStep] = useState(1); 

  return (
    <div
      className="p-4 md:p-8 space-y-10 min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* STEPPER VISUAL (Simulado) */}
      <div className="max-w-4xl mx-auto w-full space-y-4">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider opacity-60">
          <span>1. Configurar Extracción</span>
          <span>2. Carga de Imágenes</span>
          <span>3. Exportar Datos</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: currentStep === 1 ? "33%" : currentStep === 2 ? "66%" : "100%",
              backgroundColor: "var(--accent)" 
            }}
          />
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div
        className="rounded-[40px] p-8 md:p-12 shadow-2xl min-h-[520px] max-w-4xl mx-auto relative overflow-hidden transition-colors duration-300 border"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        
        {/* VISTA DEL PASO 1: CONFIGURACIÓN DEL MODELO DE IA */}
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-500 space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Configurar Extracción por IA</h2>
              <p className="opacity-70 text-sm">
                Selecciona el tipo de documento que vas a escanear para optimizar la lectura de la IA.
              </p>
            </div>
            
            {/* Grid de opciones simulado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border cursor-pointer hover:border-primary transition-all bg-background/50">
                <h3 className="font-bold text-lg">Documentos de Identidad</h3>
                <p className="text-sm opacity-60 mt-1">Optimizado para extraer nombres, apellidos, fechas y números de identificación.</p>
              </div>
              <div className="p-6 rounded-2xl border cursor-pointer hover:border-primary transition-all bg-background/50">
                <h3 className="font-bold text-lg">Facturas y Recibos</h3>
                <p className="text-sm opacity-60 mt-1">Extrae automáticamente proveedores, importes, tasas de impuestos y fechas de emisión.</p>
              </div>
              <div className="p-6 rounded-2xl border cursor-pointer hover:border-primary transition-all bg-background/50">
                <h3 className="font-bold text-lg">Formatos de Asistencia / Listas</h3>
                <p className="text-sm opacity-60 mt-1">Ideal para tablas escritas a mano o impresas con filas y columnas de registros.</p>
              </div>
              <div className="p-6 rounded-2xl border cursor-pointer hover:border-primary transition-all bg-background/50">
                <h3 className="font-bold text-lg">Certificados Externos</h3>
                <p className="text-sm opacity-60 mt-1">Estructura datos libres desde documentos legales o PDFs corporativos.</p>
              </div>
            </div>
          </div>
        )}

        {/* VISTA DEL PASO 2: CARGA MASIVA DE IMÁGENES */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-500 space-y-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Carga de Documentos en Lote</h2>
              <p className="text-sm opacity-60">
                Arrastra todas las imágenes, fotografías o PDFs que deseas procesar juntos.
              </p>
            </div>
            
            {/* Zona de Dropzone Simulada */}
            <div className="border-2 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 bg-background/30 cursor-pointer hover:bg-background/50 transition-colors" style={{ borderColor: "var(--border)" }}>
              <div className="p-4 bg-muted rounded-full">
                <UploadCloud className="w-8 h-8 opacity-70" />
              </div>
              <div>
                <p className="font-bold">Selecciona o arrastra tus archivos aquí</p>
                <p className="text-xs opacity-50 mt-1">Soporta múltiples imágenes JPG, PNG o archivos PDF</p>
              </div>
            </div>
          </div>
        )}

        {/* VISTA DEL PASO 3: EXTRACCIÓN EXITOSA Y EXPORTACIONES */}
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-500 text-center space-y-10 py-6">
            <div>
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4">
                ✓
              </div>
              <h2 className="text-3xl font-black">¡Lectura Completada!</h2>
              <p className="opacity-70 text-sm mt-2">
                La IA ha procesado los documentos con éxito. Selecciona el formato de salida para tus datos.
              </p>
            </div>

            {/* Opciones de descarga */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Button variant="outline" className="p-8 rounded-2xl flex flex-col gap-2 h-auto text-center border-emerald-500/20 hover:bg-emerald-500/5">
                <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                <span className="font-bold">Descargar Excel</span>
                <span className="text-xs opacity-50 font-normal">Listo para tus plantillas</span>
              </Button>

              <Button variant="outline" className="p-8 rounded-2xl flex flex-col gap-2 h-auto text-center border-blue-500/20 hover:bg-blue-500/5">
                <FileText className="w-6 h-6 text-blue-500" />
                <span className="font-bold">Reporte PDF</span>
                <span className="text-xs opacity-50 font-normal">Documento formateado</span>
              </Button>

              <Button variant="outline" className="p-8 rounded-2xl flex flex-col gap-2 h-auto text-center border-amber-500/20 hover:bg-amber-500/5">
                <Code className="w-6 h-6 text-amber-500" />
                <span className="font-bold">Exportar Código</span>
                <span className="text-xs opacity-50 font-normal">Estructura JSON cruda</span>
              </Button>
            </div>

            <div className="pt-6">
              <Button variant="link" className="opacity-60 text-sm" onClick={() => setCurrentStep(1)}>
                Procesar nuevos documentos
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* BOTONES DE NAVEGACIÓN INFERIORES */}
      {currentStep < 3 && (
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="ghost"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            className="rounded-xl font-bold opacity-60 cursor-pointer"
          >
            <ChevronLeft className="mr-2 w-4 h-4" /> Atrás
          </Button>

          <Button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 3))}
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
    </div>
  );
}