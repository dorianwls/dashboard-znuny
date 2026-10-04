import { SlidersHorizontal, X } from "lucide-react";
import { formatDay } from "@/lib/formats";
import { Button } from "@/components/ui/button";
import { fieldSpecs, type FilterField } from "../types/filter-types";
import { useFilters } from "../hooks/use-filters";

/** Resumen de los filtros heredados de otros módulos, para vistas sin selectores propios. */
export function ActiveFilters({ ignore = [] }: { ignore?: FilterField[] }) {
  const { filters, catalogs, setFilters, reset } = useFilters();
  const specs = fieldSpecs(catalogs);
  const active = (Object.keys(specs) as FilterField[]).filter(
    (f) => filters[f] && !ignore.includes(f),
  );

  return (
    <section
      aria-label="Filtros activos"
      className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-[13px] shadow-card"
    >
      <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
      <span className="text-muted-foreground">Período</span>
      <b className="font-semibold">
        {formatDay(filters.from)} – {formatDay(filters.to)}
      </b>
      {active.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setFilters({ [f]: "" })}
          aria-label={`Quitar filtro ${specs[f].label}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent py-1 pr-2 pl-3 text-accent-foreground hover:border-primary"
        >
          {specs[f].label}:{" "}
          <b className="font-semibold">
            {specs[f].options.find((o) => o.value === filters[f])?.label ??
              filters[f]}
          </b>
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ))}
      {active.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary ml-auto"
          onClick={reset}
        >
          Restablecer
        </Button>
      )}
    </section>
  );
}
