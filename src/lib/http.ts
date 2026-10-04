import { NetworkError, throwApiError } from "@/lib/api-errors";
import { API_BASE_URL } from "@/lib/env";

type QueryValue = string | number | undefined | null;

/** Arma el query string omitiendo valores vacíos. */
export function toQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== "" && value != null) search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/**
 * `fetch` contra la API con el manejo de errores común: un fallo de red se
 * convierte en `NetworkError` y una respuesta no-OK en `HttpError`.
 */
export async function apiFetch(
  path: string,
  fallbackMessage: string,
  init?: RequestInit,
): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (error) {
    if (init?.signal?.aborted) throw error;
    throw new NetworkError(
      "No se pudo conectar con el backend. Verificá que esté en ejecución.",
    );
  }

  if (!response.ok) {
    await throwApiError(response, fallbackMessage);
  }

  return response;
}

/** Guarda en el equipo el archivo de una respuesta, con el nombre que propone el backend. */
export async function saveResponseAsFile(
  response: Response,
  fallbackName: string,
): Promise<void> {
  const name =
    response.headers
      .get("content-disposition")
      ?.match(/filename="?([^";]+)"?/)?.[1] ?? fallbackName;
  const url = URL.createObjectURL(await response.blob());
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: name,
  });
  // Firefox necesita el enlace en el documento, y revocar la URL en el mismo tick puede cancelar la descarga.
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
