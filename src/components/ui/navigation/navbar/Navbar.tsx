"use client";
import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Bell, Grid3X3, Settings, AlignLeft } from "lucide-react";
import { MENU_ITEMS } from "@/constants/navigation";

interface NavbarProps {
  onMenuClick?: () => void;
  isCollapsed: boolean;
}

export default function Navbar({ onMenuClick, isCollapsed }: NavbarProps) {
  const { avatarUrl, initials, displayName } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Sincronización automática de título y placeholder
  const currentItem = MENU_ITEMS.find((item) => item.href === pathname);
  const pageTitle = currentItem ? currentItem.name : "Panel de Control";

  // 2. Lógica de búsqueda global (actualiza la URL)
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term); // Usamos 'q' como estándar de búsqueda
    } else {
      params.delete("q");
    }
    // Reemplaza la URL actual con el parámetro de búsqueda sin recargar
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <nav
      className={`
        h-16 flex items-center justify-between px-4 md:px-6 
        bg-[var(--sidebar-bg)] border-b border-[var(--sidebar-divider)] 
        sticky top-0 z-40 transition-all duration-300
        ml-0 ${isCollapsed ? "md:ml-[60px]" : "md:ml-[260px]"}
      `}
    >
      {/* --- MÓVIL (Android Style) --- */}
      <div className="flex w-full items-center justify-between md:hidden">
        <button
          className="p-2 rounded-xl hover:bg-[var(--sidebar-hover-bg)] transition-colors text-[var(--sidebar-fg-muted)]"
          onClick={onMenuClick}
        >
          <AlignLeft size={26} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--sidebar-divider)] flex items-center justify-center bg-[var(--sidebar-hover-bg)] flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-[var(--sidebar-logo-text)]">
                {initials}
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-[var(--sidebar-logo-text)]">
            {displayName}
          </span>
        </div>
      </div>

      {/* --- PC --- */}
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-[var(--sidebar-logo-text)]">
          {pageTitle}
        </h1>
      </div>

      <div className="hidden md:block flex-1"></div>

      <div className="hidden md:flex items-center gap-4">
        {/* Buscador Sincronizado */}
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
            size={18}
          />
          <input
            type="text"
            // El placeholder cambia según la página: "Buscar Empresas...", "Buscar Actividad...", etc.
            placeholder={
              currentItem
                ? `Buscar ${currentItem.name.toLowerCase()}...`
                : "Buscar..."
            }
            defaultValue={searchParams.get("q")?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-1.5 rounded-lg border border-[var(--sidebar-divider)] bg-[var(--sidebar-bg)] focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm"
          />
        </div>

        {/* Iconos */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg-muted)]">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg-muted)]">
            <Grid3X3 size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-fg-muted)]">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
