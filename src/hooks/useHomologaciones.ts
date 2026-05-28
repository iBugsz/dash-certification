import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

export interface Homologacion {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  due_date: string | null;
  is_completed: boolean;
  tags: string[];
  company_id: string | null;
  category: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useHomologaciones() {
  const [homologaciones, setHomologaciones] = useState<Homologacion[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Traer homologaciones
      const { data: hData, error: hError } = await supabase
        .from("homologaciones")
        .select("*")
        .order("created_at", { ascending: false });

      if (hError) throw hError;
      setHomologaciones(hData || []);

      // 2. Traer empresas para los selectores del modal
      const { data: cData, error: cError } = await supabase
        .from("companies")
        .select("id, name")
        .order("name", { ascending: true });

      if (cError) throw cError;
      setCompanies(cData || []);
    } catch (err) {
      console.error("Error cargando datos en el hook:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveHomologacion = async (item: Partial<Homologacion>) => {
    try {
      if (item.id) {
        const { error } = await supabase
          .from("homologaciones")
          .update({
            name: item.name,
            description: item.description,
            start_date: item.start_date,
            due_date: item.due_date,
            tags: item.tags,
            company_id: item.company_id,
            category: item.category,
          })
          .eq("id", item.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("homologaciones").insert([
          {
            name: item.name,
            description: item.description,
            start_date: item.start_date,
            due_date: item.due_date,
            is_completed: false,
            tags: item.tags || [],
            company_id: item.company_id,
            category: item.category,
          },
        ]);

        if (error) throw error;
      }
      await fetchData();
    } catch (err: any) {
      // Convertimos a JSON para ver las propiedades internas que console.error oculta
      console.error("Error al guardar:", JSON.stringify(err, null, 2));

      // Si err tiene un mensaje, lo mostramos
      if (err.message) console.error("Mensaje:", err.message);
      if (err.details) console.error("Detalles:", err.details);

      throw err;
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setHomologaciones((prev) =>
        prev.map((h) =>
          h.id === id ? { ...h, is_completed: !currentStatus } : h,
        ),
      );

      const { error } = await supabase
        .from("homologaciones")
        .update({ is_completed: !currentStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error cambiando estado:", err);
      await fetchData();
    }
  };

  const deleteHomologacion = async (id: string) => {
    if (!confirm("¿Deseas eliminar esta homologación?")) return;
    try {
      setHomologaciones((prev) => prev.filter((h) => h.id !== id));
      const { error } = await supabase
        .from("homologaciones")
        .delete()
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Error eliminando:", err);
      await fetchData();
    }
  };

  return {
    homologaciones,
    companies,
    loading,
    saveHomologacion,
    toggleStatus,
    deleteHomologacion,
    refetch: fetchData,
  };
}
