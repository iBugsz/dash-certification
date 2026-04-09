"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface BucketStat {
  bucket: string;
  file_count: number;
  used_bytes: number;
}

export interface DashboardData {
  companies: number;
  templates: number;
  totalCertificates: number;
  recentTemplates: any[];
  dbUsedBytes: number;
  dbLimitBytes: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  buckets: BucketStat[];
  adobeUsed: number;
  adobeLimit: number;
  loading: boolean;
}

const DB_LIMIT    = 500  * 1024 * 1024;
const STORE_LIMIT = 1024 * 1024 * 1024;

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    companies: 0,
    templates: 0,
    totalCertificates: 0,
    recentTemplates: [],
    dbUsedBytes: 11_340_947,
    dbLimitBytes: DB_LIMIT,
    storageUsedBytes: 1_690_721,
    storageLimitBytes: STORE_LIMIT,
    buckets: [
      { bucket: "plantillas", file_count: 4, used_bytes: 1_690_721 },
      { bucket: "logos",      file_count: 0, used_bytes: 0 },
      { bucket: "generado",   file_count: 0, used_bytes: 0 },
      { bucket: "catalogos",  file_count: 0, used_bytes: 0 },
    ],
    adobeUsed:  0,
    adobeLimit: 500,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      const [
        { count: companies },
        { count: templates },
        { data: recent },
        { data: jobs },
        { data: quotaRows },
      ] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }),
        supabase.from("templates").select("*", { count: "exact", head: true }),
        supabase
          .from("templates")
          .select("*, company:companies(name)")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("certificate_jobs")
          .select("success_count")
          .eq("status", "completed"),
        supabase
          .from("app_settings")
          .select("key, value")
          .in("key", ["adobe_pdf_quota_used", "adobe_pdf_quota_limit"]),
      ]);

      const totalCertificates = (jobs ?? []).reduce(
        (sum, job) => sum + (job.success_count ?? 0),
        0
      );

      const adobeUsed  = Number(
        quotaRows?.find((r) => r.key === "adobe_pdf_quota_used")?.value ?? 0
      );
      const adobeLimit = Number(
        quotaRows?.find((r) => r.key === "adobe_pdf_quota_limit")?.value ?? 500
      );

      setData((prev) => ({
        ...prev,
        companies:         companies ?? 0,
        templates:         templates ?? 0,
        totalCertificates,
        recentTemplates:   recent ?? [],
        adobeUsed,
        adobeLimit,
        loading: false,
      }));
    }

    load();
  }, []);

  return data;
}