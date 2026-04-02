import Sidebar from '@/components/ui/Sidebar';
import { Search, Bell, UserCircle } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Contenedor Principal */}
      <div className="flex-1 ml-72 flex flex-col">
        {/* Navbar Superior Blanco */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar certificados..."
              className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-purple-600 transition-colors">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">
                  Admin User
                </p>
                <p className="text-[11px] text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                  Super Administrador
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la Página con fondo difuminado */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
