// Enumeradores de Tipos -------------------------------------------------------------------

// Roles de un usuario (users.role)
export type UserRole = "PACIENTE" | "DOCTOR" | "CLINICA";

// Desequilibrio Bacteriano (microbiome_reports.dysbiosis_level)
export type ImbalanceLevel = "OPTIMO" | "LEVE" | "SEVERO";

// Estado de los informes de analíticas (microbiome_reports.status)
export type AnalysisStatus = "SOLICITADO" | "PROCESANDO" | "PENDIENTE" | "PUBLICADO";

// Estado individual del biomarcador (biomarkers.status)
export type BiomarkerStatus = "NORMAL" | "ALTO" | "BAJO";

// Categoría del plan de acción (action_plans.category)
export type ActionPlanCategory = "NUTRICION" | "SUPLEMENTACION" | "LIFESTYLE";

// Prioridad del plan de acción (action_plans.priority)
export type ActionPlanPriority = "ALTA" | "MODERADA" | "BAJA";


// Modelado de Datos ----------------------------------------------------------------------

// Usuario (tabla: users)
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Clínica (tabla: clinics)
export interface Clinic {
  id: string;
  userId: string;
  name: string;
  address?: string;
  phone?: string;
}

// Doctor (tabla: doctors)
export interface Doctor {
  id: string;
  userId: string;
  clinicId: string;
  name: string;
  specialty?: string;
}

// Paciente (tabla: patients)
export interface Patient {
  id: string;
  userId?: string | null;           // Nullable en DB (fk_patients_users)
  doctorId?: string | null;         // Nullable en DB (null = cliente libre)
  name: string;
  age: number;
  gender: "M" | "F" | "OTRO";
  lastAnalysisDate?: string;
  dysbiosisLevel?: ImbalanceLevel;
  status?: AnalysisStatus;
}

// Biomarcador (tabla: biomarkers)
export interface Biomarker {
  id: string;
  reportId?: string;               // Mapea fk_biomarkers_reports
  name: string;                    // name
  category: string;                // category
  currentValue: number;            // current_value
  minReference: number;            // min_ref
  maxReference: number;            // max_ref
  unit: string;                    // unit
  status: BiomarkerStatus;         // status
}

// Recomendación / Plan de acción (tabla: action_plans)
export interface ActionPlanItem {
  id: string;
  reportId?: string;               // Mapea fk_action_plans_reports
  category: ActionPlanCategory;    // category
  title: string;                   // title
  description: string;             // description
  priority: ActionPlanPriority;    // priority
}

// Informe de Microbiota (tabla: microbiome_reports)
export interface MicrobiomeReport {
  id: string;
  patientId: string;               // patient_id
  trackingCode: string;            // tracking_code
  patientName?: string;            // Atributo de visualización en Frontend
  analysisDate: string;            // analysis_date (formato ISO YYYY-MM-DD)
  diversityIndex: number;          // diversity_index
  dysbiosisLevel: ImbalanceLevel;  // dysbiosis_level
  status: AnalysisStatus;          // status
  biomarkers: Biomarker[];
  actionPlan: ActionPlanItem[];
}