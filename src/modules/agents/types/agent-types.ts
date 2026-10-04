import type { Indicators, Meta, Notice } from "@/types/api-types";

export type AgentScore = {
  agentId: number | null;
  name: string;
  assigned: number;
  resolved: number;
  open: number;
  overdue: number;
  bulkClosed: number;
  units: string[];
  indicators: Indicators;
};

export type AgentsResponse = {
  meta: Meta;
  team: Indicators;
  agents: AgentScore[];
  notices: Notice[];
};
