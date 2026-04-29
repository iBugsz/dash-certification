"use client";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  item: {
    name: string;
    href: string;
    icon: LucideIcon;
  };
  isActive: boolean;
  isCollapsed: boolean;
  isMobileView?: boolean;
}

export function SidebarItem({
  item,
  isActive,
  isCollapsed,
  isMobileView,
}: SidebarItemProps) {
  const showText = isMobileView || !isCollapsed;

  // Función para evitar que el click en el botón active el toggle del padre
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative group/item flex justify-center w-full">
      <Link
        href={item.href}
        onClick={handleLinkClick} // Evita que el click aquí maximice el sidebar por error
        className={`
          app-sidebar__link flex items-center transition-all duration-200
          
          /* ESTILO PC COLAPSADO */
          ${
            !isMobileView && isCollapsed
              ? "w-10 h-10 justify-center px-0 rounded-lg"
              : ""
          }
            
          /* ESTILO PC EXPANDIDO */
          ${
            !isMobileView && !isCollapsed
              ? "w-full gap-2.5 px-2.5 py-1.5 rounded-md"
              : ""
          }
            
          /* ESTILO MOVIL */
          ${isMobileView ? "w-full gap-4 px-1 py-3 text-lg" : ""}
            
          /* ESTADO ACTIVO */
          ${isActive ? "app-sidebar__link--active" : "text-[var(--sidebar-fg-muted)] hover:text-[var(--sidebar-logo-text)]"}
        `}
      >
        {/* Indicador lateral solo en PC Expandido */}
        {isActive && !isCollapsed && !isMobileView && (
          <span className="app-sidebar__link-indicator" />
        )}

        <item.icon
          size={isMobileView ? 22 : 18}
          strokeWidth={isActive ? 2.2 : 1.8}
          className="flex-shrink-0"
          style={{
            color: isActive ? "var(--sidebar-active-icon)" : "inherit",
          }}
        />

        <span
          className={`
            whitespace-nowrap transition-all duration-300
            ${isMobileView ? "text-base font-medium" : "text-sm"}
            /* Ocultar texto solo en PC colapsado */
            ${!isMobileView && isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}
          `}
        >
          {item.name}
        </span>
      </Link>

      {/* TOOLTIP CORREGIDO: Usamos fixed y z-high para que no se corte con el overflow */}
      {!isMobileView && isCollapsed && (
        <div
          className="
            fixed left-[70px] z-[9999]
            px-3 py-1.5 rounded-md
            bg-gray-900 text-white text-xs font-medium
            shadow-xl border border-white/10
            pointer-events-none
            opacity-0 group-hover/item:opacity-100 
            transition-opacity duration-200
            whitespace-nowrap
          "
        >
          {item.name}
          {/* Triangulito del tooltip */}
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-white/10" />
        </div>
      )}
    </div>
  );
}
