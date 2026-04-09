import { NextResponse } from "next/server";
import { convertWordToPdf } from "@/lib/adobe/converter";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variables de entorno de Supabase no configuradas");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { templateId, storagePath } = await request.json();

    if (!templateId || !storagePath) {
      return NextResponse.json(
        { error: "Faltan templateId o storagePath" },
        { status: 400 }
      );
    }

    // --- 1. COBRAMOS POR ADELANTADO ---
    // Registramos el uso antes de la conversión pesada por si hay timeout en la conexión
    await supabase.rpc("increment_adobe_usage");

    // --- 2. DESCARGAR EL .DOCX DESDE EL STORAGE ---
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("templates")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error("❌ Error descarga:", downloadError);
      throw new Error(`Error descargando el archivo: ${downloadError?.message}`);
    }

    // --- 3. CONVERTIR CON ADOBE ---
    const wordBuffer = Buffer.from(await fileData.arrayBuffer());
    const pdfResult = await convertWordToPdf(wordBuffer);

    // --- 4. TRATAMIENTO DEL BUFFER (Solución al TypeError) ---
    let finalBuffer: Buffer;
    
    if (Buffer.isBuffer(pdfResult)) {
      // Si ya es un Buffer de Node.js
      finalBuffer = pdfResult;
    } else if (pdfResult && typeof pdfResult.arrayBuffer === 'function') {
      // Si es un objeto tipo Blob o File
      finalBuffer = Buffer.from(await pdfResult.arrayBuffer());
    } else if (pdfResult && typeof pdfResult[Symbol.asyncIterator] === 'function') {
      // Si es un ReadableStream (común en la SDK de Adobe para Node)
      const chunks = [];
      for await (const chunk of pdfResult) {
        chunks.push(chunk);
      }
      finalBuffer = Buffer.concat(chunks);
    } else {
      // Caso de respaldo si ya es un Uint8Array o similar
      finalBuffer = Buffer.from(pdfResult);
    }

    // --- 5. GUARDAR EL PDF EN PREVIEWS/ ---
    const previewPath = `previews/${templateId}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("templates")
      .upload(previewPath, finalBuffer, {
        contentType: "application/pdf",
        upsert: true, 
      });

    if (uploadError) {
      console.error("❌ DETALLE ERROR SUPABASE STORAGE:", uploadError);
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
        has_preview: true // <--- AGREGAMOS ESTO PARA QUE CAMBIE A TRUE
      })
      .eq("id", templateId);

    if (updateError) {
      console.error("❌ Error DB Update:", updateError);
      throw new Error("Error actualizando la base de datos");
    }

    console.log("✅ Preview generada y guardada con éxito para template:", templateId);
    
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