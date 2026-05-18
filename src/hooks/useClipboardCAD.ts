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

/**
 * Detecta el formato del contenido pegado.
 * AutoCAD en Windows genera CF_TEXT que empieza con cabeceras DXF o con
 * identificadores propietarios como "AC" seguido de versión.
 */
function detectFormat(text: string): ClipboardFormat {
  const trimmed = text.trimStart();

  // DXF clásico: secciones HEADER / ENTITIES / EOF
  if (trimmed.includes("SECTION") && trimmed.includes("ENTITIES")) {
    return "dxf";
  }
  // AutoCAD CF_TEXT suele tener líneas numéricas pareadas (código + valor)
  if (/^\s*\d+\s*\n/.test(trimmed)) {
    return "cf_text";
  }
  // Formato binario representado como texto (cabecera AC)
  if (trimmed.startsWith("AC")) {
    return "acad_entities";
  }
  return "unknown";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseClipboardCADOptions {
  /** Llamado cuando se detecta datos válidos de AutoCAD en el portapapeles */
  onCapture?: (data: CADClipboardData) => void;
  /** Si es true, el hook escucha eventos paste globalmente */
  listenGlobal?: boolean;
}

interface UseClipboardCADReturn {
  /** Datos capturados del último paste */
  capturedData: CADClipboardData | null;
  /** true mientras se lee el portapapeles */
  isReading: boolean;
  /** true mientras se escribe al portapapeles */
  isWriting: boolean;
  /** Error ocurrido, si hubo */
  error: string | null;
  /** Fuerza lectura manual del portapapeles (sin paste event) */
  readClipboard: () => Promise<CADClipboardData | null>;
  /** Inyecta el raw_vector_data de vuelta al portapapeles del SO */
  writeToClipboard: (rawData: string) => Promise<boolean>;
  /** Limpia el estado */
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

  // Ref para evitar closures viejas en el event listener
  const onCaptureRef = useRef(onCapture);
  useEffect(() => {
    onCaptureRef.current = onCapture;
  }, [onCapture]);

  // ── Procesar texto crudo ──────────────────────────────────────────────────
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

  // ── Leer portapapeles manualmente ─────────────────────────────────────────
  const readClipboard =
    useCallback(async (): Promise<CADClipboardData | null> => {
      setIsReading(true);
      setError(null);
      try {
        // La Clipboard API requiere permiso "clipboard-read" en algunos browsers
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
        setIsReading(false);
      }
    }, [processRawText]);

  // ── Escribir al portapapeles (inyectar de vuelta a AutoCAD) ───────────────
  const writeToClipboard = useCallback(
    async (rawData: string): Promise<boolean> => {
      setIsWriting(true);
      setError(null);
      try {
        await navigator.clipboard.writeText(rawData);
        return true;
      } catch (err: any) {
        /**
         * Algunos navegadores (especialmente sin HTTPS o sin foco de ventana)
         * bloquean la escritura al portapapeles. Fallback con execCommand.
         */
        try {
          const ta = document.createElement("textarea");
          ta.value = rawData;
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

  // ── Escucha global de paste ───────────────────────────────────────────────
  useEffect(() => {
    if (!listenGlobal) return;

    const handlePaste = (e: ClipboardEvent) => {
      // Ignorar pastes dentro de inputs / textareas para no interferir
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

      e.preventDefault(); // Evitar que el texto aparezca en el DOM
      processRawText(text);
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [listenGlobal, processRawText]);

  // ── Reset ─────────────────────────────────────────────────────────────────
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
