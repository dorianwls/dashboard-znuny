import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  percentChange,
  formatDuration,
  formatInt,
  formatPercent,
} from "@/lib/formats";
import { Delta } from "@/components/metric";
import type { Overview } from "../types/analytics-types";

/** Las tres preguntas del servicio, cada una con su cifra, su comparación y una frase que la explica. */
export function IndicatorCards({ data }: { data: Overview }) {
  const { eficacia, efectividad, resolutionTime, firstAttentionTime } =
    data.indicators;
  const prev = data.previousIndicators;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card
        name="Eficacia"
        question="¿Se resolvió lo que se recibió?"
        color="var(--chart-eficacia)"
        value={formatPercent(eficacia.percent)}
        delta={
          <PointsDelta
            current={eficacia.percent}
            previous={prev.eficacia.percent}
          />
        }
        visual={
          <Meter percent={eficacia.percent} color="var(--chart-eficacia)" />
        }
        previous={
          prev.eficacia.percent == null
            ? null
            : formatPercent(prev.eficacia.percent)
        }
      >
        <b className="font-semibold text-foreground">
          {formatInt(eficacia.numerator)}
        </b>{" "}
        de {formatInt(eficacia.denominator)} tickets recibidos ya están
        resueltos.
      </Card>

      <Card
        name="Eficiencia"
        question="¿Cuánto se tardó en resolver?"
        color="var(--chart-eficiencia)"
        value={formatDuration(resolutionTime.medianSeconds)}
        delta={
          <Delta
            value={percentChange(
              resolutionTime.medianSeconds,
              prev.resolutionTime.medianSeconds,
            )}
            lowerIsBetter
          />
        }
        visual={
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-muted px-2.5 py-1.5">
              <dt className="text-muted-foreground">9 de cada 10</dt>
              <dd className="font-figures text-sm font-semibold text-foreground">
                {formatDuration(resolutionTime.p90Seconds)}
              </dd>
            </div>
            <div className="rounded-md bg-muted px-2.5 py-1.5">
              <dt className="text-muted-foreground">1.ª atención</dt>
              <dd className="font-figures text-sm font-semibold text-foreground">
                {formatDuration(firstAttentionTime.medianSeconds)}
              </dd>
            </div>
          </dl>
        }
        previous={
          prev.resolutionTime.medianSeconds == null
            ? null
            : formatDuration(prev.resolutionTime.medianSeconds)
        }
      >
        Tiempo típico (mediana) de {formatInt(resolutionTime.sample)} tickets
        medidos, sin cierres masivos.
      </Card>

      <Card
        name="Efectividad"
        question="¿Se resolvió bien y a tiempo?"
        color="var(--chart-efectividad)"
        value={formatPercent(efectividad.percent)}
        delta={
          <PointsDelta
            current={efectividad.percent}
            previous={prev.efectividad.percent}
          />
        }
        visual={
          <Meter
            percent={efectividad.percent}
            color="var(--chart-efectividad)"
          />
        }
        previous={
          prev.efectividad.percent == null
            ? null
            : formatPercent(prev.efectividad.percent)
        }
      >
        <b className="font-semibold text-foreground">
          {formatInt(efectividad.numerator)}
        </b>{" "}
        de {formatInt(efectividad.denominator)} con resultado conocido, dentro
        del objetivo y sin reabrirse.
      </Card>
    </div>
  );
}

function Card({
  name,
  question,
  color,
  value,
  delta,
  visual,
  previous,
  children,
}: {
  name: string;
  question: string;
  color: string;
  value: string;
  delta: ReactNode;
  visual: ReactNode;
  previous: string | null;
  children: ReactNode;
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
          <i className="size-2.5 rounded-full" style={{ background: color }} />
          {name}
        </h3>
        {delta}
      </div>
      <p className="mt-0.5 text-[13px] text-muted-foreground">{question}</p>
      <strong className="mt-3 font-figures text-[40px] leading-none font-semibold tracking-tight text-foreground">
        {value}
      </strong>
      <div className="mt-3">{visual}</div>
      <p className="mt-3 text-[13px] text-secondary-foreground">{children}</p>
      <p className="mt-auto pt-2 text-xs text-muted-foreground">
        {previous == null ? (
          "Sin datos en el período anterior"
        ) : (
          <>
            Período anterior:{" "}
            <b className="font-figures font-semibold text-secondary-foreground">
              {previous}
            </b>
          </>
        )}
      </p>
    </article>
  );
}

function Meter({ percent, color }: { percent: number | null; color: string }) {
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-muted"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent ?? 0}
    >
      <i
        className="block h-full rounded-full transition-[width] duration-500"
        style={{ width: `${percent ?? 0}%`, background: color }}
      />
    </div>
  );
}

/** Para tasas se compara en puntos porcentuales: 60 % → 66 % es "+6 pts", no "+10 %". */
function PointsDelta({
  current,
  previous,
}: {
  current: number | null;
  previous: number | null;
}) {
  if (current == null || previous == null) return null;
  const diff = Math.round((current - previous) * 10) / 10;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        diff === 0
          ? "bg-muted text-muted-foreground"
          : diff > 0
            ? "bg-ok-soft text-ok"
            : "bg-bad-soft text-bad",
      )}
      title="Frente al período anterior, en puntos porcentuales"
    >
      {diff > 0 ? "↑" : diff < 0 ? "↓" : "="}{" "}
      {Math.abs(diff).toLocaleString("es-NI")} pts
    </span>
  );
}
