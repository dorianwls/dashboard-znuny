import { ActiveFilters } from "@/modules/filters/components/active-filters";
import { TicketTable } from "@/modules/tickets/components/ticket-table";
import { PageHeader } from "@/components/page-header";
import { DataQualityPanel } from "../components/data-quality-panel";
import { ExportButton } from "../components/export-button";
import { ReportBuilder } from "../components/report-builder";

export default function ReportIndex() {
  return (
    <>
      <PageHeader
        title="Reportes"
        subtitle="Descargá informes en PDF para compartir o en Excel para analizar, y revisá qué tan confiables son los datos."
        action={<ExportButton kind="servicio" />}
      />
      <ActiveFilters />
      <ReportBuilder />
      <DataQualityPanel />
      <TicketTable title="Tickets que necesitan atención" view="attention" />
    </>
  );
}
