import { apiFetch, toQuery } from "@/lib/http";
import type { Filters } from "@/modules/filters/types/filter-types";
import type { Overview } from "../types/analytics-types";

export async function getOverview(
  filters: Filters,
  signal?: AbortSignal,
): Promise<Overview> {
  const response = await apiFetch(
    `/analytics/overview${toQuery(filters)}`,
    "Error al obtener el análisis del servicio.",
    { signal },
  );
  return response.json() as Promise<Overview>;
}
