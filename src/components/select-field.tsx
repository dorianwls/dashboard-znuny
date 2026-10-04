import { ChevronDown } from "lucide-react";
import type { Option } from "@/types/api-types";

export const fieldLabel = "text-xs font-medium text-muted-foreground";
export const fieldControl =
  "h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-sm text-foreground transition-colors hover:border-faint focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-primary/40";

export function SelectField({
  label,
  value,
  options,
  onChange,
  allLabel = "Todos",
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  allLabel?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className={fieldLabel}>{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${fieldControl} appearance-none pr-9 ${value ? "border-primary/60 bg-accent/40 font-medium" : ""}`}
        >
          <option value="">{allLabel}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}
