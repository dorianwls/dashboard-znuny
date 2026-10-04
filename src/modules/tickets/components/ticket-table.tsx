import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useFilters,
  useTicketParam,
} from "@/modules/filters/hooks/use-filters";
import { cn } from "@/lib/utils";
import { formatDate, formatInt } from "@/lib/formats";
import { Button } from "@/components/ui/button";
import { Empty, ErrorState } from "@/components/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useTickets } from "../hooks/use-tickets";
import type { TicketRow, TicketView } from "../types/ticket-types";
import { CustomTable } from "@/components/ui/custom-table";
import { ticketColumns } from "../types/ticket-table-types";
import { Resolution, StatusCell } from "./ticket-badges";

const NO_ROWS: TicketRow[] = [];

/** Tabla de evidencia: los tickets que explican las cifras de la selección. La paginación la hace el backend. */
export function TicketTable({
  title = "Tickets relacionados",
  view = "all",
}: {
  title?: string;
  view?: TicketView;
}) {
  const { filters } = useFilters();
  const [, openTicket] = useTicketParam();
  // La página vuelve a 1 cuando cambian los filtros.
  const key = JSON.stringify(filters);
  const [paging, setPaging] = useState({ key, page: 1 });
  const page = paging.key === key ? paging.page : 1;
  const setPage = (p: number) => setPaging({ key, page: p });

  const { data, error, refetch, isPlaceholderData } = useTickets(
    filters,
    view,
    page,
  );
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  const rows = data?.items ?? NO_ROWS;

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <header className="flex flex-wrap items-end justify-between gap-2 px-4 pt-4 pb-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {data
              ? `${formatInt(data.total)} tickets, ${view === "attention" ? "atrasados primero" : "los más recientes primero"}. Elegí uno para ver su historial.`
              : "Cargando tickets…"}
          </p>
        </div>
      </header>

      {error ? (
        <ErrorState
          className="mx-4 mb-4"
          message={error.message}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <div className="grid gap-2 px-4 pb-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl bg-border/70" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="px-5 pb-2">
          <Empty>No hay tickets para estos filtros.</Empty>
        </div>
      ) : (
        <div
          className={cn(
            "transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          {/* Escritorio: tabla completa. */}
          <div className="hidden md:block">
            <CustomTable
              data={rows}
              columns={ticketColumns}
              onRowClick={(t) => openTicket(t.id)}
              className="min-w-[960px]"
            />
          </div>

          {/* Móvil: tarjetas con lo esencial. */}
          <ul className="divide-y divide-border border-t border-border md:hidden">
            {rows.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => openTicket(t.id)}
                  className="grid w-full gap-2 px-4 py-3 text-left active:bg-muted"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <strong className="font-semibold">{t.number}</strong>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(t.createdAt)}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[13px] text-secondary-foreground">
                    {t.title}
                  </p>
                  <StatusCell t={t} />
                  <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                    <span className="truncate">{t.agent}</span>
                    <Resolution t={t} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data && data.total > data.pageSize && (
        <nav
          aria-label="Paginación"
          className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-[13px] text-muted-foreground sm:px-5"
        >
          <span>
            Página <b className="font-semibold text-foreground">{page}</b> de{" "}
            {formatInt(pages)}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              aria-label="Página anterior"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page >= pages}
              aria-label="Página siguiente"
            >
              <ChevronRight />
            </Button>
          </div>
        </nav>
      )}
    </section>
  );
}
