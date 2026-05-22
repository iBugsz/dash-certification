"use client";

import { Copy, Trash2, Check, Eye, Pencil } from "lucide-react";
import { CADBlock, Collection } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";

interface BlockCardProps {
  block: CADBlock;
  collections: Collection[];
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (block: CADBlock) => void;
  onEdit: (block: CADBlock) => void;
  isCopied?: boolean; 
}

export default function BlockCard({
  block,
  collections,
  onCopy,
  onDelete,
  onPreview,
  onEdit,
  isCopied = false,
}: BlockCardProps) {
  const currentCollection = collections.find((c) => c.id === block.collection_id);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(block.id);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm">
      <div className="flex-1 p-4">
        <div className="mb-3 overflow-hidden rounded-xl border border-slate-900 bg-[#020611] aspect-square max-h-48 w-full flex items-center justify-center autocad-microgrid-bg relative group/card">
          <div
            onClick={() => onPreview(block)}
            className="cursor-pointer group/preview relative w-full h-full flex items-center justify-center transition-all duration-300"
            title="Ver plano interactivo"
          >
            {block.thumbnail_svg ? (
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out group-hover/preview:scale-105 p-4 cad-thumbnail-vector"
                dangerouslySetInnerHTML={{ __html: block.thumbnail_svg }}
              />
            ) : (
              <div className="text-[11px] text-slate-500 font-mono opacity-60">
                Sin vista vectorial
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[11px] font-semibold text-blue-800 dark:text-blue-300 max-w-full">
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[4px] bg-blue-600 text-white text-[9px] font-bold flex-shrink-0 uppercase">
              {block.source_format || 'CAD'}
            </span>
            <span className="truncate">{block.name}</span>
          </span>

          {currentCollection ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              <span className="truncate max-w-[100px]">{currentCollection.name}</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-400">
              Sin colección
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <span className="text-[11px] text-slate-400">
          {formatDate(block.updated_at || block.created_at)}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onPreview(block)}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all"
            title="Ver interactivo"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(block);
            }}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-all"
            title="Editar bloque"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
            title="Copiar código CAD"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
            title="Eliminar bloque"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .autocad-microgrid-bg {
          background-color: #020611;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 10px 10px;
          background-position: center;
        }

        .cad-thumbnail-vector svg {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .cad-thumbnail-vector * {
          stroke: #ffffff !important;
          stroke-width: 1.3px !important;
          fill: none !important;
          filter: drop-shadow(0px 0px 1px rgba(255, 255, 255, 0.3));
        }
      `}</style>
    </div>
  );
}