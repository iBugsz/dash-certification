import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CertifyHub",
  description: "Sistema de gestión de certificados",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* 1. Añadimos suppressHydrationWarning para que Next.js no se queje 
       al cambiar entre temas de luz y oscuridad en el cliente. */
    <html
      lang="es"
      className={cn("h-full", "antialiased", poppins.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="font-poppins transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
