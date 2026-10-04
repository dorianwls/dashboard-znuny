import { apiFetch } from "@/lib/http";

/** Pide al backend releer los datos de Znuny. */
export async function refreshData(): Promise<void> {
  await apiFetch("/refresh", "No se pudieron actualizar los datos.", {
    method: "POST",
  });
}
