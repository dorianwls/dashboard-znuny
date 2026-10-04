import { formatDuration, formatInt, formatPercent } from "@/lib/formats";
import { Empty } from "@/components/states";
import type { CountItem, DurationKpi } from "@/types/api-types";

const PLOT = 150;

/** Cuántos tickets se resolvieron en cada rango de tiempo: muestra si la mayoría es rápida y cuántos se alargan. */
export function ResolutionHistogram({
  bands,
  kpi,
}: {
  bands: CountItem[];
  kpi: DurationKpi;
}) {
  const total = bands.reduce((sum, b) => sum + b.count, 0);
  const peak = Math.max(1, ...bands.map((b) => b.count));
  if (!total)
    return <Empty>No hay resoluciones medibles en la selección</Empty>;

  const fast = bands.slice(0, 2).reduce((sum, b) => sum + b.count, 0);

  return (
    <div>
      <p className="text-[13px] text-secondary-foreground">
        La mitad se resolvió en menos de{" "}
        <b className="font-semibold text-foreground">
          {formatDuration(kpi.medianSeconds)}
        </b>
        ; 9 de cada 10 en menos de{" "}
        <b className="font-semibold text-foreground">
          {formatDuration(kpi.p90Seconds)}
        </b>
        . {formatPercent(Math.round((1000 * fast) / total) / 10)} se resolvió en
        menos de 2 horas.
      </p>

      <div
        className="mt-5 flex items-end gap-2 border-b border-input"
        style={{ height: PLOT + 20 }}
      >
        {bands.map((b) => (
          <div
            key={b.label}
            className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
            title={`${b.label}: ${b.count} tickets (${formatPercent(b.percent)})`}
          >
            <span className="mb-1 font-figures text-xs font-semibold text-foreground">
              {b.count > 0 ? formatInt(b.count) : ""}
            </span>
            <i
              className="block w-full max-w-10 rounded-t-[4px]"
              style={{
                height: (b.count / peak) * PLOT,
                minHeight: b.count ? 2 : 0,
                background: "var(--chart-eficiencia)",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {bands.map((b) => (
          <span
            key={b.label}
            className="min-w-0 flex-1 text-center text-[11px] leading-tight text-muted-foreground"
          >
            {b.label}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {formatInt(kpi.sample)} tickets medidos
        {kpi.excluded > 0 &&
          `, ${formatInt(kpi.excluded)} cierres masivos excluidos`}
        .
      </p>
    </div>
  );
}
