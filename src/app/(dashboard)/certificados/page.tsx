export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Resumen del sistema de homologación</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400">
            Estado del Sistema
          </p>
          <span className="text-green-500 font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />{' '}
            Operativo
          </span>
        </div>
      </header>
    </div>
  );
}
