export const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[14px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] focus:bg-[var(--input-bg-focus)] transition-all";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}
