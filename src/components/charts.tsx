import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatInt } from "@/lib/formats";
import { Empty } from "@/components/states";
import { toneFill, type Tone } from "@/components/tone";

/** Barras horizontales; `onSelect` convierte cada barra en un filtro. */
export function Bars({
  items,
  format = formatInt,
  onSelect,
  empty = "Sin datos para la selección",
  tone = "accent",
}: {
  items: { label: string; value: number | null; hint?: string }[];
  format?: (n: number | null) => string;
  onSelect?: (label: string) => void;
  empty?: string;
  tone?: Tone;
}) {
  const max = Math.max(1, ...items.map((i) => i.value ?? 0));
  if (!items.length) return <Empty>{empty}</Empty>;
  return (
    <div className="grid gap-0.5">
      {items.map((i) => (
        <button
          type="button"
          key={i.label}
          onClick={onSelect ? () => onSelect(i.label) : undefined}
          disabled={!onSelect}
          title={i.hint ?? i.label}
          className={cn(
            "group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 rounded-lg px-2 py-2 text-left sm:grid-cols-[minmax(0,11rem)_1fr_auto]",
            onSelect ? "hover:bg-muted" : "cursor-default",
          )}
        >
          <span className="truncate text-[13px] text-secondary-foreground group-hover:text-foreground">
            {i.label}
          </span>
          <span className="col-span-2 row-start-2 h-2 overflow-hidden rounded-full bg-muted sm:col-span-1 sm:row-start-1 sm:col-start-2">
            <i
              className={cn(
                "block h-full rounded-full transition-[width] duration-500",
                toneFill[tone],
              )}
              style={{ width: `${((i.value ?? 0) / max) * 100}%` }}
            />
          </span>
          <b className="text-right font-figures text-[13px] font-semibold text-foreground">
            {format(i.value)}
          </b>
        </button>
      ))}
    </div>
  );
}

/** Clave de color: siempre acompaña a un gráfico con dos o más series. */
export function Legend({
  items,
}: {
  items: {
    label: string;
    color: string;
    kind?: "swatch" | "line" | "dashed";
  }[];
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {items.map((i) => (
        <li key={i.label} className="inline-flex items-center gap-1.5">
          {i.kind === "line" ? (
            <i className="h-0.5 w-4 rounded" style={{ background: i.color }} />
          ) : i.kind === "dashed" ? (
            <i
              className="w-4 border-t-2 border-dashed"
              style={{ borderColor: i.color }}
            />
          ) : (
            <i
              className="size-2.5 rounded-sm"
              style={{ background: i.color }}
            />
          )}
          {i.label}
        </li>
      ))}
    </ul>
  );
}

/** Globo de lectura sobre un gráfico; `x` en porcentaje del ancho, se mantiene dentro del borde. */
export function ChartTip({ x, children }: { x: number; children: ReactNode }) {
  return (
    <div
      role="status"
      className="pointer-events-none absolute top-0 z-10 w-max max-w-56 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-secondary-foreground shadow-card"
      style={{ left: `clamp(7rem, ${x}%, calc(100% - 7rem))` }}
    >
      {children}
    </div>
  );
}
