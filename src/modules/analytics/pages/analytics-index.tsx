import { useState, type ReactNode } from "react";
import { FilterBar } from "@/modules/filters/components/filter-bar";
import { useFilters } from "@/modules/filters/hooks/use-filters";
import { ExportButton } from "@/modules/reports/components/export-button";
import { TicketTable } from "@/modules/tickets/components/ticket-table";
import { cn } from "@/lib/utils";
import { formatDuration, formatInt } from "@/lib/formats";
import { Bars } from "@/components/charts";
import { ErrorState, PageSkeleton } from "@/components/states";
import { Notices } from "@/components/notices";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { Segmented } from "@/components/segmented";
import { useOverview } from "../hooks/use-overview";
import {
  OutcomeBreakdown,
  PriorityChart,
} from "../components/effectiveness-charts";
import { GroupScoreTable } from "../components/group-score-table";
import { IndicatorCards } from "../components/indicator-cards";
import { IndicatorTrend } from "../components/indicator-trend";
import { LiveBand } from "../components/live-band";
import { ResolutionHistogram } from "../components/resolution-histogram";
import { VolumeChart } from "../components/volume-chart";

export default function AnalyticsIndex() {
  const { filters, setFilters } = useFilters();
  const { data, error, refetch, isPlaceholderData } = useOverview(filters);
  const [groupBy, setGroupBy] = useState<"unit" | "area">("unit");

  return (
    <>
      <PageHeader
        title="Análisis del servicio"
        subtitle="Eficacia, eficiencia y efectividad del soporte con datos reales de Znuny."
        action={<ExportButton kind="servicio" />}
      />
      <FilterBar
        fields={[
          "area",
          "unit",
          "status",
          "agentId",
          "category",
          "priorityId",
          "location",
        ]}
        caption="Período actual frente al anterior de igual duración"
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
          <LiveBand current={data.current} />

          <h2 className="sr-only">Indicadores del período seleccionado</h2>
          <IndicatorCards data={data} />

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel
              title="Tickets recibidos y cómo terminaron"
              subtitle={`${formatInt(data.volume.received)} recibidos, ${formatInt(data.volume.resolved)} resueltos · por ${data.trendBucket === "day" ? "día" : "semana"} de creación`}
            >
              <VolumeChart series={data.series} trend={data.trend} />
            </Panel>
            <Panel
              title="¿Estamos mejorando?"
              subtitle={`Eficacia y efectividad de los tickets creados cada ${data.trendBucket === "day" ? "día" : "semana"}`}
            >
              <IndicatorTrend series={data.series} />
            </Panel>
          </div>

          <Section
            name="Efectividad"
            question="¿Se resolvió bien y a tiempo?"
            color="var(--chart-efectividad)"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Resultado de los tickets"
              subtitle="Qué pasó con cada ticket evaluado"
            >
              <OutcomeBreakdown outcomes={data.outcomes} />
            </Panel>
            <Panel
              title="Cumplimiento por prioridad"
              subtitle="Porcentaje resuelto dentro del objetivo de cada prioridad"
            >
              <PriorityChart items={data.byPriority} />
            </Panel>
          </div>

          <Section
            name="Eficiencia"
            question="¿Cuánto tiempo tomó?"
            color="var(--chart-eficiencia)"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="¿En cuánto tiempo se resuelven?"
              subtitle="Tickets resueltos según lo que tardaron"
            >
              <ResolutionHistogram
                bands={data.resolutionDistribution}
                kpi={data.indicators.resolutionTime}
              />
            </Panel>
            <Panel
              title="Tiempo típico por categoría"
              subtitle="Mediana de resolución, menos es mejor. Tocá una barra para filtrar."
            >
              <Bars
                tone="violet"
                items={data.resolutionByCategory.map((c) => ({
                  label: c.label,
                  value: c.medianSeconds,
                  hint: `${c.sample} tickets medidos`,
                }))}
                format={formatDuration}
                onSelect={(label) => setFilters({ category: label })}
                empty="No hay resoluciones medibles en la selección"
              />
            </Panel>
          </div>

          <Section
            name="Comparativo"
            question="¿Dónde funciona mejor el servicio?"
          />
          <Panel
            title={
              groupBy === "unit" ? "Por equipo de TI" : "Por área solicitante"
            }
            subtitle="Los tres indicadores lado a lado. Tocá una fila para filtrar."
            action={
              <Segmented
                label="Agrupar por"
                value={groupBy}
                onChange={setGroupBy}
                options={[
                  { value: "unit", label: "Equipo de TI" },
                  { value: "area", label: "Área" },
                ]}
              />
            }
          >
            <GroupScoreTable
              rows={groupBy === "unit" ? data.unitScores : data.areaScores}
              groupLabel={groupBy === "unit" ? "Equipo de TI" : "Área"}
              onSelect={(label) =>
                setFilters(
                  groupBy === "unit" ? { unit: label } : { area: label },
                )
              }
            />
          </Panel>

          <TicketTable />
        </div>
      )}
    </>
  );
}

function Section({
  name,
  question,
  color,
}: {
  name: string;
  question: ReactNode;
  color?: string;
}) {
  return (
    <h2 className="mt-8 mb-3 flex items-baseline gap-2">
      {color && (
        <i
          className="size-2.5 self-center rounded-full"
          style={{ background: color }}
        />
      )}
      <span className="text-base font-semibold tracking-tight text-foreground">
        {name}
      </span>
      <span className="text-[13px] text-muted-foreground">{question}</span>
    </h2>
  );
}
