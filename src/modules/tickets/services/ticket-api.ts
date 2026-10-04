import { apiFetch, toQuery } from "@/lib/http";
import type { Filters } from "@/modules/filters/types/filter-types";
import {
  PAGE_SIZE,
  type TicketPage,
  type TicketTimeline,
  type TicketView,
} from "../types/ticket-types";

export async function getTickets(
  filters: Filters,
  view: TicketView,
  page: number,
  signal?: AbortSignal,
): Promise<TicketPage> {
  const response = await apiFetch(
    `/tickets${toQuery({ ...filters, view, page, pageSize: PAGE_SIZE })}`,
    "Error al obtener los tickets.",
    { signal },
  );
  return response.json() as Promise<TicketPage>;
}

export async function getTicketTimeline(
  id: number,
  signal?: AbortSignal,
): Promise<TicketTimeline> {
  const response = await apiFetch(
    `/tickets/${id}/timeline`,
    "Error al obtener el historial del ticket.",
    { signal },
  );
  return response.json() as Promise<TicketTimeline>;
}
