'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileStack,
  FileText,
  Users,
  Settings,
  Car,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Certificados', href: '/certificados', icon: FileStack },
  { name: 'Plantillas', href: '/plantillas', icon: FileText },
  { name: 'Empresas', href: '/empresas', icon: Users },
  { name: 'Configuración', href: '/configuration', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    /* Gradiente de morado oscuro a morado más claro */
    <aside className="w-54 bg-gradient-to-b from-[#2D0B5A] to-[#6D28D9] h-screen text-white fixed left-0 top-0 z-50 overflow-hidden">
      {/* Círculo decorativo opaco en el fondo superior */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-5 right-5 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />

      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Car size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">AutoCert</span>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="px-6 mb-6">
        <div className="border-t border-white/10" />
      </div>

      <nav className="px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon
                size={20}
                className={isActive ? 'text-white' : 'text-white/60'}
              />
              <span
                className={`text-[15px] ${isActive ? 'font-bold' : 'font-medium'}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
