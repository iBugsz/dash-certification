"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ImageOff } from "lucide-react";
import { ActivityLog } from "@/lib/activity/types";
import { entityIcons, actionStyles, actionIcons } from "@/lib/activity/config";
import { formatActivityAction } from "@/lib/activity/utils";

function PreviewImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);

  if (!src) return null;

  return failed ? (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3 text-slate-500 text-xs">
      <ImageOff size={16} />
      Imagen no encontrada
    </div>
  ) : (
    <img
      src={src}
      alt="Preview"
      onError={() => setFailed(true)}
      className="h-16 w-auto max-w-30 object-contain rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-1 shadow-sm"
    />
  );
}

export function ActivityLogList({ items }: { items: ActivityLog[] }) {
  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-full mb-4">
          <User size={40} className="opacity-20" />
        </div>
        <p className="text-sm font-medium">No hay registros en el historial</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-white/5">
      {items.map((item) => {
        const EntityIcon = entityIcons[item.entity_type] || entityIcons.DEFAULT;
        const ActionIcon = actionIcons[item.action_type];
        const styles = actionStyles[item.action_type];
        const displayName = item.user_name?.split("@")[0] || "Sistema";
        const date = new Date(item.created_at);

        // --- LÓGICA PARA EXTRAER LA IMAGEN ---
        let previewImage = null;
        if (item.details) {
          try {
            const changes =
              typeof item.details === "string"
                ? JSON.parse(item.details)
                : item.details;
            const imageField = changes.logo_url || changes.image;
            if (imageField?.new) {
              previewImage = imageField.new;
            } else if (typeof changes === "object" && changes !== null) {
              // Buscar cualquier campo que contenga logo o image
              for (const [key, value] of Object.entries(changes)) {
                if (key.includes("logo") || key.includes("image")) {
                  if (
                    typeof value === "object" &&
                    value !== null &&
                    "new" in value
                  ) {
                    previewImage = (value as any).new;
                  } else if (typeof value === "string") {
                    previewImage = value;
                  }
                  break;
                }
              }
            }
          } catch (e) {
            console.error(e);
          }
        }

        // Verificar si el mensaje es sobre añadir o cambiar logo
        const isLogoChange = formatActivityAction(item).includes("logo");

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group flex items-start gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all"
          >
            <div className="relative shrink-0 mt-1">
              <div
                className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${styles}`}
              >
                <EntityIcon size={22} />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-lg border-2 border-white dark:border-[#0c0c0e] flex items-center justify-center shadow-sm ${styles}`}
              >
                <ActionIcon size={12} strokeWidth={3} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize font-poppins">
                  {displayName}
                </span>
                <span className="hidden sm:block text-slate-300 dark:text-slate-700">
                  •
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Calendar size={12} />
                  {date.toLocaleDateString("es-CO")} a las{" "}
                  {date.toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {formatActivityAction(item)
                    // Esta regex divide el texto manteniendo los separadores ** y __
                    .split(/(\*\*.*?\*\*|__.*?__)/g)
                    .map((part, index) => {
                      // Caso 1: CORREOS (**texto**)
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <span
                            key={index}
                            className="text-blue-600 dark:text-blue-400 underline font-medium"
                          >
                            {part.replace(/\*\*/g, "")}
                          </span>
                        );
                      }
                      // Caso 2: DATOS IMPORTANTES (__texto__)
                      if (part.startsWith("__") && part.endsWith("__")) {
                        return (
                          <span
                            key={index}
                            className="text-slate-900 dark:text-slate-100 font-bold px-1 bg-slate-100 dark:bg-white/5 rounded mx-0.5"
                          >
                            {part.replace(/__/g, "")}
                          </span>
                        );
                      }
                      // Caso 3: TEXTO NORMAL
                      return part;
                    })}
                </p>

                {previewImage && isLogoChange && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1"
                  >
                    <PreviewImage src={previewImage} />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
