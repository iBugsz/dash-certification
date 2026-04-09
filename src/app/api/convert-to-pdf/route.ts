import { NextResponse } from "next/server";
import { convertWordToPdf } from "@/lib/adobe/converter";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Inicializamos Supabase DENTRO del POST. 
    // Así solo se ejecuta cuando alguien realmente llama a la API.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió el archivo mapeado" }, { status: 400 });
    }

    // 2. Convertimos el archivo que generó tu sistema a Buffer
    const wordBuffer = Buffer.from(await file.arrayBuffer());

    // 3. Se lo pasamos al converter
    const pdfBuffer = await convertWordToPdf(wordBuffer);

    // 4. Registramos el uso (RPC o insert)
    await supabase.rpc("increment_adobe_usage");

    // 5. Retornamos el PDF usando Uint8Array para evitar el error de tipos
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificado_mapeado_${Date.now()}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Error en convert-to-pdf:", error);
    return NextResponse.json(
      { error: error.message || "Error al convertir" }, 
      { status: 500 }
    );
  }
}