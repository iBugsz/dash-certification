"use client";

import { useState } from "react";
import {
  X,
  Save,
  Plus,
  Trash2,
  Info,
  FileSpreadsheet,
  FileText,
  Table2,
  Hash,
} from "lucide-react";

interface MappingModalProps {
  template: any;
  onClose: () => void;
  onSave: (id: string, mapping: any) => Promise<void>;
}

export default function MappingModal({
  template,
  onClose,
  onSave,
}: MappingModalProps) {
  // Estructura: { etiqueta: { sheet: "Hoja1", cell: "A1" } }
  const [mapping, setMapping] = useState<
    Record<string, { sheet: string; cell: string }>
  >(template.mapping || {});
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState("");

  const addField = () => {
    const cleanTag = newTag.trim();
    if (cleanTag && !mapping[cleanTag]) {
      setMapping({
        ...mapping,
        [cleanTag]: { sheet: "Hoja1", cell: "" },
      });
      setNewTag("");
    }
  };

  const updateField = (tag: string, field: "sheet" | "cell", value: string) => {
    setMapping({
      ...mapping,
      [tag]: { ...mapping[tag], [field]: value },
    });
  };

  const removeField = (key: string) => {
    const newMapping = { ...mapping };
    delete newMapping[key];
    setMapping(newMapping);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(template.id, mapping);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[28px] shadow-2xl border border-white/20 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Configurar Mapeo de Datos</h3>
            <p className="text-sm text-slate-500 italic">{template.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {/* Formulario Añadir */}
          <div className="flex items-center gap-3 mb-8 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex-1 flex items-center gap-3 px-3">
              <FileText className="w-4 h-4 text-blue-500" />
              <input
                type="text"
                placeholder="Nombre de la etiqueta en Word (ej: Cliente)..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addField()}
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-2"
              />
            </div>
            <button
              onClick={addField}
              disabled={!newTag.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-30"
            >
              <Plus size={16} className="inline mr-1" /> Añadir Etiqueta
            </button>
          </div>

          {/* Lista de campos mejorada */}
          <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
            {Object.keys(mapping).length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[24px]">
                <FileSpreadsheet className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  No hay campos configurados aún.
                </p>
              </div>
            ) : (
              Object.entries(mapping).map(([tag, data]) => (
                <div
                  key={tag}
                  className="group flex items-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-400/50 transition-all shadow-sm"
                >
                  {/* Tag Word */}
                  <div className="flex-[1.5]">
                    <span className="text-[10px] font-black text-blue-500 uppercase block mb-1.5 ml-1">
                      Etiqueta Word
                    </span>
                    <div className="px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold text-slate-600">
                      {"{{"} {tag} {"}}"}
                    </div>
                  </div>

                  {/* Hoja Excel */}
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">
                      Hoja Excel
                    </span>
                    <div className="relative">
                      <Table2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Ej: Hoja1"
                        value={data.sheet}
                        onChange={(e) =>
                          updateField(tag, "sheet", e.target.value)
                        }
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Celda Excel */}
                  <div className="w-32">
                    <span className="text-[10px] font-black text-emerald-500 uppercase block mb-1.5 ml-1">
                      Celda
                    </span>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500" />
                      <input
                        type="text"
                        placeholder="Ej: B2"
                        value={data.cell}
                        onChange={(e) =>
                          updateField(tag, "cell", e.target.value)
                        }
                        className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 uppercase"
                      />
                    </div>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => removeField(tag)}
                    className="mb-1 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-sm font-bold text-slate-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
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
