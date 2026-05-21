"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Building2,
  SearchX,
  AlertTriangle,
  Trash2,
} from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [companyToDelete, setCompanyToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nit?.toLowerCase().includes(q),
    );
  }, [companies, search]);

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (c: Company) => {
    setEditing(c);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (company) setCompanyToDelete({ id, name: company.name });
  };

  const handleConfirmDelete = async () => {
    if (companyToDelete) {
      await deleteCompany(companyToDelete.id);
      setCompanyToDelete(null);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 space-y-6 text-slate-900 dark:text-slate-100 font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Empresas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Administra las entidades para la homologación de vehículos.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva Empresa
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o NIT..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          {search ? (
            <>
              <SearchX size={36} className="mb-3 opacity-20" />
              <p className="text-sm font-medium">No se encontraron empresas</p>
            </>
          ) : (
            <>
              <Building2 size={36} className="mb-3 opacity-20" />
              <p className="text-sm font-medium">No hay empresas registradas</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* MODAL: CREAR / EDITAR */}
      {showModal && (
        <CompanyModal
          editing={editing}
          onClose={() => setShowModal(false)}
          onSave={saveCompany}
        />
      )}

      {/* MODAL: CONFIRMAR BORRADO */}
      {companyToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="mx-auto w-14 h-14 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-1">¿Eliminar empresa?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Estás a punto de eliminar{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  "{companyToDelete.name}"
                </span>
                . Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setCompanyToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}