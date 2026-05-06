"use client";

import { useState } from "react";
import { Mail, Phone, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Company } from "@/lib/types/database";
import { getInitials } from "@/lib/utils";

interface Props {
  company: Company;
  onEdit: (c: Company) => void;
  onDelete: (id: string) => void;
}

export default function CompanyCard({ company, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative bg-[var(--card)] rounded-[24px] shadow-sm border border-[var(--border)] hover:border-accent transition-all flex flex-col">
      {/* ── Banner ── */}
      <div className="relative h-28 rounded-t-[24px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden shrink-0">
        {company.logo_url && (
          <img
            src={company.logo_url}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px] scale-110 pointer-events-none"
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

      {/* ── Menú ⋮ ── */}
      <div className="absolute top-3 right-3 z-30">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-9 z-30 w-36 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(company);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer"
              >
                <Pencil size={13} /> Editar
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(company.id);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <Trash2 size={13} /> Eliminar
              </button>
            </div>
          </>
        )}
      </div>

      {/*
        ── Avatar ──
        Posicionado con absolute desde la card (el padre tiene relative).
        top-[88px] = 28*4 - 24 = justo mitad sobre el borde inferior del banner.
        z-10 garantiza que esté ENCIMA del banner aunque este tenga overflow-hidden.
      */}
      <div className="absolute left-5 top-[88px] z-10">
        <div className="w-14 h-14 rounded-2xl border-[3px] border-[var(--card)] bg-[var(--card)] shadow-lg overflow-hidden flex items-center justify-center">
          {company.logo_url ? (
            <>
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const sib = e.currentTarget
                    .nextElementSibling as HTMLElement | null;
                  if (sib) sib.style.display = "flex";
                }}
              />
              <div
                className="w-full h-full items-center justify-center text-white font-bold text-base rounded-xl"
                style={{
                  display: "none",
                  background:
                    "linear-gradient(135deg, var(--accent-dark), var(--accent))",
                }}
              >
                {getInitials(company.name)}
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold text-base rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-dark), var(--accent))",
              }}
            >
              {getInitials(company.name)}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── pt-10 deja espacio visual para el avatar que sobresale ── */}
      <div className="px-5 pt-10 pb-5 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight line-clamp-2">
          {company.name}
        </h3>

        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 flex-1">
          {company.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 shrink-0 text-accent" />
              <span className="truncate">{company.email}</span>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0 text-accent" />
              <span>{company.phone}</span>
            </div>
          )}
          {!company.email && !company.phone && (
            <p className="italic text-slate-300 dark:text-slate-600 text-[11px]">
              Sin datos de contacto
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
