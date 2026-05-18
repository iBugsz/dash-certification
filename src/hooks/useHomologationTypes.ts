"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  HomologationType,
  HomologationTypeFormData,
} from "@/lib/types/database";

export function useHomologationTypes() {
  const [homologationTypes, setHomologationTypes] = useState<
    HomologationType[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchHomologationTypes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("homologation_types")
      .select("id, name, description, active, created_at, updated_at")
      .order("created_at", { ascending: false });
    setHomologationTypes(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHomologationTypes();
  }, []);

  const saveHomologationType = async (
    form: HomologationTypeFormData,
    editing: HomologationType | null,
    onDone: () => void,
  ) => {
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      icon: form.icon || "FileQuestion", // ← nuevo
    };

    if (editing) {
      await supabase
        .from("homologation_types")
        .update(payload)
        .eq("id", editing.id);
    } else {
      await supabase.from("homologation_types").insert(payload);
    }

    fetchHomologationTypes();
    onDone();
  };

  const deleteHomologationType = async (id: string) => {
    await supabase.from("homologation_types").delete().eq("id", id);
    fetchHomologationTypes();
  };

  return {
    homologationTypes,
    loading,
    saveHomologationType,
    deleteHomologationType,
  };
}
