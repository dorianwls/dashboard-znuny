import type { Catalogs } from "@/modules/catalogs/types/catalog-types";

/** Filtros globales del dashboard. Viven en la URL para que cada vista se pueda compartir con un enlace. */
export type Filters = {
  from: string;
  to: string;
  area: string;
  unit: string;
  category: string;
  status: string;
  agentId: string;
  priorityId: string;
  location: string;
};

export type FilterField = keyof Omit<Filters, "from" | "to">;

export const filterKeys = [
  "from",
  "to",
  "area",
  "unit",
  "category",
  "status",
  "agentId",
  "priorityId",
  "location",
] as const satisfies readonly (keyof Filters)[];

/** Search params de la app: los filtros (todos opcionales) y el ticket abierto en el panel lateral. */
export type AppSearch = Partial<Filters> & { ticket?: number };

const isDay = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

export function validateAppSearch(search: Record<string, unknown>): AppSearch {
  const out: AppSearch = {};
  for (const key of filterKeys) {
    const value = search[key];
    if (key === "from" || key === "to") {
      if (isDay(value)) out[key] = value;
    } else if (value != null && value !== "") out[key] = String(value);
  }
  const ticket = Number(search.ticket);
  if (Number.isInteger(ticket) && ticket > 0) out.ticket = ticket;
  return out;
}

/** Completa el período con el que propone el backend (últimos 30 días en su zona horaria). */
export function resolveFilters(search: AppSearch, catalogs: Catalogs): Filters {
  const from = search.from ?? catalogs.defaultFrom;
  const to = search.to ?? catalogs.defaultTo;
  return {
    area: "",
    unit: "",
    category: "",
    status: "",
    agentId: "",
    priorityId: "",
    location: "",
    ...search,
    from,
    to,
  };
}

export type FieldSpec = {
  label: string;
  options: { value: string; label: string }[];
  all: string;
};

export function fieldSpecs(
  c: Catalogs | undefined,
): Record<FilterField, FieldSpec> {
  return {
    area: {
      label: "Área solicitante",
      options: c?.areas ?? [],
      all: "Todas las áreas",
    },
    unit: {
      label: "Servicio o equipo de TI",
      options: c?.units ?? [],
      all: "Todos",
    },
    status: { label: "Estado", options: c?.statuses ?? [], all: "Todos" },
    agentId: { label: "Agente", options: c?.agents ?? [], all: "Todos" },
    category: {
      label: "Categoría",
      options: c?.categories ?? [],
      all: "Todas",
    },
    priorityId: {
      label: "Prioridad",
      options: c?.priorities ?? [],
      all: "Todas",
    },
    location: { label: "Ubicación", options: c?.locations ?? [], all: "Todas" },
  };
}

/** Ordena el rango para que «desde» nunca quede después de «hasta». */
export function orderedRange(
  filters: Filters,
  patch: Partial<Pick<Filters, "from" | "to">>,
) {
  const from = patch.from ?? filters.from,
    to = patch.to ?? filters.to;
  return from > to
    ? patch.from
      ? { from, to: from }
      : { from: to, to }
    : { from, to };
}

export type Preset = "last30" | "month" | "quarter" | "all";

/** Atajos de período relativos a la fecha de hoy. */
export function periodPreset(preset: Preset, catalogs: Catalogs | undefined) {
  const today = new Date();
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const to = iso(today);
  if (preset === "month")
    return {
      from: iso(new Date(today.getFullYear(), today.getMonth(), 1)),
      to,
    };
  if (preset === "quarter")
    return {
      from: iso(
        new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1),
      ),
      to,
    };
  if (preset === "all" && catalogs?.firstTicketDate)
    return { from: catalogs.firstTicketDate, to };
  return {
    from: iso(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29),
    ),
    to,
  };
}
