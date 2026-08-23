"use client";

import React, { useState } from "react";
import { DysbiosisTrafficLight } from "@/components/microbiome/DysbiosisSemaforo";
import { BiomarkerClinicalBar } from "@/components/microbiome/BiomarkerClinicalBar";
import { Biomarker, ImbalanceLevel } from "@/types/microbiome";

// Datos de ejemplo
const MOCK_BIOMARKERS: Biomarker[] = [
  {
    id: "b1",
    name: "Akkermansia muciniphila",
    category: "Integridad Mucosa",
    currentValue: 3.2,
    minReference: 1.0,
    maxReference: 4.0,
    unit: "%",
    status: "NORMAL",
  },
  {
    id: "b2",
    name: "Faecalibacterium prausnitzii",
    category: "Productores de Butirato",
    currentValue: 0.4,
    minReference: 2.5,
    maxReference: 8.0,
    unit: "%",
    status: "BAJO",
  },
  {
    id: "b3",
    name: "Escherichia coli",
    category: "Potenciales Patobiontes",
    currentValue: 5.8,
    minReference: 0.0,
    maxReference: 1.5,
    unit: "log10",
    status: "ALTO",
  },
];

// --- VISTA PACIENTE: Explicativa, clara y enfocada en hábitos ---
export const PatientView: React.FC = () => (
  <div className="space-y-4">
    <DysbiosisTrafficLight level="LEVE" diversityIndex={6.4} desplegable={true} />

    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-3">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
        Plan Sugerido
      </h3>
      <ul className="space-y-2 text-xs text-slate-600">
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Aumentar ingesta de fibra prebiótica (alcachofas, avena, plátano verde).
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Incorporar polifenoles (frutos rojos, té verde, cacao puro &gt;85%).
        </li>
      </ul>
    </div>
  </div>
);

// --- VISTA DOCTOR: Diagnóstica y cuantitativa ---
export const DoctorView: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between px-1">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Informe del Paciente</h3>
        <p className="text-[11px] text-slate-400">ID: #PX-8921 • Muestra: 24/08/2026</p>
      </div>
      <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200/60">
        Revisión Pendiente
      </span>
    </div>

    <DysbiosisTrafficLight level="LEVE" diversityIndex={6.4} desplegable={true} />

    <div className="space-y-2">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
        Biomarcadores Críticos ({MOCK_BIOMARKERS.length})
      </span>
      {MOCK_BIOMARKERS.map((bm) => (
        <BiomarkerClinicalBar key={bm.id} biomarker={bm} />
      ))}
    </div>
  </div>
);

// --- VISTA CLÍNICA: Gestión operacional y métricas globales ---
export const ClinicView: React.FC = () => (
  <div className="space-y-4">
    {/* Métricas clave resumidas */}
    <div className="grid grid-cols-3 gap-3">
      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
        <span className="text-[10px] text-slate-400 font-medium block">Informes Totales</span>
        <span className="text-lg font-bold text-slate-900">1,248</span>
      </div>
      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
        <span className="text-[10px] text-slate-400 font-medium block">Disbiosis Severa</span>
        <span className="text-lg font-bold text-rose-600">14%</span>
      </div>
      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
        <span className="text-[10px] text-slate-400 font-medium block">Tiempo Medio</span>
        <span className="text-lg font-bold text-slate-900">24h</span>
      </div>
    </div>

    {/* Lista de últimos análisis */}
    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-3">
      <h3 className="text-xs font-bold text-slate-800">Actividad Reciente</h3>
      <div className="divide-y divide-slate-100 text-xs">
        {[
          { name: "Ana Martínez", date: "Hoy, 10:30", status: "Óptimo", color: "text-emerald-600" },
          { name: "Carlos Ruiz", date: "Hoy, 09:15", status: "Disbiosis Severa", color: "text-rose-600" },
          { name: "Elena Gómez", date: "Ayer", status: "Desequilibrio Leve", color: "text-amber-600" },
        ].map((item, i) => (
          <div key={i} className="py-2 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">{item.name}</p>
              <p className="text-[10px] text-slate-400">{item.date}</p>
            </div>
            <span className={`font-semibold text-[11px] ${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);