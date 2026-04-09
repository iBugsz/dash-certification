"use client";
import { useState } from "react";
import { Building2 } from "lucide-react";
import type { Company } from "@/lib/certificates/types";

// ─── Component ────────────────────────────────────────────────────────────────

export function CompanyBadge({ company }: { company: Company }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 bg-accent/5 border border-accent/20 rounded-2xl animate-in fade-in zoom-in duration-300">
      <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)] flex items-center justify-center shrink-0">
        {company.logo_url && !imgError ? (
          <img
            src={company.logo_url}
            alt={company.name}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <Building2 className="w-5 h-5 text-slate-400" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black text-accent uppercase tracking-widest truncate">
          {company.name}
        </p>
        {company.nit && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            NIT: {company.nit}
          </p>
        )}
      </div>
    </div>
  );
}
