import { Button } from "@/components/ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const CHUNK_LOAD_ERROR_PATTERN =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;

const RELOAD_FLAG_KEY = "chunk-load-reload-attempted";

export function RouteErrorComponent({ error }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : String(error);
  const isChunkLoadError = CHUNK_LOAD_ERROR_PATTERN.test(message);

  // Tras un despliegue los chunks viejos ya no existen: se recarga una vez.
  if (isChunkLoadError && !sessionStorage.getItem(RELOAD_FLAG_KEY)) {
    sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
    window.location.reload();
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <TriangleAlert className="size-10 text-destructive" />
      <div className="space-y-1">
        <p className="text-lg font-medium">Algo salió mal</p>
        <p className="text-sm text-muted-foreground">
          {isChunkLoadError
            ? "No se pudo cargar una parte de la aplicación. Hay una nueva versión disponible."
            : "Ocurrió un error inesperado al cargar esta página."}
        </p>
      </div>
      <Button onClick={() => window.location.reload()}>Recargar página</Button>
    </div>
  );
}
