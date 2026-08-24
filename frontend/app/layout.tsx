// app/layout.tsx
import type { Metadata } from "next";
import { Nunito_Sans  } from "next/font/google"; // <- reemplaza Geist por la fuente deseada (ver lista: https://fonts.google.com)
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Nunito_Sans ({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Microbioma Clínico",
  description: "Plataforma clínica de gestión y seguimiento de microbioma intestinal",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50/50 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}