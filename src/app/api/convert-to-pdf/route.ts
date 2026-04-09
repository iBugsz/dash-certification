import { NextResponse } from "next/server";
import { convertWordToPdf } from "@/lib/adobe/converter";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió el archivo" }, { status: 400 });
    }

    const wordBuffer = Buffer.from(await file.arrayBuffer());

    // 1. Intentamos la conversión primero
    console.log("⏳ Llamando a Adobe...");
    const pdfBuffer = await convertWordToPdf(wordBuffer);

    // 2. Si llegamos aquí, Adobe NO falló. 
    // Ahora validamos que el buffer tenga contenido real.
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Adobe devolvió un PDF vacío.");
    }

    // 3. SOLO SI LA CONVERSIÓN FUE EXITOSA, aumentamos el contador
    console.log("✅ Conversión exitosa, actualizando Supabase...");
    const { error: rpcError } = await supabase.rpc("increment_adobe_usage");
    
    if (rpcError) {
      console.warn("⚠️ El PDF se hizo pero no se pudo subir el contador:", rpcError);
      // Opcional: No lanzamos error para que el usuario al menos reciba su PDF
    }

    // 4. Enviamos la respuesta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificado_${Date.now()}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("❌ Error crítico en convert-to-pdf:", error);
    // Si entra aquí, Supabase NUNCA se enteró, por lo tanto no sube el contador.
    return NextResponse.json({ 
      error: "Error en el servidor de PDF", 
      details: error.message 
    }, { status: 500 });
  }
}