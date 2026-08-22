// Enumeradores de tipos -------------------------------------------------------------------

// Roles de un usuario
export type UserRole = "PACIENTE" | "DOCTOR" | "CLINICA";

// Desequilibrio Bacteriano
export type ImbalanceLevel = "OPTIMO" | "LEVE" | "SEVERO";

// Estado de los informes de las analiticas
export type AnalysisStatus = "SOLICITADO" | "PROCESANDO" | "PENDIENTE" | "PUBLICADO";

// Modelado de Datos Base de datos based -------------------------------------------------

// Usuario
export interface User {
    id: string;
    email: string;
    role: UserRole;
    createdAt: string;
}

// Clínica
export interface Clinic {
    id: string;
    userId: string;
    name: string;
    address?: string;
    phone?: string;
}

// Doctores
export interface Doctor {
    id: string;
    userId: string;
    clinicId: string;
    name: string;
    specialty?: string;
}

// Pacientes
export interface Patient {
    id: string;
    userId?: string;
    doctorId?: string | null;               // null = cliente libre
    name: string;
    age: number;
    gender: 'M' | 'F' | 'OTRO';
    lastAnalysisDate?: string;
    dysbiosisLevel?: ImbalanceLevel;
    status?: AnalysisStatus;
}

// Biomarcador
export interface Biomarker {
    id: string;
    name: string;                           // Nombre del biomarcador
    category: string;                       // Grupo o función
    currentValue: number;                   // Cantidad hallada en laboratorio
    minReference: number;                   // Mínimo saludable
    maxReference: number;                   // Máximo saludable
    unit: string;                           // Unidad de medida
    status: 'NORMAL' | 'ALTO' | 'BAJO';
}

// Recomendación/Plan de acción
export interface ActionPlanItem {
    id: string;
    category: 'NUTRICION' | 'SUPLEMENTACION' | 'LIFESTYLE';
    title: string;
    description: string;
    priority: 'ALTA' | 'MODERADA' | 'BAJA';
}

// Informe
export interface MicrobiomeReport {
    id: string;
    patientId: string;
    trackingCode: string;
    patientName: string;
    analysisDate: string;
    diversityIndex: number;                 // 0-10
    dysbiosisLevel: ImbalanceLevel;
    stauts : AnalysisStatus;
    biomarkers: Biomarker[];
    actionPlan: ActionPlanItem[];
}