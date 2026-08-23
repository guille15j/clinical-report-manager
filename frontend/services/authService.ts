import { LoginCredentials, AuthResponse, User } from "@/types/auth";
import { MOCK_USERS } from "@/lib/mockData";

/**
 * Servicio modular de autenticación.
 * Actualmente consulta MOCK_USERS. Para conectar Spring Boot, sustituir por fetch/axios.
 */
export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simular latencia de red (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const foundUser = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
  );

  if (!foundUser) {
    throw new Error("Credenciales inválidas. Verifica tu email y contraseña.");
  }

  // Extraer la contraseña de la respuesta de usuario por seguridad
  const { password, ...userWithoutPassword } = foundUser;

  return {
    user: userWithoutPassword as User,
    token: `mock-jwt-token-${userWithoutPassword.id}-${Date.now()}`,
  };
}

export function saveSession(authData: AuthResponse): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", authData.token);
    localStorage.setItem("auth_user", JSON.stringify(authData.user));
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("auth_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}