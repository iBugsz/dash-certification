"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, ChevronDown, Clipboard } from "lucide-react";
import { useClipboardCAD } from "@/hooks/useClipboardCAD";
import { generateSVGString } from "@/lib/cad-utils";
import { parseDXFEntities, parseCFText } from "@/components/features/bloques-cad/ComponentCanvas";
import ComponentCanvas from "@/components/features/bloques-cad/ComponentCanvas";
import { Collection } from "@/lib/types/database";
import { useCadBlocks } from "@/hooks/useCadBlocks"; 

interface NewBlockModalProps {
  collections: Collection[];
  onClose: () => void;
  onSaved: () => void;
}

export default function NewBlockModal({ collections, onClose, onSaved }: NewBlockModalProps) {
  const [name, setName] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Escuchamos activamente el portapapeles global mientras el modal esté montado
  const { capturedData, error: clipboardError } = useClipboardCAD({ listenGlobal: true });
  
  const { createBlock } = useCadBlocks();

  // Sincroniza errores del portapapeles en el estado visual del modal
  useEffect(() => {
    if (clipboardError) setError(clipboardError);
  }, [clipboardError]);

  const handleSave = async () => {
    if (!capturedData?.raw) {
      setError("Por favor, copia entidades en AutoCAD y presiona Ctrl+V aquí.");
      return;
    }
    
    setSaving(true);
    setError(null);

    try {
      const entities =
        capturedData.format === "dxf"
          ? parseDXFEntities(capturedData.raw)
          : parseCFText(capturedData.raw);
      
      const svgString = generateSVGString(entities, 400, 400);

      const success = await createBlock({
        name: name.trim() || "Sin nombre",
        raw_vector_data: capturedData.raw,
        source_format: capturedData.format,
        thumbnail_svg: svgString,
        collection_id: collectionId || null,
        tags: [], 
      });

      if (!success) {
        throw new Error("No se pudo guardar el bloque en Supabase. Verifica tu conexión o políticas RLS.");
      }

      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Ocurrió un error inesperado al guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-[28px] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl bg-white dark:bg-slate-900 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
        <h2 className="text-xl font-bold mb-4">Nuevo Bloque CAD</h2>

        {/* Zona de Visualización Interactiva / Estado de Pegado */}
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-6 bg-slate-950 autocad-force-white relative min-h-[220px] flex items-center justify-center">
          {capturedData?.raw ? (
            <ComponentCanvas rawVectorData={capturedData.raw} height={220} compact />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 font-poppins">
              <Clipboard className="w-8 h-8 mb-2 text-blue-500 animate-bounce" />
              <p className="text-sm font-medium text-slate-200">Esperando contenido vectorial</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Presiona <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-white font-mono text-[10px]">Ctrl + V</kbd> para volcar lo que copiaste en AutoCAD.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Input Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Nombre del bloque
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Brida de sujeción 3/4"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          {/* Selector de Colección */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Colección / Destino
            </label>
            <div className="relative">
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm cursor-pointer appearance-none pr-10"
              >
                <option value="">Dejar vacía (Sin asignación)</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!capturedData || saving}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 text-sm disabled:opacity-40 shadow-sm shadow-blue-500/10"
          >
            {saving ? "Guardando..." : "Guardar bloque"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .autocad-force-white {
          filter: saturate(0) brightness(2.5);
        }
        .autocad-force-white canvas {
          background-color: #020611 !important;
        }
      `}</style>
    </div>
  );
}