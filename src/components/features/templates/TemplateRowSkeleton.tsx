export default function TemplateRowSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-40 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 w-20 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-5 w-16 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-3 w-24 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}