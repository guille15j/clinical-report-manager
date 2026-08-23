"use client";

import React from "react";
import { Biomarker, BiomarkerStatus } from "@/types/microbiome";

interface Props {
  biomarker: Biomarker;
}

const STATUS_THEME: Record<
  BiomarkerStatus,
  { label: string; dot: string; bg: string }
> = {
  NORMAL: {
    label: "Normal",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 text-emerald-700",
  },
  BAJO: {
    label: "Bajo",
    dot: "bg-amber-500",
    bg: "bg-amber-50 text-amber-700",
  },
  ALTO: {
    label: "Alto",
    dot: "bg-rose-500",
    bg: "bg-rose-50 text-rose-700",
  },
};

export const BiomarkerClinicalBar: React.FC<Props> = ({ biomarker }) => {
  const { name, category, currentValue, minReference, maxReference, unit, status } =
    biomarker;

  const theme = STATUS_THEME[status];

  // Escala visual basada en el rango de datos
  const maxScale = Math.max(maxReference * 1.3, currentValue * 1.15, 1);
  const minPct = Math.min(100, Math.max(0, (minReference / maxScale) * 100));
  const maxPct = Math.min(100, Math.max(0, (maxReference / maxScale) * 100));
  const valuePct = Math.min(98, Math.max(2, (currentValue / maxScale) * 100));

  return (
    <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
      {/* Línea Superior: Nombre, Categoría y Valor */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-xs font-bold text-slate-800 truncate">{name}</span>
          <span className="text-[11px] text-slate-400 font-normal shrink-0">
            {category}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-900">
            {currentValue} <span className="text-[10px] font-normal text-slate-400">{unit}</span>
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.bg}`}>
            {theme.label}
          </span>
        </div>
      </div>

      {/* Barra de Rango Minimalista */}
      <div className="relative h-1.5 w-full bg-slate-100 rounded-full my-1.5">
        {/* Zona Saludable de Referencia */}
        <div
          className="absolute top-0 bottom-0 bg-emerald-200/80 rounded-full"
          style={{
            left: `${minPct}%`,
            width: `${Math.max(4, maxPct - minPct)}%`,
          }}
        />

        {/* Indicador de Valor Actual */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow-xs ${theme.dot}`}
          style={{ left: `${valuePct}%` }}
        />
      </div>

      {/* Pie de Línea: Única mención del Rango de Referencia */}
      <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
        <span>0</span>
        <span className="font-medium text-slate-500">
          Rango saludable: {minReference} – {maxReference} {unit}
        </span>
        <span>{Math.round(maxScale)}</span>
      </div>
    </div>
  );
};