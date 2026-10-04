import { ErrorState, PageSkeleton } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useCatalogs } from "@/modules/catalogs/hooks/use-catalogs";
import { useRefreshData } from "@/modules/sync/hooks/use-refresh-data";
import { TicketDrawer } from "@/modules/tickets/components/ticket-drawer";
import { Outlet } from "@tanstack/react-router";
import { RefreshCcw } from "lucide-react";
import { Suspense } from "react";
import { AppSidebar } from "./app-sidebar";
import { ConnectionBadge } from "./connection-status";
import { DynamicBreadcrumb } from "./dynamic-breadcrumb";
import { ThemeToggle } from "./theme-toggle";

const MainLayout = () => {
  const catalogs = useCatalogs();
  const refresh = useRefreshData();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/85 px-4 backdrop-blur-md transition-[width,height] ease-linear sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
          </div>
          <div className="flex items-center gap-2">
            <ConnectionBadge />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refresh.mutate()}
              disabled={refresh.isPending}
              aria-label="Actualizar datos desde Znuny"
              title="Actualizar datos desde Znuny"
            >
              <RefreshCcw className={cn(refresh.isPending && "animate-spin")} />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main
          id="contenido"
          className="mx-auto w-full max-w-[1400px] px-4 pt-5 pb-8 sm:px-6 sm:pt-7 lg:px-10"
        >
          {/* Los filtros dependen de los catálogos: hasta tenerlos no se muestra ninguna página. */}
          {catalogs.isError && !catalogs.data ? (
            <ErrorState
              message={catalogs.error.message}
              onRetry={() => void catalogs.refetch()}
            />
          ) : !catalogs.data ? (
            <PageSkeleton />
          ) : (
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          )}
          {catalogs.data && (
            <footer className="mt-10 border-t pt-4 text-xs text-muted-foreground">
              Datos de Znuny en modo solo lectura, horario de Managua. Objetivos
              de resolución:{" "}
              {catalogs.data.targets
                .map((t) => `${t.priority} ${t.hours} h`)
                .join(", ")}
              . Reapertura: {catalogs.data.reopenWindowDays} días.
            </footer>
          )}
        </main>
      </SidebarInset>
      <TicketDrawer />
      <Toaster position="top-right" richColors closeButton />
    </SidebarProvider>
  );
};

export default MainLayout;
