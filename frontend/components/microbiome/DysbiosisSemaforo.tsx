"use client";

import React, { useState } from "react";
import { ImbalanceLevel } from "@/types/microbiome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  level: ImbalanceLevel;
  diversityIndex?: number;
  desplegable?: boolean;
}

const CONFIG: Record<
  ImbalanceLevel,
  {
    label: string;
    badgeClass: string;
    dotColor: string;
    activeBorder: string;
    activeBg: string;
    description: string;
  }
> = {
  OPTIMO: {
    label: "Óptimo",
    badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-300",
    dotColor: "bg-emerald-500",
    activeBorder: "border-emerald-500 ring-emerald-500/20",
    activeBg: "bg-emerald-50/80",
    description: "Equilibrio microbiano saludable sin indicios de inflamación o sobrecrecimiento patógeno.",
  },
  LEVE: {
    label: "Desequilibrio Leve",
    badgeClass: "bg-amber-500/10 text-amber-700 border-amber-300",
    dotColor: "bg-amber-500",
    activeBorder: "border-amber-500 ring-amber-500/20",
    activeBg: "bg-amber-50/80",
    description: "Alteración moderada en la diversidad bacteriana. Se recomiendan ajustes nutricionales preventivos.",
  },
  SEVERO: {
    label: "Disbiosis Severa",
    badgeClass: "bg-rose-500/10 text-rose-700 border-rose-300",
    dotColor: "bg-rose-500",
    activeBorder: "border-rose-500 ring-rose-500/20",
    activeBg: "bg-rose-50/80",
    description: "Pérdida crítica de diversidad o presencia elevada de patobiontes. Requiere intervención dirigida.",
  },
};

export const DysbiosisTrafficLight: React.FC<Props> = ({
  level,
  diversityIndex,
  desplegable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = CONFIG[level];

  const handleToggle = () => {
    if (desplegable) {
      setIsOpen((prev) => !prev);
    }
  };

  const renderStatusNodes = () => {
    const levels: ImbalanceLevel[] = ["OPTIMO", "LEVE", "SEVERO"];

    return (
      <div className="grid grid-cols-3 gap-2.5 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/80">
        {levels.map((itemKey) => {
          const isActive = level === itemKey;
          const itemConfig = CONFIG[itemKey];

          return (
            <div
              key={itemKey}
              className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? `${itemConfig.activeBg} bg-white shadow-sm ring-2 ${itemConfig.activeBorder}`
                  : "opacity-40 grayscale hover:opacity-70"
              }`}
            >
              <div className="relative flex items-center justify-center mb-1.5">
                {isActive && (
                  <span className={`absolute inline-flex h-4 w-4 rounded-full ${itemConfig.dotColor} opacity-75 animate-ping`} />
                )}
                <span className={`relative inline-flex h-3 w-3 rounded-full ${itemConfig.dotColor}`} />
              </div>
              <span className={`text-xs font-semibold tracking-tight ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                {itemConfig.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const diversityPercentage = diversityIndex !== undefined 
    ? Math.min(Math.max((diversityIndex / 10) * 100, 0), 100) 
    : 0;

  const showContent = !desplegable || isOpen;

  return (
    <Card className="w-full border-slate-200/80 shadow-sm bg-white rounded-2xl overflow-hidden">
      <CardHeader
        onClick={handleToggle}
        className={`pb-3 border-b border-slate-100 bg-slate-50/50 transition-colors ${
          desplegable ? "cursor-pointer hover:bg-slate-100/80 select-none" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Estado de Disbiosis Intestinal
              </CardTitle>
              <p className="text-[11px] text-slate-500 font-medium">Evaluación de equilibrio microbiótico</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${current.badgeClass}`}>
              {current.label}
            </Badge>

            {desplegable && (
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </CardHeader>

      {showContent && (
        <CardContent className="pt-4 space-y-4">
          {renderStatusNodes()}

          <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {current.description}
            </p>
          </div>

          {diversityIndex !== undefined && (
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Índice de Diversidad (Shannon)</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {diversityIndex} <span className="text-slate-400 font-normal">/ 10</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    diversityIndex >= 3.0 ? "bg-emerald-500" : diversityIndex >= 2.0 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${diversityPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};