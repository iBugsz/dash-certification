"use client";

import { useState } from "react";
import { FileText, Tag, Plus, SearchX, Search } from "lucide-react";

// Hooks
import { useHomologaciones } from "@/hooks/useHomologaciones";
import { useHomologationTypes } from "@/hooks/useHomologationTypes";

// Componentes
import HomologationModal from "@/components/features/homologaciones/HomologationModal";
import HomologationTypeModal from "@/components/features/homologation-types/HomologationTypeModal";
import HomologationCard from "@/components/features/homologaciones/HomologationCard";
import HomologationTypeCard from "@/components/features/homologation-types/HomologationTypeCard";
import { DeleteModal } from "@/components/ui/DeleteModal";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function HomologationDashboard() {
  const [activeTab, setActiveTab] = useState<"homologaciones" | "tipos">("homologaciones");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  // Estado para el modal de borrado
  const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string, type: 'homologacion' | 'tipo' } | null>(null);

  const { homologaciones, companies, loading: loadingH, saveHomologacion, toggleStatus, deleteHomologacion } = useHomologaciones();
  const { homologationTypes, loading: loadingT, saveHomologationType, deleteHomologationType } = useHomologationTypes();

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'homologacion') {
      await deleteHomologacion(itemToDelete.id);
    } else {
      await deleteHomologationType(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  const filtered = activeTab === "homologaciones" 
    ? homologaciones.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.description?.toLowerCase().includes(search.toLowerCase()))
    : homologationTypes.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.description?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-6 text-slate-900 dark:text-slate-100 font-poppins">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestión de Homologaciones</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Administra certificados, validaciones y tipos de registro.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          {activeTab === "homologaciones" ? "Nueva Homologación" : "Nuevo Tipo"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: "homologaciones", label: "Homologaciones", icon: FileText },
            { id: "tipos", label: "Tipos", icon: Tag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id 
                ? "border-blue-600 text-blue-600 dark:text-blue-400" 
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar en ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(loadingH || loadingT) ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400">
            <SearchX size={36} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No se encontraron resultados</p>
          </div>
        ) : activeTab === "homologaciones" ? (
          filtered.map((item: any) => (
            <div key={item.id} className="h-full">
              <HomologationCard 
                item={item} 
                onToggle={toggleStatus}
                onEdit={(val) => { setEditing(val); setShowModal(true); }} 
                onDelete={() => setItemToDelete({ id: item.id, name: item.name, type: 'homologacion' })} 
              />
            </div>
          ))
        ) : (
          filtered.map((h: any) => (
            <div key={h.id} className="h-full">
              <HomologationTypeCard 
                homologationType={h} 
                onEdit={(h) => { setEditing(h); setShowModal(true); }} 
                onDelete={() => setItemToDelete({ id: h.id, name: h.name, type: 'tipo' })} 
              />
            </div>
          ))
        )}
      </div>

      {showModal && (
        activeTab === "homologaciones" 
        ? <HomologationModal editing={editing} companies={companies} onClose={() => setShowModal(false)} onSave={saveHomologacion} />
        : <HomologationTypeModal editing={editing} onClose={() => setShowModal(false)} onSave={saveHomologationType} />
      )}

      <DeleteModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`¿Eliminar ${itemToDelete?.type === 'homologacion' ? 'homologación' : 'tipo'}?`}
        message={`¿Estás seguro de que quieres eliminar "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
}