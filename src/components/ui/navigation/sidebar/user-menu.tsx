"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  LogOut,
  Keyboard,
  ChevronsUpDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  Info,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserMenuProps {
  initials: string;
  displayName: string;
  email?: string;
  isCollapsed: boolean;
  avatarUrl?: string | null;
}

export default function UserMenu({
  initials,
  displayName,
  email,
  isCollapsed,
  avatarUrl,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div ref={menuRef} className="relative w-full flex justify-center">
      {/* Trigger Principal */}
      <button
        onClick={() => setOpen((p) => !p)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            "var(--sidebar-user-hover)";
          (e.currentTarget as HTMLElement).style.color = "var(--sidebar-fg)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = open
            ? "var(--sidebar-user-hover)"
            : "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--sidebar-fg)";
        }}
        className={`w-full flex items-center cursor-pointer transition-all duration-200 text-left ${
          isCollapsed
            ? "justify-center px-0 py-4"
            : "justify-between px-4 py-4 gap-3"
        }`}
        style={{
          color: "var(--sidebar-fg)",
          background: open ? "var(--sidebar-user-hover)" : "transparent",
          borderTop: "1px solid var(--sidebar-divider)",
        }}
      >
        <div
          className={`flex items-center min-w-0 ${isCollapsed ? "justify-center" : "gap-3"}`}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-white overflow-hidden shadow-sm"
            style={{
              background: avatarUrl
                ? "transparent"
                : "linear-gradient(135deg, var(--sidebar-avatar-from), var(--sidebar-avatar-to))",
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <p className="truncate text-[13px] font-medium">{displayName}</p>
              <p className="truncate text-[11px] opacity-60">{email}</p>
            </div>
          )}
        </div>
        {!isCollapsed && <ChevronsUpDown size={14} className="opacity-50" />}
      </button>

      {/* MENU PRINCIPAL */}
      {open && (
        <div
          className="absolute bottom-full mb-2 rounded-xl shadow-xl z-[100] py-1"
          style={{
            width: isCollapsed ? "220px" : "95%",
            left: isCollapsed ? "12px" : "2.5%",
            background: "var(--sidebar-bg)",
            border: "1px solid var(--sidebar-divider)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.24)",
          }}
        >
          <div className="px-3 py-2 border-b border-[var(--sidebar-divider)]">
            <p className="text-[10px] truncate text-[var(--sidebar-fg-muted)]">
              {email}
            </p>
          </div>

          <button
            onClick={() => router.push("/settings")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg)]"
          >
            <Settings size={14} className="opacity-70" />
            <span className="flex-1 text-[12px] cursor-pointer">
              Configuración
            </span>
          </button>

          {/* ITEM CON SUBMENU FLOTANTE */}
          <div className="relative group/submenu">
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg)] transition-colors">
              <Info size={14} className="opacity-70" />
              <span className="flex-1 text-[12px] cursor-pointer">
                Más información
              </span>
              <ChevronRight size={14} className="opacity-40" />
            </button>

            {/* SUBMENU: Superpuesto ligeramente con ml-[-8px] */}
            <div
              className="absolute hidden group-hover/submenu:flex flex-col left-full top-1/2 -translate-y-1/2 ml-[-8px] w-[220px] rounded-xl shadow-2xl py-1 z-[110] animate-in fade-in zoom-in-95 duration-150"
              style={{
                background: "var(--sidebar-bg)",
                border: "1px solid var(--sidebar-divider)",
                /* Aumentamos un poco la sombra para que se note la profundidad sobre el menú de abajo */
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              <button className="cursor-pointer w-full flex items-center justify-between px-3 py-2.5 text-[12px] hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg)]">
                <span>Cursos</span>
                <ExternalLink size={12} className="opacity-40" />
              </button>
              <button className="cursor-pointer w-full flex items-center justify-between px-3 py-2.5 text-[12px] hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg)]">
                <span>Política de uso</span>
                <ExternalLink size={12} className="opacity-40" />
              </button>
              <button className="cursor-pointer w-full flex items-center justify-between px-3 py-2.5 text-[12px] hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg)]">
                <span>Política de privacidad</span>
                <ExternalLink size={12} className="opacity-40" />
              </button>

              <div className="my-1 h-[1px] bg-[var(--sidebar-divider)] mx-2" />

              <button className="cursor-pointer w-full flex items-center justify-between px-3 py-2.5 text-[12px] hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg)]">
                <div className="flex items-center gap-2">
                  <Keyboard size={14} className="opacity-70" />
                  <span>Atajos de teclado</span>
                </div>
                <span className="text-[10px] opacity-40 font-mono">Ctrl+/</span>
              </button>
            </div>
          </div>

          <div className="my-1 h-[1px] bg-[var(--sidebar-divider)] mx-2" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg)]"
          >
            <LogOut size={14} className="opacity-70" />
            <span className="cursor-pointer flex-1 text-[12px]">
              Cerrar sesión
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
