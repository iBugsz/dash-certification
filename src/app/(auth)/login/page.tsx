"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    // bg-[#F4F7FE] es tu color original. Agregué el fondo oscuro para dark mode.
    <div className="flex h-screen items-center justify-center bg-[#F4F7FE] dark:bg-[#12141f] transition-colors duration-300">
      {/* CORRECCIÓN: Eliminado 'border' y 'dark:border-white/5'. Solo queda bg-white y la sombra original. */}
      <div className="bg-white dark:bg-[#1a1d2e] p-8 rounded-[24px] shadow-md w-full max-w-sm transition-colors duration-300">
        {/* Logo / Título */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8633FF] to-[#5E17EB] mb-4">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          {/* text-gray-800 es original. Agregué blanco para dark mode. */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            AutoCert Pro
          </h1>
          {/* text-gray-500 es original. Agregué gris claro para dark mode. */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Inicia sesión para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            {/* text-gray-700 es original. Agregué gris claro para dark mode. */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              // Agregué dark:border-white/10, dark:text-white, bg-transparent y placeholder dark.
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8633FF] focus:border-transparent transition bg-transparent dark:text-white placeholder:dark:text-gray-500"
            />
          </div>

          <div>
            {/* text-gray-700 es original. Agregué gris claro para dark mode. */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                // Agregué dark:border-white/10, dark:text-white, bg-transparent y placeholder dark.
                className="w-full px-4 py-2.5 pr-11 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8633FF] focus:border-transparent transition bg-transparent dark:text-white placeholder:dark:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // text-gray-400 y text-gray-600 son originales. Agregué blanco para dark mode.
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            // bg-red-50, border-red-200, text-red-600 son originales. Agregué estilos dark.
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8633FF] to-[#5E17EB] text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
