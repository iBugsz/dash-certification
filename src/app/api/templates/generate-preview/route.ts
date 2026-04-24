import { NextResponse } from "next/server";
import { convertWordToPdf } from "@/lib/adobe/converter";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";

// Instancia fuera para reutilizar conexión
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { templateId, storagePath } = await request.json();

    if (!templateId || !storagePath) {
      return NextResponse.json({ error: "Faltan templateId o storagePath" }, { status: 400 });
    }

    // --- 1. DESCARGAR EL .DOCX DESDE EL STORAGE ---
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("templates")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error("❌ Error descarga:", downloadError);
      throw new Error(`Error descargando el archivo: ${downloadError?.message}`);
    }

    // --- 2. CONVERTIR CON ADOBE (Primero la acción que gasta créditos) ---
    console.log("⏳ Llamando a Adobe para previsualización...");
    const wordBuffer = Buffer.from(await fileData.arrayBuffer());
    const pdfResult = await convertWordToPdf(wordBuffer);

    // --- 3. TRATAMIENTO Y VALIDACIÓN DEL BUFFER ---
    let finalBuffer: Buffer;
    
    // Lógica robusta para detectar el Buffer del resultado de Adobe
    if (Buffer.isBuffer(pdfResult)) {
      finalBuffer = pdfResult;
    } else if (pdfResult && typeof (pdfResult as any).arrayBuffer === 'function') {
      finalBuffer = Buffer.from(await (pdfResult as any).arrayBuffer());
    } else if (pdfResult && typeof (pdfResult as any)[Symbol.asyncIterator] === 'function') {
      const chunks = [];
      for await (const chunk of (pdfResult as any)) { chunks.push(chunk); }
      finalBuffer = Buffer.concat(chunks);
    } else {
      finalBuffer = Buffer.from(pdfResult as any);
    }

    if (!finalBuffer || finalBuffer.length === 0) {
      throw new Error("Adobe devolvió un PDF vacío o inválido.");
    }

    // --- 4. SOLO SI TODO SALIÓ BIEN: REGISTRO DE USO ---
    // Si Adobe falló arriba, el código salta al catch y nunca llega aquí.
    console.log("✅ Adobe OK. Actualizando contador de uso...");
    const { error: rpcError } = await supabase.rpc("increment_adobe_usage");
    if (rpcError) console.warn("⚠️ Contador no actualizado, pero el PDF es válido:", rpcError);

    // --- 5. GUARDAR EL PDF EN PREVIEWS/ ---
    const previewPath = `previews/${templateId}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("templates")
      .upload(previewPath, new Uint8Array(finalBuffer), {
        contentType: "application/pdf",
        upsert: true, 
      });

    if (uploadError) {
      console.error("❌ Error Supabase Storage Upload:", uploadError);
      throw new Error(`Error subiendo preview: ${uploadError.message}`);
    }

    // --- 6. OBTENER URL PÚBLICA Y ACTUALIZAR TABLA ---
    const { data: urlData } = supabase.storage
      .from("templates")
      .getPublicUrl(previewPath);
    
    const { error: updateError } = await supabase
      .from("templates")
      .update({ 
        preview_url: urlData.publicUrl,
        has_preview: true 
      })
      .eq("id", templateId);

    if (updateError) {
      console.error("❌ Error DB Update:", updateError);
      throw new Error("Error actualizando la base de datos");
    }

    return NextResponse.json({ 
      success: true, 
      previewUrl: urlData.publicUrl 
    });
    
  } catch (error: any) {
    console.error("❌ Error crítico en generate-preview:", error);
    return NextResponse.json(
      { error: error.message || "Error interno en el servidor" }, 
      { status: 500 }
    );
  }
}