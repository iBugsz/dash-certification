"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function GenerationChart({ data }: { data: any[] }) {
  const hasData = data && data.length > 0;

  // 1. Calculamos el valor máximo para que la escala siempre sea múltiplo de 5
  const maxVal = hasData ? Math.max(...data.map((d) => d.count)) : 0;
  // Redondeamos hacia arriba al siguiente múltiplo de 5 (mínimo 5)
  const chartMax = Math.max(Math.ceil(maxVal / 5) * 5, 5);

  // 2. Generamos los números del eje Y de 5 en 5
  const yTicks = Array.from({ length: chartMax / 5 + 1 }, (_, i) => i * 5);

  return (
    <div className="w-full h-full min-h-[300px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }}
            dy={10}
            tickFormatter={(value, index) =>
              index === data.length - 1 ? "Hoy" : value
            }
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }}
            // ✅ Forzamos el dominio y los saltos de 5 en 5
            domain={[0, chartMax]}
            ticks={yTicks}
          />

          {hasData && (
            <Tooltip
              labelFormatter={(label, payload) => {
                const isLast =
                  data.indexOf(payload[0]?.payload) === data.length - 1;
                return isLast ? "Hoy" : label;
              }}
              formatter={(value) => [value, "Certificados"]}
              contentStyle={{
                borderRadius: "1.2rem",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontFamily: "inherit",
                fontSize: "12px",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
          )}

          <Area
            type="monotone"
            dataKey="count"
            name="Certificados"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCount)"
            animationDuration={1500}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>

      {!hasData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md border border-slate-100 dark:border-white/5 px-6 py-3 rounded-3xl shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Sincronizando métricas...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
