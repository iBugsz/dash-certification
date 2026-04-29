"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ImageOff } from "lucide-react";
import { ActivityLog } from "@/lib/activity/types";
import { entityIcons, actionStyles } from "@/lib/activity/config";
import { formatActivityAction } from "@/lib/activity/utils";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabaseClient";

interface ProfileEntry {
  full_name: string | null;
  avatar_url: string | null;
}

type ProfileMap = Record<string, ProfileEntry>;

interface RelativeTimeResult {
  relative: string;
  showFull: boolean;
}

function getRelativeTime(date: Date): RelativeTimeResult {
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

  return (
    <div className="flex items-center gap-1 shrink-0">
      {showFull ? (
        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
          <Calendar size={9} />
          <span>{relative}</span>
        </div>
      ) : (
        <span className="text-[10px] font-bold text-slate-400">{relative}</span>
      )}
    </div>
  );
}

function PreviewImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (!src) return null;

  return failed ? (
    <div className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-2 text-slate-400 text-xs">
      <ImageOff size={14} />
      Imagen no encontrada
    </div>
  ) : (
    <img
      src={src}
      alt="Preview"
      onError={() => setFailed(true)}
      className="h-14 w-auto max-w-[130px] object-contain rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 p-1.5 shadow-sm"
    />
  );
}

function ActivityRow({
  item,
  i,
  currentUser,
  currentDisplayName,
  currentInitials,
  currentAvatarUrl,
  profiles,
}: {
  item: ActivityLog;
  i: number;
  currentUser: any;
  currentDisplayName: string;
  currentInitials: string;
  currentAvatarUrl: string | null;
  profiles: ProfileMap;
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const EntityIcon = entityIcons[item.entity_type] || entityIcons.DEFAULT;
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
  if (item.action_type === "UPDATE" && item.details) {
    try {
      const details =
        typeof item.details === "string"
          ? JSON.parse(item.details)
          : item.details;
      const imageField = details.logo_url || details.image;
      if (imageField?.new) previewImage = imageField.new;
    } catch (e) {
      console.error("Error parsing details for item", item.id, e);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="group flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-white/5"
    >
      <div className="relative shrink-0 mt-1">
        <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 shadow-sm">
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
          className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-lg border-2 border-white dark:border-[#111113] flex items-center justify-center shadow-sm ${styles}`}
        >
          <EntityIcon size={10} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-black text-slate-900 dark:text-white capitalize">
              {nameToShow}
            </span>
            <div
              className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${styles} bg-opacity-10 border-none`}
            >
              {item.action_type}
            </div>
          </div>

          <RelativeTime date={date} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-snug font-medium">
            {formatActivityAction(item, true)
              .split(/(\*\*.*?\*\*|__.*?__)/g)
              .map((part, index) => {
                if (part.startsWith("**")) {
                  return (
                    <span
                      key={index}
                      className="text-indigo-500 dark:text-indigo-400 font-bold"
                    >
                      {part.replace(/\*\*/g, "")}
                    </span>
                  );
                }
                if (part.startsWith("__")) {
                  return (
                    <span
                      key={index}
                      className="text-slate-900 dark:text-slate-100 font-black"
                    >
                      {part.replace(/__/g, "")}
                    </span>
                  );
                }
                return part;
              })}
          </p>

          {previewImage && <PreviewImage src={previewImage} />}
        </div>
      </div>
    </motion.div>
  );
}

export function ActivityFeed({
  items = [],
  limit = 5,
}: {
  items?: ActivityLog[];
  limit?: number;
}) {
  const { initials, displayName, user, avatarUrl } = useUser();
  const [profiles, setProfiles] = useState<ProfileMap>({});

  const displayItems = (Array.isArray(items) ? items : []).slice(0, limit);

  useEffect(() => {
    if (displayItems.length === 0) return;

    const allIds = [
      ...new Set(displayItems.map((i) => i.user_id).filter(Boolean)),
    ];

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
  }, [displayItems]);

  if (displayItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-300">
        <User size={32} className="mb-2 opacity-20" />
        <p className="text-sm font-medium">Sin actividad reciente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayItems.map((item, i) => (
        <ActivityRow
          key={item.id}
          item={item}
          i={i}
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
