import { supabase } from "@/lib/supabase";

/**
 * Convierte un Word a PDF. Devuelve null si el PDF no está disponible
 * (cuota de Adobe agotada, error del servidor, red, etc.).
 */
export async function convertToPdf(wordBlob: Blob): Promise<Blob | null> {
  try {
    const formData = new FormData();
    const fileToSend = new File([wordBlob], "final_document.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    formData.append("file", fileToSend);

    const response = await fetch("/api/convert-to-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) return null;

    const pdfBlob = await response.blob();
    if (pdfBlob.size === 0) return null;

    return pdfBlob;
  } catch (err) {
    console.warn("PDF no disponible:", err);
    return null;
  }
}