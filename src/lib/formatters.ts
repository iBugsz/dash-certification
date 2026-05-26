export const applyFormat = (value: any, format?: FieldFormat) => {
  if (value === null || value === undefined || value === "") return "";

  // Normalizamos el valor a string, reemplazando comas por puntos
  const strValue = String(value).replace(",", ".").trim();

  if (!format?.case || format.case === "none") return strValue;

  // 1. Formato de Texto
  if (
    ["uppercase", "lowercase", "capitalize", "sentence"].includes(format.case)
  ) {
    if (format.case === "uppercase") return strValue.toUpperCase();
    if (format.case === "lowercase") return strValue.toLowerCase();
    return strValue;
  }

  // 2. Formato de Número
  if (format.case === "rounded") {
    return Math.round(parseFloat(strValue)).toString();
  }

  // 3. Decimales (Truncar estrictamente mediante corte de texto)
  if (format.case.startsWith("decimal:")) {
    const dec = parseInt(format.case.split(":")[1]) || 0;

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
