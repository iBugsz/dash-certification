"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  FileText,
  Eye,
  Building2,
  LayoutGrid,
  Inbox,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface HomologationType {
  id: string;
  name: string;
  icon: string;
}

export function CertificateSelectors({
  companies,
  selectedCompany,
  setSelectedCompany,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  onViewTemplate,
}: any) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [homologationTypes, setHomologationTypes] = useState<
    HomologationType[]
  >([]);

  useEffect(() => {
    supabase
      .from("homologation_types")
      .select("id, name, icon")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setHomologationTypes(data ?? []));
  }, []);

  useEffect(() => {
    setActiveFilter("all");
  }, [selectedCompany]);

  const filteredTemplates =
    activeFilter === "all"
      ? templates
      : templates.filter((t: any) => t.homologation_type?.id === activeFilter);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 font-poppins items-start">
      {/* EMPRESAS */}
      <div className="xl:col-span-12 bg-white dark:bg-[#111113] rounded-2xl p-4 border border-[var(--border)] shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border-r pr-4 border-[var(--border)]">
            <Building2 className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--foreground)]">
              Empresas
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {companies.map((c: any) => {
              const isSelected = selectedCompany?.id === c.id;
              return (
                <div key={c.id} className="relative group">
                  <button
                    onClick={() => {
                      setSelectedCompany(c);
                      setSelectedTemplate(null);
                    }}
                    className={cn(
                      "w-12 h-12 cursor-pointer rounded-xl flex items-center justify-center transition-all border relative overflow-hidden bg-white dark:bg-[#18181B]",
                      isSelected
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent-light)] scale-110 shadow-md"
                        : "border-[var(--border)] hover:border-[var(--accent)] opacity-70 hover:opacity-100",
                    )}
                  >
                    <img
                      src={c.logo_url}
                      className="w-full h-full object-contain p-2"
                      alt=""
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[var(--accent)] opacity-5" />
                    )}
                  </button>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl font-bold">
                    {c.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILTROS + GRID */}
      <div className="xl:col-span-12 space-y-6">
        {/* BARRA DE FILTROS */}
        <div
          className={cn(
            "bg-white dark:bg-[#111113] rounded-2xl p-4 border border-[var(--border)] shadow-sm flex items-center justify-between gap-4 flex-wrap",
            !selectedCompany && "opacity-40 pointer-events-none",
          )}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--foreground)] ml-1">
              Homologaciones
            </h3>

            <div className="flex flex-wrap gap-2 bg-[var(--input-bg)] p-1 rounded-xl border">
              {/* Botón Todas — igual que empresas pero con LayoutGrid */}
              <div className="relative group">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={cn(
                    "w-10 h-10 cursor-pointer rounded-xl flex items-center justify-center transition-all border relative",
                    activeFilter === "all"
                      ? "bg-white dark:bg-[#18181B] text-[var(--accent)] border-[var(--accent)] ring-2 ring-[var(--accent-light)] scale-110 shadow-md"
                      : "border-transparent text-[var(--sidebar-fg-muted)] hover:border-[var(--border)] hover:text-[var(--foreground)] opacity-70 hover:opacity-100",
                  )}
                >
                  <LayoutGrid className="w-5 h-5" />
                  {/* Contador pequeño */}
                  {selectedCompany && templates.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[8px] font-black flex items-center justify-center">
                      {templates.length}
                    </span>
                  )}
                </button>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl font-bold">
                  Todas
                </div>
              </div>

              {/* Tipos dinámicos — icono + tooltip igual que empresas */}
              {homologationTypes.map((h) => {
                const isActive = activeFilter === h.id;
                const Icon =
                  (LucideIcons as any)[h.icon] ?? LucideIcons.FileQuestion;
                const count = templates.filter(
                  (t: any) => t.homologation_type?.id === h.id,
                ).length;

                return (
                  <div key={h.id} className="relative group">
                    <button
                      onClick={() => setActiveFilter(h.id)}
                      className={cn(
                        "w-10 h-10 cursor-pointer rounded-xl flex items-center justify-center transition-all border relative",
                        isActive
                          ? "bg-white dark:bg-[#18181B] text-[var(--accent)] border-[var(--accent)] ring-2 ring-[var(--accent-light)] scale-110 shadow-md"
                          : "border-transparent text-[var(--sidebar-fg-muted)] hover:border-[var(--border)] hover:text-[var(--foreground)] opacity-70 hover:opacity-100",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {/* Contador — solo si hay plantillas con ese tipo */}
                      {selectedCompany && count > 0 && (
                        <span
                          className={cn(
                            "absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[8px] font-black flex items-center justify-center",
                            isActive
                              ? "bg-[var(--accent)]"
                              : "bg-slate-400 dark:bg-slate-600",
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                    {/* Tooltip con nombre */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl font-bold">
                      {h.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedCompany && (
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#18181B] rounded-full border shadow-sm border-[var(--accent)]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-bold text-[var(--accent)] uppercase">
                {selectedCompany.name}
              </span>
            </div>
          )}
        </div>

        {/* ÁREA DE PLANTILLAS */}
        <div className="bg-white/50 dark:bg-black/5 rounded-3xl border border-dashed p-6 max-h-[450px] overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedCompany ? (
              <motion.div
                key="no-company"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[350px] flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-dashed border-[var(--border)]">
                  <Building2 className="w-8 h-8 text-[var(--border)]" />
                </div>
                <p className="text-sm font-bold text-[var(--sidebar-fg-muted)]">
                  Selecciona un emisor para visualizar plantillas
                </p>
              </motion.div>
            ) : filteredTemplates.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[300px] flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="p-4 bg-white rounded-full shadow-sm border border-[var(--border)]">
                  <Inbox className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="text-base font-bold text-[var(--foreground)]">
                    Sin plantillas disponibles
                  </p>
                  <p className="text-xs text-[var(--sidebar-fg-muted)] mt-1">
                    No hay plantillas en esta categoría para{" "}
                    <span className="font-bold">{selectedCompany.name}</span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="px-6 py-2 bg-white rounded-full border border-[var(--border)] text-[11px] font-bold hover:bg-[var(--input-bg)] transition-colors shadow-sm text-[var(--foreground)]"
                >
                  Ver todas las plantillas
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto pr-2 custom-scrollbar"
                style={{ maxHeight: "380px" }}
              >
                {filteredTemplates.map((template: any) => {
                  const isSelected = selectedTemplate?.id === template.id;
                  return (
                    <motion.div
                      key={template.id}
                      whileHover={{ y: -2 }}
                      className={cn(
                        "relative bg-white dark:bg-[#111113] rounded-xl border-2 transition-all cursor-pointer group shadow-sm overflow-hidden",
                        "aspect-square flex flex-col items-center justify-center p-3",
                        isSelected
                          ? "border-[var(--accent)] ring-2 ring-[var(--accent-light)]"
                          : "border-transparent hover:border-[var(--border)]",
                      )}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {isSelected && (
                        <div className="absolute top-0 right-0 bg-[var(--accent)] text-white p-1 rounded-bl-lg z-10">
                          <Check className="w-3 h-3" strokeWidth={5} />
                        </div>
                      )}

                      {template.homologation_type && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-[var(--accent-light)] text-[var(--accent)] text-[8px] font-black uppercase tracking-tight leading-none">
                          {template.homologation_type.name}
                        </div>
                      )}

                      <div className="mb-2 shrink-0 mt-3">
                        <div className="w-10 h-12 bg-[#eaf2fa] rounded-md border border-[#d1dfee] flex items-center justify-center relative shadow-sm">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2b579a] opacity-30 rounded-t-sm" />
                          <FileText
                            className="w-6 h-6"
                            style={{ color: "#2b579a" }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] font-bold text-[var(--foreground)] truncate w-full text-center px-1">
                        {template.name}
                      </p>
                      <span className="text-[8px] font-black text-[#2b579a]/60 mt-0.5 uppercase tracking-tighter">
                        docs
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template);
                          onViewTemplate();
                        }}
                        className="absolute bottom-1 right-1 p-1.5 rounded-lg text-[var(--sidebar-fg-muted)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all bg-white/80 dark:bg-black/50 backdrop-blur-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
