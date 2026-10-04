import { queryKeys } from "@/lib/query-keys";
import type { Filters } from "@/modules/filters/types/filter-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAgents } from "../services/agent-api";

// El ranking es del equipo completo: el agente y el estado elegidos en otros módulos no aplican aquí.
export function useAgents(filters: Filters) {
  const scope = { ...filters, agentId: "", status: "" };
  return useQuery({
    queryKey: queryKeys.agents.all(scope),
    queryFn: ({ signal }) => getAgents(scope, signal),
    placeholderData: keepPreviousData,
  });
}
