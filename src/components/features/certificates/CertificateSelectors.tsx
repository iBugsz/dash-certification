// src/components/features/certificates/CertificateSelectors.tsx
import {
  Building2,
  FileText,
  CheckCircle2,
  Layers3,
  SearchX,
  ArrowRightLeft,
  Sparkles,
} from "lucide-react";
import type { Company, Template } from "@/lib/certificates/types";

interface CertificateSelectorsProps {
  companies: Company[];
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  loadingCompanies: boolean;
  templates: Template[];
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template | null) => void;
  loadingTemplates: boolean;
}

export function CertificateSelectors({
  companies,
  selectedCompany,
  setSelectedCompany,
  loadingCompanies,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  loadingTemplates,
}: CertificateSelectorsProps) {
  const handleCompanySelect = (company: Company) => {
    if (loadingTemplates) return;
    if (selectedCompany?.id === company.id) {
      setSelectedCompany(null);
      setSelectedTemplate(null);
    } else {
      setSelectedCompany(company);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-1 min-h-[500px]">
      {/* COLUMNA IZQUIERDA: EMPRESAS */}
      <div className="w-full lg:w-64 space-y-4 shrink-0">
        <div className="flex items-center gap-2 px-2">
          <div className="p-1.5 bg-slate-900 dark:bg-slate-100 rounded-lg">
            <Building2 className="w-4 h-4 text-white dark:text-slate-900" />
          </div>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Empresa
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
          {companies.map((c) => {
            const isSelected = selectedCompany?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCompanySelect(c)}
                className={`cursor-pointer flex items-center gap-3 px-3 py-3 rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? "bg-slate-900 border-slate-900 text-white shadow-md translate-x-1"
                    : "bg-white border-slate-100 text-slate-600 hover:border-blue-200"
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center shrink-0 border border-slate-100">
                  {c.logo_url ? (
                    <img src={c.logo_url} className="w-full h-full object-contain p-1" alt={c.name} />
                  ) : (
                    <Building2 className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <span className="text-xs font-bold truncate flex-1 text-left">
                  {c.name}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* COLUMNA DERECHA: PLANTILLAS */}
      <div className="flex-1 space-y-4 relative bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 px-1">
          <div className="p-1.5 bg-blue-600 text-white rounded-lg">
            <Layers3 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Formatos
          </span>
        </div>

        <div className="relative min-h-[350px] w-full">
          {loadingTemplates && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl">
              <Sparkles className="w-6 h-6 text-blue-600 animate-pulse mb-2" />
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Cargando...</p>
            </div>
          )}

          {!selectedCompany && !loadingTemplates && (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center opacity-60">
              <ArrowRightLeft className="w-8 h-8 text-slate-300 mb-3" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Selecciona una empresa
              </p>
            </div>
          )}

          {selectedCompany && !loadingTemplates && templates.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2">
              {templates.map((t) => {
                const isSelected = selectedTemplate?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`group relative flex flex-col items-center justify-center text-center p-4 h-36 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "bg-white dark:bg-slate-900 border-blue-500 shadow-lg scale-105 z-10"
                        : "bg-white dark:bg-slate-950/20 border-slate-100 dark:border-slate-800 hover:border-blue-200"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className={`text-xs font-bold leading-tight line-clamp-2 px-1 ${
                      isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                    }`}>
                      {t.name}
                    </p>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-white dark:fill-slate-900" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}