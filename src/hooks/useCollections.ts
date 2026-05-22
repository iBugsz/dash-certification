"use client";

import { useState, useEffect, useCallback } from "react";
// 1. Cambiamos la importación para traer la constante 'supabase' que ya tienes creada
import { supabase } from "@/lib/supabase";
import { Collection } from "@/lib/types/database";

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  // 2. Quitamos la línea que decía "const supabase = createClient();"
  // porque ahora usamos la constante global que importamos arriba.

  // Cargar todas las colecciones
  const loadCollections = useCallback(async () => {
    setLoadingCollections(true);
    try {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setCollections(data ?? []);
    } catch (error) {
      console.error("Error al cargar colecciones desde el Hook:", error);
    } finally {
      setLoadingCollections(false);
    }
  }, []); // Quitamos 'supabase' de las dependencias porque es una constante externa estática

  // Crear una nueva colección
  const createCollection = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from("collections")
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;

      setCollections((prev) =>
        [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
      );
      return { success: true, data };
    } catch (error: any) {
      console.error("Error al crear colección:", error);
      return { success: false, error: error.message };
    }
  };

  // Editar una colección existente
  const editCollection = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from("collections")
        .update({ name: newName })
        .eq("id", id);

      if (error) throw error;

      setCollections((prev) =>
        prev
          .map((col) => (col.id === id ? { ...col, name: newName } : col))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      return { success: true };
    } catch (error: any) {
      console.error("Error al editar colección:", error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return {
    collections,
    loadingCollections,
    refreshCollections: loadCollections,
    createCollection,
    editCollection,
  };
}
