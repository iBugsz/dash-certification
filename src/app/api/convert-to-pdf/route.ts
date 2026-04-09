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
      return NextResponse.json({ error: "No se recibió el archivo mapeado" }, { status: 400 });
    }

    // 1. Convertimos el archivo que generó tu sistema a Buffer
    const wordBuffer = Buffer.from(await file.arrayBuffer());

    // 2. Se lo pasamos al converter (que solo hará la conversión simple)
    const pdfBuffer = await convertWordToPdf(wordBuffer);

    await supabase.rpc("increment_adobe_usage");

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificado_mapeado_${Date.now()}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Error en convert-to-pdf:", error);
    return NextResponse.json({ error: error.message || "Error al convertir" }, { status: 500 });
  }
}