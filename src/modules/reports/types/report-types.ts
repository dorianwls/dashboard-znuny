import type { Meta } from "@/types/api-types";

export type ReportKind = "servicio" | "atencion" | "agentes";

export type ReportFormat = "pdf" | "xlsx";

export type QualityCheck = {
  code: string;
  severity: "ok" | "info" | "warning";
  title: string;
  detail: string;
  affected: number | null;
  outOf: number | null;
  affects: string[];
};

export type DataQuality = { meta: Meta; checks: QualityCheck[] };

export const formatLabel: Record<ReportFormat, string> = {
  pdf: "PDF",
  xlsx: "Excel",
};
