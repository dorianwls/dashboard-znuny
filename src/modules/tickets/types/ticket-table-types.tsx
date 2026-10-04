import { formatDate, formatDuration } from "@/lib/formats";
import { createColumnHelper } from "@tanstack/react-table";
import { Resolution, StatusCell } from "../components/ticket-badges";
import type { TicketRow } from "./ticket-types";

const col = createColumnHelper<TicketRow>();

export const ticketColumns = [
  col.accessor("number", {
    header: "Ticket",
    cell: ({ row }) => (
      <>
        <strong className="block font-semibold text-foreground">
          {row.original.number}
        </strong>
        <span className="line-clamp-2 text-xs text-muted-foreground">
          {row.original.title}
        </span>
      </>
    ),
  }),
  col.accessor("createdAt", {
    header: "Creado",
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-secondary-foreground">
        {formatDate(getValue())}
      </span>
    ),
  }),
  col.accessor("area", {
    header: "Solicitante y servicio",
    cell: ({ row }) => (
      <>
        <span className="block text-secondary-foreground">
          {row.original.area}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.unit}
        </span>
      </>
    ),
  }),
  col.accessor("category", {
    header: "Categoría",
    cell: ({ getValue }) => (
      <span className="text-secondary-foreground">{getValue()}</span>
    ),
  }),
  col.accessor("status", {
    header: "Estado y prioridad",
    cell: ({ row }) => <StatusCell t={row.original} />,
  }),
  col.accessor("agent", {
    header: "Agente",
    cell: ({ getValue }) => (
      <span className="text-secondary-foreground">{getValue()}</span>
    ),
  }),
  col.accessor("firstAttentionSeconds", {
    header: "1.ª atención",
    cell: ({ getValue }) => (
      <span className="font-figures text-secondary-foreground">
        {formatDuration(getValue())}
      </span>
    ),
  }),
  col.display({
    id: "resolution",
    header: "Resolución",
    cell: ({ row }) => <Resolution t={row.original} />,
  }),
];
