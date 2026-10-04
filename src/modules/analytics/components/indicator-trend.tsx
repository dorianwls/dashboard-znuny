import { useState } from "react";
import { formatInt, formatPercent } from "@/lib/formats";
import { ChartTip, Legend } from "@/components/charts";
import { Empty } from "@/components/states";
import type { SeriesPoint } from "../types/analytics-types";

const lines = [
  { key: "eficacia", label: "Eficacia", color: "var(--chart-eficacia)" },
  {
    key: "efectividad",
    label: "Efectividad",
    color: "var(--chart-efectividad)",
  },
] as const;
const PLOT = 180;
/** Con menos tickets que esto el porcentaje del tramo es poco fiable: se dibuja el punto hueco. */
const SMALL = 5;

/** Eficacia y efectividad de los tickets creados en cada tramo, en la misma escala 0–100 %. */
export function IndicatorTrend({ series }: { series: SeriesPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = series.length;
  const withData = series.filter((s) => s.received > 0).length;
  if (withData < 2)
    return (
      <Empty>
        Se necesitan al menos dos días o semanas con tickets para ver la
        evolución
      </Empty>
    );

  const x = (i: number) => i + 0.5;
  const y = (v: number) => PLOT - (v / 100) * PLOT;
  const active = hover != null ? series[hover] : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Legend
          items={lines.map((l) => ({
            label: l.label,
            color: l.color,
            kind: "line" as const,
          }))}
        />
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <i className="size-2.5 rounded-full border-2 border-faint" />
          Menos de {SMALL} tickets
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
        <div
          className="relative font-figures text-[11px] text-faint"
          style={{ height: PLOT }}
        >
          {[100, 75, 50, 25, 0].map((t) => (
            <span
              key={t}
              className="absolute right-0 -translate-y-1/2"
              style={{ top: `${100 - t}%` }}
            >
              {t}%
            </span>
          ))}
        </div>

        <div
          className="relative"
          style={{ height: PLOT }}
          onMouseLeave={() => setHover(null)}
        >
          {[100, 75, 50, 25, 0].map((t) => (
            <div
              key={t}
              className="absolute inset-x-0 border-t border-border"
              style={{ top: `${100 - t}%` }}
            />
          ))}

          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${n} ${PLOT}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {hover != null && (
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1="0"
                y2={PLOT}
                stroke="var(--input)"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {lines.map((l) => {
              // Los tramos sin tickets no son 0 %: no hay dato. Se saltan con un trazo punteado y tenue.
              const idx = series.flatMap((s, i) =>
                s[l.key] == null ? [] : [i],
              );
              return idx.slice(1).map((i, k) => {
                const prev = idx[k];
                const gap = i - prev > 1;
                return (
                  <line
                    key={`${l.key}${i}`}
                    x1={x(prev)}
                    y1={y(series[prev][l.key]!)}
                    x2={x(i)}
                    y2={y(series[i][l.key]!)}
                    stroke={l.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={gap ? "3 5" : undefined}
                    strokeOpacity={gap ? 0.5 : 1}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              });
            })}
          </svg>

          {/* Los puntos van en HTML para que sean redondos aunque el SVG se estire. */}
          {lines.map((l) =>
            series.map((s, i) =>
              s[l.key] == null ? null : (
                <i
                  key={`${l.key}${i}`}
                  className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card"
                  style={{
                    left: `${(x(i) / n) * 100}%`,
                    top: `${(y(s[l.key]!) / PLOT) * 100}%`,
                    background: s.received < SMALL ? "var(--card)" : l.color,
                    border: `2px solid ${l.color}`,
                  }}
                />
              ),
            ),
          )}

          <div className="absolute inset-0 flex">
            {series.map((s, i) => (
              <button
                type="button"
                key={i}
                className="h-full min-w-0 flex-1"
                aria-label={`${s.label}: eficacia ${formatPercent(s.eficacia)}, efectividad ${formatPercent(s.efectividad)}, ${s.received} tickets`}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
              />
            ))}
          </div>

          {active && (
            <ChartTip x={(x(hover!) / n) * 100}>
              <b className="mb-1 block font-semibold text-foreground">
                {active.label} · {formatInt(active.received)} tickets
              </b>
              {active.received === 0 ? (
                <span>Sin tickets creados</span>
              ) : (
                lines.map((l) => (
                  <span key={l.key} className="flex items-center gap-2">
                    <i
                      className="h-0.5 w-3 rounded"
                      style={{ background: l.color }}
                    />
                    <span className="flex-1">{l.label}</span>
                    <b className="font-figures font-semibold text-foreground">
                      {formatPercent(active[l.key])}
                    </b>
                  </span>
                ))
              )}
            </ChartTip>
          )}
        </div>

        <span />
        <div className="relative mt-2 h-4 text-[11px] text-faint">
          {series.map(
            (s, i) =>
              i % Math.max(1, Math.ceil(n / 6)) === 0 && (
                <span
                  key={i}
                  className="absolute -translate-x-1/2 whitespace-nowrap"
                  style={{ left: `${(x(i) / n) * 100}%` }}
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
