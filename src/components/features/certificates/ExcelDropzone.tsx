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
      className="relative p-8 rounded-[28px] border-2 border-dashed transition-all min-h-[220px] flex flex-col items-center justify-center text-center"
      style={{
        backgroundColor: currentFile
          ? "rgba(5, 205, 153, 0.1)"
          : isDragActive
            ? "rgba(67, 24, 255, 0.05)"
            : "var(--card)",
        borderColor: currentFile
          ? "#05cd99"
          : isDragActive
            ? "var(--accent)"
            : "var(--border)",
        transform: isDragActive ? "scale(1.02)" : "scale(1)",
      }}
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
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "rgba(67, 24, 255, 0.15)" }}
          >
            <Upload className="w-7 h-7" style={{ color: "var(--accent)" }} />
          </div>
          <h3
            className="text-base font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Subir Documento o Base de Datos
          </h3>
          <p
            className="text-xs mt-2"
            style={{ color: "var(--sidebar-fg-muted)" }}
          >
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

          <p
            className="text-sm font-bold truncate max-w-[200px]"
            style={{ color: "var(--foreground)" }}
          >
            {currentFile.name}
          </p>
          <button
            onClick={() => onFileSelect(null)}
            className="mt-4 text-[10px] font-black uppercase flex items-center gap-1"
            style={{ color: "var(--accent)" }}
          >
            <X className="w-3 h-3" /> Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
