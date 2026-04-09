import { createClient } from "@/lib/supabaseClient"; // server client (service role)

// Consulta el estado actual de la cuota — úsalo en Server Components o API Routes
export async function getAdobeQuotaStatus() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("adobe_quota_status")
    .select("*")
    .single();

  if (error) throw new Error("No se pudo consultar la cuota de Adobe");
  return data;
  // { quota_limit: 500, quota_used: 0, quota_remaining: 500, usage_percentage: "0.0" }
}

// Registra 1 crédito consumido — llámalo desde tu API Route /api/convert-to-pdf
export async function logAdobeUsage({
  companyId,
  templateId,
  jobId,
  status = "success",
}: {
  companyId: string;
  templateId?: string;
  jobId?: string;
  status?: "success" | "error";
}) {
  const supabase = createClient();

  const { error } = await supabase.from("api_usage").insert({
    company_id:   companyId,
    template_id:  templateId ?? null,
    job_id:       jobId ?? null,
    service_name: "adobe_pdf",
    credits_used: 1,
    status,
  });

  if (error) {
    console.error("[adobe quota] Error al registrar:", error.message);
  }
  // El trigger sync_adobe_quota actualiza app_settings automáticamente
}