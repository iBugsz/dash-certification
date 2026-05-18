import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Función optimizada para crear el cliente de Supabase en el servidor
async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
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
            // El middleware se encarga de esto si falla aquí
          }
        },
      },
    },
  );
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // <--- Capturamos el ID si viene

    // CASO A: Si pides un bloque específico por ID (Para Copiar)
    if (id) {
      const { data, error } = await supabase
        .from("cad_blocks")
        .select("*") // Traemos TODO, incluyendo raw_vector_data
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error)
        return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json({ data });
    }

    // CASO B: Listado general (Para la tabla/galería)
    const q = searchParams.get("q");
    let query = supabase
      .from("cad_blocks")
      .select(
        "id, name, description, source_format, tags, thumbnail_svg, created_at",
      ) // Aquí puedes omitir el vector para que sea rápido
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (q) query = query.ilike("name", `%${q}%`);

    const { data, error } = await query;
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sesión expirada o no encontrada" },
        { status: 401 },
      );
    }

    const body = await req.json();

    if (!body.raw_vector_data?.trim()) {
      return NextResponse.json(
        { error: "Datos de vector vacíos" },
        { status: 422 },
      );
    }

    const { data, error } = await supabase
      .from("cad_blocks")
      .insert({
        user_id: user.id,
        name: body.name?.trim() || "Bloque sin nombre",
        description: body.description || null,
        raw_vector_data: body.raw_vector_data,
        source_format: body.source_format || "dxf",
        tags: body.tags || [],
        thumbnail_svg: body.thumbnail_svg || null,
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error en el servidor", details: err.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  const { error } = await supabase
    .from("cad_blocks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No auth" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  const body = await req.json();

  const { data, error } = await supabase
    .from("cad_blocks")
    .update(body)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
