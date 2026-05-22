"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ClipboardFormat =
  | "dxf" // DXF como texto plano
  | "cf_text" // CF_TEXT de Windows (texto enriquecido de AutoCAD)
  | "acad_entities" // Entidades AutoCAD propietarias (binario/texto)
  | "unknown";

export interface CADClipboardData {
  raw: string; // String crudo tal como llegó
  format: ClipboardFormat;
  detectedAt: Date;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function detectFormat(text: string): ClipboardFormat {
  const trimmed = text.trimStart();

  if (trimmed.includes("SECTION") && trimmed.includes("ENTITIES")) {
    return "dxf";
  }
  if (/^\s*\d+\s*\n/.test(trimmed)) {
    return "cf_text";
  }
  if (trimmed.startsWith("AC")) {
    return "acad_entities";
  }
  return "unknown";
}

/**
 * Convierte un bloque DXF R12 crudo en una secuencia de comandos ejecutables (Macro)
 * para que la consola de comandos de AutoCAD la dibuje directamente al hacer Ctrl+V.
 */
function convertDXFToAutoCADMacro(dxfText: string): string {
  const lines = dxfText.split(/\r?\n/).map((l) => l.trim());
  let macro = "";
  let i = 0;

  // Desactivamos temporalmente el emboquillado de objetos (OSNAP) para evitar distorsiones
  macro += "OSMODE\n0\n";

  while (i < lines.length) {
    if (lines[i] === "LINE") {
      let x1 = "0",
        y1 = "0",
        x2 = "0",
        y2 = "0";
      while (i < lines.length && lines[i] !== "0") {
        if (lines[i] === "10") x1 = lines[i + 1];
        if (lines[i] === "20") y1 = lines[i + 1];
        if (lines[i] === "11") x2 = lines[i + 1];
        if (lines[i] === "21") y2 = lines[i + 1];
        i++;
      }
      macro += `_LINE\n${x1},${y1}\n${x2},${y2}\n\n`;
    } else if (lines[i] === "CIRCLE") {
      let cx = "0",
        cy = "0",
        r = "0";
      while (i < lines.length && lines[i] !== "0") {
        if (lines[i] === "10") cx = lines[i + 1];
        if (lines[i] === "20") cy = lines[i + 1];
        if (lines[i] === "40") r = lines[i + 1];
        i++;
      }
      macro += `_CIRCLE\n${cx},${cy}\n${r}\n`;
    } else {
      i++;
    }
  }

  // Devolvemos el estado original al cursor del usuario o cerramos el buffer de comandos
  macro += "PRINC\n";
  return macro;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseClipboardCADOptions {
  onCapture?: (data: CADClipboardData) => void;
  listenGlobal?: boolean;
}

interface UseClipboardCADReturn {
  capturedData: CADClipboardData | null;
  isReading: boolean;
  isWriting: boolean;
  error: string | null;
  readClipboard: () => Promise<CADClipboardData | null>;
  writeToClipboard: (rawData: string) => Promise<boolean>;
  reset: () => void;
}

export function useClipboardCAD(
  options: UseClipboardCADOptions = {},
): UseClipboardCADReturn {
  const { onCapture, listenGlobal = true } = options;

  const [capturedData, setCapturedData] = useState<CADClipboardData | null>(
    null,
  );
  const [isReading, setIsReading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCaptureRef = useRef(onCapture);
  useEffect(() => {
    onCaptureRef.current = onCapture;
  }, [onCapture]);

  const processRawText = useCallback((text: string): CADClipboardData => {
    const data: CADClipboardData = {
      raw: text,
      format: detectFormat(text),
      detectedAt: new Date(),
    };
    setCapturedData(data);
    onCaptureRef.current?.(data);
    return data;
  }, []);

  const readClipboard =
    useCallback(async (): Promise<CADClipboardData | null> => {
      setIsReading(true);
      setError(null);
      try {
        const text = await navigator.clipboard.readText();
        if (!text.trim()) {
          setError("El portapapeles está vacío.");
          return null;
        }
        return processRawText(text);
      } catch (err: any) {
        const msg = err?.message ?? "No se pudo leer el portapapeles.";
        setError(msg);
        return null;
      } finally {
        // 👈 Aquí estaba el error, simplemente cámbialo a 'finally'
        setIsReading(false);
      }
    }, [processRawText]);

  const writeToClipboard = useCallback(
    async (rawData: string): Promise<boolean> => {
      setIsWriting(true);
      setError(null);
      try {
        // MÁGICO: Si es un DXF nativo, lo transformamos en comando directo de consola antes de copiarlo
        const isDXF =
          rawData.includes("SECTION") && rawData.includes("ENTITIES");
        const dataToPut = isDXF ? convertDXFToAutoCADMacro(rawData) : rawData;

        await navigator.clipboard.writeText(dataToPut);
        return true;
      } catch (err: any) {
        try {
          const isDXF =
            rawData.includes("SECTION") && rawData.includes("ENTITIES");
          const dataToPut = isDXF ? convertDXFToAutoCADMacro(rawData) : rawData;

          const ta = document.createElement("textarea");
          ta.value = dataToPut;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (!ok) throw new Error("execCommand failed");
          return true;
        } catch {
          setError("No se pudo copiar al portapapeles.");
          return false;
        }
      } finally {
        setIsWriting(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!listenGlobal) return;

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const text = e.clipboardData?.getData("text/plain") ?? "";
      if (!text.trim()) return;

      e.preventDefault();
      processRawText(text);
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [listenGlobal, processRawText]);

  const reset = useCallback(() => {
    setCapturedData(null);
    setError(null);
  }, []);

  return {
    capturedData,
    isReading,
    isWriting,
    error,
    readClipboard,
    writeToClipboard,
    reset,
  };
}
