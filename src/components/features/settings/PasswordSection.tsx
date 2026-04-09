"use client";

import { Lock, Eye, EyeOff, AlertCircle, Check, Loader2 } from "lucide-react";
import { Section } from "./Section";
import { Field, inputCls } from "./Field";

interface Props {
  currentPw: string;
  setCurrentPw: (v: string) => void;
  newPw: string;
  setNewPw: (v: string) => void;
  confirmPw: string;
  setConfirmPw: (v: string) => void;
  showCurrent: boolean;
  setShowCurrent: (v: boolean) => void;
  showNew: boolean;
  setShowNew: (v: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (v: boolean) => void;
  savingPw: boolean;
  pwStrength: number;
  strengthLabel: string;
  strengthColor: string;
  onSave: () => void;
}

export function PasswordSection({
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
  pwStrength,
  strengthLabel,
  strengthColor,
  onSave,
}: Props) {
  return (
    <Section
      icon={<Lock size={17} />}
      iconBg="bg-violet-100 dark:bg-violet-950/40"
      iconColor="text-violet-500 dark:text-violet-400"
      title="Seguridad y contraseña"
    >
      <div className="space-y-4">
        <Field label="Contraseña actual">
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              className={inputCls + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nueva contraseña">
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
                className={inputCls + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {newPw && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= pwStrength
                          ? strengthColor
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">{strengthLabel}</p>
              </div>
            )}
          </Field>

          <Field label="Confirmar contraseña">
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                className={inputCls + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {confirmPw && newPw !== confirmPw && (
              <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> No coinciden
              </p>
            )}
            {confirmPw && newPw === confirmPw && (
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <Check size={11} /> Coinciden
              </p>
            )}
          </Field>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onSave}
          disabled={savingPw}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-[13px] font-semibold transition-all disabled:opacity-60"
        >
          {savingPw ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Lock size={14} />
          )}
          Actualizar contraseña
        </button>
      </div>
    </Section>
  );
}
