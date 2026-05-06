"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Trash2,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Download,
  File,
} from "lucide-react";

type Message = {
  role: "user" | "model";
  parts: [{ text: string }];
  imageUrl?: string;
  fileName?: string;
  usedModel?: string;
};

function downloadImage(dataUrl: string, filename = "autocert-imagen.png") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <ImageIcon size={13} />;
  if (type === "application/pdf") return <FileText size={13} />;
  return <File size={13} />;
}

// ── Markdown renderer simple (sin dependencias externas) ───────────────────
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  function parseInline(str: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    // bold (**texto** o __texto__), italic (*texto* o _texto_), code (`texto`)
    const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|`([^`]+)`/g;
    let last = 0;
    let match;
    while ((match = regex.exec(str)) !== null) {
      if (match.index > last) parts.push(str.slice(last, match.index));
      if (match[1]) parts.push(<strong key={match.index}>{match[2]}</strong>);
      else if (match[3]) parts.push(<em key={match.index}>{match[4]}</em>);
      else if (match[5])
        parts.push(
          <code
            key={match.index}
            className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-[11px] font-mono"
          >
            {match[5]}
          </code>,
        );
      last = match.index + match[0].length;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Encabezados
    const heading = line.match(/^(#{1,3})\s+(.*)/);
    if (heading) {
      const level = heading[1].length;
      const cls =
        level === 1
          ? "text-base font-bold mt-2 mb-1"
          : level === 2
            ? "text-sm font-bold mt-2 mb-1"
            : "text-sm font-semibold mt-1";
      nodes.push(
        <p key={i} className={cls}>
          {parseInline(heading[2])}
        </p>,
      );
      i++;
      continue;
    }

    // Lista con viñetas
    const bullet = line.match(/^[\*\-]\s+(.*)/);
    if (bullet) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^[\*\-]\s+(.*)/)) {
        const m = lines[i].match(/^[\*\-]\s+(.*)/);
        items.push(
          <li key={i} className="flex gap-1.5 items-start">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-current shrink-0 opacity-50" />
            <span>{parseInline(m![1])}</span>
          </li>,
        );
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="flex flex-col gap-0.5 my-1">
          {items}
        </ul>,
      );
      continue;
    }

    // Lista numerada
    const numbered = line.match(/^(\d+)\.\s+(.*)/);
    if (numbered) {
      const items: React.ReactNode[] = [];
      let n = 1;
      while (i < lines.length && lines[i].match(/^\d+\.\s+(.*)/)) {
        const m = lines[i].match(/^\d+\.\s+(.*)/);
        items.push(
          <li key={i} className="flex gap-1.5 items-start">
            <span className="shrink-0 text-[10px] opacity-50 mt-0.5 font-mono">
              {n}.
            </span>
            <span>{parseInline(m![1])}</span>
          </li>,
        );
        i++;
        n++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="flex flex-col gap-0.5 my-1">
          {items}
        </ol>,
      );
      continue;
    }

    // Línea vacía
    if (line.trim() === "") {
      nodes.push(<div key={i} className="h-1" />);
      i++;
      continue;
    }

    // Párrafo normal
    nodes.push(
      <p key={i} className="leading-relaxed">
        {parseInline(line)}
      </p>,
    );
    i++;
  }

  return nodes;
}

// ── Typing indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-white/5 flex items-center gap-1">
        {[0, 160, 320].map((delay, i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full bg-violet-400 dark:bg-violet-500"
            style={{
              animation: "typingBounce 1.2s ease-in-out infinite",
              animationDelay: `${delay}ms`,
            }}
          />
        ))}
        <style>{`
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-5px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

function QuotaBanner() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] px-3 py-2 rounded-xl rounded-bl-none text-sm bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400">
        <p className="font-medium text-xs">Sin mensajes disponibles ✦</p>
        <p className="text-xs opacity-80 mt-0.5">
          Se agotó la cuota de todos los modelos. Esperá unos minutos e intentá
          de nuevo.
        </p>
      </div>
    </div>
  );
}

export function GeminiAssistantCard() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
    e.target.value = "";
  };

  const handleAsk = async () => {
    if ((!prompt.trim() && !attachedFile) || loading) return;

    const displayText =
      prompt.trim() || `[Archivo adjunto: ${attachedFile?.name}]`;
    const userMessage: Message = {
      role: "user",
      parts: [{ text: displayText }],
      fileName: attachedFile?.name,
    };

    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    const currentPrompt = prompt;
    const currentFile = attachedFile;
    setPrompt("");
    setAttachedFile(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("prompt", currentPrompt);
      formData.append(
        "history",
        JSON.stringify(history.map((m) => ({ role: m.role, parts: m.parts }))),
      );
      if (currentFile) formData.append("file", currentFile);

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 429 && data.error === "quota") {
        setHistory([
          ...newHistory,
          { role: "model", parts: [{ text: "__quota__" }] },
        ]);
        return;
      }

      if (!res.ok) throw new Error(data.error || "Error desconocido");

      setHistory([
        ...newHistory,
        {
          role: "model",
          parts: [{ text: data.text || "Aquí tienes el resultado:" }],
          imageUrl: data.image,
          usedModel: data.model,
        },
      ]);
    } catch (error: any) {
      setHistory([
        ...newHistory,
        {
          role: "model",
          parts: [
            {
              text: `❌ ${error instanceof Error ? error.message : "Error de conexión."}`,
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-2xl p-6 shadow-sm card-premium flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-lg">
            <Sparkles size={16} className="text-[#8633FF]" />
          </div>
          <h3 className="text-[13px] font-bold uppercase text-slate-900 dark:text-white">
            Asistente AI
          </h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-[150px] max-h-[400px] pr-1">
        {history.length === 0 && !loading ? (
          <div className="text-center mt-8 px-4 flex flex-col items-center gap-2">
            <Sparkles
              size={22}
              className="text-slate-300 dark:text-slate-600"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Preguntame sobre homologaciones, certificados o adjuntá un archivo
              para analizarlo.
            </p>
          </div>
        ) : (
          history.map((msg, i) => {
            if (msg.role === "model" && msg.parts[0].text === "__quota__") {
              return <QuotaBanner key={i} />;
            }
            const isUser = msg.role === "user";
            return (
              <div
                key={i}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {msg.fileName && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mb-1 px-1">
                    <Paperclip size={10} />
                    {msg.fileName}
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                    isUser
                      ? "bg-[#8633FF] text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-bl-none border border-slate-200 dark:border-white/5"
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">
                      {msg.parts[0].text}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5 text-[13px]">
                      {renderMarkdown(msg.parts[0].text)}
                    </div>
                  )}
                  {msg.imageUrl && (
                    <div className="mt-3 relative group">
                      <img
                        src={msg.imageUrl}
                        alt="Imagen generada"
                        className="rounded-lg w-full h-auto object-cover border border-white/10 shadow-md"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          onClick={() =>
                            downloadImage(
                              msg.imageUrl!,
                              `autocert-img-${i}.png`,
                            )
                          }
                          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow"
                        >
                          <Download size={13} /> Descargar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {msg.usedModel && (
                  <span className="text-[9px] text-slate-300 dark:text-slate-600 mt-0.5 px-1">
                    {msg.usedModel}
                  </span>
                )}
              </div>
            );
          })
        )}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Archivo adjunto preview */}
      {attachedFile && (
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2">
          <span className="text-[#8633FF]">
            {getFileIcon(attachedFile.type)}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate">
            {attachedFile.name}
          </span>
          <span className="text-[10px] text-slate-400">
            {(attachedFile.size / 1024).toFixed(0)} KB
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="relative mt-1">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            attachedFile
              ? "¿Qué querés hacer con este archivo?"
              : "¿Cómo puedo ayudarle hoy?"
          }
          className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8633FF]/50 resize-none min-h-[80px] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
          disabled={loading}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="p-2 text-slate-400 cursor-pointer hover:text-[#8633FF] transition-colors disabled:opacity-40 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <Paperclip size={15} />
          </button>
          <button
            onClick={handleAsk}
            disabled={loading || (!prompt.trim() && !attachedFile)}
            className="p-2.5 cursor-pointer bg-[#8633FF] hover:bg-[#7029d9] text-white rounded-xl transition-colors disabled:opacity-40 shadow-sm"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.txt,.csv,.json,.md"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
