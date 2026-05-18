import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingDashboard() {
  return (
    <div className="p-6 lg:p-10 space-y-8 min-h-screen font-poppins bg-[#fcfcfd] dark:bg-transparent">
      {/* GRID MAESTRO */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LADO IZQUIERDO (8 COLUMNAS) */}
        <div className="xl:col-span-8 space-y-6">
          {/* 1. Skeletons de Almacenamiento (StorageCards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-6 space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Skeleton de Gráfica (CORREGIDO: Alturas fijas para evitar error de hidratación) */}
          <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between mb-8">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-end space-x-2 h-[250px] w-full pt-4">
              {[60, 40, 80, 50, 90, 70, 45, 85, 30, 75, 55, 95].map(
                (height, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1 rounded-t-md opacity-50"
                    style={{ height: `${height}%` }}
                  />
                ),
              )}
            </div>
          </div>

          {/* 3. Skeleton de Actividad Reciente */}
          <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-8 shadow-sm">
            <Skeleton className="h-4 w-40 mb-8" />
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 border-b border-gray-50 dark:border-white/5 pb-4 last:border-0"
                >
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-3 w-2/3 opacity-70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LADO DERECHO (4 COLUMNAS) */}
        <div className="xl:col-span-4 space-y-6">
          {/* 1. Calendario Skeleton */}
          <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-6">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-5 w-24" />
              <div className="flex space-x-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-5 w-5 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 w-full rounded-md opacity-40"
                />
              ))}
            </div>
          </div>

          {/* 2. Gemini Assistant Skeleton */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-dashed border-2 border-indigo-200/50 dark:border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-6 w-6 rounded-full bg-indigo-200 dark:bg-indigo-500/30" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl mb-4" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* 3. Stats Overview */}
          <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-6 grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-8 w-8 mx-auto rounded-lg" />
                <Skeleton className="h-3 w-full mx-auto" />
              </div>
            ))}
          </div>

          {/* 4. Adobe Quota */}
          <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-6 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full border-4 border-slate-100 dark:border-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
