import { MappingField } from "@/lib/types/database";

export const applyFormat = (value: any, format?: MappingField["format"]) => {
  if (value === null || value === undefined || value === "") return "";

  // Normalizamos el valor a string, reemplazando comas por puntos
  const strValue = String(value).replace(",", ".").trim();

  // Accedemos a format.case de forma segura
  const caseType = format?.case;

  if (!caseType || caseType === "none") return strValue;

  // 1. Formato de Texto
  if (["uppercase", "lowercase", "capitalize", "sentence"].includes(caseType)) {
    if (caseType === "uppercase") return strValue.toUpperCase();
    if (caseType === "lowercase") return strValue.toLowerCase();

    // Capitalize: Primera letra de cada palabra en mayúscula
    if (caseType === "capitalize") {
      return strValue
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Sentence: Solo la primera letra de la cadena en mayúscula
    if (caseType === "sentence") {
      return strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase();
    }
  }

  // 2. Formato de Número
  if (caseType === "rounded") {
    return Math.round(parseFloat(strValue)).toString();
  }

  // 3. Decimales (Truncar estrictamente mediante corte de texto)
  if (caseType.startsWith("decimal:")) {
    const dec = parseInt(caseType.split(":")[1]) || 0;

    // Si no tiene punto decimal, tratamos como entero y rellenamos si es necesario
    if (!strValue.includes(".")) {
      return dec > 0 ? `${strValue}.${"0".repeat(dec)}` : strValue;
    }

    const [entero, decimales] = strValue.split(".");

    if (dec === 0) return entero;

    // Cortamos los decimales al número de dígitos pedidos
    const decimalesCortados = decimales.substring(0, dec);

    // Unimos con el punto y rellenamos ceros si la longitud es menor a la pedida
    return `${entero}.${decimalesCortados.padEnd(dec, "0")}`;
  }

  return strValue;
};
