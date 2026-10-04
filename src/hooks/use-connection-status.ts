import { useNow } from "@/hooks/use-now";
import { timeAgo } from "@/lib/formats";
import { useCatalogs } from "@/modules/catalogs/hooks/use-catalogs";

/** Estado de la conexión con el backend, según la última carga de catálogos. */
export function useConnectionStatus() {
  const catalogs = useCatalogs();
  useNow();
  return {
    connected: catalogs.isSuccess,
    failed: catalogs.isError,
    updatedAgo: timeAgo(catalogs.dataUpdatedAt),
  };
}
