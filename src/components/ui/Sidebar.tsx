"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileStack,
  FileText,
  Users,
  Settings,
  Book,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Certificados", href: "/certificados", icon: FileStack },
  { name: "Catálogos", href: "/catalogos", icon: Book },
  { name: "Plantillas", href: "/plantillas", icon: FileText },
  { name: "Empresas", href: "/empresas", icon: Users },
  { name: "Configuración", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      onClick={() => isCollapsed && setIsCollapsed(false)}
      className={`
      app-sidebar
      h-screen fixed left-0 top-0 z-50
      flex flex-col
      transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
      overflow-visible
      ${isCollapsed ? "w-[52px] cursor-pointer" : "w-[220px]"}
    `}
    >
      <div className="app-sidebar__glow app-sidebar__glow--a" aria-hidden />
      <div className="app-sidebar__glow app-sidebar__glow--b" aria-hidden />

      {/* Header */}
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
            className="w-7 h-7 rounded-[7px] flex items-center justify-center mx-auto transition-all duration-200 cursor-pointer"
            style={{ color: "var(--sidebar-fg-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--sidebar-hover-bg)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--sidebar-logo-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "var(--sidebar-fg-muted)";
            }}
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
              AutoCert
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(true);
              }}
              className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer"
              style={{ color: "var(--sidebar-fg-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--sidebar-hover-bg)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--sidebar-logo-text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--sidebar-fg-muted)";
              }}
            >
              <PanelLeftClose size={15} />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-visible">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.name} className="relative group/item">
              <Link
                href={item.href}
                onClick={(e) => isCollapsed && e.stopPropagation()}
                className={`
                  app-sidebar__link
                  ${isActive ? "app-sidebar__link--active" : ""}
                  ${isCollapsed ? "w-9 justify-center px-0" : "gap-2.5 px-2.5 w-full"}
                `}
              >
                {isActive && !isCollapsed && (
                  <span className="app-sidebar__link-indicator" />
                )}

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
                  className={`
                    whitespace-nowrap transition-all duration-300
                    ${isCollapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-xs"}
                  `}
                >
                  {item.name}
                </span>
              </Link>

              {isCollapsed && (
                <div className="app-sidebar__tooltip">{item.name}</div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer usuario */}
      <div
        className="flex-shrink-0 p-2"
        style={{ borderTop: "1px solid var(--sidebar-divider)" }}
      >
        <div
          className={`
            flex items-center gap-2.5 p-2 rounded-lg cursor-pointer
            transition-colors duration-200
            ${isCollapsed ? "justify-center" : ""}
          `}
          style={{ color: "var(--sidebar-fg)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "var(--sidebar-hover-bg)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          <div
            className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--sidebar-avatar-from), var(--sidebar-avatar-to))",
            }}
          >
            NL
          </div>
          <div
            className={`
              overflow-hidden transition-all duration-300
              ${isCollapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"}
            `}
          >
            <p className="app-sidebar__user-name">Nelson</p>
            <p className="app-sidebar__user-role">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
