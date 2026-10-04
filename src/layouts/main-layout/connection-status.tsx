import { useConnectionStatus } from "@/hooks/use-connection-status";
import { cn } from "@/lib/utils";

export function ConnectionCard() {
  const { connected, failed, updatedAgo } = useConnectionStatus();

  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-lg border bg-sidebar-accent/50 p-3",
        connected ? "border-sidebar-border" : "border-bad/40",
      )}
    >
      <span
        className={cn(
          "mt-1 size-2 shrink-0 rounded-full",
          connected
            ? "bg-ok shadow-[0_0_0_3px_color-mix(in_srgb,var(--ok)_20%,transparent)]"
            : "bg-bad",
        )}
      />
      <div className="text-xs">
        <strong className="block text-[13px] font-semibold text-sidebar-accent-foreground">
          {connected
            ? "Conectado a Znuny"
            : failed
              ? "Sin conexión"
              : "Conectando…"}
        </strong>
        <span className="text-muted-foreground">
          {connected
            ? `Datos ${updatedAgo}, solo lectura`
            : "Revisá que el backend esté en ejecución"}
        </span>
      </div>
    </div>
  );
}

export function ConnectionBadge() {
  const { connected, failed, updatedAgo } = useConnectionStatus();

  return (
    <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
      <span
        className={cn("size-1.5 rounded-full", connected ? "bg-ok" : "bg-bad")}
      />
      {connected
        ? `Actualizado ${updatedAgo}`
        : failed
          ? "Sin conexión"
          : "Conectando…"}
    </span>
  );
}
