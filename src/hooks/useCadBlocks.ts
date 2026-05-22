// src/hooks/useCadBlocks.ts
"use client";

import { useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";

// Inicializamos el cliente del lado del cliente (browser)
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface CadBlock {
  id: string;
  name: string;
  description: string | null;
  source_format: string;
  tags?: string[]; // Opcional por ahora en el front si no existe en BD
  thumbnail_svg: string | null;
  collection_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useCadBlocks() {
  const [blocks, setBlocks] = useState<CadBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // A. Obtener listado general (Quitamos 'tags' de la consulta de Supabase)
  const fetchBlocks = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("cad_blocks")
        .select(
          "id, name, description, source_format, thumbnail_svg, created_at, updated_at, collection_id", // 👈 'tags' removido de aquí
        )
        .order("created_at", { ascending: false });

      if (searchQuery?.trim()) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      setBlocks(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar los bloques");
    } finally {
      setLoading(false);
    }
  }, []);

  // B. Crear un nuevo bloque (Quitamos 'tags' del objeto de inserción)
  const createBlock = useCallback(
    async (newBlock: Omit<CadBlock, "id"> & { raw_vector_data: string }) => {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("No autenticado");

        const { data, error: dbError } = await supabase
          .from("cad_blocks")
          .insert({
            user_id: user.id,
            name: newBlock.name?.trim() || "Bloque sin nombre",
            description: newBlock.description || null,
            raw_vector_data: newBlock.raw_vector_data,
            source_format: newBlock.source_format || "dxf",
            thumbnail_svg: newBlock.thumbnail_svg || null,
            collection_id: newBlock.collection_id || null,
            // 👈 'tags' removido de aquí para evitar el error de columna inexistente
          })
          .select(
            "id, name, description, source_format, thumbnail_svg, created_at, updated_at, collection_id",
          ) // Aseguramos no pedir tags de vuelta
          .single();

        if (dbError) throw dbError;

        setBlocks((prev) => [data, ...prev]);
        return data;
      } catch (err: any) {
        setError(err.message || "Error al crear el bloque");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // C. Consultar un solo vector pesado bajo demanda (Requerido por BlockPreviewModal y handleCopy)
  const fetchSingleBlockVector = useCallback(async (id: string) => {
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("cad_blocks")
        .select("raw_vector_data")
        .eq("id", id)
        .single();

      if (dbError) throw dbError;
      return data?.raw_vector_data || null;
    } catch (err: any) {
      console.error("Error al obtener el vector crudo:", err);
      return null;
    }
  }, []);

  // D. Eliminar un bloque
  const deleteBlock = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: dbError } = await supabase
        .from("cad_blocks")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      setBlocks((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || "Error al eliminar el bloque");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // E. Actualizar un bloque (PATCH - Excluyendo también 'tags' del retorno)
  const updateBlock = async (id: string, updates: Partial<CadBlock>) => {
    setLoading(true);
    setError(null);
    try {
      // Evitamos enviar tags si por error viene en los updates
      const { tags, ...cleanUpdates } = updates as any;

      const { data, error: dbError } = await supabase
        .from("cad_blocks")
        .update(cleanUpdates)
        .eq("id", id)
        .select(
          "id, name, description, source_format, thumbnail_svg, created_at, updated_at, collection_id",
        )
        .single();

      if (dbError) throw dbError;

      setBlocks((prev) => prev.map((b) => (b.id === id ? data : b)));
      return data;
    } catch (err: any) {
      setError(err.message || "Error al actualizar el bloque");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    blocks,
    loading,
    error,
    fetchBlocks,
    createBlock,
    fetchSingleBlockVector,
    deleteBlock,
    updateBlock,
  };
}
