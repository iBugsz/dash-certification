import PizZip from "pizzip";
import * as Docxtemplater from "docxtemplater";
// @ts-ignore
import ImageModule from "docxtemplater-image-module-free";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

export async function generateWordDocument(
  templateUrl: string,
  mergedData: any,
) {
  const responseTemplate = await fetch(templateUrl);
  const content = await responseTemplate.arrayBuffer();
  const zip = new PizZip(content);

  const imageOptions = {
    centered: true,
    getImage: (tagValue: string) => {
      if (!tagValue) return null;
      try {
        const binaryString = window.atob(tagValue);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++)
          bytes[i] = binaryString.charCodeAt(i);
        return bytes.buffer;
      } catch (e) {
        return null;
      }
    },
    getSize: () => [540, 300], // Tamaño estándar optimizado
  };

  const imageModule = new ImageModule(imageOptions);
  const DocxtemplaterLib: any = (Docxtemplater as any).default || Docxtemplater;

  const doc = new DocxtemplaterLib(zip, {
    paragraphLoop: true,
    linebreaks: true,
    modules: [imageModule],
    parser: (tag: string) => ({
      get: (scope: any) => {
        const clean = tag
          .replace(/<[^>]+>/g, "")
          .replace(/[^a-zA-Z0-9]/g, "")
          .trim();
        return scope[clean];
      },
    }),
  });

  doc.render(mergedData);
  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.officedocument.wordprocessingml.document",
  });
}
