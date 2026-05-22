"use client";

import { useState } from "react";
import { Plus, Edit2, X, Check } from "lucide-react";
import { Collection } from "@/lib/types/database";

interface CollectionFiltersProps {
  collections: Collection[];
  selectedCollectionId: string;
  onSelectCollection: (id: string) => void;
  // Modificamos para pasar el nombre directamente desde aquí sin usar prompts
  onCreateCollection: (name: string) => Promise<void>;
  onEditCollection: (id: string, currentName: string) => void;
}

export default function CollectionFilters({
  collections,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollection,
  onEditCollection,
}: CollectionFiltersProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim() || loading) return;

    setLoading(true);
    try {
      await onCreateCollection(newCollectionName.trim());
      setNewCollectionName("");
      setIsCreating(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
      {/* Lista de Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
        <button
          onClick={() => onSelectCollection("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
            selectedCollectionId === "all"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          Todos los bloques
        </button>

        {collections.map((col) => (
          <div key={col.id} className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-2 pl-4 py-1">
            <button
              onClick={() => onSelectCollection(col.id)}
              className={`text-xs font-semibold tracking-wide transition-all ${
                selectedCollectionId === col.id ? "text-blue-500 font-bold" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {col.name}
            </button>
            <button
              onClick={() => onEditCollection(col.id, col.name)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
              title="Editar colección"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Formulario / Botón de Agregar Colección Estilizado */}
      {isCreating ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
          <input
            type="text"
            autoFocus
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Nombre de colección..."
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!newCollectionName.trim() || loading}
            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-40"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => { setIsCreating(false); setNewCollectionName(""); }}
            className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-300 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-blue-500 dark:hover:border-blue-500 transition-all bg-white dark:bg-slate-800 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-blue-500" />
          Nueva Colección
        </button>
      )}
    </div>
  );
}