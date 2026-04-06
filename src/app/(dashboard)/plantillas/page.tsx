"use client";

import { useState, useMemo } from "react";
import { Plus, Search, FileX } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import TemplateRow from "@/components/features/templates/TemplateRow";
import TemplateRowSkeleton from "@/components/features/templates/TemplateRowSkeleton";
import TemplateUploadModal from "@/components/features/templates/TemplateUploadModal";

export default function TemplatesPage() {
  const { templates, loading, uploading, uploadTemplate, deleteTemplate } =
    useTemplates();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.company?.name.toLowerCase().includes(q),
    );
  }, [templates, search]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Plantillas Word
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Sube y gestiona tus archivos .docx con etiquetas de mapeo.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold shadow-lg hover:bg-accent-dark transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Subir Plantilla
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o empresa..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] text-sm transition-all"
        />
      </div>

      {/* Tabla */}
      <div className="bg-[var(--card)] rounded-[24px] shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-[var(--border)]">
              <tr>
                {[
                  "Nombre del Archivo",
                  "Empresa Asignada",
                  "Última Modificación",
                  "Acciones",
                ].map((col, i) => (
                  <th
                    key={col}
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/40 ${
                      i === 3 ? "text-right" : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TemplateRowSkeleton key={i} />
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                      {search ? (
                        <>
                          <Search size={40} className="mb-3 opacity-30" />
                          <p className="font-medium">
                            Sin resultados para "{search}"
                          </p>
                          <p className="text-sm mt-1">
                            Intenta con otro término
                          </p>
                        </>
                      ) : (
                        <>
                          <FileX size={40} className="mb-3 opacity-30" />
                          <p className="font-medium">No hay plantillas aún</p>
                          <p className="text-sm mt-1">
                            Sube la primera con el botón de arriba
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((template) => (
                  <TemplateRow
                    key={template.id}
                    template={template}
                    onDelete={deleteTemplate}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-[var(--border)] bg-slate-50/50 dark:bg-slate-800/20">
            <p className="text-xs text-slate-400">
              {filtered.length} plantilla{filtered.length !== 1 ? "s" : ""}
              {search && ` encontrada${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TemplateUploadModal
          uploading={uploading}
          onClose={() => setShowModal(false)}
          onUpload={uploadTemplate}
        />
      )}
    </div>
  );
}
