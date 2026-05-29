"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  FileX,
  AlertTriangle,
  Trash2,
  X,
  Tag,
  Building2,
} from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import TemplateRow from "@/components/features/templates/TemplateRow";
import TemplateRowSkeleton from "@/components/features/templates/TemplateRowSkeleton";
import TemplateUploadModal from "@/components/features/templates/TemplateUploadModal";
import MappingModal from "@/components/features/templates/MappingModal";
import { PreviewDrawer } from "@/components/features/certificates/PreviewDrawer";
import { PresetManager } from "@/components/features/templates/PresetManager";
import { Template, MappingField } from "@/lib/types/database";
import { supabase } from "@/lib/supabase";
import { DeleteModal } from "@/components/ui/DeleteModal";

interface SimpleHomologationType {
  id: string;
  name: string;
}

interface SimpleCompany {
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
  } = useTemplates();

  const [showModal, setShowModal] = useState(false);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTemplateForMapping, setSelectedTemplateForMapping] =
    useState<Template | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  
  const handleOpenPreview = (url: string) => {
    setSelectedPdfUrl(url);
    setIsPreviewOpen(true);
  };

  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<{
    id: string;
    path: string;
    name: string;
  } | null>(null);

  const [homologationTypes, setHomologationTypes] = useState<SimpleHomologationType[]>([]);
  const [companies, setCompanies] = useState<SimpleCompany[]>([]);

  useEffect(() => {
    supabase
      .from("homologation_types")
      .select("id, name")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setHomologationTypes(data ?? []));

    supabase
      .from("companies")
      .select("id, name")
      .order("name")
      .then(({ data }) => setCompanies(data ?? []));
  }, []);

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
    const newHomologationTypeId = formData.get("homologation_type_id") as string;
    const newCompanyId = formData.get("company_id") as string;

    if (templateToEdit && newName) {
      await supabase
        .from("templates")
        .update({
          name: newName,
          homologation_type_id: newHomologationTypeId || null,
          company_id: newCompanyId || null,
        })
        .eq("id", templateToEdit.id);
      
      setTemplateToEdit(null);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-6 text-slate-900 dark:text-slate-100 ">

    {/* Header completo */}
    <div className="flex flex-col gap-6">
      {/* Título y descripción */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Plantillas Word
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Sube y gestiona tus archivos .docx con etiquetas de mapeo.
        </p>
      </div>

      {/* Fila de controles: Buscador + Botones minimalistas */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Buscador */}
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o empresa..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
          />
        </div>

        {/* Botones Icon-Only Compactos */}
        <div className="flex items-center gap-1.5 ml-auto">
          
          {/* Botón Gestionar Tags */}
          <div className="group relative">
            <button
              onClick={() => setShowPresetManager(true)}
              className="cursor-pointer p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Tag className="w-4 h-4" />
            </button>
            {/* Tooltip arriba centrado */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Gestionar Tags
            </div>
          </div>

          {/* Botón Subir Plantilla */}
          <div className="group relative">
            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
            {/* Tooltip arriba centrado */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Subir Plantilla
            </div>
          </div>
          
        </div>
      </div>
    </div>
      {/* Grid de cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <TemplateRowSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FileX size={36} className="mb-3 opacity-20" />
          <p className="text-sm font-medium">No se encontraron plantillas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((template) => (
            <TemplateRow
              key={template.id}
              template={template}
              onDelete={(id, path) =>
                setTemplateToDelete({ id, path, name: template.name })
              }
              onMappingClick={(t) => setSelectedTemplateForMapping(t)}
              onEditClick={(t) => setTemplateToEdit(t)}
              onPreviewClick={handleOpenPreview}
            />
          ))}
        </div>
      )}

      {/* MODALES */}
      {showPresetManager && <PresetManager onClose={() => setShowPresetManager(false)} />}
      
      {showModal && (
        <TemplateUploadModal
          uploading={uploading}
          onClose={() => setShowModal(false)}
          onUpload={uploadTemplate}
        />
      )}

      {selectedTemplateForMapping && (
        <MappingModal
          template={selectedTemplateForMapping}
          onClose={() => setSelectedTemplateForMapping(null)}
          onSave={updateTemplateMapping}
        />
      )}

      <PreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfUrl={selectedPdfUrl}
        isProcessing={false}
        isMapped={true}
      />

      {/* MODAL: EDITAR */}
      {templateToEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95">
            <form onSubmit={handleSaveEdit}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Editar Plantilla</h3>
                  <button type="button" onClick={() => setTemplateToEdit(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nombre</label>
                    <input name="name" type="text" autoFocus defaultValue={templateToEdit.name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Empresa asignada</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select name="company_id" defaultValue={templateToEdit.company_id ?? ""} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all appearance-none cursor-pointer">
                        <option value="">Sin empresa</option>
                        {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tipo de homologación</label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select name="homologation_type_id" defaultValue={templateToEdit.homologation_type_id ?? ""} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all appearance-none cursor-pointer">
                        <option value="">Sin tipo asignado</option>
                        {homologationTypes.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 p-6 pt-0">
                <button type="button" onClick={() => setTemplateToEdit(null)} className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteModal 
        isOpen={!!templateToDelete}
        onClose={() => setTemplateToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar plantilla?"
        message={`Estás a punto de eliminar "${templateToDelete?.name}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
}