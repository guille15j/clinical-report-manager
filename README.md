<h1 align="center">🧬 Gestor de Informes Clínicos</h1>
<p align="center">Plataforma Full-Stack para el procesamiento, análisis y visualización de informes de microbioma y biomarcadores</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Kotlin-2.3-7F52FF?logo=kotlin&logoColor=white" alt="Kotlin" />
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Liquibase-Migrations-2962FF?logo=liquibase&logoColor=white" alt="Liquibase" />
  <img src="https://img.shields.io/badge/License-Proprietary-lightgrey" alt="License" />
</p>

---

## 📘 Visión General del Sistema

El **Gestor de Informes Clínicos** es una plataforma diseñada para convertir datos biomédicos crudos (análisis de microbiota, biomarcadores, paneles funcionales) en informes clínicos accionables, trazables y auditables.

El sistema resuelve tres problemas centrales del dominio HealthTech:

1. **Trazabilidad física-digital**: cada muestra biológica se vincula de forma unívoca a su informe digital mediante un `tracking_code`, eliminando ambigüedad entre kit físico y resultado.
2. **Gobernanza del ciclo de vida clínico**: ningún informe llega al paciente sin pasar por un flujo de validación algorítmica y revisión médica explícita.
3. **Aislamiento de responsabilidades por rol**: Clínica, Doctor y Paciente operan sobre superficies de datos y acciones completamente distintas, reduciendo superficie de error y de fuga de información sensible.

La arquitectura está diseñada para ser **extensible a otros dominios de análisis clínico** (genética, metabolómica, hematología) sin reescribir el núcleo del sistema.

---

## 🏗️ Arquitectura del Repositorio

Monorepo con dos proyectos independientes y ciclos de despliegue desacoplados:

```bash
gestor-informes-clinicos/
│
├── frontend/                # Dashboard clínico — Next.js 16 (App Router)
│   ├── app/                 # Rutas y portales por rol
│   ├── components/          # Componentes UI y de dominio clínico
│   ├── lib/                 # Cliente API, utilidades
│   ├── types/                # Contratos TypeScript estrictos
│   └── README.md
│
├── backend/                 # API REST — Kotlin + Spring Boot
│   ├── src/main/kotlin/      # Controller → Service → Repository → Domain
│   ├── src/main/resources/   # Configuración, changelogs Liquibase
│   └── README.md
│
└── README.md                 # Documentación global (este archivo)
```

**Contrato de integración:** el frontend consume el backend exclusivamente vía REST/JSON, autenticado con `Authorization: Bearer <JWT>` y versionado mediante la cabecera `X-API-VERSION: 1`.

---

## 🔐 Reglas de Negocio

### Ciclo de vida del informe

Cada `microbiome_report` atraviesa un flujo de estados **estrictamente secuencial y no reversible**, controlado por el backend:

```mermaid
stateDiagram-v2
    [*] --> SOLICITADO: Registro del tracking_code
    SOLICITADO --> PROCESANDO: Laboratorio inicia volcado de datos
    PROCESANDO --> PENDIENTE: Pipeline algorítmico completado
    PENDIENTE --> PUBLICADO: Validación clínica del Doctor
    PUBLICADO --> [*]

    note right of SOLICITADO
        Kit físico vinculado.
        Sin datos biológicos aún.
    end note
    note right of PENDIENTE
        Visible solo para DOCTOR.
        Requiere revisión de plan de acción.
    end note
    note right of PUBLICADO
        Visible para PACIENTE.
        Inmutable tras publicación.
    end note
```

| Estado | Descripción | Visible para |
|---|---|---|
| `SOLICITADO` | Kit registrado, a la espera del laboratorio | Clínica, Doctor |
| `PROCESANDO` | Datos brutos en pipeline de análisis | Clínica, Doctor |
| `PENDIENTE` | Análisis completado, pendiente de validación médica | Doctor |
| `PUBLICADO` | Validado y disponible para el paciente | Paciente, Doctor, Clínica |

### Separación de portales por rol

```mermaid
flowchart LR
    A[Usuario autenticado] -->|role=CLINICA| B[Portal Clínica]
    A -->|role=DOCTOR| C[Portal Doctor]
    A -->|role=PACIENTE| D[Portal Paciente]

    B --> B1[Gestión de pacientes]
    B --> B2[Asignación de doctores]
    B --> B3[Métricas operacionales]

    C --> C1[Cola de revisión clínica]
    C --> C2[Edición de plan de acción]
    C --> C3[Publicación de informes]

    D --> D1[Consulta de informe publicado]
    D --> D2[Seguimiento de plan de acción]
    D --> D3[Exportación / impresión]
```

Cada portal es una superficie de UI y de API independiente: no existen condicionales de rol dispersos en componentes compartidos, sino vistas dedicadas por rol (`PatientView`, `DoctorView`, `ClinicView`) respaldadas por autorización RBAC en el backend.

---

## 🧬 Modelo de Datos

```mermaid
erDiagram
    users ||--o{ clinics : "administra"
    users ||--o{ doctors : "perfil de médico"
    users ||--o| patients : "cuenta opcional"
    clinics ||--o{ doctors : "emplea"
    doctors ||--o{ patients : "atiende"
    patients ||--o{ microbiome_reports : "posee"
    microbiome_reports ||--o{ biomarkers : "contiene"
    microbiome_reports ||--o{ action_plans : "genera"

    users {
        VARCHAR_36 id PK
        VARCHAR_255 email UK
        VARCHAR_255 password_hash
        VARCHAR_20 role
        TIMESTAMP created_at
    }

    clinics {
        VARCHAR_36 id PK
        VARCHAR_36 user_id FK
        VARCHAR_150 name
        VARCHAR_255 address
        VARCHAR_50 phone
    }

    doctors {
        VARCHAR_36 id PK
        VARCHAR_36 user_id FK
        VARCHAR_36 clinic_id FK
        VARCHAR_150 name
        VARCHAR_100 specialty
    }

    patients {
        VARCHAR_36 id PK
        VARCHAR_36 user_id FK
        VARCHAR_36 doctor_id FK
        VARCHAR_150 name
        INT age
        VARCHAR_10 gender
    }

    microbiome_reports {
        VARCHAR_36 id PK
        VARCHAR_36 patient_id FK
        VARCHAR_50 tracking_code UK
        VARCHAR_20 analysis_date
        DECIMAL_4_2 diversity_index
        VARCHAR_20 dysbiosis_level
        VARCHAR_20 status
    }

    biomarkers {
        VARCHAR_36 id PK
        VARCHAR_36 report_id FK
        VARCHAR_100 name
        VARCHAR_100 category
        DECIMAL_5_2 current_value
        DECIMAL_5_2 min_ref
        DECIMAL_5_2 max_ref
        VARCHAR_20 unit
        VARCHAR_20 status
    }

    action_plans {
        VARCHAR_36 id PK
        VARCHAR_36 report_id FK
        VARCHAR_30 category
        VARCHAR_150 title
        TEXT description
        VARCHAR_20 priority
    }
```

### Relaciones (Foreign Keys)

| Tabla Origen | Columna FK | Tabla Referenciada | Constraint | Cardinalidad | Nulabilidad |
|---|---|---|---|---|---|
| `clinics` | `user_id` | `users(id)` | `fk_clinics_users` | N:1 | `NOT NULL` |
| `doctors` | `user_id` | `users(id)` | `fk_doctors_users` | N:1 | `NOT NULL` |
| `doctors` | `clinic_id` | `clinics(id)` | `fk_doctors_clinics` | N:1 | `NOT NULL` |
| `patients` | `user_id` | `users(id)` | `fk_patients_users` | 1:1 opcional | `NULLABLE` |
| `patients` | `doctor_id` | `doctors(id)` | `fk_patients_doctors` | N:1 | `NULLABLE` |
| `microbiome_reports` | `patient_id` | `patients(id)` | `fk_reports_patients` | N:1 | `NOT NULL` |
| `biomarkers` | `report_id` | `microbiome_reports(id)` | `fk_biomarkers_reports` | N:1 | `NOT NULL` |
| `action_plans` | `report_id` | `microbiome_reports(id)` | `fk_action_plans_reports` | N:1 | `NOT NULL` |

> `patients.doctor_id = NULL` representa un paciente sin doctor asignado (cliente libre gestionado directamente por la clínica).
