"use client";

import React from "react";

export interface ActionPlan {
  dietaryInterventions?: string[];
  supplements?: string[];
  exclusions?: string[];
}

interface Props {
  plan?: ActionPlan;
}

export const ActionPlanCard: React.FC<Props> = ({ plan }) => {
  const dietary = plan?.dietaryInterventions ?? [];
  const supplements = plan?.supplements ?? [];
  const exclusions = plan?.exclusions ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs print:border-slate-300 print:shadow-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Plan de Intervención Clínico</h3>
          <p className="text-[11px] text-slate-400">Pauta personalizada según perfil metabólico</p>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
          Duración: 6 semanas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block text-emerald-700">
            Ajustes Nutricionales
          </span>
          <ul className="space-y-1.5 text-slate-600">
            {dietary.length > 0 ? (
              dietary.map((item: string, idx: number) => (
                <li key={`diet-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Sin intervenciones especificadas</li>
            )}
          </ul>
        </div>

        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block text-amber-700">
            Suplementación Específica
          </span>
          <ul className="space-y-1.5 text-slate-600">
            {supplements.length > 0 ? (
              supplements.map((item: string, idx: number) => (
                <li key={`supp-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Sin suplementos especificados</li>
            )}
          </ul>
        </div>

        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block text-rose-700">
            Exclusiones Temporales
          </span>
          <ul className="space-y-1.5 text-slate-600">
            {exclusions.length > 0 ? (
              exclusions.map((item: string, idx: number) => (
                <li key={`excl-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Sin exclusiones especificadas</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};