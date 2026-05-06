"use client";

import { useRef, useState } from "react";
import { X, Upload, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Company, CompanyFormData, EMPTY_FORM } from "@/lib/types/database";
import { deleteOldLogo } from "@/services/company-service";

interface Props {
  editing: Company | null;
  onClose: () => void;
  onSave: (
    form: CompanyFormData,
    editing: Company | null,
    onDone: () => void,
  ) => Promise<void>;
}

export default function CompanyModal({ editing, onClose, onSave }: Props) {
  const [form, setForm] = useState<CompanyFormData>(
    editing
      ? {
          name: editing.name,
          email: editing.email ?? "",
          phone: editing.phone ?? "",
          logo_url: editing.logo_url ?? "",
        }
      : EMPTY_FORM,
  );
  const [logoMode, setLogoMode] = useState<"url" | "file">("url");
  const [logoPreview, setLogoPreview] = useState(editing?.logo_url ?? "");
  const [logoError, setLogoError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await deleteOldLogo(form.logo_url);
    const ext = file.name.split(".").pop();
    const path = `company-logos/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("logos")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (!error) {
      const { data } = supabase.storage.from("logos").getPublicUrl(path);
      setForm((f) => ({ ...f, logo_url: data.publicUrl }));
      setLogoPreview(data.publicUrl);
      setLogoError(false);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(form, editing, onClose);
    setSaving(false);
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
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {editing ? "Editar empresa" : "Nueva empresa"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Transportes Global S.A."
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Correo{" "}
              <span className="text-slate-300 dark:text-slate-600 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="contacto@empresa.com"
              className={inputClass}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Teléfono{" "}
              <span className="text-slate-300 dark:text-slate-600 normal-case font-normal">
                (opcional)
              </span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="+57 300 000 0000"
              className={inputClass}
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Logo{" "}
              <span className="text-slate-300 dark:text-slate-600 normal-case font-normal">
                (opcional)
              </span>
            </label>

            {/* Tabs URL / Archivo */}
            <div className="flex gap-2 mb-3">
              {(["url", "file"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLogoMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    logoMode === mode
                      ? "bg-accent text-white"
                      : "bg-[var(--input-bg)] text-slate-500 hover:text-accent"
                  }`}
                >
                  {mode === "url" ? (
                    <LinkIcon size={12} />
                  ) : (
                    <Upload size={12} />
                  )}
                  {mode === "url" ? "URL" : "Subir archivo"}
                </button>
              ))}
            </div>

            {logoMode === "url" ? (
              <input
                type="url"
                value={form.logo_url}
                onChange={(e) => {
                  setForm((f) => ({ ...f, logo_url: e.target.value }));
                  setLogoPreview(e.target.value);
                  setLogoError(false);
                }}
                placeholder="https://..."
                className={inputClass}
              />
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-[var(--border)] hover:border-accent rounded-xl p-5 text-center cursor-pointer transition-colors"
              >
                {uploading ? (
                  <p className="text-sm text-accent font-medium">Subiendo...</p>
                ) : (
                  <>
                    <Upload
                      size={22}
                      className="mx-auto mb-1.5 text-slate-400"
                    />
                    <p className="text-xs text-slate-500 font-medium">
                      Haz clic para seleccionar imagen
                    </p>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">
                      PNG, JPG, WEBP — máx 2MB
                    </p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {/* Preview */}
            {logoPreview && !logoError && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-[var(--input-bg)] rounded-xl">
                <img
                  src={logoPreview}
                  alt="preview"
                  className="w-12 h-12 object-contain rounded-lg bg-white dark:bg-slate-800 p-1"
                  onError={() => setLogoError(true)}
                />
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Vista previa
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Así se verá el logo de la empresa
                  </p>
                </div>
              </div>
            )}
            {logoError && (
              <p className="mt-2 text-xs text-red-400">
                No se pudo cargar la imagen. Verifica la URL.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving
              ? "Guardando..."
              : editing
                ? "Guardar cambios"
                : "Crear empresa"}
          </button>
        </div>
      </div>
    </div>
  );
}
