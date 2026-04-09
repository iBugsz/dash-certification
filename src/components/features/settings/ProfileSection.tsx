"use client";

import { RefObject, useState } from "react";
import {
  User,
  Camera,
  Save,
  Loader2,
  Link as LinkIcon,
  Upload,
} from "lucide-react";
import { Section } from "./Section";
import { Field, inputCls } from "./Field";

interface Props {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (v: string) => void;
  uploadingAvatar: boolean;
  savingProfile: boolean;
  initials: string;
  fileRef: RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export function ProfileSection({
  fullName,
  setFullName,
  email,
  setEmail,
  avatarUrl,
  setAvatarUrl,
  uploadingAvatar,
  savingProfile,
  initials,
  fileRef,
  onAvatarChange,
  onSave,
}: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const [editUrl, setEditUrl] = useState(false);

  return (
    <Section
      icon={<User size={17} />}
      iconBg="bg-accent-soft"
      iconColor="text-accent"
      title="Perfil"
    >
      <div className="flex items-center gap-5 mb-7">
        <div className="relative">
          {/* Imagen / Initials */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[var(--accent-ring)]"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--sidebar-avatar-from), var(--sidebar-avatar-to))",
              }}
            >
              {initials}
            </div>
          )}

          {/* Botón Cámara con Menú */}
          <div className="absolute -bottom-1 -right-1">
            <button
              onClick={() => setShowOptions(!showOptions)}
              disabled={uploadingAvatar}
              className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-md hover:scale-110 transition-transform active:scale-95"
            >
              {uploadingAvatar ? (
                <Loader2 size={12} className="text-white animate-spin" />
              ) : (
                <Camera size={12} className="cursor-pointer text-white" />
              )}
            </button>

            {/* Menú Flotante de Opciones */}
            {showOptions && (
              <div className="absolute top-8 left-0 z-10 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg p-1 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    fileRef.current?.click();
                    setShowOptions(false);
                  }}
                  className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-[12px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
                >
                  <Upload size={14} /> Subir archivo
                </button>
                <button
                  onClick={() => {
                    setEditUrl(true);
                    setShowOptions(false);
                  }}
                  className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-[12px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
                >
                  <LinkIcon size={14} /> Pegar URL
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </div>

        <div>
          <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-100">
            {fullName || "Sin nombre"}
          </p>
          <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">
            {email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Nombre completo">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="Correo electrónico">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </Field>

        {/* El campo de URL ahora siempre se puede editar si está visible */}
        {editUrl && (
          <div className="md:col-span-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Field label="URL de imagen de perfil">
              <div className="relative">
                <LinkIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={avatarUrl || ""}
                  onChange={(e) => setAvatarUrl(e.target.value)} // Esto DEBE actualizar el estado en useSettings
                  className={`${inputCls} pl-9 pr-10`}
                  placeholder="https://ejemplo.com/foto.png"
                />
                <button
                  onClick={() => setEditUrl(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                >
                  Cerrar
                </button>
              </div>
            </Field>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onSave}
          disabled={savingProfile}
          className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-semibold transition-all"
        >
          {savingProfile ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Guardar perfil
        </button>
      </div>
    </Section>
  );
}
