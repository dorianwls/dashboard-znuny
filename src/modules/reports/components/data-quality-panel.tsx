import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { useFilters } from "@/modules/filters/hooks/use-filters";
import { cn } from "@/lib/utils";
import { formatInt } from "@/lib/formats";
import { ErrorState, Loading } from "@/components/states";
import { Panel } from "@/components/panel";
import { useDataQuality } from "../hooks/use-reports";
import type { QualityCheck } from "../types/report-types";

const icon = {
  ok: CircleCheck,
  info: Info,
  warning: TriangleAlert,
} satisfies Record<QualityCheck["severity"], unknown>;
const tone = { ok: "text-ok", info: "text-primary", warning: "text-warn" };

export function DataQualityPanel() {
  const { filters } = useFilters();
  const { data, error, refetch, isPlaceholderData } = useDataQuality(filters);
  // Primero lo que exige atención.
  const order = { warning: 0, info: 1, ok: 2 };
  const checks = data
    ? [...data.checks].sort((a, b) => order[a.severity] - order[b.severity])
    : [];

  return (
    <Panel
      title="Calidad de los datos"
      subtitle="Qué limita la confianza en las cifras del período"
      className="mt-4"
    >
      {error ? (
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : !data ? (
        <Loading />
      ) : (
        <ul
          className={cn(
            "grid gap-2 md:grid-cols-2",
            isPlaceholderData && "opacity-60",
          )}
        >
          {checks.map((c) => {
            const Icon = icon[c.severity];
            return (
              <li
                key={c.code}
                className={cn(
                  "flex gap-3 rounded-lg border p-3",
                  c.severity === "warning"
                    ? "border-warn/30 bg-warn-soft/60"
                    : "border-border bg-muted/60",
                )}
              >
                <Icon
                  className={cn("mt-0.5 size-4 shrink-0", tone[c.severity])}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <strong className="flex flex-wrap items-baseline gap-x-2 text-[13px] font-semibold">
                    {c.title}
                    {c.affected != null && (
                      <span className="font-figures text-xs font-semibold text-muted-foreground">
                        {formatInt(c.affected)} de {formatInt(c.outOf)}
                      </span>
                    )}
                  </strong>
                  <p className="mt-0.5 text-[13px] text-secondary-foreground">
                    {c.detail}
                  </p>
                  {c.affects.length > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Afecta: {c.affects.join(", ")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
