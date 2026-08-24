// components/dashboards/DashboardNav.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";

const ROLE_LABELS: Record<UserRole, string> = {
  doctor: "Doctor",
  paciente: "Paciente",
  clinica: "Clínica",
};

interface Props {
  children: React.ReactNode;
  actions?: React.ReactNode;
  /** Ancho máximo del contenido dentro del shell. Por defecto ocupa todo el ancho disponible. */
  contentClassName?: string;
}

export const DashboardShell: React.FC<Props> = ({ children, actions, contentClassName }) => {
  const { user, role, logout } = useAuth();
  const pathname = usePathname();

  if (!user || !role) return <>{children}</>;

  const links = [
    { href: "/", label: "Panel" },
    ...(role !== "paciente" ? [{ href: "/patients", label: "Pacientes" }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex print:bg-white print:block">
      {/* Sidebar fija — escritorio */}
      <aside className="hidden md:flex md:w-60 lg:w-72 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white px-5 py-6 print:hidden">
        <div className="space-y-8">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
              µ
            </div>
            <span className="text-sm font-bold text-slate-900 leading-tight">
              Portal Microbioma
            </span>
          </div>

          <nav className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors ${
                  pathname === l.href
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs capitalize shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400">{ROLE_LABELS[role]}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 rounded-xl transition-all cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Barra superior — móvil */}
        <div className="md:hidden flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200/80 print:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-[11px] capitalize shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400">{ROLE_LABELS[role]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            <button
              onClick={logout}
              className="py-1.5 px-2.5 text-[11px] font-semibold text-rose-600 bg-rose-50 rounded-lg cursor-pointer"
            >
              Salir
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-1 px-4 py-2 bg-white border-b border-slate-200/80 print:hidden overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                pathname === l.href ? "bg-slate-900 text-white" : "text-slate-500 bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Barra de acciones — escritorio */}
        {actions && (
          <header className="hidden md:flex items-center justify-end gap-2 px-6 lg:px-10 py-4 border-b border-slate-200/70 bg-white/60 print:hidden">
            {actions}
          </header>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-10 print:p-0 print:min-h-0">
          <div className={contentClassName ?? "w-full max-w-7xl mx-auto print:max-w-full"}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};