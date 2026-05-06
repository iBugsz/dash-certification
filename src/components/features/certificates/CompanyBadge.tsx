"use client";
import { useState } from "react";
import { Building2 } from "lucide-react";
import type { Company } from "@/lib/types/database";

// ─── Component ────────────────────────────────────────────────────────────────

export function CompanyBadge({ company }: { company: Company }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl animate-in fade-in zoom-in duration-300"
      style={{
        backgroundColor: "rgba(67, 24, 255, 0.05)",
        borderColor: "rgba(67, 24, 255, 0.2)",
        borderWidth: "1px",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl overflow-hidden border flex items-center justify-center shrink-0"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        {company.logo_url && !imgError ? (
          <img
            src={company.logo_url}
            alt={company.name}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <Building2
            className="w-5 h-5"
            style={{ color: "var(--sidebar-fg-muted)" }}
          />
        )}
      </div>
      <div className="min-w-0">
        <p
          className="text-xs font-black uppercase tracking-widest truncate"
          style={{ color: "var(--accent)" }}
        >
          {company.name}
        </p>
        {company.nit && (
          <p
            className="text-[10px] mt-0.5"
            style={{ color: "var(--sidebar-fg-muted)" }}
          >
            NIT: {company.nit}
          </p>
        )}
      </div>
    </div>
  );
}
