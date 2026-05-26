// components/features/templates/PresetManager.tsx
import { useState, useEffect } from "react";
import { X, Trash2, Plus, Edit2, Tag as TagIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function PresetManager({ onClose }: { onClose: () => void }) {
  const [presets, setPresets] = useState<any[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPresets = async () => {
    const { data } = await supabase
      .from("tag_presets")
      .select("*")
      .order("created_at", { ascending: false });
    setPresets(data || []);
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  const handleCreate = async () => {
    if (!newPresetName.trim()) return;
    setLoading(true);
    
    // Incluimos "tags: []" (un array vacío) para cumplir con el requisito de la tabla
    const { error } = await supabase
      .from("tag_presets")
      .insert([{ 
        name: newPresetName.trim(),
        tags: [] 
      }]);

    if (error) {
      console.error("Error al crear:", error);
    } else {
      setNewPresetName("");
      fetchPresets();
    }
    setLoading(false);
  };

  const deletePreset = async (id: string) => {
    await supabase.from("tag_presets").delete().eq("id", id);
    fetchPresets();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 font-poppins">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold">Grupos de Tags</h2>
            <p className="text-[11px] text-slate-400">Gestiona tus presets de etiquetas</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Input para crear nuevo */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Nombre del nuevo grupo..."
              className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleCreate}
              disabled={loading || !newPresetName.trim()}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 transition-all flex items-center gap-1"
            >
              <Plus size={13} />
              Crear
            </button>
          </div>
        </div>

        {/* Lista de Tarjetas */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {presets.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs italic">
              No hay grupos de tags creados.
            </div>
          ) : (
            presets.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-white border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                    <TagIcon size={14} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{p.name}</span>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deletePreset(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}