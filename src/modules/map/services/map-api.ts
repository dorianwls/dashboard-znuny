import { apiFetch, toQuery } from "@/lib/http";
import type { Filters } from "@/modules/filters/types/filter-types";
import type { LocationsResponse } from "../types/location-types";

export async function getLocations(
  filters: Filters,
  signal?: AbortSignal,
): Promise<LocationsResponse> {
  const response = await apiFetch(
    `/locations${toQuery(filters)}`,
    "Error al obtener los recintos.",
    { signal },
  );
  return response.json() as Promise<LocationsResponse>;
}
