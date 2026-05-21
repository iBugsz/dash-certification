"use client";

import { Mail, Phone, Pencil, Trash2 } from "lucide-react";
import { Company } from "@/lib/types/database";
import { getInitials } from "@/lib/utils";
// Agrega este import arriba
import { formatDate } from "@/lib/utils";

interface Props {
  company: Company;
  onEdit: (c: Company) => void;
  onDelete: (id: string) => void;
}

export default function CompanyCard({ company, onEdit, onDelete }: Props) {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-200 dark:hover:border-slate-700 transition-all">

      {/* ── Banner ── */}
      <div className="relative h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shrink-0">
        {company.logo_url && (
          <img
            src={company.logo_url}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[3px] scale-110 pointer-events-none"
          />
        )}
        {!company.logo_url && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 60%, var(--accent) 0%, transparent 65%)",
            }}
          />
        )}
      </div>

      {/* ── Contenido principal ── */}
      <div className="flex-1 px-4 pt-3 pb-3">
        {/* Avatar + nombre */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-[10px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 shadow-sm -mt-7 z-10 relative">
            {company.logo_url ? (
              <>
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (sib) sib.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full items-center justify-center text-white font-bold text-xs rounded-[10px]"
                  style={{
                    display: "none",
                    background: "linear-gradient(135deg, var(--accent-dark), var(--accent))",
                  }}
                >
                  {getInitials(company.name)}
                </div>
              </>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold text-xs rounded-[10px]"
                style={{
                  background: "linear-gradient(135deg, var(--accent-dark), var(--accent))",
                }}
              >
                {getInitials(company.name)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug truncate">
              {company.name}
            </p>
            {company.nit && (
              <p className="text-[11px] text-slate-400 mt-0.5">NIT {company.nit}</p>
            )}
          </div>
        </div>

        {/* Badges contacto */}
        <div className="flex flex-wrap gap-1.5">
          {company.email && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <Mail className="w-3 h-3 text-[var(--accent)] shrink-0" />
              <span className="truncate max-w-[140px]">{company.email}</span>
            </span>
          )}
          {company.phone && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <Phone className="w-3 h-3 text-[var(--accent)] shrink-0" />
              {company.phone}
            </span>
          )}
          {!company.email && !company.phone && (
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-400">
              Sin datos de contacto
            </span>
          )}
        </div>
      </div>

      {/* ── Footer: acciones ── */}
 {/* ── Footer: acciones ── */}
<div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-800">
  
  {/* Fecha alineada a la izquierda con protección de espacio */}
  <span className="text-[11px] text-slate-400 min-w-0 truncate">
    {formatDate(company.updated_at || company.created_at)}
  </span>

  {/* Botones alineados a la derecha que no se encogen */}
  <div className="flex items-center gap-0.5 shrink-0">
    <button
      onClick={() => onEdit(company)}
      className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      title="Editar"
    >
      <Pencil className="w-3.5 h-3.5" />
    </button>
    <button
      onClick={() => onDelete(company.id)}
      className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
      title="Eliminar"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>

</div>

    </div>
  );
}