import { useState } from "react";
import {
  ChartColumn,
  Check,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  periodPreset,
  type Filters,
  type Preset,
} from "@/modules/filters/types/filter-types";
import { useFilters } from "@/modules/filters/hooks/use-filters";
import { cn } from "@/lib/utils";
import { formatDay } from "@/lib/formats";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/panel";
import { SelectField } from "@/components/select-field";
import { useDownloadReport } from "../hooks/use-reports";
import {
  formatLabel,
  type ReportFormat,
  type ReportKind,
} from "../types/report-types";

type ReportSpec = {
  kind: ReportKind;
  icon: LucideIcon;
  title: string;
  question: string;
  contents: Record<ReportFormat, string[]>;
  note?: string;
};

/** Cada reporte responde una pregunta. El contenido depende del formato: PDF resume para leer, Excel entrega los datos. */
const reports: ReportSpec[] = [
  {
    kind: "servicio",
    icon: ChartColumn,
    title: "Informe del servicio",
    question: "¿Cómo está funcionando el servicio?",
    contents: {
      pdf: [
        "Resumen ejecutivo: eficacia, eficiencia y efectividad frente a su meta",
        "Hallazgos principales en lenguaje simple",
        "Gráficos de volumen, resultados, prioridad y tiempos",
        "Comparativo por equipo y área, método y calidad de datos",
      ],
      xlsx: [
        "Hoja de resumen con filtros, indicadores, meta y estado",
        "Serie diaria o semanal, resultados, prioridad, equipo, área, categoría y tiempos",
        "Todos los tickets del período",
        "Hoja de método: fórmulas, objetivos y calidad de datos",
      ],
    },
  },
  {
    kind: "atencion",
    icon: Ticket,
    title: "Tickets que necesitan atención",
    question: "¿Qué hay que resolver primero?",
    contents: {
      pdf: [
        "Abiertos, atrasados y sin agente",
        "Dónde se acumulan: por agente y por categoría",
        "Listado de abiertos, atrasados primero (hasta 300)",
      ],
      xlsx: [
        "Resumen con filtros y conteos",
        "Listado completo de abiertos con antigüedad y objetivo",
      ],
    },
  },
  {
    kind: "agentes",
    icon: Users,
    title: "Rendimiento del equipo",
    question: "¿Cómo se reparte y resuelve el trabajo?",
    contents: {
      pdf: [
        "Indicadores del equipo frente a su meta",
        "Tabla por agente: carga, resueltos, atrasados e indicadores",
      ],
      xlsx: [
        "Resumen del equipo con meta y estado",
        "Tabla por agente con todas las métricas",
      ],
    },
    note: "Compara al equipo completo: no aplica los filtros de agente ni de estado.",
  },
];

const formats: { format: ReportFormat; icon: LucideIcon; detail: string }[] = [
  { format: "pdf", icon: FileText, detail: "Para leer, imprimir y compartir" },
  {
    format: "xlsx",
    icon: FileSpreadsheet,
    detail: "Para analizar, filtrar y graficar",
  },
];

const presets = [
  { value: "last30", label: "Últimos 30 días" },
  { value: "month", label: "Este mes" },
  { value: "quarter", label: "Este trimestre" },
  { value: "all", label: "Todo el histórico" },
];

export function ReportBuilder() {
  const { filters, catalogs } = useFilters();
  const download = useDownloadReport();
  const [kind, setKind] = useState<ReportKind>("servicio");
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [preset, setPreset] = useState<Preset | "">("");
  const [area, setArea] = useState<string | null>(null);

  const spec = reports.find((r) => r.kind === kind)!;
  const custom: Filters = {
    ...filters,
    ...(preset ? periodPreset(preset, catalogs) : {}),
    area: area ?? filters.area,
  };

  return (
    <Panel
      title="Generar un reporte"
      subtitle="Elegí qué necesitás saber, el período y el formato. Se aplican los demás filtros activos del dashboard."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <fieldset className="min-w-0">
          <legend className="mb-2 text-xs font-semibold text-muted-foreground">
            1 · Contenido
          </legend>
          <div className="grid gap-2" role="radiogroup">
            {reports.map(({ kind: k, icon: Icon, title, question }) => {
              const active = k === kind;
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setKind(k)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    active
                      ? "border-primary bg-accent/60"
                      : "border-border hover:border-input hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-lg",
                      active
                        ? "bg-primary text-white "
                        : "bg-accent text-primary",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[13px] font-semibold text-foreground">
                      {title}
                    </strong>
                    <small className="text-xs text-muted-foreground">
                      {question}
                    </small>
                  </span>
                  {active && (
                    <Check
                      className="size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex min-w-0 flex-col gap-4">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-muted-foreground">
              2 · Período y área
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Período"
                value={preset}
                allLabel="El del dashboard"
                options={presets}
                onChange={(v) => setPreset(v as Preset | "")}
              />
              <SelectField
                label="Área solicitante"
                value={area ?? filters.area}
                allLabel="Todas las áreas"
                options={catalogs.areas}
                onChange={setArea}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold text-muted-foreground">
              3 · Formato
            </legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {formats.map(({ format: f, icon: Icon, detail }) => {
                const active = f === format;
                return (
                  <button
                    key={f}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFormat(f)}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors",
                      active
                        ? "border-primary bg-accent/60"
                        : "border-border hover:border-input hover:bg-muted",
                    )}
                  >
                    <Icon
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="block text-[13px] font-semibold text-foreground">
                        {formatLabel[f]}
                      </strong>
                      <small className="text-xs text-muted-foreground">
                        {detail}
                      </small>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-5 grid gap-4 rounded-lg bg-muted p-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="min-w-0">
          <p className="text-[13px] text-secondary-foreground">
            <b className="font-semibold text-foreground">{spec.title}</b> en{" "}
            {formatLabel[format]} · del{" "}
            <b className="font-semibold text-foreground">
              {formatDay(custom.from)}
            </b>{" "}
            al{" "}
            <b className="font-semibold text-foreground">
              {formatDay(custom.to)}
            </b>
            , {custom.area || "todas las áreas"}.
          </p>
          <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
            {spec.contents[format].map((line) => (
              <li key={line} className="flex gap-2">
                <Check
                  className="mt-0.5 size-3.5 shrink-0 text-ok"
                  aria-hidden="true"
                />
                {line}
              </li>
            ))}
          </ul>
          {spec.note && (
            <p className="mt-2 text-xs text-muted-foreground">{spec.note}</p>
          )}
        </div>
        <Button
          className="w-full sm:w-auto"
          disabled={download.isPending}
          onClick={() => download.mutate({ kind, format, filters: custom })}
        >
          {download.isPending ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Download aria-hidden="true" />
          )}
          {download.isPending
            ? "Generando…"
            : `Descargar ${formatLabel[format]}`}
        </Button>
      </div>
    </Panel>
  );
}
