import type { CountItem, Indicators, Meta } from "@/types/api-types";

export type LocationSummary = {
  key: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  total: number;
  open: number;
  overdue: number;
  resolved: number;
  indicators: Indicators;
  byUnit: CountItem[];
};

export type LocationsResponse = { meta: Meta; locations: LocationSummary[] };

export type Located = LocationSummary & { latitude: number; longitude: number };

export const hasCoordinates = (l: LocationSummary): l is Located =>
  l.latitude != null && l.longitude != null;
