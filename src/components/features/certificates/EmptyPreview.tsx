import { FileStack } from "lucide-react";

export function EmptyPreview() {
  return (
    <div
      className="border-2 border-dashed rounded-[32px] h-full min-h-[550px] flex flex-col items-center justify-center p-12 text-center group transition-colors"
      style={{
        backgroundColor: "var(--input-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          borderWidth: "1px",
        }}
      >
        <FileStack
          className="w-10 h-10"
          style={{ color: "var(--sidebar-fg-muted)" }}
        />
      </div>
      <h2
        className="text-xl font-bold mb-2 font-poppins"
        style={{ color: "var(--foreground)" }}
      >
        Esperando Datos
      </h2>
      <p
        className="text-sm max-w-[320px] leading-relaxed"
        style={{ color: "var(--sidebar-fg-muted)" }}
      >
        Carga un archivo Excel a la izquierda para generar la vista previa
        interactiva de tus certificados.
      </p>
    </div>
  );
}
