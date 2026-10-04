import { useState } from "react";
import { formatInt } from "@/lib/formats";
import { ChartTip, Legend } from "@/components/charts";
import { niceScale } from "@/lib/chart-scale";
import { Empty } from "@/components/states";
import type { Overview } from "../types/analytics-types";

const color = {
  resolved: "var(--chart-eficacia)",
  unsuccessful: "var(--chart-fail)",
  open: "var(--chart-open)",
  previous: "var(--faint)",
};
const PLOT = 180;

/** Columnas apiladas: lo recibido en cada tramo y cómo terminó. La línea punteada es el período anterior. */
export function VolumeChart({
  series,
  trend,
}: {
  series: Overview["series"];
  trend: Overview["trend"];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const previous = trend.map((t) => t.previous);
  const hasPrevious = previous.some((v) => v > 0);
  const hasUnsuccessful = series.some((s) => s.unsuccessful > 0);
  const { max, ticks } = niceScale(
    Math.max(
      ...series.map((s) => s.received),
      ...(hasPrevious ? previous : [0]),
    ),
  );
  const labelEvery = Math.max(1, Math.ceil(series.length / 6));

  if (!series.some((s) => s.received > 0))
    return <Empty>Sin tickets en el período</Empty>;

  const n = series.length;
  const active = hover != null ? series[hover] : null;

  return (
    <div>
      <Legend
        items={[
          { label: "Resueltos", color: color.resolved },
          { label: "Sin resolver", color: color.open },
          ...(hasUnsuccessful
            ? [{ label: "Cerrados sin éxito", color: color.unsuccessful }]
            : []),
          ...(hasPrevious
            ? [
                {
                  label: "Período anterior",
                  color: color.previous,
                  kind: "dashed" as const,
                },
              ]
            : []),
        ]}
      />

      <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
        <div
          className="relative font-figures text-[11px] text-faint"
          style={{ height: PLOT }}
        >
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${(1 - t / max) * 100}%` }}
            >
              {formatInt(t)}
            </span>
          ))}
        </div>

        <div
          className="relative"
          style={{ height: PLOT }}
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute inset-x-0 border-t border-border"
              style={{ top: `${(1 - t / max) * 100}%` }}
            />
          ))}

          <div className="absolute inset-0 flex items-end">
            {series.map((s, i) => (
              <button
                type="button"
                key={i}
                aria-label={`${s.label}: ${s.received} recibidos, ${s.resolved} resueltos, ${s.open} sin resolver`}
                className="flex h-full min-w-0 flex-1 items-end justify-center px-px focus-visible:bg-muted"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
              >
                <span
                  className="flex w-full max-w-6 flex-col-reverse gap-[2px]"
                  style={{
                    height: `${(s.received / max) * 100}%`,
                    opacity: hover == null || hover === i ? 1 : 0.45,
                  }}
                >
                  {(
                    [
                      ["resolved", s.resolved],
                      ["unsuccessful", s.unsuccessful],
                      ["open", s.open],
                    ] as const
                  )
                    .filter(([, v]) => v > 0)
                    .map(([k, v], j, all) => (
                      <i
                        key={k}
                        className={
                          j === all.length - 1 ? "rounded-t-[4px]" : ""
                        }
                        style={{
                          flexGrow: v,
                          flexBasis: 0,
                          minHeight: 2,
                          background: color[k],
                        }}
                      />
                    ))}
                </span>
              </button>
            ))}
          </div>

          {hasPrevious && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox={`0 0 ${n} ${PLOT}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polyline
                fill="none"
                stroke={color.previous}
                strokeWidth="2"
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                points={previous
                  .map((v, i) => `${i + 0.5},${PLOT - (v / max) * PLOT}`)
                  .join(" ")}
              />
            </svg>
          )}

          {active && (
            <ChartTip x={((hover! + 0.5) / n) * 100}>
              <b className="mb-1 block font-semibold text-foreground">
                {active.label}
              </b>
              <Row label="Recibidos" value={active.received} />
              <Row
                label="Resueltos"
                value={active.resolved}
                swatch={color.resolved}
              />
              <Row
                label="Sin resolver"
                value={active.open}
                swatch={color.open}
              />
              {hasUnsuccessful && (
                <Row
                  label="Sin éxito"
                  value={active.unsuccessful}
                  swatch={color.unsuccessful}
                />
              )}
              {hasPrevious && (
                <Row label="Período anterior" value={previous[hover!]} />
              )}
            </ChartTip>
          )}
        </div>

        <span />
        <div className="relative mt-2 h-4 text-[11px] text-faint">
          {series.map(
            (s, i) =>
              i % labelEvery === 0 && (
                <span
                  key={i}
                  className="absolute -translate-x-1/2 whitespace-nowrap"
                  style={{ left: `${((i + 0.5) / n) * 100}%` }}
                >
                  {s.label}
                </span>
              ),
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  swatch,
}: {
  label: string;
  value: number;
  swatch?: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <i
        className="size-2 rounded-sm"
        style={{ background: swatch ?? "transparent" }}
      />
      <span className="flex-1">{label}</span>
      <b className="font-figures font-semibold text-foreground">
        {formatInt(value)}
      </b>
    </span>
  );
}
