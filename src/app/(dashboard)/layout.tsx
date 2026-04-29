"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/navigation/sidebar";
import Navbar from "@/components/ui/navigation/navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--main-bg)] overflow-x-hidden">
      {/* Sidebar con Drawer incluido */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Contenedor de contenido */}
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar
          isCollapsed={isCollapsed}
          onMenuClick={() => setIsOpenMobile(true)}
        />

        <main
          className={`
            flex-1 p-4 md:p-6 transition-all duration-300
            /* En móvil margen 0, en PC sigue al sidebar */
            ml-0 
            ${isCollapsed ? "md:ml-[60px]" : "md:ml-[260px]"}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
