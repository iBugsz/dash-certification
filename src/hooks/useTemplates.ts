"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Template, TemplateFormData } from "@/lib/templates/types";
import { deleteTemplateFile } from "@/lib/templates/utils";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Usamos useCallback para poder llamarlo después de insertar/eliminar
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

  const uploadTemplate = async (
    file: File,
    form: TemplateFormData,
    onDone: () => void
  ) => {
    if (!file) return;
    setUploading(true);

    // Generar ruta única para el storage
    const filePath = `uploads/${Date.now()}_${file.name}`;

    try {
      // 1. Subir el archivo al Storage
      const { error: uploadError } = await supabase.storage
        .from("templates")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Error subiendo archivo al Storage:", uploadError.message);
        setUploading(false);
        return;
      }

      // 2. Obtener la URL pública del archivo subido
      const { data: urlData } = supabase.storage
        .from("templates")
        .getPublicUrl(filePath);

      // 3. Insertar el registro en la tabla 'templates'
      // Incluimos todos los campos obligatorios de tu interfaz
      const { error: insertError } = await supabase.from("templates").insert({
        name: form.name.trim() || file.name,
        description: form.description || null,
        file_path: filePath,
        file_name: file.name, // Campo obligatorio en tu interfaz
        file_url: urlData.publicUrl,
        company_id: form.company_id || null,
        active: true,         // Campo obligatorio en tu interfaz
        variables: {},        // Inicializamos vacío para evitar errores de tipo
      });

      if (insertError) {
        console.error("Error creando el registro en la tabla templates:", insertError.message);
        // Si falla el insert, lo ideal sería borrar el archivo del storage para no dejar basura
        await deleteTemplateFile(filePath);
        setUploading(false);
        return;
      }

      // Todo salió bien
      await fetchTemplates(); // Actualizar la lista local
      onDone();              // Cerrar modal
    } catch (err) {
      console.error("Error crítico en el proceso de subida:", err);
    } finally {
      setUploading(false);
    }
  };

  const deleteTemplate = async (id: string, filePath: string) => {
    try {
      // Intentar borrar del storage
      await deleteTemplateFile(filePath);
      
      // Borrar de la base de datos
      const { error } = await supabase.from("templates").delete().eq("id", id);
      
      if (error) {
        console.error("Error eliminando de la base de datos:", error.message);
      }
      
      await fetchTemplates();
    } catch (err) {
      console.error("Error en el proceso de eliminación:", err);
    }
  };

  return { templates, loading, uploading, uploadTemplate, deleteTemplate };
}