"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabaseClient";
import { SidebarHeader } from "./sidebar-header";
import { SidebarItem } from "./sidebar-item";
import { SidebarFooter } from "./sidebar-footer";
import { MENU_ITEMS } from "@/constants/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (value: boolean) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isOpenMobile,
  setIsOpenMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { initials, displayName, user, avatarUrl } = useUser();
  const [appName, setAppName] = useState<string>("AutoCert");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "app_name")
          .single();
        if (data && !error) setAppName(data.value);
      } catch (err) {
        console.error("Error cargando app_name:", err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <>
      {/* OVERLAY: Fondo oscuro y difuminado */}
      <div
        className={`
          fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${isOpenMobile ? "opacity-100 z-[100] pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}
        `}
        onClick={() => setIsOpenMobile(false)}
      />

      <aside
        className={`
          app-sidebar fixed left-0 top-0 h-screen z-[110] flex flex-col
          bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-divider)]
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          shadow-2xl md:shadow-none
          ${isCollapsed ? "md:w-[60px]" : "md:w-[260px]"}
          w-[85%] max-w-[340px]
          ${isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          appName={appName}
          isOpenMobile={isOpenMobile}
        />

        <nav className="flex-1 flex flex-col gap-2 py-8 px-6 overflow-y-auto overflow-x-hidden">
          {MENU_ITEMS.map((item) => (
            <div key={item.href} onClick={() => setIsOpenMobile(false)}>
              <SidebarItem
                item={item}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
                isMobileView={isOpenMobile}
              />
            </div>
          ))}
        </nav>

        {/* FOOTER: Con lógica de Android integrada */}
        <SidebarFooter
          initials={initials}
          displayName={displayName}
          email={user?.email}
          avatarUrl={avatarUrl}
          isCollapsed={isCollapsed}
          isMobileView={isOpenMobile}
        />
      </aside>
    </>
  );
}
