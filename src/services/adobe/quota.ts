import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Solo creamos el cliente si las llaves existen para que el build no explote
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function getAdobeQuotaStatus() {
  if (!supabaseAdmin) throw new Error("Supabase Admin no configurado");
  
  const { data, error } = await supabaseAdmin
    .from("adobe_quota_status")
    .select("*")
    .single();

  if (error) throw error;
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
  // 1. Validación para calmar a TypeScript
  if (!supabaseAdmin) {
    console.warn("[adobe quota] Registro omitido: Supabase Admin no configurado.");
    return;
  }

  // 2. Ahora TypeScript sabe que supabaseAdmin NO es null
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