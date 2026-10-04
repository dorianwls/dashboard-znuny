import { ArrowUpRight, Building2 } from "lucide-react";
import { formatDuration, formatInt, formatPercent } from "@/lib/formats";
import { Bars } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/panel";
import type { LocationSummary } from "../types/location-types";

export function LocationDetail({
  location: l,
  onViewTickets,
}: {
  location: LocationSummary;
  onViewTickets: () => void;
}) {
  const stats: [string, string, string?][] = [
    [
      "Abiertos",
      formatInt(l.open),
      l.overdue > 0 ? `${formatInt(l.overdue)} atrasados` : undefined,
    ],
    ["Resueltos", formatInt(l.resolved)],
    ["Eficacia", formatPercent(l.indicators.eficacia.percent)],
    ["Efectividad", formatPercent(l.indicators.efectividad.percent)],
  ];
  return (
    <Panel title={l.name} subtitle="Recinto seleccionado">
      <div className="flex items-center gap-3 rounded-lg bg-band p-4 text-band-foreground">
        <span className="grid size-10 place-items-center rounded-lg bg-band-highlight/15 text-band-highlight">
          <Building2 className="size-5" aria-hidden="true" />
        </span>
        <div>
          <strong className="block text-lg font-semibold">{l.key}</strong>
          <span className="text-[13px] text-band-subtle">
            {formatInt(l.total)} tickets en el período
          </span>
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {stats.map(([k, v, note]) => (
          <div key={k} className="bg-card p-3">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="font-figures text-xl font-semibold">{v}</dd>
            {note && <dd className="text-xs font-semibold text-bad">{note}</dd>}
          </div>
        ))}
        <div className="col-span-2 bg-card p-3">
          <dt className="text-xs text-muted-foreground">
            Tiempo de resolución (mediana)
          </dt>
          <dd className="font-figures text-xl font-semibold">
            {formatDuration(l.indicators.resolutionTime.medianSeconds)}
          </dd>
        </div>
      </dl>
      <h3 className="mt-4 mb-1 text-[13px] font-semibold">
        Equipos que atienden
      </h3>
      <Bars items={l.byUnit.map((u) => ({ label: u.label, value: u.count }))} />
      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={onViewTickets}
        disabled={l.total === 0}
      >
        Ver estos tickets en Análisis
        <ArrowUpRight aria-hidden="true" />
      </Button>
    </Panel>
  );
}
