import { queryKeys } from "@/lib/query-keys";
import type { Filters } from "@/modules/filters/types/filter-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOverview } from "../services/analytics-api";

export function useOverview(filters: Filters) {
  return useQuery({
    queryKey: queryKeys.analytics.overview(filters),
    queryFn: ({ signal }) => getOverview(filters, signal),
    placeholderData: keepPreviousData,
  });
}
