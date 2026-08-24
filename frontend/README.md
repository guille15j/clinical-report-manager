# Gestor de Informes Clínicos — Frontend

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-Radix-000000" alt="shadcn/ui" />
</p>

Dashboard clínico construido sobre **Next.js 16 (App Router)** cuyo objetivo de diseño es que un profesional sanitario identifique en menos de 3 segundos: nivel de disbiosis, biomarcadores alterados y pauta de intervención sugerida.

---

## 📑 Índice

- [Stack Técnico](#-stack-técnico)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Portales por Rol](#-portales-por-rol)
- [Componentes Clínicos Destacados](#-componentes-clínicos-destacados)
- [Modelado de Tipos](#-modelado-de-tipos-typesmicrobiomets)
- [Cliente de API](#-cliente-de-api-libapits)
- [Instalación y Scripts](#-instalación-y-scripts)

---

## 🛠️ Stack Técnico

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Client/Server Components) |
| Lenguaje | TypeScript en modo `strict`, sin `any` |
| Estilos | Tailwind CSS |
| UI Kit | shadcn/ui (Radix primitives) |
| Estado de sesión | Context API (`AuthContext`) |
| Cliente HTTP | `fetch` centralizado en `lib/api.ts` con Bearer JWT |

---

## 📂 Estructura de Carpetas

```bash
frontend/
├── app/
│   ├── page.tsx                    # Entrypoint — enruta al portal según rol
│   ├── layout.tsx                  # Layout raíz, fuentes, providers globales
│   ├── globals.css
│   └── patients/
│       └── page.tsx                # Gestión de pacientes (Clínica / Doctor)
│
├── components/
│   ├── auth/
│   │   └── loginForm.tsx           # Formulario de acceso + selector demo por rol
│   ├── dashboards/
│   │   ├── DashboardNav.tsx        # Shell de navegación (sidebar + topbar responsive)
│   │   └── RoleViews.tsx           # PatientView / DoctorView / ClinicView
│   ├── microbiome/
│   │   ├── DysbiosisSemaforo.tsx   # Estado de disbiosis (semáforo clínico)
│   │   ├── BiomarkerClinicalBar.tsx# Barra de rango por biomarcador
│   │   ├── ActionPlanCard.tsx      # Plan de intervención estructurado
│   │   ├── PrintHeader.tsx         # Cabecera de documento para impresión/PDF
│   │   └── PrintFooter.tsx         # Firma digital + QR de verificación
│   └── ui/                         # Primitivas shadcn/ui (Card, Table, Badge, Dialog...)
│
├── context/
│   └── AuthContext.tsx             # Sesión, rol activo, login/logout
│
├── lib/
│   ├── api.ts                      # Cliente REST tipado (Auth/Doctor/Clinic/Patient/Report Services)
│   ├── mockData.ts                 # Fixtures de desarrollo (usuarios, pacientes, informes)
│   └── utils.ts                    # Helpers (cn, formateo)
│
├── services/
│   └── authService.ts              # Adaptador de autenticación (mock → sustituible por API real)
│
└── types/
    ├── auth.ts                     # Contratos de sesión y usuario
    └── microbiome.ts                # Contratos de dominio clínico
```

---

## 👥 Portales por Rol

El App Router no expone rutas por rol vía URL segmentada; en su lugar, `app/page.tsx` renderiza condicionalmente una vista dedicada según `role` del `AuthContext`, evitando lógica de permisos dispersa:

| Vista | Rol | Responsabilidad |
|---|---|---|
| `PatientView` | `paciente` | Consulta de último informe publicado, plan de acción interactivo, exportación a PDF |
| `DoctorView` | `doctor` | Cola de revisión por estado, avance de ciclo de vida, publicación de informes |
| `ClinicView` | `clinica` | Métricas operacionales, gestión de equipo médico y asignación de pacientes |

`app/patients/page.tsx` es la única ruta compartida entre `doctor` y `clinica`, con columnas y acciones condicionadas por rol (p. ej. reasignación de doctor solo visible para `clinica`).

---

## 🎨 Componentes Clínicos Destacados

### `DysbiosisSemaforo.tsx`

Representa el estado de disbiosis intestinal (`OPTIMO` · `LEVE` · `SEVERO`) como semáforo clínico desplegable, con índice de diversidad de Shannon normalizado sobre 10. El componente es puramente presentacional: recibe `level: ImbalanceLevel` tipado y nunca infiere estados a partir de valores crudos, delegando esa lógica al backend.

### `BiomarkerClinicalBar.tsx`

Visualiza cada biomarcador como una barra de rango: zona saludable de referencia (`min_ref`–`max_ref`) superpuesta al valor actual del paciente, con codificación de color por `BiomarkerStatus` (`NORMAL` · `ALTO` · `BAJO`). La escala se recalcula dinámicamente para acomodar valores fuera de rango sin distorsionar la referencia visual.

### `ActionPlanCard.tsx`

Estructura el plan de intervención en tres bloques clínicos independientes — ajustes nutricionales, suplementación específica y exclusiones temporales — derivados de `ActionPlanItem[]` agrupados por `category`. Diseñado para renderizar tanto en pantalla como en la vista de impresión.

### Motor de impresión (`PrintHeader` + `PrintFooter`)

Par de componentes con clases `print:` de Tailwind que transforman el dashboard interactivo en un documento clínico exportable a PDF vía `window.print()`:

- `PrintHeader`: cabecera institucional con identificación de paciente, muestra y fecha de emisión.
- `PrintFooter`: firma digital del facultativo + código QR de verificación de autenticidad (hash del documento), garantizando trazabilidad del informe fuera de la plataforma.

---

## 🧬 Modelado de Tipos (`types/microbiome.ts`)

Tipado estricto que actúa como contrato entre frontend y backend, evitando la propagación de estados o niveles clínicos no controlados:

```typescript
export type ImbalanceLevel = "OPTIMO" | "LEVE" | "SEVERO";
export type AnalysisStatus = "SOLICITADO" | "PROCESANDO" | "PENDIENTE" | "PUBLICADO";
export type BiomarkerStatus = "NORMAL" | "ALTO" | "BAJO";

export interface MicrobiomeReport {
  id: string;
  patientId: string;
  trackingCode: string;
  analysisDate: string;
  diversityIndex: number;
  dysbiosisLevel: ImbalanceLevel;
  status: AnalysisStatus;
  biomarkers: Biomarker[];
  actionPlan: ActionPlanItem[];
}

export interface Biomarker {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  minReference: number;
  maxReference: number;
  unit: string;
  status: BiomarkerStatus;
}
```

Ningún componente de dominio clínico acepta `string` sin tipar donde corresponde un enumerado: esto previene renderizar un semáforo o badge en un estado inexistente.

---

## 🌐 Cliente de API (`lib/api.ts`)

Cliente `fetch` centralizado, organizado por servicio (`AuthService`, `DoctorService`, `ClinicService`, `PatientService`, `ReportService`), con:

- Inyección automática de `Authorization: Bearer <token>` desde `localStorage`.
- Cabecera fija `X-API-VERSION: 1`.
- Manejo unificado de errores HTTP y expiración de sesión (`401`).

```typescript
export const DoctorService = {
  getMyPatients: () => fetchApi<Patient[]>("/doctors/me/patients"),
  publishReport: (reportId: string) =>
    fetchApi<MicrobiomeReport>(`/reports/${reportId}/publish`, "PATCH"),
};
```

---

## 📦 Instalación y Scripts

```bash
npm install
```

| Script | Descripción |
|---|---|
| `npm run dev` | Entorno de desarrollo con Turbopack |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | Linting con ESLint (config estricta) |

### Variables de entorno (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```