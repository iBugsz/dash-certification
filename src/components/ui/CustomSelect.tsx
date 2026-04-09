"use client";
import { useState } from "react";
import { ChevronDown, CheckCircle2, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomSelectProps<T extends { id: string; name: string }> {
  label: string;
  icon: React.ElementType;
  options: T[];
  value: T | null;
  onChange: (item: T | null) => void;
  placeholder: string;
  loading?: boolean;
  disabled?: boolean;
  renderOption?: (item: T) => React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CustomSelect<T extends { id: string; name: string }>({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  placeholder,
  loading,
  disabled,
  renderOption,
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase mb-2 block ml-1 tracking-widest">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border)]
          bg-[var(--input-bg)] text-sm text-left transition-all outline-none
          ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-accent focus:ring-2 focus:ring-accent/30"}
          ${open ? "border-accent ring-2 ring-accent/30" : ""}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />
        ) : (
          <Icon className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        <span
          className={`flex-1 truncate ${value ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}
        >
          {loading ? "Cargando..." : value ? value.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && !loading && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {options.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 text-center">
              Sin resultados
            </p>
          ) : (
            <ul className="max-h-52 overflow-y-auto p-1">
              {options.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors
                      ${
                        value?.id === item.id
                          ? "bg-accent/10 text-accent font-semibold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                  >
                    {renderOption ? renderOption(item) : item.name}
                    {value?.id === item.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-accent" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
