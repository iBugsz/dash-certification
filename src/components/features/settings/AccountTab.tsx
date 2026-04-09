"use client";

import { Copy, LogOut, Trash2, Loader2 } from "lucide-react";
import { PasswordSection } from "./PasswordSection";
import { useAuth } from "@/hooks/useAuth"; // Importación correcta

export function AccountTab({ s }: { s: any }) {
  // Usamos 'loading' que es como lo definiste en tu useAuth
  const { logout, loading: isLoggingOut } = useAuth();

  const copyUserId = () => {
    if (!s.userId) return;
    navigator.clipboard.writeText(s.userId);
    if (s.showToast) s.showToast("success", "ID copiado al portapapeles");
  };

  return (
    <div className="space-y-10">
      {/* SECCIÓN CUENTA */}
      <section>
        <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          Cuenta
        </h3>

        <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
          {/* Fila: Cerrar Sesión */}
          <div className="flex items-center justify-between py-5">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Sesión activa
              </p>
              <p className="text-xs text-slate-500">
                Cerrar tu sesión actual en este dispositivo.
              </p>
            </div>
            <button
              className={`px-4 py-2 cursor-pointer text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 ${
                isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={logout} // Conectado a la función del hook
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogOut size={14} />
              )}
              {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>
          </div>

          {/* Fila: ID de Usuario */}
          <div className="flex items-center justify-between py-5">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                ID de organización
              </p>
              <p className="text-xs text-slate-500">
                Tu identificador único de usuario.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <code className="text-[11px] font-mono text-slate-500">
                {s.userId || "No disponible"}
              </code>
              <button
                onClick={copyUserId}
                className="text-slate-400 hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          {/* Fila: Zona de Peligro */}
          <div className="flex items-center justify-between py-5">
            <div>
              <p className="text-sm font-medium text-red-600">
                Eliminar cuenta
              </p>
              <p className="text-xs text-slate-500">
                Borrar permanentemente tu perfil y todos tus datos.
              </p>
            </div>
            <button className="px-4 py-2 cursor-pointer text-sm font-medium bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-100 dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2">
              <Trash2 size={14} /> Eliminar cuenta
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN SEGURIDAD (PASSWORD) */}
      <section className="pt-4">
        <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          Seguridad
        </h3>
        <PasswordSection
          currentPw={s.currentPw}
          setCurrentPw={s.setCurrentPw}
          newPw={s.newPw}
          setNewPw={s.setNewPw}
          confirmPw={s.confirmPw}
          setConfirmPw={s.setConfirmPw}
          showCurrent={s.showCurrent}
          setShowCurrent={s.setShowCurrent}
          showNew={s.showNew}
          setShowNew={s.setShowNew}
          showConfirm={s.showConfirm}
          setShowConfirm={s.setShowConfirm}
          savingPw={s.savingPw}
          pwStrength={s.pwStrength}
          strengthLabel={s.strengthLabel}
          strengthColor={s.strengthColor}
          onSave={s.savePassword}
        />
      </section>
    </div>
  );
}
