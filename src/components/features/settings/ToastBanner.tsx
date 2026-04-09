"use client";

import { useEffect } from "react";
import { Check, X, AlertCircle } from "lucide-react";

type Toast = { type: "success" | "error"; msg: string } | null;

export function ToastBanner({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const isOk = toast.type === "success";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all animate-in slide-in-from-bottom-4
        ${isOk ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
    >
      {isOk ? <Check size={15} /> : <AlertCircle size={15} />}
      {toast.msg}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X size={13} />
      </button>
    </div>
  );
}
