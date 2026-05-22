// src/hooks/useCadBlocks.ts
"use client";

import { useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
// 1. Importamos el tipo global para mantener la consistencia
import { CADBlock } from "@/lib/types/database";

// Inicializamos el cliente del lado del cliente (browser)
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// 2. Extendemos el tipo de la base de datos asegurando compatibilidad total
// Hacemos que user_id y raw_vector_data sean opcionales en el estado local
// porque se cargan bajo demanda o son manejados por el backend.
export interface ClientCadBlock extends Partial<CADBlock> {
  id: string;
  name: string;
  description: string | null;
  source_format: string;
  thumbnail_svg: string | null;
  collection_id: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string;
  raw_vector_data?: string;
}

export function useCadBlocks() {
  // 3. Usamos la interfaz unificada para el estado
  const [blocks, setBlocks] = useState<ClientCadBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // A. Obtener listado general (Sin 'tags' ni 'raw_vector_data' por rendimiento)
  const fetchBlocks = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("cad_blocks")
        .select(
          "id, name, description, source_format, thumbnail_svg, created_at, updated_at, collection_id",
        )
        .order("created_at", { ascending: false });

      if (searchQuery?.trim()) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      setBlocks((data as ClientCadBlock[]) || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar los bloques");
    } finally {
      setLoading(false);
    }
  }, []);

  // B. Crear un nuevo bloque
  const createBlock = useCallback(
    async (
      newBlock: Omit<ClientCadBlock, "id" | "created_at" | "updated_at"> & {
        raw_vector_data: string;
      },
    ) => {
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
          })
          .select(
            "id, name, description, source_format, thumbnail_svg, created_at, updated_at, collection_id",
          )
          .single();

        if (dbError) throw dbError;

        setBlocks((prev) => [data as ClientCadBlock, ...prev]);
        return data as ClientCadBlock;
      } catch (err: any) {
        setError(err.message || "Error al crear el bloque");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // C. Consultar un solo vector pesado bajo demanda
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

  // E. Actualizar un bloque (PATCH)
  const updateBlock = async (id: string, updates: Partial<ClientCadBlock>) => {
    setLoading(true);
    setError(null);
    try {
      const { ...cleanUpdates } = updates as any;

      const { data, error: dbError } = await supabase
        .from("cad_blocks")
        .update(cleanUpdates)
        .eq("id", id)
        .select(
          "id, name, description, source_format, thumbnail_svg, created_at, updated_at, collection_id",
        )
        .single();

      if (dbError) throw dbError;

      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? (data as ClientCadBlock) : b)),
      );
      return data as ClientCadBlock;
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
