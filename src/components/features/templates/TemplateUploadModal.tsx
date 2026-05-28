"use client";

import { extractTagsFromDocx } from "@/lib/template-parser";
import { useRef, useState, useEffect } from "react";
import { X, Upload, FileText, Building2, Tag, Zap, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TemplateFormData, EMPTY_TEMPLATE_FORM } from "@/lib/types/database";
import { formatFileSize } from "@/lib/utils";

interface SimpleCompany { id: string; name: string; }
interface SimpleHomologationType { id: string; name: string; }

interface Props {
  uploading: boolean;
  onClose: () => void;
  onUpload: (file: File, form: TemplateFormData, onDone: () => void) => Promise<void>;
}

export default function TemplateUploadModal({ uploading, onClose, onUpload }: Props) {
  const [form, setForm] = useState<TemplateFormData>(EMPTY_TEMPLATE_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [companies, setCompanies] = useState<SimpleCompany[]>([]);
  const [homologationTypes, setHomologationTypes] = useState<SimpleHomologationType[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [autoMapping, setAutoMapping] = useState(true);
  const [showMappingWarning, setShowMappingWarning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const autoMappingRef = useRef(autoMapping);
  useEffect(() => {
    autoMappingRef.current = autoMapping;
  }, [autoMapping]);

  useEffect(() => {
    supabase.from("companies").select("id, name").order("name").then(({ data }) => setCompanies(data ?? []));
    supabase.from("homologation_types").select("id, name").eq("active", true).order("name").then(({ data }) => setHomologationTypes(data ?? []));
  }, []);

  const extractAndSetMapping = async (f: File) => {
    try {
      const buffer = await f.arrayBuffer();
      const tags = extractTagsFromDocx(buffer);
      const newMapping: Record<string, any> = {};
      tags.forEach((tag) => {
        newMapping[tag] = { cell: "", type: "", label: tag, sheet: "", format: { case: "none" } };
      });
      setForm((prev) => ({ ...prev, mapping: newMapping }));
    } catch (err) {
      console.error("Error al generar el mapeo automático:", err);
    }
  };

  const handleFile = async (f: File) => {
    if (!f.name.endsWith(".docx")) return;
    setFile(f);
    if (!form.name) setForm((prev) => ({ ...prev, name: f.name.replace(".docx", "") }));
    if (autoMappingRef.current) {
      await extractAndSetMapping(f);
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

  const handleCheckboxClick = () => {
    if (autoMapping) {
      setShowMappingWarning(true);
    } else {
      setAutoMapping(true);
      if (file) extractAndSetMapping(file);
    }
  };

  const confirmDisableMapping = () => {
    setAutoMapping(false);
    setForm((prev) => ({ ...prev, mapping: {} }));
    setShowMappingWarning(false);
  };

  const selectClass =
    "w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--input-bg)] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 text-sm transition-all appearance-none cursor-pointer border border-[var(--border)] font-sans";

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 text-sm transition-all border border-[var(--border)] font-sans";

  const labelClass = "block text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-[var(--card)] rounded-2xl shadow-xl w-full max-w-[560px] border border-[var(--border)] overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
              Subir plantilla
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="flex gap-0">
            {/* Left — drop zone */}
            <div className="p-4 border-r border-[var(--border)]">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{ width: 160, height: 160 }}
                className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all select-none ${
                  dragOver
                    ? "border-accent bg-accent/5"
                    : file
                    ? "border-accent/40 bg-accent/5"
                    : "border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-2 px-3 w-full">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 text-center leading-tight truncate w-full px-1">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); setForm((prev) => ({ ...prev, mapping: {} })); }}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center px-3">
                    <Upload size={20} className="text-slate-300 dark:text-slate-600" />
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-snug">
                      Arrastra o<br />haz clic
                    </p>
                    <span className="text-[10px] text-slate-300 dark:text-slate-600">.docx</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept=".docx"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </div>

              {/* Checkbox mapeo automático */}
              <div className="flex items-start gap-2 mt-3" style={{ width: 160 }}>
                <button
                  type="button"
                  onClick={handleCheckboxClick}
                  className="mt-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-[4px] cursor-pointer"
                  aria-label="Toggle mapeo automático"
                >
                  <div className={`w-3.5 h-3.5 rounded-[4px] border transition-all ${
                    autoMapping
                      ? "bg-accent border-accent"
                      : "bg-transparent border-slate-300 dark:border-slate-600"
                  }`}>
                    {autoMapping && (
                      <svg viewBox="0 0 10 10" className="w-full h-full" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
                <div>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-tight flex items-center gap-1">
                    <Zap size={10} className="text-amber-400" />
                    Mapeo automático
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug mt-0.5">
                    Detecta etiquetas {"{}"} del archivo
                  </p>
                </div>
              </div>
            </div>

            {/* Right — fields */}
            <div className="flex-1 p-4 space-y-3.5">
              <div>
                <label className={labelClass}>Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Certificado Vial v2"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Empresa{" "}
                  <span className="normal-case font-normal text-slate-300 dark:text-slate-600 tracking-normal">
                    — opcional
                  </span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={form.company_id}
                    onChange={(e) => setForm((f) => ({ ...f, company_id: e.target.value }))}
                    className={selectClass}
                  >
                    <option value="">Sin empresa</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Tipo de homologación{" "}
                  <span className="normal-case font-normal text-slate-300 dark:text-slate-600 tracking-normal">
                    — opcional
                  </span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <select
                    value={form.homologation_type_id}
                    onChange={(e) => setForm((f) => ({ ...f, homologation_type_id: e.target.value }))}
                    className={selectClass}
                  >
                    <option value="">Sin tipo asignado</option>
                    {homologationTypes.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-4 py-3 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-[var(--border)] text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading || !file}
              className="flex-1 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            >
              {uploading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload size={12} />
                  Subir plantilla
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Warning modal */}
      {showMappingWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-[300px] border border-[var(--border)] overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex-shrink-0">
                  <AlertTriangle size={15} className="text-amber-500" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Desactivar mapeo
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Las etiquetas <span className="text-slate-700 dark:text-slate-300">{"{}"}</span> no se detectarán automáticamente al subir la plantilla.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mt-1.5">
                ¿Confirmas que quieres continuar sin mapeo?
              </p>
            </div>
            <div className="flex gap-2 px-4 pb-4">
              <button
                onClick={() => setShowMappingWarning(false)}
                className="flex-1 py-2 rounded-xl border border-[var(--border)] text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Mantener
              </button>
              <button
                onClick={confirmDisableMapping}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}