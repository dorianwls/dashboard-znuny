import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDuration,
  formatInt,
  formatPercent,
  initials,
} from "@/lib/formats";
import { Button } from "@/components/ui/button";
import type { AgentScore } from "../types/agent-types";

const grid = "lg:grid-cols-[minmax(13rem,1.6fr)_repeat(6,minmax(0,1fr))_auto]";

export function AgentList({
  agents,
  onViewTickets,
}: {
  agents: AgentScore[];
  onViewTickets: (agentId: number) => void;
}) {
  return (
    <div
      role="table"
      aria-label="Desempeño por agente"
      className="-mx-4 sm:-mx-5"
    >
      <div
        role="row"
        className={cn(
          "hidden gap-4 border-y border-border bg-muted px-5 py-2.5 text-xs font-medium text-muted-foreground lg:grid",
          grid,
        )}
      >
        {[
          "Agente",
          "A cargo",
          "Eficacia",
          "Efectividad",
          "Resolución",
          "1.ª atención",
          "Abiertos",
          "",
        ].map((h, i) => (
          <span key={i} role="columnheader">
            {h}
          </span>
        ))}
      </div>
      {agents.map((a) => (
        <AgentRow
          key={a.agentId ?? "none"}
          agent={a}
          onViewTickets={onViewTickets}
        />
      ))}
    </div>
  );
}

function Stat({
  label,
  value,
  children,
  title,
}: {
  label: string;
  value: string;
  children?: ReactNode;
  title?: string;
}) {
  return (
    <div role="cell" title={title} className="min-w-0">
      <span className="text-xs text-muted-foreground lg:hidden">{label}</span>
      <b className="block font-figures text-base font-semibold text-foreground">
        {value}
      </b>
      <span className="block text-xs text-muted-foreground">{children}</span>
    </div>
  );
}

function AgentRow({
  agent: a,
  onViewTickets,
}: {
  agent: AgentScore;
  onViewTickets: (agentId: number) => void;
}) {
  const i = a.indicators;
  const system = a.agentId == null;
  return (
    <div
      role="row"
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-3 border-b border-border px-4 py-4 last:border-0 sm:grid-cols-3 sm:px-5 lg:items-center",
        grid,
        system && "bg-muted/60",
      )}
    >
      <div
        role="cell"
        className="col-span-2 flex min-w-0 items-center gap-3 sm:col-span-3 lg:col-span-1"
      >
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold",
            system
              ? "bg-border text-muted-foreground"
              : "bg-accent text-accent-foreground",
          )}
        >
          {system ? "—" : initials(a.name)}
        </span>
        <div className="min-w-0">
          <strong className="block truncate font-semibold">{a.name}</strong>
          <small className="block truncate text-xs text-muted-foreground">
            {system
              ? "Tickets cuyo propietario es una cuenta de sistema"
              : a.units.slice(0, 2).join(", ")}
          </small>
        </div>
      </div>
      <Stat label="A cargo" value={formatInt(a.assigned)}>
        {formatInt(a.resolved)} resueltos
      </Stat>
      <div role="cell" className="min-w-0">
        <span className="text-xs text-muted-foreground lg:hidden">
          Eficacia
        </span>
        <b className="block font-figures text-base font-semibold">
          {formatPercent(i.eficacia.percent)}
        </b>
        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted">
          <i
            className="block h-full rounded-full bg-primary"
            style={{ width: `${i.eficacia.percent ?? 0}%` }}
          />
        </span>
      </div>
      <Stat
        label="Efectividad"
        value={formatPercent(i.efectividad.percent)}
        title={`${i.efectividad.numerator} de ${i.efectividad.denominator} evaluados, ${i.efectividad.pending} en plazo, ${i.efectividad.excluded} cierres masivos excluidos`}
      >
        {i.efectividad.denominator
          ? `${formatInt(i.efectividad.denominator)} evaluados`
          : "Sin casos medibles"}
      </Stat>
      <Stat
        label="Resolución"
        value={formatDuration(i.resolutionTime.medianSeconds)}
        title={`9 de cada 10 en ${formatDuration(i.resolutionTime.p90Seconds)}`}
      >
        {i.resolutionTime.sample
          ? `${formatInt(i.resolutionTime.sample)} medidos`
          : a.bulkClosed
            ? "Solo cierres masivos"
            : "Sin resoluciones"}
      </Stat>
      <Stat
        label="1.ª atención"
        value={formatDuration(i.firstAttentionTime.medianSeconds)}
        title={`${i.firstAttentionTime.excluded} sin espera medible (abiertos por el agente o cierres masivos)`}
      >
        {i.firstAttentionTime.sample
          ? `${formatInt(i.firstAttentionTime.sample)} medidos`
          : "Sin espera medible"}
      </Stat>
      <Stat label="Abiertos" value={formatInt(a.open)}>
        {a.overdue ? (
          <span className="font-semibold text-bad">
            {formatInt(a.overdue)} atrasados
          </span>
        ) : (
          "Al día"
        )}
      </Stat>
      <div role="cell" className="col-span-2 sm:col-span-3 lg:col-span-1">
        {!system && (
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary -ml-2 lg:ml-0"
            onClick={() => onViewTickets(a.agentId!)}
          >
            Ver tickets
            <ArrowUpRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
