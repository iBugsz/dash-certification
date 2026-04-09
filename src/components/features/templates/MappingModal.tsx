"use client";

import { useState } from "react";
import {
  X,
  Save,
  Plus,
  Trash2,
  FileSpreadsheet,
  FileText,
  Table2,
  Hash,
  Type,
  ImageIcon,
  Layers,
} from "lucide-react";

// Hacemos que sheet y cell sean opcionales en la interfaz
interface MappingField {
  sheet?: string;
  cell?: string;
  type: "text" | "image";
  label: string;
}

interface MappingModalProps {
  template: any;
  onClose: () => void;
  onSave: (id: string, mapping: Record<string, MappingField>) => Promise<void>;
}

export default function MappingModal({
  template,
  onClose,
  onSave,
}: MappingModalProps) {
  const [mapping, setMapping] = useState<Record<string, MappingField>>(
    template.mapping || {},
  );
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newType, setNewType] = useState<"text" | "image">("text");

  const addField = () => {
    const cleanTag = newTag.trim();
    if (cleanTag && !mapping[cleanTag]) {
      const newField: MappingField = {
        type: newType,
        label: cleanTag,
      };

      // Solo añadimos estos campos si es texto
      if (newType === "text") {
        newField.sheet = "Hoja1";
        newField.cell = "";
      }

      setMapping({
        ...mapping,
        [cleanTag]: newField,
      });
      setNewTag("");
    }
  };

  const updateField = (
    tag: string,
    field: keyof MappingField,
    value: string,
  ) => {
    setMapping({ ...mapping, [tag]: { ...mapping[tag], [field]: value } });
  };

  const removeField = (key: string) => {
    const newMapping = { ...mapping };
    delete newMapping[key];
    setMapping(newMapping);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // --- LIMPIEZA DEL JSON ANTES DE GUARDAR ---
      const cleanMapping = Object.entries(mapping).reduce(
        (acc, [tag, data]) => {
          if (data.type === "image") {
            // Si es imagen, creamos un objeto nuevo SOLO con type y label
            acc[tag] = {
              type: "image",
              label: data.label,
            };
          } else {
            // Si es texto, enviamos todo
            acc[tag] = data;
          }
          return acc;
        },
        {} as Record<string, MappingField>,
      );

      await onSave(template.id, cleanMapping);
      onClose();
    } catch (error) {
      console.error("Error al guardar el mapeo:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const textFields = Object.entries(mapping).filter(
    ([_, d]) => d.type === "text",
  );
  const imageFields = Object.entries(mapping).filter(
    ([_, d]) => d.type === "image",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 font-poppins">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Layers className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Estructura de Datos
              </h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                {template.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Selector de tipo y añadir */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl shadow-inner">
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              <FileText className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nombre de la etiqueta..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addField()}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 dark:text-slate-200"
              />
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setNewType("text")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${newType === "text" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                <Type size={14} /> Texto
              </button>
              <button
                type="button"
                onClick={() => setNewType("image")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${newType === "image" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-slate-500"}`}
              >
                <ImageIcon size={14} /> Imagen
              </button>
            </div>

            <button
              type="button"
              onClick={addField}
              disabled={!newTag.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-[1.2rem] transition-all disabled:opacity-20 shadow-md shadow-blue-500/10"
            >
              Añadir
            </button>
          </div>

          <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
            {/* VARIABLES DE TEXTO */}
            {textFields.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                  <Type size={14} /> Variables de Texto (Excel)
                </h4>
                {textFields.map(([tag, data]) => (
                  <div
                    key={tag}
                    className="flex items-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:shadow-md transition-all"
                  >
                    <div className="flex-[1.5]">
                      <span className="text-[10px] font-bold text-blue-600 mb-1 block uppercase tracking-tighter">
                        Tag Word
                      </span>
                      <div className="px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                        {"{{"}
                        {tag}
                        {"}}"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-slate-400 mb-1 block">
                        Hoja
                      </span>
                      <div className="relative">
                        <Table2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                        <input
                          type="text"
                          value={data.sheet}
                          onChange={(e) =>
                            updateField(tag, "sheet", e.target.value)
                          }
                          className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200"
                        />
                      </div>
                    </div>
                    <div className="w-24">
                      <span className="text-[10px] font-bold text-emerald-500 mb-1 block">
                        Celda
                      </span>
                      <input
                        type="text"
                        value={data.cell}
                        onChange={(e) =>
                          updateField(tag, "cell", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase text-center text-slate-700 dark:text-slate-200"
                      />
                    </div>
                    <button
                      onClick={() => removeField(tag)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors mb-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ARCHIVOS MULTIMEDIA */}
            {imageFields.length > 0 && (
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest px-2">
                  <ImageIcon size={14} /> Archivos Multimedia
                </h4>
                {imageFields.map(([tag, data]) => (
                  <div
                    key={tag}
                    className="flex items-end gap-3 p-4 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl group hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-emerald-600 mb-1 block uppercase tracking-tighter">
                        Tag Word
                      </span>
                      <div className="px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-800 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {"{{"}
                        {tag}
                        {"}}"}
                      </div>
                    </div>
                    <div className="flex-[2]">
                      <span className="text-[10px] font-bold text-slate-400 mb-1 block">
                        Nombre en el formulario
                      </span>
                      <input
                        type="text"
                        value={data.label}
                        onChange={(e) =>
                          updateField(tag, "label", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200"
                      />
                    </div>
                    <button
                      onClick={() => removeField(tag)}
                      className="p-2 text-emerald-200 hover:text-red-500 transition-colors mb-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              "Guardando..."
            ) : (
              <>
                <Save size={18} /> Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
