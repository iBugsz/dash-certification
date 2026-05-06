import * as XLSX from "xlsx";

export async function extractExcelData(file: File, mapping: any) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const finalData: Record<string, any> = {};
  const missingInExcel: string[] = [];

  // mapping viene de Supabase: { "neme": { "cell": "C4", "sheet": "FTH" } }
  for (const variableWord in mapping) {
    const { cell, sheet: sheetName } = mapping[variableWord];

    // 1. Intentar acceder a la hoja
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      finalData[variableWord] = "";
      missingInExcel.push(`${variableWord} (Hoja "${sheetName}" no existe)`);
      continue;
    }

    // 2. Leer la celda (convertimos a mayúsculas por si acaso viene 'c4')
    const cellAddress = cell.toUpperCase();
    const desiredCell = worksheet[cellAddress];

    // 3. Extraer valor real
    if (desiredCell && desiredCell.v !== undefined) {
      finalData[variableWord] = desiredCell.v;
    } else {
      finalData[variableWord] = "";
      missingInExcel.push(`${variableWord} (Celda ${cellAddress} vacía)`);
    }
  }

  return { finalData, missingInExcel };
}
