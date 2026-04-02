import { Card } from '@/components/ui/Card';
import { TrendingUp, FileCheck, AlertCircle, Building2 } from 'lucide-react';

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

      {/* Grid Superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Eficiencia de Generación">
          <div className="flex flex-col items-center py-4">
            <div className="relative h-32 w-32 flex items-center justify-center border-[10px] border-purple-100 rounded-full border-t-purple-600 rotate-45">
              <span className="text-3xl font-bold text-slate-800 -rotate-45">
                84%
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Certificados validados hoy
            </p>
          </div>
        </Card>

        <Card title="Estadísticas">
          <div className="space-y-4">
            <StatItem label="Empresas Activas" value="12" color="bg-blue-500" />
            <StatItem label="Plantillas Word" value="5" color="bg-purple-500" />
            <StatItem
              label="Certificados Mes"
              value="1,280"
              color="bg-emerald-500"
            />
            <StatItem label="Errores Excel" value="2" color="bg-red-500" />
          </div>
        </Card>

        <Card title="Uso de Almacenamiento (Supabase)">
          <div className="flex flex-col items-center py-4">
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={364}
                  strokeDashoffset={364 - 364 * 0.53}
                  className="text-purple-500"
                />
              </svg>
              <span className="absolute text-2xl font-bold">53%</span>
            </div>
            <p className="mt-4 text-sm text-slate-400 italic">
              Storage ocupado
            </p>
          </div>
        </Card>
      </div>

      {/* Listado de Últimas Acciones (Similar a la imagen) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Últimos Certificados Generados">
          <div className="divide-y divide-slate-100">
            {[
              {
                user: 'Transportes Global S.A.',
                desc: 'Camión Volvo FH16',
                date: 'Hace 5 min',
                amount: 'S/ 150.0',
              },
              {
                user: 'Logística del Norte',
                desc: 'Remolque de carga',
                date: 'Hace 12 min',
                amount: 'S/ 75.0',
              },
              {
                user: 'Inversiones S.R.L.',
                desc: 'Bus Interprovincial',
                date: 'Hace 1 hora',
                amount: 'S/ 210.0',
              },
            ].map((item, i) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${i === 0 ? 'bg-purple-500' : 'bg-slate-300'}`}
                  >
                    <FileCheck size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.user}</p>
                    <p className="text-xs text-slate-400">
                      {item.desc} • {item.date}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-700">{item.amount}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Pendientes de Homologación">
          <div className="flex items-center justify-center h-48 text-slate-300 flex-col">
            <Building2 size={48} className="mb-2 opacity-20" />
            <p>No hay solicitudes pendientes</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${color}`} />
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}
