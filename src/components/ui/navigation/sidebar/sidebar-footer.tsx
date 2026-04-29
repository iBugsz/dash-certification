"use client";
import { Settings } from "lucide-react";
import Link from "next/link";
import UserMenu from "./user-menu";

interface SidebarFooterProps {
  initials: string;
  displayName: string;
  email?: string;
  avatarUrl?: string | null;
  isCollapsed: boolean;
  isMobileView?: boolean; // Prop para identificar el modo Android
}

export function SidebarFooter(props: SidebarFooterProps) {
  return (
    <div
      className="flex-shrink-0 w-full"
      onClick={(e) => e.stopPropagation()}
      style={{ borderTop: "1px solid var(--sidebar-divider)" }}
    >
      {/* --- VISTA PC (Tu lógica original) --- */}
      <div className="hidden md:block">
        <UserMenu {...props} />
      </div>

      {/* --- VISTA ANDROID (Estilo Claude) --- */}
      <div className="block md:hidden px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar circular */}
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[var(--sidebar-divider)] bg-[var(--sidebar-hover-bg)] flex items-center justify-center flex-shrink-0">
              {props.avatarUrl ? (
                <img
                  src={props.avatarUrl}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-[var(--sidebar-logo-text)]">
                  {props.initials}
                </span>
              )}
            </div>

            {/* Nombre (Sin correo, estilo limpio) */}
            <span className="text-xl font-medium text-[var(--sidebar-logo-text)] truncate max-w-[140px]">
              {props.displayName}
            </span>
          </div>

          {/* Icono de Settings directo para Android */}
          <Link
            href="/settings"
            className="p-2 rounded-full hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg-muted)] transition-colors"
          >
            <Settings size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
}
