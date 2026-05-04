import { Zap, ShieldCheck } from "lucide-react";

export function FeatureTips() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <div
        className="group p-5 rounded-[24px] border flex gap-4 transition-all hover:shadow-md"
        style={{
          background:
            "linear-gradient(to right, rgba(67, 24, 255, 0.05), var(--card))",
          borderColor: "rgba(67, 24, 255, 0.2)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: "rgba(67, 24, 255, 0.1)" }}
        >
          <Zap className="w-5 h-5" style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <p
            className="text-sm font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Mapeo Inteligente
          </p>
          <p
            className="text-[11px] leading-relaxed mt-1"
            style={{ color: "var(--sidebar-fg-muted)" }}
          >
            Detectamos automáticamente etiquetas como{" "}
            <strong>placa, chasis y marca</strong> dentro de tu archivo Excel
            sin configurar nada.
          </p>
        </div>
      </div>

      <div
        className="group p-5 rounded-[24px] border flex gap-4 transition-all hover:shadow-md"
        style={{
          background:
            "linear-gradient(to right, rgba(5, 205, 153, 0.05), var(--card))",
          borderColor: "rgba(5, 205, 153, 0.2)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: "rgba(5, 205, 153, 0.1)" }}
        >
          <ShieldCheck className="w-5 h-5" style={{ color: "#05cd99" }} />
        </div>
        <div>
          <p
            className="text-sm font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Seguridad Total
          </p>
          <p
            className="text-[11px] leading-relaxed mt-1"
            style={{ color: "var(--sidebar-fg-muted)" }}
          >
            Procesamiento local seguro. Tus datos sensibles{" "}
            <strong>no se almacenan</strong> permanentemente en nuestros
            servidores.
          </p>
        </div>
      </div>
    </div>
  );
}
