"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  FileX,
  AlertTriangle,
  Trash2,
  X,
  Tag,
} from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import TemplateRow from "@/components/features/templates/TemplateRow";
import TemplateRowSkeleton from "@/components/features/templates/TemplateRowSkeleton";
import TemplateUploadModal from "@/components/features/templates/TemplateUploadModal";
import MappingModal from "@/components/features/templates/MappingModal";
import { PreviewDrawer } from "@/components/features/certificates/PreviewDrawer";
import { Template, MappingField } from "@/lib/types/database";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

interface SimpleHomologationType {
  id: string;
  name: string;
}

export default function TemplatesPage() {
  const {
    templates,
    loading,
    uploading,
    uploadTemplate,
    deleteTemplate,
    updateTemplateMapping,
    updateTemplateHomologationType,
  } = useTemplates();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTemplateForMapping, setSelectedTemplateForMapping] =
    useState<Template | null>(null);

  // Vista previa
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const handleOpenPreview = (url: string) => {
    setSelectedPdfUrl(url);
    setIsPreviewOpen(true);
  };

  // Edición nombre
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);

  // Borrado
  const [templateToDelete, setTemplateToDelete] = useState<{
    id: string;
    path: string;
    name: string;
  } | null>(null);

  // ← NUEVO: modal de tipo de homologación
  const [templateForHomologation, setTemplateForHomologation] =
    useState<Template | null>(null);
  const [homologationTypes, setHomologationTypes] = useState<
    SimpleHomologationType[]
  >([]);
  const [selectedHomologationTypeId, setSelectedHomologationTypeId] =
    useState<string>("");
  const [savingHomologation, setSavingHomologation] = useState(false);

  // Cargar tipos al montar
  useEffect(() => {
    supabase
      .from("homologation_types")
      .select("id, name")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setHomologationTypes(data ?? []));
  }, []);

  // Cuando se abre el modal, pre-seleccionar el tipo actual
  const openHomologationModal = (t: Template) => {
    setTemplateForHomologation(t);
    setSelectedHomologationTypeId(t.homologation_type_id ?? "");
  };

  const handleSaveHomologation = async () => {
    if (!templateForHomologation) return;
    setSavingHomologation(true);
    await updateTemplateHomologationType(
      templateForHomologation.id,
      selectedHomologationTypeId || null,
    );
    setSavingHomologation(false);
    setTemplateForHomologation(null);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.company?.name.toLowerCase().includes(q),
    );
  }, [templates, search]);

  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      await deleteTemplate(templateToDelete.id, templateToDelete.path);
      setTemplateToDelete(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newName = (formData.get("name") as string)?.trim();
    const newHomologationTypeId = formData.get(
      "homologation_type_id",
    ) as string;

    if (templateToEdit && newName) {
      await supabase
        .from("templates")
        .update({
          name: newName,
          homologation_type_id: newHomologationTypeId || null,
        })
        .eq("id", templateToEdit.id);

      await updateTemplateHomologationType(
        templateToEdit.id,
        newHomologationTypeId || null,
      );
      setTemplateToEdit(null);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8 text-slate-900 dark:text-slate-100 font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Plantillas Word
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Sube y gestiona tus archivos .docx con etiquetas de mapeo.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Subir Plantilla
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o empresa..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 dark:border-slate-800">
              <tr>
                {[
                  "Nombre del Archivo",
                  "Empresa Asignada",
                  "Tipo Homologación",
                  "Última Modificación",
                  "Acciones",
                ].map((col, i) => (
                  <th
                    key={col}
                    className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 ${i === 4 ? "text-right" : ""}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TemplateRowSkeleton key={i} />
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <FileX size={40} className="mb-3 opacity-20" />
                      <p className="font-medium text-sm">
                        No se encontraron plantillas
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((template) => (
                  <TemplateRow
                    key={template.id}
                    template={template}
                    onDelete={(id, path) =>
                      setTemplateToDelete({ id, path, name: template.name })
                    }
                    onMappingClick={(t) => setSelectedTemplateForMapping(t)}
                    onEditClick={(t) => setTemplateToEdit(t)}
                    onPreviewClick={handleOpenPreview}
                    onHomologationClick={openHomologationModal} // ← nuevo prop
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: SUBIR */}
      {showModal && (
        <TemplateUploadModal
          uploading={uploading}
          onClose={() => setShowModal(false)}
          onUpload={uploadTemplate}
        />
      )}

      {/* MODAL: MAPEO */}
      {selectedTemplateForMapping && (
        <MappingModal
          template={selectedTemplateForMapping}
          onClose={() => setSelectedTemplateForMapping(null)}
          onSave={
            updateTemplateMapping as (
              id: string,
              mapping: Record<string, MappingField>,
            ) => Promise<void>
          }
        />
      )}

      {/* MODAL: VISTA PREVIA */}
      <PreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfUrl={selectedPdfUrl}
        isProcessing={false}
        isMapped={true}
      />

      {/* MODAL: TIPO DE HOMOLOGACIÓN ← NUEVO */}
      {templateForHomologation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30">
                    <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold">Tipo de Homologación</h3>
                </div>
                <button
                  onClick={() => setTemplateForHomologation(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Asigna el tipo de homologación para{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  "{templateForHomologation.name}"
                </span>
              </p>

              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={selectedHomologationTypeId}
                  onChange={(e) =>
                    setSelectedHomologationTypeId(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all appearance-none cursor-pointer"
                >
                  <option value="">Sin tipo asignado</option>
                  {homologationTypes.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-6 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setTemplateForHomologation(null)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveHomologation}
                disabled={savingHomologation}
                className="flex-1 px-4 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all"
              >
                {savingHomologation ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR INFORMACIÓN */}
      {templateToEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95">
            <form onSubmit={handleSaveEdit}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Editar Plantilla</h3>
                  <button
                    type="button"
                    onClick={() => setTemplateToEdit(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Nombre de visualización
                    </label>
                    <input
                      name="name"
                      type="text"
                      autoFocus
                      defaultValue={templateToEdit.name}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* ← NUEVO: Tipo de homologación */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Tipo de homologación
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select
                        name="homologation_type_id"
                        defaultValue={templateToEdit.homologation_type_id ?? ""}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Sin tipo asignado</option>
                        {homologationTypes.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed italic">
                      Nota: El cambio de nombre es estético. El archivo físico
                      en el storage mantendrá su nombre original.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 bg-slate-50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => setTemplateToEdit(null)}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMACIÓN BORRADO */}
      {templateToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">¿Eliminar plantilla?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Estás a punto de eliminar{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  "{templateToDelete.name}"
                </span>
                . Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 p-6 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setTemplateToDelete(null)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
