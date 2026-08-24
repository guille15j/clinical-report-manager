// lib/statusTheme.ts
import { AnalysisStatus } from "@/types/microbiome";

// Centralizado para evitar import cruzado entre RoleViews.tsx y app/patients/page.tsx
// (ambos son Client Components; importar un named export desde un componente que además
// exporta JSX puede romper el orden de evaluación de módulos en Turbopack).
export const STATUS_THEME: Record<AnalysisStatus, { label: string; className: string }> = {
  SOLICITADO: { label: "Solicitado", className: "bg-slate-100 text-slate-600 border-slate-200" },
  PROCESANDO: { label: "Procesando", className: "bg-sky-50 text-sky-700 border-sky-200" },
  PENDIENTE: { label: "Revisión Pendiente", className: "bg-amber-50 text-amber-700 border-amber-200/60" },
  PUBLICADO: { label: "Publicado", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export const DYSBIOSIS_DOT: Record<string, string> = {
  OPTIMO: "bg-emerald-500",
  LEVE: "bg-amber-500",
  SEVERO: "bg-rose-500",
};