"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAppSettings() {
  const [appName, setAppName] = useState("AutoCert");
  const [loadingAppName, setLoadingAppName] = useState(true);
  const [savingAppName, setSavingAppName] = useState(false);

  useEffect(() => {
    async function loadAppName() {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "app_name")
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error loading app settings:", error.message);
          return;
        }

        if (data?.value) {
          setAppName(String(data.value));
        }
      } catch (error) {
        console.error("Error loading app settings:", error);
      } finally {
        setLoadingAppName(false);
      }
    }

    loadAppName();
  }, []);

  async function saveAppName(newName: string) {
    if (!newName?.trim()) return;
    setSavingAppName(true);
    try {
      const { error } = await supabase
        .from("app_settings")
        .upsert(
          { key: "app_name", value: newName.trim() },
          { onConflict: "key" },
        );

      if (error) {
        throw error;
      }

      setAppName(newName.trim());
    } catch (error) {
      console.error("Error saving app name:", error);
      throw error;
    } finally {
      setSavingAppName(false);
    }
  }

  return {
    appName,
    setAppName,
    loadingAppName,
    savingAppName,
    saveAppName,
  };
}
