"use client";

import { extractTagsFromDocx } from "@/lib/template-parser";
import { useRef, useState, useEffect } from "react";
import { X, Upload, FileText, Building2, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TemplateFormData, EMPTY_TEMPLATE_FORM } from "@/lib/types/database";
import { formatFileSize } from "@/lib/utils";

interface SimpleCompany {
  id: string;
  name: string;
}
interface SimpleHomologationType {
  id: string;
  name: string;
} // ← nuevo

interface Props {
  uploading: boolean;
  onClose: () => void;
  onUpload: (
    file: File,
    form: TemplateFormData,
    onDone: () => void,
  ) => Promise<void>;
}

export default function TemplateUploadModal({
  uploading,
  onClose,
  onUpload,
}: Props) {
  const [form, setForm] = useState<TemplateFormData>(EMPTY_TEMPLATE_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [companies, setCompanies] = useState<SimpleCompany[]>([]);
  const [homologationTypes, setHomologationTypes] = useState<
    SimpleHomologationType[]
  >([]); // ← nuevo
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from("companies")
      .select("id, name")
      .order("name")
      .then(({ data }) => setCompanies(data ?? []));

    // ← nuevo: cargar tipos de homologación
    supabase
      .from("homologation_types")
      .select("id, name")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setHomologationTypes(data ?? []));
  }, []);

  const handleFile = async (f: File) => {
    if (!f.name.endsWith(".docx")) return;
    setFile(f);
    
    if (!form.name)
      setForm((prev) => ({ ...prev, name: f.name.replace(".docx", "") }));

    try {
      const buffer = await f.arrayBuffer();
      const tags = extractTagsFromDocx(buffer);
      
      // Construir el objeto de mapeo con el formato exacto que solicitaste
      const newMapping: Record<string, any> = {};
      
      tags.forEach((tag) => {
        newMapping[tag] = {
          cell: "",
          type: "",
          label: tag,
          sheet: "",
          format: {
            case: "none"
          }
        };
      });

      // Guardamos el mapping en el estado del formulario
      setForm((prev) => ({ ...prev, mapping: newMapping }));
      
    } catch (err) {
      console.error("Error al generar el mapeo automático:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleSubmit = async () => {
    if (!file) return;
    await onUpload(file, form, onClose);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-[var(--input-bg)] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] text-sm transition-all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--card)] rounded-[24px] shadow-2xl w-full max-w-md border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent/10">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Subir Plantilla
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-accent bg-accent/5"
                : file
                  ? "border-accent/50 bg-accent/5"
                  : "border-[var(--border)] hover:border-accent"
            }`}
          >
            {file ? (
              <div className="flex items-center gap-3 justify-center">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="ml-auto p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={24} className="mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Arrastra tu archivo aquí o haz clic
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Solo archivos .docx
                </p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".docx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Nombre de la plantilla
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Certificado Vial v2"
              className={inputClass}
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Empresa asignada{" "}
              <span className="text-slate-300 dark:text-slate-600 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={form.company_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, company_id: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input-bg)] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] text-sm transition-all appearance-none cursor-pointer"
              >
                <option value="">Sin empresa</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ← NUEVO: Tipo de homologación */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Tipo de homologación{" "}
              <span className="text-slate-300 dark:text-slate-600 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={form.homologation_type_id}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    homologation_type_id: e.target.value,
                  }))
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--input-bg)] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] text-sm transition-all appearance-none cursor-pointer"
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
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || !file}
            className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload size={15} />
                Subir plantilla
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
