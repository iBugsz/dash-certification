"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Plus, Edit2, Tag as TagIcon, ArrowLeft, Type, ImageIcon, Hash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { MappingField, FieldType, FieldFormat, CaseFormat } from "@/lib/types/database";

// ─── Constants (mismas que MappingModal) ─────────────────────────────────────

const TYPE_OPTIONS: { value: FieldType; icon: React.ReactNode; label: string }[] = [
  { value: "text",   icon: <Type size={13} />,      label: "Texto" },
  { value: "number", icon: <Hash size={13} />,      label: "Número" },
  { value: "image",  icon: <ImageIcon size={13} />, label: "Imagen" },
];

const CASE_OPTIONS: { value: CaseFormat; label: string; example: string }[] = [
  { value: "none",        label: "Sin formato",           example: "abc" },
  { value: "capitalize", label: "Cada palabra mayús.",    example: "Abc Def" },
  { value: "sentence",   label: "Solo la inicial mayús.", example: "Abc def" },
  { value: "uppercase",  label: "Todo mayúsculas",        example: "ABC" },
  { value: "lowercase",  label: "Todo minúsculas",        example: "abc" },
];

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
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
              <button type="button" onClick={() => { const d = parseInt(field.format?.case?.split(":")[1] || "1"); if (d > 0) onUpdate({ case: `decimal:${d - 1}` }); }} className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-100">−</button>
              <span className="w-4 text-center font-mono font-semibold">{field.format?.case?.startsWith("decimal:") ? field.format.case.split(":")[1] : "1"}</span>
              <button type="button" onClick={() => { const d = parseInt(field.format?.case?.split(":")[1] || "1"); if (d < 10) onUpdate({ case: `decimal:${d + 1}` }); }} className="w-5 h-5 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-100">+</button>
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

// ─── FieldRow ─────────────────────────────────────────────────────────────────

function FieldRow({ tag, field, isOpen, onToggle, onChange, onRemove }: {
  tag: string; field: MappingField; isOpen: boolean;
  onToggle: () => void; onChange: (u: MappingField) => void; onRemove: () => void;
}) {
  const upd = (patch: Partial<MappingField>) => onChange({ ...field, ...patch });
  const updFmt = (newFormat: Partial<FieldFormat>) => onChange({ ...field, format: { ...field.format, ...newFormat } as FieldFormat });
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
          <div className={`flex items-center justify-center w-6 h-6 rounded-md border flex-shrink-0 ${
            field.type === "text" ? "bg-blue-50 text-blue-500 border-blue-100"
            : field.type === "number" ? "bg-amber-50 text-amber-500 border-amber-100"
            : "bg-emerald-50 text-emerald-500 border-emerald-100"
          }`}>
            {field.type === "text" && <Type size={11} />}
            {field.type === "number" && <Hash size={11} />}
            {field.type === "image" && <ImageIcon size={11} />}
          </div>
        )}
        <span className="font-mono text-[11px] text-slate-500 w-28 truncate flex-shrink-0">{`{${tag}}`}</span>
        {isUnknown ? (
          <>
            <span className="text-[10px] text-slate-400 italic ml-auto mr-2">Define el tipo</span>
            <div className="flex gap-1">
              <button onClick={() => upd({ type: "text", format: defaultFormat("text") })} className="cursor-pointer p-1.5 rounded hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors" title="Texto"><Type size={14} /></button>
              <button onClick={() => upd({ type: "number", format: defaultFormat("number") })} className="cursor-pointer p-1.5 rounded hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors" title="Número"><Hash size={14} /></button>
              <button onClick={() => upd({ type: "image" })} className="cursor-pointer p-1.5 rounded hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 transition-colors" title="Imagen"><ImageIcon size={14} /></button>
            </div>
          </>
        ) : (
          <>
            <input type="text" value={field.sheet ?? ""} onChange={(e) => upd({ sheet: e.target.value })} placeholder="Hoja" className="w-20 text-xs px-2 py-1 border rounded-md bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" />
            <input type="text" value={field.cell ?? ""} onChange={(e) => upd({ cell: e.target.value })} placeholder="A1" className="w-12 text-xs px-2 py-1 border rounded-md text-center font-mono uppercase bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" />
            {field.type !== "image" && (
              <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`ml-auto text-[10px] px-2 py-1 rounded-md border flex items-center gap-1 cursor-pointer ${isOpen ? "bg-amber-400 text-white border-amber-400" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                {formatSummary()} <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
              </button>
            )}
          </>
        )}
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="cursor-pointer p-1 text-slate-300 hover:text-red-400 flex-shrink-0 ml-auto">
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

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
      <span className="text-slate-400">{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <span className="ml-auto text-[10px] text-slate-300 dark:text-slate-600">{count}</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PresetManager({ onClose }: { onClose: () => void }) {
  const [presets, setPresets] = useState<any[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingPreset, setEditingPreset] = useState<any | null>(null);

  // Estado del editor de campos
  const [mapping, setMapping] = useState<Record<string, MappingField>>({});
  const [newTag, setNewTag] = useState("");
  const [newType, setNewType] = useState<FieldType>("text");
  const [newSheet, setNewSheet] = useState("");
  const [newCell, setNewCell] = useState("");
  const [openTag, setOpenTag] = useState<string | null>(null);

  const fetchPresets = async () => {
    console.log("Fetching presets...");
    const { data, error } = await supabase
      .from("tag_presets")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) console.error("Error fetching presets:", error);
    else console.log("Presets loaded:", data);
    
    setPresets(data || []);
  };

  useEffect(() => { fetchPresets(); }, []);

  const handleCreate = async () => {
    if (!newPresetName.trim()) return;
    setLoading(true);
    console.log("Creating preset:", newPresetName);
    const { error } = await supabase.from("tag_presets").insert([{ name: newPresetName.trim(), tags: {} }]);
    
    if (error) console.error("Error creating:", error);
    
    setNewPresetName("");
    await fetchPresets();
    setLoading(false);
  };

  const deletePreset = async (id: string) => {
    console.log("Deleting preset:", id);
    await supabase.from("tag_presets").delete().eq("id", id);
    fetchPresets();
  };

  const openEdit = (preset: any) => {
    console.log("Opening edit for:", preset);
    setEditingPreset(preset);
    const t = preset.tags;
    if (Array.isArray(t)) {
      const m: Record<string, MappingField> = {};
      t.forEach((tag: string) => { m[tag] = { type: "unknown" as any, label: tag, sheet: "", cell: "", format: { case: "none" } }; });
      setMapping(m);
    } else {
      setMapping(t ?? {});
    }
    setNewTag(""); setNewSheet(""); setNewCell("");
    setNewType("text"); setOpenTag(null);
  };

  const addField = () => {
    const tag = newTag.trim().replace(/[{}]/g, "");
    if (!tag || mapping[tag]) return;
    setMapping((prev) => ({
      ...prev,
      [tag]: { type: newType, label: tag, sheet: newSheet, cell: newCell, format: defaultFormat(newType) },
    }));
    setNewTag(""); setNewSheet(""); setNewCell("");
  };

  const updateField = (tag: string, updated: MappingField) => setMapping((prev) => ({ ...prev, [tag]: updated }));
  const removeField = (tag: string) => {
    setMapping((prev) => { const m = { ...prev }; delete m[tag]; return m; });
    if (openTag === tag) setOpenTag(null);
  };
  const toggleTag = (tag: string) => setOpenTag((prev) => prev === tag ? null : tag);

  const saveEditingPreset = async () => {
    if (!editingPreset) return;
    setLoading(true);

    const tagsToSave = JSON.parse(JSON.stringify(mapping));

    console.log(">>> [DEBUG] Intentando guardar...");
    console.log(">>> Preset ID:", editingPreset.id);
    console.log(">>> Payload:", { name: editingPreset.name, tags: tagsToSave });

    const { data, error } = await supabase
      .from("tag_presets")
      .update({ name: editingPreset.name, tags: tagsToSave })
      .eq("id", editingPreset.id)
      .select();

    console.log(">>> [DEBUG] Respuesta Supabase:", { data, error });

    if (error) {
      console.error(">>> [DEBUG] Error en update:", error);
      alert(`Error: ${error.message}`);
    } else {
      console.log(">>> [DEBUG] Guardado exitoso. Data:", data);
      await fetchPresets();
      setEditingPreset(null);
    }

    setLoading(false);
  };

  const entries = Object.entries(mapping);
  const unknownFields = entries.filter(([, f]) => !f.type || f.type === "unknown");
  const textFields   = entries.filter(([, f]) => f.type === "text");
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
            key={tag} tag={tag} field={field}
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 font-poppins">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95">

        {!editingPreset && (
          <>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Grupos de Tags</h2>
                <p className="text-[11px] text-slate-400">Gestiona tus presets de etiquetas</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex gap-2">
                <input
                  type="text" value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Nombre del nuevo grupo..."
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
                />
                <button
                  onClick={handleCreate}
                  disabled={loading || !newPresetName.trim()}
                  className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 disabled:opacity-30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} /> Crear
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
              {presets.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">No hay grupos creados.</div>
              ) : presets.map((p) => {
                const tagCount = Array.isArray(p.tags) ? p.tags.length : Object.keys(p.tags ?? {}).length;
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-lg flex-shrink-0">
                        <TagIcon size={14} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{tagCount} etiqueta{tagCount !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors cursor-pointer">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deletePreset(p.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {editingPreset && (
          <>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button onClick={() => setEditingPreset(null)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 cursor-pointer flex-shrink-0">
                <ArrowLeft size={15} />
              </button>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={editingPreset.name}
                  onChange={(e) => setEditingPreset((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="text-sm font-bold bg-transparent outline-none w-full text-slate-800 dark:text-slate-100 border-b border-transparent focus:border-slate-300 dark:focus:border-slate-600 transition-colors pb-0.5"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">{entries.length} etiqueta{entries.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex gap-2 items-center">
                <TypeToggle value={newType} onChange={setNewType} />
                <input
                  type="text" placeholder="tag" value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addField()}
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-mono"
                />
                {newType !== "image" && (
                  <>
                    <input
                      type="text" placeholder="Hoja" value={newSheet}
                      onChange={(e) => setNewSheet(e.target.value)}
                      className="w-20 text-xs px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    />
                    <input
                      type="text" placeholder="A1" value={newCell}
                      onChange={(e) => setNewCell(e.target.value)}
                      className="w-12 text-xs px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-center uppercase font-mono"
                    />
                  </>
                )}
                <button
                  onClick={addField} disabled={!newTag.trim()}
                  className="cursor-pointer px-4 py-2 text-xs font-semibold rounded-lg transition-all bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 disabled:opacity-30"
                >
                  + Añadir
                </button>
              </div>
            </div>

            <div className="max-h-[52vh] overflow-y-auto">
              {entries.length === 0 && (
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-8">Sin campos aún. Añade uno arriba.</p>
              )}
              {renderSection(unknownFields, <span className="font-bold text-[10px]">?</span>, "Pendientes")}
              {renderSection(textFields,   <Type size={11} />,       "Texto")}
              {renderSection(numberFields, <Hash size={11} />,       "Número")}
              {renderSection(imageFields,  <ImageIcon size={11} />, "Imagen")}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button onClick={() => setEditingPreset(null)} className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 cursor-pointer">
                Cancelar
              </button>
              {missingCount > 0 && (
                <span className="text-[10px] text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                  {missingCount} campo{missingCount > 1 ? "s" : ""} sin completar
                </span>
              )}
              <button
                onClick={saveEditingPreset}
                disabled={loading}
                className="cursor-pointer ml-auto px-5 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}