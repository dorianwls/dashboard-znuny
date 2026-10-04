// Tipos de la API compartidos por varios módulos. Los propios de cada módulo viven en su carpeta `types/`.

export type RateKpi = {
  percent: number | null;
  numerator: number;
  denominator: number;
  pending: number;
  excluded: number;
};

export type DurationKpi = {
  medianSeconds: number | null;
  p90Seconds: number | null;
  averageSeconds: number | null;
  sample: number;
  excluded: number;
};

export type Indicators = {
  eficacia: RateKpi;
  efectividad: RateKpi;
  resolutionTime: DurationKpi;
  firstAttentionTime: DurationKpi;
  reopenRate: RateKpi;
};

export type Meta = {
  from: string;
  to: string;
  previousFrom: string;
  previousTo: string;
  timeZone: string;
  dataLoadedAt: string;
  population: number;
};

export type Notice = {
  code: string;
  severity: "info" | "warning";
  message: string;
};

export type CountItem = { label: string; count: number; percent: number };

export type Option = { value: string; label: string };
