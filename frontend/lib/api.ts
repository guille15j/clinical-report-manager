import {
  User,
  Clinic,
  Doctor,
  Patient,
  Biomarker,
  ActionPlanItem,
  MicrobiomeReport,
  AnalysisStatus,
} from "@/types/microbiome";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

async function fetchApi<T>(
  endpoint: string,
  method: string = "GET",
  body: unknown = null,
  customOptions: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-VERSION": "1",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers: { ...headers, ...customOptions.headers },
    ...customOptions,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const respuesta = await fetch(url, options);
    const data = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      if (respuesta.status === 401) {
        console.error("Sesión expirada o token inválido");
      }
      
      const mensajeError = data?.error || data?.message || `Error ${respuesta.status}`;
      throw new Error(mensajeError);
    }

    return data as T;
  } catch (error) {
    throw error;
  }
}

export const AuthService = {
  login: (credentials: { email: string; password_hash: string }) =>
    fetchApi<{ token: string; user: User }>("/auth/login", "POST", credentials),

  register: (userData: Partial<User>) =>
    fetchApi<User>("/auth/register", "POST", userData),

  verifySession: () => 
    fetchApi<User>("/auth/me", "GET"),

  refreshToken: () => 
    fetchApi<{ token: string }>("/auth/refresh", "POST"),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token");
    }
  }
};

export const ClinicService = {
  getDashboardStats: (clinicId: string) => 
    fetchApi(`/clinics/${clinicId}/stats`),

  registerDoctor: (clinicId: string, doctorData: Omit<Doctor, "id">) =>
    fetchApi<Doctor>(`/clinics/${clinicId}/doctors`, "POST", doctorData),

  registerPatient: (clinicId: string, patientData: Omit<Patient, "id">) =>
    fetchApi<Patient>(`/clinics/${clinicId}/patients`, "POST", patientData),

  assignDoctorToPatient: (patientId: string, doctorId: string) =>
    fetchApi(`/patients/${patientId}/assign-doctor`, "PATCH", { doctorId }),
};

export const DoctorService = {
  getMyPatients: () => 
    fetchApi<Patient[]>("/doctors/me/patients"),

  requestAnalysis: (patientId: string, trackingCode: string) =>
    fetchApi<MicrobiomeReport>("/reports/request", "POST", { patientId, trackingCode }),

  uploadReportData: (reportId: string, labData: unknown) =>
    fetchApi(`/reports/${reportId}/upload`, "POST", labData),

  updateBiomarker: (biomarkerId: string, data: Partial<Biomarker>) =>
    fetchApi<Biomarker>(`/biomarkers/${biomarkerId}`, "PATCH", data),

  updateActionPlan: (reportId: string, planData: ActionPlanItem[]) =>
    fetchApi<MicrobiomeReport>(`/reports/${reportId}/action-plan`, "PUT", planData),

  publishReport: (reportId: string) =>
    fetchApi<MicrobiomeReport>(`/reports/${reportId}/publish`, "PATCH"),
};

export const PatientService = {
  getMyProfile: () => 
    fetchApi<Patient>("/patients/me"),

  updateProfile: (data: Partial<Patient>) => 
    fetchApi<Patient>("/patients/me", "PATCH", data),

  getMyPublishedReports: () => 
    fetchApi<MicrobiomeReport[]>("/patients/me/reports"),

  checkActionPlanItem: (itemId: string, isCompleted: boolean) =>
    fetchApi(`/action-plans/items/${itemId}/check`, "PATCH", { isCompleted }),
};

export const ReportService = {
  getReportById: (reportId: string) =>
    fetchApi<MicrobiomeReport>(`/reports/${reportId}`),
};