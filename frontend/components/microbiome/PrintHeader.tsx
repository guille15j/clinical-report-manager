import React from "react";

interface Props {
  patientName?: string;
  patientId?: string;
  date?: string;
}

export const PrintHeader: React.FC<Props> = ({
  patientName = "Ana Martínez",
  patientId = "PX-8921",
  date = "24 de Agosto, 2026",
}) => {
  return (
    <div className="hidden print:block mb-6 pb-4 border-b border-slate-300">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Informe de Microbioma Intestinal
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Laboratorio de Análisis Secuencial 16S / Metagenómica
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold text-slate-900">Centro Médico de Microbiótica</p>
          <p className="text-slate-500">Licencia Sanit: #CS-99401</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-200">
        <div>
          <span className="text-slate-400 block text-[10px]">PACIENTE</span>
          <span className="font-semibold text-slate-800">{patientName}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">ID MUESTRA</span>
          <span className="font-semibold text-slate-800">{patientId}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">FECHA EMISIÓN</span>
          <span className="font-semibold text-slate-800">{date}</span>
        </div>
      </div>
    </div>
  );
};