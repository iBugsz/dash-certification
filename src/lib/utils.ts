import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActivityLog } from "./types/activity";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatActivityAction(
  item: ActivityLog,
  isShort: boolean = false,
): string {
  const entityMap: Record<string, string> = {
    TEMPLATE: "la plantilla",
    COMPANY: "la empresa",
    CERTIFICATE: "el certificado",
  };

  const fieldMap: Record<string, string> = {
    name: "el nombre",
    email: "el correo",
    phone: "el teléfono",
    address: "la dirección",
    nit: "el NIT",
    logo_url: "el logo",
    image: "la imagen",
  };

  const entityType = entityMap[item.entity_type] || "el registro";
  const entityName = item.entity_name ? `__${item.entity_name}__` : "";

  if (item.action_type === "UPDATE" && item.details) {
    try {
      const changes =
        typeof item.details === "string"
          ? JSON.parse(item.details)
          : item.details;
      const fields = Array.isArray(changes) ? [] : Object.keys(changes);

      const isLogoField = (field: string) => /logo|image/i.test(field);
      const isImageValue = (value: unknown): boolean =>
        typeof value === "string" &&
        (value.startsWith("data:") ||
          value.startsWith("http") ||
          value.startsWith("/") ||
          value.length > 100);
      const normalizeValue = (value: unknown): string =>
        isImageValue(value)
          ? "la imagen"
          : value === undefined || value === null || value === ""
            ? "vacío"
            : String(value);
      const isEmptyValue = (value: unknown): boolean =>
        value === undefined ||
        value === null ||
        value === "" ||
        value === "vacío" ||
        value === "null";

      if (fields.length > 0) {
        if (isShort && fields.length > 1) {
          const fieldNames = fields.map((f) => fieldMap[f] || f);
          const lastField = fieldNames.pop();
          const listText =
            fieldNames.length > 0
              ? `${fieldNames.join(", ")} y ${lastField}`
              : lastField;

          return `Actualizó ${listText} de ${entityType} ${entityName}`;
        }

        const descriptions = fields.map((fieldKey) => {
          const rawData = changes[fieldKey];
          const data =
            typeof rawData === "object" && rawData !== null
              ? (rawData as { old?: unknown; new?: unknown })
              : { old: undefined, new: rawData };
          const humanField = fieldMap[fieldKey] || fieldKey;

          if (isLogoField(fieldKey)) {
            return "el logo";
          }

          const oldVal = normalizeValue(data.old);
          const newVal = normalizeValue(data.new);

          if (fieldKey === "email") {
            return `el correo de **${oldVal}** por **${newVal}**`;
          }
          if (fieldKey === "name") {
            return `el nombre de __${oldVal}__ por __${newVal}__`;
          }
          return `${humanField} de "${oldVal}" por "${newVal}"`;
        });

        if (fields.length > 1) {
          return `Actualizó ${descriptions.join(" y ")} de ${entityType} ${entityName}`;
        }

        const fieldKey = fields[0];
        const rawData = changes[fieldKey];
        const data =
          typeof rawData === "object" && rawData !== null
            ? (rawData as { old?: unknown; new?: unknown })
            : { old: undefined, new: rawData };
        const humanField = fieldMap[fieldKey] || fieldKey;
        const oldVal = normalizeValue(data.old);
        const newVal = normalizeValue(data.new);

        if (isLogoField(fieldKey)) {
          return isEmptyValue(data.old)
            ? `Añadió el logo a ${entityType} ${entityName}`
            : `Cambió el logo de ${entityType} ${entityName}`;
        }

        if (fieldKey === "email") {
          return isEmptyValue(data.old)
            ? `Añadió el correo **${newVal}** a ${entityType} ${entityName}`
            : `Cambió el correo **${oldVal}** por **${newVal}** de ${entityType} ${entityName}`;
        }

        if (fieldKey === "name") {
          return `Renombró ${entityType} de __${oldVal}__ a __${newVal}__`;
        }

        return `Cambió ${humanField} de "${oldVal}" por "${newVal}" en ${entityType} ${entityName}`;
      }
    } catch {
      return `Actualizó datos de ${entityType} ${entityName}`;
    }
  }

  const actions: Record<string, string> = {
    CREATE: "Creó",
    DELETE: "Eliminó",
    GENERATE: "Generó",
  };
  return `${actions[item.action_type] || "Acción en"} ${entityType} ${entityName}`;
}

// ─── UTILIDADES DE FORMATO GLOBAL ─────────────────────────────────────────────

/**
 * Formatea bytes a un formato legible (KB, MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Formatea fechas al estándar de Colombia
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "Sin fecha";
  return new Date(dateStr).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (name: string): string => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

/**
 * Extrae el path del Storage de una URL pública de Supabase
 */
export const getStoragePath = (url: string): string | null => {
  const marker = "/object/public/logos/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
};

/**
 * Formatea bytes a un formato legible (B, KB, MB, GB)
 * Esta versión reemplaza a formatFileSize por ser más completa.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calcula el porcentaje de uso (máximo 100)
 * Útil para barras de progreso en el Dashboard.
 */
export function pct(used: number, limit: number): number {
  if (limit === 0) return 0;
  const percent = Math.min((used / limit) * 100, 100);
  return percent < 1 ? Math.round(percent * 10) / 10 : Math.round(percent);
}
