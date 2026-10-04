import { apiFetch, saveResponseAsFile, toQuery } from "@/lib/http";
import type { Filters } from "@/modules/filters/types/filter-types";
import type {
  DataQuality,
  ReportFormat,
  ReportKind,
} from "../types/report-types";

export async function getDataQuality(
  filters: Filters,
  signal?: AbortSignal,
): Promise<DataQuality> {
  const response = await apiFetch(
    `/data-quality${toQuery(filters)}`,
    "Error al obtener la calidad de los datos.",
    { signal },
  );
  return response.json() as Promise<DataQuality>;
}

/** Descarga un reporte generado por el backend. PDF para leer y compartir; Excel para analizar. */
export async function downloadReport(
  kind: ReportKind,
  format: ReportFormat,
  filters: Filters,
): Promise<void> {
  const response = await apiFetch(
    `/reports/${kind}${toQuery({ ...filters, format })}`,
    "No se pudo generar el reporte.",
  );
  await saveResponseAsFile(response, `znuny-${kind}.${format}`);
}
