// src/services/template-service.ts
import { supabase } from "@/lib/supabase";

export const deleteTemplateFile = async (filePath: string) => {
  if (!filePath) return;
  const { error } = await supabase.storage.from("templates").remove([filePath]);
  if (error) {
    console.error("Error al borrar archivo:", error.message);
    throw error;
  }
};
