import { ActivityLog } from "./types";

export function formatActivityAction(item: ActivityLog, isShort: boolean = false): string {
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
    image: "la imagen"
  };

  const entityType = entityMap[item.entity_type] || "el registro";
  const entityName = item.entity_name ? `__${item.entity_name}__` : "";

  if (item.action_type === "UPDATE" && item.details) {
    try {
      const changes = typeof item.details === 'string' ? JSON.parse(item.details) : item.details;
      const fields = Array.isArray(changes) ? [] : Object.keys(changes);

      const isLogoField = (field: string) => /logo|image/i.test(field);
      const isImageValue = (value: unknown): boolean =>
        typeof value === 'string' &&
        (value.startsWith('data:') || value.startsWith('http') || value.startsWith('/') || value.length > 100);
      const normalizeValue = (value: unknown): string =>
        isImageValue(value) ? 'la imagen' : value === undefined || value === null || value === '' ? 'vacío' : String(value);
      const isEmptyValue = (value: unknown): boolean =>
        value === undefined ||
        value === null ||
        value === '' ||
        value === 'vacío' ||
        value === 'null';

      if (fields.length > 0) {
        if (isShort && fields.length > 1) {
          const fieldNames = fields.map(f => fieldMap[f] || f);
          const lastField = fieldNames.pop();
          const listText = fieldNames.length > 0 ? `${fieldNames.join(', ')} y ${lastField}` : lastField;

          return `Actualizó ${listText} de ${entityType} ${entityName}`;
        }

        const descriptions = fields.map(fieldKey => {
          const rawData = changes[fieldKey];
          const data = typeof rawData === 'object' && rawData !== null ? rawData as { old?: unknown; new?: unknown } : { old: undefined, new: rawData };
          const humanField = fieldMap[fieldKey] || fieldKey;

          if (isLogoField(fieldKey)) {
            return 'el logo';
          }

          const oldVal = normalizeValue(data.old);
          const newVal = normalizeValue(data.new);

          if (fieldKey === 'email') {
            return `el correo de **${oldVal}** por **${newVal}**`;
          }
          if (fieldKey === 'name') {
            return `el nombre de __${oldVal}__ por __${newVal}__`;
          }
          return `${humanField} de "${oldVal}" por "${newVal}"`;
        });

        if (fields.length > 1) {
          return `Actualizó ${descriptions.join(' y ')} de ${entityType} ${entityName}`;
        }

        const fieldKey = fields[0];
        const rawData = changes[fieldKey];
        const data = typeof rawData === 'object' && rawData !== null ? rawData as { old?: unknown; new?: unknown } : { old: undefined, new: rawData };
        const humanField = fieldMap[fieldKey] || fieldKey;
        const oldVal = normalizeValue(data.old);
        const newVal = normalizeValue(data.new);

        if (isLogoField(fieldKey)) {
          return isEmptyValue(data.old)
            ? `Añadió el logo a ${entityType} ${entityName}`
            : `Cambió el logo de ${entityType} ${entityName}`;
        }

        if (fieldKey === 'email') {
          return isEmptyValue(data.old)
            ? `Añadió el correo **${newVal}** a ${entityType} ${entityName}`
            : `Cambió el correo **${oldVal}** por **${newVal}** de ${entityType} ${entityName}`;
        }

        if (fieldKey === 'name') {
          return `Renombró ${entityType} de __${oldVal}__ a __${newVal}__`;
        }

        return `Cambió ${humanField} de "${oldVal}" por "${newVal}" en ${entityType} ${entityName}`;
      }
    } catch {
      return `Actualizó datos de ${entityType} ${entityName}`;
    }
  }

  const actions: Record<string, string> = { CREATE: "Creó", DELETE: "Eliminó", GENERATE: "Generó" };
  return `${actions[item.action_type] || "Acción en"} ${entityType} ${entityName}`;
}