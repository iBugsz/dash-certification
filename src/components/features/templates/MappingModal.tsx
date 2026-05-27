"use client";

import { useState } from "react";
import { X, Trash2, Type, ImageIcon, Hash } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "number" | "image";
type CaseFormat = "none" | "uppercase" | "lowercase" | "capitalize" | "sentence";

interface FieldFormat {
  case?: string; // Ahora guardará: "none", "uppercase", "rounded", "decimal:2", etc.
}

interface MappingField {
  type: FieldType;
  label: string;
  sheet?: string;
  cell?: string;
  format?: FieldFormat;
}

interface MappingModalProps {
  template: any;
  onClose: () => void;
  onSave: (id: string, mapping: Record<string, MappingField>) => Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_OPTIONS: { value: FieldType; icon: React.ReactNode; label: string }[] = [
  { value: "text",   icon: <Type size={13} />,      label: "Texto" },
  { value: "number", icon: <Hash size={13} />,      label: "Número" },
  { value: "image",  icon: <ImageIcon size={13} />, label: "Imagen" },
];

const CASE_OPTIONS: { value: CaseFormat; label: string; example: string }[] = [
  { value: "none",       label: "Sin formato",            example: "abc" },
  { value: "capitalize", label: "Cada palabra mayús.",    example: "Abc Def" },
  { value: "sentence",   label: "Solo la inicial mayús.", example: "Abc def" },
  { value: "uppercase",  label: "Todo mayúsculas",        example: "ABC" },
  { value: "lowercase",  label: "Todo minúsculas",        example: "abc" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultFormat(type: FieldType): FieldFormat | undefined {
  if (type === "text") return { case: "none" };
  if (type === "number") return { case: "none" }; // Nuevo estándar
  return undefined;
}

function isMissing(field: MappingField) {
  if (field.type === "image") return false;
  return !field.sheet?.trim() || !field.cell?.trim();
}

// ─── TypeToggle ───────────────────────────────────────────────────────────────

function TypeToggle({ value, onChange }: { value: FieldType; onChange: (v: FieldType) => void }) {
  const colorMap = {
    text:   { active: "bg-blue-500 text-white",   hover: "text-slate-400 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20" },
    number: { active: "bg-amber-500 text-white",  hover: "text-slate-400 hover:bg-amber-50 hover:text-amber-500 dark:hover:bg-amber-900/20" },
    image:  { active: "bg-emerald-500 text-white", hover: "text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-900/20" },
  };

  return (
    <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
      {TYPE_OPTIONS.map((t) => {
        const isActive = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            title={t.label}
            onClick={() => onChange(t.value)}
            className={`cursor-pointer relative group px-3 py-2 transition-all duration-200 ${isActive ? colorMap[t.value].active : colorMap[t.value].hover}`}
          >
            {t.icon}
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-slate-900 dark:bg-slate-700 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── FormatList ───────────────────────────────────────────────────────────────
function FormatList({ field, onUpdate, onClose }: { field: MappingField; onUpdate: (f: Partial<FieldFormat>) => void; onClose: () => void }) {
  
  return (
    <div className="mt-2.5 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
      
      {/* Opciones para Texto */}
      {field.type === "text" && (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {CASE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onUpdate({ case: opt.value }); onClose(); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                field.format?.case === opt.value 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium" 
                  : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span>{opt.label}</span>
              <span className="text-[10px] text-slate-400 font-mono">{opt.example}</span>
            </button>
          ))}
        </div>
      )}

      {/* Opciones para Número */}
      {field.type === "number" && (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <button
            onClick={() => { onUpdate({ case: "none" }); onClose(); }}
            className={`w-full flex items-center px-3 py-2 text-xs transition-colors ${field.format?.case === "none" ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-slate-50"}`}
          >
            <span>Sin formato</span>
          </button>

          <button
            className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
              field.format?.case?.startsWith("decimal:")
                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium"
                : "hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <span>Decimales</span>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  const d = parseInt(field.format?.case?.split(":")[1] || "1");
                  if (d > 0) onUpdate({ case: `decimal:${d - 1}` });
                }}
                className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-100"
              >−</button>
              <span className="w-4 text-center font-mono font-semibold">
                {field.format?.case?.startsWith("decimal:") ? field.format.case.split(":")[1] : "1"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const d = parseInt(field.format?.case?.split(":")[1] || "1");
                  if (d < 10) onUpdate({ case: `decimal:${d + 1}` });
                }}
                className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-100"
              >+</button>
            </div>
          </button>

          <button
            onClick={() => { onUpdate({ case: "rounded" }); onClose(); }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${field.format?.case === "rounded" ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-slate-50"}`}
          >
            <span>Redondeo entero</span>
            <span className="text-slate-400 font-mono">4.7 → 5</span>
          </button>
        </div>
      )}
    </div>
  );
}
// ─── Field row ────────────────────────────────────────────────────────────────

function FieldRow({
  tag, field, isOpen, onToggle, onChange, onRemove,
}: {
  tag: string;
  field: MappingField;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (updated: MappingField) => void;
  onRemove: () => void;
}) {
  const upd    = (patch: Partial<MappingField>)  => onChange({ ...field, ...patch });
  const updFmt = (newFormat: FieldFormat) => 
  onChange({ ...field, format: newFormat });
  const missing = isMissing(field);

  const formatSummary = () => {
  if (field.type === "text") {
    return CASE_OPTIONS.find((o) => o.value === field.format?.case)?.label || "Sin formato";
  }
  if (field.type === "number") {
    if (field.format?.case === "rounded") return "Redondeo entero";
    if (field.format?.case?.startsWith("decimal:")) {
      const d = field.format.case.split(":")[1];
      return `${d} decimal${d !== "1" ? "es" : ""}`;
    }
    return "Sin formato"; // Valor por defecto
  }
  return "Formato";
};

  return (
    <div className={`border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors ${isOpen ? "bg-slate-50 dark:bg-slate-800/50" : ""}`}>
      <div
        className={`flex items-center gap-2 px-4 py-2.5 ${field.type !== "image" ? "cursor-pointer select-none" : ""}`}
        onClick={(e) => {
          if (field.type === "image") return;
          if ((e.target as HTMLElement).closest("input") || (e.target as HTMLElement).closest("button")) return;
          onToggle();
        }}
      >
        {/* Tipo icono */}
        <span className={`flex items-center justify-center w-6 h-6 rounded-md border flex-shrink-0 ${
          field.type === "text" ? "bg-blue-50 text-blue-500 border-blue-100"
          : field.type === "number" ? "bg-amber-50 text-amber-500 border-amber-100"
          : "bg-emerald-50 text-emerald-500 border-emerald-100"
        }`}>
          {field.type === "text" && <Type size={11} />}
          {field.type === "number" && <Hash size={11} />}
          {field.type === "image" && <ImageIcon size={11} />}
        </span>

        {/* Tag */}
        <span className="font-mono text-[11px] text-slate-500 w-28 truncate">{`{${tag}}`}</span>

        {field.type !== "image" ? (
          <>
            {/* Hoja */}
            <input
              type="text"
              value={field.sheet ?? ""}
              onChange={(e) => upd({ sheet: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="Hoja"
              className={`w-20 text-xs px-2 py-1 border rounded-md bg-slate-50 dark:bg-slate-800 transition-colors ${
                missing && !field.sheet?.trim()
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10 placeholder-red-300 dark:placeholder-red-700"
                  : ""
              }`}
            />
            {/* Celda */}
            <input
              type="text"
              value={field.cell ?? ""}
              onChange={(e) => upd({ cell: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="A1"
              className={`w-12 text-xs px-2 py-1 border rounded-md text-center font-mono uppercase bg-slate-50 dark:bg-slate-800 transition-colors ${
                missing && !field.cell?.trim()
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10 placeholder-red-300 dark:placeholder-red-700"
                  : ""
              }`}
            />
            {/* Botón formato */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              className={`ml-auto text-[10px] px-2 py-1 rounded-md border flex items-center gap-1 cursor-pointer transition-colors ${
                isOpen
                  ? "bg-amber-400 text-white border-amber-400 dark:bg-amber-500 dark:border-amber-500"
                  : "border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-300"
              }`}
            >
              {formatSummary()}
              <span className="inline-block transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
            </button>
          </>
        ) : (
          <input
            type="text"
            value={field.label}
            onChange={(e) => upd({ label: e.target.value })}
            className="flex-1 text-xs px-2 py-1 bg-slate-50 border rounded-md"
          />
        )}

        {/* Indicador faltante */}
        {missing && (
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" title="Faltan hoja o celda" />
        )}

        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1 text-slate-300 hover:text-red-400 flex-shrink-0">
          <Trash2 size={13} />
        </button>
      </div>

      {isOpen && field.type !== "image" && (
        <div className="px-4 pb-3">
          <FormatList field={field} onUpdate={updFmt} onClose={onToggle} />
        </div>
      )}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
      <span className="text-slate-400">{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <span className="ml-auto text-[10px] text-slate-300 dark:text-slate-600">{count}</span>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function MappingModal({ template, onClose, onSave }: MappingModalProps) {
  const [mapping, setMapping]   = useState<Record<string, MappingField>>(template.mapping || {});
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag]     = useState("");
  const [newType, setNewType]   = useState<FieldType>("text");
  const [newSheet, setNewSheet] = useState("");
  const [newCell, setNewCell]   = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [openTag, setOpenTag]   = useState<string | null>(null);

  const addField = () => {
    const tag = newTag.trim();
    if (!tag || mapping[tag]) return;
    setMapping({ ...mapping, [tag]: { type: newType, label: newLabel || tag, sheet: newSheet, cell: newCell, format: defaultFormat(newType) } });
    setNewTag(""); setNewCell(""); setNewLabel("");
  };

  const updateField = (tag: string, updated: MappingField) => setMapping({ ...mapping, [tag]: updated });
  const removeField = (tag: string) => { const m = { ...mapping }; delete m[tag]; setMapping(m); if (openTag === tag) setOpenTag(null); };
  const toggleTag   = (tag: string) => setOpenTag((prev) => (prev === tag ? null : tag));

  const entries    = Object.entries(mapping);
  const textFields  = entries.filter(([, f]) => f.type === "text");
  const numberFields = entries.filter(([, f]) => f.type === "number");
  const imageFields  = entries.filter(([, f]) => f.type === "image");

  const missingCount = entries.filter(([, f]) => isMissing(f)).length;

  const renderSection = (items: [string, MappingField][], icon: React.ReactNode, label: string) => {
    if (items.length === 0) return null;
    return (
      <>
        <SectionHeader icon={icon} label={label} count={items.length} />
        {items.map(([tag, field]) => (
          <FieldRow
            key={tag}
            tag={tag}
            field={field}
            isOpen={openTag === tag}
            onToggle={() => toggleTag(tag)}
            onChange={(u) => updateField(tag, u)}
            onRemove={() => removeField(tag)}
          />
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 font-poppins">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Configurar mapeo</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{template.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={15} />
          </button>
        </div>

        {/* Add row */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex gap-2 items-center">
            <TypeToggle value={newType} onChange={setNewType} />
            <input 
              type="text" 
              placeholder="Tag" 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)} 
              className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400" 
            />
            {newType !== "image" && (
              <>
                <input 
                  type="text" 
                  placeholder="Hoja" 
                  value={newSheet} 
                  onChange={(e) => setNewSheet(e.target.value)} 
                  className="w-20 text-xs px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400" 
                />
                <input 
                  type="text" 
                  placeholder="A1" 
                  value={newCell} 
                  onChange={(e) => setNewCell(e.target.value)} 
                  className="w-12 text-xs px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-center uppercase" 
                />
              </>
            )}
            <button 
              onClick={addField} 
              disabled={!newTag.trim()} 
              className="cursor-pointer px-4 py-2 text-xs font-semibold rounded-lg transition-all 
                        bg-primary text-primary-foreground hover:opacity-90
                        disabled:opacity-30 disabled:cursor-not-allowed"
            >
              + Añadir
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[52vh] overflow-y-auto">
          {entries.length === 0 && (
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-8">Sin campos aún. Añade uno arriba.</p>
          )}
          {renderSection(textFields,   <Type size={11} />,      "Texto")}
          {renderSection(numberFields, <Hash size={11} />,      "Número")}
          {renderSection(imageFields,  <ImageIcon size={11} />, "Imagen")}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Cancelar</button>
          {missingCount > 0 && (
            <span className="text-[10px] text-red-500 dark:text-red-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 inline-block" />
              {missingCount} campo{missingCount > 1 ? "s" : ""} sin completar
            </span>
          )}
          <button
            onClick={async () => { setIsSaving(true); await onSave(template.id, mapping); onClose(); }}
            disabled={isSaving}
            className="cursor-pointer ml-auto px-5 py-2 text-xs font-semibold rounded-lg transition-all
                      bg-primary text-primary-foreground hover:opacity-90 shadow-sm
                      disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}