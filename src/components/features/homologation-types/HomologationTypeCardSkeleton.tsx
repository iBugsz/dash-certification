export default function HomologationTypeCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
      <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="flex gap-2 border-t border-slate-100 dark:border-slate-700 pt-4">
        <div className="h-8 flex-1 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-8 flex-1 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
