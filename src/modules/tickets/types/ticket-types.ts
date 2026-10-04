export type TicketRow = {
  id: number;
  number: string;
  title: string;
  createdAt: string;
  area: string;
  unit: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  agent: string;
  firstAttentionSeconds: number | null;
  resolutionSeconds: number | null;
  targetSeconds: number;
  ageSeconds: number;
  overdue: boolean;
  bulkClosed: boolean;
  reopened: boolean;
};

export type TicketPage = {
  total: number;
  page: number;
  pageSize: number;
  items: TicketRow[];
};

export type TimelineEvent = {
  at: string;
  kind: string;
  description: string;
  actor: string;
  state: string;
  queue: string;
};

export type TicketTimeline = { ticket: TicketRow; events: TimelineEvent[] };

export type TicketView = "all" | "attention";

export const PAGE_SIZE = 25;
