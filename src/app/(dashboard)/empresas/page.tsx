"use client";

import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { Company } from "@/lib/companies/types";
import { useCompanies } from "@/hooks/useCompanies";
import CompanyCard from "@/components/features/companies/CompanyCard";
import CompanyCardSkeleton from "@/components/features/companies/CompanyCardSkeleton";
import CompanyModal from "@/components/features/companies/CompanyModal";

export default function CompaniesPage() {
  const { companies, loading, saveCompany, deleteCompany } = useCompanies();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (c: Company) => {
    setEditing(c);
    setShowModal(true);
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Empresas
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Administra las entidades para la homologación de vehículos.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold shadow-lg hover:bg-accent-dark transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Nueva Empresa
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
          <Building2 size={56} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No hay empresas registradas</p>
          <p className="text-sm">Crea la primera con el botón de arriba</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={openEdit}
              onDelete={deleteCompany}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CompanyModal
          editing={editing}
          onClose={() => setShowModal(false)}
          onSave={saveCompany}
        />
      )}
    </div>
  );
}
