import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDay } from "@/lib/formats";
import { Button } from "@/components/ui/button";
import {
  fieldControl,
  fieldLabel,
  SelectField,
} from "@/components/select-field";
import {
  fieldSpecs,
  orderedRange,
  type FilterField,
} from "../types/filter-types";
import { useFilters } from "../hooks/use-filters";

/** Filtros globales. `fields` decide qué selectores muestra cada módulo; el período siempre está. */
export function FilterBar({
  fields,
  caption,
}: {
  fields: FilterField[];
  caption: string;
}) {
  const { filters, catalogs, setFilters, reset } = useFilters();
  const [open, setOpen] = useState(false);
  const specs = fieldSpecs(catalogs);
  const activeCount = fields.filter((f) => filters[f]).length;

  return (
    <section
      aria-label="Filtros"
      className="mb-5 rounded-xl border border-border bg-card shadow-card"
    >
      {/* En pantallas chicas los filtros se pliegan detrás de un resumen del período. */}
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left lg:hidden"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <b className="flex items-center gap-2 font-semibold">
            Filtros
            {activeCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-[11px] leading-5 text-white ">
                {activeCount}
              </span>
            )}
          </b>
          <small className="block truncate text-xs text-muted-foreground">
            {formatDay(filters.from)} – {formatDay(filters.to)}
          </small>
        </span>
        {open ? (
          <X className="size-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </button>

      <div
        className={cn(
          "border-t border-border p-4 lg:block lg:border-0 lg:pt-4",
          open ? "block" : "hidden",
        )}
      >
        <div className="mb-3 hidden items-center gap-3 lg:flex">
          <SlidersHorizontal
            className="size-4 text-primary"
            aria-hidden="true"
          />
          <strong className="font-semibold">Filtros</strong>
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground">
            {caption}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary ml-auto"
            onClick={reset}
          >
            Restablecer
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex min-w-0 flex-col gap-1.5 sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <span className={fieldLabel}>Período (fecha de creación)</span>
            <div className="grid grid-cols-2 gap-2">
              <DateInput
                label="Desde"
                value={filters.from}
                min={catalogs.firstTicketDate ?? undefined}
                max={filters.to}
                onChange={(v) => setFilters(orderedRange(filters, { from: v }))}
              />
              <DateInput
                label="Hasta"
                value={filters.to}
                min={filters.from}
                onChange={(v) => setFilters(orderedRange(filters, { to: v }))}
              />
            </div>
          </div>
          {fields.map((f) => (
            <SelectField
              key={f}
              label={specs[f].label}
              value={filters[f]}
              options={specs[f].options}
              allLabel={specs[f].all}
              onChange={(v) => setFilters({ [f]: v })}
            />
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-4 w-full lg:hidden"
          onClick={reset}
        >
          Restablecer filtros
        </Button>
      </div>
    </section>
  );
}

function DateInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="date"
      aria-label={label}
      value={value}
      min={min}
      max={max}
      onChange={(e) => e.target.value && onChange(e.target.value)}
      className={cn(fieldControl, "px-2.5 text-[13px]")}
    />
  );
}
