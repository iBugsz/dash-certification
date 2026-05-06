"use client";

import { motion } from "framer-motion";
import { StorageDonut } from "./StorageDonut";
import { formatBytes } from "@/lib/utils";

interface StorageCardProps {
  label: string;
  title: string;
  used: number;
  limit: number;
  color: string;
  icon: any;
}

export function StorageCard({
  label,
  title,
  used,
  limit,
  color,
  icon: Icon,
}: StorageCardProps) {
  const percentage = limit ? Math.round((used / limit) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-[#111113] border border-slate-100 dark:border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-sm"
    >
      <div className="space-y-4">
        <div
          className="p-2.5 w-fit rounded-xl bg-slate-50 dark:bg-white/5"
          style={{ color }}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1">
            {label}
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {typeof used === "number" && used > 100 ? formatBytes(used) : used}
          </h3>
          <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase">
            Capacidad: {typeof limit === "number" ? formatBytes(limit) : limit}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        {/* CAMBIO 3: hideText={false} para que el Donut muestre el % en el centro */}
        <StorageDonut
          usedBytes={used}
          limitBytes={limit}
          color={color}
          size={90}
          hideText={false}
        />
        {/* Borramos el <span> que estaba aquí abajo para que no se repita el porcentaje */}
      </div>
    </motion.div>
  );
}
