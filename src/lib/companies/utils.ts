import { supabase } from "@/lib/supabaseClient";

export const getStoragePath = (url: string): string | null => {
  const marker = "/object/public/logos/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
};

export const deleteOldLogo = async (oldUrl: string | null) => {
  if (!oldUrl) return;
  const path = getStoragePath(oldUrl);
  if (!path) return;
  await supabase.storage.from("logos").remove([path]);
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
};