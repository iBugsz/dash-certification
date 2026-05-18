"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  HomologationType,
  HomologationTypeFormData,
  EMPTY_HOMOLOGATION_FORM,
} from "@/lib/types/database";

const AVAILABLE_ICONS = [
  // Vehículos
  { name: "Truck", label: "Camión" },
  { name: "CarFront", label: "Carro" },
  { name: "Bus", label: "Bus" },
  { name: "Bike", label: "Moto" },
  { name: "Tractor", label: "Tractor" },
  { name: "TramFront", label: "Tranvía" },
  { name: "Ship", label: "Barco" },
  { name: "Plane", label: "Avión" },
  // Mecánica
  { name: "Wrench", label: "Llave" },
  { name: "Settings", label: "Ajustes" },
  { name: "Settings2", label: "Ajustes 2" },
  { name: "Gauge", label: "Velocímetro" },
  { name: "Hammer", label: "Martillo" },
  { name: "Drill", label: "Taladro" },
  { name: "Scissors", label: "Tijeras" },
  { name: "Ruler", label: "Regla" },
  // Eléctrico
  { name: "Zap", label: "Rayo" },
  { name: "Cpu", label: "CPU" },
  { name: "Circuit", label: "Circuito" },
  { name: "Battery", label: "Batería" },
  { name: "BatteryCharging", label: "Cargando" },
  { name: "Plug", label: "Enchufe" },
  { name: "Power", label: "Encender" },
  { name: "Radio", label: "Radio" },
  // Seguridad
  { name: "Shield", label: "Escudo" },
  { name: "ShieldCheck", label: "Escudo ok" },
  { name: "Lock", label: "Candado" },
  { name: "KeyRound", label: "Llave" },
  { name: "AlertTriangle", label: "Advertencia" },
  { name: "AlertCircle", label: "Alerta" },
  { name: "Ban", label: "Prohibido" },
  { name: "Siren", label: "Sirena" },
  // Industrial
  { name: "Package", label: "Paquete" },
  { name: "Layers", label: "Capas" },
  { name: "Box", label: "Caja" },
  { name: "Boxes", label: "Cajas" },
  { name: "Container", label: "Contenedor" },
  { name: "Warehouse", label: "Bodega" },
  { name: "Factory", label: "Fábrica" },
  { name: "Building2", label: "Edificio" },
  // Fluidos / Ambiente
  { name: "Flame", label: "Fuego" },
  { name: "Wind", label: "Viento" },
  { name: "Droplets", label: "Fluidos" },
  { name: "Thermometer", label: "Temperatura" },
  { name: "Snowflake", label: "Frío" },
  { name: "CloudRain", label: "Lluvia" },
  { name: "Waves", label: "Ondas" },
  { name: "Atom", label: "Átomo" },
  // Documentos
  { name: "FileText", label: "Documento" },
  { name: "FileBadge", label: "Certificado" },
  { name: "FileCheck", label: "Aprobado" },
  { name: "ClipboardList", label: "Lista" },
  { name: "ClipboardCheck", label: "Check" },
  { name: "BookOpen", label: "Manual" },
  { name: "Newspaper", label: "Informe" },
  { name: "Stamp", label: "Sello" },
  // Métricas
  { name: "BarChart2", label: "Barras" },
  { name: "LineChart", label: "Línea" },
  { name: "PieChart", label: "Circular" },
  { name: "TrendingUp", label: "Tendencia" },
  { name: "Scale", label: "Balanza" },
  { name: "Weight", label: "Peso" },
  { name: "Percent", label: "Porcentaje" },
  { name: "Calculator", label: "Calculadora" },
  // Otros
  { name: "Microscope", label: "Microscopio" },
  { name: "TestTube", label: "Laboratorio" },
  { name: "Radar", label: "Radar" },
  { name: "Satellite", label: "Satélite" },
  { name: "MapPin", label: "Ubicación" },
  { name: "Camera", label: "Cámara" },
  { name: "ScanLine", label: "Escanear" },
  { name: "FileQuestion", label: "Otros" },
];

const CATEGORIES = [
  { label: "Todos", filter: null },
  {
    label: "Vehículos",
    filter: [
      "Truck",
      "CarFront",
      "Bus",
      "Bike",
      "Tractor",
      "TramFront",
      "Ship",
      "Plane",
    ],
  },
  {
    label: "Mecánica",
    filter: [
      "Wrench",
      "Settings",
      "Settings2",
      "Gauge",
      "Hammer",
      "Drill",
      "Scissors",
      "Ruler",
    ],
  },
  {
    label: "Eléctrico",
    filter: [
      "Zap",
      "Cpu",
      "Circuit",
      "Battery",
      "BatteryCharging",
      "Plug",
      "Power",
      "Radio",
    ],
  },
  {
    label: "Seguridad",
    filter: [
      "Shield",
      "ShieldCheck",
      "Lock",
      "KeyRound",
      "AlertTriangle",
      "AlertCircle",
      "Ban",
      "Siren",
    ],
  },
  {
    label: "Industrial",
    filter: [
      "Package",
      "Layers",
      "Box",
      "Boxes",
      "Container",
      "Warehouse",
      "Factory",
      "Building2",
    ],
  },
  {
    label: "Fluidos",
    filter: [
      "Flame",
      "Wind",
      "Droplets",
      "Thermometer",
      "Snowflake",
      "CloudRain",
      "Waves",
      "Atom",
    ],
  },
  {
    label: "Documentos",
    filter: [
      "FileText",
      "FileBadge",
      "FileCheck",
      "ClipboardList",
      "ClipboardCheck",
      "BookOpen",
      "Newspaper",
      "Stamp",
    ],
  },
  {
    label: "Métricas",
    filter: [
      "BarChart2",
      "LineChart",
      "PieChart",
      "TrendingUp",
      "Scale",
      "Weight",
      "Percent",
      "Calculator",
    ],
  },
  {
    label: "Otros",
    filter: [
      "Microscope",
      "TestTube",
      "Radar",
      "Satellite",
      "MapPin",
      "Camera",
      "ScanLine",
      "FileQuestion",
    ],
  },
];

interface Props {
  editing: HomologationType | null;
  onClose: () => void;
  onSave: (
    form: HomologationTypeFormData,
    editing: HomologationType | null,
    onDone: () => void,
  ) => void;
}

export default function HomologationTypeModal({
  editing,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<HomologationTypeFormData>(
    EMPTY_HOMOLOGATION_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description ?? "",
        icon: editing.icon ?? "FileQuestion",
      });
    } else {
      setForm(EMPTY_HOMOLOGATION_FORM);
    }
    setSearch("");
    setActiveCategory(null);
  }, [editing]);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form, editing, () => {
      setSaving(false);
      onClose();
    });
  };

  const visibleIcons = AVAILABLE_ICONS.filter(({ name, label }) => {
    const matchesSearch =
      search === "" ||
      label.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !activeCategory ||
      CATEGORIES.find((c) => c.label === activeCategory)?.filter?.includes(
        name,
      );
    return matchesSearch && matchesCategory;
  });

  const selectedIconData = AVAILABLE_ICONS.find((i) => i.name === form.icon);
  const SelectedIcon = form.icon ? (LucideIcons as any)[form.icon] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {editing
              ? "Editar tipo de homologación"
              : "Nuevo tipo de homologación"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Nombre */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Carrocería, Motor, Frenos..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descripción opcional..."
              rows={2}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Selector de icono */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Icono
            </label>

            {/* Ícono seleccionado actualmente */}
            {SelectedIcon && (
              <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                <SelectedIcon
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {selectedIconData?.label ?? form.icon}
                </span>
              </div>
            )}

            {/* Buscador */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ícono..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2"
            />

            {/* Categorías */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() =>
                    setActiveCategory(cat.filter ? cat.label : null)
                  }
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${
                    (cat.filter === null && activeCategory === null) ||
                    activeCategory === cat.label
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid de íconos */}
            <div className="grid grid-cols-8 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {visibleIcons.length === 0 ? (
                <p className="col-span-8 text-center text-xs text-slate-400 py-4">
                  Sin resultados
                </p>
              ) : (
                visibleIcons.map(({ name, label }) => {
                  const Icon = (LucideIcons as any)[name];
                  const isSelected = form.icon === name;
                  return (
                    <div key={name} className="relative group">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, icon: name })}
                        className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all border-2 ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 scale-110 shadow-md"
                            : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-500"
                        }`}
                      >
                        {Icon && <Icon size={16} />}
                      </button>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {label}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            {saving
              ? "Guardando..."
              : editing
                ? "Guardar cambios"
                : "Crear tipo"}
          </button>
        </div>
      </div>
    </div>
  );
}
