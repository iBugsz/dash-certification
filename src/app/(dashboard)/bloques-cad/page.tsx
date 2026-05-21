"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Copy, Trash2, Check, Layers, Search, X, Eye, AlertTriangle, FileCode } from "lucide-react";
import dynamic from "next/dynamic";
import { useClipboardCAD } from "@/hooks/useClipboardCAD";
import { generateSVGString } from "@/lib/cad-utils";
import { formatDate } from "@/lib/utils";
import {
  parseDXFEntities,
  parseCFText,
} from "@/components/features/bloques-cad/ComponentCanvas";

const ComponentCanvas = dynamic(
  () => import("@/components/features/bloques-cad/ComponentCanvas"),
  { ssr: false },
);

interface CADBlock {
  id: string;
  name: string;
  source_format: string;
  tags: string[];
  thumbnail_svg?: string;
  created_at: string;
  updated_at?: string;
}

// ─── BlockCard (Rediseñado: Nombre abajo como etiqueta + Imagen optimizada) ───
function BlockCard({
  block,
  onCopy,
  onDelete,
  onPreview,
}: {
  block: CADBlock;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (block: CADBlock) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(block.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm">
      {/* Contenido principal */}
      <div className="flex-1 p-4">
        
        {/* Header: Icono + Extensión (Estructura limpia idéntica a TemplateRow sin título) */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-[10px] bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
            <Layers className="w-[17px] h-[17px] text-blue-500 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
              Componente CAD
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              .{block.source_format.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Contenedor de Imagen: Ajustado para que el SVG ocupe toda la altura de la caja gris */}
        <div className="mb-3 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/40">
          <div
            onClick={() => onPreview(block)}
            className="cursor-pointer group/preview relative h-28 w-full flex items-center justify-center transition-all duration-300"
            title="Ver plano interactivo"
          >
            {block.thumbnail_svg ? (
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out group-hover/preview:scale-110 cad-thumbnail-vector"
                dangerouslySetInnerHTML={{ __html: block.thumbnail_svg }}
              />
            ) : (
              <div className="text-[11px] text-slate-400 opacity-40 font-mono">
                Sin vista vectorial
              </div>
            )}
          </div>
        </div>

        {/* Badges / Etiquetas (Aquí se incluye el Nombre como una etiqueta destacada azul) */}
        <div className="flex flex-wrap gap-1.5">
          {/* Nombre convertido en etiqueta (Estilo Company/Badge principal) */}
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[11px] font-semibold text-blue-800 dark:text-blue-300 max-w-full">
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-[4px] bg-blue-600 text-white text-[9px] font-bold flex-shrink-0">
              CAD
            </span>
            <span className="truncate">{block.name}</span>
          </span>

          {/* Resto de etiquetas de metadatos */}
          {block.tags && block.tags.length > 0 ? (
            block.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-[11px] font-medium text-indigo-800 dark:text-indigo-300"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400">
              Sin etiquetas
            </span>
          )}
        </div>
      </div>

      {/* Footer: fecha + acciones (Calco exacto de TemplateRow) */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800">
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
            onClick={handleCopy}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
            title="Copiar código CAD"
          >
            {copied ? (
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

      {/* Estilos globales para estandarizar e inflar el SVG al tamaño completo de la caja h-28 */}
      <style jsx global>{`
        .cad-thumbnail-vector svg {
          width: 100%;
          height: 100%;
          max-height: 112px; /* Ocupa los 112px equivalentes a h-28 */
          padding: 8px; /* Un pequeño respiro interno para que no toque los bordes del recuadro gris */
          object-fit: contain;
        }
        .cad-thumbnail-vector * {
          stroke: #3b82f6 !important;
          stroke-width: 1.5px !important;
          fill: none !important;
        }
        .dark .cad-thumbnail-vector * {
          stroke: #60a5fa !important;
        }
      `}</style>
    </div>
  );
}

// ─── BlockPreviewModal (Modal interactivo al hacer click) ───
function BlockPreviewModal({
  block,
  onClose,
}: {
  block: CADBlock | null;
  onClose: () => void;
}) {
  const [rawData, setRawData] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!block) return;
    setLoading(true);
    fetch(`/api/components?id=${block.id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data?.raw_vector_data) {
          setRawData(json.data.raw_vector_data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [block]);

  if (!block) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{block.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 uppercase font-mono">Formato nativo: {block.source_format}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 p-6 bg-slate-950 relative min-h-[350px] flex items-center justify-center">
          {loading ? (
            <div className="text-white text-sm opacity-50 animate-pulse">Cargando geometrías...</div>
          ) : rawData ? (
            <div className="w-full h-full min-h-[350px]">
              <ComponentCanvas rawVectorData={rawData} height={350} compact />
            </div>
          ) : (
            <div className="text-white text-xs opacity-30">No se encontraron coordenadas en bruto.</div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-900/40">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Cerrar Visor
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── NewBlockModal ───
function NewBlockModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { capturedData } = useClipboardCAD({ listenGlobal: true });

  const handleSave = async () => {
    if (!capturedData?.raw) {
      setError("Pega un bloque válido usando (Ctrl+V)");
      return;
    }
    setSaving(true);
    try {
      const entities =
        capturedData.format === "dxf"
          ? parseDXFEntities(capturedData.raw)
          : parseCFText(capturedData.raw);
      const svgString = generateSVGString(entities, 400, 400);

      await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Sin nombre",
          raw_vector_data: capturedData.raw,
          source_format: capturedData.format,
          thumbnail_svg: svgString,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message);
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

        <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-6 bg-slate-950">
          <ComponentCanvas
            rawVectorData={capturedData?.raw ?? ""}
            height={220}
            compact
          />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nombre del bloque</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Brida de sujeción 3/4"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tags (Separados por coma)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="mecanico, brida, soporte"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
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
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 text-sm disabled:opacity-40"
          >
            {saving ? "Guardando..." : "Guardar bloque"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página Principal ───
export default function BloquesCadPage() {
  const [blocks, setBlocks] = useState<CADBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPreviewBlock, setSelectedPreviewBlock] = useState<CADBlock | null>(null);
  const { writeToClipboard } = useClipboardCAD({ listenGlobal: false });

  const loadBlocks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/components${search ? `?q=${search}` : ""}`);
    const json = await res.json();
    setBlocks(json.data ?? []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  const handleCopy = async (id: string) => {
    const res = await fetch(`/api/components?id=${id}`);
    const json = await res.json();
    if (json.data?.raw_vector_data)
      await writeToClipboard(json.data.raw_vector_data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este componente de la biblioteca?")) return;
    await fetch(`/api/components?id=${id}`, { method: "DELETE" });
    loadBlocks();
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-6 text-slate-900 dark:text-slate-100 font-poppins">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Bloques CAD
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Librería de componentes vectoriales planos en formato nativo.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo bloque
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar bloques o tags..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
        />
      </div>

      {/* Grid unificado exacto */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800"
            />
          ))}
        </div>
      ) : blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Layers size={36} className="mb-3 opacity-20" />
          <p className="text-sm font-medium">No se encontraron bloques</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {blocks.map((b) => (
            <BlockCard
              key={b.id}
              block={b}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onPreview={(block) => setSelectedPreviewBlock(block)}
            />
          ))}
        </div>
      )}

      {/* MODAL: REGISTRO */}
      {showModal && (
        <NewBlockModal
          onClose={() => setShowModal(false)}
          onSaved={loadBlocks}
        />
      )}

      {/* MODAL: VISOR INTERACTIVO */}
      {selectedPreviewBlock && (
        <BlockPreviewModal
          block={selectedPreviewBlock}
          onClose={() => setSelectedPreviewBlock(null)}
        />
      )}
    </div>
  );
}