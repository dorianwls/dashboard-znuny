import { QueryClient } from "@tanstack/react-query";
import { HttpError } from "@/lib/api-errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Los errores 4xx son permanentes: reintentar da el mismo resultado.
      // Solo se reintenta una vez ante fallos transitorios (red o 5xx).
      retry: (failureCount, error) => {
        if (error instanceof HttpError && error.status < 500) return false;
        return failureCount < 1;
      },
      // Los datos de Znuny se recargan bajo demanda (botón Actualizar);
      // no hace falta re-pedirlos al cambiar de pestaña.
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
