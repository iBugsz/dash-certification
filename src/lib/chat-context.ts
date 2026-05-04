import { createClient } from "@supabase/supabase-js";

// ── Contexto base estático (sin nombre hardcodeado) ───────────────────────
export const BASE_CONTEXT = (
  appName: string,
) => `Eres el asistente AI integrado en ${appName}, una plataforma de generación y homologación de certificados vehiculares.
Respondé siempre en español, de forma concisa y útil.
Podés analizar documentos e imágenes que el usuario comparta.
Cuando el usuario mencione un error o problema, intentá diagnosticarlo usando los datos reales del dashboard que tenés más abajo.
Si el usuario te pregunta cuántos usuarios hay, cuántas empresas, plantillas, jobs, etc — usá los datos reales que tenés en el contexto.
Si el usuario está logueado, saludalo por su nombre al inicio de la conversación cuando sea natural.
No menciones que tenés "datos inyectados" ni que consultaste la base de datos — simplemente usá esa info de forma natural como si la conocieras.`;

// ── Tipos ─────────────────────────────────────────────────────────────────
interface DynamicContextOptions {
  userId?: string;
}

// ── Resultado de buildDynamicContext ──────────────────────────────────────
interface DynamicContextResult {
  systemContext: string;
  appName: string;
}

// ── Consulta dinámica completa a Supabase ─────────────────────────────────
export async function buildDynamicContext(
  options: DynamicContextOptions = {},
): Promise<DynamicContextResult> {
  const { userId } = options;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase env vars no configuradas");
    const fallbackName = "CertifyHub";
    return {
      systemContext: "",
      appName: fallbackName,
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // ── Consultas en paralelo ─────────────────────────────────────────────
    const [
      settingsRes,
      profileRes,
      allProfilesRes,
      companiesRes,
      templatesRes,
      catalogsRes,
      statsRes,
      jobsRes,
      activityRes,
    ] = await Promise.all([
      // 1. Config general de la app
      supabase.from("app_settings").select("key, value"),

      // 2. Perfil del usuario logueado
      userId
        ? supabase
            .from("profiles")
            .select("id, full_name, avatar_url, updated_at")
            .eq("id", userId)
            .single()
        : Promise.resolve({ data: null, error: null }),

      // 3. Todos los usuarios (conteo + lista de nombres)
      supabase
        .from("profiles")
        .select("id, full_name, updated_at")
        .order("updated_at", { ascending: false }),

      // 4. Todas las empresas
      supabase
        .from("companies")
        .select("name, nit, email, phone, address, active, created_at")
        .order("created_at", { ascending: false }),

      // 5. Todas las plantillas
      supabase
        .from("templates")
        .select("name, description, active, created_at")
        .order("created_at", { ascending: false }),

      // 6. Catálogos
      supabase
        .from("catalogs")
        .select("name, description, active, created_at")
        .order("created_at", { ascending: false }),

      // 7. Stats de generación (últimos 14 días)
      supabase
        .from("generation_stats")
        .select("date, count")
        .order("date", { ascending: false })
        .limit(14),

      // 8. Últimos 10 jobs de certificación con detalle
      supabase
        .from("certificate_jobs")
        .select(
          "status, total_records, success_count, error_count, source_file_name, created_at, completed_at",
        )
        .order("created_at", { ascending: false })
        .limit(10),

      // 9. Últimos 10 logs de actividad
      supabase
        .from("activity_logs")
        .select(
          "user_name, action_type, entity_type, entity_name, details, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // ── Procesar app_settings ─────────────────────────────────────────────
    const settings: Record<string, string> = {};
    for (const row of settingsRes.data ?? []) {
      settings[row.key] = row.value;
    }

    // ── Nombre dinámico de la app ─────────────────────────────────────────
    const appName = settings["app_name"] ?? "CertifyHub";

    // ── Usuario logueado ──────────────────────────────────────────────────
    const loggedUser = profileRes.data;
    const loggedUserStr = loggedUser
      ? `${loggedUser.full_name ?? "Sin nombre"} (ID: ${loggedUser.id})`
      : userId
        ? `Usuario con ID ${userId} (sin perfil creado)`
        : "No identificado (sesión anónima)";

    // ── Todos los usuarios ────────────────────────────────────────────────
    const allProfiles = allProfilesRes.data ?? [];
    const totalUsers = allProfiles.length;
    const userListStr =
      allProfiles.length > 0
        ? allProfiles
            .map((p) => `• ${p.full_name ?? "Sin nombre"} (ID: ${p.id})`)
            .join("\n  ")
        : "Sin usuarios registrados";

    // ── Empresas ──────────────────────────────────────────────────────────
    const companies = companiesRes.data ?? [];
    const totalCompanies = companies.length;
    const activeCompanies = companies.filter((c) => c.active).length;
    const companiesStr =
      companies.length > 0
        ? companies
            .map(
              (c) =>
                `• ${c.name}${c.nit ? ` (NIT: ${c.nit})` : ""}${c.email ? ` — ${c.email}` : ""} [${c.active ? "activa" : "inactiva"}]`,
            )
            .join("\n  ")
        : "Sin empresas registradas";

    // ── Plantillas ────────────────────────────────────────────────────────
    const templates = templatesRes.data ?? [];
    const totalTemplates = templates.length;
    const activeTemplates = templates.filter((t) => t.active).length;
    const templatesStr =
      templates.length > 0
        ? templates
            .map(
              (t) =>
                `• ${t.name}${t.description ? `: ${t.description}` : ""} [${t.active ? "activa" : "inactiva"}]`,
            )
            .join("\n  ")
        : "Sin plantillas registradas";

    // ── Catálogos ─────────────────────────────────────────────────────────
    const catalogs = catalogsRes.data ?? [];
    const catalogsStr =
      catalogs.length > 0
        ? catalogs
            .map(
              (c) =>
                `• ${c.name}${c.description ? `: ${c.description}` : ""} [${c.active ? "activo" : "inactivo"}]`,
            )
            .join("\n  ")
        : "Sin catálogos registrados";

    // ── Stats de generación ───────────────────────────────────────────────
    const stats = statsRes.data ?? [];
    const totalCertificados = stats.reduce((sum, r) => sum + (r.count ?? 0), 0);
    const statsStr =
      stats.length > 0
        ? stats.map((r) => `${r.date}: ${r.count} certificados`).join(", ")
        : "Sin datos";

    // ── Jobs de certificación ─────────────────────────────────────────────
    const jobs = jobsRes.data ?? [];
    const totalJobs = jobs.length;
    const jobsByStatus = jobs.reduce(
      (acc, j) => {
        acc[j.status] = (acc[j.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const jobsSummaryStr =
      jobs.length > 0
        ? jobs
            .map(
              (j) =>
                `• [${j.status.toUpperCase()}] Archivo: "${j.source_file_name ?? "N/A"}" — ` +
                `${j.success_count}/${j.total_records} exitosos, ${j.error_count} errores` +
                `${j.completed_at ? ` (completado: ${new Date(j.completed_at).toLocaleString("es-AR")})` : ""}`,
            )
            .join("\n  ")
        : "Sin jobs recientes";

    // ── Actividad reciente ────────────────────────────────────────────────
    const activityStr =
      (activityRes.data ?? []).length > 0
        ? (activityRes.data ?? [])
            .map(
              (a) =>
                `• ${a.user_name ?? "?"} → ${a.action_type} en ${a.entity_type} "${a.entity_name}"` +
                `${a.details ? ` (${a.details})` : ""}`,
            )
            .join("\n  ")
        : "Sin actividad registrada";

    // ── Armar contexto final ──────────────────────────────────────────────
    const dynamicContext = `
## Datos reales del sistema (consultados en tiempo real)

### Configuración de la app
- **Nombre:** ${appName}
- **Prefijo certificados:** ${settings["certificate_prefix"] ?? "CERT"}
- **Batch máximo:** ${settings["max_batch_size"] ?? "500"} registros por lote
- **Cuota Adobe PDF:** ${settings["adobe_pdf_quota_used"] ?? "?"} / ${settings["adobe_pdf_quota_limit"] ?? "?"} créditos usados

### Usuario actual
- **Logueado:** ${loggedUserStr}

### Usuarios del sistema (${totalUsers} en total)
  ${userListStr}

### Empresas (${totalCompanies} total — ${activeCompanies} activas)
  ${companiesStr}

### Plantillas (${totalTemplates} total — ${activeTemplates} activas)
  ${templatesStr}

### Catálogos (${catalogs.length} total)
  ${catalogsStr}

### Estadísticas de generación (últimos 14 días)
- **Total generados:** ${totalCertificados} certificados
- **Detalle por día:** ${statsStr}

### Jobs de certificación (últimos ${totalJobs})
- **Por estado:** ${
      Object.entries(jobsByStatus)
        .map(([s, n]) => `${s}: ${n}`)
        .join(", ") || "Sin datos"
    }
  ${jobsSummaryStr}

### Actividad reciente
  ${activityStr}`;

    return {
      systemContext: dynamicContext,
      appName,
    };
  } catch (err) {
    console.error("Error consultando Supabase para contexto dinámico:", err);
    return {
      systemContext: "",
      appName: "CertifyHub",
    };
  }
}
