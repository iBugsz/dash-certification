"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Type, ImageIcon, Hash, Layers } from "lucide-react";
import { MappingField, FieldType, FieldFormat, CaseFormat } from "@/lib/types/database";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  { value: "none",        label: "Sin formato",            example: "abc" },
  { value: "capitalize",  label: "Cada palabra mayús.",    example: "Abc Def" },
  { value: "sentence",    label: "Solo la inicial mayús.", example: "Abc def" },
  { value: "uppercase",   label: "Todo mayúsculas",        example: "ABC" },
  { value: "lowercase",   label: "Todo minúsculas",        example: "abc" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultFormat(type: FieldType): FieldFormat | undefined {
  if (type === "text") return { case: "none" };
  if (type === "number") return { case: "none" };
  return undefined;
}

function isMissing(field: MappingField) {
  if (field.type === "image") return false;
  return !field.sheet?.trim() || !field.cell?.trim();
}

// ─── TypeToggle ───────────────────────────────────────────────────────────────
function TypeToggle({ value, onChange }: { value: FieldType; onChange: (v: FieldType) => void }) {
  const colorMap: Partial<Record<FieldType, { active: string; hover: string }>> = {
    text:   { active: "bg-blue-500 text-white",    hover: "text-slate-400 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20" },
    number: { active: "bg-amber-500 text-white",   hover: "text-slate-400 hover:bg-amber-50 hover:text-amber-500 dark:hover:bg-amber-900/20" },
    image:  { active: "bg-emerald-500 text-white", hover: "text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-900/20" },
  };

  const defaultColors = { active: "bg-slate-500 text-white", hover: "text-slate-400 hover:bg-slate-100" };

  return (
    <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
      {TYPE_OPTIONS.map((t) => {
        const isActive = value === t.value;
        const colors = colorMap[t.value] || defaultColors;
        
        return (
          <button
            key={t.value}
            type="button"
            title={t.label}
            onClick={() => onChange(t.value)}
            className={`cursor-pointer relative group px-3 py-2 transition-all duration-200 ${isActive ? colors.active : colors.hover}`}
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
  const upd = (patch: Partial<MappingField>) => onChange({ ...field, ...patch });
  const updFmt = (newFormat: FieldFormat) => onChange({ ...field, format: newFormat });
  const isUnknown = !field.type || field.type === "unknown";

  const formatSummary = () => {
    if (field.type === "text") return CASE_OPTIONS.find((o) => o.value === field.format?.case)?.label || "Sin formato";
    if (field.type === "number") {
      if (field.format?.case === "rounded") return "Redondeo entero";
      if (field.format?.case?.startsWith("decimal:")) return `${field.format.case.split(":")[1]} decimales`;
      return "Sin formato";
    }
    return "Formato";
  };

  return (
    <div className={`border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors ${isOpen ? "bg-slate-50 dark:bg-slate-800/50" : ""}`}>
      <div className="flex items-center gap-2 px-4 py-2.5">
        {!isUnknown && (
          <div className={`flex items-center justify-center w-6 h-6 rounded-md border ${
            field.type === "text" ? "bg-blue-50 text-blue-500 border-blue-100"
            : field.type === "number" ? "bg-amber-50 text-amber-500 border-amber-100"
            : "bg-emerald-50 text-emerald-500 border-emerald-100"
          }`}>
            {field.type === "text" && <Type size={11} />}
            {field.type === "number" && <Hash size={11} />}
            {field.type === "image" && <ImageIcon size={11} />}
          </div>
        )}
        <span className="font-mono text-[11px] text-slate-500 w-28 truncate">{`{${tag}}`}</span>
        {isUnknown ? (
          <>
            <span className="text-[10px] text-slate-400 italic ml-auto mr-2">Toca el icono para definir tipo</span>
            <div className="flex gap-1">
              <button onClick={() => upd({ type: "text" })} className="cursor-pointer p-1.5 rounded hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors" title="Texto"><Type size={14} /></button>
              <button onClick={() => upd({ type: "number" })} className="cursor-pointer p-1.5 rounded hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors" title="Número"><Hash size={14} /></button>
              <button onClick={() => upd({ type: "image" })} className="cursor-pointer p-1.5 rounded hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 transition-colors" title="Imagen"><ImageIcon size={14} /></button>
            </div>
          </>
        ) : (
          <>
            <input type="text" value={field.sheet ?? ""} onChange={(e) => upd({ sheet: e.target.value })} placeholder="Hoja" className="w-20 text-xs px-2 py-1 border rounded-md bg-slate-50 dark:bg-slate-800" />
            <input type="text" value={field.cell ?? ""} onChange={(e) => upd({ cell: e.target.value })} placeholder="A1" className="w-12 text-xs px-2 py-1 border rounded-md text-center font-mono uppercase bg-slate-50 dark:bg-slate-800" />
            <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`ml-auto text-[10px] px-2 py-1 rounded-md border flex items-center gap-1 ${isOpen ? "bg-amber-400 text-white" : "border-slate-200 text-slate-500"}`}>
              {formatSummary()} <span className="transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
            </button>
          </>
        )}
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="cursor-pointer p-1 text-slate-300 hover:text-red-400 flex-shrink-0">
          <Trash2 size={13} />
        </button>
      </div>
      {isOpen && !isUnknown && field.type !== "image" && (
        <div className="px-4 pb-3">
          <FormatList field={field} onUpdate={updFmt} onClose={onToggle} />
        </div>
      )}
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function MappingModal({ template, onClose, onSave }: MappingModalProps) {
  const [mapping, setMapping] = useState<Record<string, MappingField>>(template.mapping || {});
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newType, setNewType] = useState<FieldType>("text");
  const [newSheet, setNewSheet] = useState("");
  const [newCell, setNewCell] = useState("");
  const [openTag, setOpenTag] = useState<string | null>(null);
  
  // States para Presets
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPreset, setSelectedPreset] = useState("");

  useEffect(() => {
    const fetchPresets = async () => {
      const { data } = await supabase.from("tag_presets").select("id, name, tags");
      if (data) setPresets(data);
    };
    fetchPresets();
  }, []);

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    const newTags = preset.tags;
    const existingTags = Object.keys(mapping);
    const conflicts = Object.keys(newTags).filter(tag => existingTags.includes(tag));

    if (conflicts.length > 0) {
      if (!window.confirm(`Los siguientes tags ya existen: ${conflicts.join(", ")}. ¿Deseas sobrescribirlos?`)) {
        return;
      }
    }
    setMapping(prev => ({ ...prev, ...newTags }));
  };

  const addField = () => {
    const tag = newTag.trim();
    if (!tag || mapping[tag]) return;
    setMapping({ 
      ...mapping, 
      [tag]: { type: newType, label: tag, sheet: newSheet, cell: newCell, format: defaultFormat(newType) } 
    });
    setNewTag(""); setNewCell("");
  };

  const updateField = (tag: string, updated: MappingField) => setMapping({ ...mapping, [tag]: updated });
  const removeField = (tag: string) => { const m = { ...mapping }; delete m[tag]; setMapping(m); if (openTag === tag) setOpenTag(null); };
  const toggleTag = (tag: string) => setOpenTag((prev) => (prev === tag ? null : tag));

  const entries = Object.entries(mapping);
  const unknownFields = entries.filter(([, f]) => !f.type || f.type === "unknown");
  const textFields = entries.filter(([, f]) => f.type === "text");
  const numberFields = entries.filter(([, f]) => f.type === "number");
  const imageFields = entries.filter(([, f]) => f.type === "image");
  const missingCount = entries.filter(([, f]) => isMissing(f)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 font-poppins">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Configurar mapeo</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{template.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={15} /></button>
        </div>

        {/* Selector de Presets */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Layers size={14} className="text-slate-400" />
          <select 
            className="w-full text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            value={selectedPreset}
            onChange={(e) => {
              setSelectedPreset(e.target.value);
              applyPreset(e.target.value);
            }}
          >
            <option value="">Cargar grupo de etiquetas...</option>
            {presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex gap-2 items-center">
            <TypeToggle value={newType} onChange={setNewType} />
            <input type="text" placeholder="Tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg" />
            {newType !== "image" && (
              <>
                <input type="text" placeholder="Hoja" value={newSheet} onChange={(e) => setNewSheet(e.target.value)} className="w-20 text-xs px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg" />
                <input type="text" placeholder="A1" value={newCell} onChange={(e) => setNewCell(e.target.value)} className="w-12 text-xs px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-center uppercase" />
              </>
            )}
            <button onClick={addField} disabled={!newTag.trim()} className="cursor-pointer px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30">+ Añadir</button>
          </div>
        </div>

        <div className="max-h-[52vh] overflow-y-auto">
          {entries.length === 0 && <p className="text-center text-xs text-slate-400 py-8">Sin campos aún.</p>}
          {unknownFields.length > 0 && (
            <>
              <div className="px-4 py-1.5 bg-slate-50 border-b text-[10px] font-semibold text-slate-400">PENDIENTES</div>
              {unknownFields.map(([tag, field]) => <FieldRow key={tag} tag={tag} field={field} isOpen={openTag === tag} onToggle={() => toggleTag(tag)} onChange={(u) => updateField(tag, u)} onRemove={() => removeField(tag)} />)}
            </>
          )}
          {textFields.length > 0 && (
            <>
              <div className="px-4 py-1.5 bg-slate-50 border-b text-[10px] font-semibold text-slate-400">TEXTO</div>
              {textFields.map(([tag, field]) => <FieldRow key={tag} tag={tag} field={field} isOpen={openTag === tag} onToggle={() => toggleTag(tag)} onChange={(u) => updateField(tag, u)} onRemove={() => removeField(tag)} />)}
            </>
          )}
          {numberFields.length > 0 && (
            <>
              <div className="px-4 py-1.5 bg-slate-50 border-b text-[10px] font-semibold text-slate-400">NÚMERO</div>
              {numberFields.map(([tag, field]) => <FieldRow key={tag} tag={tag} field={field} isOpen={openTag === tag} onToggle={() => toggleTag(tag)} onChange={(u) => updateField(tag, u)} onRemove={() => removeField(tag)} />)}
            </>
          )}
          {imageFields.length > 0 && (
            <>
              <div className="px-4 py-1.5 bg-slate-50 border-b text-[10px] font-semibold text-slate-400">IMAGEN</div>
              {imageFields.map(([tag, field]) => <FieldRow key={tag} tag={tag} field={field} isOpen={openTag === tag} onToggle={() => toggleTag(tag)} onChange={(u) => updateField(tag, u)} onRemove={() => removeField(tag)} />)}
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700">Cancelar</button>
          <button onClick={async () => { setIsSaving(true); await onSave(template.id, mapping); onClose(); }} disabled={isSaving} className="cursor-pointer ml-auto px-5 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}