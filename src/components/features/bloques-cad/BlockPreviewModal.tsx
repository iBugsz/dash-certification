"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Monitor } from "lucide-react";
import { CADBlock } from "@/lib/types/database"; 
import ComponentCanvas from "@/components/features/bloques-cad/ComponentCanvas";
import { useCadBlocks } from "@/hooks/useCadBlocks"; 

interface BlockPreviewModalProps {
  block: CADBlock | null;
  onClose: () => void;
}

export default function BlockPreviewModal({ block, onClose }: BlockPreviewModalProps) {
  const [rawData, setRawData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Extraemos la función de consulta asíncrona directa desde el hook
  const { fetchSingleBlockVector } = useCadBlocks();

  // Cerrar al hacer clic fuera del contenedor del modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (!block) return;
    
    setLoading(true);
    fetchSingleBlockVector(block.id)
      .then((vectorData) => {
        if (vectorData) {
          setRawData(vectorData);
        }
      })
      .catch((err) => console.error("Error al cargar las geometrías crudas:", err))
      .finally(() => setLoading(false));
  }, [block, fetchSingleBlockVector]);

  if (!block) return null;

  return (
    <div 
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[24px] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]"
      >
        
        {/* Header del Modal */}
        <div className="flex justify-between items-start p-6 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {/* 👇 Modificado: Indicador blanco/gris en lugar de azul vibrante */}
              <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-pulse" />
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {block.name}
              </h3>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Monitor className="w-3 h-3" />
              Espacio de Modelo • {block.source_format || "RAW"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Cerrar vista"
          >
            <X className="w-4 h-4 stroke-[2.5px]" />
          </button>
        </div>

        {/* Área del Canvas (Visualizador Estilo AutoCAD Centrado Seguro) */}
        <div className="flex-1 mx-6 mb-6 rounded-2xl bg-[#020611] border border-slate-950 relative min-h-[380px] flex items-center justify-center overflow-hidden autocad-modal-grid">
          
          {loading ? (
            <div className="flex flex-col items-center gap-2.5 text-slate-400">
              {/* 👇 Modificado: Spinner blanco/gris para mantener neutralidad técnica */}
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              <span className="text-xs font-medium tracking-wide font-mono">Regenerando extensión...</span>
            </div>
          ) : rawData ? (
            /* 
              AQUÍ ESTÁ EL TRUCO GLOBAL: 
              Añadimos la clase 'autocad-force-white' al contenedor. 
              Esto interceptará el renderizado de cualquier vector azul de la llanta y los botones internos, 
              convirtiéndolos a blanco puro sin alterar el fondo oscuro ni dañar la resolución.
            */
            <div className="absolute inset-0 w-full h-full flex items-center justify-center p-8 autocad-force-white">
              <div className="w-full h-full flex items-center justify-center max-w-full max-h-full">
                <ComponentCanvas rawVectorData={rawData} height={350} compact />
              </div>
            </div>
          ) : (
            <div className="text-slate-600 text-xs font-mono tracking-wide">
              No se encontraron entidades vectoriales activas.
            </div>
          )}
        </div>

      </div>

      <style jsx global>{`
        {/* 👇 CORRECCIÓN DE CUADRÍCULA: Cambiada a un blanco muy tenue para simular el espacio de AutoCAD */}
        .autocad-modal-grid {
          background-color: #020611;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          background-size: 12px 12px;
          background-position: center;
        }

        {/* 👇 TRUCO CSS: Desatura por completo el contenido azul y eleva el brillo para volverlo blanco puro */}
        .autocad-force-white {
          filter: saturate(0) brightness(2.5);
        }
        
        {/* Mantiene el fondo del canvas oscuro e intacto tras el filtro de brillo superior */}
        .autocad-force-white canvas {
          background-color: #020611 !important;
        }
      `}</style>
    </div>
  );
}