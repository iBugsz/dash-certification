// src/components/features/certificates/ExcelDropzone.tsx
'use client';
import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, X } from "lucide-react";

export default function ExcelDropzone({ onFileSelect }: { onFileSelect: (file: File | null) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    } else {
      alert("Por favor sube solo archivos Excel");
    }
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
      }}
      className={`relative bg-white p-6 md:p-12 rounded-[24px] shadow-sm border-dashed border-2 flex flex-col items-center justify-center text-center group transition-all cursor-pointer min-h-[200px]
        ${isDragActive ? 'border-[#8633FF] bg-purple-50' : 'border-slate-100 hover:border-[#8633FF]'}`}
    >
      <input 
        type="file" 
        className="absolute inset-0 opacity-0 cursor-pointer" 
        accept=".xlsx,.xls"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!file ? (
        <>
          <div className="p-4 bg-slate-50 rounded-full mb-4 group-hover:bg-purple-50 transition-colors">
            <Upload className="w-6 h-6 md:w-8 md:h-8 text-slate-400 group-hover:text-[#8633FF]" />
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-700">Cargar Archivo Excel</h3>
          <p className="text-slate-500 text-sm mt-1">Arrastra tu archivo .xlsx o haz clic para explorar</p>
        </>
      ) : (
        <div className="flex flex-col items-center animate-in fade-in zoom-in">
          <div className="p-4 bg-emerald-50 rounded-full mb-4">
            <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">{file.name}</h3>
          <button 
            onClick={(e) => { e.preventDefault(); setFile(null); onFileSelect(null); }}
            className="mt-4 text-xs font-bold text-red-500 flex items-center gap-1 hover:underline"
          >
            <X className="w-3 h-3" /> Quitar archivo
          </button>
        </div>
      )}
    </div>
  );
}