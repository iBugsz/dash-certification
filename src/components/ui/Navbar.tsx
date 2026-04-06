"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  FileStack,
  Book,
  FileText,
  Users,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Certificados", href: "/certificados", icon: FileStack },
  { name: "Catálogos", href: "/catalogos", icon: Book },
  { name: "Plantillas", href: "/plantillas", icon: FileText },
  { name: "Empresas", href: "/empresas", icon: Users },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [initials, setInitials] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

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

  // Cierra el drawer al cambiar de página
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <>
      {/* ── Overlay móvil ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Drawer móvil ── */}
      <div
        className={`
          fixed top-0 left-0 h-full w-[260px] z-50 md:hidden
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* Header del drawer */}
        <div
          className="flex items-center justify-between h-16 px-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--sidebar-divider)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-dark), var(--accent))",
              }}
            >
              <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                <rect
                  x="1"
                  y="1"
                  width="5"
                  height="5"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.9"
                />
                <rect
                  x="8"
                  y="1"
                  width="5"
                  height="5"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.5"
                />
                <rect
                  x="1"
                  y="8"
                  width="5"
                  height="5"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.5"
                />
                <rect
                  x="8"
                  y="8"
                  width="5"
                  height="5"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.2"
                />
              </svg>
            </div>
            <span className="app-sidebar__logo-text font-semibold">
              AutoCert
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center"
            style={{ color: "var(--sidebar-fg-muted)" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`app-sidebar__link gap-2.5 px-2.5 w-full ${isActive ? "app-sidebar__link--active" : ""}`}
              >
                {isActive && <span className="app-sidebar__link-indicator" />}
                <item.icon
                  size={16}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="app-sidebar__link-icon flex-shrink-0"
                  style={{
                    color: isActive
                      ? "var(--sidebar-active-icon)"
                      : "var(--sidebar-fg-muted)",
                  }}
                />
                <span
                  style={{
                    color: isActive
                      ? "var(--sidebar-active-icon)"
                      : "var(--sidebar-fg)",
                  }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer usuario en drawer */}
        <div
          className="flex-shrink-0 p-3"
          style={{ borderTop: "1px solid var(--sidebar-divider)" }}
        >
          <div
            className="flex items-center gap-2.5 p-2 rounded-lg"
            style={{ color: "var(--sidebar-fg)" }}
          >
            <div
              className="w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--sidebar-avatar-from), var(--sidebar-avatar-to))",
              }}
            >
              {initials || ".."}
            </div>
            <div>
              <p className="app-sidebar__user-name text-sm font-semibold">
                {displayName || "..."}
              </p>
              <p className="app-sidebar__user-role text-xs">Administrador</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navbar ── */}
      <header className="h-16 md:h-20 bg-[var(--navbar-glass)] backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-colors">
        {/* Izquierda: hamburguesa (móvil) + búsqueda (desktop) */}
        <div className="flex items-center gap-3">
          {/* Botón hamburguesa solo en móvil */}
          <button
            type="button"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95"
            style={{ color: "var(--sidebar-fg-muted)" }}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* Logo en móvil (centro visual) */}
          <span
            className="md:hidden font-semibold text-sm"
            style={{ color: "var(--sidebar-fg)" }}
          >
            AutoCert
          </span>

          {/* Búsqueda solo en desktop */}
          <div className="relative w-96 group hidden md:block">
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
        </div>

        {/* Derecha: acciones */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            aria-label={
              isDarkMode ? "Activar modo claro" : "Activar modo oscuro"
            }
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

          <button
            type="button"
            className="relative p-2.5 text-slate-400 cursor-pointer hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-xl transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--background)]" />
          </button>

          <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-slate-100 dark:border-slate-700 ml-1 md:ml-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
                {displayName || "..."}
              </p>
            </div>
            <div
              className="h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-dark), var(--accent))",
                boxShadow: "0 4px 12px var(--accent-ring)",
              }}
            >
              {initials || ".."}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
