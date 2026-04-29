"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface ActivityLog {
  id: string;
  created_at: string;
  user_name: string;
  user_id?: string;
  action_type: "CREATE" | "UPDATE" | "DELETE" | "GENERATE";
  entity_type: "TEMPLATE" | "COMPANY" | "CERTIFICATE";
  entity_name: string;
  details?: any;
}

export function useActivityLogs(limit?: number) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    // Carga inicial
    fetchLogs();

    // Realtime — escucha cualquier cambio en activity_logs
    const channel = supabase
      .channel("activity_logs_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_logs" },
        () => fetchLogs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLogs]);

  return { logs, loading, error };
}