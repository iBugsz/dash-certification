"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Homologacion, Company } from "@/hooks/useHomologaciones";

interface HomologationModalProps {
  editing: Homologacion | null;
  companies: Company[];
  onClose: () => void;
  onSave: (item: Partial<Homologacion>) => Promise<void>;
}

export default function HomologationModal({ editing, companies, onClose, onSave }: HomologationModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [category, setCategory] = useState("");
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setDescription(editing.description || "");
      setStartDate(editing.start_date);
      setDueDate(editing.due_date || "");
      setTags(editing.tags ? editing.tags.join(", ") : "");
      setCompanyId(editing.company_id || "");
      setCategory(editing.category || "");
    } else {
      setName("");
      setDescription("");
      setStartDate(new Date().toISOString().split("T")[0]);
      setDueDate("");
      setTags("");
      setCompanyId("");
      setCategory("");
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);

      const payload: Partial<Homologacion> = {
        name: name.trim(),
        description: description.trim() || null,
        start_date: startDate,
        due_date: dueDate || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        company_id: companyId || null,
        category: category.trim() || null,
      };

      if (editing) payload.id = editing.id;

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl p-6 bg-slate-900 border border-slate-800 text-slate-100 shadow-xl">
        
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={14} />
        </button>
        
        <div className="mb-4">
          <h2 className="text-base font-medium text-white">
            {editing ? "Editar Homologación" : "Nueva Homologación"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Nombre / Título
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Homologación de Chasis"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-slate-700 text-white"
              required
            />
          </div>

          {/* Selector de Empresa de la Base de Datos */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Empresa Relacionada
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-slate-700 text-white"
            >
              <option value="">Selecciona una empresa (Opcional)</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Entrada de Categoría */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Categoría
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej. Certificación Técnica, Seguridad"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales..."
              rows={3}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-slate-700 text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg outline-none text-white [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Fecha Vencimiento
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg outline-none text-white [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Etiquetas <span className="text-slate-600">(separadas por comas)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="frenos, misiones, opcional"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-slate-700 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}