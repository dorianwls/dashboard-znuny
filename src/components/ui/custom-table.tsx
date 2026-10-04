import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

interface Id {
  id: number | string;
}

interface CustomTableProps<T> {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- las columnas mezclan tipos de valor
  columns: ColumnDef<T, any>[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function CustomTable<T extends Id>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No se encontraron resultados.",
  className,
}: CustomTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
  });

  return (
    <Table className={cn("text-[13px]", className)}>
      <TableHeader className="bg-muted text-xs">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="h-10 px-4 text-muted-foreground first:pl-5"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => e.key === "Enter" && onRowClick(row.original)
                  : undefined
              }
              className={cn(
                "align-top",
                onRowClick &&
                  "cursor-pointer focus-visible:bg-accent focus-visible:outline-none",
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="max-w-64 px-4 py-3 whitespace-normal first:pl-5"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
