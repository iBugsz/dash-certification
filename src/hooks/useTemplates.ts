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

  // --- ESTA ES LA FUNCIÓN QUE TE FALTABA ---
  const updateTemplateMapping = async (id: string, mapping: Record<string, string>) => {
    try {
      const { error } = await supabase
        .from("templates")
        .update({ mapping }) // Actualizamos la columna mapping (jsonb)
        .eq("id", id);

      if (error) {
        console.error("Error actualizando mapeo en Supabase:", error.message);
        throw error;
      }

      // Refrescamos la lista local para que veas los cambios de una
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

      const { error: insertError } = await supabase.from("templates").insert({
        name: form.name.trim() || file.name,
        description: form.description || null,
        file_path: filePath,
        file_name: file.name,
        file_url: urlData.publicUrl,
        company_id: form.company_id || null,
        active: true,
        mapping: {}, // Inicializamos mapping como objeto vacío
      });

      if (insertError) {
        console.error("Error creando el registro:", insertError.message);
        await deleteTemplateFile(filePath);
        setUploading(false);
        return;
      }

      await fetchTemplates(); 
      onDone();
    } catch (err) {
      console.error("Error crítico en subida:", err);
    } finally {
      setUploading(false);
    }
  };

  const deleteTemplate = async (id: string, filePath: string) => {
    try {
      await deleteTemplateFile(filePath);
      const { error } = await supabase.from("templates").delete().eq("id", id);
      if (error) console.error("Error eliminando:", error.message);
      await fetchTemplates();
    } catch (err) {
      console.error("Error en eliminación:", err);
    }
  };

  // ✅ AQUÍ ESTÁ EL CAMBIO IMPORTANTE: Agregué 'updateTemplateMapping' al return
  return { 
    templates, 
    loading, 
    uploading, 
    uploadTemplate, 
    deleteTemplate,
    updateTemplateMapping 
  };
}