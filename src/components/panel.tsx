import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Tarjeta con título, subtítulo y una acción opcional: el contenedor de cada gráfico o tabla. */
export function Panel({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "min-w-0 gap-4 rounded-xl py-4 shadow-card sm:py-5",
        className,
      )}
    >
      <CardHeader className="gap-0.5 px-4 sm:px-5">
        <CardTitle className="text-[15px] tracking-tight">
          <h2>{title}</h2>
        </CardTitle>
        {subtitle && (
          <CardDescription className="text-[13px]">{subtitle}</CardDescription>
        )}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="px-4 sm:px-5">{children}</CardContent>
    </Card>
  );
}
