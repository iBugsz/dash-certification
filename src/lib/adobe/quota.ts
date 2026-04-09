import { createClient } from "@supabase/supabase-js";

// Inicializamos el cliente con el Service Role para saltar RLS en el servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Consulta el estado actual de la cuota
export async function getAdobeQuotaStatus() {
  const { data, error } = await supabaseAdmin
    .from("adobe_quota_status")
    .select("*")
    .single();

  if (error) {
    console.error("Error al consultar cuota:", error.message);
    throw new Error("No se pudo consultar la cuota de Adobe");
  }
  return data;
}

// Registra 1 crédito consumido
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
  const { error } = await supabaseAdmin.from("api_usage").insert({
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
}