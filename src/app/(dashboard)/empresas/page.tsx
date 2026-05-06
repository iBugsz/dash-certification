"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation"; // Importante para leer el Navbar
import { Building2, Plus, SearchX } from "lucide-react";
import { Company } from "@/lib/types/database";
import { useCompanies } from "@/hooks/useCompanies";
import CompanyCard from "@/components/features/companies/CompanyCard";
import CompanyCardSkeleton from "@/components/features/companies/CompanyCardSkeleton";
import CompanyModal from "@/components/features/companies/CompanyModal";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function CompaniesPage() {
  const { companies, loading, saveCompany, deleteCompany } = useCompanies();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  // --- LÓGICA DE BÚSQUEDA SINCRONIZADA ---
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  // Filtramos las empresas basándonos en la "q" de la URL
  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.nit?.toLowerCase().includes(query),
  );

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
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Nueva Empresa
        </button>
      </div>

      {/* Contenido principal */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {query ? (
            <>
              <SearchX size={56} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">No se encontraron empresas</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </>
          ) : (
            <>
              <Building2 size={56} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">No hay empresas registradas</p>
              <p className="text-sm">Crea la primera con el botón de arriba</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
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
