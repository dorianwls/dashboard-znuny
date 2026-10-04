import { formatInt } from "@/lib/formats";
import { LiveFigure } from "@/components/metric";
import type { Overview } from "../types/analytics-types";

/** Lo que pasa ahora, independiente del período: la superficie destacada de la vista. */
export function LiveBand({ current }: { current: Overview["current"] }) {
  return (
    <section
      aria-label="Estado actual"
      className="relative mb-4 overflow-hidden rounded-xl bg-band px-5 py-5 text-band-foreground shadow-card ring-1 ring-band-ring sm:px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_right,var(--band-glow),transparent_70%)]"
      />
      <p className="relative mb-4 flex items-center gap-2 text-[13px] font-semibold text-band-highlight">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-band-highlight opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-band-highlight" />
        </span>
        Ahora mismo en la mesa de ayuda
      </p>
      <div className="relative grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        <LiveFigure
          label="Abiertos"
          value={formatInt(current.open)}
          detail="Esperando solución"
        />
        <LiveFigure
          label="Atrasados"
          value={formatInt(current.overdue)}
          detail="Superaron el objetivo de su prioridad"
          alert={current.overdue > 0}
        />
        <LiveFigure
          label="Sin agente"
          value={formatInt(current.unassigned)}
          detail="Nadie los tomó todavía"
          alert={current.unassigned > 0}
        />
      </div>
    </section>
  );
}
