import * as XLSX from "xlsx";
import { applyFormat } from "@/lib/formatters"; // Importamos el formateador

export async function extractExcelData(file: File, mapping: any) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const finalData: Record<string, any> = {};
  const missingInExcel: string[] = [];

  // mapping viene de Supabase: { "aa": { "cell": "C4", "sheet": "FTH", "format": {...} } }
  for (const variableWord in mapping) {
    const { cell, sheet: sheetName, format } = mapping[variableWord];

    // 1. Intentar acceder a la hoja
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      finalData[variableWord] = "";
      missingInExcel.push(`${variableWord} (Hoja "${sheetName}" no existe)`);
      continue;
    }

    // 2. Leer la celda
    const cellAddress = cell.toUpperCase();
    const desiredCell = worksheet[cellAddress];

    // 3. Extraer y formatear valor
    if (desiredCell && desiredCell.v !== undefined) {
      const rawValue = desiredCell.w || desiredCell.v;

      // Aplicamos el formato definido en Supabase
      finalData[variableWord] = applyFormat(rawValue, format);
    } else {
      finalData[variableWord] = "";
      missingInExcel.push(`${variableWord} (Celda ${cellAddress} vacía)`);
    }
  }

  return { finalData, missingInExcel };
}
