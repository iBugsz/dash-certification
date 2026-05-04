"use client";

import { motion } from "framer-motion";
import {
  Check,
  LayoutGrid,
  FileText,
  Truck,
  CarFront,
  FileQuestion,
  Eye,
} from "lucide-react";
import { useState } from "react";

export function CertificateSelectors({
  companies,
  selectedCompany,
  setSelectedCompany,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  onViewTemplate, // Prop añadida para abrir el modal
}: any) {
  const [activeFilter, setActiveFilter] = useState("carroceria");

  const filters = [
    { id: "carroceria", label: "Carrocería", icon: Truck },
    { id: "carga", label: "Carga", icon: CarFront },
    { id: "otros", label: "Otros", icon: FileQuestion },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* SECCIÓN IZQUIERDA: LISTA DE EMPRESAS FIJA */}
      <div className="lg:col-span-4 space-y-6">
        <div>
          <h3
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-1"
            style={{ color: "var(--sidebar-fg-muted)" }}
          >
            1. Selecciona Emisor
          </h3>
          <div
            className="h-[420px] overflow-y-auto pr-2 custom-scrollbar space-y-2"
            style={{
              borderRightColor: "var(--border)",
              borderRightWidth: "1px",
            }}
          >
            {companies.map((c: any) => {
              const isSelected = selectedCompany?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCompany(c);
                    setSelectedTemplate(null);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group"
                  style={{
                    backgroundColor: isSelected
                      ? "var(--card)"
                      : "var(--input-bg)",
                    borderColor: isSelected ? "var(--accent)" : "transparent",
                    boxShadow: isSelected
                      ? "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                      : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full p-1.5 shadow-sm"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderWidth: "1px",
                    }}
                  >
                    <img
                      src={c.logo_url}
                      className="w-full h-full object-contain"
                      alt=""
                    />
                  </div>
                  <span
                    className="text-sm font-bold transition-colors"
                    style={{
                      color: isSelected
                        ? "var(--foreground)"
                        : "var(--sidebar-fg-muted)",
                    }}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: FILTROS + PLANTILLAS */}
      <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4">
        <div
          className="transition-opacity duration-300"
          style={{
            opacity: !selectedCompany ? 0.3 : 1,
            pointerEvents: !selectedCompany ? "none" : "auto",
          }}
        >
          <h3
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-1"
            style={{ color: "var(--sidebar-fg-muted)" }}
          >
            2. Tipo de Homologación
          </h3>
          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-wider"
                style={{
                  backgroundColor:
                    activeFilter === f.id ? "var(--card)" : "var(--input-bg)",
                  borderColor:
                    activeFilter === f.id ? "var(--accent)" : "transparent",
                  color:
                    activeFilter === f.id
                      ? "var(--accent)"
                      : "var(--sidebar-fg-muted)",
                  boxShadow:
                    activeFilter === f.id
                      ? "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                      : "none",
                }}
              >
                <f.icon className="w-4 h-4" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="rounded-[32px] p-8 min-h-[350px] transition-colors duration-300"
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: "var(--border)",
            borderWidth: "1px",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LayoutGrid
                className="w-5 h-5"
                style={{ color: "var(--accent)" }}
              />
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                3. Elige la Plantilla
              </h3>
            </div>
          </div>

          {!selectedCompany ? (
            <div
              className="h-[200px] flex flex-col items-center justify-center italic"
              style={{ color: "var(--sidebar-fg-muted)" }}
            >
              <p className="text-sm font-medium">
                Selecciona una empresa a la izquierda primero
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template: any) => {
                const isSelected = selectedTemplate?.id === template.id;
                return (
                  <div
                    key={template.id}
                    className="relative h-[180px] p-5 rounded-[24px] border-2 transition-all flex flex-col"
                    style={{
                      backgroundColor: "var(--card)",
                      borderColor: isSelected ? "var(--accent)" : "var(--card)",
                      boxShadow: isSelected
                        ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                        : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* BOTÓN VISTA PREVIA (MODAL) CORREGIDO */}
                    <button
                      className="absolute top-4 right-4 z-20 p-2 rounded-xl transition-all"
                      style={{
                        backgroundColor: "var(--input-bg)",
                        color: "var(--sidebar-fg-muted)",
                      }}
                      title="Vista Previa"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita seleccionar la plantilla al verla
                        setSelectedTemplate(template); // Setea la plantilla actual
                        onViewTemplate(); // Abre el modal
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--accent)";
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "var(--border)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "var(--sidebar-fg-muted)";
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "var(--input-bg)";
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="flex-1 flex flex-col text-left h-full w-full"
                    >
                      <div
                        className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                        style={{
                          backgroundColor: isSelected
                            ? "var(--accent)"
                            : "var(--input-bg)",
                          color: isSelected ? "white" : "#2b579a",
                        }}
                      >
                        <FileText className="w-6 h-6" />
                      </div>

                      <div className="space-y-1 pr-6">
                        <p
                          className="text-[12px] font-black uppercase leading-tight line-clamp-2"
                          style={{
                            color: isSelected
                              ? "var(--foreground)"
                              : "var(--sidebar-fg-muted)",
                          }}
                        >
                          {template.name}
                        </p>
                        <p
                          className="text-[10px] font-black mt-2"
                          style={{ color: "var(--accent)" }}
                        >
                          DOCX
                        </p>
                      </div>

                      {isSelected && (
                        <div
                          className="mt-auto flex items-center gap-1 text-[10px] font-bold"
                          style={{ color: "var(--accent)" }}
                        >
                          <Check className="w-3 h-3 stroke-[4px]" />{" "}
                          SELECCIONADO
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
