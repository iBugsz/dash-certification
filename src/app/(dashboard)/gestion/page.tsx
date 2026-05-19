"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Plus, SearchX, Calendar, Clock, Check, Trash2, Edit2, Building2, Tag } from "lucide-react";
import { useHomologaciones, Homologacion } from "@/hooks/useHomologaciones";
import HomologationModal from "@/components/features/homologaciones/HomologationModal";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function HomologacionesPage() {
  const { homologaciones, companies, loading, saveHomologacion, toggleStatus, deleteHomologacion } = useHomologaciones();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Homologacion | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredItems = homologaciones.filter(
    (h) =>
      h.name.toLowerCase().includes(query) ||
      h.description?.toLowerCase().includes(query) ||
      h.category?.toLowerCase().includes(query) ||
      h.tags.some((tag) => tag.toLowerCase().includes(query))
  );

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (h: Homologacion) => {
    setEditing(h);
    setShowModal(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-100 antialiased">
      {/* Header Original */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Homologaciones
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Administra los certificados y validaciones técnicas vehiculares.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus size={14} />
          Nueva Homologación
        </button>
      </div>

      {/* Contenido / Listado con colores originales */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-slate-900/50 border border-dashed border-slate-800">
          {query ? (
            <>
              <SearchX size={32} className="text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">No se encontraron resultados</p>
            </>
          ) : (
            <>
              <FileText size={32} className="text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">No hay registros cargados</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const associatedCompany = companies.find((c) => c.id === item.company_id);

            return (
              <div
                key={item.id}
                className={`group relative rounded-xl border p-5 flex flex-col justify-between transition-all bg-slate-900 border-slate-800 hover:border-slate-700 ${
                  item.is_completed ? "opacity-60" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      item.is_completed ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {item.is_completed ? "Completado" : "Activo"}
                    </span>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleStatus(item.id, item.is_completed)}
                        className={`p-1 rounded md:rounded-lg border transition-colors ${
                          item.is_completed
                            ? "bg-emerald-600 text-white border-transparent"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                        }`}
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1 rounded md:rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => deleteHomologacion(item.id)}
                        className="p-1 rounded md:rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-rose-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <h3 className={`font-medium text-sm text-white ${item.is_completed ? "line-through text-slate-500" : ""}`}>
                    {item.name}
                  </h3>
                  
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {item.description || "Sin descripción."}
                  </p>

                  {/* Relación con Empresa y Categoría en la Tarjeta */}
                  {(associatedCompany || item.category) && (
                    <div className="mt-3 space-y-1.5 border-t border-slate-800/60 pt-2.5">
                      {associatedCompany && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Building2 size={12} className="text-slate-500" />
                          <span className="font-medium truncate">{associatedCompany.name}</span>
                        </div>
                      )}
                      {item.category && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Tag size={12} className="text-slate-600" />
                          <span>Categoría: <span className="text-slate-300 font-medium">{item.category}</span></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock size={11} className="text-slate-500" />
                      <span>{new Date(item.start_date).toLocaleDateString()}</span>
                    </div>
                    {item.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-slate-500" />
                        <span>Vence: {new Date(item.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <HomologationModal
          editing={editing}
          companies={companies}
          onClose={() => setShowModal(false)}
          onSave={saveHomologacion}
        />
      )}
    </div>
  );
}