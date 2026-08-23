"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/loginForm";
import { PatientView, DoctorView, ClinicView } from "@/components/dashboards/RoleViews";
import { PrintButton } from "@/components/ui/PrintButton";
import { PrintHeader } from "@/components/microbiome/PrintHeader";
import { PrintFooter } from "@/components/microbiome/PrintFooter";

function DashboardContent() {
  const { user, role, logout, isLoading } = useAuth();

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

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 sm:p-8 flex flex-col items-center print:bg-white print:p-0 print:min-h-0 print:h-auto">
      <div className="w-full max-w-lg space-y-6 print:max-w-full print:space-y-3 print:h-full print:flex print:flex-col print:justify-between">
        
        <div>
          {/* Barra superior de Usuario autenticado (Oculta al imprimir) */}
          <div className="flex items-center justify-between gap-3 print:hidden mb-6 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs capitalize">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">Rol: {role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PrintButton />
              <button
                onClick={logout}
                className="py-1.5 px-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 rounded-xl transition-all cursor-pointer"
              >
                Salir
              </button>
            </div>
          </div>

          <PrintHeader />

          {/* Renderizado condicional automático según Rol */}
          <div className="print:block print:space-y-2">
            {role === "paciente" && <PatientView />}
            {role === "doctor" && <DoctorView />}
            {role === "clinica" && <ClinicView />}
          </div>
        </div>

        <PrintFooter />

      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}