"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  doctorName?: string;
  medicalId?: string;
  signedAt?: string;
  documentHash?: string;
  reportId?: string;
}

export const PrintFooter: React.FC<Props> = ({
  doctorName = "Dr. M. Colomer",
  medicalId = "Col. nº 28401",
  signedAt = "24/08/2026 11:30:15 CEST",
  documentHash = "SHA256: 8f9b-3e1a-9412-a0b2",
  reportId = "PX-8921",
}) => {
  // URL real codificada en el QR para validación médica
  // const verificationUrl = `https://microbiome-reports.com/verify?id=${reportId}&hash=${encodeURIComponent(
  //   documentHash
  // )}`;
  const verificationUrl = 'https://portfolio-personal-black-ten.vercel.app/';

  return (
    <div className="hidden print:block pt-6 mt-6 border-t border-slate-200">
      <div className="flex items-end justify-between gap-6">
        
        {/* QR Escaneable Real */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white border border-slate-300 rounded-lg shrink-0 flex items-center justify-center">
            <QRCodeSVG
              value={verificationUrl}
              size={64}
              level="M"
              includeMargin={false}
            />
          </div>

          <div className="text-[10px] text-slate-500 space-y-0.5 leading-tight">
            <p className="font-bold text-slate-800">Verificación de Autenticidad</p>
            <p className="text-slate-500">Escanee para validar la firma digital en el nodo central.</p>
            <p className="font-mono text-[9px] text-slate-400 pt-0.5">{documentHash}</p>
          </div>
        </div>

        {/* Firma Digital del Facultativo */}
        <div className="text-right text-xs">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200/80 rounded text-[10px] font-semibold text-emerald-700 mb-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Firmado Digitalmente
          </div>
          
          <p className="font-bold text-slate-900">{doctorName}</p>
          <p className="text-[10px] text-slate-500">{medicalId}</p>
          <p className="text-[9px] text-slate-400 font-mono mt-0.5">{signedAt}</p>
        </div>

      </div>

      <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between text-[9px] text-slate-400 font-medium">
        <span>Documento clínico confidencial — Cumplimiento RGPD / HIPAA</span>
        <span>Página 1 de 1</span>
      </div>
    </div>
  );
};