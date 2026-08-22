```markdown
<h1 align="center">🧬 Informes Clínicos</h1>
<p align="center">
  <span style="color:#0EA5E9"><b>Next.js 16 · App Router · TypeScript · Tailwind CSS · shadcn/ui</b></span>
</p>

---

## 📑 Índice

- [Descripción](#descripción)
- [Arquitectura Frontend](#arquitectura-frontend)
- [Stack Técnico](#stack-técnico)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Tipos de dominio](#tipos-de-dominio)
- [Cliente de API](#cliente-de-api)
- [Componentes UI clave](#componentes-ui-clave)
- [Páginas del Dashboard](#páginas-del-dashboard)
- [Guías de desarrollo](#guías-de-desarrollo)

---

## 📘 Descripción

Panel clínico para interpretar datos de informes clínicos y convertirlos en informes accionables para profesionales de la salud.  
El objetivo principal es que el clínico pueda identificar en menos de 3 segundos:

- Nivel de disbiosis intestinal.
- Biomarcadores alterados.
- Pautas de tratamiento sugeridas.

El frontend consume un backend en Spring Boot usando la cabecera HTTP:

```http
X-API-VERSION: 1
```

---

## 🧱 Arquitectura Frontend

- **Framework:** Next.js 16 con App Router (`/app`).
- **Lenguaje:** TypeScript con tipado estricto.
- **Estilos:** Tailwind CSS.
- **UI Kit:** shadcn/ui para componentes accesibles y consistentes.
- **API Layer:** Cliente centralizado en `lib/api.ts` con manejo de errores y estados de carga.

---

## 🛠️ Stack Técnico

- **Next.js 16 (App Router)**
- **TypeScript (strict)**
- **Tailwind CSS**
- **shadcn/ui**
- **Spring Boot backend (REST)**

---

## 📂 Estructura de Carpetas

```bash
src/
├── app/
│   ├── patients/
│   │   ├── page.tsx               # Vista de listado de pacientes (/patients)
│   │   └── [id]/
│   │       └── page.tsx           # Vista dinámica del informe del paciente (/patients/[id])
│   ├── layout.tsx                 # Contenedor raíz
│   └── page.tsx                   # Página de inicio / Redirección
├── components/
│   ├── ui/                        # Componentes átomo de shadcn/ui (Button, Card, Table...)
│   └── microbiome/                # Componentes de dominio clínico (Semáforo, Barra de Rango)
├── lib/
│   └── api.ts                     # Cliente HTTP centralizado para conectar con Spring Boot
└── types/
    └── microbiome.ts              # Tipado estricto de datos (Interfaces / DTOs)
```

---

## 🧬 Tipos de dominio (`types/microbiome.ts`)

Los tipos de dominio definen la estructura de los datos clínicos y garantizan que no se muestren métricas incorrectas:

- **Paciente:** Identificación y estado de revisión.
- **Biomarcador:** Bacteria, valor medido y rango saludable.
- **Resumen clínico:** Índice de diversidad, nivel de disbiosis y plan de acción.

---

## 🌐 Cliente de API (`lib/api.ts`)

El cliente HTTP:

- Añade siempre `X-API-VERSION: 1`.
- Centraliza `fetch` y manejo de errores.
- Expone funciones tipadas para:
  - Listar pacientes.
  - Obtener informe detallado de un paciente.

---

## 🎨 Componentes UI clave

### 1. Semáforo de Disbiosis (`health-traffic-light.tsx`)

Componente visual que representa el estado de salud intestinal:

- **Verde:** Óptimo.
- **Naranja:** Disbiosis leve.
- **Rojo:** Alerta.

Se muestra en la parte superior del informe y se alimenta de un nivel de disbiosis tipado (`"optimal" | "mild" | "severe"`).

### 2. Barra de Rango Clínico (`clinical-range-bar.tsx`)

Componente gráfico que sitúa la abundancia bacteriana del paciente dentro o fuera del rango de referencia:

- Muestra:
  - Rango mínimo y máximo saludable.
  - Valor actual del paciente.
- Usa código de colores para indicar:
  - Dentro de rango.
  - Por debajo.
  - Por encima.

---

## 📊 Páginas del Dashboard (App Router)

### `/patients`

- **Propósito:** Listado de pacientes y estado de revisión de sus análisis.
- **Componentes:**
  - `Table` (shadcn/ui) para filas de pacientes.
  - `Badge` para estado (Pendiente, Revisado, Alerta).
  - `Input` para buscador por nombre/ID.

### `/patients/[id]`

- **Propósito:** Informe clínico accionable.
- **Componentes:**
  - `Card` para secciones de resumen.
  - `Progress` para índice global de diversidad/salud.
  - `Alert` para avisos clínicos relevantes.
  - `Table` + `Badge` para desglose de biomarcadores:
    - Ej.: *Akkermansia muciniphila*, *Bifidobacterium*.
    - Comparación valor medido vs rango saludable.
  - Bloque de **Plan de Acción**:
    - Recomendaciones nutricionales.
    - Sugerencias de suplementación.

---

## 📌 Guías de desarrollo

- **Tipado estricto:** No se renderiza ninguna métrica sin tipo explícito en `microbiome.ts`.
- **Manejo de estados:**
  - `loading`, `error`, `success` en cada vista.
- **Consistencia visual:**
  - Tailwind + shadcn/ui para mantener un diseño clínico, claro y profesional.
- **Seguridad semántica:**
  - Los componentes de salud (semáforo, barra de rango) solo aceptan valores tipados y validados.

---

