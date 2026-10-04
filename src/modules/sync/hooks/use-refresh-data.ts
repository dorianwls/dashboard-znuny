import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { refreshData } from "../services/sync-api";

/** Pide al backend releer Znuny y descarta todo lo que había en caché. */
export function useRefreshData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refreshData,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success("Datos actualizados desde Znuny");
    },
    onError: (error) => toast.error(error.message),
  });
}
