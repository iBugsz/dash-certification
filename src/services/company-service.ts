// src/services/company-service.ts
import { supabase } from "@/lib/supabase";
import { getStoragePath } from "@/lib/utils";

export const deleteOldLogo = async (oldUrl: string | null) => {
  if (!oldUrl) return;
  const path = getStoragePath(oldUrl);
  if (!path) return;

  const { error } = await supabase.storage.from("logos").remove([path]);
  if (error) {
    console.error("Error al eliminar logo antiguo:", error.message);
    // Opcional: podrías lanzar el error si quieres manejarlo en la UI
  }
};
