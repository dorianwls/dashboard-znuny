import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilters } from "@/modules/filters/hooks/use-filters";
import { useDownloadReport } from "../hooks/use-reports";
import type { ReportFormat, ReportKind } from "../types/report-types";

const options: {
  format: ReportFormat;
  icon: typeof FileText;
  title: string;
  detail: string;
}[] = [
  {
    format: "pdf",
    icon: FileText,
    title: "PDF",
    detail: "Informe para leer y compartir",
  },
  {
    format: "xlsx",
    icon: FileSpreadsheet,
    title: "Excel",
    detail: "Datos para analizar y filtrar",
  },
];

/** Exporta la vista actual con los filtros activos, en el formato que se elija. */
export function ExportButton({ kind }: { kind: ReportKind }) {
  const { filters } = useFilters();
  const download = useDownloadReport();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={download.isPending} className="w-full sm:w-auto">
          {download.isPending ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <Download aria-hidden="true" />
          )}
          {download.isPending ? "Generando…" : "Exportar"}
          {!download.isPending && <ChevronDown aria-hidden="true" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl p-1.5">
        {options.map(({ format, icon: Icon, title, detail }) => (
          <DropdownMenuItem
            key={format}
            className="gap-3 rounded-lg p-2.5"
            onSelect={() => download.mutate({ kind, format, filters })}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span>
              <strong className="block text-[13px] font-semibold text-foreground">
                {title}
              </strong>
              <small className="text-xs text-muted-foreground">{detail}</small>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
