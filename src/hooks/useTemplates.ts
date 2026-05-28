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
  filePath: string, // Ejemplo: "uploads/MiPlantilla_a7f2.docx"
  onSuccess: (previewUrl: string) => void,
) => {
  // Extraemos "MiPlantilla_a7f2" del path
  const fileName = filePath.split("/").pop()?.split(".")[0];

  fetch("/api/templates/generate-preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId, storagePath: filePath, fileName }), // Enviamos fileName
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

    // 1. Limpiamos el nombre original y separamos la extensión
    const rawName = file.name.replace(/\.[^/.]+$/, ""); // Nombre sin extensión
    const extension = file.name.split(".").pop(); // La extensión (ej: 'docx')
    const cleanName = sanitizeFileName(rawName);

    // 2. Generamos un sufijo único corto (ej: "_a7f2")
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);

    // 3. Ruta final: "uploads/Nombre_a7f2.docx"
    const filePath = `uploads/${cleanName}_${uniqueSuffix}.${extension}`;

    try {
      // 4. Subimos a Supabase
      // Ya no necesitamos upsert: true porque cada nombre es único
      const { error: uploadError } = await supabase.storage
        .from("templates")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Error subiendo archivo:", uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("templates")
        .getPublicUrl(filePath);

      // 5. Creamos el registro en la base de datos
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
          mapping: form.mapping || {},
          preview_url: null,
        })
        .select(
          "*, company:companies(id, name), homologation_type:homologation_types(id, name)",
        )
        .single();

      if (insertError) {
        console.error("Error creando el registro:", insertError.message);
        // Limpiamos el archivo subido si falla la base de datos
        await supabase.storage.from("templates").remove([filePath]);
        setUploading(false);
        return;
      }

      setTemplates((prev) => [insertedRows, ...prev]);

      onDone();
      setUploading(false);

      // 6. Generación de preview (usando la nueva ruta única)
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
      // 1. Borrar ambos archivos del Storage (el .docx y el .pdf de preview)
      // Usamos un array para borrar ambos en una sola petición al servidor
      const { error: storageError } = await supabase.storage
        .from("templates")
        .remove([filePath, `previews/${id}.pdf`]);

      if (storageError) {
        console.error(
          "Error borrando archivos del Storage:",
          storageError.message,
        );
        // Opcional: tirar error aquí si quieres detener la eliminación de la base de datos
      }

      // 2. Borrar el registro de la Base de Datos
      const { error: dbError } = await supabase
        .from("templates")
        .delete()
        .eq("id", id);

      if (dbError) {
        console.error("Error borrando registro de la BD:", dbError.message);
      }
    } catch (err) {
      console.error("Error crítico en eliminación:", err);
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
