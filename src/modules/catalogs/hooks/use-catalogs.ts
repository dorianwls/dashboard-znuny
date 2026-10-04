import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getCatalogs } from "../services/catalog-api";

export function useCatalogs() {
  return useQuery({
    queryKey: queryKeys.catalogs.all(),
    queryFn: ({ signal }) => getCatalogs(signal),
    staleTime: 5 * 60 * 1000,
  });
}
