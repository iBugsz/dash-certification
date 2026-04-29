"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ImageOff } from "lucide-react";
import { ActivityLog } from "@/lib/activity/types";
import { entityIcons, actionStyles, actionIcons } from "@/lib/activity/config";
import { formatActivityAction } from "@/lib/activity/utils";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabaseClient";

interface ProfileEntry {
  full_name: string | null;
  avatar_url: string | null;
}

type ProfileMap = Record<string, ProfileEntry>;

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

interface RelativeResult {
  relative: string;
  showFull: boolean;
}

function getRelativeTime(date: Date): RelativeResult {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  if (diffSec < 10) return { relative: "justo ahora", showFull: false };
  if (diffSec < 60) return { relative: `hace ${diffSec}s`, showFull: false };
  if (diffMin < 60) return { relative: `hace ${diffMin}m`, showFull: false };
  if (diffHour < 24 && date >= todayStart)
    return { relative: `hace ${diffHour}h`, showFull: false };
  if (date >= yesterdayStart) return { relative: "ayer", showFull: false };

  return {
    relative: date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }),
    showFull: true,
  };
}

function RelativeTime({ date }: { date: Date }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const { relative, showFull } = getRelativeTime(date);

  if (showFull) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        <Calendar size={12} />
        {date.toLocaleDateString("es-CO")} a las{" "}
        {date.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    );
  }

  return (
    <span className="text-[11px] font-medium text-slate-400">{relative}</span>
  );
}

function ActivityRow({
  item,
  currentUser,
  currentDisplayName,
  currentInitials,
  currentAvatarUrl,
  profiles,
}: {
  item: ActivityLog;
  currentUser: any;
  currentDisplayName: string;
  currentInitials: string;
  currentAvatarUrl: string | null;
  profiles: ProfileMap;
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const ActionIcon = actionIcons[item.action_type];
  const styles = actionStyles[item.action_type];
  const date = new Date(item.created_at);

  const isMe = currentUser?.id === item.user_id;
  const profile = profiles[item.user_id];

  const nameToShow = isMe
    ? currentDisplayName
    : profile?.full_name || item.user_name?.split("@")[0] || "Sistema";

  const rowInitials = isMe
    ? currentInitials
    : nameToShow
        .split(/[\s@.]+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("");

  const rowAvatar = isMe ? currentAvatarUrl : profile?.avatar_url || null;
  const showAvatar = !!rowAvatar && !avatarFailed;

  let previewImage: string | null = null;
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
        for (const [key, value] of Object.entries(changes)) {
          if (key.includes("logo") || key.includes("image")) {
            if (typeof value === "object" && value !== null && "new" in value) {
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

  const isLogoChange = formatActivityAction(item).includes("logo");

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group flex items-start gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all"
    >
      <div className="relative shrink-0 mt-1">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 shadow-sm">
          {showAvatar ? (
            <img
              src={rowAvatar!}
              alt={nameToShow}
              className="w-full h-full object-cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
              }}
            >
              {rowInitials}
            </div>
          )}
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
            {nameToShow}
          </span>
          <span className="hidden sm:block text-slate-300 dark:text-slate-700">
            •
          </span>
          <RelativeTime date={date} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {formatActivityAction(item)
              .split(/(\*\*.*?\*\*|__.*?__)/g)
              .map((part, index) => {
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
}

export function ActivityLogList({ items }: { items: ActivityLog[] }) {
  const { initials, displayName, user, avatarUrl } = useUser();
  const [profiles, setProfiles] = useState<ProfileMap>({});

  useEffect(() => {
    if (!items?.length) return;

    const allIds = [...new Set(items.map((i) => i.user_id).filter(Boolean))];

    if (allIds.length === 0) return;

    supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", allIds)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error cargando profiles:", error.message);
          return;
        }
        if (!data) return;
        const map: ProfileMap = {};
        data.forEach((p) => {
          map[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
        });
        setProfiles(map);
      });
  }, [items]);

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
      {items.map((item) => (
        <ActivityRow
          key={item.id}
          item={item}
          currentUser={user}
          currentDisplayName={displayName}
          currentInitials={initials}
          currentAvatarUrl={avatarUrl}
          profiles={profiles}
        />
      ))}
    </div>
  );
}
