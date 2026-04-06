"use client";
import { useState } from "react";
import {
  Upload,
  FileType,
  Download,
  FileText,
  CheckCircle2,
  X,
  Info,
  FileStack,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

function ExcelDropzone({
  onFileSelect,
  currentFile,
}: {
  onFileSelect: (file: File | null) => void;
  currentFile: File | null;
}) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (selectedFile: File) => {
    if (
      selectedFile.name.endsWith(".xlsx") ||
      selectedFile.name.endsWith(".xls")
    ) {
      onFileSelect(selectedFile);
    } else {
      alert("Por favor sube solo archivos Excel (.xlsx o .xls)");
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
      }}
      className={`relative p-8 rounded-[28px] border-2 border-dashed transition-all duration-300 min-h-[220px] flex flex-col items-center justify-center text-center
        ${
          currentFile
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/25"
            : isDragActive
              ? "border-accent bg-accent-soft scale-[1.02] shadow-xl"
              : "bg-[var(--card)] border-[var(--border)] hover:border-accent cursor-pointer"
        }`}
    >
      {!currentFile && (
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept=".xlsx,.xls"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      )}

      {!currentFile ? (
        <>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors
            ${isDragActive ? "bg-accent text-white" : "bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500"}`}
          >
            <Upload className="w-7 h-7" />
          </div>
          <h3
            className={`text-base font-bold transition-colors ${isDragActive ? "text-accent" : "text-slate-700 dark:text-slate-200"}`}
          >
            {isDragActive ? "¡Suéltalo ahora!" : "Subir Base de Datos"}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 tracking-wide">
            {isDragActive
              ? "Detectamos tu archivo Excel"
              : "Arrastra tu archivo .xlsx o haz clic"}
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="w-14 h-14 bg-[var(--card)] rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-[var(--border)]">
            <FileSpreadsheet className="w-7 h-7 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 px-4 py-2 bg-[var(--card)] rounded-full shadow-sm border border-[var(--border)] truncate max-w-[250px]">
            {currentFile.name}
          </p>
          <button
            onClick={() => onFileSelect(null)}
            className="mt-4 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Eliminar y Cambiar
          </button>
        </div>
      )}
    </div>
  );
}

export default function CertificatesPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null);

  return (
    <div className="w-full max-w-(--breakpoint-2xl) mx-auto p-4 md:p-8 space-y-6 font-poppins text-slate-900 dark:text-slate-100">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-[var(--border)] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Certificación Masiva
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Automatización de homologación vehicular v2.4
          </p>
        </div>

        {excelFile && (
          <div className="flex gap-3 animate-in fade-in zoom-in duration-500">
            <button className="px-6 py-3 bg-[var(--card)] border border-[var(--border)] text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all active:scale-95">
              Descargar Borrador
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold shadow-lg hover:bg-accent-dark active:scale-95 transition-all">
              <Download className="w-5 h-5" />
              Procesar 24 Actas
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div
          className={`${excelFile ? "lg:col-span-4" : "lg:col-span-6"} space-y-6 transition-all duration-500`}
        >
          <section className="bg-[var(--card)] p-6 rounded-[28px] shadow-sm border border-[var(--border)] transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent-soft rounded-lg">
                <FileType className="text-accent w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Configuración
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase mb-2 block ml-1">
                  Empresa Destino
                </label>
                <select className="w-full p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] text-sm text-slate-800 dark:text-slate-200 focus:bg-[var(--input-bg-focus)] focus:ring-accent outline-none transition-all cursor-pointer">
                  <option>Logyca S.A.S</option>
                  <option>Transportes Unidos</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase mb-2 block ml-1">
                  Plantilla Maestra
                </label>
                <select className="w-full p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] text-sm text-slate-800 dark:text-slate-200 focus:bg-[var(--input-bg-focus)] focus:ring-accent outline-none transition-all cursor-pointer">
                  <option>Acta_Homologacion_V2.docx</option>
                  <option>Certificado_Mecanico_V1.docx</option>
                </select>
              </div>
            </div>
          </section>

          <ExcelDropzone onFileSelect={setExcelFile} currentFile={excelFile} />

          {!excelFile && (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 delay-150">
              <div className="p-5 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/60 flex gap-4">
                <Zap className="w-6 h-6 text-blue-500 dark:text-blue-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-200">
                    Mapeo Inteligente
                  </p>
                  <p className="text-xs text-blue-700/70 dark:text-blue-300/80 leading-relaxed">
                    El sistema detectará automáticamente etiquetas como placa,
                    chasis y marca dentro de tu archivo Excel.
                  </p>
                </div>
              </div>
              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 flex gap-4">
                <ShieldCheck className="w-6 h-6 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Seguridad Total
                  </p>
                  <p className="text-xs text-emerald-700/70 dark:text-emerald-300/80 leading-relaxed">
                    Procesamiento local seguro. Tus datos no se almacenan
                    permanentemente en nuestros servidores.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`${excelFile ? "lg:col-span-8" : "lg:col-span-6"} transition-all duration-500`}
        >
          {!excelFile ? (
            <div className="bg-slate-50 dark:bg-slate-900/35 border-2 border-slate-100 dark:border-[var(--border)] border-dashed rounded-[32px] h-full min-h-[550px] flex flex-col items-center justify-center p-12 text-center group transition-colors">
              <div className="w-20 h-20 bg-[var(--card)] border border-[var(--border)] rounded-3xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <FileStack className="w-10 h-10 text-slate-200 dark:text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-poppins">
                Esperando Datos
              </h2>
              <p className="text-slate-400 dark:text-slate-500 text-sm max-w-[320px] leading-relaxed">
                Carga un archivo Excel a la izquierda para generar la vista
                previa interactiva de tus certificados.
              </p>
            </div>
          ) : (
            <div className="bg-[var(--card)] rounded-[32px] border border-[var(--border)] shadow-2xl dark:shadow-black/40 h-[calc(100vh-180px)] min-h-[650px] flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-700 ease-out transition-colors">
              <div className="bg-slate-900 dark:bg-slate-950 px-8 py-5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-accent rounded-md text-[10px] font-black text-white uppercase tracking-widest">
                    Preview Mode
                  </div>
                  <p className="text-xs font-medium text-slate-400">
                    Certificado 1 de 24
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">
                    Cruce de datos exitoso
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-slate-200/50 dark:bg-black/35 p-6 md:p-12 overflow-y-auto flex justify-center">
                <div className="bg-white dark:bg-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.15)] w-full max-w-[800px] min-h-[1050px] rounded-sm p-[2.5cm] border border-slate-100 text-slate-800">
                  <div className="flex justify-between items-start mb-16">
                    <div className="w-40 h-16 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                      Espacio para Logo
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm tracking-tighter">
                        ACTA Nº 2026-0001
                      </p>
                      <p className="text-[11px] text-slate-500 uppercase">
                        Bogotá D.C., Colombia
                      </p>
                    </div>
                  </div>

                  <h1 className="text-center text-2xl font-serif font-black underline underline-offset-8 mb-12 decoration-slate-300">
                    ACTA DE HOMOLOGACIÓN
                  </h1>

                  <div className="space-y-8 text-[13px] text-slate-800 leading-[1.8] text-justify font-serif">
                    <p>
                      Por medio de la presente, la dirección técnica de{" "}
                      <strong>LOGYCA S.A.S</strong> hace constar que se ha
                      verificado la información técnica del siguiente vehículo:
                    </p>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 grid grid-cols-2 gap-y-8 font-sans">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">
                          Titular
                        </p>
                        <p className="font-bold text-slate-900 tracking-tight">
                          JUAN PEREZ RODRIGUEZ
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">
                          Identificación Placa
                        </p>
                        <p className="font-bold text-accent text-xl">ABC-123</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">
                          Número de Chasis
                        </p>
                        <p className="font-bold text-slate-900">
                          1N6AD01W42345678
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">
                          Marca / Referencia
                        </p>
                        <p className="font-bold text-slate-900">
                          NISSAN FRONTIER 2024
                        </p>
                      </div>
                    </div>
                    <p>
                      Se confirma que el vehículo cumple con todos los
                      requisitos de seguridad técnica y ambiental para su
                      operación nacional.
                    </p>
                  </div>

                  <div className="mt-40 flex justify-between px-10">
                    <div className="text-center">
                      <div className="w-44 border-t border-slate-400 pt-3 font-bold text-[10px] uppercase tracking-widest text-slate-600">
                        Firma Revisión
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-44 border-t border-slate-400 pt-3 font-bold text-[10px] uppercase tracking-widest text-slate-600">
                        Sello de Control
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
