"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)] transition-colors">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out
          ml-0
          ${isCollapsed ? "md:ml-[52px]" : "md:ml-[220px]"}
        `}
      >
        <main className="p-4 md:p-8 flex-1 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
