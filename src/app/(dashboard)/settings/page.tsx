"use client";

import { useState } from "react";
import {
  Loader2,
  Settings2,
  UserRound,
  CreditCard,
  HelpCircle,
  Edit3,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ToastBanner } from "@/components/features/settings/ToastBanner";
import { ProfileSection } from "@/components/features/settings/ProfileSection";
import { AppearanceSection } from "@/components/features/settings/AppearanceSection";
import { NotificationsSection } from "@/components/features/settings/NotificationsSection";
import { SidebarInfo } from "@/components/features/settings/SidebarInfo";
import { AccountTab } from "@/components/features/settings/AccountTab"; // Importamos el nuevo componente
import { Section } from "@/components/features/settings/Section";
import { Field, inputCls } from "@/components/features/settings/Field";

const TABS = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "account", label: "Cuenta", icon: UserRound },
  { id: "billing", label: "Plan y Facturación", icon: CreditCard },
  { id: "help", label: "Ayuda", icon: HelpCircle },
];

export default function SettingsPage() {
  const s = useSettings();
  const appSettings = useAppSettings();
  const [activeTab, setActiveTab] = useState("general");

  if (s.loadingUser || appSettings.loadingAppName) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-(--accent)" size={28} />
      </div>
    );
  }

  return (
    <>
      <ToastBanner toast={s.toast} onClose={() => s.setToast(null)} />

      <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            Configuración
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Gestiona tu cuenta y preferencias de {appSettings.appName || "AutoCert Pro"}.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-(--accent) text-white shadow-lg"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </aside>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* PESTAÑA GENERAL */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ProfileSection
                  fullName={s.fullName}
                  setFullName={s.setFullName}
                  email={s.email}
                  setEmail={s.setEmail}
                  avatarUrl={s.avatarUrl}
                  setAvatarUrl={s.setAvatarUrl}
                  uploadingAvatar={s.uploadingAvatar}
                  savingProfile={s.savingProfile}
                  initials={s.initials}
                  fileRef={s.fileRef}
                  onAvatarChange={s.handleAvatarChange}
                  onSave={s.saveProfile}
                />

                <Section
                  icon={<Edit3 size={17} />}
                  iconBg="bg-sky-100 dark:bg-sky-950/40"
                  iconColor="text-sky-600 dark:text-sky-400"
                  title="Nombre de la empresa"
                >
                  <div className="space-y-5">
                    <Field label="Nombre de la aplicación">
                      <input
                        type="text"
                        value={appSettings.appName}
                        onChange={(e) => appSettings.setAppName(e.target.value)}
                        className={inputCls}
                        placeholder="Nombre de la app"
                      />
                    </Field>
                    <button
                      onClick={async () => {
                        try {
                          await appSettings.saveAppName(appSettings.appName);
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                      disabled={appSettings.savingAppName}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--accent) hover:bg-(--accent-hover) text-white text-[13px] font-semibold transition-all"
                    >
                      {appSettings.savingAppName ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        "Guardar nombre"
                      )}
                    </button>
                  </div>
                </Section>

                <AppearanceSection
                  theme={s.theme}
                  setTheme={s.setTheme}
                  mounted={s.mounted}
                />

                <NotificationsSection
                  notifEmail={s.notifEmail}
                  setNotifEmail={s.setNotifEmail}
                  notifGeneracion={s.notifGeneracion}
                  setNotifGeneracion={s.setNotifGeneracion}
                  notifErrores={s.notifErrores}
                  setNotifErrores={s.setNotifErrores}
                />
              </div>
            )}

            {/* PESTAÑA CUENTA */}
            {activeTab === "account" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <AccountTab s={s} />
              </div>
            )}

            {/* OTRAS PESTAÑAS (Placeholders) */}
            {activeTab === "billing" && (
              <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                <CreditCard className="mx-auto mb-4 text-slate-300" size={48} />
                <h3 className="text-lg font-semibold">Plan y Facturación</h3>
                <p className="text-slate-500 text-sm mt-2">
                  Próximamente podrás gestionar tu suscripción aquí.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Info (Solo en General) */}
          {activeTab === "general" && (
            <div className="hidden xl:block w-72 shrink-0">
              <SidebarInfo userId={s.userId} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
