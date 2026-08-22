<h1 align="center">🧬 Gestor de Informes Clínicos — Plataforma Full‑Stack</h1>
<p align="center">
  <b>Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui · Kotlin · Spring Boot</b>
</p>

---

## 📘 Descripción General

El **Gestor de Informes Clínicos** es una plataforma full‑stack diseñada para visualizar, analizar y generar informes clínicos accionables a partir de datos biomédicos.  
Está pensada para profesionales de la salud que necesitan identificar rápidamente:

- Alteraciones relevantes en biomarcadores  
- Índices de salud global  
- Recomendaciones de intervención  
- Evolución del paciente a lo largo del tiempo  

La plataforma está diseñada para ser **modular y extensible**, permitiendo integrar distintos tipos de análisis clínicos:  
microbiota, genética, metabolómica, hematología, paneles funcionales, etc.

Este repositorio contiene **dos proyectos independientes**:

- **frontend/** → Dashboard clínico en Next.js 16  
- **backend/** → API REST en Kotlin + Spring Boot  

---

## 📂 Estructura del Repositorio

```bash
gestor-informes-clinicos/
│
├── frontend/        # Dashboard clínico (Next.js 16)
│   └── README.md
│
├── backend/         # API REST (Kotlin + Spring Boot)
│   └── README.md
│
└── README.md        # Este archivo (documentación global)
```


Cada módulo tiene su propio README con instrucciones específicas.

---

## 🧱 Tecnologías

### **Frontend**
- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui
- Cliente HTTP centralizado (`lib/api.ts`)
- Componentes clínicos personalizados (semáforo, barras de rango, tablas de biomarcadores)

### **Backend**
- Kotlin
- Spring Boot 

---
## 🧪 Estado del Proyecto

El Gestor de Informes Clínicos se encuentra actualmente en su fase inicial de desarrollo.

### 🔹 Backend (Kotlin + Spring Boot)
- Estado: **Pendiente de implementación**
- El desarrollo del backend comenzará hoy mismo.
- Se definirá la arquitectura base, modelos clínicos y endpoints iniciales.
- La API aún no está disponible, pero el diseño está en proceso.

### 🔹 Frontend (Next.js 16 + TypeScript)
- Estado: **En construcción**
- Se ha iniciado la estructura del proyecto y la configuración base (App Router, Tailwind, shadcn/ui).
- Se están preparando las primeras vistas para disponer de una interfaz visual inicial.
- El cliente HTTP y los componentes clínicos se implementarán en las próximas fases.

### 🔹 Objetivo a corto plazo
- Establecer la comunicación frontend ↔ backend.
- Definir los tipos clínicos y modelos de datos.
- Construir las primeras pantallas funcionales del dashboard.
- Publicar una versión mínima navegable para revisión interna.

### 🔹 Objetivo a medio plazo
- Integrar módulos clínicos (microbiota, genética, metabolómica, etc.).
- Añadir componentes visuales avanzados (rangos clínicos, semáforos, tablas dinámicas).
- Preparar la plataforma para despliegue y pruebas con datos reales.



