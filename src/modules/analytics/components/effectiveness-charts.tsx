import { formatDuration, formatInt, formatPercent } from "@/lib/formats";
import { Empty } from "@/components/states";
import type {
  OutcomeItem,
  OutcomeKey,
  PriorityCompliance,
} from "../types/analytics-types";

const outcomeColor: Partial<Record<OutcomeKey, string>> = {
  onTime: "var(--chart-efectividad)",
  late: "var(--chart-late)",
  reopened: "var(--chart-reopened)",
  overdue: "var(--chart-overdue)",
  unsuccessful: "var(--chart-unsuccessful)",
};

const pct = (part: number, total: number) =>
  total ? Math.round((1000 * part) / total) / 10 : null;

/** Barra 100 %: de los tickets evaluados, cuántos salieron bien y por qué fallaron los demás. */
export function OutcomeBreakdown({ outcomes }: { outcomes: OutcomeItem[] }) {
  const evaluated = outcomes.filter((o) => o.key in outcomeColor);
  const total = evaluated.reduce((sum, o) => sum + o.count, 0);
  const count = (key: OutcomeKey) =>
    outcomes.find((o) => o.key === key)?.count ?? 0;
  const failures = evaluated
    .filter((o) => o.key !== "onTime" && o.count > 0)
    .sort((a, b) => b.count - a.count);

  if (!total)
    return <Empty>Todavía no hay tickets con resultado conocido</Empty>;

  return (
    <div>
      <p className="text-[13px] text-secondary-foreground">
        <b className="font-semibold text-foreground">
          {formatInt(count("onTime"))}
        </b>{" "}
        de {formatInt(total)} tickets evaluados salieron bien.
        {failures[0] && (
          <>
            {" "}
            El principal problema:{" "}
            <b className="font-semibold text-foreground">
              {failures[0].label.toLowerCase()}
            </b>{" "}
            ({formatInt(failures[0].count)}).
          </>
        )}
      </p>

      <div
        className="mt-4 flex h-4 gap-[2px] overflow-hidden rounded-[4px]"
        role="img"
        aria-label={evaluated.map((o) => `${o.label}: ${o.count}`).join(", ")}
      >
        {evaluated
          .filter((o) => o.count > 0)
          .map((o) => (
            <i
              key={o.key}
              title={`${o.label}: ${formatInt(o.count)} (${formatPercent(pct(o.count, total))})`}
              style={{
                flexGrow: o.count,
                flexBasis: 0,
                minWidth: 3,
                background: outcomeColor[o.key],
              }}
            />
          ))}
      </div>

      <ul className="mt-4 grid gap-1.5">
        {evaluated.map((o) => (
          <li
            key={o.key}
            className={`flex items-center gap-2.5 text-[13px] ${o.count ? "text-secondary-foreground" : "text-faint"}`}
          >
            <i
              className="size-2.5 shrink-0 rounded-sm"
              style={{
                background: outcomeColor[o.key],
                opacity: o.count ? 1 : 0.35,
              }}
            />
            <span className="flex-1">{o.label}</span>
            <b className="font-figures font-semibold text-foreground">
              {formatInt(o.count)}
            </b>
            <span className="w-12 text-right font-figures text-muted-foreground">
              {formatPercent(pct(o.count, total))}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
        No se evalúan: {formatInt(count("pending"))} abiertos aún en plazo y{" "}
        {formatInt(count("excluded"))} cierres masivos.
      </p>
    </div>
  );
}

/** Cumplimiento del objetivo de tiempo según la prioridad del ticket. */
export function PriorityChart({ items }: { items: PriorityCompliance[] }) {
  if (!items.length) return <Empty>Sin tickets en la selección</Empty>;
  return (
    <div className="grid gap-4">
      {items.map((p) => (
        <div key={p.label}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="text-secondary-foreground">
              <b className="font-semibold text-foreground">{p.label}</b>{" "}
              <span className="text-muted-foreground">
                · objetivo {p.targetHours} h
              </span>
            </span>
            <b className="font-figures font-semibold text-foreground">
              {formatPercent(p.percent)}
            </b>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <i
              className="block h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${p.percent ?? 0}%`,
                background: "var(--chart-efectividad)",
              }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {p.evaluated ? (
              <>
                {formatInt(p.onTime)} de {formatInt(p.evaluated)} a tiempo ·
                tiempo típico {formatDuration(p.medianSeconds)}
                {p.evaluated < 5 && " · pocos casos"}
              </>
            ) : (
              "Sin casos evaluados todavía"
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
