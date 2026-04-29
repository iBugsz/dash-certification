"use client";

interface StorageDonutProps {
  usedBytes: number;
  limitBytes: number;
  color: string;
  size?: number;
  hideText?: boolean;
}

export function StorageDonut({
  usedBytes,
  limitBytes,
  color,
  size = 110, // Un poco más grande para que quepa el texto dentro del trazo
  hideText = false,
}: StorageDonutProps) {
  const strokeWidth = 18; // Más grueso para que el texto quepa "dentro"
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = limitBytes
    ? Math.min((usedBytes / limitBytes) * 100, 100)
    : 0;

  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Cálculo de la posición X e Y del final de la barra para poner el texto ahí
  const angle = (percentage / 100) * 360 - 90;
  const angleRad = (angle * Math.PI) / 180;
  const textX = size / 2 + radius * Math.cos(angleRad);
  const textY = size / 2 + radius * Math.sin(angleRad);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Fondo del círculo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100 dark:text-white/5"
        />
        {/* Barra de progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>

      {/* Porcentaje "DENTRO" del trazo al final del progreso */}
      {!hideText && percentage > 5 && (
        <div
          className="absolute flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm rounded-full border border-black/5"
          style={{
            left: textX,
            top: textY,
            width: "24px",
            height: "24px",
            transform: "translate(-50%, -50%)",
            transition: "all 1s ease-in-out",
          }}
        >
          <span className="text-[9px] font-black text-slate-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      {/* Si el porcentaje es 0 o muy bajo, lo mostramos en el centro para que no se amontone */}
      {!hideText && percentage <= 5 && (
        <span className="absolute text-[12px] font-black">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
