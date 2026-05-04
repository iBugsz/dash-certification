import { NextResponse } from "next/server";
import { BASE_CONTEXT, buildDynamicContext } from "@/lib/chat-context";

// ── Modelos en orden de prioridad ─────────────────────────────────────────
const MODELS = [
  "gemini-3.1-flash-lite-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

// ── Helpers ───────────────────────────────────────────────────────────────
function isQuotaError(data: any): boolean {
  const msg: string = data?.error?.message ?? "";
  return (
    msg.includes("quota") ||
    msg.includes("Quota") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    data?.error?.code === 429
  );
}

function isOverloadedError(data: any): boolean {
  const msg: string = data?.error?.message ?? "";
  return (
    msg.toLowerCase().includes("overloaded") ||
    msg.toLowerCase().includes("high demand") ||
    msg.toLowerCase().includes("try again later") ||
    data?.error?.code === 503
  );
}

async function tryModels(
  apiKey: string,
  body: object,
): Promise<{ data: any; model: string } | null> {
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (isQuotaError(data) || isOverloadedError(data)) {
        console.warn(
          `[chat] Modelo ${model} sin cuota o sobrecargado, probando siguiente...`,
        );
        continue;
      }

      return { data, model };
    } catch (err) {
      console.warn(`[chat] Error con modelo ${model}:`, err);
      continue;
    }
  }
  return null;
}

// ── Handler principal ─────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key no configurada" },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const prompt = (formData.get("prompt") as string) ?? "";
    const historyRaw = formData.get("history") as string;
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    // ── Construir partes del mensaje del usuario ───────────────────────────
    const userParts: any[] = [];

    if (file) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type || "application/octet-stream";

      if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
        // Imagen o PDF → inline data (Gemini lo procesa nativamente)
        userParts.push({ inlineData: { mimeType, data: base64 } });
      } else {
        // Otros archivos → texto plano
        const text = Buffer.from(bytes).toString("utf-8");
        userParts.push({ text: `[Archivo: ${file.name}]\n\n${text}` });
      }
    }

    if (prompt.trim()) {
      userParts.push({ text: prompt });
    }

    // Si no hay nada que enviar, responder con error
    if (userParts.length === 0) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    // ── Obtener contexto dinámico de Supabase (incluye app_name) ──────────
    const { systemContext, appName } = await buildDynamicContext({
      userId: userId ?? undefined,
    });
    const fullSystemContext = `${BASE_CONTEXT(appName)}\n\n${systemContext}`;

    // ── Armar cuerpo de la request a Gemini ───────────────────────────────
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: fullSystemContext }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Entendido. Tengo todos los datos actuales del sistema cargados y estoy listo para ayudarte.",
            },
          ],
        },
        // Historial de la conversación
        ...history,
        // Mensaje actual del usuario
        { role: "user", parts: userParts },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    };

    // ── Intentar con los modelos disponibles ───────────────────────────────
    const result = await tryModels(apiKey, requestBody);

    if (!result) {
      return NextResponse.json({ error: "quota" }, { status: 429 });
    }

    const { data, model } = result;

    if (data?.error) {
      console.error("[chat] Error de Gemini API:", data.error);
      return NextResponse.json(
        { error: data.error.message || "Error en Google API" },
        { status: 500 },
      );
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sin respuesta.";

    return NextResponse.json({ text, model });
  } catch (error: any) {
    console.error("[chat] Error interno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 },
    );
  }
}
