import { queryKeys } from "@/lib/query-keys";
import type { Filters } from "@/modules/filters/types/filter-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLocations } from "../services/map-api";

// El mapa compara todos los recintos, así que ignora el filtro de ubicación.
export function useLocations(filters: Filters) {
  const scope = { ...filters, location: "" };
  return useQuery({
    queryKey: queryKeys.locations.all(scope),
    queryFn: ({ signal }) => getLocations(scope, signal),
    placeholderData: keepPreviousData,
  });
}
