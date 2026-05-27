"use client";

import { Loader2 } from "lucide-react";

interface Props {
  progress: number;
}

export function ProcessingOverlay({ progress }: Props) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--accent)]" />
      </div>
    </div>
  );
}