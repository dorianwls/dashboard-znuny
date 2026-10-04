import { apiFetch } from "@/lib/http";
import type { Catalogs } from "../types/catalog-types";

export async function getCatalogs(signal?: AbortSignal): Promise<Catalogs> {
  const response = await apiFetch(
    "/catalogs",
    "Error al obtener los catálogos.",
    { signal },
  );
  return response.json() as Promise<Catalogs>;
}
