import { ChevronDown, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notice } from "@/types/api-types";

export function Notices({ notices }: { notices: Notice[] }) {
  if (!notices.length) return null;
  const warning = notices.some((n) => n.severity === "warning");
  const Icon = warning ? TriangleAlert : Info;
  return (
    <details
      className={cn(
        "group mb-4 rounded-xl border px-4 py-3",
        warning ? "border-warn/30 bg-warn-soft" : "border-primary/20 bg-accent",
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
        <Icon
          className={cn(
            "size-4 shrink-0",
            warning ? "text-warn" : "text-primary",
          )}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 text-[13px]">
          <b className="font-semibold text-foreground">
            {notices.length === 1
              ? "1 aviso sobre los datos"
              : `${notices.length} avisos sobre los datos`}
          </b>
          <span className="ml-2 text-secondary-foreground group-open:hidden max-sm:hidden">
            {notices[0].message}
          </span>
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul className="mt-3 grid gap-1.5 pl-7 text-[13px] text-secondary-foreground">
        {notices.map((n) => (
          <li key={n.code} className="list-disc">
            {n.message}
          </li>
        ))}
      </ul>
    </details>
  );
}
