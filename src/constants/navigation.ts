import {
  LayoutDashboard,
  History,
  FileStack,
  FileText,
  Building2,
  Book,
} from "lucide-react";

export const MENU_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Certificados", href: "/certificados", icon: FileStack },
  { name: "Catálogos", href: "/catalogos", icon: Book },
  { name: "Plantillas", href: "/plantillas", icon: FileText },
  { name: "Empresas", href: "/empresas", icon: Building2 },
  { name: "Actividad", href: "/actividad", icon: History },
  // Si mañana quieres agregar "Ajustes", solo lo pones aquí y listo.
];