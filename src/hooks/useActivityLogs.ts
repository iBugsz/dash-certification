"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface ActivityLog {
  id: string;
  created_at: string;
  user_name: string;
  action_type: 'CREATE' | 'UPDATE' | 'DELETE' | 'GENERATE';
  entity_type: 'TEMPLATE' | 'COMPANY' | 'CERTIFICATE';
  entity_name: string;
  details?: any; // Cambiado a any para manejar el JSON de cambios
}

export function useActivityLogs(limit?: number) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
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
    }

    fetchLogs();
  }, [limit]);

  return { logs, loading, error };
}