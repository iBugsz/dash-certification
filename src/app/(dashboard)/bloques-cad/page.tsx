"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Copy, Trash2, Check, Layers, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useClipboardCAD } from "@/hooks/useClipboardCAD";
import { Button } from "@/components/ui/button";
import { generateSVGString } from "@/lib/cad-utils";
import {
  parseDXFEntities,
  parseCFText,
} from "@/components/features/bloques-cad/ComponentCanvas";

const ComponentCanvas = dynamic(
  () => import("@/components/features/bloques-cad/ComponentCanvas"),
  { ssr: false },
);

interface CADBlock {
  id: string;
  name: string;
  source_format: string;
  tags: string[];
  thumbnail_svg?: string;
  created_at: string;
}

// ─── BlockCard (Sin fondos específicos) ─────────────────

function BlockCard({
  block,
  onCopy,
  onDelete,
}: {
  block: CADBlock;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    onCopy(block.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 transition-all">
      <div className="h-40 flex items-center justify-center overflow-hidden">
        {block.thumbnail_svg ? (
          <div
            className="w-full h-full p-4 flex items-center justify-center ad-preview-container"
            dangerouslySetInnerHTML={{ __html: block.thumbnail_svg }}
          />
        ) : (
          <div className="text-center text-xs opacity-20">
            <Layers className="w-8 h-8 mx-auto mb-1" />
            sin preview
          </div>
        )}
      </div>
      <style jsx global>{`
        .ad-preview-container svg {
          width: 100%;
          height: 100%;
          max-height: 140px;
        }
        .ad-preview-container * {
          stroke: #00d4ff !important;
          stroke-width: 1.2px;
          fill: none;
        }
      `}</style>
      <div className="p-4 border-t border-white/5">
        <p className="font-medium text-sm truncate">{block.name}</p>
        <p className="text-xs opacity-40">{block.source_format}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {block.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 opacity-60 font-mono"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-cyan-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 opacity-60" />
          )}
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/10 hover:bg-red-500/20"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500/70" />
        </button>
      </div>
    </div>
  );
}

// ─── NewBlockModal (Sin fondos específicos) ──────────────────────────────

function NewBlockModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { capturedData, error: clipError } = useClipboardCAD({
    listenGlobal: true,
  });

  const handleSave = async () => {
    if (!capturedData?.raw) {
      setError("Pega un bloque (Ctrl+V)");
      return;
    }
    setSaving(true);
    try {
      const entities =
        capturedData.format === "dxf"
          ? parseDXFEntities(capturedData.raw)
          : parseCFText(capturedData.raw);
      const svgString = generateSVGString(entities, 400, 400);

      await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Sin nombre",
          raw_vector_data: capturedData.raw,
          source_format: capturedData.format,
          thumbnail_svg: svgString,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 p-6 shadow-xl bg-background">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 opacity-40 hover:opacity-100"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Nuevo Bloque CAD</h2>

        <div className="rounded-xl border border-white/5 overflow-hidden mb-6 bg-black/20">
          <ComponentCanvas
            rawVectorData={capturedData?.raw ?? ""}
            height={220}
          />
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del bloque"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (separados por coma)"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!capturedData || saving}>
            {saving ? "Guardando..." : "Guardar bloque"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Página Principal ────────────────────────────────────────────────────────

export default function BloquesCadPage() {
  const [blocks, setBlocks] = useState<CADBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const { writeToClipboard } = useClipboardCAD({ listenGlobal: false });

  const loadBlocks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/components${search ? `?q=${search}` : ""}`);
    const json = await res.json();
    setBlocks(json.data ?? []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  const handleCopy = async (id: string) => {
    const res = await fetch(`/api/components?id=${id}`);
    const json = await res.json();
    if (json.data?.raw_vector_data)
      await writeToClipboard(json.data.raw_vector_data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar?")) return;
    await fetch(`/api/components?id=${id}`, { method: "DELETE" });
    loadBlocks();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bloques CAD</h1>
          <p className="text-sm opacity-50">
            Librería de componentes vectoriales
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo bloque
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-56 bg-white/5 rounded-2xl animate-pulse"
              />
            ))
          : blocks.map((b) => (
              <BlockCard
                key={b.id}
                block={b}
                onCopy={handleCopy}
                onDelete={handleDelete}
              />
            ))}
      </div>

      {showModal && (
        <NewBlockModal
          onClose={() => setShowModal(false)}
          onSaved={loadBlocks}
        />
      )}
    </div>
  );
}
