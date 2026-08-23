import {
  MicrobiomeReport,
  Patient,
  Doctor,
  Clinic,
} from "@/types/microbiome";

export const MOCK_CLINIC: Clinic = {
  id: "cli-101",
  userId: "usr-cli-1",
  name: "Centro de Salud Intestinal Avanzada",
  address: "Av. de la Ciencia 45, Madrid",
  phone: "+34 912 345 678",
};

export const MOCK_DOCTOR: Doctor = {
  id: "doc-202",
  userId: "usr-doc-1",
  clinicId: "cli-101",
  name: "Dr. Alejandro Lucena",
  specialty: "Gastroenterología & Microbiota",
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "pat-301",
    userId: "usr-pat-1",
    doctorId: "doc-202",
    name: "Laura Gómez Martín",
    age: 38,
    gender: "F",
    lastAnalysisDate: "2026-02-10",
    dysbiosisLevel: "SEVERO",
    status: "PUBLICADO",
  },
  {
    id: "pat-302",
    userId: undefined,
    doctorId: null, // Cliente libre sin médico asignado
    name: "Carlos Ruiz Vega",
    age: 45,
    gender: "M",
    lastAnalysisDate: "2026-02-18",
    dysbiosisLevel: "LEVE",
    status: "PENDIENTE",
  },
];

export const MOCK_REPORT: MicrobiomeReport = {
  id: "rep-901",
  patientId: "pat-301",
  trackingCode: "MB-2026-8849-X",
  patientName: "Laura Gómez Martín",
  analysisDate: "10 de Febrero, 2026",
  diversityIndex: 2.15,
  dysbiosisLevel: "SEVERO",
  status: "PUBLICADO",
  biomarkers: [
    {
      id: "bio-1",
      name: "Akkermansia muciniphila",
      category: "Protección Mucosa",
      currentValue: 0.2,
      minReference: 1.0,
      maxReference: 5.0,
      unit: "%",
      status: "BAJO",
    },
    {
      id: "bio-2",
      name: "Faecalibacterium prausnitzii",
      category: "Inmunomoduladoras (Antiinflamatorias)",
      currentValue: 3.1,
      minReference: 5.0,
      maxReference: 12.0,
      unit: "%",
      status: "BAJO",
    },
    {
      id: "bio-3",
      name: "Bacteroides thetaiotaomicron",
      category: "Degradación de Fibra",
      currentValue: 8.5,
      minReference: 2.0,
      maxReference: 10.0,
      unit: "%",
      status: "NORMAL",
    },
    {
      id: "bio-4",
      name: "Bilophila wadsworthia",
      category: "Proteobacterias / Inflamación",
      currentValue: 4.8,
      minReference: 0.0,
      maxReference: 1.5,
      unit: "%",
      status: "ALTO",
    },
  ],
  actionPlan: [
    {
      id: "act-1",
      category: "SUPLEMENTACION",
      title: "Probiótico de Precisión con Akkermansia",
      description: "Tomar 1 cápsula en ayunas durante 60 días para reforzar la barrera mucosa.",
      priority: "ALTA",
    },
    {
      id: "act-2",
      category: "NUTRICION",
      title: "Aumento de Almidón Resistente",
      description: "Introducir patata cocida y enfriada 24h para estimular la producción de butirato.",
      priority: "ALTA",
    },
    {
      id: "act-3",
      category: "LIFESTYLE",
      title: "Higiene del Sueño y Ritmo Circadiano",
      description: "Limitar la exposición a pantallas 2 horas antes de dormir para reducir el cortisol nocturno.",
      priority: "MODERADA",
    },
  ],
};