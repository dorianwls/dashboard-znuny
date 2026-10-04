import type { Filters } from "@/modules/filters/types/filter-types";

export const queryKeys = {
  catalogs: {
    all: () => ["catalogs"] as const,
  },
  analytics: {
    overview: (filters: Filters) => ["overview", filters] as const,
  },
  agents: {
    all: (filters: Filters) => ["agents", filters] as const,
  },
  locations: {
    all: (filters: Filters) => ["locations", filters] as const,
  },
  reports: {
    dataQuality: (filters: Filters) => ["data-quality", filters] as const,
  },
  tickets: {
    list: (filters: Filters, view: string, page: number) =>
      ["tickets", filters, view, page] as const,
    timeline: (id: number) => ["tickets", "timeline", id] as const,
  },
} as const;
