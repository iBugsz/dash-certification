"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Template, TemplateFormData } from "@/lib/types/database";
import { deleteTemplateFile } from "@/services/template-service";

const sanitizeFileName = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .replace(/_{2,}/g, "_");
};

const triggerPreviewGeneration = (
  templateId: string,
  filePath: string,
  onSuccess: (previewUrl: string) => void,
) => {
  fetch("/api/templates/generate-preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId, storagePath: filePath }),
    keepalive: true,
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Error en servidor");
      const { previewUrl } = await res.json();
      if (previewUrl) onSuccess(previewUrl);
    })
    .catch((err) => {
      console.warn("[generate-preview] Error de fondo:", err.message);
    });
};

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Cambia tu función fetchTemplates por esta:
  const fetchTemplates = useCallback(async (isSilent = false) => {
    // Solo activamos el loading si NO es un refresco silencioso
    if (!isSilent) setLoading(true);

    try {
      const { data, error } = await supabase
        .from("templates")
        .select(
          "*, company:companies(id, name), homologation_type:homologation_types(id, name)",
        )
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
      // Solo apagamos el loading si lo encendimos antes
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // ==========================================
  // ESCUCHAR CAMBIOS EN TIEMPO REAL (REALTIME)
  // ==========================================
  // En tu hook useTemplates(), busca el useEffect de Realtime:
  useEffect(() => {
    const channel = supabase
      .channel("templates-realtime-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Escucha INSERT, UPDATE y DELETE
          schema: "public",
          table: "templates",
        },
        async (payload) => {
          console.log("Cambio en tiempo real recibido:", payload);

          if (payload.eventType === "INSERT") {
            // Refresco silencioso: agrega la nueva tarjeta con sus relaciones
            // en segundo plano sin activar los esqueletos de carga
            fetchTemplates(true);
          } else if (payload.eventType === "UPDATE") {
            const updatedRow = payload.new as Template;

            // 1. Actualiza campos planos (como el nombre) al instante en milisegundos
            setTemplates((prevTemplates) =>
              prevTemplates.map((template) =>
                template.id === updatedRow.id
                  ? { ...template, ...updatedRow }
                  : template,
              ),
            );

            // 2. Trae las relaciones (empresa/homologación) de manera silenciosa
            fetchTemplates(true);
          } else if (payload.eventType === "DELETE") {
            const deletedRow = payload.old;
            setTemplates((prevTemplates) =>
              prevTemplates.filter((template) => template.id !== deletedRow.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTemplates]);

  const updateTemplateMapping = async (id: string, mapping: any) => {
    try {
      const { error } = await supabase
        .from("templates")
        .update({ mapping })
        .eq("id", id);

      if (error) {
        console.error("Error actualizando mapeo:", error.message);
        throw error;
      }
      // Ya no es estrictamente obligatorio refrescar a mano si Realtime está activo,
      // pero lo dejamos por seguridad.
      await fetchTemplates();
    } catch (err) {
      console.error("Error crítico actualizando mapeo:", err);
      throw err;
    }
  };

  const uploadTemplate = async (
    file: File,
    form: TemplateFormData,
    onDone: () => void,
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
        console.error("Error subiendo archivo:", uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("templates")
        .getPublicUrl(filePath);

      const { data: insertedRows, error: insertError } = await supabase
        .from("templates")
        .insert({
          name: form.name.trim() || file.name,
          description: form.description || null,
          file_path: filePath,
          file_name: file.name,
          file_url: urlData.publicUrl,
          company_id: form.company_id || null,
          homologation_type_id: form.homologation_type_id || null,
          active: true,
          mapping: {},
          preview_url: null,
        })
        .select(
          "*, company:companies(id, name), homologation_type:homologation_types(id, name)",
        )
        .single();

      if (insertError) {
        console.error("Error creando el registro:", insertError.message);
        await deleteTemplateFile(filePath);
        setUploading(false);
        return;
      }

      onDone();
      setUploading(false);

      triggerPreviewGeneration(insertedRows.id, filePath, (previewUrl) => {
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === insertedRows.id ? { ...t, preview_url: previewUrl } : t,
          ),
        );
      });
    } catch (err) {
      console.error("Error crítico en subida:", err);
      setUploading(false);
    }
  };

  const deleteTemplate = async (id: string, filePath: string) => {
    try {
      await deleteTemplateFile(filePath);
      await supabase.storage.from("templates").remove([`previews/${id}.pdf`]);
      const { error } = await supabase.from("templates").delete().eq("id", id);
      if (error) console.error("Error eliminando:", error.message);
    } catch (err) {
      console.error("Error en eliminación:", err);
    }
  };

  const updateTemplateHomologationType = async (
    id: string,
    homologation_type_id: string | null,
  ) => {
    const { error } = await supabase
      .from("templates")
      .update({ homologation_type_id: homologation_type_id || null })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando tipo de homologación:", error.message);
      throw error;
    }
  };

  return {
    templates,
    loading,
    uploading,
    uploadTemplate,
    deleteTemplate,
    updateTemplateMapping,
    updateTemplateHomologationType,
    fetchTemplates,
  };
}
