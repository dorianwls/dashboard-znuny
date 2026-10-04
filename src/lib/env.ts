// Configuración en .env.local (ver .env.example).
// En desarrollo se usa el proxy de Vite (mismo origen); en producción, la URL del backend.
const BACKEND_URL = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080");

export const API_BASE_URL = `${BACKEND_URL}/api/v1`;
