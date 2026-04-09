import { Building2, FileText } from "lucide-react";
import type { Company, Template } from "@/lib/certificates/types";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface CertificateSelectorsProps {
  // Companies
  companies: Company[];
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  loadingCompanies: boolean;
  // Templates
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
  return (
    <div className="bg-[var(--card)] p-5 rounded-[28px] shadow-sm border border-[var(--border)] transition-all">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Empresa */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Cliente
          </span>
          <CustomSelect
            label=""
            icon={Building2}
            options={companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            placeholder="Elegir empresa..."
            loading={loadingCompanies}
            renderOption={(c) => (
              <div className="flex items-center gap-2 py-0.5">
                <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                  {c.logo_url ? (
                    <img
                      src={c.logo_url}
                      className="object-contain"
                      alt={c.name}
                    />
                  ) : (
                    <Building2 className="w-3 h-3 text-slate-300" />
                  )}
                </div>
                <span className="font-bold text-xs truncate">{c.name}</span>
              </div>
            )}
          />
        </div>

        {/* Plantilla */}
        <div
          className={`space-y-1.5 transition-all duration-300 ${
            !selectedCompany
              ? "opacity-40 grayscale cursor-not-allowed"
              : "opacity-100"
          }`}
        >
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Documento Maestro
          </span>
          <CustomSelect
            label=""
            icon={FileText}
            options={templates}
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            placeholder={
              selectedCompany
                ? "Seleccionar plantilla..."
                : "Esperando empresa..."
            }
            loading={loadingTemplates}
            disabled={!selectedCompany || templates.length === 0}
            renderOption={(t) => (
              <div className="flex flex-col py-0.5">
                <span className="font-bold text-xs truncate">{t.name}</span>
                <span className="text-[9px] text-slate-400 truncate italic">
                  {t.file_name}
                </span>
              </div>
            )}
          />
        </div>
      </div>

      {/* Aviso sin plantillas */}
      {!loadingTemplates && selectedCompany && templates.length === 0 && (
        <div className="mt-3 px-3 py-2 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            Esta empresa no tiene plantillas configuradas.
          </p>
        </div>
      )}
    </div>
  );
}
