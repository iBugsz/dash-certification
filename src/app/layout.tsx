import type { Metadata } from 'next';
import { Poppins } from 'next/font/google'; // Cambiamos a Poppins
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'AutoCert - Homologación',
  description: 'Sistema de gestión de certificados',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="font-poppins bg-[#F4F7FE] text-[#1B2559]">
        {children}
      </body>
    </html>
  );
}
