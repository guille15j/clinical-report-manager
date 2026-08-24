"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { DysbiosisTrafficLight } from "@/components/microbiome/DysbiosisSemaforo";
import { BiomarkerClinicalBar } from "@/components/microbiome/BiomarkerClinicalBar";
import { ActionPlanCard } from "@/components/microbiome/ActionPlanCard";
import { PrintHeader } from "@/components/microbiome/PrintHeader";
import { PrintFooter } from "@/components/microbiome/PrintFooter";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { MOCK_DOCTORS, MOCK_PATIENTS, MOCK_REPORTS } from "@/lib/mockData";
import { STATUS_THEME } from "@/lib/statusTheme";
import { AnalysisStatus, Biomarker, MicrobiomeReport } from "@/types/microbiome";
 
const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

const buildActionPlan = (report: MicrobiomeReport) => ({
  dietaryInterventions: report.actionPlan.filter((i) => i.category === "NUTRICION").map((i) => `${i.title}: ${i.description}`),
  supplements: report.actionPlan.filter((i) => i.category === "SUPLEMENTACION").map((i) => `${i.title}: ${i.description}`),
  exclusions: report.actionPlan.filter((i) => i.category === "LIFESTYLE").map((i) => `${i.title}: ${i.description}`),
});

export const PatientView: React.FC = () => {
  const { user } = useAuth();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const myReports = useMemo(() => MOCK_REPORTS.filter((r) => r.patientId === user?.patientId), [user?.patientId]);
  const latestPublished = useMemo(
    () => myReports.filter((r) => r.status === "PUBLICADO").sort((a, b) => (a.analysisDate < b.analysisDate ? 1 : -1))[0],
    [myReports]
  );
  const inProgress = useMemo(
    () => myReports.filter((r) => r.status !== "PUBLICADO").sort((a, b) => (a.analysisDate < b.analysisDate ? 1 : -1))[0],
    [myReports]
  );

  const toggleItem = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  if (!latestPublished && !inProgress) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-100 text-center space-y-2">
        <p className="text-sm font-semibold text-slate-700">Aún no tienes ningún análisis registrado</p>
        <p className="text-xs text-slate-400">Contacta con tu doctor asignado para solicitar tu primer kit de muestra.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inProgress && (
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-800">Nuevo análisis en curso</p>
            <p className="text-[11px] text-slate-400">
              Muestra {formatDate(inProgress.analysisDate)} • se notificará al publicarse
            </p>
          </div>
          <Badge variant="outline" className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_THEME[inProgress.status].className}`}>
            {STATUS_THEME[inProgress.status].label}
          </Badge>
        </div>
      )}

      {latestPublished ? (
        <>
          <PrintHeader patientName={user?.name} patientId={latestPublished.patientId} date={formatDate(latestPublished.analysisDate)} />
          <DysbiosisTrafficLight level={latestPublished.dysbiosisLevel} diversityIndex={latestPublished.diversityIndex} desplegable={true} />
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tu Plan de Acción</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {latestPublished.actionPlan.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={() => toggleItem(item.id)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 accent-emerald-600 cursor-pointer"
                  />
                  <span className={checked[item.id] ? "line-through text-slate-400" : ""}>
                    <span className="font-semibold text-slate-700">{item.title}: </span>
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <PrintFooter reportId={latestPublished.patientId} signedAt={formatDate(latestPublished.analysisDate)} />
        </>
      ) : (
        <p className="text-xs text-slate-400 text-center py-6">
          Tu primer informe se mostrará aquí en cuanto tu doctor lo publique.
        </p>
      )}
    </div>
  );
};

export const DoctorView: React.FC = () => {
  const { user } = useAuth();
  const doctor = useMemo(() => MOCK_DOCTORS.find((d) => d.userId === user?.id), [user?.id]);

  const [reports, setReports] = useState<MicrobiomeReport[]>(MOCK_REPORTS);
  const [filter, setFilter] = useState<"ALL" | AnalysisStatus>("ALL");

  const myPatientIds = useMemo(
    () => MOCK_PATIENTS.filter((p) => p.doctorId === doctor?.id).map((p) => p.id),
    [doctor?.id]
  );

  const myReports = useMemo(() => reports.filter((r) => myPatientIds.includes(r.patientId)), [reports, myPatientIds]);

  const filteredReports = useMemo(
    () => (filter === "ALL" ? myReports : myReports.filter((r) => r.status === filter)),
    [myReports, filter]
  );

  const [selectedId, setSelectedId] = useState<string>(filteredReports[0]?.id ?? "");
  const selectedReport = myReports.find((r) => r.id === selectedId) ?? filteredReports[0];

  const advanceStatus = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.status === "SOLICITADO") return { ...r, status: "PROCESANDO" };
        if (r.status === "PROCESANDO") return { ...r, status: "PENDIENTE" };
        return r;
      })
    );
  };

  const publishReport = (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "PUBLICADO" } : r)));
  };

  const pendingCount = myReports.filter((r) => r.status === "PENDIENTE").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Cola de Revisión Clínica</h3>
          <p className="text-[11px] text-slate-400">
            {doctor?.name} • {pendingCount} informe(s) pendiente(s) de tu revisión
          </p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="ALL">Todos</TabsTrigger>
          <TabsTrigger value="SOLICITADO">Solicitados</TabsTrigger>
          <TabsTrigger value="PROCESANDO">Procesando</TabsTrigger>
          <TabsTrigger value="PENDIENTE">Pendientes</TabsTrigger>
          <TabsTrigger value="PUBLICADO">Publicados</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-4 items-start">
        {/* Columna izquierda  cola de informes */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-400">Paciente</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-400">Fecha</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-400">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-xs text-slate-400 py-6">
                    No hay informes en este estado
                  </TableCell>
                </TableRow>
              )}
              {filteredReports.map((report) => (
                <TableRow
                  key={report.id}
                  onClick={() => setSelectedId(report.id)}
                  className={`cursor-pointer transition-colors ${
                    report.id === selectedReport?.id ? "bg-slate-50" : "hover:bg-slate-50/60"
                  }`}
                >
                  <TableCell className="text-xs font-semibold text-slate-800">
                    {report.patientName}
                    <p className="text-[10px] text-slate-400 font-mono font-normal">{report.trackingCode}</p>
                  </TableCell>
                  <TableCell className="text-[11px] text-slate-500">{report.analysisDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_THEME[report.status].className}`}>
                      {STATUS_THEME[report.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Columna derecha detalle del informe */}
        <div className="min-w-0">
          {selectedReport ? (
            <div className="space-y-4">
              <PrintHeader patientName={selectedReport.patientName} patientId={selectedReport.patientId} date={formatDate(selectedReport.analysisDate)} />

              <div className="flex items-center justify-between px-1 print:hidden">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Informe del Paciente</h3>
                  <p className="text-[11px] text-slate-400">
                    {selectedReport.patientName} • {selectedReport.trackingCode} • Muestra: {selectedReport.analysisDate}
                  </p>
                </div>

                {selectedReport.status === "PENDIENTE" && (
                  <button
                    onClick={() => publishReport(selectedReport.id)}
                    className="py-1.5 px-3.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer"
                  >
                    Publicar Informe
                  </button>
                )}

                {(selectedReport.status === "SOLICITADO" || selectedReport.status === "PROCESANDO") && (
                  <button
                    onClick={() => advanceStatus(selectedReport.id)}
                    className="py-1.5 px-3.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer"
                  >
                    Avanzar Estado (Demo)
                  </button>
                )}
              </div>

              {selectedReport.biomarkers.length > 0 ? (
                <>
                  <DysbiosisTrafficLight level={selectedReport.dysbiosisLevel} diversityIndex={selectedReport.diversityIndex} desplegable={true} />

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        Biomarcadores Críticos ({selectedReport.biomarkers.length})
                      </span>
                      {selectedReport.biomarkers.map((bm: Biomarker) => (
                        <BiomarkerClinicalBar key={bm.id} biomarker={bm} />
                      ))}
                    </div>

                    <ActionPlanCard plan={buildActionPlan(selectedReport)} />
                  </div>

                  <PrintFooter doctorName={doctor?.name} reportId={selectedReport.patientId} signedAt={formatDate(selectedReport.analysisDate)} />
                </>
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-slate-100 text-xs text-slate-400 italic print:hidden">
                  La muestra aún no ha sido procesada por el laboratorio.
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-slate-100 text-center text-xs text-slate-400">
              Selecciona un informe de la lista para ver el detalle.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ClinicView: React.FC = () => {
  const totalPatients = MOCK_PATIENTS.length;
  const severePct = Math.round((MOCK_PATIENTS.filter((p) => p.dysbiosisLevel === "SEVERO").length / totalPatients) * 100);
  const publishedCount = MOCK_REPORTS.filter((r) => r.status === "PUBLICADO").length;

  const recent = [...MOCK_REPORTS].sort((a, b) => (a.analysisDate < b.analysisDate ? 1 : -1)).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-medium block">Pacientes Totales</span>
          <span className="text-xl font-bold text-slate-900">{totalPatients}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-medium block">Disbiosis Severa</span>
          <span className="text-xl font-bold text-rose-600">{severePct}%</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-medium block">Informes Publicados</span>
          <span className="text-xl font-bold text-slate-900">{publishedCount}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-medium block">Doctores Activos</span>
          <span className="text-xl font-bold text-slate-900">{MOCK_DOCTORS.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800">Equipo Médico</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {MOCK_DOCTORS.map((doc) => (
              <div key={doc.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{doc.name}</p>
                  <p className="text-[10px] text-slate-400">{doc.specialty}</p>
                </div>
                <span className="font-semibold text-[11px] text-slate-600">
                  {MOCK_PATIENTS.filter((p) => p.doctorId === doc.id).length} pacientes
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800">Actividad Reciente</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {recent.map((r) => (
              <div key={r.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{r.patientName}</p>
                  <p className="text-[10px] text-slate-400">{r.analysisDate}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_THEME[r.status].className}`}>
                  {STATUS_THEME[r.status].label}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href="/patients"
        className="block text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
      >
        Gestionar Pacientes y Doctores
      </Link>
    </div>
  );
};