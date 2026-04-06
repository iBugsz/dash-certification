import { User, Palette, Database, Save, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-(--breakpoint-2xl) mx-auto p-4 md:p-8 space-y-8 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 font-poppins">
          Configuración
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
          Gestiona los parámetros generales de AutoCert Pro.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-6">
          <section className="bg-[var(--card)] p-6 md:p-8 rounded-[24px] shadow-sm border border-[var(--border)] transition-colors">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-accent-soft rounded-lg">
                <User className="text-accent w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Perfil del Administrador
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  placeholder="Sebas"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-accent focus:bg-[var(--input-bg-focus)] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="admin@autocert.pro"
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-accent focus:bg-[var(--input-bg-focus)] outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <section className="bg-[var(--card)] p-6 md:p-8 rounded-[24px] shadow-sm border border-[var(--border)] transition-colors">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-accent-soft rounded-lg">
                <Palette className="text-accent w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Personalización de Marca
              </h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/60 rounded-[20px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-600">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Logo
                  </span>
                </div>
                <button className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  Cambiar Logo
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">
                    Color Primario
                  </label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-accent rounded-lg shadow-sm shrink-0" />
                    <input
                      type="text"
                      value="#0EA5E9"
                      className="flex-1 p-2 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] text-sm text-slate-800 dark:text-slate-200 outline-none"
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">
                    Nombre de la Aplicación
                  </label>
                  <input
                    type="text"
                    defaultValue="AutoCert Pro"
                    className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-slate-800 dark:text-slate-200 focus:bg-[var(--input-bg-focus)] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[var(--card)] p-6 rounded-[24px] shadow-sm border border-[var(--border)] transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 rounded-lg">
                <Database className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Servicios
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Supabase Auth
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded-full font-bold uppercase">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    PostgreSQL DB
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded-full font-bold uppercase">
                  Online
                </span>
              </div>
            </div>
          </section>

          <div className="xl:sticky xl:top-8">
            <button className="w-full py-4 bg-accent-gradient text-white rounded-[20px] font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <Save className="w-5 h-5" />
              Guardar Cambios
            </button>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
              Última sincronización: Hoy a las 1:35 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
