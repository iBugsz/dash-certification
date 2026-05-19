import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();

  // Solución moderna usando @supabase/ssr en lugar de auth-helpers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // El manejador de rutas GET de Next.js a veces arroja errores al intentar
            // setear cookies si la respuesta ya empezó a enviarse. Se puede ignorar de forma segura aquí.
          }
        },
      },
    },
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const resolvedParams = await params;

  const { data, error } = await supabase
    .from("cad_blocks")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("user_id", user.id)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
