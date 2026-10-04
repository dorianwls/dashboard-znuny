import type { Option } from "@/types/api-types";

export type Catalogs = {
  areas: Option[];
  units: Option[];
  categories: Option[];
  priorities: Option[];
  statuses: Option[];
  agents: Option[];
  locations: Option[];
  firstTicketDate: string | null;
  lastTicketDate: string | null;
  defaultFrom: string;
  defaultTo: string;
  targets: { priority: string; hours: number }[];
  reopenWindowDays: number;
};
