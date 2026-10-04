import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneIcon, type Tone } from "@/components/tone";

/** Variación frente al período anterior. `lowerIsBetter` invierte el color (p. ej. tiempos). */
export function Delta({
  value,
  lowerIsBetter = false,
}: {
  value: number | null;
  lowerIsBetter?: boolean;
}) {
  // Sin datos en el período anterior no hay comparación que mostrar.
  if (value == null) return null;
  const good = value === 0 ? null : value < 0 === lowerIsBetter;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        good == null
          ? "bg-muted text-muted-foreground"
          : good
            ? "bg-ok-soft text-ok"
            : "bg-bad-soft text-bad",
      )}
      title="Frente al período anterior"
    >
      {value > 0 ? "↑" : value < 0 ? "↓" : "="}{" "}
      {Math.abs(value).toLocaleString("es-NI")}%
    </span>
  );
}

export function Metric({
  icon: Icon,
  label,
  value,
  detail,
  tone,
  delta,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: ReactNode;
  tone: Tone;
  delta?: ReactNode;
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "grid size-8 place-items-center rounded-lg [&_svg]:size-4",
            toneIcon[tone],
          )}
        >
          <Icon aria-hidden="true" />
        </span>
        {delta}
      </div>
      <p className="mt-3 text-[13px] font-medium text-muted-foreground">
        {label}
      </p>
      <strong className="mt-0.5 font-figures text-[32px] leading-none font-semibold tracking-tight text-foreground">
        {value}
      </strong>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </article>
  );
}

/** Cifra en vivo sobre el riel oscuro: lo que pasa ahora, no en el período. */
export function LiveFigure({
  label,
  value,
  detail,
  alert = false,
}: {
  label: string;
  value: string;
  detail: string;
  alert?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] font-medium text-band-muted">{label}</p>
      <strong
        className={cn(
          "mt-1 block font-figures text-[44px] leading-none font-semibold tracking-tight",
          alert ? "text-band-alert" : "text-band-foreground",
        )}
      >
        {value}
      </strong>
      <p className="mt-2 text-xs text-band-subtle">{detail}</p>
    </div>
  );
}
