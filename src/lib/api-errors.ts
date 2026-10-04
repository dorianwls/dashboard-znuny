/**
 * Manejo compartido de errores de la API (RFC 9457, ProblemDetails).
 *
 * El backend responde los errores con un cuerpo como:
 *   { "title": "...", "status": 400, "detail": "...", "errors": { "Campo": ["msg"] } }
 *
 * No se confía en el status para saber si el cuerpo cumple ese contrato:
 * se valida de forma defensiva antes de leerlo.
 */

/**
 * Error HTTP con el status de la respuesta, para que el QueryClient distinga
 * un error permanente del cliente (4xx) de uno transitorio del servidor (5xx).
 */
export class HttpError extends Error {
  public readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

/** El backend no respondió (caído, sin red o bloqueado por CORS). */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

/** Devuelve el mensaje legible de un ProblemDetails, o `null` si el cuerpo no tiene esa forma. */
export function parseProblemMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;

  if ("detail" in body && typeof body.detail === "string" && body.detail) {
    return body.detail;
  }
  if ("error" in body && typeof body.error === "string" && body.error) {
    return body.error;
  }
  if ("errors" in body && body.errors && typeof body.errors === "object") {
    const messages = Object.values(body.errors as Record<string, unknown>)
      .flat()
      .filter((m): m is string => typeof m === "string");
    if (messages.length > 0) return messages.join(" ");
  }
  if ("title" in body && typeof body.title === "string" && body.title) {
    return body.title;
  }

  return null;
}

/**
 * Lee `response.body` una vez y lanza un `HttpError` con el mensaje del
 * ProblemDetails si existe, o con `fallbackMessage` en otro caso.
 * Llamar solo cuando `response.ok` es false.
 */
export async function throwApiError(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Cuerpo vacío o no JSON: se usa el mensaje genérico.
  }

  throw new HttpError(
    response.status,
    parseProblemMessage(body) ?? fallbackMessage,
  );
}
