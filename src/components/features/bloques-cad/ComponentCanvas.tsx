"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MousePointer2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Vec2 { x: number; y: number; }

export interface CADEntity {
  type: "LINE" | "CIRCLE" | "ARC" | "LWPOLYLINE" | "POINT" | "TEXT";
  data: Record<string, any>;
  vertices?: Vec2[];
}

interface ComponentCanvasProps {
  rawVectorData: string;
  height?: number;
  className?: string;
  /** Modo compacto: oculta hint text, muestra solo el canvas */
  compact?: boolean;
}

// ─── Parser: LWPOLYLINE ───────────────────────────────────────────────────────

function parsePolylineVertices(
  lines: string[],
  startIndex: number,
): { vertices: Vec2[]; nextIndex: number; closed: boolean } {
  const vertices: Vec2[] = [];
  let i = startIndex;
  let closed = false;
  let currentVertex: Partial<Vec2> = {};

  while (i < lines.length) {
    const code = parseInt(lines[i]?.trim(), 10);
    const val = lines[i + 1]?.trim() ?? "";
    if (code === 0) break;
    i += 2;
    if (isNaN(code)) continue;

    switch (code) {
      case 70:
        closed = (parseInt(val, 10) & 1) === 1;
        break;
      case 10:
        if (currentVertex.x !== undefined) {
          vertices.push(currentVertex as Vec2);
          currentVertex = {};
        }
        currentVertex.x = parseFloat(val);
        break;
      case 20:
        currentVertex.y = parseFloat(val);
        if (currentVertex.x !== undefined && currentVertex.y !== undefined) {
          vertices.push(currentVertex as Vec2);
          currentVertex = {};
        }
        break;
    }
  }
  if (currentVertex.x !== undefined && currentVertex.y !== undefined) {
    vertices.push(currentVertex as Vec2);
  }
  return { vertices, nextIndex: i, closed };
}

export function parseCFText(text: string): CADEntity[] {
  const lines = text.split(/\r?\n/);
  const entities: CADEntity[] = [];
  let i = 0;
  let current: CADEntity | null = null;

  while (i < lines.length - 1) {
    const code = parseInt(lines[i].trim(), 10);
    const val = lines[i + 1]?.trim() ?? "";

    if (isNaN(code)) { i += 2; continue; }

    if (code === 0) {
      if (current) entities.push(current);
      if (val === "LWPOLYLINE") {
        const { vertices, nextIndex, closed } = parsePolylineVertices(lines, i + 2);
        current = { type: "LWPOLYLINE", data: { 70: closed ? 1 : 0 }, vertices };
        i = nextIndex;
        continue;
      } else {
        current = { type: val as CADEntity["type"], data: {} };
      }
      i += 2;
    } else if (current) {
      if (current.type !== "LWPOLYLINE") {
        const numVal = parseFloat(val);
        current.data[code] = isNaN(numVal) ? val : numVal;
      }
      i += 2;
    } else {
      i += 2;
    }
  }
  if (current) entities.push(current);
  return entities;
}

export { parseCFText as parseDXFEntities };

export function getBounds(entities: CADEntity[]): { min: Vec2; max: Vec2 } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const expand = (x: number, y: number) => {
    if (!isFinite(x) || !isFinite(y)) return;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };

  entities.forEach((e) => {
    const d = e.data;
    if (e.type === "LINE") { expand(d[10], d[20]); expand(d[11], d[21]); }
    else if (e.type === "CIRCLE" || e.type === "ARC") {
      const r = d[40] || 0;
      expand(d[10] - r, d[20] - r);
      expand(d[10] + r, d[20] + r);
    } else if (e.type === "LWPOLYLINE" && e.vertices) {
      e.vertices.forEach((v) => expand(v.x, v.y));
    }
  });

  return !isFinite(minX)
    ? { min: { x: -10, y: -10 }, max: { x: 10, y: 10 } }
    : { min: { x: minX, y: minY }, max: { x: maxX, y: maxY } };
}

// ─── Fit to view ──────────────────────────────────────────────────────────────

function computeFitTransform(
  entities: CADEntity[],
  canvasW: number,
  canvasH: number,
  padding = 0.82,
) {
  const { min, max } = getBounds(entities);
  const dw = max.x - min.x || 1;
  const dh = max.y - min.y || 1;
  const scale = Math.min((canvasW * padding) / dw, (canvasH * padding) / dh);
  return {
    scale,
    offset: {
      x: canvasW / 2 - ((min.x + max.x) / 2) * scale,
      y: canvasH / 2 + ((min.y + max.y) / 2) * scale,
    },
  };
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ComponentCanvas({
  rawVectorData,
  height = 400,
  className = "",
  compact = false,
}: ComponentCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [transform, setTransform] = useState({ scale: 1, offset: { x: 0, y: 0 } });
  const [entities, setEntities] = useState<CADEntity[]>([]);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // ── Dibujo ────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Fondo
    ctx.fillStyle = "#06080d";
    ctx.fillRect(0, 0, W, H);

    // Cuadrícula — dos niveles: mayor y menor
    const baseStep = 40;
    const step = baseStep * transform.scale;
    const startX = ((transform.offset.x % step) + step) % step;
    const startY = ((transform.offset.y % step) + step) % step;

    // Líneas menores
    ctx.strokeStyle = "rgba(0, 210, 255, 0.05)";
    ctx.lineWidth = 0.5;
    for (let x = startX; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = startY; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Líneas mayores (cada 5)
    const bigStep = step * 5;
    const bigStartX = ((transform.offset.x % bigStep) + bigStep) % bigStep;
    const bigStartY = ((transform.offset.y % bigStep) + bigStep) % bigStep;
    ctx.strokeStyle = "rgba(0, 210, 255, 0.12)";
    ctx.lineWidth = 0.8;
    for (let x = bigStartX; x < W; x += bigStep) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = bigStartY; y < H; y += bigStep) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    if (entities.length === 0) return;

    ctx.save();
    ctx.translate(transform.offset.x, transform.offset.y);
    ctx.scale(transform.scale, -transform.scale);

    // Sombra glow
    ctx.shadowColor = "rgba(0, 210, 255, 0.35)";
    ctx.shadowBlur = 6 / transform.scale;

    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 1.5 / transform.scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    entities.forEach((e) => {
      const d = e.data;
      ctx.beginPath();
      if (e.type === "LINE") {
        ctx.moveTo(d[10] || 0, d[20] || 0);
        ctx.lineTo(d[11] || 0, d[21] || 0);
        ctx.stroke();
      } else if (e.type === "CIRCLE") {
        ctx.arc(d[10] || 0, d[20] || 0, d[40] || 1, 0, Math.PI * 2);
        ctx.stroke();
      } else if (e.type === "ARC") {
        const sa = ((d[50] || 0) * Math.PI) / 180;
        const ea = ((d[51] || 0) * Math.PI) / 180;
        ctx.arc(d[10] || 0, d[20] || 0, d[40] || 1, sa, ea);
        ctx.stroke();
      } else if (e.type === "LWPOLYLINE" && e.vertices && e.vertices.length > 1) {
        ctx.moveTo(e.vertices[0].x, e.vertices[0].y);
        for (let j = 1; j < e.vertices.length; j++) {
          ctx.lineTo(e.vertices[j].x, e.vertices[j].y);
        }
        if (e.data[70] === 1) ctx.closePath();
        ctx.stroke();
      }
    });

    ctx.restore();
  }, [entities, transform]);

  // ── Zoom & Pan ────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.88 : 1.14;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setTransform((prev) => ({
      scale: Math.min(Math.max(prev.scale * factor, 0.02), 100),
      offset: {
        x: mx - (mx - prev.offset.x) * factor,
        y: my - (my - prev.offset.y) * factor,
      },
    }));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (entities.length === 0) return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({
      ...prev,
      offset: { x: prev.offset.x + dx, y: prev.offset.y + dy },
    }));
  };

  const handleFit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || entities.length === 0) return;
    setTransform(computeFitTransform(entities, canvas.width, canvas.height));
  }, [entities]);

  // ── Resize observer: ajusta canvas al contenedor real ────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { width, height: h } = container.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${h}px`;
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  // ── Parseo de datos ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!rawVectorData) { setEntities([]); return; }
    const ents = parseCFText(rawVectorData);
    setEntities(ents);
    const canvas = canvasRef.current;
    if (canvas && ents.length > 0) {
      setTransform(computeFitTransform(ents, canvas.width, canvas.height));
    }
  }, [rawVectorData]);

  useEffect(() => { draw(); }, [draw]);

  const isEmpty = entities.length === 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        className={`absolute inset-0 w-full h-full ${
          !isEmpty ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
      />

      {/* Vignette overlay */}
      {!isEmpty && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(6,8,13,0.7) 100%)",
          }}
        />
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6">
          <div
            className="w-14 h-14 mb-4 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(0,210,255,0.06)",
              border: "1px solid rgba(0,210,255,0.15)",
              boxShadow: "0 0 24px rgba(0,210,255,0.08)",
            }}
          >
            <MousePointer2 className="w-6 h-6 text-cyan-400" style={{ opacity: 0.7 }} />
          </div>
          {!compact && (
            <>
              <p className="text-white font-semibold text-sm mb-1" style={{ letterSpacing: "0.01em" }}>
                Área de previsualización
              </p>
              <p className="text-xs max-w-[240px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                Copia geometría desde AutoCAD y presiona{" "}
                <span
                  className="font-mono px-1.5 py-0.5 rounded"
                  style={{ color: "#00d4ff", background: "rgba(0,210,255,0.1)" }}
                >
                  Ctrl+V
                </span>{" "}
                para previsualizar
              </p>
            </>
          )}
        </div>
      )}

      {/* Controles */}
      {!isEmpty && (
        <div className="absolute bottom-3 right-3 flex gap-1.5 z-20">
          <button
            onClick={() =>
              setTransform((p) => ({ ...p, scale: Math.min(p.scale * 1.25, 100) }))
            }
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(6,8,13,0.85)",
              border: "1px solid rgba(0,210,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "rgba(0,210,255,0.7)",
            }}
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={() =>
              setTransform((p) => ({ ...p, scale: Math.max(p.scale * 0.8, 0.02) }))
            }
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(6,8,13,0.85)",
              border: "1px solid rgba(0,210,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "rgba(0,210,255,0.7)",
            }}
          >
            <ZoomOut size={13} />
          </button>
          <button
            onClick={handleFit}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(6,8,13,0.85)",
              border: "1px solid rgba(0,210,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "rgba(0,210,255,0.7)",
            }}
          >
            <Maximize2 size={12} />
          </button>
        </div>
      )}

      {/* Badge zoom */}
      {!isEmpty && (
        <div
          className="absolute top-3 left-3 z-20 font-mono text-[10px] px-2 py-1 rounded-md"
          style={{
            background: "rgba(6,8,13,0.7)",
            border: "1px solid rgba(0,210,255,0.1)",
            color: "rgba(0,210,255,0.45)",
            backdropFilter: "blur(6px)",
            letterSpacing: "0.05em",
          }}
        >
          {(transform.scale * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}