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

  const isWord = currentFile?.name.toLowerCase().endsWith(".doc") || currentFile?.name.toLowerCase().endsWith(".docx");

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
      }}
      className={`relative p-8 rounded-[24px] border-2 border-dashed transition-all duration-300 min-h-[220px] flex flex-col items-center justify-center text-center overflow-hidden
        ${currentFile 
          ? "border-[var(--border)] bg-transparent" // Mantenemos el fondo limpio aunque haya archivo
          : isDragActive 
            ? "border-[var(--accent)] bg-[var(--accent)]/[0.05] scale-[1.01]" 
            : "border-[var(--border)] bg-transparent hover:border-[var(--accent)]/50"
        }`}
    >
      {!currentFile ? (
        <>
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".xlsx,.xls,.doc,.docx"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[var(--accent)]/10">
            <Upload className="w-7 h-7 text-[var(--accent)]" />
          </div>
          <h3 className="text-sm font-bold text-[var(--foreground)]">Seleccionar archivo</h3>
          <p className="text-xs mt-1 text-[var(--sidebar-fg-muted)]">Excel o Word (Máx 10MB)</p>
        </>
      ) : (
        <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 w-full">
          {/* ICONO CON FONDO VERDE */}
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-sm">
            {isWord ? (
              <FileText className="w-10 h-10 text-emerald-500" />
            ) : (
              <FileSpreadsheet className="w-10 h-10 text-emerald-500" />
            )}
          </div>

          <div className="space-y-1 mb-8 w-full px-4">
            <p className="text-sm font-bold text-[var(--foreground)] truncate">
              {currentFile.name}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              Documento cargado
            </p>
          </div>

          {/* BOTÓN ELIMINAR MÁS GRANDE Y CLARO */}
          <button
            onClick={(e) => { e.preventDefault(); onFileSelect(null); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-red-500/10 hover:text-red-500 transition-all text-[11px] font-bold uppercase tracking-widest text-[var(--foreground)]"
          >
            <X className="w-3.5 h-3.5" /> 
            Quitar archivo
          </button>
        </div>
      )}
    </div>
  );
}