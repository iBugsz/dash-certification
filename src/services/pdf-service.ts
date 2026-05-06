import { supabase } from "@/lib/supabase";

export async function convertToPdf(wordBlob: Blob) {
  const formData = new FormData();
  const fileToSend = new File([wordBlob], "final_document.docx", {
    type: "application/vnd.officedocument.wordprocessingml.document",
  });
  formData.append("file", fileToSend);

  const response = await fetch("/api/convert-to-pdf", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Error en la conversión a PDF");

  const pdfBlob = await response.blob();

  // Registrar métrica en background
  supabase.rpc("record_generation").then(({ error }) => {
    if (error) console.warn("Métrica no registrada", error);
  });

  return pdfBlob;
}
