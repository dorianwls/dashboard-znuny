import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCatalogs } from "@/modules/catalogs/hooks/use-catalogs";
import type { Catalogs } from "@/modules/catalogs/types/catalog-types";
import {
  resolveFilters,
  type AppSearch,
  type Filters,
} from "../types/filter-types";

/** Quita los valores vacíos para que la URL solo muestre lo que filtra. */
function clean(search: AppSearch): AppSearch {
  return Object.fromEntries(
    Object.entries(search).filter(([, v]) => v !== "" && v != null),
  ) as AppSearch;
}

export function useAppSearch() {
  return useSearch({ strict: false }) as AppSearch;
}

/**
 * Filtros activos leídos de la URL. Solo se usa dentro del layout principal, que garantiza los catálogos.
 * `setFilters` reemplaza la entrada del historial para que el botón «atrás» no recorra cada cambio de selector.
 */
export function useFilters() {
  const search = useAppSearch();
  const catalogs = useCatalogs().data as Catalogs;
  const navigate = useNavigate();

  const setFilters = useCallback(
    (patch: Partial<Filters>) => {
      void navigate({
        to: ".",
        search: (prev: AppSearch) => clean({ ...prev, ...patch }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const reset = useCallback(() => {
    void navigate({ to: ".", search: {}, replace: true, resetScroll: false });
  }, [navigate]);

  return {
    filters: resolveFilters(search, catalogs),
    catalogs,
    setFilters,
    reset,
  };
}

/** Abre o cierra el historial de un ticket (`?ticket=`), de modo que también se pueda compartir. */
export function useTicketParam() {
  const { ticket } = useAppSearch();
  const navigate = useNavigate();
  const open = useCallback(
    (id: number | undefined) => {
      void navigate({
        to: ".",
        search: (prev: AppSearch) => ({ ...prev, ticket: id }),
        resetScroll: false,
      });
    },
    [navigate],
  );
  return [ticket, open] as const;
}
