"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Search, Bell, Moon, LogOut, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [initials, setInitials] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const name =
          user.user_metadata?.display_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Usuario";

        setDisplayName(name);

        const parts = name.trim().split(" ");
        const ini =
          parts.length >= 2 ? parts[0][0] + parts[1][0] : name.substring(0, 2);
        setInitials(ini.toUpperCase());
      }
    };

    getUser();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // Refresca para asegurar que el middleware actúe
  };

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <header className="h-20 bg-[var(--navbar-glass)] backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-40 px-8 flex items-center justify-between transition-colors">
      {/* Buscador */}
      <div className="relative w-96 group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-[var(--accent)] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar certificados..."
          className="w-full bg-[var(--input-bg)] border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[var(--accent-ring)] focus:bg-[var(--input-bg-focus)] transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Toggle Modo Oscuro */}
        <button
          type="button"
          aria-label={isDarkMode ? "Activar modo claro" : "Activar modo oscuro"}
          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          className={`p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer
            ${
              isDarkMode
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-slate-400 hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]"
            }`}
        >
          <Moon size={20} fill={isDarkMode ? "currentColor" : "none"} />
        </button>

        {/* Notificaciones */}
        <button
          type="button"
          className="relative p-2.5 text-slate-400 cursor-pointer hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-xl transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--background)]" />
        </button>

        {/* Perfil y Dropdown de Cierre de Sesión */}
        <div className="relative ml-2 pl-4 border-l border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 group cursor-pointer outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none group-hover:text-[var(--accent)] transition-colors">
                {displayName || "..."}
              </p>
            </div>
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold transition-transform group-active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-dark), var(--accent))",
                boxShadow: "0 4px 12px var(--accent-ring)",
              }}
            >
              {initials || ".."}
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {/* Menú Desplegable */}
          {showDropdown && (
            <>
              {/* Overlay para cerrar el dropdown haciendo clic fuera */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />

              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 border-b border-slate-50 dark:border-white/5 sm:hidden">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {displayName}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
