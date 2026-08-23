"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export const LoginForm: React.FC = () => {
  const { login, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState<string>("doctor@microbioma.com");
  const [password, setPassword] = useState<string>("password123");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  const handleQuickSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    clearError();
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto font-black text-xl">
          µ
        </div>
        <h1 className="text-xl font-bold text-slate-900">Portal Microbioma Clínico</h1>
        <p className="text-xs text-slate-500">Inicia sesión con tus credenciales asignadas</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            placeholder="usuario@microbioma.com"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "Verificando..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Selector de credenciales Demo */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
          Acceso Rápido de Prueba (Demo)
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickSelect("doctor@microbioma.com")}
            className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-[11px] font-semibold text-slate-700 text-center transition-all cursor-pointer"
          >
            Doctor
          </button>
          <button
            onClick={() => handleQuickSelect("paciente@microbioma.com")}
            className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-[11px] font-semibold text-slate-700 text-center transition-all cursor-pointer"
          >
            Paciente
          </button>
          <button
            onClick={() => handleQuickSelect("clinica@microbioma.com")}
            className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-[11px] font-semibold text-slate-700 text-center transition-all cursor-pointer"
          >
            Clínica
          </button>
        </div>
      </div>
    </div>
  );
};