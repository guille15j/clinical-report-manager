"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/loginForm";
import { PatientView, DoctorView, ClinicView } from "@/components/dashboards/RoleViews";
import { PrintButton } from "@/components/ui/PrintButton";
import { DashboardShell } from "@/components/dashboards/DashboardNav";

export default function Home() {
  const { user, role, isLoading } = useAuth();

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

  // El informe del paciente se presenta como documento centrado; doctor y clínica aprovechan todo el ancho
  const contentClassName =
    role === "paciente"
      ? "w-full max-w-2xl mx-auto print:max-w-full"
      : "w-full max-w-7xl mx-auto print:max-w-full";

  return (
    <DashboardShell actions={<PrintButton />} contentClassName={contentClassName}>
      <div className="print:block print:space-y-2 space-y-2">
        {role === "paciente" && <PatientView />}
        {role === "doctor" && <DoctorView />}
        {role === "clinica" && <ClinicView />}
      </div>
    </DashboardShell>
  );
}