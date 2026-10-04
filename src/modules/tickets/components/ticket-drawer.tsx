import { Button } from "@/components/ui/button";
import { ErrorState, Loading } from "@/components/states";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDate, formatDuration } from "@/lib/formats";
import { useTicketParam } from "@/modules/filters/hooks/use-filters";
import { useTicketTimeline } from "../hooks/use-tickets";
import type { TicketRow } from "../types/ticket-types";
import { X } from "lucide-react";
import { StatusBadge } from "./ticket-badges";

/** Historial del ticket indicado en `?ticket=`. Se monta una sola vez en el layout. */
export function TicketDrawer() {
  const [id, openTicket] = useTicketParam();

  return (
    <Sheet
      open={id != null}
      onOpenChange={(open) => !open && openTicket(undefined)}
    >
      <SheetContent
        showCloseButton={false}
        className="w-full gap-0 overflow-y-auto sm:max-w-[460px]"
      >
        {id != null && <TicketHistory id={id} />}
      </SheetContent>
    </Sheet>
  );
}

function TicketHistory({ id }: { id: number }) {
  const { data, error, refetch } = useTicketTimeline(id);

  return (
    <>
      <SheetHeader className="sticky top-0 z-10 border-b bg-card/95 px-5 py-4 pr-12 backdrop-blur">
        <p className="text-xs font-medium text-primary">Historial del ticket</p>
        <SheetTitle className="font-figures text-2xl font-semibold">
          {data?.ticket.number ?? "…"}
        </SheetTitle>
        <SheetDescription className="text-[13px] text-secondary-foreground">
          {data?.ticket.title ?? "Cargando historial…"}
        </SheetDescription>
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3"
            aria-label="Cerrar"
          >
            <X />
          </Button>
        </SheetClose>
      </SheetHeader>
      <div className="p-5">
        {error ? (
          <ErrorState message={error.message} onRetry={() => void refetch()} />
        ) : !data ? (
          <Loading label="Cargando historial…" />
        ) : (
          <>
            <Facts t={data.ticket} />
            <h3 className="mt-6 mb-3 text-[13px] font-semibold">
              Línea de tiempo
            </h3>
            <ol className="relative grid gap-4 border-l-2 border-border pl-5">
              {data.events.map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute top-1.5 -left-[27px] size-3 rounded-full border-2 border-card bg-primary" />
                  <time className="text-xs text-muted-foreground">
                    {formatDate(e.at, true)}
                  </time>
                  <strong className="block text-[13px] font-semibold">
                    {e.description}
                  </strong>
                  <span className="text-xs text-muted-foreground">
                    {e.actor}, {e.state}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </>
  );
}

function Facts({ t }: { t: TicketRow }) {
  const facts: [string, string][] = [
    ["Creado", formatDate(t.createdAt, true)],
    ["Agente responsable", t.agent],
    ["Prioridad", t.priority],
    ["Objetivo de resolución", formatDuration(t.targetSeconds)],
    ["Primera atención", formatDuration(t.firstAttentionSeconds)],
    [
      "Resolución",
      t.bulkClosed
        ? "Cierre masivo (no medible)"
        : formatDuration(t.resolutionSeconds),
    ],
    ["Unidad", t.unit],
    ["Ubicación", t.location],
  ];

  return (
    <>
      <div className="mb-3">
        <StatusBadge status={t.status} />
      </div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {facts.map(([k, v]) => (
          <div key={k} className="bg-card p-3">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-0.5 text-[13px] font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
