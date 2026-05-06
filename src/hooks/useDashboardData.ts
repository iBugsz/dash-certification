"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ActivityLog } from "@/lib/types/activity";

export interface BucketStat {
  bucket: string;
  file_count: number;
  used_bytes: number;
}

export interface DashboardData {
  companies: number;
  templates: number;
  totalCertificates: number;
  generationTotal: number;
  generationData: any[];
  recentActivity: ActivityLog[];
  dbUsedBytes: number;
  dbLimitBytes: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  buckets: BucketStat[];
  adobeUsed: number;
  adobeLimit: number;
  loading: boolean;
}

const DB_LIMIT = 500 * 1024 * 1024;
const STORE_LIMIT = 1024 * 1024 * 1024;

const ALL_BUCKETS = ["templates", "logos", "generated", "catalogs"];

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    companies: 0,
    templates: 0,
    totalCertificates: 0,
    generationTotal: 0,
    generationData: [],
    recentActivity: [],
    dbUsedBytes: 0,
    dbLimitBytes: DB_LIMIT,
    storageUsedBytes: 0,
    storageLimitBytes: STORE_LIMIT,
    buckets: ALL_BUCKETS.map((b) => ({
      bucket: b,
      file_count: 0,
      used_bytes: 0,
    })),
    adobeUsed: 0,
    adobeLimit: 500,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);
        const startDateStr = sevenDaysAgo.toISOString().split("T")[0];

        const [
          { count: companiesCount },
          { count: templatesCount },
          { data: jobs },
          { data: quotaRows },
          { data: statsRaw },
          { data: generationStatsWeekly },
          { data: generationStatsAll },
          { data: activityLogs },
        ] = await Promise.all([
          supabase
            .from("companies")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("templates")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("certificate_jobs")
            .select("success_count")
            .eq("status", "completed"),
          supabase
            .from("app_settings")
            .select("key, value")
            .in("key", ["adobe_pdf_quota_used", "adobe_pdf_quota_limit"]),
          supabase.rpc("get_dashboard_stats"),
          supabase
            .from("generation_stats")
            .select("date, count")
            .gte("date", startDateStr)
            .order("date", { ascending: true }),
          supabase.from("generation_stats").select("count"),
          supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const dateKey = d.toISOString().split("T")[0];
          return {
            dateKey,
            label: d
              .toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
              .replace(".", ""),
          };
        });

        const formattedGenerationData = last7Days.map((day) => {
          const dbEntry = generationStatsWeekly?.find(
            (item) => item.date === day.dateKey,
          );
          return {
            date: day.label,
            count: dbEntry ? dbEntry.count : 0,
          };
        });

        const generationTotal = (generationStatsAll ?? []).reduce(
          (sum, row) => sum + Number(row.count ?? 0),
          0,
        );

        const totalCertificates = (jobs ?? []).reduce(
          (sum, job) => sum + (job.success_count ?? 0),
          0,
        );
        const adobeUsed = Number(
          quotaRows?.find((r) => r.key === "adobe_pdf_quota_used")?.value ?? 0,
        );
        const adobeLimit = Number(
          quotaRows?.find((r) => r.key === "adobe_pdf_quota_limit")?.value ??
            500,
        );

        const stats = statsRaw as any;
        const fetchedBuckets: BucketStat[] = stats?.buckets ?? [];
        const mergedBuckets = ALL_BUCKETS.map((name) => {
          const found = fetchedBuckets.find((b) => b.bucket === name);
          return found ?? { bucket: name, file_count: 0, used_bytes: 0 };
        });

        setData({
          companies: companiesCount ?? 0,
          templates: templatesCount ?? 0,
          totalCertificates,
          generationTotal,
          generationData: formattedGenerationData,
          recentActivity: (activityLogs as ActivityLog[]) ?? [],
          dbUsedBytes: stats?.db_size_bytes ?? 0,
          dbLimitBytes: DB_LIMIT,
          storageUsedBytes: stats?.storage_total ?? 0,
          storageLimitBytes: STORE_LIMIT,
          buckets: mergedBuckets,
          adobeUsed,
          adobeLimit,
          loading: false,
        });
      } catch (error) {
        console.error("Error en Dashboard:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    }

    load();

    // Realtime — solo escucha activity_logs y actualiza esa parte del estado
    const channel = supabase
      .channel("dashboard_activity_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_logs" },
        async () => {
          const { data: activityLogs } = await supabase
            .from("activity_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5);

          if (activityLogs) {
            setData((prev) => ({
              ...prev,
              recentActivity: activityLogs as ActivityLog[],
            }));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return data;
}
