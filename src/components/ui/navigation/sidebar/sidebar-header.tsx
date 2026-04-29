"use client";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  appName?: string;
  isOpenMobile?: boolean; // Prop para saber si es vista móvil estilo Claude
}

export function SidebarHeader({
  isCollapsed,
  setIsCollapsed,
  appName,
  isOpenMobile,
}: SidebarHeaderProps) {
  // SI ES MOVIL: Header minimalista estilo Claude (Solo texto, alineado a la izquierda, espacioso)
  if (isOpenMobile) {
    return (
      <div className="relative flex items-center h-24 px-8 flex-shrink-0">
        <span className="text-3xl font-semibold text-[var(--sidebar-logo-text)] tracking-tight">
          {appName || "AutoCert"}
        </span>
      </div>
    );
  }

  // SI ES PC: Mantenemos el header original con logo y botones de colapso
  return (
    <div
      className="relative flex items-center h-16 px-3 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--sidebar-divider)" }}
    >
      {isCollapsed ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(false);
          }}
          className="w-7 h-7 rounded-[7px] flex items-center justify-center mx-auto transition-all duration-200 cursor-pointer text-[var(--sidebar-fg-muted)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-logo-text)]"
        >
          <PanelLeftOpen size={15} />
        </button>
      ) : (
        <>
          <div
            className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-dark), var(--accent))",
            }}
          >
            {/* SVG Logo (PC) */}
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

          <span className="app-sidebar__logo-text flex-1 whitespace-nowrap ml-2.5">
            {appName || "AutoCert"}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(true);
            }}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer text-[var(--sidebar-fg-muted)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-logo-text)]"
          >
            <PanelLeftClose size={15} />
          </button>
        </>
      )}
    </div>
  );
}
