import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { History, RefreshCcw } from "lucide-react";
// Importamos el contenedor desde la carpeta de features
import { ActivityPageClient } from "@/components/features/activity/ActivityPageClient";

export default async function ActividadPage() {
  // 1. Conexión con cookies para validar sesión en servidor
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );

  // 2. Fetch de datos iniciales (Historial completo)
  const { data: initialLogs, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      {/* Header Estático */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
              <History size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                Auditoría de Sistema
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Registro oficial de movimientos y cambios en AutoCert Pro.
              </p>
            </div>
          </div>
        </div>

        {/* Botón de Refresco (Acción simple) */}
        <button className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl hover:text-indigo-600 transition-colors shadow-sm active:scale-95">
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* 3. Pasamos la data al Client Component. 
          Él se encargará de los filtros y de mostrar la lista.
      */}
      <ActivityPageClient initialLogs={initialLogs || []} />

      {/* Footer de cortesía */}
      <div className="mt-12 py-6 border-t border-slate-100 dark:border-white/5 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          Sistema de Auditoría • Acceso Restringido
        </p>
      </div>
    </div>
  );
}
