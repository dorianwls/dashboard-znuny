import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/formats";
import type { TicketRow } from "../types/ticket-types";

const statusStyle: Record<string, string> = {
  Resuelto: "bg-ok-soft text-ok",
  Nuevo: "bg-accent text-accent-foreground",
  Abierto: "bg-warn-soft text-warn",
  Pendiente: "bg-violet-soft text-violet",
  "Cerrado sin éxito": "bg-bad-soft text-bad",
};
const priorityDot: Record<string, string> = {
  "Muy alta": "bg-bad",
  Alta: "bg-bad",
  Normal: "bg-warn",
  Baja: "bg-ok",
  "Muy baja": "bg-ok",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
        statusStyle[status] ?? "bg-muted text-secondary-foreground",
      )}
    >
      <i className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function Tag({
  tone,
  children,
  title,
}: {
  tone: "bad" | "warn" | "muted";
  children: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex rounded px-1.5 py-0.5 text-[11px] font-semibold",
        tone === "bad"
          ? "bg-bad-soft text-bad"
          : tone === "warn"
            ? "bg-warn-soft text-warn"
            : "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function Priority({ priority }: { priority: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
      <i
        className={cn(
          "size-1.5 rounded-full",
          priorityDot[priority] ?? "bg-faint",
        )}
      />
      Prioridad {priority.toLowerCase()}
    </span>
  );
}

export function StatusCell({ t }: { t: TicketRow }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-wrap gap-1">
        <StatusBadge status={t.status} />
        {t.overdue && <Tag tone="bad">Atrasado</Tag>}
        {t.reopened && <Tag tone="warn">Reabierto</Tag>}
      </div>
      <Priority priority={t.priority} />
    </div>
  );
}

export function Resolution({ t }: { t: TicketRow }) {
  if (t.bulkClosed)
    return (
      <Tag
        tone="muted"
        title="Cerrado con acción masiva: no se usa para medir tiempos"
      >
        Cierre masivo
      </Tag>
    );
  if (t.resolutionSeconds != null)
    return (
      <span
        className={cn(
          "font-figures font-semibold",
          t.resolutionSeconds > t.targetSeconds
            ? "text-bad"
            : "text-foreground",
        )}
      >
        {formatDuration(t.resolutionSeconds)}
      </span>
    );
  return (
    <span className="text-muted-foreground">
      Abierto {formatDuration(t.ageSeconds)}
    </span>
  );
}
