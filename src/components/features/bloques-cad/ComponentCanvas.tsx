"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MousePointer2 } from "lucide-react";

// ─── Tipos y Utilidades Actualizadas ──────────────────────────────────────────

interface Vec2 {
  x: number;
  y: number;
}

export interface CADEntity {
  type: "LINE" | "CIRCLE" | "ARC" | "LWPOLYLINE" | "POINT" | "TEXT";
  data: Record<string, any>;
  vertices?: Vec2[]; // Nuevo campo para guardar los puntos de la polilínea
}

interface ComponentCanvasProps {
  rawVectorData: string;
  height?: number;
  className?: string;
}

// Función auxiliar para extraer vértices de una LWPOLYLINE
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

    // Si encontramos el inicio de otra entidad o el fin de sección, paramos
    if (code === 0) break;
    i += 2;

    if (isNaN(code)) continue;

    switch (code) {
      case 70: // Flag de polilínea cerrada
        closed = (parseInt(val, 10) & 1) === 1;
        break;
      case 10: // Coordenada X
        if (currentVertex.x !== undefined) {
          // Si ya teníamos una X, guardamos el vértice anterior
          vertices.push(currentVertex as Vec2);
          currentVertex = {};
        }
        currentVertex.x = parseFloat(val);
        break;
      case 20: // Coordenada Y
        currentVertex.y = parseFloat(val);
        // Si ya tenemos X e Y, podemos guardar el vértice (para LWPOLYLINE las parejas X/Y vienen seguidas)
        if (currentVertex.x !== undefined && currentVertex.y !== undefined) {
          vertices.push(currentVertex as Vec2);
          currentVertex = {};
        }
        break;
    }
  }
  // Añadir el último vértice si quedó pendiente
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

    if (isNaN(code)) {
      i += 2;
      continue;
    }

    if (code === 0) {
      // Nueva Entidad
      if (current) entities.push(current);

      if (val === "LWPOLYLINE") {
        const { vertices, nextIndex, closed } = parsePolylineVertices(
          lines,
          i + 2,
        );
        current = {
          type: "LWPOLYLINE",
          data: { 70: closed ? 1 : 0 },
          vertices,
        };
        i = nextIndex; // Saltamos el índice al final de la polilínea
        continue;
      } else {
        current = { type: val as CADEntity["type"], data: {} };
      }
      i += 2;
    } else if (current) {
      if (current.type !== "LWPOLYLINE") {
        // Para LWPOLYLINE ya procesamos los datos
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

export function getBounds(entities: CADEntity[]): { min: Vec2; max: Vec2 } {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const expand = (x: number, y: number) => {
    if (!isFinite(x) || !isFinite(y)) return;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };

  entities.forEach((e) => {
    const d = e.data;
    if (e.type === "LINE") {
      expand(d[10], d[20]);
      expand(d[11], d[21]);
    } else if (e.type === "CIRCLE" || e.type === "ARC") {
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

// ─── Componente Principal (Lógica de dibujo actualizada) ─────────────────────

export default function ComponentCanvas({
  rawVectorData,
  height = 400,
  className = "",
}: ComponentCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [transform, setTransform] = useState({
    scale: 1,
    offset: { x: 0, y: 0 },
  });
  const [entities, setEntities] = useState<CADEntity[]>([]);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const step = 40 * transform.scale;
    ctx.strokeStyle = "rgba(0, 212, 255, 0.06)";
    ctx.lineWidth = 1;

    const startX = transform.offset.x % step;
    const startY = transform.offset.y % step;
    for (let x = startX; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = startY; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (entities.length > 0) {
      ctx.save();
      ctx.translate(transform.offset.x, transform.offset.y);
      ctx.scale(transform.scale, -transform.scale);

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
        } else if (
          e.type === "LWPOLYLINE" &&
          e.vertices &&
          e.vertices.length > 1
        ) {
          // Lógica de dibujo para Polilíneas
          ctx.moveTo(e.vertices[0].x, e.vertices[0].y);
          for (let j = 1; j < e.vertices.length; j++) {
            ctx.lineTo(e.vertices[j].x, e.vertices[j].y);
          }
          if (e.data[70] === 1) ctx.closePath(); // Si está cerrada, dibujamos la línea final
          ctx.stroke();
        }
      });
      ctx.restore();
    }
  }, [entities, transform]);

  // (Manejo de Zoom y Pan igual que antes)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setTransform((prev) => ({
      scale: Math.min(Math.max(prev.scale * zoomFactor, 0.05), 50),
      offset: {
        x: mouseX - (mouseX - prev.offset.x) * zoomFactor,
        y: mouseY - (mouseY - prev.offset.y) * zoomFactor,
      },
    }));
  };

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

  useEffect(() => {
    if (!rawVectorData) {
      setEntities([]);
      return;
    }
    const ents = parseCFText(rawVectorData);
    setEntities(ents);
    const canvas = canvasRef.current;
    if (canvas && ents.length > 0) {
      const { min, max } = getBounds(ents);
      const scale = Math.min(
        (canvas.width * 0.75) / (max.x - min.x || 1),
        (canvas.height * 0.75) / (max.y - min.y || 1),
      );
      setTransform({
        scale,
        offset: {
          x: canvas.width / 2 - ((min.x + max.x) / 2) * scale,
          y: canvas.height / 2 + ((min.y + max.y) / 2) * scale,
        },
      });
    }
  }, [rawVectorData]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] group ${className}`}
      style={{ height }}
    >
      {entities.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-[#0a0a0a]">
          <div className="w-16 h-16 mb-4 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <MousePointer2 className="w-8 h-8 text-cyan-500 animate-pulse" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Área de Dibujo</h3>
          <p className="text-white/40 text-sm max-w-[280px] leading-relaxed">
            Copia el código del bloque y presiona{" "}
            <span className="text-cyan-400 font-mono bg-cyan-400/10 px-1.5 py-0.5 rounded">
              Ctrl + V
            </span>{" "}
            para previsualizar.
          </p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={1000}
        height={height * 1.2}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        className={`w-full h-full ${entities.length > 0 ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
      />
      {entities.length > 0 && (
        <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/5 text-white/50 font-mono uppercase tracking-wider">
            Scroll: Zoom
          </span>
          <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/5 text-white/50 font-mono uppercase tracking-wider">
            Drag: Pan
          </span>
        </div>
      )}
    </div>
  );
}
