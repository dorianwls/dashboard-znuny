import { queryKeys } from "@/lib/query-keys";
import type { Filters } from "@/modules/filters/types/filter-types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTickets, getTicketTimeline } from "../services/ticket-api";
import type { TicketView } from "../types/ticket-types";

export function useTickets(filters: Filters, view: TicketView, page: number) {
  return useQuery({
    queryKey: queryKeys.tickets.list(filters, view, page),
    queryFn: ({ signal }) => getTickets(filters, view, page, signal),
    placeholderData: keepPreviousData,
  });
}

export function useTicketTimeline(id: number) {
  return useQuery({
    queryKey: queryKeys.tickets.timeline(id),
    queryFn: ({ signal }) => getTicketTimeline(id, signal),
  });
}
