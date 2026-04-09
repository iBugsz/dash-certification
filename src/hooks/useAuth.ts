"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- LÓGICA DE LOGIN ---
  const login = async (email: string, password: string) => {
    setError("");
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE LOGOUT ---
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.refresh();
      router.push("/login");
    } catch (err) {
      console.error("Error al salir:", err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    login, 
    logout, 
    loading, // Compartimos el estado de carga
    error,   // Compartimos los mensajes de error
    setError 
  };
}