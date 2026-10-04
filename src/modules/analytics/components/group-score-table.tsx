import { formatDuration, formatInt, formatPercent } from "@/lib/formats";
import { Empty } from "@/components/states";
import type { GroupScore } from "../types/analytics-types";

/** Los tres indicadores lado a lado por equipo o área. Tocar una fila filtra la vista. */
export function GroupScoreTable({
  rows,
  groupLabel,
  onSelect,
}: {
  rows: GroupScore[];
  groupLabel: string;
  onSelect: (label: string) => void;
}) {
  if (!rows.length) return <Empty>Sin tickets en la selección</Empty>;
  const peak = Math.max(1, ...rows.map((r) => r.received));

  return (
    <div className="-mx-4 overflow-x-auto sm:-mx-5">
      <table className="w-full min-w-[640px] text-[13px]">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-4 py-2 font-medium sm:pl-5">{groupLabel}</th>
            <th className="px-3 py-2 font-medium">Tickets</th>
            <th className="px-3 py-2 font-medium">
              <Dot color="var(--chart-eficacia)" />
              Eficacia
            </th>
            <th className="px-3 py-2 font-medium">
              <Dot color="var(--chart-eficiencia)" />
              Tiempo típico
            </th>
            <th className="px-4 py-2 font-medium sm:pr-5">
              <Dot color="var(--chart-efectividad)" />
              Efectividad
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.label}
              tabIndex={0}
              onClick={() => onSelect(r.label)}
              onKeyDown={(e) => e.key === "Enter" && onSelect(r.label)}
              className="cursor-pointer border-b border-border last:border-0 hover:bg-muted focus-visible:bg-muted"
              title={`Filtrar por ${r.label}`}
            >
              <td className="max-w-64 truncate px-4 py-2.5 text-foreground sm:pl-5">
                {r.label}
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <i
                      className="block h-full rounded-full bg-faint"
                      style={{ width: `${(r.received / peak) * 100}%` }}
                    />
                  </span>
                  <span className="font-figures font-semibold text-foreground tabular-nums">
                    {formatInt(r.received)}
                  </span>
                </div>
              </td>
              <td className="px-3 py-2.5">
                <Rate
                  value={r.eficacia}
                  color="var(--chart-eficacia)"
                  small={r.received < 5}
                />
              </td>
              <td className="px-3 py-2.5 font-figures font-semibold text-foreground tabular-nums">
                {formatDuration(r.medianResolutionSeconds)}
              </td>
              <td className="px-4 py-2.5 sm:pr-5">
                <Rate
                  value={r.efectividad}
                  color="var(--chart-efectividad)"
                  small={r.received < 5}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 pt-3 text-xs text-muted-foreground sm:px-5">
        Los grupos con menos de 5 tickets se muestran atenuados: su porcentaje
        cambia mucho con un solo caso.
      </p>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <i
      className="mr-1.5 inline-block size-2 rounded-full align-middle"
      style={{ background: color }}
    />
  );
}

function Rate({
  value,
  color,
  small,
}: {
  value: number | null;
  color: string;
  small: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${small ? "opacity-50" : ""}`}>
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
        <i
          className="block h-full rounded-full"
          style={{ width: `${value ?? 0}%`, background: color }}
        />
      </span>
      <span className="w-12 font-figures font-semibold text-foreground tabular-nums">
        {formatPercent(value)}
      </span>
    </div>
  );
}
