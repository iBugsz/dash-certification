export default function TemplateRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-40 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-2.5 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-3.5 w-28 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"
            />
          ))}
        </div>
      </td>
    </tr>
  );
}
