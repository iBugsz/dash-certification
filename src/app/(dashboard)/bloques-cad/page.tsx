"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Layers, X, Check } from "lucide-react"; 
import { useClipboardCAD } from "@/hooks/useClipboardCAD";
import { useCollections } from "@/hooks/useCollections";
import { useCadBlocks } from "@/hooks/useCadBlocks";

// Importaciones de tipos y componentes modulares
import { CADBlock } from "@/lib/types/database";
import CollectionFilters from "@/components/features/bloques-cad/CollectionFilters";
import BlockCard from "@/components/features/bloques-cad/BlockCard";
import NewBlockModal from "@/components/features/bloques-cad/NewBlockModal";
import BlockPreviewModal from "@/components/features/bloques-cad/BlockPreviewModal";

export default function BloquesCadPage() {
  const [selectedCollectionId, setSelectedCollectionId] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPreviewBlock, setSelectedPreviewBlock] = useState<CADBlock | null>(null);

  // Estados para controlar la edición del bloque
  const [editingBlock, setEditingBlock] = useState<CADBlock | null>(null);
  const [editName, setEditName] = useState("");
  const [editCollectionId, setEditCollectionId] = useState("");

  // ID del bloque que se está copiando actualmente para animar su tarjeta individual
  const [copyingId, setCopyingId] = useState<string | null>(null);
  // Estado global para mostrar el aviso emergente (Toast)
  const [copiedToast, setCopiedToast] = useState(false);

  const { writeToClipboard } = useClipboardCAD({ listenGlobal: false });

  const { collections, createCollection, editCollection } = useCollections();

  const { 
    blocks, 
    loading, 
    error, 
    fetchBlocks, 
    deleteBlock,
    updateBlock, 
    fetchSingleBlockVector 
  } = useCadBlocks();

  useEffect(() => {
    fetchBlocks(search);
  }, [search, fetchBlocks]);

  const handleOpenEdit = (block: CADBlock) => {
    setEditingBlock(block);
    setEditName(block.name);
    setEditCollectionId(block.collection_id || "");
  };

  const handleSaveEdit = async () => {
    if (!editingBlock) return;

    const updated = await updateBlock(editingBlock.id, {
      name: editName.trim() || "Bloque sin nombre",
      collection_id: editCollectionId || null,
    });

    if (updated) {
      setEditingBlock(null);
    } else {
      alert("No se pudieron guardar los cambios en el bloque.");
    }
  };

  const handleCreateCollection = async (name: string) => {
    const result = await createCollection(name);
    if (!result.success) {
      alert(`Error al guardar en Supabase: ${result.error}`);
    }
  };

  const handleEditCollection = async (id: string, currentName: string) => {
    const newName = prompt("Modificar nombre de la colección:", currentName);
    if (!newName || !newName.trim() || newName === currentName) return;

    const result = await editCollection(id, newName.trim());
    if (!result.success) {
      alert(`Error al editar en Supabase: ${result.error}`);
    }
  };

  // Lógica de copiado optimizada con disparador de feedback visual
  const handleCopy = async (id: string) => {
    try {
      const localBlock = blocks.find((b) => b.id === id);
      
      if (localBlock) {
        let vectorData = "";

        if ('raw_vector_data' in localBlock && (localBlock as any).raw_vector_data) {
          vectorData = (localBlock as any).raw_vector_data;
        } else {
          const targetVector = await fetchSingleBlockVector(id);
          if (targetVector) vectorData = targetVector;
        }

        if (vectorData) {
          await writeToClipboard(vectorData);
          
          // Activa las alertas visuales concurrentes
          setCopyingId(id);
          setCopiedToast(true);

          // Restablece los estados progresivamente
          setTimeout(() => setCopyingId(null), 2000);
          setTimeout(() => setCopiedToast(false), 2500);
        }
      }
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este componente de la biblioteca?")) return;
    const success = await deleteBlock(id);
    if (!success) {
      alert("No se pudo eliminar el componente. Revisa los permisos de tu base de datos.");
    }
  };

  const filteredBlocks = blocks.filter((block) => {
    if (selectedCollectionId === "all") return true;
    return block.collection_id === selectedCollectionId;
  });

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-6 text-slate-900 dark:text-slate-100 font-poppins relative">
      {error && (
        <div className="p-4 text-sm bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50">
          ❌ Error en base de datos: {error}
        </div>
      )}

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

      <CollectionFilters
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
        onCreateCollection={handleCreateCollection}
        onEditCollection={handleEditCollection}
      />

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar bloques..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
        />
      </div>

      {/* Grid */}
      {loading && blocks.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredBlocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Layers size={36} className="mb-3 opacity-20" />
          <p className="text-sm font-medium">No se encontraron bloques en esta selección</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBlocks.map((b) => (
            <BlockCard
              key={b.id}
              block={{
                ...b,
                user_id: b.user_id ?? null,
                raw_vector_data: b.raw_vector_data ?? null,
              } as CADBlock}
              collections={collections}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onPreview={(block) => setSelectedPreviewBlock(block)}
              onEdit={handleOpenEdit}
              isCopied={copyingId === b.id} 
            />
          ))}
        </div>
      )}

      {/* MODAL: REGISTRO */}
      {showModal && (
        <NewBlockModal
          collections={collections}
          onClose={() => setShowModal(false)}
          onSaved={() => fetchBlocks(search)}
        />
      )}

      {/* MODAL: VISOR INTERACTIVO */}
      {selectedPreviewBlock && (
        <BlockPreviewModal
          block={selectedPreviewBlock}
          onClose={() => setSelectedPreviewBlock(null)}
        />
      )}

      {/* MODAL INTERNO: EDICIÓN RÁPIDA */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-[24px] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl bg-white dark:bg-slate-900 animate-in zoom-in-95">
            <button
              onClick={() => setEditingBlock(null)}
              className="absolute top-5 right-5 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
            
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">Editar propiedades</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nombre del bloque
                </label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Mover a Colección
                </label>
                <select
                  value={editCollectionId}
                  onChange={(e) => setEditCollectionId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm cursor-pointer"
                >
                  <option value="">Sin asignación (Raíz)</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingBlock(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/10"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👇 NOTIFICACIÓN FLOTANTE (TOAST): ADAPTADA PARA EVITAR EL SIDEBAR */}
      {copiedToast && (
        <div className="fixed bottom-6 left-6 md:left-80 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 animate-in slide-in-from-bottom-5 fade-in duration-300 overflow-hidden min-w-[280px]">
          {/* Icono sutil con fondo azul suave */}
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[2.5px]" />
          </div>
          
          {/* Texto limpio */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400 font-mono uppercase">Biblioteca</span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Bloque copiado al portapapeles</span>
          </div>

          {/* Microbarra de progreso de tiempo con el color azul de tu app */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800">
            <div className="h-full bg-blue-600  autocad-toast-progress" />
          </div>

          <style jsx>{`
            .autocad-toast-progress {
              animation: shrinkWidth 2.5s linear forwards;
            }
            @keyframes shrinkWidth {
              from { width: 105%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}