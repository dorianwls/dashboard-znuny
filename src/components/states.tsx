import { AlertCircle, Inbox, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function Loading({
  label = "Cargando datos de Znuny…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-3 rounded-xl border border-dashed border-input bg-card/60 px-4 py-10 text-muted-foreground",
        className,
      )}
    >
      <Loader2
        className="size-5 animate-spin text-primary"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}

/** Esqueleto de página: evita el salto de contenido mientras llega la primera respuesta. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Cargando" className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 rounded-xl bg-border/70" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-xl bg-border/70 lg:col-span-2" />
        <Skeleton className="h-72 rounded-xl bg-border/70" />
      </div>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-bad/30 bg-bad-soft p-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <AlertCircle className="size-5 shrink-0 text-bad" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <strong className="block text-foreground">
          No se pudieron cargar los datos
        </strong>
        <span className="text-[13px] text-secondary-foreground">{message}</span>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcw aria-hidden="true" />
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 py-6 text-[13px] text-muted-foreground">
      <Inbox className="size-4" aria-hidden="true" />
      {children}
    </p>
  );
}
