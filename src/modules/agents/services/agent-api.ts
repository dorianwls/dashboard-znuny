import { apiFetch, toQuery } from "@/lib/http";
import type { Filters } from "@/modules/filters/types/filter-types";
import type { AgentsResponse } from "../types/agent-types";

export async function getAgents(
  filters: Filters,
  signal?: AbortSignal,
): Promise<AgentsResponse> {
  const response = await apiFetch(
    `/agents${toQuery(filters)}`,
    "Error al obtener el desempeño de los agentes.",
    { signal },
  );
  return response.json() as Promise<AgentsResponse>;
}
