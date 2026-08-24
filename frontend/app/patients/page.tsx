// app/patients/page.tsx (solo cambian los imports, resto exactamente igual)
"use client";

import React, { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/loginForm";
import { DashboardShell } from "@/components/dashboards/DashboardNav";
import { STATUS_THEME, DYSBIOSIS_DOT } from "@/lib/statusTheme";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { MOCK_DOCTORS, MOCK_PATIENTS } from "@/lib/mockData";
import { Patient } from "@/types/microbiome";
 


export default function PatientsPage() {
  const { user, role, isLoading } = useAuth();
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "F" as Patient["gender"] });

  const doctor = useMemo(() => MOCK_DOCTORS.find((d) => d.userId === user?.id), [user?.id]);

  const visiblePatients = useMemo(() => {
    if (role === "doctor") return patients.filter((p) => p.doctorId === doctor?.id);
    return patients;
  }, [patients, role, doctor?.id]);

  const handleAddPatient = () => {
    if (!form.name.trim() || !form.age) return;
    const newPatient: Patient = {
      id: `PAT-${Math.floor(Math.random() * 90000 + 10000)}`,
      doctorId: role === "doctor" ? doctor?.id ?? null : null,
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
    };
    setPatients((prev) => [newPatient, ...prev]);
    setForm({ name: "", age: "", gender: "F" });
    setIsAddOpen(false);
  };

  const handleAssignDoctor = (patientId: string, doctorId: string) => {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, doctorId } : p)));
  };

  const handleRequestAnalysis = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: "SOLICITADO", lastAnalysisDate: new Date().toISOString().slice(0, 10) }
          : p
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
        Cargando portal...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    );
  }

  if (role === "paciente") {
    return (
      <DashboardShell contentClassName="w-full max-w-2xl mx-auto">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
          No tienes acceso a la gestión de pacientes.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6 dark">
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-sm font-bold text-slate-900">Gestión de Pacientes</h1>
            <p className="text-[11px] text-slate-400">
              {role === "clinica"
                ? "Administra pacientes y asigna doctores responsables."
                : "Pacientes bajo tu seguimiento clínico."}
            </p>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button className="py-1.5 px-3.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
                + Nuevo Paciente
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Paciente</DialogTitle>
                <DialogDescription>Añade un nuevo paciente al sistema para iniciar su seguimiento.</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Nombre completo</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    placeholder="Nombre y apellidos"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Edad</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 block">Género</label>
                    <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v as Patient["gender"] }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="F">Femenino</SelectItem>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="OTRO">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <button
                  onClick={handleAddPatient}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Guardar Paciente
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-400">Paciente</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-400">Edad / Género</TableHead>
                {role === "clinica" && (
                  <TableHead className="text-[11px] uppercase tracking-wider text-slate-400">Doctor</TableHead>
                )}
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-400">Últ. Análisis</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-400">Estado</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-slate-400" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiblePatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-600">
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{patient.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{patient.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[11px] text-slate-500">
                    {patient.age} años • {patient.gender}
                  </TableCell>
                  {role === "clinica" && (
                    <TableCell>
                      <Select value={patient.doctorId ?? "none"} onValueChange={(v) => handleAssignDoctor(patient.id, v)}>
                        <SelectTrigger className="h-7 text-[11px] w-40">
                          <SelectValue placeholder="Sin asignar" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_DOCTORS.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id} className="text-xs">
                              {doc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}
                  <TableCell className="text-[11px] text-slate-500">{patient.lastAnalysisDate ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {patient.dysbiosisLevel && <span className={`w-2 h-2 rounded-full ${DYSBIOSIS_DOT[patient.dysbiosisLevel]}`} />}
                      {patient.status ? (
                        <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_THEME[patient.status].className}`}>
                          {STATUS_THEME[patient.status].label}
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Sin análisis</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-700 px-1.5 cursor-pointer">•••</button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRequestAnalysis(patient.id)}>Solicitar Análisis</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  );
}