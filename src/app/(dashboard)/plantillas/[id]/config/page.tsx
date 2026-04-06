'use client';
import { useState } from 'react';
import { Settings2, Plus, Trash2, Table as TableIcon, FileText } from 'lucide-react';

export default function TemplateConfigPage() {
  const [rules, setRules] = useState([
    { id: 1, tag: 'cliente', sheet: 'Hoja1', cell: 'B5' },
    { id: 2, tag: 'placa', sheet: 'Hoja1', cell: 'C10' },
  ]);

  const addRule = () => {
    setRules([...rules, { id: Date.now(), tag: '', sheet: 'Hoja1', cell: '' }]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8 text-slate-900 dark:text-slate-100">
      <div className="bg-[var(--card)] rounded-[24px] shadow-sm border border-[var(--border)] overflow-hidden transition-colors">
        
        <div className="p-6 bg-gradient-to-r from-[#8633FF] to-[#5E17EB] text-white">
          <div className="flex items-center gap-3">
            <Settings2 className="w-6 h-6" />
            <h1 className="text-xl font-bold font-poppins">Configurar Mapeo de Plantilla</h1>
          </div>
          <p className="text-purple-100 text-sm mt-1">Vincula las etiquetas del Word con las celdas del Excel estándar.</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Etiqueta en Word {"{{ }}"}</div>
              <div className="col-span-3">Nombre de Hoja</div>
              <div className="col-span-3">Celda (Ej: A1)</div>
              <div className="col-span-2 text-right">Acción</div>
            </div>

            {rules.map((rule) => (
              <div key={rule.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/80 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all">
                
                <div className="col-span-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="ej: nombre_duque"
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#8633FF] dark:focus:ring-purple-500/50 focus:bg-[var(--input-bg-focus)]"
                    value={rule.tag}
                  />
                </div>

                <div className="col-span-3">
                  <input 
                    type="text" 
                    placeholder="Hoja1"
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#8633FF] dark:focus:ring-purple-500/50 focus:bg-[var(--input-bg-focus)]"
                    value={rule.sheet}
                  />
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="C5"
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#8633FF] dark:focus:ring-purple-500/50 focus:bg-[var(--input-bg-focus)] font-mono"
                    value={rule.cell}
                  />
                </div>

                <div className="col-span-2 text-right">
                  <button 
                    type="button"
                    onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
            <button 
              type="button"
              onClick={addRule}
              className="flex items-center justify-center gap-2 text-sm font-bold text-[#8633FF] dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 px-4 py-2 rounded-xl transition-all w-fit"
            >
              <Plus className="w-4 h-4" />
              Añadir otra etiqueta
            </button>

            <button type="button" className="bg-[#8633FF] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-100 dark:shadow-purple-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
