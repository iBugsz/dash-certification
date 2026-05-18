"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tag, Plus, SearchX } from "lucide-react";
import { HomologationType } from "@/lib/types/database";
import { useHomologationTypes } from "@/hooks/useHomologationTypes";
import HomologationTypeCard from "@/components/features/homologation-types/HomologationTypeCard";
import HomologationTypeCardSkeleton from "@/components/features/homologation-types/HomologationTypeCardSkeleton";
import HomologationTypeModal from "@/components/features/homologation-types/HomologationTypeModal";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function HomologationTypesPage() {
  const {
    homologationTypes,
    loading,
    saveHomologationType,
    deleteHomologationType,
  } = useHomologationTypes();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<HomologationType | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filtered = homologationTypes.filter(
    (h) =>
      h.name.toLowerCase().includes(query) ||
      h.description?.toLowerCase().includes(query),
  );

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (h: HomologationType) => {
    setEditing(h);
    setShowModal(true);
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Tipos de Homologación
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Administra los tipos de homologación y su vinculación con
            plantillas.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Nuevo Tipo
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <HomologationTypeCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {query ? (
            <>
              <SearchX size={56} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">No se encontraron tipos</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </>
          ) : (
            <>
              <Tag size={56} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">
                No hay tipos de homologación registrados
              </p>
              <p className="text-sm">Crea el primero con el botón de arriba</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((h) => (
            <HomologationTypeCard
              key={h.id}
              homologationType={h}
              onEdit={openEdit}
              onDelete={deleteHomologationType}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <HomologationTypeModal
          editing={editing}
          onClose={() => setShowModal(false)}
          onSave={saveHomologationType}
        />
      )}
    </div>
  );
}
