export default function CompanyCardSkeleton() {
  return (
    <div className="relative bg-[var(--card)] rounded-[24px] border border-[var(--border)] flex flex-col overflow-hidden">
      {/* Banner */}
      <div className="h-28 rounded-t-[24px] bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />

      {/* Avatar */}
      <div className="absolute left-5 top-[88px] z-10">
        <div className="w-14 h-14 rounded-2xl border-[3px] border-[var(--card)] bg-slate-300 dark:bg-slate-700 animate-pulse" />
      </div>

      {/* Body */}
      <div className="px-5 pt-10 pb-5 flex flex-col gap-3">
        {/* Nombre */}
        <div className="h-4 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        {/* Línea contacto 1 */}
        <div className="h-3 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        {/* Línea contacto 2 */}
        <div className="h-3 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </div>
  );
}
