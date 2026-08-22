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

### Reglas de negocio impuestas

El sistema centraliza la gestión de muestras biológicas y la interacción médica mediante un flujo de responsabilidades strictly separado. Cada prueba física se vincula unívocamente al sistema mediante un código de seguimiento (Tracking Code) impreso en la caja. A partir de su registro, el informe atraviesa un ciclo de vida cerrado en cuatro fases: Solicitado (esperando al laboratorio), En Proceso (volcado de datos brutos), Pendiente de Revisión (análisis algorítmico completado) y Publicado (validado clínicamente). Para garantizar la privacidad, la seguridad y el rendimiento de la interfaz, el acceso se divide en tres portales independientes (Clínica, Doctor y Paciente). Esto evita interfaces sobrecargadas de condiciones, permitiendo a las clínicas reasignar pacientes, a los doctores prescribir y editar planes de acción, y a los pacientes consultar de forma segura sus resultados definitivos y recomendaciones.

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
- Cliente HTTP centralizado (`lib/api.ts`) con soporte Bearer JWT
- Componentes clínicos personalizados (semáforo, barras de rango, tablas de biomarcadores)

### **Backend**
- Kotlin
- Spring Boot
- Liquibase (Migración de BD)
- PostgreSQL

---

## 🧪 Estado del Proyecto

El Gestor de Informes Clínicos se encuentra en fase activa de construcción.

### 🔹 Backend (Kotlin + Spring Boot)
- Estado: **Pendiente de implementación**
- Se han definido las migraciones de base de datos con Liquibase y el esquema relacional en PostgreSQL.
- Se definirá la arquitectura base, modelos clínicos y endpoints RESTful siguiendo la especificación del cliente API.

### 🔹 Frontend (Next.js 16 + TypeScript)
- Estado: **En construcción (Fase de UI)**
- Estructura de carpetas y arquitectura modular finalizadas.
- Modelos estrictos TypeScript (`types/microbiome.ts`) y cliente centralizado API (`lib/api.ts`) totalmente definidos e integrados.
- Siguiente hito: Instalación de componentes `shadcn/ui` y creación de widgets clínicos.

---

# Esquema de datos

## 📊 Diagrama Entidad-Relación (ER Diagram)

```mermaid
erDiagram
    users ||--o{ clinics : "administra / gestiona"
    users ||--o{ doctors : "perfil de médico"
    users ||--o| patients : "cuenta de paciente (opcional)"
    clinics ||--o{ doctors : "emplea / asigna"
    doctors ||--o{ patients : "atiende / supervisa"
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

---

## 🔗 Relaciones (Foreign Keys)

| Tabla Origen | Columna FK | Tabla Referenciada | Columna PK | Nombre de FK Constraint | Cardinalidad | Restricción Nulo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `clinics` | `user_id` | `users` | `id` | `fk_clinics_users` | N:1 | NOT NULL |
| `doctors` | `user_id` | `users` | `id` | `fk_doctors_users` | N:1 | NOT NULL |
| `doctors` | `clinic_id` | `clinics` | `id` | `fk_doctors_clinics` | N:1 | NOT NULL |
| `patients` | `user_id` | `users` | `id` | `fk_patients_users` | N:1 / 1:1 | NULLABLE |
| `patients` | `doctor_id` | `doctors` | `id` | `fk_patients_doctors` | N:1 | NULLABLE |
| `microbiome_reports` | `patient_id` | `patients` | `id` | `fk_reports_patients` | N:1 | NOT NULL |
| `biomarkers` | `report_id` | `microbiome_reports` | `id` | `fk_biomarkers_reports` | N:1 | NOT NULL |
| `action_plans` | `report_id` | `microbiome_reports` | `id` | `fk_action_plans_reports` | N:1 | NOT NULL |

---

## 🗂️ Detalle de Tablas

### 1. `users`
Almacena las credenciales globales, roles e información de autenticación de la plataforma.
- **`id`** (`VARCHAR(36)`): Clave Primaria (UUID).
- **`email`** (`VARCHAR(255)`): Correo electrónico del usuario (**Único**, `NOT NULL`).
- **`password_hash`** (`VARCHAR(255)`): Hash seguro de la contraseña (`NOT NULL`).
- **`role`** (`VARCHAR(20)`): Rol del usuario (`CLINIC`, `DOCTOR`, `PATIENT`) (`NOT NULL`).
- **`created_at`** (`TIMESTAMP`): Fecha y hora de creación (Default: `CURRENT_TIMESTAMP`, `NOT NULL`).

---

### 2. `clinics`
Información general de las clínicas asociadas a la plataforma.
- **`id`** (`VARCHAR(36)`): Clave Primaria.
- **`user_id`** (`VARCHAR(36)`): FK hacia `users(id)` (`NOT NULL`).
- **`name`** (`VARCHAR(150)`): Nombre comercial o institutional (`NOT NULL`).
- **`address`** (`VARCHAR(255)`): Dirección física.
- **`phone`** (`VARCHAR(50)`): Teléfono de contacto.

---

### 3. `doctors`
Información detallada sobre los profesionales de la salud.
- **`id`** (`VARCHAR(36)`): Clave Primaria.
- **`user_id`** (`VARCHAR(36)`): FK hacia `users(id)` (`NOT NULL`).
- **`clinic_id`** (`VARCHAR(36)`): FK hacia `clinics(id)` (`NOT NULL`).
- **`name`** (`VARCHAR(150)`): Nombre completo del médico (`NOT NULL`).
- **`specialty`** (`VARCHAR(100)`): Especialidad médica (ej. Gastroenterología, Nutrición).

---

### 4. `patients`
Ficha técnica y demográfica de los pacientes.
- **`id`** (`VARCHAR(36)`): Clave Primaria.
- **`user_id`** (`VARCHAR(36)`): FK hacia `users(id)` (*Opcional / NULLABLE*, para pacientes sin cuenta propia).
- **`doctor_id`** (`VARCHAR(36)`): FK hacia `doctors(id)` (*Opcional / NULLABLE*, si es `NULL` es un cliente individual libre).
- **`name`** (`VARCHAR(150)`): Nombre completo del paciente (`NOT NULL`).
- **`age`** (`INT`): Edad (`NOT NULL`).
- **`gender`** (`VARCHAR(10)`): Género (`NOT NULL`).

---

### 5. `microbiome_reports`
Información consolidada de los análisis realizados a los pacientes.
- **`id`** (`VARCHAR(36)`): Clave Primaria.
- **`patient_id`** (`VARCHAR(36)`): FK hacia `patients(id)` (`NOT NULL`).
- **`tracking_code`** (`VARCHAR(50)`): Código único de seguimiento del kit físico (**Único**, `NOT NULL`).
- **`analysis_date`** (`VARCHAR(20)`): Fecha de ejecución del análisis (`NOT NULL`).
- **`diversity_index`** (`DECIMAL(4,2)`): Índice numérico de diversidad de la microbiota (`NOT NULL`).
- **`dysbiosis_level`** (`VARCHAR(20)`): Grado de desbarajuste/disbiosis (`OPTIMAL`, `MILD`, `SEVERE`) (`NOT NULL`).
- **`status`** (`VARCHAR(20)`): Ciclo de vida (`REQUESTED`, `PROCESSING`, `PENDING_REVIEW`, `PUBLISHED`) (`NOT NULL`).

---

### 6. `biomarkers`
Marcadores biológicos específicos asociados a un informe de microbioma.
- **`id`** (`VARCHAR(36)`): Clave Primaria.
- **`report_id`** (`VARCHAR(36)`): FK hacia `microbiome_reports(id)` (`NOT NULL`).
- **`name`** (`VARCHAR(100)`): Nombre del biomarcador o filotipo (`NOT NULL`).
- **`category`** (`VARCHAR(100)`): Categoría o función (`NOT NULL`).
- **`current_value`** (`DECIMAL(5,2)`): Valor obtenido en el examen (`NOT NULL`).
- **`min_ref`** (`DECIMAL(5,2)`): Límite mínimo de referencia (`NOT NULL`).
- **`max_ref`** (`DECIMAL(5,2)`): Límite máximo de referencia (`NOT NULL`).
- **`unit`** (`VARCHAR(20)`): Unidad de medida (`NOT NULL`).
- **`status`** (`VARCHAR(20)`): Diagnóstico rápido (`NORMAL`, `HIGH`, `LOW`) (`NOT NULL`).

---

### 7. `action_plans`
Recomendaciones e intervenciones personalizadas basadas en el reporte de microbioma.
- **`id`** (`VARCHAR(36)`): Clave Primaria.
- **`report_id`** (`VARCHAR(36)`): FK hacia `microbiome_reports(id)` (`NOT NULL`).
- **`category`** (`VARCHAR(30)`): Tipo de acción (`NUTRITION`, `SUPPLEMENTATION`, `LIFESTYLE`) (`NOT NULL`).
- **`title`** (`VARCHAR(150)`): Título de la recomendación (`NOT NULL`).
- **`description`** (`TEXT`): Explicación detallada del plan (`NOT NULL`).
- **`priority`** (`VARCHAR(20)`): Prioridad (`HIGH`, `MEDIUM`, `LOW`) (`NOT NULL`).