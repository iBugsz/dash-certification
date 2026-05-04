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
          <h3 className="text-[10px] font-black text-[#a3aed0] uppercase tracking-[0.2em] mb-4 ml-1">
            1. Selecciona Emisor
          </h3>
          <div className="h-[420px] overflow-y-auto pr-2 custom-scrollbar border-r border-[#e9edf7] space-y-2">
            {companies.map((c: any) => {
              const isSelected = selectedCompany?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCompany(c);
                    setSelectedTemplate(null);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${
                    isSelected
                      ? "bg-white border-[#4318ff] shadow-sm"
                      : "bg-[#f4f7fe] border-transparent hover:border-[#e9edf7]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white p-1.5 shadow-sm border border-[#e9edf7]">
                    <img
                      src={c.logo_url}
                      className="w-full h-full object-contain"
                      alt=""
                    />
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isSelected
                        ? "text-[#1b2559]"
                        : "text-[#a3aed0] group-hover:text-[#1b2559]"
                    }`}
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
          className={`transition-opacity duration-300 ${
            !selectedCompany ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <h3 className="text-[10px] font-black text-[#a3aed0] uppercase tracking-[0.2em] mb-4 ml-1">
            2. Tipo de Homologación
          </h3>
          <div className="flex flex-wrap gap-3">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${
                  activeFilter === f.id
                    ? "bg-white border-[#4318ff] text-[#4318ff] shadow-sm"
                    : "bg-[#f4f7fe] border-transparent text-[#a3aed0] hover:text-[#1b2559]"
                }`}
              >
                <f.icon className="w-4 h-4" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#f4f7fe] rounded-[32px] p-8 border border-[#e9edf7] min-h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-[#4318ff]" />
              <h3 className="text-lg font-bold text-[#1b2559]">
                3. Elige la Plantilla
              </h3>
            </div>
          </div>

          {!selectedCompany ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-[#a3aed0] italic">
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
                    className={`relative h-[180px] bg-white p-5 rounded-[24px] border-2 transition-all flex flex-col ${
                      isSelected
                        ? "border-[#4318ff] shadow-lg shadow-[#4318ff10]"
                        : "border-white shadow-sm"
                    }`}
                  >
                    {/* BOTÓN VISTA PREVIA (MODAL) CORREGIDO */}
                    <button
                      className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-[#f4f7fe] text-[#a3aed0] hover:text-[#4318ff] hover:bg-[#e9edf7] transition-all"
                      title="Vista Previa"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita seleccionar la plantilla al verla
                        setSelectedTemplate(template); // Setea la plantilla actual
                        onViewTemplate(); // Abre el modal
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="flex-1 flex flex-col text-left h-full w-full"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
                          isSelected
                            ? "bg-[#4318ff] text-white"
                            : "bg-[#f4f7fe] text-[#2b579a]"
                        }`}
                      >
                        <FileText className="w-6 h-6" />
                      </div>

                      <div className="space-y-1 pr-6">
                        <p
                          className={`text-[12px] font-black uppercase leading-tight line-clamp-2 ${
                            isSelected ? "text-[#1b2559]" : "text-[#a3aed0]"
                          }`}
                        >
                          {template.name}
                        </p>
                        <p className="text-[10px] text-[#4318ff] font-black mt-2">
                          DOCX
                        </p>
                      </div>

                      {isSelected && (
                        <div className="mt-auto flex items-center gap-1 text-[10px] font-bold text-[#4318ff]">
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
