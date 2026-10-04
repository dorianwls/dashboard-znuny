import { useNavigate } from "@tanstack/react-router";
import { CircleCheck, Clock3, Target, Users } from "lucide-react";
import { FilterBar } from "@/modules/filters/components/filter-bar";
import { useFilters } from "@/modules/filters/hooks/use-filters";
import type { AppSearch } from "@/modules/filters/types/filter-types";
import { ExportButton } from "@/modules/reports/components/export-button";
import { cn } from "@/lib/utils";
import { formatDuration, formatInt, formatPercent } from "@/lib/formats";
import { Empty, ErrorState, PageSkeleton } from "@/components/states";
import { Metric } from "@/components/metric";
import { Notices } from "@/components/notices";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { useAgents } from "../hooks/use-agents";
import { AgentList } from "../components/agent-list";

const concepts = [
  {
    term: "Eficacia",
    text: "¿Se logró el resultado? Porcentaje de tickets a cargo que están resueltos.",
  },
  {
    term: "Eficiencia",
    text: "¿Con cuánto tiempo? Mediana desde la creación hasta la primera atención y hasta la resolución.",
  },
  {
    term: "Efectividad",
    text: "¿Se logró bien y a tiempo? Resueltos dentro del objetivo de su prioridad y sin reabrirse.",
  },
];

export default function AgentIndex() {
  const { filters } = useFilters();
  const navigate = useNavigate();
  const { data, error, refetch, isPlaceholderData } = useAgents(filters);
  const people = data?.agents.filter((a) => a.agentId != null) ?? [];

  return (
    <>
      <PageHeader
        title="Agentes"
        subtitle="Cómo resuelve cada agente: resultado, tiempo y calidad de la atención."
        action={<ExportButton kind="agentes" />}
      />
      <FilterBar
        fields={["unit", "category", "priorityId", "location"]}
        caption="Tickets creados en el período, por agente responsable"
      />

      {error ? (
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : !data ? (
        <PageSkeleton />
      ) : (
        <div
          className={cn(
            "transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          <Notices notices={data.notices} />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Metric
              icon={Users}
              tone="accent"
              label="Agentes con tickets"
              value={formatInt(people.length)}
              detail={`${formatInt(data.meta.population)} tickets en el período`}
            />
            <Metric
              icon={CircleCheck}
              tone="ok"
              label="Eficacia del equipo"
              value={formatPercent(data.team.eficacia.percent)}
              detail="Resueltos ÷ recibidos"
            />
            <Metric
              icon={Target}
              tone="warn"
              label="Efectividad del equipo"
              value={formatPercent(data.team.efectividad.percent)}
              detail="A tiempo y sin reabrir"
            />
            <Metric
              icon={Clock3}
              tone="violet"
              label="Eficiencia del equipo"
              value={formatDuration(data.team.resolutionTime.medianSeconds)}
              detail="Mediana de resolución"
            />
          </div>

          <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {concepts.map((c) => (
              <div key={c.term} className="bg-card px-4 py-3">
                <dt className="text-[13px] font-semibold text-accent-foreground">
                  {c.term}
                </dt>
                <dd className="mt-0.5 text-[13px] text-secondary-foreground">
                  {c.text}
                </dd>
              </div>
            ))}
          </dl>

          <Panel
            title="Desempeño por agente"
            subtitle="Ordenado por volumen a cargo. Compará siempre junto con el tipo y la cantidad de casos."
            className="mt-4"
          >
            {data.agents.length === 0 ? (
              <Empty>No hay tickets en la selección.</Empty>
            ) : (
              <AgentList
                agents={data.agents}
                onViewTickets={(agentId) =>
                  void navigate({
                    to: "/analisis",
                    search: (prev: AppSearch) => ({
                      ...prev,
                      agentId: String(agentId),
                    }),
                  })
                }
              />
            )}
          </Panel>
        </div>
      )}
    </>
  );
}
