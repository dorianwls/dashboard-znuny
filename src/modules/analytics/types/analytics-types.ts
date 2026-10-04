import type { CountItem, Indicators, Meta, Notice } from "@/types/api-types";

export type Overview = {
  meta: Meta;
  current: { open: number; overdue: number; unassigned: number };
  volume: {
    received: number;
    receivedPrevious: number;
    resolved: number;
    resolvedPrevious: number;
  };
  indicators: Indicators;
  previousIndicators: Indicators;
  trendBucket: "day" | "week";
  trend: { label: string; current: number; previous: number }[];
  byStatus: CountItem[];
  byArea: CountItem[];
  byUnit: CountItem[];
  resolutionByCategory: {
    label: string;
    medianSeconds: number | null;
    sample: number;
  }[];
  series: SeriesPoint[];
  outcomes: OutcomeItem[];
  resolutionDistribution: CountItem[];
  byPriority: PriorityCompliance[];
  unitScores: GroupScore[];
  areaScores: GroupScore[];
  notices: Notice[];
};

/** Un tramo (día o semana): tickets creados en él, cómo terminaron y sus indicadores. */
export type SeriesPoint = {
  label: string;
  received: number;
  resolved: number;
  unsuccessful: number;
  open: number;
  eficacia: number | null;
  efectividad: number | null;
  medianResolutionSeconds: number | null;
};

export type OutcomeKey =
  | "onTime"
  | "late"
  | "reopened"
  | "overdue"
  | "unsuccessful"
  | "pending"
  | "excluded";

export type OutcomeItem = { key: OutcomeKey; label: string; count: number };

export type PriorityCompliance = {
  label: string;
  targetHours: number;
  evaluated: number;
  onTime: number;
  percent: number | null;
  medianSeconds: number | null;
};

export type GroupScore = {
  label: string;
  received: number;
  eficacia: number | null;
  efectividad: number | null;
  medianResolutionSeconds: number | null;
};
