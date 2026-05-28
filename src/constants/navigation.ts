import {
  LayoutDashboard,
  History,
  FileStack,
  FileText,
  Building2,
  Book,
  Layers,
  ScanText,
  ClipboardList,
} from "lucide-react";

export const MENU_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Certificados", href: "/certificados", icon: FileStack },
  { name: "Extracción IA", href: "/extraccion-datos", icon: ScanText },
  { name: "Catálogos", href: "/catalogos", icon: Book },
  { name: "Plantillas", href: "/plantillas", icon: FileText },
  { name: "Empresas", href: "/empresas", icon: Building2 },
  { name: "Actividad", href: "/actividad", icon: History },
  { name: "Homologaciones", href: "/homologaciones", icon: History },
  { name: "Bloques CAD", href: "/bloques-cad", icon: Layers },
];
