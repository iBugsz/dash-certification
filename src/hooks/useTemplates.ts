"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Template, TemplateFormData } from "@/lib/templates/types";
import { deleteTemplateFile } from "@/lib/templates/utils";

const sanitizeFileName = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .replace(/_{2,}/g, "_");
};

// ─── Preview en background ────────────────────────────────────────────────────
// Fire-and-forget: no bloquea la UI. Cuando termina, parchea el estado local
// con la preview_url. Si falla, solo loguea — el usuario no se entera.
const triggerPreviewGeneration = (
  templateId: string,
  filePath: string,
  onSuccess: (previewUrl: string) => void
) => {
  // NO usamos 'await' aquí para que el hilo principal siga libre
  fetch("/api/templates/generate-preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId, storagePath: filePath }),
    // Esto es clave: le decimos al navegador que mantenga la conexión viva
    keepalive: true, 
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Error en servidor");
      const { previewUrl } = await res.json();
      if (previewUrl) onSuccess(previewUrl);
    })
    .catch((err) => {
      console.warn("[generate-preview] Error de fondo (Adobe tardó mucho o falló):", err.message);
    });
};

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*, company:companies(id, name)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener plantillas:", error.message);
        setTemplates([]);
      } else {
        setTemplates((data as Template[]) ?? []);
      }
    } catch (err) {
      console.error("Error inesperado en fetch:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const updateTemplateMapping = async (id: string, mapping: Record<string, string>) => {
    try {
      const { error } = await supabase
        .from("templates")
        .update({ mapping })
        .eq("id", id);

      if (error) {
        console.error("Error actualizando mapeo en Supabase:", error.message);
        throw error;
      }

      await fetchTemplates();
    } catch (err) {
      console.error("Error crítico actualizando mapeo:", err);
      throw err;
    }
  };

  const uploadTemplate = async (
    file: File,
    form: TemplateFormData,
    onDone: () => void
  ) => {
    if (!file) return;
    setUploading(true);

    const cleanFileName = sanitizeFileName(file.name);
    const filePath = `uploads/${Date.now()}_${cleanFileName}`;

    try {
      // PASO 1 — Subir el .docx al bucket
      const { error: uploadError } = await supabase.storage
        .from("templates")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Error subiendo archivo al Storage:", uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("templates")
        .getPublicUrl(filePath);

      // PASO 2 — Insertar registro (preview_url null por ahora)
      const { data: insertedRows, error: insertError } = await supabase
        .from("templates")
        .insert({
          name: form.name.trim() || file.name,
          description: form.description || null,
          file_path: filePath,
          file_name: file.name,
          file_url: urlData.publicUrl,
          company_id: form.company_id || null,
          active: true,
          mapping: {},
          preview_url: null, // se llenará en background
        })
        .select("*, company:companies(id, name)")
        .single();

      if (insertError) {
        console.error("Error creando el registro:", insertError.message);
        await deleteTemplateFile(filePath);
        setUploading(false);
        return;
      }

      // PASO 3 — Refrescar lista y cerrar modal (el usuario ya ve su plantilla)
      await fetchTemplates();
      onDone();
      setUploading(false);

      // PASO 4 — Lanzar conversión a PDF en background (sin await)
      // Cuando termina, actualiza solo ese template en el estado local
      triggerPreviewGeneration(
        insertedRows.id,
        filePath,
        (previewUrl) => {
          setTemplates((prev) =>
            prev.map((t) =>
              t.id === insertedRows.id ? { ...t, preview_url: previewUrl } : t
            )
          );
        }
      );
    } catch (err) {
      console.error("Error crítico en subida:", err);
      setUploading(false);
    }
  };

  const deleteTemplate = async (id: string, filePath: string) => {
    try {
      await deleteTemplateFile(filePath);

      // Borrar también el preview del storage si existe
      await supabase.storage
        .from("templates")
        .remove([`previews/${id}.pdf`]);

      const { error } = await supabase.from("templates").delete().eq("id", id);
      if (error) console.error("Error eliminando:", error.message);
      await fetchTemplates();
    } catch (err) {
      console.error("Error en eliminación:", err);
    }
  };

  return {
    templates,
    loading,
    uploading,
    uploadTemplate,
    deleteTemplate,
    updateTemplateMapping,
  };
}