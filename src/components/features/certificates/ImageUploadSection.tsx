// src/components/features/certificates/ImageUploadSection.tsx
import {
  ImagePlus,
  ImageIcon,
  CheckCircle2,
  Camera,
  UploadCloud,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ImageUploadSectionProps {
  imageTags: { tag: string; label: string }[];
  imageFiles: Record<string, File>;
  onImageUpload: (tag: string, file: File) => void;
}

export function ImageUploadSection({
  imageTags,
  imageFiles,
  onImageUpload,
}: ImageUploadSectionProps) {
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    const newPreviews: Record<string, string> = {};
    Object.entries(imageFiles).forEach(([tag, file]) => {
      newPreviews[tag] = URL.createObjectURL(file);
    });
    setPreviews(newPreviews);

    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  if (imageTags.length === 0) return null;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500 rounded-lg shadow-sm shadow-blue-200 dark:shadow-none">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Multimedia Requerida
          </h3>
        </div>
        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
          {Object.keys(imageFiles).length} / {imageTags.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {imageTags.map(({ tag, label }) => {
          const hasFile = !!imageFiles[tag];
          const previewUrl = previews[tag];

          return (
            <div
              key={tag}
              className={`relative group flex items-center p-2 rounded-2xl border transition-all duration-300 ${
                hasFile
                  ? "bg-white dark:bg-slate-900 border-emerald-500/30 shadow-sm shadow-emerald-100 dark:shadow-none"
                  : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-blue-400"
              }`}
            >
              {/* Miniatura de la Imagen */}
              <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                {hasFile && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={label}
                    className="w-full h-full object-cover animate-in zoom-in-75 duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                  </div>
                )}

                {/* Overlay al hacer hover para subir */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloud className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Textos al lado de la imagen */}
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter mb-0.5">
                  {tag}
                </p>
                <p
                  className={`text-xs font-extrabold truncate ${
                    hasFile
                      ? "text-slate-800 dark:text-slate-100"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {label}
                </p>
                {hasFile && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      LISTO
                    </span>
                  </div>
                )}
              </div>

              {/* Input oculto ocupa toda la tarjeta */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(tag, file);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
