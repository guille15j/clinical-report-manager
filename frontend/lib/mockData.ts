import { User } from "@/types/auth";

export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "usr_101",
    name: "Dra. Elena Ramos",
    email: "doctor@microbioma.com",
    password: "password123",
    role: "doctor",
  },
  {
    id: "usr_102",
    name: "María García",
    email: "paciente@microbioma.com",
    password: "password123",
    role: "paciente",
    patientId: "PAT-88219",
  },
  {
    id: "usr_103",
    name: "Clínica Bionova Health",
    email: "clinica@microbioma.com",
    password: "password123",
    role: "clinica",
  },
];