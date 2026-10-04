import { formatDay } from "@/lib/formats";
import { queryKeys } from "@/lib/query-keys";
import type { Filters } from "@/modules/filters/types/filter-types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { downloadReport, getDataQuality } from "../services/report-api";
import {
  formatLabel,
  type ReportFormat,
  type ReportKind,
} from "../types/report-types";

export function useDataQuality(filters: Filters) {
  return useQuery({
    queryKey: queryKeys.reports.dataQuality(filters),
    queryFn: ({ signal }) => getDataQuality(filters, signal),
    placeholderData: keepPreviousData,
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: ({
      kind,
      format,
      filters,
    }: {
      kind: ReportKind;
      format: ReportFormat;
      filters: Filters;
    }) => downloadReport(kind, format, filters),
    onSuccess: (_, { format, filters }) =>
      toast.success(`${formatLabel[format]} descargado`, {
        description: `Período ${formatDay(filters.from)} – ${formatDay(filters.to)}. ${
          format === "pdf"
            ? "Incluye resumen, gráficos y método de cálculo."
            : "La primera hoja resume filtros e indicadores; la última explica el método."
        }`,
      }),
    onError: (error) =>
      toast.error(error.message || "No se pudo generar el reporte"),
  });
}
