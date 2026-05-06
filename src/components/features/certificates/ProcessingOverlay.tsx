"use client";

import { Loader2 } from "lucide-react";

interface Props {
  progress: number;
}

export function ProcessingOverlay({ progress }: Props) {
  return (
    <div
      className="absolute inset-0 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
    >
      <Loader2
        className="w-16 h-16 animate-spin mb-4"
        style={{ color: "var(--accent)" }}
      />
      <h3 className="text-2xl font-black">Procesando Certificados</h3>
      <p className="font-medium opacity-60">{progress}% completado</p>
    </div>
  );
}
