import { Book, Search, Filter, DatabaseBackup } from "lucide-react";

export default function CatalogosPage() {
  return (
    <div className="w-full max-w-(--breakpoint-2xl) mx-auto p-4 md:p-8 space-y-8 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 font-poppins">
            Catálogos de Referencia
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Consulta y gestiona las bases de datos de homologación.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold shadow-lg hover:bg-accent-dark transition-all">
          <DatabaseBackup className="w-5 h-5" />
          Actualizar Catálogo
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar en el catálogo (ej: Marca, VIN, Norma...)"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-accent focus:bg-[var(--input-bg-focus)] outline-none shadow-sm transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
          <Filter className="w-5 h-5" />
          Filtros
        </button>
      </div>

      <div className="bg-[var(--card)] rounded-[24px] shadow-sm border border-[var(--border)] overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Book className="w-5 h-5 text-accent" />
            Vista Previa del Catálogo Activo
          </h2>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Mostrando 150 de 4,200 registros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="px-6 py-4">ID Homologación</th>
                <th className="px-6 py-4">Marca</th>
                <th className="px-6 py-4">Modelo</th>
                <th className="px-6 py-4">Tipo de Vehículo</th>
                <th className="px-6 py-4">Año</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                    HOM-2026-00{i}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    Chevrolet
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    NPR Reward
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    Camión
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    2026
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-accent hover:text-accent-dark font-semibold transition-colors">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
