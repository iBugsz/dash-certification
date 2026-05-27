import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export function extractTagsFromDocx(buffer: ArrayBuffer): string[] {
  const zip = new PizZip(buffer);
  const doc = new Docxtemplater(zip);
  const text = doc.getFullText();

  // Regex para encontrar {variable}
  const regex = /\{([a-zA-Z0-9_]+)\}/g;
  const matches = [...text.matchAll(regex)];

  // Filtramos duplicados
  return [...new Set(matches.map((m) => m[1]))];
}
