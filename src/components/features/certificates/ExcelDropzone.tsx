"use client";
import { useState } from "react";
import { Upload, FileSpreadsheet, FileText, X } from "lucide-react";

export function ExcelDropzone({
  onFileSelect,
  currentFile,
}: {
  onFileSelect: (file: File | null) => void;
  currentFile: File | null;
}) {
  const [isDragActive, setIsDragActive] = useState(false);

  // 1. Extendemos la validación de la extensión
  const handleFile = (file: File) => {
    const validExtensions = [".xlsx", ".xls", ".docx", ".doc"];
    const isWordOrExcel = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (isWordOrExcel) {
      onFileSelect(file);
    } else {
      alert("Sube un archivo válido (Excel o Word)");
    }
  };

  // Determinar qué icono mostrar según el archivo actual
  const isWord =
    currentFile?.name.toLowerCase().endsWith(".doc") ||
    currentFile?.name.toLowerCase().endsWith(".docx");

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
      className={`relative p-8 rounded-[28px] border-2 border-dashed transition-all min-h-[220px] flex flex-col items-center justify-center text-center
        ${currentFile ? "border-emerald-800 bg-emerald-950/25" : isDragActive ? "border-accent bg-accent/5 scale-[1.02]" : "bg-[var(--card)] border-[var(--border)]"}`}
    >
      {!currentFile ? (
        <>
          {/* 2. Actualizamos el atributo accept */}
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".xlsx,.xls,.doc,.docx"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />
          <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-4">
            <Upload className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="text-base font-bold text-slate-200">
            Subir Documento o Base de Datos
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Arrastra tu archivo .xlsx, .docx o haz clic
          </p>
        </>
      ) : (
        <div className="flex flex-col items-center">
          {/* 3. Cambiamos el icono dinámicamente */}
          {isWord ? (
            <FileText className="w-10 h-10 text-blue-500 mb-2" />
          ) : (
            <FileSpreadsheet className="w-10 h-10 text-emerald-500 mb-2" />
          )}

          <p className="text-sm font-bold text-slate-100 truncate max-w-[200px]">
            {currentFile.name}
          </p>
          <button
            onClick={() => onFileSelect(null)}
            className="mt-4 text-[10px] font-black text-red-400 uppercase flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
