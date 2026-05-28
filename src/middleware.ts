import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete({ name, ...options });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // RUTAS PROTEGIDAS (Las que están dentro de (dashboard))
  // Agrega aquí todas las que aparecen en tu sidebar
  const protectedRoutes = [
    "/dashboard",
    "/certificados",
    "/catalogos",
    "/plantillas",
    "/empresas",
    "/settings",
    "/actividad",
    "/bloques-cad",
    "/extraccion-datos",
    "/homologaciones",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // 1. SI NO HAY SESIÓN y trata de entrar a una ruta protegida -> al Login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. SI HAY SESIÓN y trata de ir al login -> al Dashboard
  if (session && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Incluye todas las rutas de tu sidebar aquí para que el middleware las vigile
     */
    "/dashboard/:path*",
    "/certificados/:path*",
    "/catalogos/:path*",
    "/plantillas/:path*",
    "/empresas/:path*",
    "/settings/:path*",
    "/login",
  ],
};
