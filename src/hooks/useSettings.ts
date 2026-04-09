"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabaseClient";

type Toast = { type: "success" | "error"; msg: string } | null;

export function useSettings() {
  const [toast, setToast] = useState<Toast>(null);
  const showToast = (type: "success" | "error", msg: string) =>
    setToast({ type, msg });

  /* ── usuario ── */
  const [loadingUser, setLoadingUser] = useState(true);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  /* ── contraseña ── */
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  /* ── tema ── */
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ── notificaciones ── */
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifGeneracion, setNotifGeneracion] = useState(true);
  const [notifErrores, setNotifErrores] = useState(false);

  /* ── avatar ── */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── cargar usuario ── */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      setEmail(data.user.email ?? "");
      setFullName(
        data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          ""
      );
      setAvatarUrl(data.user.user_metadata?.avatar_url ?? null);
      setLoadingUser(false);
    });
  }, []);

  /* ── guardar perfil ── */
  async function saveProfile() {
  setSavingProfile(true);
  
  try {
    // 1. Obtener los datos actuales del usuario antes de actualizar
    const { data: { user } } = await supabase.auth.getUser();
    const oldAvatarUrl = user?.user_metadata?.avatar_url;

    // 2. Lógica de limpieza del Storage de Supabase
    // Solo intentamos borrar si:
    // - La URL vieja existía.
    // - La URL vieja contenía "logos" (indicando que es de nuestro Storage).
    // - La URL nueva es distinta a la vieja.
    if (
      oldAvatarUrl && 
      oldAvatarUrl.includes("logos") && 
      oldAvatarUrl !== avatarUrl
    ) {
      // Extraemos la ruta del archivo. 
      // Si la URL es: .../logos/avatars/user123-12345.png
      // El path para borrar es: avatars/user123-12345.png
      const pathToRemove = oldAvatarUrl.split("logos/")[1];
      
      if (pathToRemove) {
        // Ejecutamos la eliminación en el Storage
        const { error: storageError } = await supabase.storage
          .from("logos")
          .remove([pathToRemove]);
          
        if (storageError) {
          console.error("Error limpiando archivo antiguo:", storageError.message);
          // No lanzamos error aquí para no bloquear el guardado del perfil
        }
      }
    }

    // 3. Preparar la actualización en Auth
    const updates: any = { 
      data: { 
        full_name: fullName,
        avatar_url: avatarUrl // El nuevo link (sea de internet o el nuevo de supabase)
      } 
    };
    
    // Si el email cambió, lo incluimos
    if (email !== user?.email) {
      updates.email = email;
    }

    // 4. Guardar cambios en Supabase Auth
    const { error } = await supabase.auth.updateUser(updates);
    
    if (error) throw error;

    showToast("success", "Perfil actualizado correctamente");
    
  } catch (error: any) {
    showToast("error", error.message || "Error al guardar el perfil");
  } finally {
    setSavingProfile(false);
  }
}
  /* ── cambiar contraseña ── */
  async function savePassword() {
    if (!newPw || newPw.length < 6) {
      showToast("error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPw !== confirmPw) {
      showToast("error", "Las contraseñas no coinciden");
      return;
    }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSavingPw(false);
    if (error) showToast("error", error.message);
    else {
      showToast("success", "Contraseña actualizada");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }
  }

  /* ── avatar ── */
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file || !userId) return;
  setUploadingAvatar(true);

  try {
    // 1. Identificar si el avatar actual es un archivo de Supabase para borrarlo
    // Si la URL contiene "logos", es un archivo nuestro
    const isInternal = avatarUrl?.includes("logos");
    
    // Generamos un nombre único para evitar problemas de caché del navegador
    const ext = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${ext}`;
    const path = `avatars/${fileName}`;

    // 2. Subir nuevo archivo
    const { error: upErr } = await supabase.storage
      .from("logos")
      .upload(path, file);

    if (upErr) throw upErr;

    // 3. Obtener URL pública
    const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
    const newUrl = urlData.publicUrl;

    // 4. Actualizar metadata del usuario
    await supabase.auth.updateUser({ data: { avatar_url: newUrl } });
    
    // 5. LIMPIEZA: Si había una imagen anterior en Supabase, la borramos
    if (isInternal && avatarUrl) {
      const oldPath = avatarUrl.split("logos/")[1];
      if (oldPath) {
        await supabase.storage.from("logos").remove([oldPath]);
      }
    }

    setAvatarUrl(newUrl);
    showToast("success", "Foto de perfil actualizada");
  } catch (error: any) {
    showToast("error", error.message || "Error al actualizar imagen");
  } finally {
    setUploadingAvatar(false);
  }
}
  /* ── derivados ── */
  const initials = (fullName || email)
    .split(/[\s@.]+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  const pwStrength = (() => {
    if (!newPw) return 0;
    let s = 0;
    if (newPw.length >= 8) s++;
    if (/[A-Z]/.test(newPw)) s++;
    if (/[0-9]/.test(newPw)) s++;
    if (/[^A-Za-z0-9]/.test(newPw)) s++;
    return s;
  })();

  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"][pwStrength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-emerald-400",
  ][pwStrength];

  return {
    /* toast */
    toast,
    setToast,
    showToast,
    /* usuario */
    loadingUser,
    userId,
    fullName,
    setFullName,
    email,
    setEmail,
    savingProfile,
    saveProfile,
    /* contraseña */
    currentPw,
    setCurrentPw,
    newPw,
    setNewPw,
    confirmPw,
    setConfirmPw,
    showCurrent,
    setShowCurrent,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
    savingPw,
    savePassword,
    /* tema */
    theme,
    setTheme,
    mounted,
    /* notificaciones */
    notifEmail,
    setNotifEmail,
    notifGeneracion,
    setNotifGeneracion,
    notifErrores,
    setNotifErrores,
    /* avatar */
    avatarUrl,
    setAvatarUrl,
    uploadingAvatar,
    fileRef,
    handleAvatarChange,
    /* derivados */
    initials,
    pwStrength,
    strengthLabel,
    strengthColor,
  };
}